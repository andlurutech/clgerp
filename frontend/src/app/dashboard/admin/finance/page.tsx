"use client";

import { useState } from 'react';

export default function AdminFinancePortal() {
  const [activeTab, setActiveTab] = useState('setup');

  return (
    <div style={{ padding: '40px', color: '#f8fafc', height: '100vh', overflowY: 'auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Finance Engine</h1>
        <p style={{ color: '#94a3b8' }}>Academic fee setup, offline reconciliation, refunds, and Tally/Zoho accounting sync.</p>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <button 
          className="glass-button" 
          style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'setup' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }}
          onClick={() => setActiveTab('setup')}
        >Academic Fee Setup</button>
        <button 
          className="glass-button" 
          style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'reconciliation' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }}
          onClick={() => setActiveTab('reconciliation')}
        >Offline Reconciliation</button>
        <button 
          className="glass-button" 
          style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'accounting' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }}
          onClick={() => setActiveTab('accounting')}
        >Accounting Sync (Tally)</button>
      </div>

      {activeTab === 'setup' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Fee Structure Configuration</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
             <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Tuition Fee (Instalment 1)</h3>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>B.Tech - General | Due: 15 Aug 2024</p>
                <h2 style={{ margin: '15px 0', color: '#f8fafc' }}>₹ 1,20,000</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="glass-button" style={{ fontSize: '0.8rem', padding: '8px' }}>Add Waiver</button>
                  <button className="glass-button" style={{ fontSize: '0.8rem', padding: '8px', background: '#ef4444' }}>Add Penalty</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'reconciliation' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Offline Payment Reconciliation</h2>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Row-level locking is enabled. Reconciling prevents race conditions.</p>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '12px 0', color: '#94a3b8' }}>Student ID</th>
                <th style={{ padding: '12px 0', color: '#94a3b8' }}>Cheque/DD Number</th>
                <th style={{ padding: '12px 0', color: '#94a3b8' }}>Amount</th>
                <th style={{ padding: '12px 0', color: '#94a3b8', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 0' }}>STD-2024-001</td>
                <td style={{ padding: '15px 0' }}>CHQ-998822 (HDFC)</td>
                <td style={{ padding: '15px 0', fontWeight: 'bold' }}>₹ 1,20,000</td>
                <td style={{ padding: '15px 0', textAlign: 'right' }}><button className="glass-button" style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto', background: '#10b981' }}>Approve & Clear</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'accounting' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Tally XML / Zoho Books Integration</h2>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#10b981' }}>Idempotent Sync Engine Online</h3>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '20px' }}>142 new transactions ready for export. No duplicate syncs detected.</p>
            <button className="glass-button" style={{ width: 'auto', background: '#10b981' }}>Generate Tally XML Payload</button>
          </div>
        </div>
      )}
    </div>
  );
}
