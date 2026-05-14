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

function getBoardJobTimeLabel(job) {
  const loading =
    job?.loadingTimeExact || job?.loadingTimeRange || job?.loadingTime || "Start TBD";
  const delivery =
    job?.deliveryTimeExact || job?.deliveryTimeRange || job?.deliveryTime || "End TBD";
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
    <section className="panel capacity-panel cockpit-capacity board-panel board-kpi-panel">
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
  const [jobWorkspaceTab, setJobWorkspaceTab] = useState("overview");
  const [boardDetailTab, setBoardDetailTab] = useState("selectedJob");
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

  const jobWorkspaceTabs = [
    { id: "overview", label: "Overview" },
    { id: "tripOrders", label: "Trip & Orders" },
    { id: "stopsNodes", label: "Stops / Nodes" },
    { id: "assignment", label: "Assignment" },
    { id: "instructions", label: "Instructions" },
    { id: "validation", label: "Validation" },
  ];

  const getDemoTripDetailsForJob = (job) => {
    if (!job) {
      return {
        tripId: "TRIP-DEMO-TBD",
        tripType: "Planning demo",
        planningStatus: "Not selected",
        orderCount: 0,
        stopsCount: 0,
      };
    }

    return {
      tripId: `TRIP-${job.id?.replace(/\D/g, "").slice(-3) || "001"}`,
      tripType:
        job.flow === "Import" ? "Import trailer flow" : "Domestic / export planning flow",
      planningStatus: job.status === "Open" ? "Needs assignment" : "Planned",
      orderCount: job.status === "Open" ? 1 : 2,
      stopsCount: job.status === "Open" ? 3 : 4,
    };
  };

  const getDemoOrdersForJob = (job) => {
    if (!job) return [];

    const baseCustomer = job.customer || "Demo Customer";
    const origin = job.originCity || "Demo Origin";
    const destination = job.destinationCity || "Demo Destination";

    return [
      {
        id: "ORD-DEMO-001",
        customer: baseCustomer,
        pickup: origin,
        delivery: destination,
        goods: "Demo palletized goods",
        ldm: "6.4",
        kg: "7 850",
        pallets: "18",
        colli: "24",
        temperature: job.trailerType?.toLowerCase().includes("thermo")
          ? "+2...+6 °C"
          : "Ambient",
        adr: job.id?.endsWith("003") || false,
        gdp: job.id?.endsWith("006") || false,
        orderStatus: job.status === "Open" ? "Waiting assignment" : "Ready for planning",
        planningStatus: job.status === "Risk" ? "Review needed" : "Planned",
      },
      {
        id: "ORD-DEMO-002",
        customer: "Nordic Demo Components",
        pickup: origin,
        delivery: destination,
        goods: "Demo mixed cargo",
        ldm: "3.2",
        kg: "2 400",
        pallets: "8",
        colli: "11",
        temperature: "Ambient",
        adr: false,
        gdp: false,
        orderStatus: "Confirmed",
        planningStatus: "Planned",
      },
    ];
  };

  const getDemoNodesForJob = (job) => {
    if (!job) return [];

    const origin = job.originCity || "Demo Origin";
    const destination = job.destinationCity || "Demo Destination";
    const loadingTime = job.loadingTime || "Time TBD";
    const deliveryTime = job.deliveryTime || "Time TBD";

    return [
      {
        id: "NODE-01",
        type: job.flow === "Import" ? "Port pickup" : "Trailer pickup",
        location: origin,
        time: loadingTime,
        note: "Check trailer condition, documents and temperature setting.",
      },
      {
        id: "NODE-02",
        type: job.handlingType || "Handling",
        location: origin,
        time: loadingTime,
        note: `${job.handlingType || "Handling"} estimate ${
          job.handlingDurationMinutes || 30
        } min.`,
      },
      {
        id: "NODE-03",
        type: "Delivery / drop",
        location: destination,
        time: deliveryTime,
        note: "Confirm arrival, update ETA if needed and wait for next instruction.",
      },
      {
        id: "NODE-04",
        type: "Continuation",
        location: "FleetFlow Demo Terminal",
        time: "After completion",
        note: "Trailer can continue with another demo driver if the trip continues.",
      },
    ];
  };

  const getDemoAssignmentCheckForJob = (job) => {
    if (!job) {
      return {
        carrier: "Demo Carrier TBD",
        driver: "Demo Driver TBD",
        adrCapable: false,
        gdpCapable: false,
        trailerCheck: "Not checked",
        capabilityStatus: "No job selected",
      };
    }

    const requiresAdr = job.id?.endsWith("003") || false;
    const requiresGdp = job.id?.endsWith("006") || false;
    const adrCapable = job.truck !== "TR-102";
    const gdpCapable = job.truck === "TR-101" || job.truck === "TR-103";
    const trailerCheck = job.trailerType ? "Trailer type selected" : "Trailer type missing";

    let capabilityStatus = "OK";

    if (job.status === "Open" || job.truck === "Unassigned") {
      capabilityStatus = "Needs assignment";
    } else if (requiresAdr && !adrCapable) {
      capabilityStatus = "Missing ADR qualification";
    } else if (requiresGdp && !gdpCapable) {
      capabilityStatus = "Missing GDP qualification";
    }

    return {
      carrier: "FleetFlow Demo Carrier",
      driver: job.truck && job.truck !== "Unassigned" ? `Demo Driver ${job.truck}` : "Unassigned",
      adrCapable,
      gdpCapable,
      requiresAdr,
      requiresGdp,
      trailerCheck,
      capabilityStatus,
    };
  };

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

  const boardOverview = useMemo(() => {
    const isAssigned = (job) => Boolean(job.truck && job.truck !== "Unassigned");
    const totalJobs = dailyJobs.length;
    const assignedJobs = dailyJobs.filter(isAssigned).length;
    const openJobs = dailyJobs.filter((job) => job.status === "Open").length;
    const riskJobs = dailyJobs.filter((job) => job.status === "Risk").length;
    const breakRequiredJobs = dailyJobs.filter(
      (job) => job.status === "Break required",
    ).length;
    const trucksInUse = new Set(dailyJobs.filter(isAssigned).map((job) => job.truck)).size;
    const unassignedJobs = dailyJobs.filter(
      (job) => !isAssigned(job) || job.status === "Open",
    ).length;

    const workload = dailyJobs.reduce(
      (acc, job) => {
        if (job.flow === "Export") acc.export += 1;
        else if (job.flow === "Import") acc.import += 1;
        else acc.other += 1;
        return acc;
      },
      { export: 0, import: 0, other: 0 },
    );

    return {
      totalJobs,
      assignedJobs,
      openJobs,
      riskJobs,
      breakRequiredJobs,
      trucksInUse,
      unassignedJobs,
      workload,
      overallDayStatus:
        riskJobs > 0
          ? "Risk"
          : openJobs > 0
            ? "Open items"
            : breakRequiredJobs > 0
              ? "Break planning"
              : "OK",
    };
  }, [dailyJobs]);

  const boardFleetPreview = useMemo(
    () =>
      fleetTruckSequences.map(({ truck, jobs }) => {
        const status = jobs.some((job) => job.status === "Risk")
          ? "Risk"
          : jobs.some((job) => job.status === "Break required")
            ? "Break required"
            : jobs.some((job) => job.status === "Open")
              ? "Open"
              : "OK";

        return {
          truck,
          jobs,
          status,
          nextJob: jobs[0],
        };
      }),
    [fleetTruckSequences],
  );

  const openAssignmentJobs = useMemo(
    () =>
      dailyJobs.filter(
        (job) => job?.status === "Open" || job?.truck === "Unassigned",
      ),
    [dailyJobs],
  );

  const firstOpenAssignmentJob = openAssignmentJobs[0];

  const boardOperationalNotes = useMemo(() => {
    const notes = [];

    if (actionFeedback) {
      notes.push(`Last action: ${actionFeedback}`);
    }

    if (selectedJob?.id) {
      notes.push(`Selected ${selectedJob.id} loaded.`);
    } else {
      notes.push("No selected job.");
    }

    notes.push(`${boardOverview.openJobs} open job(s) require assignment.`);
    notes.push(`${boardOverview.breakRequiredJobs} job(s) require break planning.`);
    notes.push(`${boardOverview.riskJobs} risk job(s) require review.`);
    notes.push(`${boardOverview.trucksInUse} truck(s) currently in use.`);
    notes.push("Use Fleet tab for Check Plan.");
    notes.push("Demo plan reset status available.");

    return notes;
  }, [actionFeedback, boardOverview, selectedJob]);

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
      <header className="topbar app-header">
        <div className="brand">
          <div className="brand-logo" aria-hidden="true">
            <svg viewBox="0 0 96 40" focusable="false">
              <rect x="7" y="12" width="50" height="14" rx="2" />
              <path d="M61 14h15l10 8v4H61z" />
              <rect x="13" y="16" width="38" height="3" rx="1" opacity="0.45" />
              <circle cx="22" cy="30" r="4" />
              <circle cx="52" cy="30" r="4" />
              <circle cx="76" cy="30" r="4" />
            </svg>
          </div>

          <div className="brand-copy">
            <h1>FleetFlow Planner</h1>
            <p>Daily Traffic Planning Cockpit</p>
          </div>
        </div>

        <div className="header-actions">
          <span className="demo-badge">Demo cockpit</span>

          <div className="theme-control">
            <label htmlFor="theme-select">Theme</label>
            <select
              id="theme-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="classic">Classic</option>
              <option value="dark">Dark</option>
              <option value="light">SAP Light</option>
            </select>
          </div>
        </div>
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
          <main className="board-cockpit board-three-column">
            <section className="board-left-column">
              <DailyCapacity
                dailyJobs={dailyJobs}
                onResetDemoPlan={handleResetDemoPlan}
                actionFeedback={actionFeedback}
                actionFeedbackType={actionFeedbackType}
              />

              <section className="panel board-panel board-detail-panel">
                <div className="panel-header">
                  <h2>Board Detail Panel</h2>
                  <span>Board</span>
                </div>

                <div className="board-detail-tabs" role="tablist" aria-label="Board details">
                  <button
                    type="button"
                    className={
                      boardDetailTab === "selectedJob"
                        ? "board-detail-tab active"
                        : "board-detail-tab"
                    }
                    onClick={() => setBoardDetailTab("selectedJob")}
                  >
                    Selected Job
                  </button>
                  <button
                    type="button"
                    className={
                      boardDetailTab === "operationalNotes"
                        ? "board-detail-tab active"
                        : "board-detail-tab"
                    }
                    onClick={() => setBoardDetailTab("operationalNotes")}
                  >
                    Operational Notes
                  </button>
                </div>

                <div className="board-detail-content scrollable">
                  {boardDetailTab === "selectedJob" &&
                    (selectedJob?.id ? (
                      <>
                        <div className="selected-job-label">Selected Job</div>
                        <div className="selected-job-id">
                          {selectedJob.id || "No selected job"}
                        </div>

                        <dl className="selected-job-summary-grid">
                          <div className="selected-job-summary-item">
                            <dt>Job ref</dt>
                            <dd>{selectedJob.id || "No job ID"}</dd>
                          </div>
                          <div className="selected-job-summary-item">
                            <dt>Flow</dt>
                            <dd>{selectedJob.flow || "Flow TBD"}</dd>
                          </div>
                          <div className="selected-job-summary-item">
                            <dt>Type</dt>
                            <dd>{selectedJob.type || "Type TBD"}</dd>
                          </div>
                          <div className="selected-job-summary-item">
                            <dt>Customer</dt>
                            <dd>{selectedJob.customer || "Unknown customer"}</dd>
                          </div>
                          <div className="selected-job-summary-item">
                            <dt>Route</dt>
                            <dd>{`${selectedJob.originCity || "Unknown origin"} -> ${
                              selectedJob.destinationCity || "Unknown destination"
                            }`}</dd>
                          </div>
                          <div className="selected-job-summary-item">
                            <dt>Time</dt>
                            <dd>{getBoardJobTimeLabel(selectedJob) || "Time TBD"}</dd>
                          </div>
                          <div className="selected-job-summary-item">
                            <dt>Truck</dt>
                            <dd>{selectedJob.truck || "Unassigned"}</dd>
                          </div>
                          <div className="selected-job-summary-item">
                            <dt>Trailer</dt>
                            <dd>{selectedJob.trailerType || "Trailer TBD"}</dd>
                          </div>
                          <div className="selected-job-summary-item">
                            <dt>Status</dt>
                            <dd>
                              <span className={getJobStatusClass(selectedJob.status)}>
                                {selectedJob.status || "Status unknown"}
                              </span>
                            </dd>
                          </div>
                          <div className="selected-job-summary-item">
                            <dt>Handling</dt>
                            <dd>{`${selectedJob.handlingType || "Handling not set"} - ${
                              selectedJob.handlingDurationMinutes || "Duration TBD"
                            } min`}</dd>
                          </div>
                        </dl>
                      </>
                    ) : (
                      <p>No selected job</p>
                    ))}

                  {boardDetailTab === "operationalNotes" && (
                    <ul className="board-operational-notes-list">
                      {boardOperationalNotes.map((note, index) => (
                        <li key={`${note}-${index}`} className="board-note-row">
                          <span className="board-note-bullet" aria-hidden="true">
                            &bull;
                          </span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            </section>

            <section className="board-center-column">
              <section className="panel board-panel board-kpi-panel">
                <h2>Day Status</h2>
                <dl className="capacity-list">
                  <dt>Overall</dt>
                  <dd>{boardOverview.overallDayStatus}</dd>
                  <dt>Open</dt>
                  <dd>{boardOverview.openJobs}</dd>
                  <dt>Risk</dt>
                  <dd>{boardOverview.riskJobs}</dd>
                  <dt>Break required</dt>
                  <dd>{boardOverview.breakRequiredJobs}</dd>
                </dl>
              </section>

              <section className="panel board-panel board-kpi-panel">
                <h2>Workload</h2>
                <dl className="capacity-list">
                  <dt>Total jobs</dt>
                  <dd>{boardOverview.totalJobs}</dd>
                  <dt>Export</dt>
                  <dd>{boardOverview.workload.export}</dd>
                  <dt>Import</dt>
                  <dd>{boardOverview.workload.import}</dd>
                  <dt>Other</dt>
                  <dd>{boardOverview.workload.other}</dd>
                </dl>
              </section>

              <section className="panel board-panel board-kpi-panel">
                <h2>Fleet Status</h2>
                <dl className="capacity-list">
                  <dt>Trucks in use</dt>
                  <dd>{boardOverview.trucksInUse}</dd>
                  <dt>Unassigned</dt>
                  <dd>{boardOverview.unassignedJobs}</dd>
                  <dt>Break warnings</dt>
                  <dd>{boardOverview.breakRequiredJobs}</dd>
                  <dt>Additional needed</dt>
                  <dd>Not checked yet</dd>
                </dl>
              </section>

              <section className="panel board-panel board-next-attention">
                <h2>Next Attention</h2>
                {openAssignmentJobs.length > 0 ? (
                  <>
                    <div className="next-attention-status">Open assignment</div>
                    <p className="next-attention-muted">
                      {openAssignmentJobs.length}{" "}
                      {openAssignmentJobs.length === 1 ? "job" : "jobs"} still unassigned.
                    </p>

                    {firstOpenAssignmentJob && (
                      <div className="next-attention-job">
                        <strong>{firstOpenAssignmentJob.id || "No job ID"}</strong>
                        <span>
                          {firstOpenAssignmentJob.originCity || "Unknown origin"} -&gt;{" "}
                          {firstOpenAssignmentJob.destinationCity || "Unknown destination"}
                        </span>
                        <span>{getBoardJobTimeLabel(firstOpenAssignmentJob) || "Time TBD"}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="next-attention-status">No open assignments.</div>
                    <p className="next-attention-muted">Fleet assignment status is clear.</p>
                  </>
                )}
              </section>
            </section>

            <section className="board-right-column">
              <section className="panel board-panel cockpit-daily-plan daily-traffic-plan">
                <div className="panel-header">
                  <h2>Daily Traffic Plan</h2>
                  <span>
                    {dailyJobs.length} jobs - Selected {selectedJob?.id || "No selected job"}
                  </span>
                </div>

                <div className="board-job-list scrollable">
                  {dailyJobs.length === 0 ? (
                    <p>No jobs available</p>
                  ) : (
                    dailyJobs.map((job) => {
                      const checkedJob = planCheckResults?.jobsById[job.id];
                      const isSuggested = checkedJob && checkedJob.status !== job.status;
                      const jobId = job.id || "No job ID";
                      const customer = job.customer || "Unknown customer";
                      const flow = job.flow || "Flow TBD";
                      const type = job.type || "Type TBD";
                      const origin = job.originCity || "Unknown origin";
                      const destination = job.destinationCity || "Unknown destination";
                      const truck = job.truck || "Unassigned";
                      const status = job.status || "Status unknown";

                      return (
                        <button
                          key={jobId}
                          type="button"
                          className={`board-job-row ${job.id === selectedJobId ? "active" : ""} ${
                            isSuggested ? "suggested-job" : ""
                          }`}
                          onClick={() => {
                            setSelectedJobId(job.id);
                            syncPlannerStateFromJob(job);
                          }}
                        >
                          <span className="board-job-primary">
                            <strong>{jobId}</strong>
                            <span>{customer}</span>
                          </span>
                          <span className="board-job-meta">
                            {flow} / {type} | {origin} -&gt; {destination} |{" "}
                            <span className={getTimeSlotClassName(job, "loading")}>
                              {getBoardJobTimeLabel(job)}
                            </span>{" "}
                            | {truck} | {status}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </section>

              <section className="panel board-panel board-fleet-preview scrollable">
                <div className="panel-header">
                  <h2>Fleet Preview</h2>
                  <span>{boardFleetPreview.length} trucks</span>
                </div>

                <div className="board-fleet-preview-list">
                  {boardFleetPreview.length === 0 ? (
                    <p>No assigned trucks</p>
                  ) : (
                    boardFleetPreview.map(({ truck, jobs, status, nextJob }) => (
                      <button
                        key={truck}
                        type="button"
                        className="board-fleet-preview-card"
                        onClick={() => {
                          if (!nextJob) return;
                          setSelectedJobId(nextJob.id);
                          syncPlannerStateFromJob(nextJob);
                        }}
                      >
                        <div className="fleet-preview-card-header">
                          {truck} | {jobs.length} jobs | {status}
                        </div>
                        {nextJob && (
                          <>
                            <div className="fleet-preview-next">
                              Next: {nextJob.id || "No job ID"}
                            </div>
                            <div className="fleet-preview-next">
                              {nextJob.originCity || "Unknown origin"} -&gt;{" "}
                              {nextJob.destinationCity || "Unknown destination"}
                            </div>
                            <div className="fleet-preview-next">
                              {getBoardJobTimeLabel(nextJob)}
                            </div>
                          </>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </section>
            </section>
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
        <section className="workspace-view workspace-panel job-workspace">
          <div className="job-workspace-header">
            <div>
              <p className="panel-kicker">Job workspace</p>
              <h2>Selected Job Control</h2>
              <p className="panel-subtitle">
                Review the selected job, trip content, nodes, assignment, instructions
                and validation result.
              </p>
            </div>

            <div className="job-selector-block">
              <label htmlFor="job-workspace-selector">Selected job</label>
              <select
                id="job-workspace-selector"
                value={selectedJobId}
                onChange={(event) => {
                  const nextJobId = event.target.value;
                  setSelectedJobId(nextJobId);
                  const nextJob = dailyJobs.find((job) => job.id === nextJobId);
                  if (nextJob) {
                    syncPlannerStateFromJob(nextJob);
                  }
                }}
              >
                {dailyJobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.id} · {job.customer || "Unknown customer"} ·{" "}
                    {job.originCity || "Origin TBD"} →{" "}
                    {job.destinationCity || "Destination TBD"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            className="job-workspace-tabs"
            role="tablist"
            aria-label="Job workspace sections"
          >
            {jobWorkspaceTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`job-workspace-tab ${
                  jobWorkspaceTab === tab.id ? "active" : ""
                }`}
                onClick={() => setJobWorkspaceTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="job-workspace-layout">
            <div className="job-workspace-main">
              {jobWorkspaceTab === "overview" && (
                <div className="job-tab-panel">
                  <div className="panel-section-header">
                    <h3>Overview</h3>
                    <span className={getJobStatusClass(selectedJob?.status)}>
                      {selectedJob?.status || "Status unknown"}
                    </span>
                  </div>

                  <div className="job-summary-grid">
                    <div>
                      <span>Job ID</span>
                      <strong>{selectedJob?.id || "No job selected"}</strong>
                    </div>
                    <div>
                      <span>Trip ID</span>
                      <strong>{getDemoTripDetailsForJob(selectedJob).tripId}</strong>
                    </div>
                    <div>
                      <span>Customer</span>
                      <strong>{selectedJob?.customer || "Unknown customer"}</strong>
                    </div>
                    <div>
                      <span>Route</span>
                      <strong>
                        {selectedJob?.originCity || "Origin TBD"} →{" "}
                        {selectedJob?.destinationCity || "Destination TBD"}
                      </strong>
                    </div>
                    <div>
                      <span>Time window</span>
                      <strong>
                        {selectedJob?.loadingTime || "Start TBD"} –{" "}
                        {selectedJob?.deliveryTime || "End TBD"}
                      </strong>
                    </div>
                    <div>
                      <span>Truck</span>
                      <strong>{selectedJob?.truck || "Truck TBD"}</strong>
                    </div>
                    <div>
                      <span>Trailer</span>
                      <strong>{selectedJob?.trailerType || "Trailer TBD"}</strong>
                    </div>
                    <div>
                      <span>Handling</span>
                      <strong>
                        {selectedJob?.handlingType || "Handling TBD"} ·{" "}
                        {selectedJob?.handlingDurationMinutes || 0} min
                      </strong>
                    </div>
                    <div>
                      <span>Next step</span>
                      <strong>
                        {selectedJob?.status === "Open"
                          ? "Assign truck / driver"
                          : "Review validation and instructions"}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {jobWorkspaceTab === "tripOrders" && (
                <div className="job-tab-panel">
                  <div className="panel-section-header">
                    <h3>Trip & Orders</h3>
                    <span>{getDemoTripDetailsForJob(selectedJob).planningStatus}</span>
                  </div>

                  <div className="trip-summary-strip">
                    <div>
                      <span>Trip</span>
                      <strong>{getDemoTripDetailsForJob(selectedJob).tripId}</strong>
                    </div>
                    <div>
                      <span>Type</span>
                      <strong>{getDemoTripDetailsForJob(selectedJob).tripType}</strong>
                    </div>
                    <div>
                      <span>Orders</span>
                      <strong>{getDemoTripDetailsForJob(selectedJob).orderCount}</strong>
                    </div>
                    <div>
                      <span>Stops</span>
                      <strong>{getDemoTripDetailsForJob(selectedJob).stopsCount}</strong>
                    </div>
                  </div>

                  <div className="job-data-table-wrapper">
                    <table className="job-data-table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Customer</th>
                          <th>Pickup</th>
                          <th>Delivery</th>
                          <th>Goods</th>
                          <th>LDM</th>
                          <th>KG</th>
                          <th>Temp</th>
                          <th>Req.</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getDemoOrdersForJob(selectedJob).map((order) => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.pickup}</td>
                            <td>{order.delivery}</td>
                            <td>{order.goods}</td>
                            <td>{order.ldm}</td>
                            <td>{order.kg}</td>
                            <td>{order.temperature}</td>
                            <td>
                              <div className="requirement-badges">
                                {order.adr && <span>ADR</span>}
                                {order.gdp && <span>GDP</span>}
                                {!order.adr && !order.gdp && <span>Standard</span>}
                              </div>
                            </td>
                            <td>{order.planningStatus}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {jobWorkspaceTab === "stopsNodes" && (
                <div className="job-tab-panel">
                  <div className="panel-section-header">
                    <h3>Stops / Nodes</h3>
                    <span>Physical trip events</span>
                  </div>

                  <div className="job-node-list">
                    {getDemoNodesForJob(selectedJob).map((node, index) => (
                      <div className="job-node-card" key={node.id}>
                        <div className="job-node-index">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <strong>{node.type}</strong>
                          <span>
                            {node.location} · {node.time}
                          </span>
                          <p>{node.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {jobWorkspaceTab === "assignment" && (
                <div className="job-tab-panel">
                  <div className="panel-section-header">
                    <h3>Assignment</h3>
                    <span>{getDemoAssignmentCheckForJob(selectedJob).capabilityStatus}</span>
                  </div>

                  <div className="job-summary-grid">
                    <div>
                      <span>Carrier</span>
                      <strong>{getDemoAssignmentCheckForJob(selectedJob).carrier}</strong>
                    </div>
                    <div>
                      <span>Truck</span>
                      <strong>{selectedJob?.truck || "Truck TBD"}</strong>
                    </div>
                    <div>
                      <span>Trailer</span>
                      <strong>{selectedJob?.trailerType || "Trailer TBD"}</strong>
                    </div>
                    <div>
                      <span>Driver</span>
                      <strong>{getDemoAssignmentCheckForJob(selectedJob).driver}</strong>
                    </div>
                    <div>
                      <span>ADR capability</span>
                      <strong>
                        {getDemoAssignmentCheckForJob(selectedJob).adrCapable
                          ? "Available"
                          : "Not available"}
                      </strong>
                    </div>
                    <div>
                      <span>GDP capability</span>
                      <strong>
                        {getDemoAssignmentCheckForJob(selectedJob).gdpCapable
                          ? "Available"
                          : "Not available"}
                      </strong>
                    </div>
                    <div>
                      <span>Trailer check</span>
                      <strong>
                        {getDemoAssignmentCheckForJob(selectedJob).trailerCheck}
                      </strong>
                    </div>
                    <div>
                      <span>Assignment status</span>
                      <strong>
                        {selectedJob?.status === "Open"
                          ? "Open / needs assignment"
                          : "Assigned"}
                      </strong>
                    </div>
                  </div>

                  {selectedJob?.status === "Open" && (
                    <div className="job-assignment-action">
                      <p>This demo job is open. Assign a truck to continue planning.</p>

                      <div className="assignment-controls">
                        <select
                          value={selectedAssignTruck}
                          onChange={(event) => setSelectedAssignTruck(event.target.value)}
                        >
                          {availableTrucks.map((truck) => (
                            <option key={truck} value={truck}>
                              {truck}
                            </option>
                          ))}
                        </select>

                        <button type="button" onClick={handleAssignTruckToSelectedJob}>
                          Assign truck
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {jobWorkspaceTab === "instructions" && (
                <div className="job-tab-panel">
                  <div className="panel-section-header">
                    <h3>Instructions</h3>
                    <span>Demo driver / carrier preview</span>
                  </div>

                  <div className="job-instruction-preview">
                    <p>
                      <strong>Job:</strong> {selectedJob?.id || "No job selected"}
                    </p>
                    <p>
                      <strong>Trip:</strong>{" "}
                      {getDemoTripDetailsForJob(selectedJob).tripId}
                    </p>
                    <p>
                      Pick up / start from {selectedJob?.originCity || "Demo origin"} and
                      continue to {selectedJob?.destinationCity || "Demo destination"}{" "}
                      according to the node sequence.
                    </p>
                    <p>
                      Handling: {selectedJob?.handlingType || "Handling TBD"} · estimated{" "}
                      {selectedJob?.handlingDurationMinutes || 0} min.
                    </p>
                    <p>
                      Trailer: {selectedJob?.trailerType || "Trailer TBD"}. Check trailer
                      condition, temperature setting if required, documents and load
                      securing equipment before departure.
                    </p>
                    <p>
                      Send ETA update before arrival and confirm completion after the final
                      node. Wait for next demo instruction if the trip continues with
                      another driver.
                    </p>
                    <p className="demo-note">
                      Demo preview only. All names, references, places and instructions are
                      fictional.
                    </p>
                  </div>
                </div>
              )}

              {jobWorkspaceTab === "validation" && (
                <div className="job-tab-panel">
                  <div className="panel-section-header">
                    <h3>Validation</h3>
                    <span>{selectedJob?.status || "Not checked"}</span>
                  </div>

                  <div className="job-validation-list">
                    <div>
                      <strong>Driving time</strong>
                      <span>
                        Current preview uses the existing FleetFlow driving time logic.
                      </span>
                    </div>
                    <div>
                      <strong>Break requirement</strong>
                      <span>
                        {selectedJob?.status === "Break required"
                          ? "Break required before completion."
                          : "No break warning in selected job status."}
                      </span>
                    </div>
                    <div>
                      <strong>Daily driving limit</strong>
                      <span>
                        {selectedJob?.status === "Risk"
                          ? "Review 9h daily driving limit."
                          : "No daily driving risk in selected job status."}
                      </span>
                    </div>
                    <div>
                      <strong>ADR check</strong>
                      <span>
                        {getDemoAssignmentCheckForJob(selectedJob).requiresAdr
                          ? getDemoAssignmentCheckForJob(selectedJob).capabilityStatus
                          : "No ADR requirement in demo order."}
                      </span>
                    </div>
                    <div>
                      <strong>GDP check</strong>
                      <span>
                        {getDemoAssignmentCheckForJob(selectedJob).requiresGdp
                          ? getDemoAssignmentCheckForJob(selectedJob).capabilityStatus
                          : "No GDP requirement in demo order."}
                      </span>
                    </div>
                    <div>
                      <strong>Trailer type</strong>
                      <span>{getDemoAssignmentCheckForJob(selectedJob).trailerCheck}</span>
                    </div>
                    <div>
                      <strong>Location continuity</strong>
                      <span>
                        Placeholder for later route continuity and sequence validation.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <aside className="job-workspace-side">
              <div className="side-panel">
                <h3>Job Planning Log</h3>
                <ul className="job-planning-log">
                  <li>Selected {selectedJob?.id || "no job"} loaded to Job workspace.</li>
                  <li>Status: {selectedJob?.status || "Unknown"}.</li>
                  <li>
                    Route: {selectedJob?.originCity || "Origin TBD"} →{" "}
                    {selectedJob?.destinationCity || "Destination TBD"}.
                  </li>
                  <li>
                    Handling: {selectedJob?.handlingType || "Handling TBD"} ·{" "}
                    {selectedJob?.handlingDurationMinutes || 0} min.
                  </li>
                  <li>
                    Use Fleet tab for full day plan check and truck sequence validation.
                  </li>
                </ul>
              </div>
            </aside>
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
