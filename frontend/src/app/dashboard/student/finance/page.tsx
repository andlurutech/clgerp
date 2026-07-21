"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/utils/api";

interface LedgerEntry {
  id: string;
  transaction_type: "Charge" | "Payment";
  amount: number;
  description: string;
  created_at: string;
  gateway_transaction_id: string | null;
}

export default function StudentFinancePage() {
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  useEffect(() => {
    loadLedger();
  }, []);

  const loadLedger = async () => {
    try {
      const data = await fetchAPI("/finance/ledger");
      setLedger(data);
    } catch (err: any) {
      showToast(err.message || "Failed to fetch ledger", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handlePayment = async () => {
    setPaying(true);
    try {
      const result = await fetchAPI("/finance/pay", {
        method: "POST",
        body: JSON.stringify({ amount: 500, description: "Semester Fee Installment" })
      });
      showToast(`Payment Successful! Txn: ${result.transaction_id}`, "success");
      loadLedger(); // Refresh ledger
    } catch (err: any) {
      showToast(err.message || "Payment processing failed", "error");
    } finally {
      setPaying(false);
    }
  };

  const balance = ledger.reduce((acc, row) => {
    return row.transaction_type === "Charge" ? acc + row.amount : acc - row.amount;
  }, 0);

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
          <span>💳</span> Student Finance Portal
        </h1>
        <button 
          onClick={handlePayment} 
          disabled={paying}
          style={{
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', border: 'none', padding: '12px 24px',
            borderRadius: '8px', cursor: paying ? 'not-allowed' : 'pointer', fontWeight: 600,
            opacity: paying ? 0.7 : 1, boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)'
          }}>
          {paying ? "Processing Securely..." : "Pay ₹500 Now"}
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
        color: '#a7a7cc'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <div style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Outstanding</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: balance > 0 ? '#ef4444' : '#10b981' }}>
              ₹{Math.max(0, balance)}
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Skeleton Loader */}
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : ledger.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>No transactions found in your ledger.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '16px 8px' }}>Date</th>
                <th style={{ padding: '16px 8px' }}>Description</th>
                <th style={{ padding: '16px 8px' }}>Type</th>
                <th style={{ padding: '16px 8px' }}>Gateway Txn</th>
                <th style={{ padding: '16px 8px', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px 8px' }}>{new Date(row.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 8px', color: 'white' }}>{row.description}</td>
                  <td style={{ padding: '16px 8px' }}>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem',
                      background: row.transaction_type === 'Charge' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: row.transaction_type === 'Charge' ? '#f87171' : '#34d399'
                    }}>
                      {row.transaction_type}
                    </span>
                  </td>
                  <td style={{ padding: '16px 8px', fontSize: '0.9rem', fontFamily: 'monospace' }}>{row.gateway_transaction_id || '-'}</td>
                  <td style={{ padding: '16px 8px', textAlign: 'right', fontWeight: 'bold', color: row.transaction_type === 'Charge' ? '#f87171' : '#34d399' }}>
                    {row.transaction_type === 'Charge' ? '-' : '+'}₹{row.amount}
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
