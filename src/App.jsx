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
].map((job) => {
  const isFlexibleDemoJob = job.id === "JOB-010";

  return {
    ...job,
    loadingTimeExact: isFlexibleDemoJob ? "" : job.loadingTime,
    loadingTimeRange: isFlexibleDemoJob ? "14:00-14:45" : "",
    deliveryTimeExact: isFlexibleDemoJob ? "" : job.deliveryTime,
    deliveryTimeRange: isFlexibleDemoJob ? "15:00-15:45" : "",
    flexibleStart: isFlexibleDemoJob ? "14:00" : "",
    flexibleEnd: isFlexibleDemoJob ? "15:45" : "",
    nextStep: getNextStepForJob(job),
  };
});

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
  if (!timeString || !timeString.includes(":")) return 0;
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
}

function getRangeStart(timeRange) {
  return timeRange ? timeRange.split("-")[0]?.trim() : "";
}

function getRangeEnd(timeRange) {
  return timeRange ? timeRange.split("-")[1]?.trim() : "";
}

function getJobStartTime(job) {
  return (
    job.loadingTimeExact ||
    job.flexibleStart ||
    getRangeStart(job.loadingTimeRange) ||
    job.loadingTime
  );
}

function getJobEndTime(job) {
  return (
    job.deliveryTimeExact ||
    job.flexibleEnd ||
    getRangeEnd(job.deliveryTimeRange) ||
    job.deliveryTime
  );
}

function getJobTimeLabel(job) {
  const loading = job.loadingTimeExact || job.loadingTimeRange || job.loadingTime;
  const delivery = job.deliveryTimeExact || job.deliveryTimeRange || job.deliveryTime;
  return `${loading}-${delivery}`;
}

function getNextStepForJob(job) {
  if (job.destinationCity.includes("Port")) return "Port";
  if (job.destinationCity === "Demo Terminal BP") return "Demo Terminal";
  if (job.type === "Empty trailer") return "Jalalle";
  return "Seuraava lastaus";
}

function chainTruckJobOrigins(jobs) {
  const chainedJobs = jobs.map((job) => ({ ...job }));
  const assignedTrucks = Array.from(
    new Set(chainedJobs.map((job) => job.truck).filter((truck) => truck !== "Unassigned")),
  );

  assignedTrucks.forEach((truck) => {
    const truckJobs = chainedJobs
      .filter((job) => job.truck === truck)
      .sort((a, b) => getJobStartTime(a).localeCompare(getJobStartTime(b)));

    truckJobs.forEach((job, index) => {
      if (index === 0) return;
      const previousJob = truckJobs[index - 1];
      const chainedJob = chainedJobs.find((candidate) => candidate.id === job.id);

      if (chainedJob) {
        chainedJob.originCity = previousJob.destinationCity;
      }
    });
  });

  return chainedJobs;
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
      startMinutes: parseTimeToMinutes(getJobStartTime(job)),
      endMinutes: parseTimeToMinutes(getJobEndTime(job)),
    }))
    .sort((a, b) => a.startMinutes - b.startMinutes);

  if (truckJobs.length === 0) {
    return {
      type: "clear",
      message: "",
    };
  }

  const newJobStart = parseTimeToMinutes(getJobStartTime(newJob));
  const newJobEnd = parseTimeToMinutes(getJobEndTime(newJob));

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

function getTimeSlotClassName(job, type) {
  const isFlexible = type
    ? type === "loading"
      ? !job.loadingTimeExact && job.loadingTimeRange
      : !job.deliveryTimeExact && job.deliveryTimeRange
    : (!job.loadingTimeExact && job.loadingTimeRange) ||
      (!job.deliveryTimeExact && job.deliveryTimeRange);

  return isFlexible ? "flexible-time" : "exact-time";
}

function DailyCapacity({ dailyJobs, onResetDemoPlan, actionFeedback, actionFeedbackType }) {
  const totalJobs = dailyJobs.length;
  const assignedJobs = dailyJobs.filter((job) => job.truck !== "Unassigned").length;
  const openJobs = dailyJobs.filter((job) => job.status === "Open").length;
  const riskJobs = dailyJobs.filter((job) => job.status === "Risk").length;
  const breakRequiredJobs = dailyJobs.filter((job) => job.status === "Break required").length;
  const trucksInUse = new Set(
    dailyJobs.filter((job) => job.truck !== "Unassigned").map((job) => job.truck),
  ).size;

  return (
    <section className="panel capacity-panel cockpit-capacity">
      <h2>Daily Capacity</h2>
      <dl className="capacity-list">
        <dt>Jobs today</dt>
        <dd>{totalJobs}</dd>

        <dt>Assigned</dt>
        <dd>{assignedJobs}</dd>

        <dt>Open</dt>
        <dd>{openJobs}</dd>

        <dt>Risk</dt>
        <dd>{riskJobs}</dd>

        <dt>Break required</dt>
        <dd>{breakRequiredJobs}</dd>

        <dt>Trucks in use</dt>
        <dd>{trucksInUse}</dd>
      </dl>
      <button type="button" className="reset-demo-button" onClick={onResetDemoPlan}>
        Reset demo plan
      </button>
      {actionFeedback && (
        <div className={`action-feedback ${actionFeedbackType}`}>{actionFeedback}</div>
      )}
    </section>
  );
}

function SelectedJobCard({ job }) {
  return (
    <aside className="panel selected-job-card cockpit-selected-job">
      <div className="selected-job-label">Selected Job</div>
      <div className="selected-job-id">{job.id}</div>

      <dl>
        <dt>Flow</dt>
        <dd>{job.flow}</dd>

        <dt>Type</dt>
        <dd>{job.type}</dd>

        <dt>Customer</dt>
        <dd>{job.customer}</dd>

        <dt>Route</dt>
        <dd>{`${job.originCity} -> ${job.destinationCity}`}</dd>

        <dt>Time</dt>
        <dd>
          <span className={getTimeSlotClassName(job, "loading")}>{getJobTimeLabel(job)}</span>
        </dd>

        <dt>Truck</dt>
        <dd>{job.truck}</dd>

        <dt>Handling</dt>
        <dd>{`${job.handlingType} - ${job.handlingDurationMinutes} min`}</dd>

        <dt>Next step</dt>
        <dd>{job.nextStep}</dd>

        <dt>Status</dt>
        <dd>
          <span className={getJobStatusClass(job.status)}>{job.status}</span>
        </dd>
      </dl>
    </aside>
  );
}

function FleetSequencePreview({
  dailyJobs = [],
  fleetTrucks = [],
  selectedJobId,
  planCheckResults,
  onSelectJob,
}) {
  const truckList =
    Array.isArray(fleetTrucks) && fleetTrucks.length > 0
      ? fleetTrucks
      : Array.from(
          new Set(dailyJobs.map((job) => job.truck).filter((truck) => truck !== "Unassigned")),
        );

  return (
    <section className="panel board-fleet-panel scrollable">
      <div className="panel-header">
        <h2>Fleet sequence</h2>
        <span>{truckList.length} trucks</span>
      </div>

      <div className="board-fleet-list">
        {truckList.map((truck) => {
          const truckJobs = dailyJobs
            .filter((job) => job.truck === truck)
            .sort((a, b) => getJobStartTime(a).localeCompare(getJobStartTime(b)));

          return (
            <div key={truck} className="board-fleet-truck">
              <div className="board-fleet-truck-header">
                <strong>{truck}</strong>
                <span>{truckJobs.length} jobs</span>
              </div>

              {truckJobs.map((job) => {
                const checkedJob = planCheckResults?.jobsById[job.id];
                const displayStatus = checkedJob?.status || job.status;

                return (
                  <button
                    key={job.id}
                    type="button"
                    className={`board-fleet-job ${job.id === selectedJobId ? "active" : ""} ${
                      checkedJob && checkedJob.status !== job.status ? "suggested-job" : ""
                    }`}
                    onClick={() => onSelectJob(job)}
                  >
                    <span className={getTimeSlotClassName(job, "loading")}>
                      {getJobTimeLabel(job)}
                    </span>
                    <span>{job.id}</span>
                    <span>{`${job.originCity} -> ${job.destinationCity}`}</span>
                    <span className={getJobStatusClass(displayStatus)}>{displayStatus}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function JobEventLog({ job, eventLog = [] }) {
  if (!job) {
    return (
      <section className="panel notes-panel cockpit-event-log scrollable">
        <div className="panel-header">
          <h2>Job Event Log</h2>
          <span>—</span>
        </div>
        <p>No job selected</p>
      </section>
    );
  }

  return (
    <section className="panel notes-panel cockpit-event-log scrollable">
      <div className="panel-header">
        <h2>Job Event Log</h2>
        <span>{job.id}</span>
      </div>

      <ul>
        {eventLog.map((item, index) => (
          <li
            key={index}
            className={
              /warning|risk|break|required|overlap|tight|buffer|flexible/i.test(item)
                ? "event-warning"
                : ""
            }
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
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
  const [workspaceTab, setWorkspaceTab] = useState("board");
  const [planCheckResults, setPlanCheckResults] = useState(null);

  const emptySelectedJob = {
    id: "",
    flow: "",
    type: "",
    customer: "",
    originCity: "",
    destinationCity: "",
    loadingTimeExact: "",
    loadingTimeRange: "",
    deliveryTimeExact: "",
    deliveryTimeRange: "",
    truck: "",
    trailerType: "",
    handlingType: "",
    handlingDurationMinutes: 0,
    nextStep: "",
    driverHoursToday: 0,
    status: "Open",
  };

  const selectedJob =
    dailyJobs.find((job) => job.id === selectedJobId) || dailyJobs[0] || emptySelectedJob;

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
      chainTruckJobOrigins(
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
      ),
    );
    setTractor(selectedAssignTruck);
    setPlanCheckResults(null);

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
    setPlanCheckResults(null);
    setActionFeedback("Demo plan reset to initial state.");
    setActionFeedbackType("info");
  };

  const handleUpdateSelectedJob = (field, value) => {
    if (!selectedJob) return;

    const updatedJobs = dailyJobs.map((job) => {
      if (job.id !== selectedJob.id) return job;

      const updatedJob = {
        ...job,
        [field]: value,
      };

      if (field === "loadingTimeExact") {
        updatedJob.loadingTime = value || job.loadingTime;
        updatedJob.loadingTimeRange = value ? "" : job.loadingTimeRange;
        updatedJob.flexibleStart = value ? "" : job.flexibleStart;
        updatedJob.flexibleEnd = value ? "" : job.flexibleEnd;
      }

      if (field === "loadingTimeRange") {
        updatedJob.loadingTimeRange = value;
        updatedJob.loadingTimeExact = value ? "" : job.loadingTimeExact;
        updatedJob.loadingTime = getRangeStart(value) || job.loadingTime;
        updatedJob.flexibleStart = getRangeStart(value);
        updatedJob.flexibleEnd = getRangeEnd(value);
      }

      if (field === "deliveryTimeExact") {
        updatedJob.deliveryTime = value || job.deliveryTime;
        updatedJob.deliveryTimeRange = value ? "" : job.deliveryTimeRange;
      }

      if (field === "deliveryTimeRange") {
        updatedJob.deliveryTimeRange = value;
        updatedJob.deliveryTimeExact = value ? "" : job.deliveryTimeExact;
        updatedJob.deliveryTime = getRangeEnd(value) || job.deliveryTime;
      }

      if (field === "truck") {
        updatedJob.status = value === "Unassigned" ? "Open" : "OK";
      }

      return updatedJob;
    });
    const chainedJobs =
      field === "originCity" ? updatedJobs : chainTruckJobOrigins(updatedJobs);
    const updatedSelectedJob =
      chainedJobs.find((job) => job.id === selectedJob.id) || selectedJob;

    setDailyJobs(chainedJobs);
    syncPlannerStateFromJob(updatedSelectedJob);
    setPlanCheckResults(null);
    setActionFeedback(`Job ${updatedSelectedJob.id} updated.`);
    setActionFeedbackType("info");
  };

  const handleAddChainedDemoJob = () => {
    const nextJobNumber = dailyJobs.length + 1;
    const newJob = {
      id: `JOB-${String(nextJobNumber).padStart(3, "0")}`,
      flow: "Transfer",
      type: "Trailer move",
      customer: "Demo Logistics",
      originCity: selectedJob.destinationCity,
      destinationCity: "Demo Terminal BP",
      loadingTime: "18:00",
      deliveryTime: "19:00",
      loadingTimeExact: "18:00",
      loadingTimeRange: "",
      deliveryTimeExact: "19:00",
      deliveryTimeRange: "",
      flexibleStart: "",
      flexibleEnd: "",
      truck: "Unassigned",
      trailerType: selectedJob.trailerType || "Thermo trailer",
      handlingType: "Trailer exchange",
      handlingDurationMinutes: 25,
      nextStep: "Demo Terminal",
      driverHoursToday: 0,
      status: "Open",
    };
    const chainedJobs = chainTruckJobOrigins([...dailyJobs, newJob]);

    setDailyJobs(chainedJobs);
    setSelectedJobId(newJob.id);
    syncPlannerStateFromJob(newJob);
    setPlanCheckResults(null);
    setActionFeedback(`New demo job ${newJob.id} added.`);
    setActionFeedbackType("success");
  };

  const handleCheckPlan = () => {
    const trucks = Array.from(
      new Set(dailyJobs.map((job) => job.truck).filter((truck) => truck !== "Unassigned")),
    );
    const jobsById = {};

    const truckResults = trucks.map((truck) => {
      const truckJobs = dailyJobs
        .filter((job) => job.truck === truck)
        .sort((a, b) => getJobStartTime(a).localeCompare(getJobStartTime(b)));

      let previousJob = null;
      let previousEndMinutes = null;

      const jobResults = truckJobs.map((job) => {
        const issues = [];
        const warnings = [];
        const startMinutes = parseTimeToMinutes(getJobStartTime(job));
        const endMinutes = parseTimeToMinutes(getJobEndTime(job));

        if (previousJob && startMinutes < previousEndMinutes) {
          issues.push(`Overlaps with ${previousJob.id}.`);
        } else if (previousJob) {
          const bufferMinutes = startMinutes - previousEndMinutes;

          if (bufferMinutes < 45) {
            issues.push(`Tight buffer: ${bufferMinutes} min after ${previousJob.id}.`);
          }
        }

        const origin = cities[job.originCity];
        const destination = cities[job.destinationCity];
        const routeDrivingHours =
          origin && destination ? calculateDistanceKm(origin, destination) / 72 : 0;
        const totalDrivingAfterJob = (job.driverHoursToday ?? 0) + routeDrivingHours;

        if (!job.loadingTimeExact && job.loadingTimeRange) {
          warnings.push(`Flexible loading slot: ${job.loadingTimeRange}.`);
        }

        if (!job.deliveryTimeExact && job.deliveryTimeRange) {
          warnings.push(`Flexible delivery slot: ${job.deliveryTimeRange}.`);
        }

        let status = "OK";

        if (issues.length > 0 || totalDrivingAfterJob > 9 || job.status === "Risk") {
          status = "Risk";
        } else if (
          totalDrivingAfterJob > 4.5 ||
          job.status === "Break required" ||
          warnings.length > 0
        ) {
          status = "Break required";
          if (totalDrivingAfterJob > 4.5 || job.status === "Break required") {
            issues.push("Break planning required before dispatch completion.");
          }
        }

        const result = {
          jobId: job.id,
          status,
          issues: [...issues, ...warnings],
        };

        jobsById[job.id] = result;
        previousJob = job;
        previousEndMinutes = endMinutes;

        return result;
      });

      const statuses = jobResults.map((job) => job.status);
      const status = statuses.includes("Risk")
        ? "Risk"
        : statuses.includes("Break required")
          ? "Break required"
          : "OK";

      return {
        truck,
        status,
        jobs: jobResults,
      };
    });

    const statuses = truckResults.map((truck) => truck.status);
    const status = statuses.includes("Risk")
      ? "Risk"
      : statuses.includes("Break required")
        ? "Break required"
        : "OK";
    const checkedAt = new Date().toTimeString().slice(0, 5);

    setPlanCheckResults({
      checkedAt,
      status,
      trucks: truckResults,
      jobsById,
      suggestedPlan: {
        title: status === "Risk" ? "Suggested recovery plan" : "Suggested plan",
        summary:
          status === "Risk"
            ? "Current sequence has risk items that need validation before acceptance."
            : "Current sequence is valid and ready for decision.",
        truckId: truckResults[0]?.truck || fleetTrucks[0] || "TR-101",
        buffer:
          status === "OK"
            ? "Healthy"
            : status === "Break required"
              ? "Tight"
              : "Low",
        risk: status,
        confidence: status === "OK" ? "High confidence" : "Needs review",
        steps: [
          "Review truck sequence warnings in the fleet timeline.",
          "Check the fleet event log for buffer and break issues.",
          "Accept or reject the suggested plan from the right panel.",
        ],
      },
    });
    setActionFeedback(`Plan checked at ${checkedAt}.`);
    setActionFeedbackType(status === "Risk" ? "warning" : "success");
  };

  const handleAcceptSuggestedPlan = () => {
    if (!planCheckResults) return;

    const acceptedJobs = dailyJobs.map((job) => {
      const checkedJob = planCheckResults.jobsById[job.id];

      return checkedJob ? { ...job, status: checkedJob.status } : job;
    });

    setDailyJobs(acceptedJobs);
    setPlanCheckResults(null);
    setActionFeedback("Suggested fleet plan accepted.");
    setActionFeedbackType("success");
  };

  const handleRejectSuggestedPlan = () => {
    if (!planCheckResults) return;

    setPlanCheckResults(null);
    setActionFeedback("Suggested fleet plan rejected.");
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

    if (planCheckResults) {
      logs.push(`Plan check ${planCheckResults.status} at ${planCheckResults.checkedAt}.`);
      planCheckResults.trucks.forEach((truckResult) => {
        logs.push(`${truckResult.truck}: ${truckResult.status}.`);
        truckResult.jobs.forEach((jobResult) => {
          if (jobResult.issues.length > 0) {
            logs.push(
              `${jobResult.jobId}: ${jobResult.status} - ${jobResult.issues[0]}`,
            );
          }
        });
      });
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
    planCheckResults,
  ]);

  const workspaceTabs = [
    { id: "board", label: "Board" },
    { id: "job", label: "Job" },
    { id: "fleet", label: "Fleet" },
    { id: "route-risk", label: "Route & Risk" },
  ];

  const fleetTrucks = Array.from(
    new Set(dailyJobs.map((job) => job.truck).filter((truck) => truck !== "Unassigned")),
  );

  const trucks = useMemo(
    () =>
      fleetTrucks.reduce((acc, truckId) => {
        acc[truckId] = dailyJobs
          .filter((job) => job.truck === truckId)
          .sort((a, b) => getJobStartTime(a).localeCompare(getJobStartTime(b)));
        return acc;
      }, {}),
    [dailyJobs, fleetTrucks],
  );

  const fleetTruckSequences = useMemo(
    () =>
      fleetTrucks.map((truck) => ({
        truck,
        jobs: dailyJobs
          .filter((job) => job.truck === truck)
          .sort((a, b) => getJobStartTime(a).localeCompare(getJobStartTime(b))),
      })),
    [dailyJobs, fleetTrucks],
  );

  const fleetEventEntries = useMemo(() => {
    const entries = [];

    if (planCheckResults) {
      entries.push({
        id: "plan-check",
        time: planCheckResults.checkedAt,
        title: `Plan check ${planCheckResults.status}`,
        truckId: "All trucks",
        description:
          "Validation run completed for the current fleet sequence and suggested plan.",
        recommendation:
          planCheckResults.status === "Risk"
            ? "Review highlighted jobs before accepting the plan."
            : "Accept the suggested plan if the highlighted job sequence looks correct.",
        typeClass:
          planCheckResults.status === "Risk"
            ? "event-warning"
            : planCheckResults.status === "Break required"
              ? "event-alert"
              : "event-ok",
      });

      planCheckResults.trucks.forEach((truckResult) => {
        const problemJobs = truckResult.jobs.filter((job) => job.issues.length > 0);

        if (problemJobs.length === 0) {
          entries.push({
            id: `${truckResult.truck}-ok`,
            time: planCheckResults.checkedAt,
            title: `${truckResult.truck} sequence clear`,
            truckId: truckResult.truck,
            description: "No overlap or break warning surfaced in this validation.",
            recommendation: "Truck sequence can continue as planned.",
            typeClass: "event-ok",
          });
          return;
        }

        problemJobs.slice(0, 2).forEach((jobResult) => {
          entries.push({
            id: `${truckResult.truck}-${jobResult.jobId}`,
            time: planCheckResults.checkedAt,
            title: `${truckResult.truck} ${jobResult.jobId}`,
            truckId: truckResult.truck,
            description: jobResult.issues[0],
            recommendation:
              jobResult.issues.length > 1
                ? jobResult.issues.slice(1).join(" ")
                : "Adjust timing or buffer before acceptance.",
            typeClass: jobResult.status === "Risk" ? "event-warning" : "event-alert",
          });
        });
      });
    } else {
      entries.push({
        id: "ready",
        time: "Now",
        title: "Fleet event log ready",
        truckId: "All trucks",
        description:
          "Run Check Plan to surface fleet risks, buffers and break warnings for the current day.",
        recommendation: "The validation output will populate here once the plan is checked.",
        typeClass: "event-neutral",
      });
    }

    return entries;
  }, [planCheckResults]);

  const suggestedPlanView = useMemo(() => {
    if (!planCheckResults) {
      return {
        title: "Suggested plan",
        summary:
          "Run Check Plan to compare the current sequence against the suggested fleet corrections.",
        truckId: fleetTrucks[0] || "TR-101",
        buffer: "Ready",
        risk: "Pending",
        confidence: "Draft",
        steps: [
          "Check the fleet sequence for overlaps and break warnings.",
          "Review any highlighted jobs in the timeline.",
          "Accept or reject the suggested plan from this panel.",
        ],
      };
    }

    const changedJobs = dailyJobs.filter(
      (job) =>
        planCheckResults.jobsById[job.id] &&
        planCheckResults.jobsById[job.id].status !== job.status,
    );

    const primaryJob = changedJobs[0] || dailyJobs.find((job) => job.truck !== "Unassigned");

    return {
      title:
        planCheckResults.status === "Risk"
          ? "Suggested recovery plan"
          : "Suggested plan",
      summary:
        changedJobs.length > 0
          ? `${changedJobs.length} job(s) change status in the validated plan.`
          : `Validation completed at ${planCheckResults.checkedAt} with ${planCheckResults.status.toLowerCase()} status.`,
      truckId: primaryJob?.truck || fleetTrucks[0] || "TR-101",
      buffer:
        planCheckResults.status === "OK"
          ? "Healthy"
          : planCheckResults.status === "Break required"
            ? "Tight"
            : "Low",
      risk: planCheckResults.status,
      confidence:
        planCheckResults.status === "OK" ? "High confidence" : "Needs review",
      steps: [
        changedJobs[0]
          ? `Highlight ${changedJobs[0].id} as ${planCheckResults.jobsById[changedJobs[0].id].status}.`
          : "No job status change surfaced in the current validation.",
        "Review the fleet event log for truck-specific warnings.",
        "Accept to apply the validation result, or reject to keep the current draft.",
      ],
    };
  }, [dailyJobs, fleetTrucks, planCheckResults]);

  const currentSuggestedPlan = planCheckResults?.suggestedPlan || suggestedPlanView;


  // Step 7 fragment: SelectedJobCard.
  const selectedJobPanel = (
    <aside className="panel selected-job-card cockpit-selected-job">
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
        <dd>{`${selectedJob.originCity} -> ${selectedJob.destinationCity}`}</dd>

        <dt>Time</dt>
        <dd>
          <span className={getTimeSlotClassName(selectedJob, "loading")}>
            {getJobTimeLabel(selectedJob)}
          </span>
        </dd>

        <dt>Truck</dt>
        <dd>{selectedJob.truck}</dd>

        <dt>Handling</dt>
        <dd>
          {`${selectedJob.handlingType} - ${selectedJob.handlingDurationMinutes} min`}
        </dd>

        <dt>Next step</dt>
        <dd>{selectedJob.nextStep}</dd>

        <dt>Status</dt>
        <dd>
          <span className={getJobStatusClass(selectedJob.status)}>
            {selectedJob.status}
          </span>
        </dd>
      </dl>
    </aside>
  );

  // Step 7 fragment: RouteMap.
  const routeMapPanel = (
    <section className="panel route-panel cockpit-route-map">
      <div className="panel-header">
        <h2>Reitti + kartta</h2>
        <span>{`${loadingCity} -> ${unloadingCity}`}</span>
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
  );

  // Step 7 fragment: planner details and assignment helper.
  const detailsPanel = (
    <section className="panel result-panel cockpit-details">
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
          className={detailsTab === "assignment" ? "details-tab active" : "details-tab"}
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

              <dt>Loading slot</dt>
              <dd>{selectedJob.loadingTimeExact || selectedJob.loadingTimeRange}</dd>

              <dt>Delivery slot</dt>
              <dd>{selectedJob.deliveryTimeExact || selectedJob.deliveryTimeRange}</dd>

              <dt>Next step</dt>
              <dd>{selectedJob.nextStep}</dd>

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
  );

  // Step 7 fragment: JobEventLog / FleetEventLog shared event log.
  const eventLogPanel = (
    <section className="panel notes-panel cockpit-event-log scrollable">
      <h2>Suunnitelman huomautukset / event log</h2>
      <ul>
        {eventLog.map((item, index) => (
          <li
            key={index}
            className={
              /warning|risk|break|required|overlap|tight|flexible/i.test(item)
                ? "event-warning"
                : ""
            }
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );

  // Step 7 fragment: JobInputEdit.
  const jobInputPanel = (
    <section className="panel job-input-panel scrollable">
      <div className="panel-header">
        <h2>Job Input / Edit</h2>
        <span>{selectedJob.id}</span>
      </div>

      <div className="job-input-grid">
        <label>Customer</label>
        <input
          value={selectedJob.customer}
          onChange={(event) => handleUpdateSelectedJob("customer", event.target.value)}
        />

        <label>Origin / Loading place</label>
        <select
          value={selectedJob.originCity}
          onChange={(event) => handleUpdateSelectedJob("originCity", event.target.value)}
        >
          {Object.keys(cities).map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>

        <label>Destination / Delivery place</label>
        <select
          value={selectedJob.destinationCity}
          onChange={(event) =>
            handleUpdateSelectedJob("destinationCity", event.target.value)
          }
        >
          {Object.keys(cities).map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>

        <label>Loading exact</label>
        <input
          type="time"
          value={selectedJob.loadingTimeExact || ""}
          onChange={(event) =>
            handleUpdateSelectedJob("loadingTimeExact", event.target.value)
          }
        />

        <label>Loading range</label>
        <input
          value={selectedJob.loadingTimeRange || ""}
          placeholder="14:00-14:45"
          onChange={(event) =>
            handleUpdateSelectedJob("loadingTimeRange", event.target.value)
          }
        />

        <label>Delivery exact</label>
        <input
          type="time"
          value={selectedJob.deliveryTimeExact || ""}
          onChange={(event) =>
            handleUpdateSelectedJob("deliveryTimeExact", event.target.value)
          }
        />

        <label>Delivery range</label>
        <input
          value={selectedJob.deliveryTimeRange || ""}
          placeholder="15:00-15:45"
          onChange={(event) =>
            handleUpdateSelectedJob("deliveryTimeRange", event.target.value)
          }
        />

        <label>Next step</label>
        <select
          value={selectedJob.nextStep || "Seuraava lastaus"}
          onChange={(event) => handleUpdateSelectedJob("nextStep", event.target.value)}
        >
          <option>Lautta</option>
          <option>Port</option>
          <option>Demo Terminal</option>
          <option>Jalalle</option>
          <option>Seuraava lastaus</option>
        </select>

        <label>Handling</label>
        <select
          value={selectedJob.handlingType}
          onChange={(event) =>
            handleUpdateSelectedJob("handlingType", event.target.value)
          }
        >
          <option>Loading</option>
          <option>Unloading</option>
          <option>Trailer pickup</option>
          <option>Trailer drop</option>
          <option>Empty return</option>
          <option>Trailer exchange</option>
          <option>Port pickup</option>
          <option>Port drop</option>
        </select>

        <label>Duration min</label>
        <input
          type="number"
          min="0"
          step="5"
          value={selectedJob.handlingDurationMinutes}
          onChange={(event) =>
            handleUpdateSelectedJob(
              "handlingDurationMinutes",
              Number(event.target.value),
            )
          }
        />

        {selectedJob.status === "Open" && (
          <>
            <label>Assign truck</label>
            <select
              value={selectedJob.truck}
              onChange={(event) => handleUpdateSelectedJob("truck", event.target.value)}
            >
              <option>Unassigned</option>
              {availableTrucks.map((truckId) => (
                <option key={truckId}>{truckId}</option>
              ))}
            </select>
          </>
        )}

        <label>Trailer</label>
        <select
          value={selectedJob.trailerType}
          onChange={(event) =>
            handleUpdateSelectedJob("trailerType", event.target.value)
          }
        >
          <option>Box trailer</option>
          <option>Side-opening box</option>
          <option>Thermo trailer</option>
          <option>Curtain trailer</option>
        </select>
      </div>

      <button type="button" className="add-job-button" onClick={handleAddChainedDemoJob}>
        Add chained demo job
      </button>
    </section>
  );

  // Step 7 fragment: JobSelector for Route & Risk.
  const jobSelectorPanel = (
    <section className="panel job-selector-panel scrollable">
      <div className="panel-header">
        <h2>Job Selector</h2>
        <span>{selectedJob.id}</span>
      </div>

      <div className="job-selector-list">
        {dailyJobs.map((job) => {
          const checkedJob = planCheckResults?.jobsById[job.id];
          const displayStatus = checkedJob?.status || job.status;

          return (
            <button
              key={job.id}
              type="button"
              className={`job-selector-item ${job.id === selectedJobId ? "active" : ""} ${
                checkedJob && checkedJob.status !== job.status ? "suggested-job" : ""
              }`}
              onClick={() => {
                setSelectedJobId(job.id);
                syncPlannerStateFromJob(job);
              }}
            >
              <span className="job-selector-id">{job.id}</span>
              <span className="job-selector-route">
                {job.originCity} -&gt; {job.destinationCity}
              </span>
              <span className={getTimeSlotClassName(job, "loading")}>
                {getJobTimeLabel(job)}
              </span>
              <span className={getJobStatusClass(displayStatus)}>{displayStatus}</span>
            </button>
          );
        })}
      </div>
    </section>
  );

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

      <nav className="workspace-tabs" aria-label="FleetFlow workspace tabs">
        {workspaceTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={workspaceTab === tab.id ? "workspace-tab active" : "workspace-tab"}
            onClick={() => setWorkspaceTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {workspaceTab === "board" && (
        <section className="workspace-view board-view">
          {/* Step 7 Board cockpit: left traffic plan and right planning controls. */}
          <main className="cockpit-board-grid step7-board-grid board-cockpit">
            <section className="board-left-column board-left scrollable">
              <DailyCapacity dailyJobs={dailyJobs} />
              <section className="panel daily-plan-panel cockpit-daily-plan daily-traffic-plan scrollable">
                <div className="panel-header">
                  <h2>Daily Traffic Plan</h2>
                  <span>
                    {dailyJobs.length} jobs - Selected {selectedJob.id}
                  </span>
                </div>

                <div className="daily-plan-table-wrap cockpit-table-wrap">
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
                      {dailyJobs.map((job) => {
                        const checkedJob = planCheckResults?.jobsById[job.id];
                        const isSuggested = checkedJob && checkedJob.status !== job.status;

                        return (
                          <tr
                            key={job.id}
                            className={`${job.id === selectedJobId ? "active-job-row" : ""} ${
                              isSuggested ? "suggested-job" : ""
                            }`}
                            onClick={() => {
                              setSelectedJobId(job.id);
                              syncPlannerStateFromJob(job);
                            }}
                          >
                            <td className="job-id-cell">{job.id}</td>
                            <td>{job.flow}</td>
                            <td>{job.type}</td>
                            <td>{job.customer}</td>
                            <td>{`${job.originCity} -> ${job.destinationCity}`}</td>
                            <td>
                              <span className={getTimeSlotClassName(job, "loading")}>
                                {getJobTimeLabel(job)}
                              </span>
                            </td>
                            <td>{job.truck}</td>
                            <td>
                              <span className={getJobStatusClass(job.status)}>{job.status}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            </section>

            <aside className="board-right-column board-right scrollable">
              <SelectedJobCard job={selectedJob} />
              <FleetSequencePreview dailyJobs={dailyJobs} />
              <JobEventLog job={selectedJob} />
            </aside>
          </main>

          <div className="legacy-board-wrapper">
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
                <dd>
                  <span className={getTimeSlotClassName(selectedJob, "loading")}>
                    {getJobTimeLabel(selectedJob)}
                  </span>
                </dd>

                <dt>Truck</dt>
                <dd>{selectedJob.truck}</dd>

                <dt>Handling</dt>
                <dd>
                  {`${selectedJob.handlingType} - ${selectedJob.handlingDurationMinutes} min`}
                </dd>

                <dt>Next step</dt>
                <dd>{selectedJob.nextStep}</dd>

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
        </section>
      )}

      {workspaceTab === "job" && (
        <section className="workspace-view job-workspace job-workspace-grid scrollable">
          {/* Step 7 Job workspace: four equal panels with independent scroll. */}
          <div className="job-grid-panel scrollable job-grid-top-left">
            <h2>Job Input / Edit</h2>
            {selectedJob ? (
              jobInputPanel
            ) : (
              <div className="job-event-placeholder">Select a job to edit</div>
            )}
          </div>

          <div className="job-grid-panel scrollable job-grid-top-right">
            <h2>Selected Job Card</h2>
            {selectedJob ? (
              selectedJobPanel
            ) : (
              <div className="job-event-placeholder">Select a job to view details</div>
            )}
          </div>

          <div className="job-grid-panel scrollable job-grid-bottom-left">
            <h2>DrivingOutput</h2>
            {selectedJob ? (
              <div className="job-details-panel scrollable">{detailsPanel}</div>
            ) : (
              <div className="job-event-placeholder">Select a job to view driving output</div>
            )}
          </div>

          <div className="job-grid-panel scrollable job-grid-bottom-right">
            <h2>Job Event Log</h2>
            {selectedJob ? (
              eventLogPanel
            ) : (
              <div className="job-event-placeholder">
                Select a job to view event log
              </div>
            )}
          </div>
        </section>
      )}

      {workspaceTab === "fleet" && (
        <section className="workspace-view fleet-view fleet-timeline scrollable">
          {/* Step 7 Fleet cockpit: three independently scrollable columns. */}
          <div className="fleet-left scrollable">
            <div className="fleet-column-header">
              <div>
                <p className="placeholder-kicker">Fleet Timeline</p>
                <h2>Truck sequences / Timeline</h2>
              </div>
              <span>{fleetTruckSequences.length} trucks</span>
            </div>

            {Object.keys(trucks).map((truckId) => {
              const truckJobs = trucks[truckId] || [];

              if (!truckJobs.length) return null;

              return (
                <details key={truckId} className="fleet-truck-sequence" open>
                  <summary className="fleet-truck-summary">
                    <div>
                      <strong>{truckId}</strong>
                      <span>{truckJobs.length} jobs today</span>
                    </div>
                    <span className="fleet-truck-summary-badge">Timeline</span>
                  </summary>

                  <div className="fleet-truck-job-list">
                    {truckJobs.map((job) => {
                      const checkedJob = planCheckResults?.jobsById?.[job.id];
                      const displayStatus = checkedJob?.status || job.status;
                      const isSuggested =
                        checkedJob && checkedJob.status !== job.status;

                      return (
                        <button
                          key={job.id}
                          type="button"
                          className={`fleet-job-card ${job.id === selectedJobId ? "active" : ""} ${
                            isSuggested ? "suggested-job" : ""
                          }`}
                          title={checkedJob?.issues?.length ? checkedJob.issues.join(" ") : ""}
                          onClick={() => {
                            setSelectedJobId(job.id);
                            syncPlannerStateFromJob(job);
                          }}
                        >
                          <span className="fleet-job-time">
                            <span className={getTimeSlotClassName(job, "loading")}>
                              {getJobTimeLabel(job)}
                            </span>
                          </span>
                          <span className="fleet-job-id">{job.id}</span>
                          <span className="fleet-job-route">
                            {job.originCity} -&gt; {job.destinationCity}
                          </span>
                          <span className={getJobStatusClass(displayStatus)}>
                            {displayStatus}
                          </span>
                          <span className="fleet-job-meta">
                            {job.handlingType} - {job.handlingDurationMinutes} min - {job.nextStep}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </div>

          <div className="fleet-center scrollable">
            <div className="fleet-column-header">
              <div>
                <p className="placeholder-kicker">Fleet Event Log</p>
                <h2>Fleet Event Log</h2>
              </div>
              <span>{fleetEventEntries.length} events</span>
            </div>

            <div className="fleet-event-scroll">
              {fleetEventEntries.map((event) => (
                <article key={event.id} className={`fleet-event-card ${event.typeClass}`}>
                  <div className="fleet-event-time">{event.time}</div>
                  <div className="fleet-event-body">
                    <div className="fleet-event-title-row">
                      <strong>{event.title}</strong>
                      <span>{event.truckId}</span>
                    </div>
                    <p>{event.description}</p>
                    {event.recommendation && (
                      <div className="fleet-event-recommendation">
                        {event.recommendation}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="fleet-right scrollable">
            <div className="fleet-column-header">
              <div>
                <p className="placeholder-kicker">Suggested Plan</p>
                <h2>Suggested Plan / Check Plan</h2>
              </div>
              <button
                type="button"
                className="check-plan-button"
                onClick={handleCheckPlan}
              >
                Check Plan
              </button>
            </div>

            <section className="suggested-plan-panel suggested-job">
              <div className="suggested-plan-head">
                <div>
                  <strong>{currentSuggestedPlan.title}</strong>
                  <p>{currentSuggestedPlan.summary}</p>
                </div>
                <span className="status-pill status-open">
                  {currentSuggestedPlan.confidence}
                </span>
              </div>

              <div className="suggested-plan-meta">
                <div>
                  <span>Truck</span>
                  <strong>{currentSuggestedPlan.truckId}</strong>
                </div>
                <div>
                  <span>Buffer</span>
                  <strong>{currentSuggestedPlan.buffer}</strong>
                </div>
                <div>
                  <span>Risk</span>
                  <strong>{currentSuggestedPlan.risk}</strong>
                </div>
              </div>

              <div className="suggested-plan-steps">
                {currentSuggestedPlan.steps.map((step, index) => (
                  <div key={step} className="suggested-plan-step">
                    <span>{index + 1}</span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>

              <div className="suggested-plan-actions">
                <button
                  type="button"
                  onClick={handleAcceptSuggestedPlan}
                  disabled={!planCheckResults}
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={handleRejectSuggestedPlan}
                  disabled={!planCheckResults}
                >
                  Reject
                </button>
              </div>
            </section>

            {planCheckResults && (
              <section className="plan-check-results-card">
                <div className="plan-check-header">
                  <div>
                    <span>Plan check result</span>
                    <strong>Checked at {planCheckResults.checkedAt}</strong>
                  </div>
                  <span className={getJobStatusClass(planCheckResults.status)}>
                    {planCheckResults.status}
                  </span>
                </div>

                <div className="plan-check-grid">
                  {planCheckResults.trucks.map((truckResult) => (
                    <article key={truckResult.truck} className="plan-check-card">
                      <div className="plan-check-card-header">
                        <h3>{truckResult.truck}</h3>
                        <span className={getJobStatusClass(truckResult.status)}>
                          {truckResult.status}
                        </span>
                      </div>

                      <ul className="plan-check-jobs">
                        {truckResult.jobs.map((jobResult) => (
                          <li key={jobResult.jobId} className="plan-check-job">
                            <span className="plan-check-job-id">{jobResult.jobId}</span>
                            <span className={getJobStatusClass(jobResult.status)}>
                              {jobResult.status}
                            </span>
                            <span className="plan-check-issue">
                              {jobResult.issues[0] || "No sequence issue found."}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </section>
      )}

      {workspaceTab === "route-risk" && (
        <section className="workspace-view route-risk-view route-risk-panel scrollable">
          {/* Step 7 Route & Risk: left map, right selector and event log. */}
          <main className="route-risk-two-col">
            <section className="route-map-container scrollable">
              {routeMapPanel}
            </section>

            <aside className="route-right scrollable">
              <div className="route-selector-wrap scrollable">
                {dailyJobs && dailyJobs.length > 0 ? (
                  jobSelectorPanel
                ) : (
                  <p>No jobs available</p>
                )}
              </div>

              <div className="route-event-wrap scrollable">
                {selectedJob ? (
                  eventLogPanel
                ) : (
                  <p>No job selected</p>
                )}
              </div>
            </aside>
          </main>
        </section>
      )}
    </div>
  );
}
