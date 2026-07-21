"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/api";

interface Submission {
  id: string;
  student_id: string;
  assessment_id: string;
  submitted_at: string;
  similarity_score: number | null;
}

export default function FacultySubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [turnitinEnabled, setTurnitinEnabled] = useState(true);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  const [scanning, setScanning] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await fetchAPI("/integrations/turnitin/submissions");
      setSubmissions(data);
    } catch (err: any) {
      if (err.message === "FEATURE_DISABLED") {
        setTurnitinEnabled(false);
      } else {
        showToast(err.message || "Failed to fetch submissions", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleScan = async (id: string) => {
    setScanning(prev => ({ ...prev, [id]: true }));
    try {
      const res = await fetchAPI("/integrations/turnitin/scan", {
        method: "POST",
        body: JSON.stringify({ submission_id: id })
      });
      showToast(`Turnitin scan started successfully!`, "success");
      
      // Optimistically update the UI to show it's scanning
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, similarity_score: -1 } : s));
    } catch (err: any) {
      showToast(err.message || "Turnitin scan failed", "error");
    } finally {
      setScanning(prev => ({ ...prev, [id]: false }));
    }
  };

  const renderBadge = (score: number | null) => {
    if (!turnitinEnabled) {
      return (
        <span style={{ background: 'rgba(156, 163, 175, 0.2)', color: '#9ca3af', padding: '6px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
          Turnitin Disabled
        </span>
      );
    }
    if (score === -1) {
       return (
        <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '6px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
          Scanning...
        </span>
      );
    }
    if (score === null) {
      return (
        <span style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#d1d5db', padding: '6px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600 }}>
          Not Scanned
        </span>
      );
    }
    
    let color = '#10b981'; // Green
    let bg = 'rgba(16, 185, 129, 0.2)';
    
    if (score >= 15 && score <= 30) {
      color = '#fbbf24'; // Yellow
      bg = 'rgba(251, 191, 36, 0.2)';
    } else if (score > 30) {
      color = '#ef4444'; // Red
      bg = 'rgba(239, 68, 68, 0.2)';
    }

    return (
      <span style={{ background: bg, color: color, padding: '6px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', width: 'fit-content' }}>
        <span>{score}% Match</span>
      </span>
    );
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
          <span>📚</span> LMS Submissions
        </h1>
      </div>

      {!turnitinEnabled && (
        <div style={{ background: 'rgba(156, 163, 175, 0.1)', border: '1px solid rgba(156, 163, 175, 0.3)', padding: '16px', borderRadius: '12px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>⚠️</span> Turnitin integration is currently disabled in the configuration. Plagiarism checks are unavailable.
        </div>
      )}

      <div style={{
        background: 'rgba(35, 35, 66, 0.7)',
        borderRadius: '24px',
        padding: '32px',
        border: '1px solid rgba(255,255,255,0.05)',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        color: '#a7a7cc',
        overflowX: 'auto'
      }}>
        
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ height: '64px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            No submissions found.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                <th style={{ padding: '16px 8px' }}>Student ID</th>
                <th style={{ padding: '16px 8px' }}>Submitted At</th>
                <th style={{ padding: '16px 8px' }}>Plagiarism Report</th>
                <th style={{ padding: '16px 8px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(sub => (
                <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px 8px', fontWeight: 600, color: 'white' }}>{sub.student_id.split("-")[0]}</td>
                  <td style={{ padding: '16px 8px' }}>{new Date(sub.submitted_at).toLocaleString()}</td>
                  <td style={{ padding: '16px 8px' }}>
                    {renderBadge(sub.similarity_score)}
                  </td>
                  <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                    {turnitinEnabled && sub.similarity_score === null && (
                      <button 
                        onClick={() => handleScan(sub.id)}
                        disabled={scanning[sub.id]}
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', border: 'none', padding: '8px 16px',
                          borderRadius: '8px', cursor: scanning[sub.id] ? 'not-allowed' : 'pointer', fontWeight: 600,
                          opacity: scanning[sub.id] ? 0.7 : 1, fontSize: '0.8rem'
                        }}>
                        {scanning[sub.id] ? "Scanning..." : "Run Turnitin Scan"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
