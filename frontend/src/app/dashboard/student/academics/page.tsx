"use client";

import { useState } from 'react';

export default function StudentAcademicsPortal() {
  const [activeTab, setActiveTab] = useState('lms');

  return (
    <div style={{ padding: '40px', color: '#f8fafc', height: '100vh', overflowY: 'auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Academics & LMS</h1>
        <p style={{ color: '#94a3b8' }}>Access your courses, assignments, and exam results.</p>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <button 
          className="glass-button" 
          style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'lms' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }}
          onClick={() => setActiveTab('lms')}
        >Learning Management</button>
        <button 
          className="glass-button" 
          style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'exams' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }}
          onClick={() => setActiveTab('exams')}
        >Unified Grade Book</button>
        <button 
          className="glass-button" 
          style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'registration' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }}
          onClick={() => setActiveTab('registration')}
        >Course Registration (CBCS)</button>
      </div>

      {activeTab === 'lms' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>Data Structures & Algorithms</h2>
              <p style={{ margin: '0 0 15px 0', color: '#94a3b8', fontSize: '0.9rem' }}>Prof. Alan Turing | CS-201</p>
              
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Assignment 3: Graph Traversal</span>
                  <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Due in 2 days</span>
                </div>
                <button className="glass-button" style={{ marginTop: '10px', fontSize: '0.8rem', padding: '6px 12px' }}>Submit Now (Turnitin Sync)</button>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Lecture 12: Dijkstra's Algorithm</span>
                  <span style={{ color: '#10b981', fontSize: '0.8rem' }}>Viewed</span>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>Database Management Systems</h2>
              <p style={{ margin: '0 0 15px 0', color: '#94a3b8', fontSize: '0.9rem' }}>Prof. Edgar Codd | CS-203</p>
              
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Quiz: Normalization Forms</span>
                  <span style={{ color: '#f59e0b', fontSize: '0.8rem' }}>Active Now</span>
                </div>
                <button className="glass-button" style={{ marginTop: '10px', fontSize: '0.8rem', padding: '6px 12px', background: '#f59e0b' }}>Start Quiz</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'exams' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Semester 3 - Unified Grade Book</h2>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '12px 0', color: '#94a3b8' }}>Course</th>
                <th style={{ padding: '12px 0', color: '#94a3b8' }}>Credits</th>
                <th style={{ padding: '12px 0', color: '#94a3b8' }}>Internal (40)</th>
                <th style={{ padding: '12px 0', color: '#94a3b8' }}>External (60)</th>
                <th style={{ padding: '12px 0', color: '#94a3b8' }}>Total</th>
                <th style={{ padding: '12px 0', color: '#94a3b8' }}>Grade</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 0' }}>Data Structures & Algorithms</td>
                <td style={{ padding: '15px 0' }}>4</td>
                <td style={{ padding: '15px 0' }}>35</td>
                <td style={{ padding: '15px 0' }}>52</td>
                <td style={{ padding: '15px 0', fontWeight: 'bold' }}>87</td>
                <td style={{ padding: '15px 0', color: '#10b981', fontWeight: 'bold' }}>A</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '15px 0' }}>Database Management Systems</td>
                <td style={{ padding: '15px 0' }}>4</td>
                <td style={{ padding: '15px 0' }}>32</td>
                <td style={{ padding: '15px 0' }}>48</td>
                <td style={{ padding: '15px 0', fontWeight: 'bold' }}>80</td>
                <td style={{ padding: '15px 0', color: '#10b981', fontWeight: 'bold' }}>A-</td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <strong>Current SGPA: 8.92</strong>
          </div>
        </div>
      )}

      {activeTab === 'registration' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
           <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Open Elective Registration (CBCS)</h2>
           <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Atomic Seat Reservation Engine is active. Seats update in real-time.</p>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
             <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
               <h3 style={{ margin: '0 0 10px 0' }}>Introduction to Machine Learning</h3>
               <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Credits: 3 | Prof. Andrew Ng</p>
               <div style={{ margin: '15px 0', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
                 <div style={{ width: '85%', background: '#f59e0b', height: '6px' }}></div>
               </div>
               <p style={{ fontSize: '0.8rem', color: '#f59e0b', margin: '0 0 15px 0' }}>85/100 Seats Filled</p>
               <button className="glass-button" style={{ width: '100%', background: 'var(--primary-color)' }}>Lock Seat</button>
             </div>

             <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
               <h3 style={{ margin: '0 0 10px 0' }}>Blockchain Architecture</h3>
               <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Credits: 3 | Prof. Vitalik</p>
               <div style={{ margin: '15px 0', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
                 <div style={{ width: '100%', background: '#ef4444', height: '6px' }}></div>
               </div>
               <p style={{ fontSize: '0.8rem', color: '#ef4444', margin: '0 0 15px 0' }}>50/50 Seats Filled</p>
               <button className="glass-button" style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }} disabled>Join Waitlist</button>
             </div>
           </div>
        </div>
      )}

    </div>
  );
}
