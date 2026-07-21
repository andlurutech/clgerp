"use client";

import { useState } from 'react';

export default function AdminHRPortal() {
  const [activeTab, setActiveTab] = useState('attendance');

  return (
    <div style={{ padding: '40px', color: '#f8fafc', height: '100vh', overflowY: 'auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>HR & Assets Hub</h1>
        <p style={{ color: '#94a3b8' }}>Biometric attendance, faculty profiles, and comprehensive asset tracking.</p>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <button 
          className="glass-button" 
          style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'attendance' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }}
          onClick={() => setActiveTab('attendance')}
        >Biometric & RFID Sync</button>
        <button 
          className="glass-button" 
          style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'profiles' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }}
          onClick={() => setActiveTab('profiles')}
        >Faculty 360 Profiles</button>
        <button 
          className="glass-button" 
          style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'assets' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }}
          onClick={() => setActiveTab('assets')}
        >Asset Allocation</button>
      </div>

      {activeTab === 'attendance' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Real-time Biometric Feed</h2>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>HMAC-SHA256 signature validation is active. hardware spoofing prevented.</p>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '12px 0', color: '#94a3b8' }}>Employee</th>
                <th style={{ padding: '12px 0', color: '#94a3b8' }}>Location (Device)</th>
                <th style={{ padding: '12px 0', color: '#94a3b8' }}>Timestamp</th>
                <th style={{ padding: '12px 0', color: '#94a3b8', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 0' }}>Dr. Alan Turing</td>
                <td style={{ padding: '15px 0' }}>CS Block - Entry Gate</td>
                <td style={{ padding: '15px 0' }}>08:45 AM</td>
                <td style={{ padding: '15px 0', textAlign: 'right', color: '#10b981' }}>Punched In</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 0' }}>Prof. Edgar Codd</td>
                <td style={{ padding: '15px 0' }}>Main Admin - Biometric 2</td>
                <td style={{ padding: '15px 0' }}>09:12 AM</td>
                <td style={{ padding: '15px 0', textAlign: 'right', color: '#ef4444' }}>Late Mark</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'assets' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Asset Tracking</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
             <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>MacBook Pro 16"</h3>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Asset Tag: AST-IT-0042</p>
                <div style={{ margin: '15px 0' }}>
                  <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>Allocated to: Dr. Alan Turing</span>
                </div>
                <button className="glass-button" style={{ marginTop: '5px' }}>Process Return</button>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'profiles' && (
        <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: '#3b82f6', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>AT</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>Dr. Alan Turing</h2>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Head of Department - Computer Science</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
             <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px 25px', borderRadius: '8px' }}>
               <h3 style={{ margin: '0 0 5px 0', color: '#10b981' }}>12</h3>
               <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Leave Balance</p>
             </div>
             <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px 25px', borderRadius: '8px' }}>
               <h3 style={{ margin: '0 0 5px 0', color: '#3b82f6' }}>4</h3>
               <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Active Assets</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
