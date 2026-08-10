"use client";

import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { fetchAPI } from "@/utils/api";
import { FaFilePdf, FaFileWord, FaFileImage, FaFileAlt, FaCloudUploadAlt } from "react-icons/fa";

interface DriveFile {
  id: string;
  name: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

interface Quota {
  used_bytes: number;
  total_bytes: number;
}

export default function DrivePage() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [quota, setQuota] = useState<Quota | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  const loadData = async () => {
    try {
      const data = await fetchAPI("/drive/files");
      setFiles(data.files);
      setQuota(data.quota);
    } catch (err: any) {
      showToast(err.message || "Failed to load drive data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string, type: 'success'|'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    const file = acceptedFiles[0];
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetchAPI("/drive/upload", {
        method: "POST",
        body: formData
      });
      showToast("File uploaded successfully", "success");
      loadData(); // Refresh list and quota
    } catch (err: any) {
      showToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    }
  });

  const getFileIcon = (mime: string) => {
    if (mime.includes('pdf')) return <FaFilePdf size={40} color="#ef4444" />;
    if (mime.includes('word')) return <FaFileWord size={40} color="#3b82f6" />;
    if (mime.includes('image')) return <FaFileImage size={40} color="#10b981" />;
    return <FaFileAlt size={40} color="#9ca3af" />;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const quotaPercentage = quota ? Math.min((quota.used_bytes / quota.total_bytes) * 100, 100) : 0;
  const isOverQuota = quotaPercentage >= 100;

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
          <span>☁️</span> Personal Drive
        </h1>
      </div>

      {/* Quota Bar */}
      {quota && (
        <div style={{ background: 'rgba(35, 35, 66, 0.7)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
            <span>Storage Quota</span>
            <span style={{ color: isOverQuota ? '#ef4444' : '#a7a7cc' }}>
              {formatBytes(quota.used_bytes)} / {formatBytes(quota.total_bytes)}
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: `${quotaPercentage}%`, 
              background: isOverQuota ? '#ef4444' : 'linear-gradient(90deg, #3b82f6, #10b981)',
              transition: 'width 0.5s ease-in-out'
            }} />
          </div>
        </div>
      )}

      {/* Dropzone */}
      <div 
        {...getRootProps()} 
        style={{
          border: `2px dashed ${isDragActive ? '#10b981' : 'rgba(255,255,255,0.2)'}`,
          borderRadius: '24px',
          padding: '60px 20px',
          textAlign: 'center',
          background: isDragActive ? 'rgba(16, 185, 129, 0.05)' : 'rgba(35, 35, 66, 0.4)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          opacity: uploading ? 0.5 : 1,
          pointerEvents: uploading ? 'none' : 'auto'
        }}
      >
        <input {...getInputProps()} />
        <FaCloudUploadAlt size={48} color={isDragActive ? '#10b981' : '#6b7280'} />
        <div>
          {uploading ? (
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: '#3b82f6' }}>Uploading...</p>
          ) : isDragActive ? (
            <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: '#10b981' }}>Drop the file here...</p>
          ) : (
            <>
              <p style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 600 }}>Drag & drop a file here, or click to select</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#9ca3af' }}>Supported: PDF, DOCX, JPG, PNG (Max 50MB)</p>
            </>
          )}
        </div>
      </div>

      {/* File Grid */}
      <div style={{
        background: 'rgba(35, 35, 66, 0.7)',
        borderRadius: '24px',
        padding: '32px',
        border: '1px solid rgba(255,255,255,0.05)',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '1.2rem' }}>My Files</h2>
        
        {loading ? (
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ width: '200px', height: '220px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : files.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca3af' }}>
            No files uploaded yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
            {files.map(file => (
              <div key={file.id} style={{ 
                background: 'rgba(0,0,0,0.2)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                textAlign: 'center',
                transition: 'transform 0.2s, background 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
              >
                {getFileIcon(file.mime_type)}
                <div style={{ width: '100%' }}>
                  <div style={{ 
                    fontWeight: 600, 
                    fontSize: '0.9rem', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    marginBottom: '4px'
                  }} title={file.name}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    {formatBytes(file.file_size)}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
