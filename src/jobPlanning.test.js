import { describe, expect, it } from "vitest";
import { assignTruckToJob, getTruckLocationGaps } from "./jobPlanning";

const job = (id, originCity, destinationCity, loadingTime, extra = {}) => ({
  id, originCity, destinationCity, loadingTime, deliveryTime: "12:00",
  truck: "TR-101", status: "OK", driverHoursToday: 0, ...extra,
});
const freeze = (value) => {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};

describe("truck assignment preserves source data", () => {
  it("preserves every route, order and stop, including later jobs and other trucks", () => {
    const jobs = freeze([
      job("first", "Kotka", "Hanko", "06:00"),
      job("open", "Lahti", "Sipoo", "09:00", {
        truck: "Unassigned", status: "Open", driverHoursToday: 2,
        orders: [{ originCity: "Lahti", reference: "ORDER-1" }],
        stops: [{ city: "Lahti", kind: "loading" }, { city: "Sipoo", kind: "delivery" }],
      }),
      job("later", "Helsinki", "Turku", "15:00"),
      job("other", "Oulu", "Lahti", "07:00", { truck: "TR-102" }),
    ]);
    const result = assignTruckToJob(jobs, "open", "TR-101");
    expect(result).toEqual(jobs.map((item) => item.id === "open"
      ? { ...item, truck: "TR-101", status: "OK", driverHoursToday: 0 } : item));
    expect(result[1].orders).toBe(jobs[1].orders);
    expect(result[1].stops).toBe(jobs[1].stops);
    expect(result[2]).toBe(jobs[2]);
    expect(getTruckLocationGaps(result).map(({ fromCity, toCity }) => [fromCity, toCity]))
      .toEqual([["Hanko", "Lahti"], ["Sipoo", "Helsinki"]]);
    expect(result).toHaveLength(jobs.length);
  });

  it("ignores locked jobs, unknown jobs and invalid assignments", () => {
    const jobs = freeze([job("locked", "A", "B", "08:00")]);
    for (const [id, truck] of [["locked", "TR-102"], ["missing", "TR-102"], ["locked", ""], ["locked", "Unassigned"]]) {
      expect(assignTruckToJob(jobs, id, truck)).toEqual(jobs);
    }
  });
});

describe("temporary location continuity notes", () => {
  it("sorts by numeric start time and detects gaps on both sides of an inserted assignment", () => {
    const jobs = freeze([
      job("late", "E", "F", "14:00"),
      job("early", "A", "B", "9:00"),
      job("middle", "C", "D", "10:00"),
    ]);
    expect(getTruckLocationGaps(jobs).map(({ previousJobId, jobId }) => [previousJobId, jobId]))
      .toEqual([["early", "middle"], ["middle", "late"]]);
  });

  it("uses exact, flexible and range start times like the planner", () => {
    const jobs = [
      job("range", "E", "F", "06:00", { loadingTimeRange: "12:00-13:00" }),
      job("flex", "C", "D", "06:00", { flexibleStart: "10:00" }),
      job("exact", "A", "B", "06:00", { loadingTimeExact: "08:00" }),
    ];
    expect(getTruckLocationGaps(jobs).map((gap) => gap.jobId)).toEqual(["flex", "range"]);
  });

  it("does not invent gaps for continuous locations, unassigned trucks or missing data", () => {
    expect(getTruckLocationGaps([
      job("a", "A", " Hanko Port ", "08:00"),
      job("b", "hanko port", "C", "09:00"),
      job("c", "X", "Y", "10:00", { truck: "Unassigned" }),
      job("d", "X", "Y", "10:00", { truck: "TR-102" }),
      job("e", "", "Y", "11:00"),
      job("f", "X", "Y", "unknown"),
    ])).toEqual([]);
  });

  it("recomputes notes after assignment and reset without writing notes into jobs", () => {
    const original = freeze([
      job("a", "A", "B", "08:00"),
      job("b", "C", "D", "10:00", { truck: "Unassigned", status: "Open" }),
    ]);
    expect(getTruckLocationGaps(original)).toEqual([]);
    const assigned = assignTruckToJob(original, "b", "TR-101");
    expect(getTruckLocationGaps(assigned)).toHaveLength(1);
    expect(getTruckLocationGaps(original)).toEqual([]);
    expect(Object.keys(assigned[1]).sort()).toEqual(Object.keys(original[1]).sort());
  });
});
