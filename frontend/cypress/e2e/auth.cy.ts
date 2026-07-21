describe('Authentication Flow', () => {
  it('should securely log in and redirect to dashboard', () => {
    // Network Stubbing: Decouple from backend database
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: { access_token: 'mock_jwt_token', token_type: 'bearer' }
    }).as('loginRequest');

    // Execution
    cy.visit('/login');
    
    // Type mock credentials
    cy.get('input[type="text"]').type('demo_student');
    cy.get('input[type="password"]').type('password');
    
    // Click submit
    cy.get('button[type="submit"]').click();

    // Assertions
    cy.wait('@loginRequest');
    
    // Assert that the browser securely redirects
    cy.url().should('include', '/dashboard/student/profile');
  });
});
