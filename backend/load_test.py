from locust import HttpUser, task, between

class StudentUser(HttpUser):
    # Simulate realistic wait times between 1 and 5 seconds
    wait_time = between(1, 5)

    @task(3)
    def visit_unified_login(self):
        """Simulate hitting the Unified Login endpoint."""
        self.client.post("/login", json={"username_or_email": "demo_student", "password": "password"})

    @task(2)
    def fetch_student_finance_portal(self):
        """Simulate fetching the Student Finance Portal data."""
        self.client.get("/finance/payments/initiate") # Or other relevant endpoints representing the portal load
        
    @task(5)
    def pull_campus_social_network_feed(self):
        """Simulate pulling the Campus Social Network feed (heavy read)."""
        self.client.get("/community/feed")
        
# To run this script simulating 50,000 users:
# locust -f load_test.py --host=http://localhost:8000 --users 50000 --spawn-rate 500
