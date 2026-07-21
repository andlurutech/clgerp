"use client";

import { useEffect, useState, useRef } from "react";
import { fetchAPI } from "@/utils/api";
import { Html5QrcodeScanner } from "html5-qrcode";

type ScanState = "SCANNING" | "VALID" | "INVALID";

export default function VendorScannerPage() {
  const [scanState, setScanState] = useState<ScanState>("SCANNING");
  const [msg, setMsg] = useState("");
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (scanState !== "SCANNING") return;

    // Initialize scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );
    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        // Halt scanning immediately to prevent double firing on frontend
        scanner.pause(true);
        await handleScan(decodedText);
      },
      (error) => {
        // Ignore continuous scan errors
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [scanState]);

  const handleScan = async (text: string) => {
    const parts = text.split(":");
    if (parts.length !== 2) {
      setScanState("INVALID");
      setMsg("Invalid QR Format");
      return;
    }

    const [userId, totpCode] = parts;
    try {
      const result = await fetchAPI("/infrastructure/canteen/verify-meal", {
        method: "POST",
        body: JSON.stringify({ user_id: userId, totp_code: totpCode })
      });
      setScanState("VALID");
      setMsg(result.message || "Meal Deducted Successfully!");
    } catch (err: any) {
      setScanState("INVALID");
      setMsg(err.message || "Meal Rejected");
    }
  };

  const resetScanner = () => {
    setScanState("SCANNING");
    setMsg("");
  };

  if (scanState === "VALID") {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#064e3b', borderRadius: '24px', padding: '40px' }}>
        <div style={{ fontSize: '6rem', color: '#34d399', marginBottom: '24px' }}>✅</div>
        <h1 style={{ color: 'white', fontSize: '2.5rem', textAlign: 'center' }}>Meal Deducted</h1>
        <p style={{ color: '#a7f3d0', fontSize: '1.2rem', marginBottom: '40px' }}>{msg}</p>
        <button onClick={resetScanner} style={{ background: 'white', color: '#064e3b', border: 'none', padding: '16px 32px', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          Scan Next Student
        </button>
      </div>
    );
  }

  if (scanState === "INVALID") {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#7f1d1d', borderRadius: '24px', padding: '40px' }}>
        <div style={{ fontSize: '6rem', color: '#f87171', marginBottom: '24px' }}>❌</div>
        <h1 style={{ color: 'white', fontSize: '2.5rem', textAlign: 'center' }}>Scan Rejected</h1>
        <p style={{ color: '#fecaca', fontSize: '1.2rem', marginBottom: '40px' }}>{msg}</p>
        <button onClick={resetScanner} style={{ background: 'white', color: '#7f1d1d', border: 'none', padding: '16px 32px', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', height: '100%' }}>
      
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>📷</span> Vendor Scanner Portal
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
        maxWidth: '600px',
        flex: 1
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', marginBottom: '8px' }}>Scan Student QR</h2>
          <p style={{ color: '#a7a7cc' }}>Position the QR code inside the targeting box.</p>
        </div>
        
        {/* Scanner Container */}
        <div style={{ width: '100%', maxWidth: '400px', borderRadius: '16px', overflow: 'hidden', border: '4px solid rgba(255,255,255,0.1)' }}>
          <div id="reader" style={{ width: '100%' }}></div>
        </div>
      </div>

    </div>
  );
}
