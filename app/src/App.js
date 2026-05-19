import { useState } from "react";

function App() {
  const [showTransport, setShowTransport] = useState(false);
  const [showBaggage, setShowBaggage] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState("American");
  const [favoriteLocations, setFavoriteLocations] = useState([]);
  const [selectedAirportMap, setSelectedAirportMap] = useState(null);
  const [showMap, setShowMap] = useState(false);

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

  const saveFavoriteLocation = (airport) => {
    if (!favoriteLocations.includes(airport)) {
      setFavoriteLocations([...favoriteLocations, airport]);
    }
  };

  const removeFavoriteLocation = (airport) => {
    setFavoriteLocations(favoriteLocations.filter((fav) => fav !== airport));
  };

  const airlineFlights = {
    American: {
      flight: "AA123",
      status: "On Time",
      gate: "B12",
      terminal: "2",
      boarding: "2:30 PM",
      baggageClaim: "Carousel 5",
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
      policy: [
        "Basic Economy has limited seat selection",
        "Carry-on allowed for most fares",
        "Arrive at gate at least 30 minutes before departure",
      ],
    },
  };

  const priceOptions = {
    Budget: "$120",
    Standard: "$280",
    Premium: "$540",
  };

  const flightInfo = airlineFlights[selectedAirline];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #eef4ff, #f8fafc)",
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", fontSize: "42px", marginBottom: "8px" }}>
        ✈️ Air Travel Assist
      </h1>

      <p style={{ textAlign: "center", color: "#555", marginBottom: "30px" }}>
        Quickly view flight, boarding, pricing, airline policy, baggage, and airport transportation details.
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

          <button style={{ ...buttonStyle, backgroundColor: "#16a34a" }}>
            Submit Support Request
          </button>
        </div>
      </div>
    </div>
  );
}

const sectionStyle = {
  marginTop: "20px",
  backgroundColor: "#f8fafc",
  padding: "20px",
  borderRadius: "14px",
  marginBottom: "20px",
};

const buttonStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  color: "white",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  marginBottom: "15px",
};

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