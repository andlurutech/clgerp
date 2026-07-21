import os
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML

TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "templates")
env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))

async def generate_pdf(template_name: str, context: dict) -> bytes:
    """
    Renders a Jinja2 template into a PDF byte stream using WeasyPrint.
    """
    template = env.get_template(template_name)
    html_out = template.render(**context)
    
    # WeasyPrint renders synchronously, but wrapping in async provides a non-blocking API interface.
    # For high load, this could be dispatched to an executor.
    pdf_bytes = HTML(string=html_out).write_pdf()
    return pdf_bytes
