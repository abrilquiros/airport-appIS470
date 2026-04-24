import { useState } from "react";

function App() {
  const [flight, setFlight] = useState("");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Air Travel Assist</h1>

      <h2>Enter Flight</h2>
      <input
        type="text"
        placeholder="Enter flight number"
        value={flight}
        onChange={(e) => setFlight(e.target.value)}
      />

      <h2>Flight Information</h2>
      <p><strong>Flight:</strong> {flight || "N/A"}</p>
      <p><strong>Status:</strong> On Time</p>

      <h2>Gate Information</h2>
      <p><strong>Gate:</strong> B12</p>
      <p><strong>Terminal:</strong> 2</p>

      <h2>Boarding</h2>
      <p><strong>Boarding Time:</strong> 2:30 PM</p>
    </div>
  );
}

export default App;