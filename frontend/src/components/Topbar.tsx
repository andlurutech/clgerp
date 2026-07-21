"use client";

import Link from "next/link";
import styles from "./layout.module.css";
import { useNotification } from "@/contexts/NotificationContext";
import { fetchAPI } from "@/utils/api";
import { useState } from "react";

const topLinks = [
  { label: "About", href: "#" },
  { label: "Departments", href: "#" },
  { label: "Academics", href: "#" },
  { label: "Student Services", href: "#" },
];

export default function Topbar() {
  const { unreadCount, markAllAsRead, notifications } = useNotification();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleTestNotification = async () => {
    // In a real app, user_id would come from session/JWT context
    // For this mock trigger, we use a generic mock or 'me'
    // Let's decode or just pass the username from localStorage
    const username = localStorage.getItem("username") || "DEMO_USER_ID";
    try {
      await fetchAPI(`/notifications/test?user_id=${username}`, {
        method: "POST"
      });
    } catch (e) {
      console.error("Test notification failed:", e);
    }
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.topLinks}>
        {topLinks.map((link) => (
          <Link key={link.label} href={link.href} className={styles.topLink}>
            {link.label}
          </Link>
        ))}
      </div>
      <div className={styles.topControls}>
        <div className={styles.searchBar}>
          <span style={{color: '#6b7280'}}>🔍</span>
          <input 
            type="text" 
            placeholder="Search anything..." 
            className={styles.searchInput}
          />
        </div>
        
        <button 
          onClick={handleTestNotification}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '6px 12px',
            borderRadius: '8px',
            color: '#a7a7cc',
            cursor: 'pointer',
            fontSize: '0.8rem'
          }}
        >
          Test Notification
        </button>

        <div style={{ position: 'relative' }}>
          <button 
            className={styles.iconBtn} 
            onClick={() => {
              setShowDropdown(!showDropdown);
              if (unreadCount > 0) markAllAsRead();
            }}
            style={{ position: 'relative', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            🔔
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: 'white',
                fontSize: '10px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                animation: 'pulse 1.5s infinite',
                boxShadow: '0 0 8px rgba(239,68,68,0.6)'
              }}>
                {unreadCount}
              </div>
            )}
          </button>
          
          {showDropdown && notifications.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              marginTop: '10px',
              width: '300px',
              background: 'rgba(35, 35, 66, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '10px',
              zIndex: 1000,
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              maxHeight: '400px',
              overflowY: 'auto'
            }}>
              <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px', fontSize: '0.9rem' }}>Notifications</h4>
              {notifications.map((n, i) => (
                <div key={i} style={{ padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 'bold', color: n.type === 'info' ? '#3b82f6' : '#10b981' }}>{n.title}</div>
                  <div style={{ color: '#a7a7cc', margin: '4px 0' }}>{n.message}</div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{n.timestamp}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={styles.profileAvatar}>
          <span>👤</span>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}} />
    </div>
  );
}
