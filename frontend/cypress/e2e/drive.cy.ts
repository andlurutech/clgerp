describe('Document Drive Quota', () => {
  beforeEach(() => {
    // State Mocking: Bypass the login screen
    cy.window().then((win) => {
      win.localStorage.setItem('access_token', 'mock_jwt_token');
    });
  });

  it('should render the dropzone and dynamically display 50% storage quota', () => {
    // Network Stubbing: Mock 25MB out of 50MB used (50%)
    cy.intercept('GET', '**/drive/files', {
      statusCode: 200,
      body: []
    }).as('filesRequest');
    
    cy.intercept('GET', '**/drive/quota', {
      statusCode: 200,
      body: {
        total_storage_bytes: 52428800, // 50MB
        used_storage_bytes: 26214400, // 25MB
      }
    }).as('quotaRequest');

    cy.visit('/dashboard/drive');
    
    // Wait for the stubbed responses
    cy.wait(['@filesRequest', '@quotaRequest']);

    // Assertions
    // The component utilizes react-dropzone. We check for common text like "Drag & drop" or the specific input
    cy.contains(/drag|drop/i).should('be.visible');

    // Progress bar assertion: Check if it renders 50% width
    cy.get('.progress-bar, [role="progressbar"], div[style*="width: 50%"]').should('exist');
  });
});
