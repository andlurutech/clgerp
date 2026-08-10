import os
import re

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend'))

model_files = [f for f in os.listdir(backend_dir) if f.startswith('models_') and f.endswith('.py')]
# Exclude models.py because Tenant, Role, User are there and handled.

tenant_id_line = '    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=True, index=True)\n'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    new_lines = []
    in_org_class = False
    
    for line in lines:
        if line.startswith('class Organization(Base):'):
            in_org_class = True
        elif line.startswith('class ') and '(Base):' in line:
            in_org_class = False
            
        new_lines.append(line)
        
        # Add tenant_id after id = Column(...) if not in Organization
        if 'id = Column(' in line and 'primary_key=True' in line:
            if not in_org_class:
                # Check if tenant_id is already there in the next lines
                new_lines.append(tenant_id_line)
                
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)

for filename in model_files:
    process_file(os.path.join(backend_dir, filename))

print("Added tenant_id to all relevant models.")
