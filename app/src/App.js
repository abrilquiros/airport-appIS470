import { useState } from "react";

function App() {
  const [showTransport, setShowTransport] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState("American");
  const [favoriteLocations, setFavoriteLocations] = useState([]);

  const airports = ["LAX", "SAN", "JFK", "PDX", "SEA"];

  const saveFavoriteLocation = (airport) => {
    if (!favoriteLocations.includes(airport)) {
      setFavoriteLocations([...favoriteLocations, airport]);
    }
  };

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