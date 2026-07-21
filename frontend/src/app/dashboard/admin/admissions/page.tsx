"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/api";

interface AdmissionLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  stage: string;
  counselor_name: string | null;
  created_at: string;
}

const STAGES = [
  "New", 
  "Document Verification Pending", 
  "Fee Paid", 
  "Enrolled", 
  "Rejected"
];

export default function AdmissionsDashboard() {
  const [leads, setLeads] = useState<AdmissionLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await fetchAPI("/admissions/applications");
      setLeads(data);
    } catch (err: any) {
      showToast(err.message || "Failed to fetch leads", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSyncCRM = async () => {
    setSyncing(true);
    try {
      const result = await fetchAPI("/admissions/sync", { method: "POST" });
      showToast(`Successfully synced ${result.synced_count} leads from CRM`, "success");
      loadLeads();
    } catch (err: any) {
      showToast(err.message || "Sync failed", "error");
    } finally {
      setSyncing(false);
    }
  };

  const handleStageChange = async (id: string, newStage: string) => {
    const originalLeads = [...leads];
    // Optimistic Update
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage: newStage } : l));

    try {
      await fetchAPI(`/admissions/applications/${id}/stage`, {
        method: 'PUT',
        body: JSON.stringify({ stage: newStage })
      });
      showToast(`Stage updated to ${newStage}`, "success");
    } catch (err: any) {
      // Rollback
      setLeads(originalLeads);
      showToast(err.message || "Failed to update stage", "error");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
      
      {/* Toast Notification */}
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

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>📝</span> Admissions CRM Dashboard
        </h1>
        <button 
          onClick={handleSyncCRM} 
          disabled={syncing}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', padding: '12px 24px',
            borderRadius: '8px', cursor: syncing ? 'not-allowed' : 'pointer', fontWeight: 600,
            opacity: syncing ? 0.7 : 1, boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
          {syncing ? (
            <>
              <div style={{ 
                width: '16px', height: '16px', border: '2px solid white', 
                borderTop: '2px solid transparent', borderRadius: '50%', 
                animation: 'spin 1s linear infinite' 
              }} />
              Syncing...
            </>
          ) : "Sync External CRM"}
        </button>
      </div>

      {/* Main Content Area */}
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
            {/* Skeleton Loader */}
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ height: '64px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '3rem', opacity: 0.5 }}>📥</div>
            <div>No leads found. Click "Sync External CRM" to fetch leads.</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                <th style={{ padding: '16px 8px' }}>Name</th>
                <th style={{ padding: '16px 8px' }}>Contact Info</th>
                <th style={{ padding: '16px 8px' }}>Source</th>
                <th style={{ padding: '16px 8px' }}>Assigned Counselor</th>
                <th style={{ padding: '16px 8px', width: '250px' }}>Current Stage</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px 8px', fontWeight: 600, color: 'white' }}>{lead.name}</td>
                  <td style={{ padding: '16px 8px' }}>
                    <div>{lead.email}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{lead.phone}</div>
                  </td>
                  <td style={{ padding: '16px 8px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem',
                      background: 'rgba(255,255,255,0.1)' 
                    }}>
                      {lead.source}
                    </span>
                  </td>
                  <td style={{ padding: '16px 8px' }}>{lead.counselor_name || '-'}</td>
                  <td style={{ padding: '16px 8px' }}>
                    <select 
                      value={lead.stage}
                      onChange={(e) => handleStageChange(lead.id, e.target.value)}
                      style={{
                        background: 'rgba(0,0,0,0.3)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        width: '100%',
                        cursor: 'pointer'
                      }}
                    >
                      {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
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
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
