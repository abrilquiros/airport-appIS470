import { useState, useEffect } from "react";
import PassengerNotifications from "./components/PassengerNotifications";
import BoardingNotificationPanel from "./components/BoardingNotificationPanel";

const AVIATIONSTACK_API_KEY = process.env.REACT_APP_AVIATIONSTACK_API_KEY;
const REFRESH_INTERVAL_MS = 60000;

const demoLiveFlights = {
  American: {
    flight: "AA123",
    status: "On Time",
    gate: "B12",
    terminal: "2",
    boarding: "2:30 PM",
    delay: "No delay reported",
    departureAirport: "Los Angeles International Airport",
    arrivalAirport: "John F. Kennedy International Airport",
    updatedBy: "Demo fallback data",
  },
  Delta: {
    flight: "DL456",
    status: "Delayed",
    gate: "C4",
    terminal: "1",
    boarding: "4:10 PM",
    delay: "25 minutes",
    departureAirport: "San Diego International Airport",
    arrivalAirport: "Seattle-Tacoma International Airport",
    updatedBy: "Demo fallback data",
  },
  United: {
    flight: "UA789",
    status: "Boarding Soon",
    gate: "A8",
    terminal: "3",
    boarding: "6:45 PM",
    delay: "No delay reported",
    departureAirport: "Portland International Airport",
    arrivalAirport: "Los Angeles International Airport",
    updatedBy: "Demo fallback data",
  },
};

function App() {
  const [showTransport, setShowTransport] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState("American");
  const [favoriteLocations, setFavoriteLocations] = useState([]);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  
  // Boarding notification states
  const [boardingNotifications, setBoardingNotifications] = useState([]);
  const [selectedFlightForNotification, setSelectedFlightForNotification] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("boarding_start");
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [sentNotifications, setSentNotifications] = useState([]);
  
  // Flight tracking states
  const [liveFlightData, setLiveFlightData] = useState(demoLiveFlights.American);
  const [isLoadingLiveData, setIsLoadingLiveData] = useState(false);
  const [apiError, setApiError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const notificationTypes = {
    boarding_start: { label: "Boarding Started", defaultMessage: "Boarding has begun for your flight." },
    boarding_delay: { label: "Boarding Delayed", defaultMessage: "Boarding has been delayed. Please wait for further updates." },
    gate_change: { label: "Gate Change", defaultMessage: "Your gate has been changed." },
    final_call: { label: "Final Call", defaultMessage: "Final boarding call. Please proceed to your gate immediately." },
    status_update: { label: "Status Update", defaultMessage: "Your flight status has been updated." }
  };

  // Boarding notification handlers
  const handleSendBoardingNotification = (notification, flight) => {
    setSentNotifications([notification, ...sentNotifications]);
    const passengerNotifications = [{
      id: notification.id,
      flight: flight,
      notification: notification,
      read: false
    }];
    setBoardingNotifications(prev => [...passengerNotifications, ...prev]);
    alert(`✅ Notification sent to passengers on ${flight} flight!`);
  };

  const handleMarkNotificationRead = (notificationId) => {
    setBoardingNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  // Flight tracking handlers
  const airlineFlights = {
    American: {
      flight: "AA123",
      status: "On Time",
      gate: "B12",
      terminal: "2",
      boarding: "2:30 PM",
      baggageClaim: "Carousel 5",
      prices: { Budget: "$120", Standard: "$280", Premium: "$540" },
      policy: ["1 free carry-on bag included", "Check-in closes 45 minutes before departure"],
    },
    Delta: {
      flight: "DL456",
      status: "Delayed",
      gate: "C4",
      terminal: "1",
      boarding: "4:10 PM",
      baggageClaim: "Carousel 9",
      prices: { Budget: "$160", Standard: "$320", Premium: "$610" },
      policy: ["Free Wi-Fi available", "Boarding begins 40 minutes before departure"],
    },
    United: {
      flight: "UA789",
      status: "Boarding Soon",
      gate: "A8",
      terminal: "3",
      boarding: "6:45 PM",
      baggageClaim: "Carousel 2",
      prices: { Budget: "$145", Standard: "$300", Premium: "$575" },
      policy: ["Basic Economy has limited seat selection", "Carry-on allowed for most fares"],
    },
  };

  const flightInfo = airlineFlights[selectedAirline];
  const displayFlightInfo = { ...flightInfo, ...liveFlightData };

  const formatTime = (timeValue) => {
    if (!timeValue) return "Not available";
    const date = new Date(timeValue);
    if (isNaN(date.getTime())) return timeValue;
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const mapAviationstackFlight = (flight) => {
    const departure = flight.departure || {};
    const arrival = flight.arrival || {};
    return {
      flight: flight.flight?.iata || flightInfo.flight,
      status: flight.flight_status || flightInfo.status,
      gate: departure.gate || flightInfo.gate,
      terminal: departure.terminal || flightInfo.terminal,
      boarding: formatTime(departure.estimated || departure.scheduled),
      delay: departure.delay ? `${departure.delay} minutes` : "No delay reported",
      baggageClaim: arrival.baggage || flightInfo.baggageClaim,
      departureAirport: departure.airport || "Departure airport not available",
      arrivalAirport: arrival.airport || "Arrival airport not available",
      updatedBy: "Aviationstack live API",
    };
  };

  const buildFallbackFlight = () => ({
    ...demoLiveFlights[selectedAirline],
    updatedBy: AVIATIONSTACK_API_KEY ? "Fallback after API issue" : "Demo fallback data",
  });

  const fetchLiveFlightData = async () => {
    setIsLoadingLiveData(true);
    setApiError("");

    if (!AVIATIONSTACK_API_KEY) {
      setLiveFlightData(buildFallbackFlight());
      setApiError("No API key found. Showing demo data.");
      setLastUpdated(new Date());
      setIsLoadingLiveData(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        access_key: AVIATIONSTACK_API_KEY,
        flight_iata: flightInfo.flight,
        limit: "1",
      });
      const response = await fetch(`https://api.aviationstack.com/v1/flights?${params.toString()}`);
      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error?.message || "Unable to load live flight data.");
      const liveFlight = result.data?.[0];
      if (!liveFlight) throw new Error("No live flight record was returned.");
      setLiveFlightData(mapAviationstackFlight(liveFlight));
      setLastUpdated(new Date());
    } catch (error) {
      setLiveFlightData(buildFallbackFlight());
      setLastUpdated(new Date());
      setApiError(`${error.message} Showing fallback flight data.`);
    } finally {
      setIsLoadingLiveData(false);
    }
  };

  useEffect(() => {
    fetchLiveFlightData();
  }, [selectedAirline]);

  useEffect(() => {
    if (!autoRefresh) return;
    const refreshTimer = setInterval(fetchLiveFlightData, REFRESH_INTERVAL_MS);
    return () => clearInterval(refreshTimer);
  }, [autoRefresh, selectedAirline]);

  const saveFavoriteLocation = (airportCode) => {
    if (!favoriteLocations.includes(airportCode)) {
      setFavoriteLocations([...favoriteLocations, airportCode]);
    }
  };

  // Return the JSX
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>✈️ Air Travel Assist</h1>
      
      {/* Boarding Notification Components */}
      <h2>Boarding Notifications System</h2>
      <BoardingNotificationPanel onSendNotification={handleSendBoardingNotification} />
      <PassengerNotifications notifications={boardingNotifications} onMarkRead={handleMarkNotificationRead} />
      
      <hr />
      
      {/* Flight Search Section */}
      <h2>Flight Search</h2>
      <label>Select Airline: </label>
      <select value={selectedAirline} onChange={(e) => setSelectedAirline(e.target.value)}>
        <option value="American">American Airlines</option>
        <option value="Delta">Delta Airlines</option>
        <option value="United">United Airlines</option>
      </select>
      
      <div>
        <p><strong>Flight:</strong> {displayFlightInfo.flight}</p>
        <p><strong>Status:</strong> {displayFlightInfo.status}</p>
        <p><strong>Gate:</strong> {displayFlightInfo.gate}</p>
        <p><strong>Terminal:</strong> {displayFlightInfo.terminal}</p>
        <p><strong>Boarding:</strong> {displayFlightInfo.boarding}</p>
        {apiError && <p style={{ color: "orange" }}>{apiError}</p>}
        {lastUpdated && <p><small>Last updated: {lastUpdated.toLocaleTimeString()}</small></p>}
      </div>
      
      <button onClick={fetchLiveFlightData} disabled={isLoadingLiveData}>
        {isLoadingLiveData ? "Refreshing..." : "Refresh Flight Data"}
      </button>
      
      <label>
        <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
        Auto-refresh every 60 seconds
      </label>
    </div>
  );
}

export default App;
