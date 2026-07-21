"use client";

import { useState } from 'react';

export default function FacultyPortal() {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div style={{ padding: '40px', color: '#f8fafc', height: '100vh', overflowY: 'auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Faculty Portal</h1>
        <p style={{ color: '#94a3b8' }}>Manage courses, question banks, and evaluate submissions with strict row-level isolation.</p>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <button 
          className="glass-button" 
          style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'courses' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }}
          onClick={() => setActiveTab('courses')}
        >My Courses</button>
        <button 
          className="glass-button" 
          style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'qbank' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }}
          onClick={() => setActiveTab('qbank')}
        >Question Bank Builder</button>
        <button 
          className="glass-button" 
          style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'grading' ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)' }}
          onClick={() => setActiveTab('grading')}
        >Anonymous Grading</button>
      </div>

      {activeTab === 'courses' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Assigned Class Cohorts (Fall 2024)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>CS301 - Operating Systems (Sec A)</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '15px' }}>60 Students Enrolled</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="glass-button" style={{ fontSize: '0.8rem', padding: '8px' }}>Upload Content</button>
                <button className="glass-button" style={{ fontSize: '0.8rem', padding: '8px', background: 'rgba(255,255,255,0.1)' }}>Create Assessment</button>
              </div>
            </div>
            
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>CS402 - Machine Learning (Sec B)</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '15px' }}>45 Students Enrolled</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="glass-button" style={{ fontSize: '0.8rem', padding: '8px' }}>Upload Content</button>
                <button className="glass-button" style={{ fontSize: '0.8rem', padding: '8px', background: 'rgba(255,255,255,0.1)' }}>Create Assessment</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'qbank' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Dynamic Question Bank Generator</h2>
          <form className="fade-in">
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Course</label>
              <select className="glass-input">
                <option value="CS301">CS301 - Operating Systems</option>
                <option value="CS402">CS402 - Machine Learning</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Question Type</label>
                <select className="glass-input">
                  <option>Multiple Choice (MCQ)</option>
                  <option>Fill in the Blanks (FIB)</option>
                  <option>Subjective</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Bloom's Taxonomy (BT)</label>
                <select className="glass-input">
                  <option>L1 - Remember</option>
                  <option>L2 - Understand</option>
                  <option>L3 - Apply</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Course Outcome (CO)</label>
                <select className="glass-input">
                  <option>CO1</option>
                  <option>CO2</option>
                  <option>CO3</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Question Content</label>
              <textarea className="glass-input" rows={4} placeholder="Type your question here..."></textarea>
            </div>
            
            <button className="glass-button" style={{ width: '200px' }} type="button">Add to Bank</button>
          </form>
        </div>
      )}

      {activeTab === 'grading' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Answer Sheet Masking (Anonymous Evaluation)</h2>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Student identities are masked with evaluation tokens to ensure unbiased grading.</p>
          
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '12px' }}>Evaluation Token</th>
                <th style={{ padding: '12px' }}>Assessment</th>
                <th style={{ padding: '12px' }}>Submitted At</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px', fontFamily: 'monospace', letterSpacing: '2px' }}>TKN-A94F-B21</td>
                <td style={{ padding: '12px' }}>Midterm Exam (CS301)</td>
                <td style={{ padding: '12px' }}>Oct 20, 2023 10:15 AM</td>
                <td style={{ padding: '12px' }}>
                  <button className="glass-button" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}>Grade via Rubric</button>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px', fontFamily: 'monospace', letterSpacing: '2px' }}>TKN-C82D-E77</td>
                <td style={{ padding: '12px' }}>Midterm Exam (CS301)</td>
                <td style={{ padding: '12px' }}>Oct 20, 2023 10:22 AM</td>
                <td style={{ padding: '12px' }}>
                  <button className="glass-button" style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}>Grade via Rubric</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
