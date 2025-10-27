import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

const NotificationItem = ({ notification, onRemove }) => {
  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          container: 'border-l-4 border-green-400 bg-green-50',
          text: 'text-green-800',
          icon: '✅'
        };
      case 'error':
        return {
          container: 'border-l-4 border-red-400 bg-red-50',
          text: 'text-red-800',
          icon: '❌'
        };
      case 'warning':
        return {
          container: 'border-l-4 border-yellow-400 bg-yellow-50',
          text: 'text-yellow-800',
          icon: '⚠️'
        };
      default:
        return {
          container: 'border-l-4 border-blue-400 bg-blue-50',
          text: 'text-blue-800',
          icon: 'ℹ️'
        };
    }
  };

  const styles = getTypeStyles(notification.type);

  return (
    <div className={`p-4 rounded-lg shadow-md ${styles.container} animate-slideUp`}>
      <div className="flex items-start">
        <span className="mr-3 text-lg">{styles.icon}</span>
        <div className="flex-1">
          <p className={`font-medium ${styles.text}`}>{notification.message}</p>
        </div>
        <button
          onClick={() => onRemove(notification.id)}
          className={`ml-4 ${styles.text} hover:opacity-70 transition-opacity`}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now().toString();
    
    const notification = {
      id,
      message,
      type,
      timestamp: Date.now()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    showNotification,
    removeNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Notification Container */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRemove={removeNotification}
            />
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
};