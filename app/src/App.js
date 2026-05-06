import { useState } from "react";

function App() {
  const [flight, setFlight] = useState("");
  const [showTransport, setShowTransport] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState("American");

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

  return (
    <div style={{
      backgroundColor: "#f4f6fb",
      minHeight: "100vh",
      padding: "30px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ textAlign: "center" }}>✈️ Air Travel Assist</h1>

      <div style={{
        maxWidth: "420px",
        margin: "30px auto",
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
      }}>
        <h2>Enter Flight</h2>
        <h3>Select Airline</h3>

<select
  value={selectedAirline}
  onChange={(e) => setSelectedAirline(e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "6px",
  }}
>
  <option value="American">American Airlines</option>
  <option value="Delta">Delta Airlines</option>
  <option value="United">United Airlines</option>
</select>

        <input
  type="text"
  value={airlineFlights[selectedAirline].flight}
  readOnly
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  }}
/>

        <h3>Flight Information</h3>
<p><strong>Flight:</strong> {airlineFlights[selectedAirline].flight}</p>
<p><strong>Status:</strong> {airlineFlights[selectedAirline].status}</p>

<h3>Gate & Terminal</h3>
<p><strong>Gate:</strong> {airlineFlights[selectedAirline].gate}</p>
<p><strong>Terminal:</strong> {airlineFlights[selectedAirline].terminal}</p>

<h3>Boarding</h3>
<p><strong>Boarding Time:</strong> {airlineFlights[selectedAirline].boarding}</p>

        <hr style={{ margin: "20px 0" }} />

        <button
          onClick={() => setShowTransport(!showTransport)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer"
          }}
        >
          {showTransport ? "Hide Transportation Options" : "View Transportation Options"}
        </button>

        {showTransport && (
          <div style={{ marginTop: "15px" }}>
            <h3>Transportation Options</h3>
            <ul>
              <li>🚕 Taxi</li>
              <li>🚗 Uber / Lyft</li>
              <li>🚌 Airport Shuttle</li>
              <li>🚆 Train / Metro</li>
              <li>🚐 Rental Car Pickup</li>
            </ul>
          </div>
        )}
      </div>
    </div>
    
  );
}

export default App;