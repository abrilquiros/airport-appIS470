import { useState, useEffect } from "react";
import PassengerNotifications from "./src/components/PassengerNotifications";
import BoardingNotificationPanel from "./src/components/BoardingNotificationPanel";

import { useState, useEffect } from "react";

function App() {
  const [showTransport, setShowTransport] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState("American");
  const [favoriteLocations, setFavoriteLocations] = useState([]);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [boardingNotifications, setBoardingNotifications] = useState([]);
  const [selectedFlightForNotification, setSelectedFlightForNotification] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("boarding_start");
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [sentNotifications, setSentNotifications] = useState([]);

  const notificationTypes = {
    boarding_start: { label: "Boarding Started", defaultMessage: "Boarding has begun for your flight." },
    boarding_delay: { label: "Boarding Delayed", defaultMessage: "Boarding has been delayed. Please wait for further updates." },
    gate_change: { label: "Gate Change", defaultMessage: "Your gate has been changed." },
    final_call: { label: "Final Call", defaultMessage: "Final boarding call. Please proceed to your gate immediately." },
    status_update: { label: "Status Update", defaultMessage: "Your flight status has been updated." }
  };

  const airports = ["LAX", "SAN", "JFK", "PDX", "SEA"];

  const getPassengersForFlight = (airline) => {
    const flightMapping = {
      American: boardingPasses.filter(bp => bp.airline === "American Airlines"),
      Delta: boardingPasses.filter(bp => bp.airline === "Delta Airlines"),
      United: boardingPasses.filter(bp => bp.airline === "United Airlines")
    };
    return flightMapping[airline] || [];
  };

  const sendBoardingNotification = () => {
    if (!selectedFlightForNotification) {
      alert("Please select a flight first");
      return;
    }

    const newNotification = {
      id: Date.now(),
      flight: selectedFlightForNotification,
      type: notificationType,
      message: notificationMessage || notificationTypes[notificationType].defaultMessage,
      gate: airlineFlights[selectedFlightForNotification]?.gate || "Unknown",
      boardingTime: airlineFlights[selectedFlightForNotification]?.boarding || "Unknown",
      timestamp: new Date().toLocaleTimeString(),
      sentToPassengers: getPassengersForFlight(selectedFlightForNotification)
    };

    setSentNotifications([newNotification, ...sentNotifications]);
    
    // Add to passenger notifications
    const passengers = getPassengersForFlight(selectedFlightForNotification);
    const passengerNotifications = passengers.map(passenger => ({
      id: `${newNotification.id}-${passenger.id}`,
      passengerId: passenger.id,
      passengerName: passenger.passenger,
      flight: selectedFlightForNotification,
      notification: newNotification,
      read: false
    }));
    setBoardingNotifications(prev => [...passengerNotifications, ...prev]);
    
    setNotificationMessage("");
    setNotificationType("boarding_start");
    setShowNotificationPanel(false);
    alert(`✅ Notification sent to ${passengers.length} passenger(s) on ${selectedFlightForNotification} Airlines flight!`);
  };

  const markNotificationAsRead = (notificationId) => {
    setBoardingNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

const saveFavoriteLocation = (airport) => {
    if (!favoriteLocations.includes(airport)) {
      setFavoriteLocations([...favoriteLocations, airport]);
    }
  };

  const boardingPasses = [
    {
      id: "BP-001",
      tripStatus: "Active Trip",
      passenger: "Maria Lopez",
      airline: "American Airlines",
      flight: "AA123",
      seat: "14A",
      group: "3",
      gate: "B12",
      terminal: "2",
      route: "LAX to JFK",
      date: "Today",
      boardingTime: "2:30 PM",
      departureTime: "3:10 PM",
      confirmation: "ATA8K2",
    },
    {
      id: "BP-002",
      tripStatus: "Upcoming Trip", 
      passenger: "James Smith",
      airline: "Delta Airlines",
      flight: "DL456",
      seat: "22C",
      group: "4",
      gate: "C4",
      terminal: "1",
      route: "SAN to SEA",
      date: "Tomorrow",
      boardingTime: "4:10 PM",
      departureTime: "4:55 PM",
      confirmation: "DL92QP",
    },
    {
      id: "BP-003",
      tripStatus: "Upcoming Trip",
      passenger: "Ana Garcia",
      airline: "United Airlines",
      flight: "UA789",
      seat: "9F",
      group: "2",
      gate: "A8",
      terminal: "3",
      route: "PDX to LAX",
      date: "Friday",
      boardingTime: "6:45 PM",
      departureTime: "7:20 PM",
      confirmation: "UA7N4X",
    },
  ];

const airlineFlights = {
    American: {
      flight: "AA123",
      status: "On Time",
      gate: "B12",
      terminal: "2",
      boarding: "2:30 PM",
    },
    Delta: {
      flight: "DL456",
      status: "Delayed",
      gate: "C4",
      terminal: "1",
      boarding: "4:10 PM",
    },
    United: {
      flight: "UA789",
      status: "Boarding Soon",
      gate: "A8",
      terminal: "3",
      boarding: "6:45 PM",
    },
  };

  const priceOptions = {
    Budget: "$120",
    Standard: "$280",
    Premium: "$540",
  };

  const flightInfo = airlineFlights[selectedAirline];

  // Emergency alerts setup
  useEffect(() => {
    const alerts = [
      {
        title: '🚨 SECURITY ALERT',
        message: `Security incident reported at Terminal ${flightInfo.terminal}. Authorities are responding.`,
        severity: 'high',
        recommendedAction: 'Avoid the area. Follow security personnel instructions.',
        safeArea: `Terminal ${flightInfo.terminal === '2' ? '1 or 3' : '2'}`
      },
      {
        title: '⛈️ WEATHER WARNING',
        message: 'Severe thunderstorms approaching the airport. Expect delays.',
        severity: 'high',
        recommendedAction: 'Stay inside the terminal. Avoid windows.',
        safeArea: 'Interior areas of all terminals'
      },
      {
        title: '⚠️ FLIGHT DELAY ALERT',
        message: `Your flight ${flightInfo.flight} may experience delays due to weather.`,
        severity: 'medium',
        recommendedAction: 'Stay near your gate and monitor for updates.',
        safeArea: 'Remain in your current terminal'
      }
    ];
    
    const timers = [
      setTimeout(() => { setCurrentAlert(alerts[0]); setShowAlert(true); }, 5000),
      setTimeout(() => { setCurrentAlert(alerts[1]); setShowAlert(true); }, 15000),
      setTimeout(() => { setCurrentAlert(alerts[2]); setShowAlert(true); }, 25000)
    ];


  const handleSendBoardingNotification = (notification, flight) => {
    setSentNotifications([notification, ...sentNotifications]);
    
    const passengers = boardingPasses.filter(bp => 
      (flight === "American" && bp.airline === "American Airlines") ||
      (flight === "Delta" && bp.airline === "Delta Airlines") ||
      (flight === "United" && bp.airline === "United Airlines")
    );
    
    const passengerNotifications = passengers.map(passenger => ({
      id: `${notification.id}-${passenger.id}`,
      passengerId: passenger.id,
      passengerName: passenger.passenger,
      flight: flight,
      notification: notification,
      read: false
    }));
    
    setBoardingNotifications(prev => [...passengerNotifications, ...prev]);
    alert(`✅ Notification sent to ${passengers.length} passenger(s) on ${flight} Airlines flight!`);
  };

  const handleMarkNotificationRead = (notificationId) => {
    setBoardingNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  return () => timers.forEach(timer => clearTimeout(timer));
  }, [flightInfo.flight, flightInfo.terminal]);

  const closeAlert = () => {
    setShowAlert(false);
    setCurrentAlert(null);
  };


  const handleSendBoardingNotification = (notification, flight) => {
    setSentNotifications([notification, ...sentNotifications]);
    
    const passengers = boardingPasses.filter(bp => 
      (flight === "American" && bp.airline === "American Airlines") ||
      (flight === "Delta" && bp.airline === "Delta Airlines") ||
      (flight === "United" && bp.airline === "United Airlines")
    );
    
    const passengerNotifications = passengers.map(passenger => ({
      id: `${notification.id}-${passenger.id}`,
      passengerId: passenger.id,
      passengerName: passenger.passenger,
      flight: flight,
      notification: notification,
      read: false
    }));
    
    setBoardingNotifications(prev => [...passengerNotifications, ...prev]);
    alert(`✅ Notification sent to ${passengers.length} passenger(s) on ${flight} Airlines flight!`);
  };

  const handleMarkNotificationRead = (notificationId) => {
    setBoardingNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #eef4ff, #f8fafc)",
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Emergency Alert Modal */}
      {showAlert && currentAlert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            maxWidth: '450px',
            width: '90%',
            borderTop: `5px solid ${currentAlert.severity === 'high' ? '#dc3545' : '#ffc107'}`,
          }}>
            <div style={{ padding: '24px' }}>
              <h2 style={{ margin: '0 0 16px 0' }}>{currentAlert.title}</h2>
              <p style={{ margin: '0 0 20px 0', lineHeight: '1.6' }}>{currentAlert.message}</p>
              
              <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '10px', marginBottom: '15px' }}>
                <strong>⚡ Action:</strong>
                <p style={{ margin: '8px 0 0 0' }}>{currentAlert.recommendedAction}</p>
              </div>
              
              <div style={{ backgroundColor: '#d4edda', padding: '15px', borderRadius: '10px' }}>
                <strong>🏠 Safe Area:</strong>
                <p style={{ margin: '8px 0 0 0' }}>{currentAlert.safeArea}</p>
              </div>
            </div>
            
            <div style={{ padding: '16px 24px', borderTop: '1px solid #eee' }}>
              <button onClick={closeAlert} style={{
                width: '100%',
                padding: '12px',
                backgroundColor: currentAlert.severity === 'high' ? '#dc3545' : '#ffc107',
                color: currentAlert.severity === 'high' ? 'white' : 'black',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>I Understand</button>
            </div>
          </div>
        </div>
      )}

      <h1 style={{ textAlign: "center", fontSize: "42px", marginBottom: "8px" }}>
        ✈️ Air Travel Assist
      </h1>

      <p style={{ textAlign: "center", color: "#555", marginBottom: "30px" }}>
        Quickly view flight, boarding, pricing, and airport transportation details.
      </p>

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "18px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Search Flight</h2>

        <label style={{ fontWeight: "bold" }}>Select Airline</label>
        <select
          value={selectedAirline}
          onChange={(e) => setSelectedAirline(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "18px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        >
          <option value="American">American Airlines</option>
          <option value="Delta">Delta Airlines</option>
          <option value="United">United Airlines</option>
        </select>

        <input
          type="text"
          value={flightInfo.flight}
          readOnly
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "25px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            backgroundColor: "#f8fafc",
          }}
        />

        <div
          style={{
            backgroundColor: "#f1f5f9",
            padding: "20px",
            borderRadius: "14px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Flight Information</h3>
          <p><strong>Flight:</strong> {flightInfo.flight}</p>
          <p><strong>Status:</strong> {flightInfo.status}</p>
          <p><strong>Gate:</strong> {flightInfo.gate}</p>
          <p><strong>Terminal:</strong> {flightInfo.terminal}</p>
          <p><strong>Boarding Time:</strong> {flightInfo.boarding}</p>
        </div>

        <div
          style={{
            backgroundColor: "#eff6ff",
            padding: "20px",
            borderRadius: "14px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Price Options</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={priceCardStyle}><strong>Budget</strong><br />{priceOptions.Budget}</div>
            <div style={priceCardStyle}><strong>Standard</strong><br />{priceOptions.Standard}</div>
            <div style={priceCardStyle}><strong>Premium</strong><br />{priceOptions.Premium}</div>
          </div>
        </div>

        <button
          onClick={() => setShowTransport(!showTransport)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#2563eb",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {showTransport ? "Hide Transportation Options" : "View Transportation Options"}
        </button>

        {showTransport && (
          <div
            style={{
              marginTop: "20px",
              backgroundColor: "#f8fafc",
              padding: "20px",
              borderRadius: "14px",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Transportation Options</h3>
            <ul style={{ lineHeight: "1.8" }}>
              <li>🚕 Taxi</li>
              <li>🚗 Uber / Lyft</li>
              <li>🚌 Airport Shuttle</li>
              <li>🚆 Train / Metro</li>
              <li>🚐 Rental Car Pickup</li>
            </ul>
          </div>
        )}

        <div
          style={{
            marginTop: "25px",
            backgroundColor: "#f8fafc",
            padding: "20px",
            borderRadius: "14px",
          }}
        >
          <h3>⭐ Favorite Airports</h3>

          {airports.map((airport) => (
            <button
              key={airport}
              onClick={() => saveFavoriteLocation(airport)}
              style={{
                margin: "5px",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#4f46e5",
                color: "white",
                cursor: "pointer",
              }}
            >
              Save {airport}
            </button>
          ))}

          <div style={{ marginTop: "15px" }}>
            <h4>Saved Locations:</h4>
            {favoriteLocations.length === 0 ? (
              <p>No favorite airports saved yet.</p>
            ) : (
              <ul>
                {favoriteLocations.map((airport) => (
                  <li key={airport}>✈️ {airport}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: "25px",
            backgroundColor: "#f8fafc",
            padding: "20px",
            borderRadius: "14px",
          }}
        >
          <h3>📞 Customer Support</h3>
          <p><strong>Support Phone:</strong> (800) 555-1234</p>
          <p><strong>Email:</strong> support@airtravelassist.com</p>
          <p><strong>Live Chat:</strong> Available 24/7</p>

          <textarea
            placeholder="Describe your travel issue..."
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              minHeight: "80px",
              fontFamily: "Arial, sans-serif",
            }}
          />

          <button
            style={{
              marginTop: "10px",
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#16a34a",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Submit Support Request
          </button>
        </div>
      </div>
    </div>
  );
}

const priceCardStyle = {
  flex: "1",
  minWidth: "120px",
  backgroundColor: "white",
  padding: "14px",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

export default App;
