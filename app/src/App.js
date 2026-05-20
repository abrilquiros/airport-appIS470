import { useEffect, useState } from "react";

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
  const [activeSection, setActiveSection] = useState("traveler");
  const [showTransport, setShowTransport] = useState(false);
  const [showBaggage, setShowBaggage] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState("American");
  const [favoriteLocations, setFavoriteLocations] = useState([]);
  const [selectedAirportMap, setSelectedAirportMap] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [liveFlightData, setLiveFlightData] = useState(demoLiveFlights.American);
  const [isLoadingLiveData, setIsLoadingLiveData] = useState(false);
  const [apiError, setApiError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const airports = [
  {
    code: "LAX",
    name: "Los Angeles International Airport",
    map: "https://www.google.com/maps?q=LAX+Airport&output=embed",
  },
  {
    code: "SAN",
    name: "San Diego International Airport",
    map: "https://www.google.com/maps?q=SAN+Airport&output=embed",
  },
  {
    code: "JFK",
    name: "John F. Kennedy International Airport",
    map: "https://www.google.com/maps?q=JFK+Airport&output=embed",
  },
  {
    code: "PDX",
    name: "Portland International Airport",
    map: "https://www.google.com/maps?q=PDX+Airport&output=embed",
  },
  {
    code: "SEA",
    name: "Seattle-Tacoma International Airport",
    map: "https://www.google.com/maps?q=SEA+Airport&output=embed",
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

  const flightInfo = airlineFlights[selectedAirline];
  const displayFlightInfo = {
    ...flightInfo,
    ...liveFlightData,
  };

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

  const buildFallbackFlight = () => ({
    ...demoLiveFlights[selectedAirline],
    updatedBy: AVIATIONSTACK_API_KEY
      ? "Fallback after API issue"
      : "Demo fallback data - add an API key for live results",
  });

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

  const fetchLiveFlightData = async () => {
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
  };

  useEffect(() => {
    fetchLiveFlightData();
  }, [selectedAirline]);

  useEffect(() => {
    if (!autoRefresh) {
      return undefined;
    }

    const refreshTimer = setInterval(fetchLiveFlightData, REFRESH_INTERVAL_MS);
    return () => clearInterval(refreshTimer);
  }, [autoRefresh, selectedAirline]);

  const saveFavoriteLocation = (airport) => {
    if (!favoriteLocations.includes(airport)) {
      setFavoriteLocations([...favoriteLocations, airport]);
    }
  };

  const removeFavoriteLocation = (airport) => {
    setFavoriteLocations(favoriteLocations.filter((fav) => fav !== airport));
  };

  return (
    <div style={pageStyle}>
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
            onChange={(e) => setSelectedAirline(e.target.value)}
            style={inputStyle}
          >
            <option value="American">American Airlines</option>
            <option value="Delta">Delta Airlines</option>
            <option value="United">United Airlines</option>
          </select>

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

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Flight Information</h3>
          <p><strong>Flight:</strong> {flightInfo.flight}</p>
          <p><strong>Status:</strong> {flightInfo.status}</p>
          <p><strong>Gate:</strong> {flightInfo.gate}</p>
          <p><strong>Terminal:</strong> {flightInfo.terminal}</p>
          <p><strong>Boarding Time:</strong> {flightInfo.boarding}</p>
        </div>

        <div style={{ ...sectionStyle, backgroundColor: "#eff6ff" }}>
          <h3 style={{ marginTop: 0 }}>Price Options</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={priceCardStyle}><strong>Budget</strong><br />{priceOptions.Budget}</div>
            <div style={priceCardStyle}><strong>Standard</strong><br />{priceOptions.Standard}</div>
            <div style={priceCardStyle}><strong>Premium</strong><br />{priceOptions.Premium}</div>
          </div>
        </div>

        <button onClick={() => setShowPolicy(!showPolicy)} style={{ ...buttonStyle, backgroundColor: "#0f766e" }}>
          {showPolicy ? "Hide Airline Policy" : "View Airline Policy"}
        </button>

        {showPolicy && (
          <div style={{ ...sectionStyle, backgroundColor: "#ecfeff" }}>
            <h3 style={{ marginTop: 0 }}>Airline Policy - {selectedAirline}</h3>
            <ul style={{ lineHeight: "1.8" }}>
              {flightInfo.policy.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <button onClick={() => setShowBaggage(!showBaggage)} style={{ ...buttonStyle, backgroundColor: "#9333ea" }}>
          {showBaggage ? "Hide Baggage Claim Information" : "Check Baggage Claim Information"}
        </button>

        {showBaggage && (
          <div style={{ ...sectionStyle, backgroundColor: "#faf5ff" }}>
            <h3 style={{ marginTop: 0 }}>🧳 Baggage Claim Information</h3>
            <p><strong>Flight:</strong> {flightInfo.flight}</p>
            <p><strong>Terminal:</strong> {flightInfo.terminal}</p>
            <p><strong>Baggage Claim:</strong> {flightInfo.baggageClaim}</p>
            <p>Please proceed to the assigned carousel after arrival to retrieve your luggage.</p>
          </div>
        )}

        <button onClick={() => setShowTransport(!showTransport)} style={{ ...buttonStyle, backgroundColor: "#2563eb" }}>
          {showTransport ? "Hide Transportation Options" : "View Transportation Options"}
        </button>

        {showTransport && (
          <div style={sectionStyle}>
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

        <div style={sectionStyle}>
         <h3>⭐ Favorite Airports</h3>

        {airports.map((airport) => (
          <div
            key={airport.code}
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "10px",
              flexWrap: "wrap",
            }}
           >
            <button
              onClick={() => saveFavoriteLocation(airport.code)}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#4f46e5",
                color: "white",
                cursor: "pointer",
              }}
            >
              Save {airport.code}
            </button>

            <button
              onClick={() => {
                setSelectedAirportMap(airport);
                setShowMap(true);
              }}
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#0ea5e9",
                color: "white",
                cursor: "pointer",
              }}
            >
              View Map
            </button>
          </div>
        ))}

  <div style={{ marginTop: "15px" }}>
    <h4>Saved Locations:</h4>

    {favoriteLocations.length === 0 ? (
      <p>No favorite airports saved yet.</p>
    ) : (
      <ul>
        {favoriteLocations.map((airportCode) => {
          const airportData = airports.find(
            (a) => a.code === airportCode
          );

          return (
            <li
              key={airportCode}
              style={{ marginBottom: "12px" }}
            >
              ✈️ {airportCode}

              <button
                onClick={() => {
                  setSelectedAirportMap(airportData);
                  setShowMap(true);
                }}
                style={{
                  marginLeft: "10px",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#0284c7",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                View Map
              </button>

              <button
                onClick={() =>
                  removeFavoriteLocation(airportCode)
                }
                style={{
                  marginLeft: "10px",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#dc2626",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    )}
  </div>

  {showMap && selectedAirportMap && (
    <div
      style={{
        marginTop: "20px",
        backgroundColor: "white",
        padding: "15px",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h4 style={{ margin: 0 }}>
          🗺️ {selectedAirportMap.name}
        </h4>

        <button
          onClick={() => setShowMap(false)}
          style={{
            padding: "6px 10px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#ef4444",
            color: "white",
            cursor: "pointer",
          }}
        >
          Close Map
        </button>
      </div>

      <iframe
        title="Airport Map"
        src={selectedAirportMap.map}
        width="100%"
        height="350"
        style={{
          border: 0,
          borderRadius: "12px",
        }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>
    </div>
  )}
</div>

        <div style={sectionStyle}>
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
            
          <input
            type="text"
            value={displayFlightInfo.flight}
            readOnly
            style={{ ...inputStyle, backgroundColor: "#f8fafc" }}>
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
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh every 60 seconds
          </label>

          <div style={infoGridStyle}>
            <div style={infoBoxStyle}>
              <span style={smallLabelStyle}>Status</span>
              <strong>{displayFlightInfo.status}</strong>
            </div>
            <div style={infoBoxStyle}>
              <span style={smallLabelStyle}>Gate</span>
              <strong>{displayFlightInfo.gate}</strong>
            </div>
            <div style={infoBoxStyle}>
              <span style={smallLabelStyle}>Terminal</span>
              <strong>{displayFlightInfo.terminal}</strong>
            </div>
            <div style={infoBoxStyle}>
              <span style={smallLabelStyle}>Boarding</span>
              <strong>{displayFlightInfo.boarding}</strong>
            </div>
            <div style={infoBoxStyle}>
              <span style={smallLabelStyle}>Delay</span>
              <strong>{displayFlightInfo.delay}</strong>
            </div>
            <div style={infoBoxStyle}>
              <span style={smallLabelStyle}>Last Updated</span>
              <strong>
                {lastUpdated
                  ? lastUpdated.toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : "Not updated yet"}
              </strong>
            </div>
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
              <div style={priceCardStyle}>
                <strong>Budget</strong>
                <span>{flightInfo.prices.Budget}</span>
              </div>
              <div style={priceCardStyle}>
                <strong>Standard</strong>
                <span>{flightInfo.prices.Standard}</span>
              </div>
              <div style={priceCardStyle}>
                <strong>Premium</strong>
                <span>{flightInfo.prices.Premium}</span>
              </div>
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
            <div>
              <h2 style={sectionTitleStyle}>Traveler Tools</h2>

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
                    {flightInfo.policy.map((item, index) => (
                      <li key={index}>{item}</li>
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
                    <strong>Baggage Claim:</strong>{" "}
                    {displayFlightInfo.baggageClaim}
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
                <h3 style={smallHeadingStyle}>Favorite Airports</h3>
                <div style={buttonWrapStyle}>
                  {airports.map((airport) => (
                    <button
                      key={airport}
                      onClick={() => saveFavoriteLocation(airport)}
                      style={smallButtonStyle}
                    >
                      Save {airport}
                    </button>
                  ))}
                </div>

                <h4>Saved Locations</h4>

                {favoriteLocations.length === 0 ? (
                  <p>No favorite airports saved yet.</p>
                ) : (
                  <ul>
                    {favoriteLocations.map((airport) => (
                      <li key={airport} style={favoriteItemStyle}>
                        {airport}
                        <button
                          onClick={() => removeFavoriteLocation(airport)}
                          style={removeButtonStyle}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {activeSection === "support" && (
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

                <textarea
                  placeholder="Describe your travel issue..."
                  style={textAreaStyle}
                />

                <button style={successButtonStyle}>Submit Support Request</button>
              </div>
            </div>
          )}

          {activeSection === "staff" && (
            <div style={staffSectionStyle}>
              <h2 style={staffTitleStyle}>Staff Inquiry Dashboard</h2>
              <p style={staffSubtitleStyle}>
                Internal staff view for reviewing passenger inquiries.
              </p>

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
            </div>
          )}
        </section>
      </main>
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
  maxWidth: "1000px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "1fr 1.2fr",
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

const buttonWrapStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginBottom: "16px",
};

const smallButtonStyle = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#1e3a5f",
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
};

export default App;
