"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/api";
import { QRCodeSVG } from "qrcode.react";
import totpGenerator from "totp-generator";

export default function StudentCanteenPage() {
  const [data, setData] = useState<{ user_id: string; totp_secret: string; active_menu: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [totp, setTotp] = useState<string>("");
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    fetchAPI("/infrastructure/canteen/me")
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch canteen data", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!data) return;

    const updateTotp = () => {
      const epoch = Math.floor(Date.now() / 1000);
      const remaining = 30 - (epoch % 30);
      setProgress((remaining / 30) * 100);

      // Generate TOTP. totp-generator handles the current time.
      const code = totpGenerator(data.totp_secret);
      setTotp(code);
    };

    updateTotp();
    const interval = setInterval(updateTotp, 1000);
    return () => clearInterval(interval);
  }, [data]);

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>🍔</span> Canteen Access
        </h1>
      </div>

      <div style={{
        background: 'rgba(35, 35, 66, 0.7)',
        borderRadius: '32px',
        padding: '40px',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        width: '100%',
        maxWidth: '500px'
      }}>
        
        {loading ? (
          <div style={{ width: '250px', height: '250px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
        ) : data ? (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '8px' }}>Active Meal: Lunch</div>
              <div style={{ color: '#a7a7cc', fontSize: '0.9rem' }}>{data.active_menu}</div>
            </div>

            <div style={{ position: 'relative', width: '280px', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* SVG Progress Ring */}
              <svg width="280" height="280" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
                <circle
                  cx="140" cy="140" r={radius}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="140" cy="140" r={radius}
                  stroke={progress > 20 ? "#7c3aed" : "#ef4444"}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* QR Code */}
              <div style={{ 
                background: 'white', padding: '16px', borderRadius: '16px', 
                boxShadow: '0 10px 30px rgba(124, 58, 237, 0.3)',
                zIndex: 10 
              }}>
                <QRCodeSVG value={`${data.user_id}:${totp}`} size={180} />
              </div>
            </div>

            <div style={{ textAlign: 'center', color: '#a7a7cc' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '4px', color: 'white', marginBottom: '8px' }}>
                {totp.slice(0,3)} {totp.slice(3)}
              </div>
              <div style={{ fontSize: '0.8rem' }}>Scan at the counter to deduct a meal</div>
            </div>
          </>
        ) : (
          <div>Failed to load canteen data.</div>
        )}

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}} />
    </div>
  );
}
