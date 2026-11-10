function getRangeStart(timeRange) {
  return timeRange ? timeRange.split("-")[0]?.trim() : "";
}

function getRangeEnd(timeRange) {
  return timeRange ? timeRange.split("-")[1]?.trim() : "";
}

export function getJobStartTime(job) {
  return (
    job.loadingTimeExact ||
    job.flexibleStart ||
    getRangeStart(job.loadingTimeRange) ||
    job.loadingTime
  );
}

export function getJobEndTime(job) {
  return (
    job.deliveryTimeExact ||
    job.flexibleEnd ||
    getRangeEnd(job.deliveryTimeRange) ||
    job.deliveryTime
  );
}

// Assignment changes planning fields only; source routes, orders and stops stay intact.
export function assignTruckToJob(jobs, jobId, truckId) {
  if (!truckId || truckId === "Unassigned") return jobs;
  return jobs.map((job) =>
    job.id === jobId && job.status === "Open"
      ? { ...job, truck: truckId, status: "OK", driverHoursToday: 0 }
      : job,
  );
}

// Derived notes for the current single-day plan, never persisted into source jobs.
export function getTruckLocationGaps(jobs) {
  const byTruck = new Map();
  for (const job of jobs) {
    if (!job.truck || job.truck === "Unassigned") continue;
    if (!byTruck.has(job.truck)) byTruck.set(job.truck, []);
    byTruck.get(job.truck).push(job);
  }

  const minutes = (time) => {
    if (!/^\d{1,2}:\d{2}$/.test(time || "")) return NaN;
    const [hours, mins] = time.split(":").map(Number);
    return hours < 24 && mins < 60 ? hours * 60 + mins : NaN;
  };
  const gaps = [];
  for (const [truck, truckJobs] of byTruck) {
    const ordered = truckJobs
      .filter((job) => Number.isFinite(minutes(getJobStartTime(job))))
      .sort((a, b) => minutes(getJobStartTime(a)) - minutes(getJobStartTime(b)));
    ordered.forEach((job, index) => {
      const previous = ordered[index - 1];
      if (!previous || !previous.destinationCity?.trim() || !job.originCity?.trim()) return;
      if (previous.destinationCity.trim().toLowerCase() === job.originCity.trim().toLowerCase()) return;
      gaps.push({
        truck,
        previousJobId: previous.id,
        jobId: job.id,
        fromCity: previous.destinationCity,
        toCity: job.originCity,
        message: `Location gap: ${truck}, ${previous.id} → ${job.id}: ${previous.destinationCity} → ${job.originCity}.`,
      });
    });
  }
  return gaps;
}
