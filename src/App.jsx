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
  "Hanko Port": { lat: 59.8237, lng: 22.9707 },
  "Vuosaari Port": { lat: 60.22, lng: 25.184 },
  "Demo Terminal BP": { lat: 60.31, lng: 24.86 },
  "Sipoo DC": { lat: 60.376, lng: 25.269 },
  "Hakkila DC": { lat: 60.3, lng: 25.08 },
};

const initialDailyJobs = [
  {
    id: "JOB-001",
    flow: "Export",
    type: "FTL",
    customer: "Nordic Demo Foods",
    originCity: "Kotka",
    destinationCity: "Hanko Port",
    loadingTime: "06:30",
    deliveryTime: "09:00",
    truck: "TR-101",
    trailerType: "Thermo trailer",
    handlingType: "Loading",
    handlingDurationMinutes: 45,
    driverHoursToday: 0.5,
    status: "OK",
  },
  {
    id: "JOB-002",
    flow: "Return",
    type: "Trailer move",
    customer: "Demo Logistics",
    originCity: "Hanko Port",
    destinationCity: "Demo Terminal BP",
    loadingTime: "09:45",
    deliveryTime: "12:15",
    truck: "TR-101",
    trailerType: "Box trailer",
    handlingType: "Port pickup",
    handlingDurationMinutes: 25,
    driverHoursToday: 3.0,
    status: "OK",
  },
  {
    id: "JOB-003",
    flow: "Export",
    type: "Trailer move",
    customer: "Demo Export Goods",
    originCity: "Demo Terminal BP",
    destinationCity: "Vuosaari Port",
    loadingTime: "13:15",
    deliveryTime: "14:15",
    truck: "TR-101",
    trailerType: "Thermo trailer",
    handlingType: "Trailer exchange",
    handlingDurationMinutes: 25,
    driverHoursToday: 5.5,
    status: "Break required",
  },
  {
    id: "JOB-004",
    flow: "Import",
    type: "FTL",
    customer: "Sipoo Demo DC",
    originCity: "Vuosaari Port",
    destinationCity: "Sipoo DC",
    loadingTime: "15:00",
    deliveryTime: "16:00",
    truck: "TR-101",
    trailerType: "Thermo trailer",
    handlingType: "Port pickup",
    handlingDurationMinutes: 25,
    driverHoursToday: 6.5,
    status: "OK",
  },
  {
    id: "JOB-005",
    flow: "Return",
    type: "Empty trailer",
    customer: "Demo Logistics",
    originCity: "Sipoo DC",
    destinationCity: "Demo Terminal BP",
    loadingTime: "16:30",
    deliveryTime: "17:15",
    truck: "TR-101",
    trailerType: "Thermo trailer",
    handlingType: "Empty return",
    handlingDurationMinutes: 20,
    driverHoursToday: 7.25,
    status: "OK",
  },
  {
    id: "JOB-006",
    flow: "Export",
    type: "FTL",
    customer: "Lahti Demo Group",
    originCity: "Lahti",
    destinationCity: "Vuosaari Port",
    loadingTime: "06:45",
    deliveryTime: "08:45",
    truck: "TR-102",
    trailerType: "Thermo trailer",
    handlingType: "Loading",
    handlingDurationMinutes: 45,
    driverHoursToday: 0.75,
    status: "OK",
  },
  {
    id: "JOB-007",
    flow: "Return",
    type: "Trailer move",
    customer: "Demo Logistics",
    originCity: "Vuosaari Port",
    destinationCity: "Demo Terminal BP",
    loadingTime: "09:30",
    deliveryTime: "10:15",
    truck: "TR-102",
    trailerType: "Box trailer",
    handlingType: "Port pickup",
    handlingDurationMinutes: 25,
    driverHoursToday: 2.75,
    status: "OK",
  },
  {
    id: "JOB-008",
    flow: "Export",
    type: "Trailer move",
    customer: "Demo Export Goods",
    originCity: "Demo Terminal BP",
    destinationCity: "Vuosaari Port",
    loadingTime: "11:15",
    deliveryTime: "12:00",
    truck: "TR-102",
    trailerType: "Thermo trailer",
    handlingType: "Trailer exchange",
    handlingDurationMinutes: 25,
    driverHoursToday: 3.5,
    status: "OK",
  },
  {
    id: "JOB-009",
    flow: "Import",
    type: "FTL",
    customer: "Hakkila Demo Retail",
    originCity: "Vuosaari Port",
    destinationCity: "Hakkila DC",
    loadingTime: "13:00",
    deliveryTime: "14:00",
    truck: "TR-102",
    trailerType: "Thermo trailer",
    handlingType: "Port pickup",
    handlingDurationMinutes: 25,
    driverHoursToday: 4.25,
    status: "OK",
  },
  {
    id: "JOB-010",
    flow: "Return",
    type: "Empty trailer",
    customer: "Demo Logistics",
    originCity: "Hakkila DC",
    destinationCity: "Demo Terminal BP",
    loadingTime: "14:30",
    deliveryTime: "15:15",
    truck: "Unassigned",
    trailerType: "Thermo trailer",
    handlingType: "Empty return",
    handlingDurationMinutes: 20,
    driverHoursToday: 0,
    status: "Open",
  },
];

const availableTrucks = ["TR-101", "TR-102", "TR-103", "TR-104"];

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

function parseTimeToMinutes(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

function getTruckScheduleFeasibility(jobs, newJob, truckId) {
  const truckJobs = jobs
    .filter(
      (job) =>
        job.truck === truckId &&
        job.id !== newJob.id &&
        job.truck !== "Unassigned",
    )
    .map((job) => ({
      ...job,
      startMinutes: parseTimeToMinutes(job.loadingTime),
      endMinutes: parseTimeToMinutes(job.deliveryTime),
    }))
    .sort((a, b) => a.startMinutes - b.startMinutes);

  if (truckJobs.length === 0) {
    return {
      type: "clear",
      message: "",
    };
  }

  const newJobStart = parseTimeToMinutes(newJob.loadingTime);
  const newJobEnd = parseTimeToMinutes(newJob.deliveryTime);

  const overlappingJob = truckJobs.find(
    (job) => newJobStart < job.endMinutes && newJobEnd > job.startMinutes,
  );

  if (overlappingJob) {
    return {
      type: "warning",
      message: `Schedule warning: ${truckId} may overlap with ${overlappingJob.id}.`,
    };
  }

  const closestPreviousJob = [...truckJobs]
    .filter((job) => job.endMinutes <= newJobStart)
    .sort((a, b) => b.endMinutes - a.endMinutes)[0];

  if (closestPreviousJob) {
    const gapMinutes = newJobStart - closestPreviousJob.endMinutes;

    if (gapMinutes < 45) {
      return {
        type: "warning",
        message: `Schedule warning: only ${gapMinutes} min between ${closestPreviousJob.id} and ${newJob.id}.`,
      };
    }

    return {
      type: "sequence",
      message: `Sequence check: ${truckId} has previous job ${closestPreviousJob.id}, gap ${gapMinutes} min.`,
    };
  }

  const closestNextJob = [...truckJobs]
    .filter((job) => job.startMinutes >= newJobEnd)
    .sort((a, b) => a.startMinutes - b.startMinutes)[0];

  if (closestNextJob) {
    const gapMinutes = closestNextJob.startMinutes - newJobEnd;

    if (gapMinutes < 45) {
      return {
        type: "warning",
        message: `Schedule warning: only ${gapMinutes} min between ${newJob.id} and ${closestNextJob.id}.`,
      };
    }

    return {
      type: "sequence",
      message: `Sequence check: ${truckId} has next job ${closestNextJob.id}, gap ${gapMinutes} min.`,
    };
  }

  return {
    type: "sequence",
    message: `Sequence check: ${truckId} has other jobs today. Review route continuity.`,
  };
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
  const [dailyJobs, setDailyJobs] = useState(initialDailyJobs);
  const [loadingCity, setLoadingCity] = useState("Kotka");
  const [unloadingCity, setUnloadingCity] = useState("Hanko Port");
  const [selectedJobId, setSelectedJobId] = useState(initialDailyJobs[0].id);
  const [startTime, setStartTime] = useState("08:00");
  const [trailerType, setTrailerType] = useState("Thermo trailer");
  const [tractor, setTractor] = useState("TR-101");
  const [loadRef, setLoadRef] = useState("JOB-001");
  const [driverHoursToday, setDriverHoursToday] = useState(3.5);
  const [selectedAssignTruck, setSelectedAssignTruck] = useState("TR-101");
  const [actionFeedback, setActionFeedback] = useState("");
  const [actionFeedbackType, setActionFeedbackType] = useState("info");
  const [detailsTab, setDetailsTab] = useState("driving");

  const selectedJob =
    dailyJobs.find((job) => job.id === selectedJobId) || dailyJobs[0];

  const syncPlannerStateFromJob = (job) => {
    if (!job) return;

    setLoadingCity(job.originCity || "");
    setUnloadingCity(job.destinationCity || "");
    setTractor(job.truck || "Unassigned");
    setTrailerType(job.trailerType || "");
    setLoadRef(job.id || "");
  };

  const capacitySummary = useMemo(() => {
    const assignedTrucks = dailyJobs
      .filter((job) => job.truck !== "Unassigned")
      .map((job) => job.truck);

    return {
      totalJobs: dailyJobs.length,
      assignedJobs: dailyJobs.filter((job) => job.truck !== "Unassigned").length,
      openJobs: dailyJobs.filter((job) => job.status === "Open").length,
      riskJobs: dailyJobs.filter((job) => job.status === "Risk").length,
      breakRequiredJobs: dailyJobs.filter(
        (job) => job.status === "Break required",
      ).length,
      trucksInUse: new Set(assignedTrucks).size,
    };
  }, [dailyJobs]);

  const handleAssignTruckToSelectedJob = () => {
    if (!selectedJob) return;
    if (selectedJob.status !== "Open") return;
    if (!selectedAssignTruck) return;

    const feasibility = getTruckScheduleFeasibility(
      dailyJobs,
      selectedJob,
      selectedAssignTruck,
    );

    setDailyJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === selectedJob.id
          ? {
              ...job,
              truck: selectedAssignTruck,
              status: "OK",
              driverHoursToday: 0,
            }
        : job,
      ),
    );
    setTractor(selectedAssignTruck);

    if (feasibility.type === "warning") {
      setActionFeedback(
        `${feasibility.message} ${selectedAssignTruck} assigned to ${selectedJob.id}.`,
      );
      setActionFeedbackType("warning");
    } else if (feasibility.type === "sequence") {
      setActionFeedback(
        `${feasibility.message} ${selectedAssignTruck} assigned to ${selectedJob.id}.`,
      );
      setActionFeedbackType("success");
    } else {
      setActionFeedback(`Truck ${selectedAssignTruck} assigned to ${selectedJob.id}.`);
      setActionFeedbackType("success");
    }
  };

  const handleResetDemoPlan = () => {
    const firstJob = initialDailyJobs[0];

    setDailyJobs(initialDailyJobs);
    setSelectedJobId(firstJob.id);
    syncPlannerStateFromJob(firstJob);
    setSelectedAssignTruck("TR-101");
    setActionFeedback("Demo plan reset to initial state.");
    setActionFeedbackType("info");
  };

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

  const selectedJobPreview = useMemo(() => {
    const selectedJobDriverHoursToday = selectedJob.driverHoursToday ?? 0;
    const selectedJobRouteDrivingHours = plan.drivingHours;
    const selectedJobTotalDrivingAfterJob =
      selectedJobDriverHoursToday + selectedJobRouteDrivingHours;

    if (selectedJob.status === "Open") {
      return {
        driverHoursToday: selectedJobDriverHoursToday,
        routeDrivingHours: selectedJobRouteDrivingHours,
        totalDrivingAfterJob: null,
        status: "Open",
      };
    }

    const selectedJobPreviewStatus =
      selectedJobTotalDrivingAfterJob > 9
        ? "Risk"
        : selectedJobTotalDrivingAfterJob > 4.5
          ? "Break required"
          : "OK";

    return {
      driverHoursToday: selectedJobDriverHoursToday,
      routeDrivingHours: selectedJobRouteDrivingHours,
      totalDrivingAfterJob: selectedJobTotalDrivingAfterJob,
      status: selectedJobPreviewStatus,
    };
  }, [selectedJob, plan.drivingHours]);

  const eventLog = useMemo(() => {
    const logs = [];

    if (actionFeedback) {
      logs.push(actionFeedback);
    }

    logs.push(`Load ${loadRef} planned from ${loadingCity} to ${unloadingCity}.`);

    if (selectedJob.status === "Open") {
      logs.push("Tractor assignment pending.");
    } else {
      logs.push(`Tractor ${tractor} assigned.`);
    }

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

    logs.push(`Selected job ${selectedJob.id} loaded into planner.`);
    logs.push(
      `Route ${selectedJob.originCity} -> ${selectedJob.destinationCity} selected.`,
    );

    if (selectedJob.status === "Open") {
      logs.push("Open job: no truck assigned yet.");
      logs.push("Assign truck before dispatch planning.");
    } else {
      logs.push(`Assigned truck: ${selectedJob.truck}.`);
      logs.push(`Trailer type: ${selectedJob.trailerType}.`);
    }

    if (selectedJobPreview.status === "Break required") {
      logs.push("Driver time preview: break required before dispatch.");
      logs.push("Check schedule before dispatch planning.");
    }

    if (selectedJobPreview.status === "Risk") {
      logs.push("Driver time preview: risk threshold exceeded.");
      logs.push("Review driver hours or assign an alternative truck.");
    }

    if (selectedJobPreview.status === "OK") {
      logs.push("Driver time preview: selected job is within planned driving limits.");
    }

    if (selectedJobPreview.status === "Open") {
      logs.push("Driver time preview pending until a truck is assigned.");
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
    selectedJob,
    selectedJobPreview.status,
    actionFeedback,
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
          <option value="light">SAP Light</option>
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
            <option>TR-101</option>
            <option>TR-102</option>
            <option>TR-103</option>
            <option>TR-104</option>
            <option>Unassigned</option>
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

        <section className="panel capacity-panel">
          <h2>Daily Capacity</h2>
          <dl className="capacity-list">
            <dt>Jobs today</dt>
            <dd>{capacitySummary.totalJobs}</dd>

            <dt>Assigned</dt>
            <dd>{capacitySummary.assignedJobs}</dd>

            <dt>Open</dt>
            <dd>{capacitySummary.openJobs}</dd>

            <dt>Risk</dt>
            <dd>{capacitySummary.riskJobs}</dd>

            <dt>Break required</dt>
            <dd>{capacitySummary.breakRequiredJobs}</dd>

            <dt>Trucks in use</dt>
            <dd>{capacitySummary.trucksInUse}</dd>
          </dl>
          <button
            type="button"
            className="reset-demo-button"
            onClick={handleResetDemoPlan}
          >
            Reset demo plan
          </button>
          {actionFeedback && (
            <div className={`action-feedback ${actionFeedbackType}`}>
              {actionFeedback}
            </div>
          )}
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
                      onClick={() => {
                        setSelectedJobId(job.id);
                        syncPlannerStateFromJob(job);
                      }}
                    >
                      <td className="job-id-cell">{job.id}</td>
                      <td>{job.flow}</td>
                      <td>{job.type}</td>
                      <td>{job.customer}</td>
                      <td>
                        {`${job.originCity} -> ${job.destinationCity}`}
                      </td>
                      <td>{`${job.loadingTime}-${job.deliveryTime}`}</td>
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
                <dd>{selectedJob.flow}</dd>

                <dt>Type</dt>
                <dd>{selectedJob.type}</dd>

                <dt>Customer</dt>
                <dd>{selectedJob.customer}</dd>

                <dt>Route</dt>
                <dd>
                  {`${selectedJob.originCity} -> ${selectedJob.destinationCity}`}
                </dd>

                <dt>Time</dt>
                <dd>{`${selectedJob.loadingTime}-${selectedJob.deliveryTime}`}</dd>

                <dt>Truck</dt>
                <dd>{selectedJob.truck}</dd>

                <dt>Handling</dt>
                <dd>
                  {`${selectedJob.handlingType} - ${selectedJob.handlingDurationMinutes} min`}
                </dd>

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

          <div className="details-tabs">
            <button
              type="button"
              className={detailsTab === "driving" ? "details-tab active" : "details-tab"}
              onClick={() => setDetailsTab("driving")}
            >
              Driving
            </button>
            <button
              type="button"
              className={detailsTab === "preview" ? "details-tab active" : "details-tab"}
              onClick={() => setDetailsTab("preview")}
            >
              Job Preview
            </button>
            <button
              type="button"
              className={
                detailsTab === "assignment" ? "details-tab active" : "details-tab"
              }
              onClick={() => setDetailsTab("assignment")}
            >
              Assignment
            </button>
          </div>

          <div className="details-tab-content">
            {detailsTab === "driving" && (
              <>
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
              </>
            )}

            {detailsTab === "preview" && (
              <section className="job-preview">
                <h3>Selected job preview</h3>
                <dl>
                  <dt>Job ref</dt>
                  <dd>{selectedJob.id}</dd>

                  <dt>Driver hours today</dt>
                  <dd>{formatHours(selectedJobPreview.driverHoursToday)}</dd>

                  <dt>Route driving time</dt>
                  <dd>{formatHours(selectedJobPreview.routeDrivingHours)}</dd>

                  {selectedJob?.handlingType && (
                    <>
                      <dt>Handling</dt>
                      <dd>
                        {`${selectedJob.handlingType} - ${selectedJob.handlingDurationMinutes} min`}
                      </dd>
                    </>
                  )}

                  <dt>Total after job</dt>
                  <dd>
                    {selectedJobPreview.totalDrivingAfterJob === null
                      ? "Not assigned"
                      : formatHours(selectedJobPreview.totalDrivingAfterJob)}
                  </dd>

                  <dt>Preview status</dt>
                  <dd>
                    <span className={getJobStatusClass(selectedJobPreview.status)}>
                      {selectedJobPreview.status}
                    </span>
                  </dd>
                </dl>
              </section>
            )}

            {detailsTab === "assignment" && (
              <>
                {selectedJob.status === "Open" ? (
                  <section className="assign-truck-panel">
                    <h3>Assign truck</h3>
                    <select
                      value={selectedAssignTruck}
                      onChange={(event) => setSelectedAssignTruck(event.target.value)}
                    >
                      {availableTrucks.map((truckId) => (
                        <option key={truckId} value={truckId}>
                          {truckId}
                        </option>
                      ))}
                    </select>
                    <button type="button" onClick={handleAssignTruckToSelectedJob}>
                      Assign
                    </button>
                  </section>
                ) : (
                  <div className="assignment-locked">
                    Assignment locked: selected job already has a truck.
                  </div>
                )}

                {actionFeedback && (
                  <div className={`action-feedback ${actionFeedbackType}`}>
                    {actionFeedback}
                  </div>
                )}
              </>
            )}
          </div>
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
