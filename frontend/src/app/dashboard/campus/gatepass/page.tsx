"use client";

export default function GatePassManagementPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>🚪</span> Gate Pass Management
        </h1>
        <button style={{
          background: '#7c3aed', color: 'white', border: 'none', padding: '10px 20px',
          borderRadius: '8px', cursor: 'pointer', fontWeight: 600
        }}>
          + New Action
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{
        background: 'rgba(35, 35, 66, 0.7)',
        borderRadius: '24px',
        padding: '32px',
        border: '1px solid rgba(255,255,255,0.05)',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#a7a7cc'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.5 }}>🚪</div>
        <h2 style={{ color: 'white', marginBottom: '8px' }}>Module Activated</h2>
        <p style={{ maxWidth: '400px', textAlign: 'center', lineHeight: '1.5' }}>
          The <strong>Gate Pass Management</strong> module frontend has been successfully scaffolded. 
          It is ready to be connected to the backend database in Phase 2.
        </p>
      </div>
      
    </div>
  );
}
