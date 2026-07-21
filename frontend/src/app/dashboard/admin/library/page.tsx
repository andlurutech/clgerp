"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/api";

interface OverdueFine {
  student_id: string;
  fine_amount: number;
  fine_id: string;
}

export default function AdminLibraryPage() {
  const [fines, setFines] = useState<OverdueFine[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  useEffect(() => {
    loadOverdueBooks();
  }, []);

  const loadOverdueBooks = async () => {
    try {
      const data = await fetchAPI("/integrations/koha/overdue");
      setFines(data);
    } catch (err: any) {
      showToast(err.message || "Failed to fetch overdue fines", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const result = await fetchAPI("/integrations/koha/sync", {
        method: "POST"
      });
      showToast(`Successfully injected ₹${result.injected_amount} in library fines across ${result.students_affected} students.`, "success");
      // Could reload, but the fines technically remain in Koha until paid
    } catch (err: any) {
      showToast(err.message || "Failed to sync Koha fines", "error");
    } finally {
      setSyncing(false);
    }
  };

  const totalFines = fines.reduce((acc, f) => acc + f.fine_amount, 0);

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
          <span>📖</span> Library Admin Dashboard
        </h1>
        <button 
          onClick={handleSync}
          disabled={syncing}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', padding: '12px 24px',
            borderRadius: '8px', cursor: syncing ? 'not-allowed' : 'pointer', fontWeight: 600,
            opacity: syncing ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
          }}>
          {syncing ? "Syncing with Koha..." : "Sync Koha Dues to Ledger"}
        </button>
      </div>

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
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Pending Fines (Koha)</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
              ₹{totalFines}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: '64px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : fines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            No overdue issued books found.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                <th style={{ padding: '16px 8px' }}>Fine Ref ID</th>
                <th style={{ padding: '16px 8px' }}>Student ID</th>
                <th style={{ padding: '16px 8px', textAlign: 'right' }}>Fine Amount</th>
              </tr>
            </thead>
            <tbody>
              {fines.map(f => (
                <tr key={f.fine_id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px 8px', fontFamily: 'monospace', color: '#9ca3af' }}>{f.fine_id}</td>
                  <td style={{ padding: '16px 8px', fontWeight: 600, color: 'white' }}>{f.student_id}</td>
                  <td style={{ padding: '16px 8px', textAlign: 'right', fontWeight: 'bold', color: '#fbbf24' }}>
                    ₹{f.fine_amount}
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
