// src/contexts/NotificationContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const NotificationContext = createContext();

// ✅ Hook for components to access notifications
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// ✅ Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: { 'Content-Type': 'application/json' },
  });

  // Add auth token interceptor
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const response = await api.get('/admin/notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.isRead).length);
    } catch (err) {
      // Silently handle 404 - endpoint not created yet
      if (err.response?.status === 404) {
        // Set demo notifications for testing
        setNotifications([
          {
            id: 1,
            type: 'success',
            title: 'Welcome!',
            message: 'Welcome to GradTrack System',
            isRead: false,
            createdAt: new Date().toISOString(),
            link: null
          },
          {
            id: 2,
            type: 'info',
            title: 'System Ready',
            message: 'Your dashboard is ready to use',
            isRead: false,
            createdAt: new Date().toISOString(),
            link: null
          }
        ]);
        setUnreadCount(2);
      } else {
        console.error('Failed to fetch notifications:', err);
        setNotifications([]);
        setUnreadCount(0);
      }
    }
  };

  // Add a new notification (general purpose)
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      type: notification.type || 'info',
      title: notification.title,
      message: notification.message,
      isRead: false,
      createdAt: new Date().toISOString(),
      link: notification.link || null,
      duration: notification.duration || 5000
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Auto-remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, newNotification.duration);
    }

    // Browser notification if permitted
    if (Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/notification-icon.png'
      });
    }
  };

  // Remove a notification
  const removeNotification = (id) => {
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Add a new security notification
  const addSecurityNotification = async (alert) => {
    const newNotification = {
      id: Date.now(),
      type: 'warning',
      title: alert.severity === 'high' ? '🚨 High Security Alert' : '⚠️ Security Alert',
      message: alert.message,
      isRead: false,
      createdAt: new Date().toISOString(),
      link: '/security',
      severity: alert.severity,
      source: alert.source
    };

    try {
      await api.post('/admin/notifications', newNotification);
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);

      if (Notification.permission === 'granted') {
        new Notification(newNotification.title, {
          body: newNotification.message,
          icon: '/security-icon.png'
        });
      }
    } catch (err) {
      // Silently handle 404
      if (err.response?.status !== 404) {
        console.error('Failed to save notification:', err);
      }
      // Add locally even if API fails
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    }
  };

  // Mark single notification as read
  const markAsRead = async (id) => {
    try {
      await api.put(`/admin/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      // Silently handle 404
      if (err.response?.status !== 404) {
        console.error('Failed to mark as read:', err);
      }
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.post('/admin/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      // Silently handle 404
      if (err.response?.status !== 404) {
        console.error('Failed to mark all as read:', err);
      }
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  // Clear all notifications locally
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Load notifications on mount and poll every 30s
  useEffect(() => {
    fetchNotifications();

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      addSecurityNotification,
      removeNotification,
      markAsRead,
      markAllAsRead,
      clearAllNotifications,
      fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};