import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

const cities = {
  Helsinki: { lat: 60.1699, lng: 24.9384 },
  Tampere: { lat: 61.4978, lng: 23.761 },
  Turku: { lat: 60.4518, lng: 22.2666 },
  Lahti: { lat: 60.9827, lng: 25.6615 },
  Jyväskylä: { lat: 62.2426, lng: 25.7473 },
  Oulu: { lat: 65.0121, lng: 25.4651 },
};

function calculateDistanceKm(from, to) {
  const R = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((from.lat * Math.PI) / 180) *
      Math.cos((to.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function formatHours(decimalHours) {
  const h = Math.floor(decimalHours);
  const min = Math.round((decimalHours - h) * 60);
  return `${h} h ${min} min`;
}

export default function App() {
  const [theme, setTheme] = useState("classic");
  const [loadingCity, setLoadingCity] = useState("Helsinki");
  const [unloadingCity, setUnloadingCity] = useState("Tampere");
  const [startTime, setStartTime] = useState("08:00");
  const [trailerType, setTrailerType] = useState("Box trailer");
  const [tractor, setTractor] = useState("DTV171");
  const [loadRef, setLoadRef] = useState("00055871733");

  const plan = useMemo(() => {
    const from = cities[loadingCity];
    const to = cities[unloadingCity];
    const distanceKm = calculateDistanceKm(from, to);
    const avgSpeed = 72;
    const drivingHours = distanceKm / avgSpeed;

    const breakMinutes = drivingHours > 4.5 ? 45 : 0;
    const totalHours = drivingHours + breakMinutes / 60;

    const dailyLimit = 9;
    const bufferHours = dailyLimit - drivingHours;

    const [startH, startM] = startTime.split(":").map(Number);
    const eta = new Date();
    eta.setHours(startH, startM, 0, 0);
    eta.setMinutes(eta.getMinutes() + Math.round(totalHours * 60));

    const status =
      drivingHours > 9
        ? "Risk"
        : drivingHours > 4.5
        ? "Break required"
        : "OK";

    return {
      from,
      to,
      route: [
        [from.lat, from.lng],
        [to.lat, to.lng],
      ],
      distanceKm,
      drivingHours,
      breakMinutes,
      totalHours,
      bufferHours,
      eta: eta.toTimeString().slice(0, 5),
      status,
    };
  }, [loadingCity, unloadingCity, startTime]);

  const eventLog = [
    `Load ${loadRef} planned from ${loadingCity} to ${unloadingCity}.`,
    `Tractor ${tractor} assigned.`,
    `${trailerType} selected.`,
    plan.breakMinutes > 0
      ? "EU driving time: 45 min break required after 4h30 driving."
      : "EU driving time: no break required before destination.",
    plan.bufferHours < 1
      ? "Low buffer: check schedule, unloading window and possible delay risk."
      : "Schedule buffer is acceptable.",
  ];

  return (
    <div className={`app ${theme}`}>
      <header className="topbar">
        <div>
          <h1>Traffic Coordinator Planner</h1>
          <span>TMS-style transport planning dashboard</span>
        </div>

        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="classic">Classic</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </header>

      <main className="planner-grid">
        <section className="panel form-panel">
          <h2>Lastaus</h2>
          <label>Load reference</label>
          <input value={loadRef} onChange={(e) => setLoadRef(e.target.value)} />

          <label>Lastauspaikka</label>
          <select
            value={loadingCity}
            onChange={(e) => setLoadingCity(e.target.value)}
          >
            {Object.keys(cities).map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>

          <label>Lähtöaika</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </section>

        <section className="panel form-panel">
          <h2>Purku</h2>
          <label>Purkupaikka</label>
          <select
            value={unloadingCity}
            onChange={(e) => setUnloadingCity(e.target.value)}
          >
            {Object.keys(cities).map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>

          <label>Purkuikkuna</label>
          <input value="Same day / next day" readOnly />

          <label>Purkuriski</label>
          <input value="Normal access" readOnly />
        </section>

        <section className="panel form-panel">
          <h2>Kalusto</h2>
          <label>Vetäjä</label>
          <select value={tractor} onChange={(e) => setTractor(e.target.value)}>
            <option>DTV171</option>
            <option>DTV169</option>
            <option>DVI253</option>
          </select>

          <label>Trailerityyppi</label>
          <select
            value={trailerType}
            onChange={(e) => setTrailerType(e.target.value)}
          >
            <option>Box trailer</option>
            <option>Side-opening box</option>
            <option>Thermo trailer</option>
            <option>Curtain trailer</option>
          </select>

          <label>Soveltuvuus</label>
          <input value="Checked" readOnly />
        </section>

        <section className="panel route-panel">
          <div className="panel-header">
            <h2>Reitti + kartta</h2>
            <span>
              {loadingCity} → {unloadingCity}
            </span>
          </div>

          <MapContainer center={[61.2, 25.0]} zoom={6} className="map">
            <TileLayer
              attribution="&copy; OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[plan.from.lat, plan.from.lng]}>
              <Popup>Lastaus: {loadingCity}</Popup>
            </Marker>

            <Marker position={[plan.to.lat, plan.to.lng]}>
              <Popup>Purku: {unloadingCity}</Popup>
            </Marker>

            <Polyline positions={plan.route} />
          </MapContainer>
        </section>

        <section className="panel result-panel">
          <h2>Ajotiedot / tulos</h2>

          <div className={`status ${plan.status.toLowerCase().replace(" ", "-")}`}>
            {plan.status}
          </div>

          <dl>
            <dt>Etäisyys</dt>
            <dd>{plan.distanceKm} km</dd>

            <dt>Ajoaika</dt>
            <dd>{formatHours(plan.drivingHours)}</dd>

            <dt>Tauko</dt>
            <dd>{plan.breakMinutes} min</dd>

            <dt>Kokonaisaika</dt>
            <dd>{formatHours(plan.totalHours)}</dd>

            <dt>ETA</dt>
            <dd>{plan.eta}</dd>

            <dt>Pelivara</dt>
            <dd>{formatHours(Math.max(plan.bufferHours, 0))}</dd>
          </dl>
        </section>

        <section className="panel notes-panel">
          <h2>Suunnitelman huomautukset / event log</h2>
          <ul>
            {eventLog.map((item, index) => (
              <li key={index}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}