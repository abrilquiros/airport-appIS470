import { useCallback, useEffect, useMemo, useState } from "react";

const AVIATIONSTACK_API_KEY = process.env.REACT_APP_AVIATIONSTACK_API_KEY;
const REFRESH_INTERVAL_MS = 60000;

const demoLiveFlights = {
  American: {
    flight: "AA123",
    status: "On Time",
    gate: "B12",
    terminal: "2",
    boarding: "2:30 PM",
    baggageClaim: "Carousel 5",
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
    baggageClaim: "Carousel 9",
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
    baggageClaim: "Carousel 2",
    delay: "No delay reported",
    departureAirport: "Portland International Airport",
    arrivalAirport: "Los Angeles International Airport",
    updatedBy: "Demo fallback data",
  },
};

const airports = [
  {
    code: "LAX",
    name: "Los Angeles International Airport",
    map: "https://www.flylax.com/map#/",
  },
  {
    code: "SAN",
    name: "San Diego International Airport",
    map: "https://www.flysfo.com/maps",
  },
  {
    code: "JFK",
    name: "John F. Kennedy International Airport",
    map: "https://maps.jfkairport.com/",
  },
  {
    code: "PDX",
    name: "Portland International Airport",
    map: "https://www.flypdx.com/map",
  },
  {
    code: "SEA",
    name: "Seattle-Tacoma International Airport",
    map: "https://maps.flysea.org/",
  },
];

const airlineFlights = {
  American: {
    flight: "AA123",
    status: "On Time",
    gate: "B12",
    terminal: "2",
    boarding: "2:30 PM",
    baggageClaim: "Carousel 5",
    prices: {
      Budget: "$120",
      Standard: "$280",
      Premium: "$540",
    },
    policy: [
      "1 free carry-on bag included",
      "Check-in closes 45 minutes before departure",
      "Face covering optional during travel",
    ],
  },
  Delta: {
    flight: "DL456",
    status: "Delayed",
    gate: "C4",
    terminal: "1",
    boarding: "4:10 PM",
    baggageClaim: "Carousel 9",
    prices: {
      Budget: "$160",
      Standard: "$320",
      Premium: "$610",
    },
    policy: [
      "Free Wi-Fi available on select flights",
      "Boarding begins 40 minutes before departure",
      "Changes allowed with applicable fare difference",
    ],
  },
  United: {
    flight: "UA789",
    status: "Boarding Soon",
    gate: "A8",
    terminal: "3",
    boarding: "6:45 PM",
    baggageClaim: "Carousel 2",
    prices: {
      Budget: "$145",
      Standard: "$300",
      Premium: "$575",
    },
    policy: [
      "Basic Economy has limited seat selection",
      "Carry-on allowed for most fares",
      "Arrive at gate at least 30 minutes before departure",
    ],
  },
};

const airportWeather = {
  LAX: {
    temperature: "68 F",
    condition: "Partly Cloudy",
    wind: "9 mph W",
    visibility: "10 mi",
    delayRisk: "Low",
    alert: "No major weather alerts. Normal travel conditions expected.",
    updated: "Updated 10 minutes ago",
  },
  SAN: {
    temperature: "66 F",
    condition: "Coastal Fog",
    wind: "7 mph SW",
    visibility: "6 mi",
    delayRisk: "Moderate",
    alert: "Morning fog may slow early departures. Check gate updates before boarding.",
    updated: "Updated 8 minutes ago",
  },
  JFK: {
    temperature: "54 F",
    condition: "Light Rain",
    wind: "14 mph NE",
    visibility: "5 mi",
    delayRisk: "Moderate",
    alert: "Rain may affect ramp operations. Allow extra connection time.",
    updated: "Updated 12 minutes ago",
  },
  PDX: {
    temperature: "49 F",
    condition: "Rain Showers",
    wind: "11 mph S",
    visibility: "7 mi",
    delayRisk: "Moderate",
    alert: "Wet runways and showers may cause minor schedule adjustments.",
    updated: "Updated 15 minutes ago",
  },
  SEA: {
    temperature: "51 F",
    condition: "Overcast",
    wind: "10 mph SW",
    visibility: "8 mi",
    delayRisk: "Low",
    alert: "Cloudy conditions with no active airport weather alert.",
    updated: "Updated 6 minutes ago",
  },
};

const airportCrowdLevels = {
  LAX: {
    updated: "Updated 5 minutes ago",
    bestArea: "Terminal 2 south security checkpoint",
    summary: "Moderate traffic near main security, lighter crowds near Gates B10-B13.",
    areas: [
      {
        name: "Terminal 2 Security",
        level: "Medium",
        waitTime: "18 min",
        recommendation: "Use south checkpoint for shorter lines.",
      },
      {
        name: "Gate B12 Concourse",
        level: "Low",
        waitTime: "Open seating",
        recommendation: "Good area to wait before boarding.",
      },
      {
        name: "Baggage Claim",
        level: "Medium",
        waitTime: "12 min",
        recommendation: "Expect normal arrival traffic.",
      },
    ],
  },
  SAN: {
    updated: "Updated 7 minutes ago",
    bestArea: "Terminal 1 west concourse",
    summary: "Morning crowding is easing, but coffee and security lines are still moderate.",
    areas: [
      {
        name: "Terminal 1 Security",
        level: "Medium",
        waitTime: "16 min",
        recommendation: "Arrive early if checking bags.",
      },
      {
        name: "Gate C4 Area",
        level: "Low",
        waitTime: "Open seating",
        recommendation: "Best place to wait for updates.",
      },
      {
        name: "Food Court",
        level: "High",
        waitTime: "20 min",
        recommendation: "Choose grab-and-go options nearby.",
      },
    ],
  },
  JFK: {
    updated: "Updated 4 minutes ago",
    bestArea: "Upper concourse seating near B gates",
    summary: "High congestion at security due to weather delays and connecting traffic.",
    areas: [
      {
        name: "Main Security",
        level: "High",
        waitTime: "32 min",
        recommendation: "Use alternate checkpoint if available.",
      },
      {
        name: "Gate B Concourse",
        level: "Medium",
        waitTime: "Limited seating",
        recommendation: "Move toward upper concourse for more space.",
      },
      {
        name: "Customer Service Desk",
        level: "High",
        waitTime: "25 min",
        recommendation: "Use airline app for simple changes.",
      },
    ],
  },
  PDX: {
    updated: "Updated 9 minutes ago",
    bestArea: "Gate A8 seating zone",
    summary: "Terminal traffic is light with small delays near rideshare pickup.",
    areas: [
      {
        name: "Terminal 3 Security",
        level: "Low",
        waitTime: "8 min",
        recommendation: "Normal checkpoint flow.",
      },
      {
        name: "Gate A8 Area",
        level: "Low",
        waitTime: "Open seating",
        recommendation: "Best area for a calm wait.",
      },
      {
        name: "Ground Transportation",
        level: "Medium",
        waitTime: "15 min",
        recommendation: "Allow extra time for rideshare pickup.",
      },
    ],
  },
  SEA: {
    updated: "Updated 6 minutes ago",
    bestArea: "North satellite seating",
    summary: "Moderate crowding around central terminal, lighter traffic near satellite gates.",
    areas: [
      {
        name: "Central Security",
        level: "Medium",
        waitTime: "19 min",
        recommendation: "Check alternate checkpoint before entering line.",
      },
      {
        name: "North Satellite",
        level: "Low",
        waitTime: "Open seating",
        recommendation: "Less crowded waiting area.",
      },
      {
        name: "Dining Hall",
        level: "Medium",
        waitTime: "14 min",
        recommendation: "Order ahead if possible.",
      },
    ],
  },
};

const gateRestaurantRecommendations = {
  American: [
    {
      name: "Terminal 2 Market Cafe",
      type: "Coffee and breakfast",
      location: "Terminal 2, near Gate B10",
      walkTime: "3 min walk",
      bestFor: "Quick coffee before boarding",
      status: "Open",
    },
    {
      name: "Runway Grill",
      type: "Burgers and sandwiches",
      location: "Terminal 2, Gate B14 food court",
      walkTime: "4 min walk",
      bestFor: "Fast lunch",
      status: "Open",
    },
    {
      name: "Fresh To Fly",
      type: "Salads and grab-and-go",
      location: "Terminal 2, between Gates B11-B13",
      walkTime: "2 min walk",
      bestFor: "Healthy snack",
      status: "Open",
    },
  ],
  Delta: [
    {
      name: "Coastal Coffee Bar",
      type: "Coffee and pastries",
      location: "Terminal 1, near Gate C3",
      walkTime: "2 min walk",
      bestFor: "Short layover",
      status: "Open",
    },
    {
      name: "Pacific Noodle House",
      type: "Noodles and rice bowls",
      location: "Terminal 1, Gate C5 concourse",
      walkTime: "5 min walk",
      bestFor: "Warm meal",
      status: "Busy",
    },
    {
      name: "Skyline Deli",
      type: "Sandwiches and bottled drinks",
      location: "Terminal 1, across from Gate C4",
      walkTime: "1 min walk",
      bestFor: "Grab-and-go",
      status: "Open",
    },
  ],
  United: [
    {
      name: "Aero Tacos",
      type: "Tacos and bowls",
      location: "Terminal 3, near Gate A7",
      walkTime: "3 min walk",
      bestFor: "Quick full meal",
      status: "Open",
    },
    {
      name: "Cloud City Coffee",
      type: "Coffee and tea",
      location: "Terminal 3, Gate A9 kiosk",
      walkTime: "2 min walk",
      bestFor: "Pre-boarding drink",
      status: "Open",
    },
    {
      name: "Northwest Fresh",
      type: "Wraps and fruit cups",
      location: "Terminal 3, between Gates A8-A10",
      walkTime: "4 min walk",
      bestFor: "Light snack",
      status: "Open",
    },
  ],
};

const airportActivities = [
  {
    id: "ACT-COFFEE",
    name: "Coffee before boarding",
    category: "Dining",
    location: "Near departure gates",
    duration: "15 min",
    bestTime: "Before boarding",
  },
  {
    id: "ACT-MEAL",
    name: "Quick meal",
    category: "Dining",
    location: "Terminal food court",
    duration: "30 min",
    bestTime: "Layover or delay",
  },
  {
    id: "ACT-SHOP",
    name: "Travel essentials shopping",
    category: "Shopping",
    location: "Main terminal shops",
    duration: "20 min",
    bestTime: "Before security or near gate",
  },
  {
    id: "ACT-GIFT",
    name: "Gift and souvenir stop",
    category: "Shopping",
    location: "Concourse retail area",
    duration: "15 min",
    bestTime: "Short layover",
  },
  {
    id: "ACT-LOUNGE",
    name: "Quiet lounge break",
    category: "Entertainment",
    location: "Terminal seating lounge",
    duration: "45 min",
    bestTime: "Long wait",
  },
  {
    id: "ACT-WALK",
    name: "Terminal walk",
    category: "Entertainment",
    location: "Connected concourses",
    duration: "20 min",
    bestTime: "Before sitting at gate",
  },
];

const customerInquiries = [
  {
    id: 1,
    passenger: "Maria Lopez",
    type: "Baggage",
    urgency: "High",
    message: "My luggage did not arrive at baggage claim.",
  },
  {
    id: 2,
    passenger: "James Smith",
    type: "Flight Status",
    urgency: "Medium",
    message: "Is my flight still delayed?",
  },
  {
    id: 3,
    passenger: "Ana Garcia",
    type: "Gate",
    urgency: "Low",
    message: "Where is my updated gate?",
  },
];

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
    barcode: "AA123-MLOPEZ-14A-LAXJFK",
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
    barcode: "DL456-JSMITH-22C-SANSEA",
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
    barcode: "UA789-AGARCIA-9F-PDXLAX",
  },
];

const notificationTypes = {
  boarding_start: {
    label: "Boarding Started",
    defaultMessage: "Boarding has begun for your flight.",
  },
  boarding_delay: {
    label: "Boarding Delayed",
    defaultMessage: "Boarding has been delayed. Please wait for further updates.",
  },
  gate_change: {
    label: "Gate Change",
    defaultMessage: "Your gate has been changed.",
  },
  final_call: {
    label: "Final Call",
    defaultMessage: "Final boarding call. Please proceed to your gate immediately.",
  },
  status_update: {
    label: "Status Update",
    defaultMessage: "Your flight status has been updated.",
  },
};


function PassengerNotifications({ notifications, onMarkRead }) {
  if (notifications.length === 0) {
    return <p>No passenger notifications yet.</p>;
  }

  return (
    <div style={notificationListStyle}>
      {notifications.map((item) => (
        <div
          key={item.id}
          style={item.read ? readNotificationStyle : unreadNotificationStyle}
        >
          <strong>{item.notification.title}</strong>
          <p style={notificationMessageStyle}>{item.notification.message}</p>
          <span style={smallLabelStyle}>Flight {item.flight}</span>
          {!item.read && (
            <button
              onClick={() => onMarkRead(item.id)}
              style={markReadButtonStyle}
            >
              Mark Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function BoardingNotificationPanel({ onSendNotification, selectedFlight }) {
  const [type, setType] = useState("boarding_start");
  const [message, setMessage] = useState(notificationTypes.boarding_start.defaultMessage);

  const handleTypeChange = (event) => {
    const nextType = event.target.value;
    setType(nextType);
    setMessage(notificationTypes[nextType].defaultMessage);
  };

  const sendNotification = () => {
    const notification = {
      id: Date.now(),
      type,
      title: notificationTypes[type].label,
      message,
      sentAt: new Date().toLocaleTimeString(),
    };

    onSendNotification(notification, selectedFlight);
  };

  return (
    <div>
      <label style={labelStyle}>Notification Type</label>
      <select value={type} onChange={handleTypeChange} style={inputStyle}>
        {Object.entries(notificationTypes).map(([key, item]) => (
          <option key={key} value={key}>
            {item.label}
          </option>
        ))}
      </select>

      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        style={textAreaStyle}
      />

      <button onClick={sendNotification} style={successButtonStyle}>
        Send Boarding Notification
      </button>
    </div>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState("traveler");
  const [showTransport, setShowTransport] = useState(false);
  const [showBaggage, setShowBaggage] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState("American");
  const [favoriteLocations, setFavoriteLocations] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedAirportMap, setSelectedAirportMap] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedBoardingPassId, setSelectedBoardingPassId] = useState("BP-001");
  const [selectedWeatherAirport, setSelectedWeatherAirport] = useState("LAX");
  const [liveFlightData, setLiveFlightData] = useState(demoLiveFlights.American);
  const [isLoadingLiveData, setIsLoadingLiveData] = useState(false);
  const [apiError, setApiError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [boardingNotifications, setBoardingNotifications] = useState([]);
  const [sentNotifications, setSentNotifications] = useState([]);
  const [announcement, setAnnouncement] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [plannedActivities, setPlannedActivities] = useState([]);
  const [aiMessages, setAiMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I can help with flight status, gates, boarding, weather, crowd levels, restaurants, baggage claim, and airport services.",
    },
  ]);

  const flightInfo = airlineFlights[selectedAirline];
  const displayFlightInfo = useMemo(
    () => ({
      ...flightInfo,
      ...liveFlightData,
    }),
    [flightInfo, liveFlightData]
  );

  const selectedBoardingPass =
    boardingPasses.find((pass) => pass.id === selectedBoardingPassId) ||
    boardingPasses[0];
  const selectedWeatherAirportInfo =
    airports.find((airport) => airport.code === selectedWeatherAirport) ||
    airports[0];
  const selectedWeather = airportWeather[selectedWeatherAirport];
  const selectedCrowdData = airportCrowdLevels[selectedWeatherAirport];
  const selectedRestaurants =
    gateRestaurantRecommendations[selectedAirline] ||
    gateRestaurantRecommendations.American;

  const formatTime = (timeValue) => {
    if (!timeValue) {
      return "Not available";
    }

    const date = new Date(timeValue);
    if (Number.isNaN(date.getTime())) {
      return timeValue;
    }

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const buildFallbackFlight = useCallback(
    () => ({
      ...demoLiveFlights[selectedAirline],
      updatedBy: AVIATIONSTACK_API_KEY
        ? "Fallback after API issue"
        : "Demo fallback data - add an API key for live results",
    }),
    [selectedAirline]
  );

  const mapAviationstackFlight = useCallback(
    (flight) => {
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
    },
    [flightInfo]
  );

  const fetchLiveFlightData = useCallback(async () => {
    setIsLoadingLiveData(true);
    setApiError("");

    if (!AVIATIONSTACK_API_KEY) {
      setLiveFlightData(buildFallbackFlight());
      setApiError("No API key found. Showing demo data for the sprint review.");
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

      const response = await fetch(
        `https://api.aviationstack.com/v1/flights?${params.toString()}`
      );
      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error?.message || "Unable to load live flight data.");
      }

      const liveFlight = result.data?.[0];

      if (!liveFlight) {
        throw new Error("No live flight record was returned for this flight.");
      }

      setLiveFlightData(mapAviationstackFlight(liveFlight));
      setLastUpdated(new Date());
    } catch (error) {
      setLiveFlightData(buildFallbackFlight());
      setLastUpdated(new Date());
      setApiError(`${error.message} Showing fallback flight data.`);
    } finally {
      setIsLoadingLiveData(false);
    }
  }, [buildFallbackFlight, flightInfo.flight, mapAviationstackFlight]);

  useEffect(() => {
    fetchLiveFlightData();
  }, [fetchLiveFlightData]);

  useEffect(() => {
    if (!autoRefresh) {
      return undefined;
    }

    const refreshTimer = setInterval(fetchLiveFlightData, REFRESH_INTERVAL_MS);
    return () => clearInterval(refreshTimer);
  }, [autoRefresh, fetchLiveFlightData]);

  useEffect(() => {
    const emergencyAlerts = [
      {
        title: "Security Alert",
        message: `Security incident reported at Terminal ${displayFlightInfo.terminal}. Authorities are responding.`,
        severity: "high",
        recommendedAction: `Avoid Terminal ${displayFlightInfo.terminal}. Follow security personnel instructions.`,
        safeArea: `Terminal ${
          displayFlightInfo.terminal === "2" ? "1 or 3" : "2"
        } is the safe area.`,
      },
      {
        title: "Severe Weather Warning",
        message: "Tornado warning issued for airport area. Seek shelter immediately.",
        severity: "high",
        recommendedAction:
          "Move to basement level or interior hallways. Stay away from windows.",
        safeArea: "Basement level, interior hallways, or storm shelters in Terminal 1",
      },
      {
        title: "Flight Delay Alert",
        message: `Your flight ${displayFlightInfo.flight} is delayed due to severe weather conditions.`,
        severity: "medium",
        recommendedAction: `Stay near your gate at Terminal ${displayFlightInfo.terminal} and monitor for updates.`,
        safeArea: `Remain in Terminal ${displayFlightInfo.terminal} near Gate ${displayFlightInfo.gate}`,
      },
    ];

    const timers = [
      setTimeout(() => {
        setCurrentAlert(emergencyAlerts[0]);
        setShowAlert(true);
      }, 5000),
      setTimeout(() => {
        setCurrentAlert(emergencyAlerts[1]);
        setShowAlert(true);
      }, 15000),
      setTimeout(() => {
        setCurrentAlert(emergencyAlerts[2]);
        setShowAlert(true);
      }, 25000),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [
    displayFlightInfo.flight,
    displayFlightInfo.terminal,
    displayFlightInfo.gate,
  ]);

  const saveFavoriteLocation = (airportCode) => {
    if (!favoriteLocations.includes(airportCode)) {
      setFavoriteLocations([...favoriteLocations, airportCode]);
    }
  };

  const removeFavoriteLocation = (airportCode) => {
    setFavoriteLocations(favoriteLocations.filter((fav) => fav !== airportCode));
  };

  const openAirportMap = (airport) => {
    setSelectedAirportMap(airport);
    setShowMap(true);
  };

  const addPlannedActivity = (activity) => {
    if (!plannedActivities.some((item) => item.id === activity.id)) {
      setPlannedActivities([...plannedActivities, activity]);
    }
  };

  const removePlannedActivity = (activityId) => {
    setPlannedActivities(
      plannedActivities.filter((activity) => activity.id !== activityId)
    );
  };

  const handleSendBoardingNotification = (notification, flight) => {
    const newNotification = {
      id: notification.id || Date.now(),
      flight,
      notification,
      read: false,
    };

    setSentNotifications([notification, ...sentNotifications]);
    setBoardingNotifications([newNotification, ...boardingNotifications]);
    alert(`Notification sent to passengers on ${flight} flight.`);
  };

  const handleMarkNotificationRead = (notificationId) => {
    setBoardingNotifications(
      boardingNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const closeAlert = () => {
    setShowAlert(false);
    setCurrentAlert(null);
  };

  return (
    <div style={pageStyle}>
      {showAlert && currentAlert && (
        <div style={alertOverlayStyle}>
          <div
            style={{
              ...alertModalStyle,
              borderTop: `6px solid ${
                currentAlert.severity === "high" ? "#dc2626" : "#f59e0b"
              }`,
            }}
          >
            <div style={alertBodyStyle}>
              <h2 style={alertTitleStyle}>{currentAlert.title}</h2>
              <p style={alertMessageStyle}>{currentAlert.message}</p>
              <div style={alertActionBoxStyle}>
                <strong>Recommended Action:</strong>
                <p style={alertBoxTextStyle}>{currentAlert.recommendedAction}</p>
              </div>
              <div style={alertSafeBoxStyle}>
                <strong>Safe Area:</strong>
                <p style={alertBoxTextStyle}>{currentAlert.safeArea}</p>
              </div>
            </div>
            <div style={alertFooterStyle}>
              <button
                onClick={closeAlert}
                style={{
                  ...alertButtonStyle,
                  backgroundColor:
                    currentAlert.severity === "high" ? "#dc2626" : "#155e75",
                }}
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {broadcastMessage && (
        <div style={broadcastBannerStyle}>
          <strong>Airport Announcement</strong>
          <div style={broadcastMessageStyle}>{broadcastMessage}</div>
        </div>
      )}

      <header style={headerStyle}>
        <h1 style={titleStyle}>Air Travel Assist</h1>
        <p style={subtitleStyle}>
          A simple airport support dashboard for travelers and airline staff.
        </p>
      </header>

      <main style={appContainerStyle}>
        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Flight Search</h2>

          <label style={labelStyle}>Select Airline</label>
          <select
            value={selectedAirline}
            onChange={(event) => setSelectedAirline(event.target.value)}
            style={inputStyle}
          >
            <option value="American">American Airlines</option>
            <option value="Delta">Delta Airlines</option>
            <option value="United">United Airlines</option>
          </select>

          <input
            type="text"
            value={displayFlightInfo.flight}
            readOnly
            style={{ ...inputStyle, backgroundColor: "#f8fafc" }}
          />

          <div style={liveStatusPanelStyle}>
            <div>
              <span style={smallLabelStyle}>Live Data Source</span>
              <strong>{displayFlightInfo.updatedBy}</strong>
            </div>
            <button
              onClick={fetchLiveFlightData}
              disabled={isLoadingLiveData}
              style={refreshButtonStyle}
            >
              {isLoadingLiveData ? "Refreshing..." : "Refresh Now"}
            </button>
          </div>

          {apiError && <p style={apiErrorStyle}>{apiError}</p>}

          <label style={toggleLabelStyle}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(event) => setAutoRefresh(event.target.checked)}
            />
            Auto-refresh every 60 seconds
          </label>

          <div style={infoGridStyle}>
            <InfoBox label="Status" value={displayFlightInfo.status} />
            <InfoBox label="Gate" value={displayFlightInfo.gate} />
            <InfoBox label="Terminal" value={displayFlightInfo.terminal} />
            <InfoBox label="Boarding" value={displayFlightInfo.boarding} />
            <InfoBox label="Delay" value={displayFlightInfo.delay} />
            <InfoBox
              label="Last Updated"
              value={
                lastUpdated
                  ? lastUpdated.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : "Not updated yet"
              }
            />
          </div>

          <div style={routeBoxStyle}>
            <p>
              <strong>From:</strong> {displayFlightInfo.departureAirport}
            </p>
            <p>
              <strong>To:</strong> {displayFlightInfo.arrivalAirport}
            </p>
          </div>

          <div style={priceSectionStyle}>
            <h3 style={smallHeadingStyle}>Price Options</h3>
            <div style={priceGridStyle}>
              {Object.entries(flightInfo.prices).map(([name, price]) => (
                <div key={name} style={priceCardStyle}>
                  <strong>{name}</strong>
                  <span>{price}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <div style={tabRowStyle}>
            <button
              onClick={() => setActiveSection("traveler")}
              style={activeSection === "traveler" ? activeTabStyle : tabStyle}
            >
              Traveler Tools
            </button>
            <button
              onClick={() => setActiveSection("support")}
              style={activeSection === "support" ? activeTabStyle : tabStyle}
            >
              Customer Support
            </button>
            <button
              onClick={() => setActiveSection("staff")}
              style={
                activeSection === "staff"
                  ? activeStaffTabStyle
                  : staffTabStyle
              }
            >
              Staff Dashboard
            </button>
          </div>

          {activeSection === "traveler" && (
            <TravelerTools
              airports={airports}
              selectedAirline={selectedAirline}
              flightInfo={flightInfo}
              displayFlightInfo={displayFlightInfo}
              showPolicy={showPolicy}
              setShowPolicy={setShowPolicy}
              showBaggage={showBaggage}
              setShowBaggage={setShowBaggage}
              showTransport={showTransport}
              setShowTransport={setShowTransport}
              selectedWeatherAirport={selectedWeatherAirport}
              setSelectedWeatherAirport={setSelectedWeatherAirport}
              selectedWeatherAirportInfo={selectedWeatherAirportInfo}
              selectedWeather={selectedWeather}
              selectedCrowdData={selectedCrowdData}
              selectedRestaurants={selectedRestaurants}
              plannedActivities={plannedActivities}
              addPlannedActivity={addPlannedActivity}
              removePlannedActivity={removePlannedActivity}
              selectedBoardingPass={selectedBoardingPass}
              setSelectedBoardingPassId={setSelectedBoardingPassId}
              boardingNotifications={boardingNotifications}
              handleMarkNotificationRead={handleMarkNotificationRead}
              favoriteLocations={favoriteLocations}
              saveFavoriteLocation={saveFavoriteLocation}
              removeFavoriteLocation={removeFavoriteLocation}
              selectedAirportMap={selectedAirportMap}
              showMap={showMap}
              setShowMap={setShowMap}
              openAirportMap={openAirportMap}
              aiMessages={aiMessages}
              setAiMessages={setAiMessages}
            />
          )}

          {activeSection === "support" && <SupportPanel />}

          {activeSection === "staff" && (
            <StaffDashboard
              sentNotifications={sentNotifications}
              selectedFlight={displayFlightInfo.flight}
              handleSendBoardingNotification={handleSendBoardingNotification}
              selectedInquiry={selectedInquiry}
              setSelectedInquiry={setSelectedInquiry}
              announcement={announcement}
              setAnnouncement={setAnnouncement}
              setBroadcastMessage={setBroadcastMessage}
            />
          )}
        </section>
      </main>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div style={infoBoxStyle}>
      <span style={smallLabelStyle}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TravelerTools({
  airports,
  selectedAirline,
  flightInfo,
  displayFlightInfo,
  showPolicy,
  setShowPolicy,
  showBaggage,
  setShowBaggage,
  showTransport,
  setShowTransport,
  selectedWeatherAirport,
  setSelectedWeatherAirport,
  selectedWeatherAirportInfo,
  selectedWeather,
  selectedCrowdData,
  selectedRestaurants,
  plannedActivities,
  addPlannedActivity,
  removePlannedActivity,
  selectedBoardingPass,
  setSelectedBoardingPassId,
  boardingNotifications,
  handleMarkNotificationRead,
  favoriteLocations,
  saveFavoriteLocation,
  removeFavoriteLocation,
  selectedAirportMap,
  showMap,
  setShowMap,
  openAirportMap,
  aiMessages,
  setAiMessages,
}) {
  const [activeTravelerTool, setActiveTravelerTool] = useState("conditions");

  return (
    <div>
      <h2 style={sectionTitleStyle}>Traveler Tools</h2>

      <div style={travelerSubTabRowStyle}>
        <button
          onClick={() => setActiveTravelerTool("conditions")}
          style={
            activeTravelerTool === "conditions"
              ? activeTravelerSubTabStyle
              : travelerSubTabStyle
          }
        >
          Conditions
        </button>
        <button
          onClick={() => setActiveTravelerTool("activities")}
          style={
            activeTravelerTool === "activities"
              ? activeTravelerSubTabStyle
              : travelerSubTabStyle
          }
        >
          Dining & Activities
        </button>
        <button
          onClick={() => setActiveTravelerTool("trip")}
          style={
            activeTravelerTool === "trip"
              ? activeTravelerSubTabStyle
              : travelerSubTabStyle
          }
        >
          Trip Tools
        </button>
        <button
           onClick={() => setActiveTravelerTool("assistant")}
           style={
             activeTravelerTool === "assistant"
              ? activeTravelerSubTabStyle
              : travelerSubTabStyle
           }
          >
         AI Assistant
</button>
      </div>

      {activeTravelerTool === "conditions" && (
        <div style={travelerToolsGridStyle}>
          <AirportWeatherPanel
            airports={airports}
            selectedWeatherAirport={selectedWeatherAirport}
            setSelectedWeatherAirport={setSelectedWeatherAirport}
            selectedWeatherAirportInfo={selectedWeatherAirportInfo}
            selectedWeather={selectedWeather}
          />

          <AirportCrowdLevels
            airportInfo={selectedWeatherAirportInfo}
            crowdData={selectedCrowdData}
          />
        </div>
      )}

      {activeTravelerTool === "activities" && (
        <div style={travelerToolsGridStyle}>
          <RestaurantRecommendations
            flightInfo={displayFlightInfo}
            restaurants={selectedRestaurants}
          />

          <AirportActivityPlanner
            airportInfo={selectedWeatherAirportInfo}
            plannedActivities={plannedActivities}
            addPlannedActivity={addPlannedActivity}
            removePlannedActivity={removePlannedActivity}
          />
        </div>
      )}

      {activeTravelerTool === "trip" && (
        <div style={travelerToolsGridStyle}>
          <div style={travelerToolsColumnStyle}>
            <button
              onClick={() => setShowPolicy(!showPolicy)}
              style={primaryButtonStyle}
            >
              {showPolicy ? "Hide Airline Policy" : "View Airline Policy"}
            </button>

            {showPolicy && (
              <div style={detailBoxStyle}>
                <h3 style={smallHeadingStyle}>
                  Airline Policy - {selectedAirline}
                </h3>
                <ul>
                  {flightInfo.policy.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setShowBaggage(!showBaggage)}
              style={secondaryButtonStyle}
            >
              {showBaggage
                ? "Hide Baggage Claim Information"
                : "Check Baggage Claim Information"}
            </button>

            {showBaggage && (
              <div style={detailBoxStyle}>
                <h3 style={smallHeadingStyle}>Baggage Claim Information</h3>
                <p>
                  <strong>Flight:</strong> {displayFlightInfo.flight}
                </p>
                <p>
                  <strong>Terminal:</strong> {displayFlightInfo.terminal}
                </p>
                <p>
                  <strong>Baggage Claim:</strong> {displayFlightInfo.baggageClaim}
                </p>
              </div>
            )}

            <button
              onClick={() => setShowTransport(!showTransport)}
              style={thirdButtonStyle}
            >
              {showTransport
                ? "Hide Transportation Options"
                : "View Transportation Options"}
            </button>

            {showTransport && (
              <div style={detailBoxStyle}>
                <h3 style={smallHeadingStyle}>Transportation Options</h3>
                <ul>
                  <li>Taxi</li>
                  <li>Uber / Lyft</li>
                  <li>Airport Shuttle</li>
                  <li>Train / Metro</li>
                  <li>Rental Car Pickup</li>
                </ul>
              </div>
            )}

            <div style={detailBoxStyle}>
              <h3 style={smallHeadingStyle}>Passenger Notifications</h3>
              <PassengerNotifications
                notifications={boardingNotifications}
                onMarkRead={handleMarkNotificationRead}
              />
            </div>
          </div>

          <div style={travelerToolsColumnStyle}>
            <BoardingPassPanel
              selectedBoardingPass={selectedBoardingPass}
              setSelectedBoardingPassId={setSelectedBoardingPassId}
            />

            <FavoriteAirports
              airports={airports}
              favoriteLocations={favoriteLocations}
              saveFavoriteLocation={saveFavoriteLocation}
              removeFavoriteLocation={removeFavoriteLocation}
              selectedAirportMap={selectedAirportMap}
              showMap={showMap}
              setShowMap={setShowMap}
              openAirportMap={openAirportMap}
            />
          </div>
        </div>
      )}

      {activeTravelerTool === "assistant" && (
        <AIAssistant
          messages={aiMessages}
          setMessages={setAiMessages}
          flightInfo={displayFlightInfo}
          weather={selectedWeather}
          crowdData={selectedCrowdData}
          restaurants={selectedRestaurants}
          boardingPass={selectedBoardingPass}
        />
      )}
    </div>
  );
}

function AirportWeatherPanel({
  airports,
  selectedWeatherAirport,
  setSelectedWeatherAirport,
  selectedWeatherAirportInfo,
  selectedWeather,
}) {
  return (
    <div style={weatherSectionStyle}>
      <div style={weatherHeaderStyle}>
        <div>
          <h3 style={smallHeadingStyle}>Airport Weather</h3>
          <p style={weatherIntroStyle}>
            Current conditions and alerts for selected airports.
          </p>
        </div>
        <span style={weatherUpdatedStyle}>{selectedWeather.updated}</span>
      </div>

      <label style={labelStyle}>Select Airport</label>
      <select
        value={selectedWeatherAirport}
        onChange={(event) => setSelectedWeatherAirport(event.target.value)}
        style={inputStyle}
      >
        {airports.map((airport) => (
          <option key={airport.code} value={airport.code}>
            {airport.code} - {airport.name}
          </option>
        ))}
      </select>

      <div style={weatherSummaryStyle}>
        <div>
          <span style={smallLabelStyle}>Airport</span>
          <strong>{selectedWeatherAirportInfo.name}</strong>
        </div>
        <div style={temperatureStyle}>{selectedWeather.temperature}</div>
      </div>

      <div style={weatherGridStyle}>
        <InfoPlain label="Condition" value={selectedWeather.condition} />
        <InfoPlain label="Wind" value={selectedWeather.wind} />
        <InfoPlain label="Visibility" value={selectedWeather.visibility} />
        <InfoPlain label="Delay Risk" value={selectedWeather.delayRisk} />
      </div>

      <div style={weatherAlertStyle}>
        <span style={smallLabelStyle}>Weather Alert</span>
        <strong>{selectedWeather.alert}</strong>
      </div>
    </div>
  );
}

function AirportCrowdLevels({ airportInfo, crowdData }) {
  return (
    <div style={crowdSectionStyle}>
      <div style={crowdHeaderStyle}>
        <div>
          <h3 style={smallHeadingStyle}>Airport Crowd Levels</h3>
          <p style={crowdIntroStyle}>
            Estimated congestion for {airportInfo.code} terminal areas.
          </p>
        </div>
        <span style={crowdUpdatedStyle}>{crowdData.updated}</span>
      </div>

      <div style={crowdSummaryStyle}>
        <span style={smallLabelStyle}>Best Less-Crowded Area</span>
        <strong>{crowdData.bestArea}</strong>
        <p style={crowdSummaryTextStyle}>{crowdData.summary}</p>
      </div>

      <div style={crowdAreaListStyle}>
        {crowdData.areas.map((area) => (
          <div key={area.name} style={crowdAreaCardStyle}>
            <div style={crowdAreaTopRowStyle}>
              <strong>{area.name}</strong>
              <span style={getCrowdBadgeStyle(area.level)}>{area.level}</span>
            </div>
            <div style={crowdWaitStyle}>
              <span style={smallLabelStyle}>Wait / Space</span>
              <strong>{area.waitTime}</strong>
            </div>
            <p style={crowdRecommendationStyle}>{area.recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function getCrowdBadgeStyle(level) {
  if (level === "High") {
    return crowdHighBadgeStyle;
  }

  if (level === "Medium") {
    return crowdMediumBadgeStyle;
  }

  return crowdLowBadgeStyle;
}

function RestaurantRecommendations({ flightInfo, restaurants }) {
  return (
    <div style={restaurantSectionStyle}>
      <div style={restaurantHeaderStyle}>
        <div>
          <h3 style={smallHeadingStyle}>Gate Restaurant Recommendations</h3>
          <p style={restaurantIntroStyle}>
            Dining options near Terminal {flightInfo.terminal}, Gate {flightInfo.gate}.
          </p>
        </div>
        <span style={restaurantGateBadgeStyle}>Near {flightInfo.gate}</span>
      </div>

      <div style={restaurantListStyle}>
        {restaurants.map((restaurant) => (
          <div key={restaurant.name} style={restaurantCardStyle}>
            <div style={restaurantTopRowStyle}>
              <strong>{restaurant.name}</strong>
              <span
                style={
                  restaurant.status === "Busy"
                    ? restaurantBusyBadgeStyle
                    : restaurantOpenBadgeStyle
                }
              >
                {restaurant.status}
              </span>
            </div>
            <span style={smallLabelStyle}>{restaurant.type}</span>
            <p style={restaurantLocationStyle}>{restaurant.location}</p>
            <div style={restaurantMetaStyle}>
              <span>{restaurant.walkTime}</span>
              <span>{restaurant.bestFor}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AirportActivityPlanner({
  airportInfo,
  plannedActivities,
  addPlannedActivity,
  removePlannedActivity,
}) {
  const totalMinutes = plannedActivities.reduce(
    (total, activity) => total + Number.parseInt(activity.duration, 10),
    0
  );

  return (
    <div style={activitySectionStyle}>
      <div style={activityHeaderStyle}>
        <div>
          <h3 style={smallHeadingStyle}>Airport Activity Planner</h3>
          <p style={activityIntroStyle}>
            Schedule shopping, dining, or entertainment during airport wait time.
          </p>
        </div>
        <span style={activityCountStyle}>
          {plannedActivities.length} planned
        </span>
      </div>

      <div style={activityCatalogStyle}>
        {airportActivities.map((activity) => {
          const alreadyPlanned = plannedActivities.some(
            (item) => item.id === activity.id
          );

          return (
            <div key={activity.id} style={activityCardStyle}>
              <div style={activityTopRowStyle}>
                <strong>{activity.name}</strong>
                <span style={activityCategoryStyle}>{activity.category}</span>
              </div>
              <p style={activityDetailStyle}>
                {activity.location} at {airportInfo.code}
              </p>
              <div style={activityMetaStyle}>
                <span>{activity.duration}</span>
                <span>{activity.bestTime}</span>
              </div>
              <button
                onClick={() => addPlannedActivity(activity)}
                disabled={alreadyPlanned}
                style={
                  alreadyPlanned
                    ? disabledActivityButtonStyle
                    : addActivityButtonStyle
                }
              >
                {alreadyPlanned ? "Added" : "Add to Schedule"}
              </button>
            </div>
          );
        })}
      </div>

      <div style={activityScheduleStyle}>
        <div style={activityScheduleHeaderStyle}>
          <h4 style={activityScheduleTitleStyle}>My Airport Schedule</h4>
          <span style={activityTotalTimeStyle}>
            {totalMinutes} min planned
          </span>
        </div>

        {plannedActivities.length === 0 ? (
          <p style={activityEmptyStyle}>No activities added yet.</p>
        ) : (
          <div style={activityTimelineStyle}>
            {plannedActivities.map((activity, index) => (
              <div key={activity.id} style={activityTimelineItemStyle}>
                <span style={activityStepStyle}>{index + 1}</span>
                <div style={activityTimelineTextStyle}>
                  <strong>{activity.name}</strong>
                  <span>
                    {activity.duration} - {activity.location}
                  </span>
                </div>
                <button
                  onClick={() => removePlannedActivity(activity.id)}
                  style={removeActivityButtonStyle}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoPlain({ label, value }) {
  return (
    <div style={weatherInfoBoxStyle}>
      <span style={smallLabelStyle}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function BoardingPassPanel({ selectedBoardingPass, setSelectedBoardingPassId }) {
  return (
    <div style={boardingPassSectionStyle}>
      <div style={boardingPassHeaderStyle}>
        <div>
          <h3 style={smallHeadingStyle}>Digital Boarding Passes</h3>
          <p style={boardingPassIntroStyle}>
            Stored passes for active and upcoming trips.
          </p>
        </div>
        <span style={boardingPassCountStyle}>{boardingPasses.length} stored</span>
      </div>

      <div style={boardingPassListStyle}>
        {boardingPasses.map((pass) => (
          <button
            key={pass.id}
            onClick={() => setSelectedBoardingPassId(pass.id)}
            style={
              selectedBoardingPass.id === pass.id
                ? activeBoardingPassButtonStyle
                : boardingPassButtonStyle
            }
          >
            <strong>{pass.flight}</strong>
            <span>{pass.route}</span>
            <small>{pass.tripStatus}</small>
          </button>
        ))}
      </div>

      <div style={boardingPassCardStyle}>
        <div style={boardingPassTopRowStyle}>
          <div>
            <span style={smallLabelStyle}>Passenger</span>
            <strong>{selectedBoardingPass.passenger}</strong>
          </div>
          <span style={tripStatusBadgeStyle}>{selectedBoardingPass.tripStatus}</span>
        </div>

        <div style={boardingRouteStyle}>
          <strong>{selectedBoardingPass.route}</strong>
          <span>{selectedBoardingPass.airline}</span>
        </div>

        <div style={boardingInfoGridStyle}>
          <InfoPlain label="Flight" value={selectedBoardingPass.flight} />
          <InfoPlain label="Seat" value={selectedBoardingPass.seat} />
          <InfoPlain label="Group" value={selectedBoardingPass.group} />
          <InfoPlain label="Gate" value={selectedBoardingPass.gate} />
          <InfoPlain label="Terminal" value={selectedBoardingPass.terminal} />
          <InfoPlain label="Boarding" value={selectedBoardingPass.boardingTime} />
        </div>

        <div style={boardingBarcodeStyle}>
          {[4, 4, 9, 4, 9, 4, 4, 9, 4, 4, 9, 4].map((width, index) => (
            <span
              key={`${width}-${index}`}
              style={{ ...barcodeLineStyle, width: `${width}px` }}
            />
          ))}
        </div>

        <div style={boardingConfirmationStyle}>
          <span>{selectedBoardingPass.barcode}</span>
          <strong>Confirmation: {selectedBoardingPass.confirmation}</strong>
        </div>
      </div>
    </div>
  );
}

function FavoriteAirports({
  airports,
  favoriteLocations,
  saveFavoriteLocation,
  removeFavoriteLocation,
  selectedAirportMap,
  showMap,
  setShowMap,
  openAirportMap,
}) {
  return (
    <div style={detailBoxStyle}>
      <h3 style={smallHeadingStyle}>Favorite Airports</h3>
      <div style={buttonWrapStyle}>
        {airports.map((airport) => (
          <div key={airport.code} style={airportActionStyle}>
            <button
              onClick={() => saveFavoriteLocation(airport.code)}
              style={smallButtonStyle}
            >
              Save {airport.code}
            </button>
            <button onClick={() => openAirportMap(airport)} style={mapButtonStyle}>
              View Map
            </button>
          </div>
        ))}
      </div>

      <h4>Saved Locations</h4>
      {favoriteLocations.length === 0 ? (
        <p>No favorite airports saved yet.</p>
      ) : (
        <ul>
          {favoriteLocations.map((airportCode) => {
            const airport = airports.find((item) => item.code === airportCode);

            return (
              <li key={airportCode} style={favoriteItemStyle}>
                {airportCode}
                {airport && (
                  <button
                    onClick={() => openAirportMap(airport)}
                    style={savedMapButtonStyle}
                  >
                    View Map
                  </button>
                )}
                <button
                  onClick={() => removeFavoriteLocation(airportCode)}
                  style={removeButtonStyle}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {showMap && selectedAirportMap && (
        <div style={mapBoxStyle}>
          <div style={mapHeaderStyle}>
            <h4 style={mapTitleStyle}>{selectedAirportMap.name}</h4>
            <button onClick={() => setShowMap(false)} style={closeMapButtonStyle}>
              Close Map
            </button>
          </div>
          <iframe
            title={`${selectedAirportMap.code} airport map`}
            src={selectedAirportMap.map}
            width="100%"
            height="320"
            style={mapFrameStyle}
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}

function SupportPanel() {
  return (
    <div>
      <h2 style={sectionTitleStyle}>Customer Support</h2>
      <div style={detailBoxStyle}>
        <p>
          <strong>Support Phone:</strong> (800) 555-1234
        </p>
        <p>
          <strong>Email:</strong> support@airtravelassist.com
        </p>
        <p>
          <strong>Live Chat:</strong> Available 24/7
        </p>
        <textarea placeholder="Describe your travel issue..." style={textAreaStyle} />
        <button style={successButtonStyle}>Submit Support Request</button>
      </div>
    </div>
  );
}

function StaffDashboard({
  sentNotifications,
  selectedFlight,
  handleSendBoardingNotification,
  selectedInquiry,
  setSelectedInquiry,
  announcement,
  setAnnouncement,
  setBroadcastMessage,
}) {
  return (
    <div style={staffSectionStyle}>
      <h2 style={staffTitleStyle}>Staff Inquiry Dashboard</h2>
      <p style={staffSubtitleStyle}>
        Internal staff view for reviewing passenger inquiries.
      </p>

      <div style={staffToolBoxStyle}>
        <h3 style={smallHeadingStyle}>Boarding Notifications</h3>
        <p style={staffToolTextStyle}>
          Send boarding, delay, gate change, final call, and status updates to
          passengers.
        </p>
        <BoardingNotificationPanel
          onSendNotification={handleSendBoardingNotification}
          selectedFlight={selectedFlight}
        />
        <div style={notificationTypeListStyle}>
          {Object.entries(notificationTypes).map(([key, type]) => (
            <span key={key} style={notificationTypeStyle}>
              {type.label}
            </span>
          ))}
        </div>
        <p style={staffToolTextStyle}>
          Sent notifications: {sentNotifications.length}
        </p>
      </div>

      {customerInquiries.map((inquiry) => (
        <button
          key={inquiry.id}
          onClick={() => setSelectedInquiry(inquiry)}
          style={inquiryButtonStyle}
        >
          <strong>{inquiry.passenger}</strong>
          <span>
            {inquiry.type} - {inquiry.urgency}
          </span>
        </button>
      ))}

      {selectedInquiry && (
        <div style={staffInquiryStyle}>
          <h3 style={smallHeadingStyle}>Inquiry Details</h3>
          <p>
            <strong>Passenger:</strong> {selectedInquiry.passenger}
          </p>
          <p>
            <strong>Type:</strong> {selectedInquiry.type}
          </p>
          <p>
            <strong>Urgency:</strong> {selectedInquiry.urgency}
          </p>
          <p>
            <strong>Message:</strong> {selectedInquiry.message}
          </p>
        </div>
      )}

      <div style={staffToolBoxStyle}>
        <h3 style={smallHeadingStyle}>Airport Announcement System</h3>
        <textarea
          value={announcement}
          onChange={(event) => setAnnouncement(event.target.value)}
          placeholder="Enter airport announcement..."
          style={textAreaStyle}
        />
        <button
          onClick={() => setBroadcastMessage(announcement)}
          style={successButtonStyle}
        >
          Broadcast Announcement
        </button>
      </div>
    </div>
  );
}

function AIAssistant({
  messages,
  setMessages,
  flightInfo,
  weather,
  crowdData,
  restaurants,
  boardingPass,
}) {
  const [question, setQuestion] = useState("");

  const generateResponse = (text) => {
    const q = text.toLowerCase();

    if (q.includes("gate")) {
      return `Your flight ${flightInfo.flight} departs from Gate ${flightInfo.gate} in Terminal ${flightInfo.terminal}.`;
    }

    if (q.includes("weather")) {
      return `${weather.condition}, ${weather.temperature}. Delay risk is ${weather.delayRisk}.`;
    }

    if (q.includes("crowd")) {
      return `Least crowded area: ${crowdData.bestArea}.`;
    }

    if (q.includes("restaurant") || q.includes("food")) {
      return `Recommended: ${restaurants[0].name} (${restaurants[0].walkTime}).`;
    }

    if (q.includes("boarding")) {
      return `Boarding begins at ${flightInfo.boarding}.`;
    }

    if (q.includes("seat")) {
      return `Your seat is ${boardingPass.seat}.`;
    }

    return "I can help with flights, gates, boarding, weather, restaurants, baggage, and airport information.";
  };

  const sendMessage = () => {
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      content: question,
    };

    const aiMessage = {
      role: "assistant",
      content: generateResponse(question),
    };

    setMessages([...messages, userMessage, aiMessage]);
    setQuestion("");
  };

  return (
    <div style={detailBoxStyle}>
      <h3 style={smallHeadingStyle}>AI Travel Assistant</h3>

      <div
        style={{
          height: 400,
          overflowY: "auto",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: 12,
          marginBottom: 12,
          background: "#f8fafc",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: 10,
              textAlign:
                msg.role === "user"
                  ? "right"
                  : "left",
            }}
          >
            <strong>
              {msg.role === "user"
                ? "You"
                : "Assistant"}
            </strong>

            <div>{msg.content}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
        }}
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about your trip..."
          style={{
            flex: 1,
            height: "40px",
            padding: "0px 12px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            marginBottom: 0,
          }}
        />

        <button
          onClick={sendMessage}
           style={{
            width: "120px", 
            height: "40px",
            borderRadius: "8px",
            marginBottom: 0,
            backgroundColor: "#55b9a9",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          Ask
        </button>
      </div>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #e8eef5, #f9fafb)",
  fontFamily: "Arial, sans-serif",
  color: "#172033",
  padding: "32px 16px",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "28px",
};

const titleStyle = {
  fontSize: "42px",
  margin: "0 0 8px",
  color: "#0f172a",
};

const subtitleStyle = {
  color: "#64748b",
  margin: "0 0 16px",
};

const appContainerStyle = {
  maxWidth: "1280px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "0.8fr 1.6fr",
  gap: "24px",
  alignItems: "start",
};

const cardStyle = {
  backgroundColor: "white",
  padding: "28px",
  borderRadius: "18px",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.10)",
};

const sectionTitleStyle = {
  marginTop: 0,
  color: "#0f172a",
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "8px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "16px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontSize: "15px",
  boxSizing: "border-box",
};

const textAreaStyle = {
  width: "100%",
  minHeight: "100px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
  fontFamily: "Arial, sans-serif",
  marginTop: "10px",
  marginBottom: "12px",
};

const liveStatusPanelStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  backgroundColor: "#ecfeff",
  border: "1px solid #a5f3fc",
  borderRadius: "12px",
  padding: "14px",
  marginBottom: "12px",
};

const refreshButtonStyle = {
  padding: "9px 12px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#155e75",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const apiErrorStyle = {
  backgroundColor: "#fef3c7",
  border: "1px solid #f59e0b",
  color: "#92400e",
  padding: "10px",
  borderRadius: "10px",
  fontSize: "14px",
};

const toggleLabelStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "14px",
  color: "#334155",
  fontSize: "14px",
};

const infoGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
  marginTop: "12px",
};

const infoBoxStyle = {
  backgroundColor: "#f8fafc",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #e2e8f0",
};

const smallLabelStyle = {
  display: "block",
  color: "#64748b",
  fontSize: "13px",
  marginBottom: "4px",
};

const routeBoxStyle = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "14px",
  marginTop: "12px",
};

const priceSectionStyle = {
  marginTop: "20px",
  backgroundColor: "#f1f5f9",
  padding: "18px",
  borderRadius: "14px",
};

const smallHeadingStyle = {
  marginTop: 0,
  color: "#1e293b",
};

const priceGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "10px",
};

const priceCardStyle = {
  backgroundColor: "white",
  padding: "14px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const tabRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginBottom: "22px",
};

const tabStyle = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#f8fafc",
  cursor: "pointer",
  fontWeight: "bold",
  color: "#334155",
};

const activeTabStyle = {
  ...tabStyle,
  backgroundColor: "#1e3a5f",
  color: "white",
  border: "1px solid #1e3a5f",
};

const staffTabStyle = {
  ...tabStyle,
  color: "#be185d",
  border: "1px solid #f9a8d4",
  backgroundColor: "#fff1f2",
};

const activeStaffTabStyle = {
  ...tabStyle,
  backgroundColor: "#be185d",
  color: "white",
  border: "1px solid #be185d",
};

const primaryButtonStyle = {
  width: "100%",
  padding: "13px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#1e3a5f",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  marginBottom: "12px",
};

const secondaryButtonStyle = {
  ...primaryButtonStyle,
  backgroundColor: "#475569",
};

const thirdButtonStyle = {
  ...primaryButtonStyle,
  backgroundColor: "#0f766e",
};

const successButtonStyle = {
  ...primaryButtonStyle,
  backgroundColor: "#166534",
};

const detailBoxStyle = {
  backgroundColor: "#f8fafc",
  padding: "18px",
  borderRadius: "14px",
  border: "1px solid #e2e8f0",
  marginBottom: "16px",
};

const travelerSubTabRowStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "8px",
  backgroundColor: "#f1f5f9",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "8px",
  marginBottom: "16px",
};

const travelerSubTabStyle = {
  padding: "10px",
  borderRadius: "9px",
  border: "1px solid transparent",
  backgroundColor: "transparent",
  color: "#334155",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "13px",
};

const activeTravelerSubTabStyle = {
  ...travelerSubTabStyle,
  backgroundColor: "white",
  border: "1px solid #bfdbfe",
  color: "#1e3a5f",
  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
};

const travelerToolsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "16px",
  alignItems: "start",
};

const travelerToolsColumnStyle = {
  minWidth: 0,
};

const weatherSectionStyle = {
  ...detailBoxStyle,
  backgroundColor: "#f0fdfa",
  border: "1px solid #99f6e4",
};

const weatherHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
};

const weatherIntroStyle = {
  margin: "4px 0 14px",
  color: "#475569",
};

const weatherUpdatedStyle = {
  backgroundColor: "#ccfbf1",
  color: "#115e59",
  borderRadius: "999px",
  padding: "6px 10px",
  fontSize: "13px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const weatherSummaryStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  backgroundColor: "white",
  border: "1px solid #ccfbf1",
  borderRadius: "12px",
  padding: "14px",
  marginBottom: "12px",
};

const temperatureStyle = {
  fontSize: "34px",
  fontWeight: "bold",
  color: "#0f766e",
};

const weatherGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  marginBottom: "12px",
};

const weatherInfoBoxStyle = {
  backgroundColor: "white",
  border: "1px solid #ccfbf1",
  borderRadius: "10px",
  padding: "12px",
};

const weatherAlertStyle = {
  backgroundColor: "#fef3c7",
  border: "1px solid #f59e0b",
  color: "#78350f",
  borderRadius: "10px",
  padding: "12px",
  lineHeight: "1.5",
};

const crowdSectionStyle = {
  ...detailBoxStyle,
  backgroundColor: "#f5f3ff",
  border: "1px solid #ddd6fe",
};

const crowdHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
};

const crowdIntroStyle = {
  margin: "4px 0 14px",
  color: "#5b21b6",
};

const crowdUpdatedStyle = {
  backgroundColor: "#ede9fe",
  color: "#5b21b6",
  borderRadius: "999px",
  padding: "6px 10px",
  fontSize: "13px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const crowdSummaryStyle = {
  backgroundColor: "white",
  border: "1px solid #ddd6fe",
  borderRadius: "12px",
  padding: "14px",
  marginBottom: "12px",
};

const crowdSummaryTextStyle = {
  margin: "8px 0 0",
  color: "#334155",
  lineHeight: "1.5",
};

const crowdAreaListStyle = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "10px",
};

const crowdAreaCardStyle = {
  backgroundColor: "white",
  border: "1px solid #ddd6fe",
  borderRadius: "12px",
  padding: "12px",
};

const crowdAreaTopRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "10px",
  marginBottom: "10px",
};

const crowdLowBadgeStyle = {
  backgroundColor: "#dcfce7",
  color: "#166534",
  borderRadius: "999px",
  padding: "4px 9px",
  fontSize: "12px",
  fontWeight: "bold",
};

const crowdMediumBadgeStyle = {
  ...crowdLowBadgeStyle,
  backgroundColor: "#fef3c7",
  color: "#92400e",
};

const crowdHighBadgeStyle = {
  ...crowdLowBadgeStyle,
  backgroundColor: "#fee2e2",
  color: "#991b1b",
};

const crowdWaitStyle = {
  backgroundColor: "#fafafa",
  borderRadius: "10px",
  padding: "10px",
  marginBottom: "10px",
};

const crowdRecommendationStyle = {
  margin: 0,
  color: "#5b21b6",
  lineHeight: "1.45",
  fontWeight: "bold",
};

const restaurantSectionStyle = {
  ...detailBoxStyle,
  backgroundColor: "#fff7ed",
  border: "1px solid #fed7aa",
};

const restaurantHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
};

const restaurantIntroStyle = {
  margin: "4px 0 14px",
  color: "#7c2d12",
};

const restaurantGateBadgeStyle = {
  backgroundColor: "#ffedd5",
  color: "#9a3412",
  borderRadius: "999px",
  padding: "6px 10px",
  fontSize: "13px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const restaurantListStyle = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "10px",
};

const restaurantCardStyle = {
  backgroundColor: "white",
  border: "1px solid #fed7aa",
  borderRadius: "12px",
  padding: "12px",
};

const restaurantTopRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "10px",
  marginBottom: "4px",
};

const restaurantOpenBadgeStyle = {
  backgroundColor: "#dcfce7",
  color: "#166534",
  borderRadius: "999px",
  padding: "4px 8px",
  fontSize: "12px",
  fontWeight: "bold",
};

const restaurantBusyBadgeStyle = {
  ...restaurantOpenBadgeStyle,
  backgroundColor: "#fef3c7",
  color: "#92400e",
};

const restaurantLocationStyle = {
  margin: "8px 0",
  color: "#334155",
};

const restaurantMetaStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  color: "#9a3412",
  fontSize: "13px",
  fontWeight: "bold",
};

const activitySectionStyle = {
  ...detailBoxStyle,
  backgroundColor: "#f0f9ff",
  border: "1px solid #bae6fd",
};

const activityHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
};

const activityIntroStyle = {
  margin: "4px 0 14px",
  color: "#075985",
};

const activityCountStyle = {
  backgroundColor: "#e0f2fe",
  color: "#075985",
  borderRadius: "999px",
  padding: "6px 10px",
  fontSize: "13px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const activityCatalogStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  marginBottom: "14px",
};

const activityCardStyle = {
  backgroundColor: "white",
  border: "1px solid #bae6fd",
  borderRadius: "12px",
  padding: "12px",
};

const activityTopRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "8px",
  marginBottom: "8px",
};

const activityCategoryStyle = {
  backgroundColor: "#e0f2fe",
  color: "#0369a1",
  borderRadius: "999px",
  padding: "4px 8px",
  fontSize: "12px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const activityDetailStyle = {
  margin: "0 0 8px",
  color: "#334155",
  lineHeight: "1.4",
};

const activityMetaStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "8px",
  color: "#075985",
  fontSize: "13px",
  fontWeight: "bold",
  marginBottom: "10px",
};

const addActivityButtonStyle = {
  width: "100%",
  padding: "9px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#0369a1",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const disabledActivityButtonStyle = {
  ...addActivityButtonStyle,
  backgroundColor: "#94a3b8",
  cursor: "not-allowed",
};

const activityScheduleStyle = {
  backgroundColor: "white",
  border: "1px solid #bae6fd",
  borderRadius: "12px",
  padding: "14px",
};

const activityScheduleHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  marginBottom: "10px",
};

const activityScheduleTitleStyle = {
  margin: 0,
  color: "#0f172a",
};

const activityTotalTimeStyle = {
  color: "#075985",
  fontSize: "13px",
  fontWeight: "bold",
};

const activityEmptyStyle = {
  margin: 0,
  color: "#64748b",
};

const activityTimelineStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const activityTimelineItemStyle = {
  display: "grid",
  gridTemplateColumns: "28px 1fr auto",
  gap: "10px",
  alignItems: "center",
  backgroundColor: "#f8fafc",
  borderRadius: "10px",
  padding: "10px",
};

const activityStepStyle = {
  width: "28px",
  height: "28px",
  borderRadius: "999px",
  backgroundColor: "#0369a1",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "13px",
};

const activityTimelineTextStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "3px",
};

const removeActivityButtonStyle = {
  padding: "7px 9px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#991b1b",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

const boardingPassSectionStyle = {
  ...detailBoxStyle,
  backgroundColor: "#f8fbff",
};

const boardingPassHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
};

const boardingPassIntroStyle = {
  margin: "4px 0 14px",
  color: "#64748b",
};

const boardingPassCountStyle = {
  backgroundColor: "#dbeafe",
  color: "#1e3a8a",
  borderRadius: "999px",
  padding: "6px 10px",
  fontSize: "13px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

const boardingPassListStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "8px",
  marginBottom: "14px",
};

const boardingPassButtonStyle = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  backgroundColor: "white",
  color: "#1e293b",
  cursor: "pointer",
  textAlign: "left",
  display: "flex",
  flexDirection: "column",
  gap: "3px",
};

const activeBoardingPassButtonStyle = {
  ...boardingPassButtonStyle,
  border: "1px solid #1e3a5f",
  backgroundColor: "#e0f2fe",
};

const boardingPassCardStyle = {
  backgroundColor: "white",
  border: "1px solid #bfdbfe",
  borderRadius: "14px",
  padding: "16px",
  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)",
};

const boardingPassTopRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  marginBottom: "14px",
};

const tripStatusBadgeStyle = {
  backgroundColor: "#dcfce7",
  color: "#166534",
  borderRadius: "999px",
  padding: "6px 10px",
  fontSize: "13px",
  fontWeight: "bold",
  alignSelf: "flex-start",
};

const boardingRouteStyle = {
  borderTop: "1px dashed #cbd5e1",
  borderBottom: "1px dashed #cbd5e1",
  padding: "14px 0",
  marginBottom: "14px",
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  color: "#1e293b",
};

const boardingInfoGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "12px",
  marginBottom: "16px",
};

const boardingBarcodeStyle = {
  height: "72px",
  backgroundColor: "#f8fafc",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  marginBottom: "10px",
};

const barcodeLineStyle = {
  width: "4px",
  height: "48px",
  backgroundColor: "#0f172a",
  display: "block",
};

const boardingConfirmationStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  color: "#334155",
  fontSize: "13px",
};

const staffSectionStyle = {
  backgroundColor: "#fff1f2",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid #f9a8d4",
};

const staffTitleStyle = {
  marginTop: 0,
  color: "#9d174d",
};

const staffSubtitleStyle = {
  color: "#9f1239",
};

const staffToolBoxStyle = {
  backgroundColor: "white",
  border: "1px solid #f9a8d4",
  borderRadius: "14px",
  padding: "16px",
  marginBottom: "16px",
};

const staffToolTextStyle = {
  color: "#9f1239",
  marginTop: 0,
};

const notificationTypeListStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "12px",
  marginBottom: "10px",
};

const notificationTypeStyle = {
  backgroundColor: "#fce7f3",
  color: "#9d174d",
  borderRadius: "999px",
  padding: "6px 10px",
  fontSize: "13px",
  fontWeight: "bold",
};

const notificationListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const unreadNotificationStyle = {
  backgroundColor: "#eff6ff",
  border: "1px solid #93c5fd",
  borderRadius: "10px",
  padding: "12px",
};

const readNotificationStyle = {
  ...unreadNotificationStyle,
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
};

const notificationMessageStyle = {
  margin: "8px 0",
};

const markReadButtonStyle = {
  marginTop: "8px",
  padding: "6px 10px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#1e3a5f",
  color: "white",
  cursor: "pointer",
};

const buttonWrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginBottom: "16px",
};

const airportActionStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
};

const smallButtonStyle = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#1e3a5f",
  color: "white",
  cursor: "pointer",
};

const mapButtonStyle = {
  ...smallButtonStyle,
  backgroundColor: "#0284c7",
};

const savedMapButtonStyle = {
  marginLeft: "10px",
  padding: "5px 9px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#0284c7",
  color: "white",
  cursor: "pointer",
};

const removeButtonStyle = {
  marginLeft: "10px",
  padding: "5px 9px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#991b1b",
  color: "white",
  cursor: "pointer",
};

const favoriteItemStyle = {
  marginBottom: "10px",
};

const mapBoxStyle = {
  marginTop: "18px",
  backgroundColor: "white",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "14px",
};

const mapHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  marginBottom: "10px",
};

const mapTitleStyle = {
  margin: 0,
  color: "#1e293b",
};

const closeMapButtonStyle = {
  padding: "7px 10px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#991b1b",
  color: "white",
  cursor: "pointer",
};

const mapFrameStyle = {
  border: 0,
  borderRadius: "10px",
};

const inquiryButtonStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #f9a8d4",
  backgroundColor: "white",
  cursor: "pointer",
  marginBottom: "10px",
  textAlign: "left",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const staffInquiryStyle = {
  backgroundColor: "#fdf2f8",
  padding: "18px",
  borderRadius: "14px",
  border: "1px solid #f9a8d4",
  marginTop: "16px",
  marginBottom: "16px",
};

const broadcastBannerStyle = {
  maxWidth: "1000px",
  margin: "0 auto 20px",
  backgroundColor: "#fef3c7",
  border: "2px solid #f59e0b",
  padding: "18px",
  borderRadius: "12px",
  textAlign: "center",
  color: "#92400e",
};

const broadcastMessageStyle = {
  marginTop: "10px",
  fontWeight: "normal",
};

const alertOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(15, 23, 42, 0.86)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10000,
  padding: "16px",
};

const alertModalStyle = {
  backgroundColor: "white",
  borderRadius: "16px",
  maxWidth: "520px",
  width: "100%",
  maxHeight: "85vh",
  overflow: "auto",
  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
};

const alertBodyStyle = {
  padding: "24px",
};

const alertTitleStyle = {
  margin: "0 0 16px",
  color: "#0f172a",
};

const alertMessageStyle = {
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 20px",
  color: "#334155",
};

const alertActionBoxStyle = {
  backgroundColor: "#fef3c7",
  borderLeft: "4px solid #f59e0b",
  padding: "14px",
  borderRadius: "10px",
  marginBottom: "14px",
};

const alertSafeBoxStyle = {
  backgroundColor: "#dcfce7",
  borderLeft: "4px solid #16a34a",
  padding: "14px",
  borderRadius: "10px",
};

const alertBoxTextStyle = {
  margin: "8px 0 0",
  color: "#334155",
};

const alertFooterStyle = {
  padding: "16px 24px",
  borderTop: "1px solid #e2e8f0",
  backgroundColor: "#f8fafc",
};

const alertButtonStyle = {
  width: "100%",
  padding: "14px",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
};

export default App;
