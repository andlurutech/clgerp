"use client";

import { useState } from 'react';

export default function AdminSuperDashboard() {
  const [activeTab, setActiveTab] = useState('placements');

  return (
    <div style={{ padding: '40px', color: '#f8fafc', height: '100vh', overflowY: 'auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Super Admin Operations</h1>
        <p style={{ color: '#94a3b8' }}>Oversee Placements Pipelines and Physical Infrastructure.</p>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <button 
          className="glass-button" 
          style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'placements' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }}
          onClick={() => setActiveTab('placements')}
        >Placements Pipeline</button>
        <button 
          className="glass-button" 
          style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'hostel' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }}
          onClick={() => setActiveTab('hostel')}
        >Hostel Availability Grid</button>
      </div>

      {activeTab === 'placements' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Software Engineer - Google India</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {/* Aptitude Stage */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>Aptitude (45)</h3>
              
              <div className="glass-panel" style={{ padding: '15px', marginBottom: '10px', cursor: 'grab' }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Arjun Singh</p>
                <p style={{ margin: '0', fontSize: '0.8rem', color: '#94a3b8' }}>CGPA: 8.9 | CS</p>
              </div>
              <div className="glass-panel" style={{ padding: '15px', marginBottom: '10px', cursor: 'grab' }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Priya Patel</p>
                <p style={{ margin: '0', fontSize: '0.8rem', color: '#94a3b8' }}>CGPA: 9.2 | IT</p>
              </div>
            </div>

            {/* HR Round Stage */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>HR Round (12)</h3>
              <div className="glass-panel" style={{ padding: '15px', marginBottom: '10px', cursor: 'grab' }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Rohan Sharma</p>
                <p style={{ margin: '0', fontSize: '0.8rem', color: '#94a3b8' }}>CGPA: 8.5 | CS</p>
              </div>
            </div>

            {/* Final Round Stage */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>Final Round (4)</h3>
            </div>

            {/* Hired Stage */}
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '15px', color: '#10b981' }}>Hired (2)</h3>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hostel' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Block A (Boys) - Live Occupancy</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Room 101</h3>
              <p style={{ margin: '0', fontSize: '0.9rem' }}>4 / 4 Occupied</p>
              <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 'bold' }}>FULL</span>
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Room 102</h3>
              <p style={{ margin: '0', fontSize: '0.9rem' }}>3 / 4 Occupied</p>
              <button className="glass-button" style={{ fontSize: '0.7rem', padding: '4px', marginTop: '10px', background: '#f59e0b' }}>Allot Seat</button>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Room 103</h3>
              <p style={{ margin: '0', fontSize: '0.9rem' }}>0 / 4 Occupied</p>
              <button className="glass-button" style={{ fontSize: '0.7rem', padding: '4px', marginTop: '10px' }}>Allot Seat</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
