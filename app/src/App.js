import { useState } from "react";

function App() {
  const [showTransport, setShowTransport] = useState(false);
  const [showBaggage, setShowBaggage] = useState(false);
  const [selectedAirline, setSelectedAirline] = useState("American");
  const [showPolicy, setShowPolicy] = useState(false);
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
      policy: [
        "1 free carry-on bag included",
        "Check-in closes 45 minutes before departure",
        "Face covering optional during travel",
      ],
      baggageClaim: "Carousel 5",
    },
    Delta: {
      flight: "DL456",
      status: "Delayed",
      gate: "C4",
      terminal: "1",
      boarding: "4:10 PM",
      policy: [
        "Free Wi-Fi available on select flights",
        "Boarding begins 40 minutes before departure",
        "Changes allowed with applicable fare difference",
      ],
      baggageClaim: "Carousel 9",
    },
    United: {
      flight: "UA789",
      status: "Boarding Soon",
      gate: "A8",
      terminal: "3",
      boarding: "6:45 PM",
      policy: [
        "Basic Economy has limited seat selection",
        "Carry-on allowed for most fares",
        "Arrive at gate at least 30 minutes before departure",
      ],
      baggageClaim: "Carousel 2",
    },
  };

  const priceOptions = {
    Budget: "$120",
    Standard: "$280",
    Premium: "$540",
  };

  const flightInfo = airlineFlights[selectedAirline];

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>✈️ Air Travel Assist</h1>

      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2>Search Flight</h2>

        <label>Select Airline</label>
        <select
          value={selectedAirline}
          onChange={(e) => setSelectedAirline(e.target.value)}
        >
          <option value="American">American Airlines</option>
          <option value="Delta">Delta Airlines</option>
          <option value="United">United Airlines</option>
        </select>

        <div>
          <h3>Flight Information</h3>
          <p>Flight: {flightInfo.flight}</p>
          <p>Status: {flightInfo.status}</p>
          <p>Gate: {flightInfo.gate}</p>
          <p>Terminal: {flightInfo.terminal}</p>
          <p>Boarding: {flightInfo.boarding}</p>
        </div>

        <div>
          <h3>Price Options</h3>
          <p>Budget: {priceOptions.Budget}</p>
          <p>Standard: {priceOptions.Standard}</p>
          <p>Premium: {priceOptions.Premium}</p>
        </div>

        <button onClick={() => setShowPolicy(!showPolicy)}>
          {showPolicy ? "Hide Policy" : "Show Policy"}
        </button>

        {showPolicy && (
          <ul>
            {flightInfo.policy.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        )}

        <button onClick={() => setShowBaggage(!showBaggage)}>
          {showBaggage ? "Hide Baggage" : "Show Baggage"}
        </button>

        {showBaggage && (
          <div>
            <p>Baggage: {flightInfo.baggageClaim}</p>
          </div>
        )}

        <button onClick={() => setShowTransport(!showTransport)}>
          {showTransport ? "Hide Transport" : "Show Transport"}
        </button>

        {showTransport && (
          <ul>
            <li>Taxi</li>
            <li>Uber / Lyft</li>
            <li>Shuttle</li>
          </ul>
        )}

        <h3>Favorite Airports</h3>
        {airports.map((a) => (
          <button key={a} onClick={() => saveFavoriteLocation(a)}>
            Save {a}
          </button>
        ))}

        <ul>
          {favoriteLocations.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;