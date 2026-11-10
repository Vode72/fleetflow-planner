import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

vi.mock("react-leaflet", () => ({
  MapContainer: () => <div data-testid="route-map" />,
  TileLayer: () => null, Marker: () => null, Polyline: () => null, Popup: () => null,
}));
afterEach(cleanup);

it("preserves the selected route on assignment, renders all workspaces and clears derived notes on reset", () => {
  render(<App />);
  const click = (name) => fireEvent.click(screen.getByRole("button", { name, exact: true }));
  click("Job");
  fireEvent.change(screen.getByLabelText("Selected job"), { target: { value: "JOB-010" } });
  const selectedRoute = screen.getByRole("option", { name: /JOB-010/ }).textContent;
  click("Trip & Orders");
  const orderSource = () => [...document.querySelectorAll(".job-data-table tbody tr")]
    .map((row) => [...row.cells].slice(0, 9).map((cell) => cell.textContent));
  const originalOrders = orderSource();
  click("Stops / Nodes");
  const originalStops = document.querySelector(".job-node-list").textContent;
  click("Assignment");
  click("Assign truck");
  expect(screen.getByRole("option", { name: /JOB-010/ }).textContent).toBe(selectedRoute);
  const note = screen.getByRole("region", { name: "Temporary planning notes" });
  expect(note.textContent).toContain("JOB-010");
  expect(note.textContent).toContain("Hakkila DC");
  expect(note.textContent).toContain("No automatic transfer drive");
  click("Trip & Orders");
  expect(screen.getByRole("option", { name: /JOB-010/ }).textContent).toBe(selectedRoute);
  expect(orderSource()).toEqual(originalOrders);
  click("Stops / Nodes");
  expect(document.querySelector(".job-node-list").textContent).toBe(originalStops);
  expect(screen.getAllByText(/Hakkila DC/).length).toBeGreaterThan(0);
  click("Fleet");
  click("Check Plan");
  expect(screen.getByRole("region", { name: "Temporary planning notes" })).toBeTruthy();
  click("Route & Risk");
  expect(screen.getByTestId("route-map")).toBeTruthy();
  click("Board");
  fireEvent.click(screen.getAllByRole("button", { name: "Reset demo plan" })[0]);
  expect(screen.queryByRole("region", { name: "Temporary planning notes" })).toBeNull();
});
