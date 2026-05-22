import React, { useState } from 'react';

const BoardingNotificationPanel = ({ 
  selectedAirline, 
  airlineFlights, 
  boardingPasses,
  onSendNotification 
}) => {
  const [selectedFlight, setSelectedFlight] = useState("");
  const [message, setMessage] = useState("");
  const [notificationType, setNotificationType] = useState("boarding_start");
  const [showForm, setShowForm] = useState(false);

  const notificationTypes = {
    boarding_start: { label: "🟢 Boarding Started", defaultMessage: "Boarding has begun for your flight. Please proceed to your gate." },
    boarding_delay: { label: "🟠 Boarding Delayed", defaultMessage: "Boarding has been delayed. Please wait for further updates." },
    gate_change: { label: "🚪 Gate Change", defaultMessage: "Your gate has been changed." },
    final_call: { label: "🔴 Final Call", defaultMessage: "Final boarding call. Please proceed to your gate immediately." },
  };

  const handleSend = () => {
    if (!selectedFlight) {
      alert("Please select a flight");
      return;
    }

    const notification = {
      id: Date.now(),
      flight: selectedFlight,
      type: notificationType,
      message: message || notificationTypes[notificationType].defaultMessage,
      gate: airlineFlights[selectedFlight]?.gate || "Unknown",
      boardingTime: airlineFlights[selectedFlight]?.boarding || "Unknown",
      timestamp: new Date().toLocaleTimeString(),
    };

    onSendNotification(notification, selectedFlight);
    
    // Reset form
    setMessage("");
    setNotificationType("boarding_start");
    setSelectedFlight("");
    setShowForm(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📢 Boarding Notifications</h3>
        <button onClick={() => setShowForm(!showForm)} style={styles.toggleButton}>
          {showForm ? "−" : "+"}
        </button>
      </div>

      {showForm && (
        <div>
          <select 
            value={selectedFlight}
            onChange={(e) => setSelectedFlight(e.target.value)}
            style={styles.select}
          >
            <option value="">Select Flight</option>
            <option value="American">American Airlines - AA123 (LAX→JFK)</option>
            <option value="Delta">Delta Airlines - DL456 (SAN→SEA)</option>
            <option value="United">United Airlines - UA789 (PDX→LAX)</option>
          </select>

          <select
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
            style={styles.select}
          >
            {Object.entries(notificationTypes).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>

          <textarea
            placeholder="Custom message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.textarea}
            rows="3"
          />

          <button onClick={handleSend} style={styles.sendButton}>
            Send Notification
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#f0f9ff",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "20px",
    border: "1px solid #bae6fd",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  title: {
    margin: 0,
    color: "#0f172a",
    fontSize: "18px",
  },
  toggleButton: {
    backgroundColor: "#0284c7",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    fontSize: "20px",
    cursor: "pointer",
  },
  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontFamily: "inherit",
    fontSize: "14px",
  },
  sendButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#059669",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
};

export default BoardingNotificationPanel;
