"use client";

import { useState } from "react";
import { fetchAPI } from "@/utils/api";

export default function StudentProfilePage() {
  const [downloadingId, setDownloadingId] = useState(false);
  const [downloadingTranscript, setDownloadingTranscript] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleDownload = async (type: 'id-card' | 'transcript', setDownloading: any) => {
    setDownloading(true);
    try {
      // In a real app, 'me' maps to the authenticated user's token
      const blob = await fetchAPI(`/documents/${type}/me`, {
        method: "GET",
        responseType: "blob"
      });

      // Execute dynamic filename and programmatic download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // Get a dynamic username fallback (in a real app, from context)
      const username = localStorage.getItem("username") || "DEMO";
      
      if (type === 'id-card') {
        a.download = `ID_Card_${username}.pdf`;
      } else {
        a.download = `Transcript_${username}.pdf`;
      }
      
      document.body.appendChild(a);
      a.click();
      
      // Memory Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      showToast(`${type === 'id-card' ? 'ID Card' : 'Transcript'} downloaded successfully!`, "success");
    } catch (err: any) {
      showToast(err.message || `Failed to download ${type}`, "error");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
      
      {toast && (
        <div style={{
          position: 'absolute', top: 0, right: 0, padding: '16px 24px', 
          background: toast.type === 'success' ? '#10b981' : '#ef4444', 
          color: 'white', borderRadius: '8px', zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>👤</span> Student Profile
        </h1>
      </div>

      <div style={{
        background: 'rgba(35, 35, 66, 0.7)',
        borderRadius: '24px',
        padding: '40px',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        gap: '40px'
      }}>
        
        {/* Left Column: Avatar & Basic Info */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', minWidth: '250px' }}>
          <div style={{ 
            width: '150px', height: '150px', borderRadius: '50%', background: 'var(--primary-accent)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px', color: 'white',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            JS
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '1.4rem' }}>John Smith</h2>
            <div style={{ color: '#a7a7cc', fontSize: '0.9rem' }}>B.Tech Computer Science</div>
            <div style={{ color: 'var(--primary-accent)', fontWeight: 'bold', marginTop: '10px' }}>ID: DEMO</div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div>
            <h3 style={{ margin: '0 0 15px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Official Documents</h3>
            <p style={{ color: '#a7a7cc', marginBottom: '20px' }}>
              Download dynamically generated, cryptographically signed official documents from the university records.
            </p>
            
            <div style={{ display: 'flex', gap: '20px' }}>
              <button 
                onClick={() => handleDownload('id-card', setDownloadingId)}
                disabled={downloadingId}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white', border: 'none', padding: '14px 24px', borderRadius: '12px',
                  fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px',
                  cursor: downloadingId ? 'not-allowed' : 'pointer', opacity: downloadingId ? 0.7 : 1,
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                }}>
                <span>🪪</span> {downloadingId ? "Generating PDF..." : "Download ID Card"}
              </button>

              <button 
                onClick={() => handleDownload('transcript', setDownloadingTranscript)}
                disabled={downloadingTranscript}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white', border: 'none', padding: '14px 24px', borderRadius: '12px',
                  fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px',
                  cursor: downloadingTranscript ? 'not-allowed' : 'pointer', opacity: downloadingTranscript ? 0.7 : 1,
                  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
                }}>
                <span>📜</span> {downloadingTranscript ? "Compiling Grades..." : "Download Official Transcript"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
