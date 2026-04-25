import { useState } from "react";

function App() {
  const [flight, setFlight] = useState("");

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

        <input
          type="text"
          placeholder="Example: AA123"
          value={flight}
          onChange={(e) => setFlight(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        <h3>Flight Information</h3>
        <p><strong>Flight:</strong> {flight || "AA123"}</p>
        <p><strong>Status:</strong> On Time</p>

        <h3>Gate & Terminal</h3>
        <p><strong>Gate:</strong> B12</p>
        <p><strong>Terminal:</strong> 2</p>

        <h3>Boarding</h3>
        <p><strong>Boarding Time:</strong> 2:30 PM</p>
      </div>
    </div>
  );
}

export default App;