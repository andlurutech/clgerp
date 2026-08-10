import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from database import Base
import models
import models_admissions
import models_finance
import models_academics
import models_lms
import models_exams
import models_hr_assets
import models_placements
import models_infrastructure
import models_community
import models_workflows
import models_drive

with open(os.path.join(os.path.dirname(__file__), '../docs/DATABASE_INVENTORY.md'), 'w') as f:
    f.write("# Database Inventory\n\n")
    f.write("| Model | Table | Tenant-owned? | Existing tenant_id? | Foreign keys | API usage |\n")
    f.write("| ----- | ----- | ------------- | ------------------- | ------------ | --------- |\n")
    
    # Iterate over all models in registry
    for class_name, cls in Base.registry._class_registry.items():
        if class_name.startswith('_'):
            continue
        table_name = getattr(cls, '__tablename__', 'N/A')
        columns = [c.name for c in cls.__table__.columns] if hasattr(cls, '__table__') else []
        fks = []
        if hasattr(cls, '__table__'):
            for c in cls.__table__.columns:
                for fk in c.foreign_keys:
                    fks.append(f"{c.name}->{fk.target_fullname}")
                    
        has_tenant = "Yes" if "tenant_id" in columns else "No"
        # Determine ownership context heuristically
        tenant_owned = "Yes" if has_tenant == "Yes" or any("user_id" in c for c in columns) else "Needs Analysis"
        
        fks_str = ", ".join(fks) if fks else "None"
        
        f.write(f"| {class_name} | {table_name} | {tenant_owned} | {has_tenant} | {fks_str} | (Requires API audit) |\n")

print("Generated docs/DATABASE_INVENTORY.md")
