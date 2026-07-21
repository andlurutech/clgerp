"use client";

import { useState } from 'react';

export default function AdminFinanceDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{ padding: '40px', color: '#f8fafc', height: '100vh', overflowY: 'auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Finance Dashboard</h1>
        <p style={{ color: '#94a3b8' }}>Real-time reconciliation and administration.</p>
      </header>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '8px' }}>Total Revenue</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>₹45,20,000</p>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '8px' }}>Pending Dues</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>₹12,50,000</p>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '8px' }}>Pending Offline Approvals</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>14 Requests</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <button 
          className="glass-button" 
          style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'overview' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }}
          onClick={() => setActiveTab('overview')}
        >Overview</button>
        <button 
          className="glass-button" 
          style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'offline' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }}
          onClick={() => setActiveTab('offline')}
        >Offline Approvals</button>
      </div>

      {activeTab === 'overview' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Recent Transactions (Append-Only Ledger)</h2>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '12px' }}>Date</th>
                <th style={{ padding: '12px' }}>Student ID</th>
                <th style={{ padding: '12px' }}>Type</th>
                <th style={{ padding: '12px' }}>Amount</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Mock Data */}
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px' }}>Oct 24, 2023</td>
                <td style={{ padding: '12px' }}>STU-2023-001</td>
                <td style={{ padding: '12px' }}>Online (Razorpay)</td>
                <td style={{ padding: '12px', color: '#10b981' }}>+₹50,000</td>
                <td style={{ padding: '12px' }}>Success</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px' }}>Oct 24, 2023</td>
                <td style={{ padding: '12px' }}>STU-2023-042</td>
                <td style={{ padding: '12px' }}>Offline (DD)</td>
                <td style={{ padding: '12px', color: '#f59e0b' }}>+₹1,20,000</td>
                <td style={{ padding: '12px' }}>Pending Approval</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'offline' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Pending Dual-Approval Transactions</h2>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Transactions require explicit row-level locking during approval to prevent race conditions.</p>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '12px' }}>Reference</th>
                <th style={{ padding: '12px' }}>Student ID</th>
                <th style={{ padding: '12px' }}>Amount</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px' }}>DD-998231</td>
                <td style={{ padding: '12px' }}>STU-2023-042</td>
                <td style={{ padding: '12px' }}>₹1,20,000</td>
                <td style={{ padding: '12px' }}>
                  <button className="glass-button" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}>Approve</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
