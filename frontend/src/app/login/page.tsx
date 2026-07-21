"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { THEME_CONFIG } from '@/config/theme';

export default function UnifiedLogin() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both ID and Password');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username_or_email: username, password })
      });

      if (!response.ok) {
        const err = await response.json().catch(()=>({}));
        setError(err.detail || 'Login failed');
        return;
      }

      const data = await response.json();
      
      if (data.detail === "2FA_REQUIRED") {
        setStep(2);
        localStorage.setItem('pre_auth_token', data.pre_auth_token);
        setError('');
      } else if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        // Simple routing based on username for now, or fetch /users/me
        if (username.toLowerCase().includes('admin')) {
          router.push('/dashboard/admin/placements/opportunities'); // default admin route
        } else {
          router.push('/dashboard/student/finance/payments'); // default student route
        }
      }
    } catch (err) {
      setError('Network error. Is the backend running?');
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const preAuthToken = localStorage.getItem('pre_auth_token');
    
    try {
      const response = await fetch('http://localhost:8000/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pre_auth_token: preAuthToken, otp })
      });

      if (!response.ok) {
        const err = await response.json().catch(()=>({}));
        setError(err.detail || 'Invalid OTP');
        return;
      }

      const data = await response.json();
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        router.push('/dashboard/admin/placements/opportunities');
      }
    } catch (err) {
      setError('Network error verifying OTP.');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      color: '#fff',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div className="glass-panel" style={{ 
        width: '100%', 
        maxWidth: '450px', 
        padding: '40px', 
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          {THEME_CONFIG.logoUrl && THEME_CONFIG.logoUrl !== "/logo.png" ? (
             <img src={THEME_CONFIG.logoUrl} alt="Logo" style={{ width: '60px', height: '60px', margin: '0 auto 20px auto', borderRadius: '16px' }} />
          ) : (
            <div style={{ 
              width: '60px', 
              height: '60px', 
              background: THEME_CONFIG.primaryAccentColor, 
              borderRadius: '16px', 
              margin: '0 auto 20px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>{THEME_CONFIG.logoText}</div>
          )}
          <h1 style={{ margin: '0 0 10px 0', fontSize: '1.8rem' }}>{THEME_CONFIG.institutionName}</h1>
          <p style={{ margin: '0', color: '#94a3b8' }}>Zero-Trust Unified Authentication</p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.2)', 
            border: '1px solid #ef4444', 
            color: '#fca5a5', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            fontSize: '0.9rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleInitialSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>University ID</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  background: 'rgba(0,0,0,0.2)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '8px',
                  color: '#fff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }} 
                placeholder="e.g. demo_student"
              />
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  background: 'rgba(0,0,0,0.2)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '8px',
                  color: '#fff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                placeholder="e.g. password123"
              />
            </div>

            <button type="submit" style={{ 
              width: '100%', 
              padding: '14px', 
              background: 'var(--primary-color, #10b981)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              Authenticate
            </button>
          </form>
        ) : (
          <form onSubmit={handle2FASubmit}>
             <div style={{ marginBottom: '30px', textAlign: 'center' }}>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5' }}>
                We've sent a Twilio SMS verification code to the registered mobile number ending in **456.
              </p>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#cbd5e1', textAlign: 'center' }}>6-Digit OTP</label>
              <input 
                type="text" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  background: 'rgba(0,0,0,0.2)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '8px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '1.5rem',
                  letterSpacing: '8px',
                  textAlign: 'center',
                  boxSizing: 'border-box'
                }}
                placeholder="123456"
                maxLength={6}
              />
            </div>

            <button type="submit" style={{ 
              width: '100%', 
              padding: '14px', 
              background: 'var(--primary-color, #10b981)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Verify & Login
            </button>
            <button type="button" onClick={() => setStep(1)} style={{ 
              width: '100%', 
              padding: '14px', 
              background: 'transparent', 
              color: '#94a3b8', 
              border: 'none', 
              marginTop: '10px',
              cursor: 'pointer'
            }}>
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
