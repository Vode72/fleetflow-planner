import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

const cities = {
  Helsinki: { lat: 60.1699, lng: 24.9384 },
  Tampere: { lat: 61.4978, lng: 23.761 },
  Turku: { lat: 60.4518, lng: 22.2666 },
  Lahti: { lat: 60.9827, lng: 25.6615 },
  Jyvaskyla: { lat: 62.2426, lng: 25.7473 },
  Oulu: { lat: 65.0121, lng: 25.4651 },
  Hanko: { lat: 59.8236, lng: 22.9681 },
  Vantaa: { lat: 60.2934, lng: 25.0378 },
  Kerava: { lat: 60.4034, lng: 25.105 },
  Kotka: { lat: 60.4666, lng: 26.9459 },
};

const dailyJobs = [
  {
    id: "JOB-001",
    flowType: "Import",
    jobType: "Purku",
    customer: "Nordic Demo Plastics Oy",
    originCity: "Helsinki",
    destinationCity: "Tampere",
    timeWindow: "10:00-13:00",
    truck: "TRK-101",
    status: "OK",
  },
  {
    id: "JOB-002",
    flowType: "Export",
    jobType: "Lastaus",
    customer: "Baltic Demo Foods Oy",
    originCity: "Lahti",
    destinationCity: "Hanko",
    timeWindow: "12:00-16:00",
    truck: "TRK-102",
    status: "Risk",
  },
  {
    id: "JOB-003",
    flowType: "Domestic",
    jobType: "Jakelu",
    customer: "Demo Retail Finland Oy",
    originCity: "Vantaa",
    destinationCity: "Turku",
    timeWindow: "09:00-15:00",
    truck: "TRK-101",
    status: "Break required",
  },
  {
    id: "JOB-004",
    flowType: "Transfer",
    jobType: "Siirto",
    customer: "Internal Demo Transfer",
    originCity: "Kerava",
    destinationCity: "Kotka",
    timeWindow: "14:00-18:00",
    truck: "Unassigned",
    status: "Open",
  },
];

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

function getJobStatusClass(status) {
  switch (status) {
    case "OK":
      return "status-pill status-ok";
    case "Break required":
      return "status-pill status-break";
    case "Risk":
      return "status-pill status-risk";
    case "Open":
      return "status-pill status-open";
    default:
      return "status-pill status-open";
  }
}

export default function App() {
  const [theme, setTheme] = useState("classic");
  const [loadingCity, setLoadingCity] = useState("Helsinki");
  const [unloadingCity, setUnloadingCity] = useState("Tampere");
  const [selectedJobId, setSelectedJobId] = useState(dailyJobs[0].id);
  const [startTime, setStartTime] = useState("08:00");
  const [trailerType, setTrailerType] = useState("Box trailer");
  const [tractor, setTractor] = useState("TRK-101");
  const [loadRef, setLoadRef] = useState("FFL-2026-001");
  const [driverHoursToday, setDriverHoursToday] = useState(3.5);

  const selectedJob =
    dailyJobs.find((job) => job.id === selectedJobId) || dailyJobs[0];

  const plan = useMemo(() => {
    const from = cities[loadingCity];
    const to = cities[unloadingCity];
    const distanceKm = calculateDistanceKm(from, to);
    const avgSpeed = 72;
    const drivingHours = distanceKm / avgSpeed;

    const dailyLimit = 9;
    const totalDrivingWithHistory = driverHoursToday + drivingHours;

    const breakMinutes = totalDrivingWithHistory > 4.5 ? 45 : 0;
    const totalHours = drivingHours + breakMinutes / 60;
    const bufferHours = dailyLimit - totalDrivingWithHistory;

    const [startH, startM] = startTime.split(":").map(Number);
    const eta = new Date();
    eta.setHours(startH, startM, 0, 0);
    eta.setMinutes(eta.getMinutes() + Math.round(totalHours * 60));

    const status =
      totalDrivingWithHistory > 9
        ? "Risk"
        : totalDrivingWithHistory > 4.5
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
      totalDrivingWithHistory,
      eta: eta.toTimeString().slice(0, 5),
      status,
    };
  }, [loadingCity, unloadingCity, startTime, driverHoursToday]);

  const eventLog = useMemo(() => {
    const logs = [];

    logs.push(`Load ${loadRef} planned from ${loadingCity} to ${unloadingCity}.`);
    logs.push(`Tractor ${tractor} assigned.`);
    logs.push(`${trailerType} selected.`);
    logs.push(`Driver has already driven ${formatHours(driverHoursToday)} today.`);
    logs.push(
      `Total driving after this route is ${formatHours(plan.totalDrivingWithHistory)}.`,
    );

    if (plan.totalDrivingWithHistory > 9) {
      logs.push("EU driving time risk: daily 9h driving limit exceeded.");
    } else if (plan.totalDrivingWithHistory > 4.5) {
      logs.push("EU driving time: 45 min break required because total driving exceeds 4h30.");
    } else {
      logs.push("EU driving time: no break required before destination.");
    }

    if (plan.bufferHours < 1) {
      logs.push("Low buffer: check schedule, unloading window and possible delay risk.");
    } else {
      logs.push("Schedule buffer is acceptable.");
    }

    return logs;
  }, [
    loadRef,
    loadingCity,
    unloadingCity,
    tractor,
    trailerType,
    driverHoursToday,
    plan.totalDrivingWithHistory,
    plan.bufferHours,
  ]);

  return (
    <div className={`app ${theme}`}>
      <header className="topbar">
        <div>
          <h1>FleetFlow Planner</h1>
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

          <label>Lahtoaika</label>
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
          <label>Vetaja</label>
          <select value={tractor} onChange={(e) => setTractor(e.target.value)}>
            <option>TRK-101</option>
            <option>TRK-102</option>
            <option>TRK-103</option>
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

          <label>Ajo tanaan</label>
          <input
            type="number"
            step="0.5"
            min="0"
            max="15"
            value={driverHoursToday}
            onChange={(e) => setDriverHoursToday(Number(e.target.value))}
          />
        </section>

        <section className="panel daily-plan-panel">
          <div className="panel-header">
            <h2>Daily Traffic Plan</h2>
            <span>
              {dailyJobs.length} jobs - Selected {selectedJob.id}
            </span>
          </div>

          <div className="daily-plan-layout">
            <div className="daily-plan-table-wrap">
              <table className="daily-plan-table">
                <thead>
                  <tr>
                    <th>Job / Trip ID</th>
                    <th>Flow</th>
                    <th>Type</th>
                    <th>Customer</th>
                    <th>Route</th>
                    <th>Time</th>
                    <th>Truck</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {dailyJobs.map((job) => (
                    <tr
                      key={job.id}
                      className={job.id === selectedJobId ? "active-job-row" : ""}
                      onClick={() => setSelectedJobId(job.id)}
                    >
                      <td className="job-id-cell">{job.id}</td>
                      <td>{job.flowType}</td>
                      <td>{job.jobType}</td>
                      <td>{job.customer}</td>
                      <td>
                        {`${job.originCity} -> ${job.destinationCity}`}
                      </td>
                      <td>{job.timeWindow}</td>
                      <td>{job.truck}</td>
                      <td>
                        <span className={getJobStatusClass(job.status)}>
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <aside className="selected-job-card">
              <div className="selected-job-label">Selected Job</div>
              <div className="selected-job-id">{selectedJob.id}</div>

              <dl>
                <dt>Flow</dt>
                <dd>{selectedJob.flowType}</dd>

                <dt>Type</dt>
                <dd>{selectedJob.jobType}</dd>

                <dt>Customer</dt>
                <dd>{selectedJob.customer}</dd>

                <dt>Route</dt>
                <dd>
                  {`${selectedJob.originCity} -> ${selectedJob.destinationCity}`}
                </dd>

                <dt>Time</dt>
                <dd>{selectedJob.timeWindow}</dd>

                <dt>Truck</dt>
                <dd>{selectedJob.truck}</dd>

                <dt>Status</dt>
                <dd>
                  <span className={getJobStatusClass(selectedJob.status)}>
                    {selectedJob.status}
                  </span>
                </dd>
              </dl>
            </aside>
          </div>
        </section>

        <section className="panel route-panel">
          <div className="panel-header">
            <h2>Reitti + kartta</h2>
            <span>
              {`${loadingCity} -> ${unloadingCity}`}
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
            <dt>Etaisyys</dt>
            <dd>{plan.distanceKm} km</dd>

            <dt>Ajoaika</dt>
            <dd>{formatHours(plan.drivingHours)}</dd>

            <dt>Kuljettajan ajo tanaan</dt>
            <dd>{formatHours(driverHoursToday)}</dd>

            <dt>Ajo yhteensa</dt>
            <dd>{formatHours(plan.totalDrivingWithHistory)}</dd>

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
