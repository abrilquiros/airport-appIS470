import React from 'react';

const PassengerNotifications = ({ notifications, onMarkRead }) => {
  if (notifications.length === 0) {
    return (
      <div style={styles.container}>
        <h3 style={styles.title}>🔔 Boarding Notifications</h3>
        <p style={styles.emptyMessage}>No notifications yet. Staff will notify you when boarding begins.</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>🔔 Boarding Notifications</h3>
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount} new</span>
        )}
      </div>
      
      <div style={styles.list}>
        {notifications.map(notification => (
          <div
            key={notification.id}
            onClick={() => onMarkRead(notification.id)}
            style={{
              ...styles.notification,
              backgroundColor: notification.read ? "#f8fafc" : "#fff7ed",
              borderLeft: notification.read ? "3px solid #cbd5e1" : "3px solid #f59e0b",
            }}
          >
            <div style={styles.notificationHeader}>
              <strong style={styles.notificationType}>
                {notification.notification.type === "boarding_start" && "🟢 "}
                {notification.notification.type === "boarding_delay" && "🟠 "}
                {notification.notification.type === "gate_change" && "🚪 "}
                {notification.notification.type === "final_call" && "🔴 "}
                {notification.notification.type === "boarding_start" && "Boarding Started"}
                {notification.notification.type === "boarding_delay" && "Boarding Delayed"}
                {notification.notification.type === "gate_change" && "Gate Change"}
                {notification.notification.type === "final_call" && "Final Call"}
              </strong>
              <span style={styles.timestamp}>{notification.notification.timestamp}</span>
            </div>
            
            <p style={styles.message}>{notification.notification.message}</p>
            
            <div style={styles.details}>
              <span>✈️ {notification.flight}</span>
              <span>🚪 Gate: {notification.notification.gate}</span>
              <span>⏰ Boarding: {notification.notification.boardingTime}</span>
            </div>
            
            {!notification.read && <div style={styles.newBadge}>New</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#fffbeb",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "20px",
    border: "1px solid #fde68a",
    position: "relative",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  title: {
    margin: 0,
    color: "#0f172a",
    fontSize: "18px",
  },
  badge: {
    backgroundColor: "#ef4444",
    color: "white",
    borderRadius: "999px",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#6b7280",
    padding: "30px",
    margin: 0,
  },
  list: {
    maxHeight: "400px",
    overflowY: "auto",
  },
  notification: {
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "12px",
    cursor: "pointer",
    position: "relative",
    border: "1px solid #e2e8f0",
    transition: "all 0.2s",
  },
  notificationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  notificationType: {
    fontSize: "14px",
  },
  timestamp: {
    fontSize: "11px",
    color: "#6b7280",
  },
  message: {
    margin: "8px 0",
    fontSize: "14px",
    color: "#374151",
    lineHeight: "1.5",
  },
  details: {
    display: "flex",
    gap: "12px",
    fontSize: "12px",
    color: "#6b7280",
    marginTop: "8px",
    flexWrap: "wrap",
  },
  newBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    backgroundColor: "#f59e0b",
    color: "white",
    borderRadius: "4px",
    padding: "2px 8px",
    fontSize: "10px",
    fontWeight: "bold",
  },
};

export default PassengerNotifications;
