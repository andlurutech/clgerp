from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    institution_name: str = "Demo University"
    id_prefix: str = "DEMO"
    timezone: str = "UTC"
    database_url: str = "postgresql+asyncpg://clgerp_user:clgerp_password@localhost:5432/clgerp_db"
    redis_url: str = "redis://localhost:6379"
    active_payment_gateway: str = "Razorpay"
    
    app_env: str = "production"
    default_dev_tenant: str = ""
    
    # Feature Flags for Supplementary Integrations
    enable_turnitin: bool = False
    enable_tally_sync: bool = False
    enable_crm_sync: bool = False
    enable_koha_ils: bool = False
    enable_ivr_comms: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
