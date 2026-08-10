import os
import sys
import glob
import importlib

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from database import Base

backend_dir = os.path.dirname(__file__)
model_files = glob.glob(os.path.join(backend_dir, "../backend/models_*.py"))
for file_path in model_files:
    module_name = os.path.basename(file_path)[:-3]
    importlib.import_module(module_name)
    
import models

tables = Base.metadata.tables
print(f"Table count: {len(tables)}")
print(f"Tables: {', '.join(tables.keys())}")
