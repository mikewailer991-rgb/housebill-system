import React, { useEffect, useState, useRef } from 'react';
import './Notifications.css';
import { io } from 'socket.io-client';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // connect to local notification server
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('connect', () => {
      console.log('connected to notification server');
    });

    socketRef.current.on('notification', (payload) => {
      setNotifications(prev => [payload, ...prev]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const unreadCount = notifications.length;

  const toggleOpen = () => {
    setOpen(!open);
  };

  const markAllRead = () => {
    setNotifications([]);
    setOpen(false);
  };

  return (
    <div className="notifications">
      <button className="notif-bell" onClick={toggleOpen} aria-label="Notifications">
        🔔
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <strong>Notifications</strong>
            <button className="mark-read" onClick={markAllRead}>Mark all read</button>
          </div>

          <ul className="notif-list">
            {notifications.length === 0 && <li className="notif-empty">No notifications</li>}
            {notifications.map(n => (
              <li key={n.id} className="notif-item">
                <div className="notif-title">{n.title}</div>
                <div className="notif-message">{n.message}</div>
                <div className="notif-time">{new Date(n.time).toLocaleTimeString()}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
