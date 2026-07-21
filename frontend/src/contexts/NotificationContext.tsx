"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  timestamp: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    let socket: WebSocket | null = null;
    let isComponentMounted = true;

    const connectWebSocket = () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = process.env.NEXT_PUBLIC_API_URL 
        ? process.env.NEXT_PUBLIC_API_URL.replace(/^https?:\/\//, '')
        : 'localhost:8000';
      
      const wsUrl = `${wsProtocol}//${wsHost}/ws/notifications?token=${token}`;
      
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("WebSocket connected.");
        reconnectAttemptsRef.current = 0; // reset on success
      };

      socket.onmessage = (event) => {
        try {
          const newNotification: Notification = JSON.parse(event.data);
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
        } catch (err) {
          console.error("Failed to parse notification payload", err);
        }
      };

      socket.onclose = (event) => {
        if (!isComponentMounted) return; // Ignore if unmounting
        
        console.log("WebSocket disconnected.", event.code);
        if (event.code !== 1008 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          // 1008 means auth failed (invalid token). Don't auto-reconnect on auth failure.
          const timeout = Math.pow(2, reconnectAttemptsRef.current) * 1000;
          console.log(`Reconnecting in ${timeout}ms...`);
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, timeout);
          reconnectAttemptsRef.current += 1;
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket Error: ", error);
        // socket.onclose will be called after this
      };
    };

    connectWebSocket();

    // State Cleanup - Ensure no zombie socket on hot reload
    return () => {
      isComponentMounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
