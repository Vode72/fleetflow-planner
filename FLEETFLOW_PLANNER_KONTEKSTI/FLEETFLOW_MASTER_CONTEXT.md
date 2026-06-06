# FleetFlow Planner — Master Context

## Project

FleetFlow Planner is a React + Vite based TMS-inspired daily traffic planning cockpit.

The project is a portfolio/demo application for logistics planning, transport coordination and plan validation. It uses only fictional demo data.

FleetFlow Planner is not a production TMS, order management system, carrier master-data system, quotation tool or real dispatch system.

The core idea is to show:

- logistics domain knowledge
- daily traffic planning logic
- React frontend skills
- TMS/SAP/EVO-style business UI thinking
- route/map visualization
- ETA and driving time logic
- trip/order/node/job modelling
- portfolio-level logistics + IT capability

---

## Technology Stack

- React
- Vite
- JavaScript
- Leaflet
- React-Leaflet
- CSS
- GitHub
- GitHub Pages

---

## Development Workflow

The project workflow is:

1. User and ChatGPT plan the structure, logic, UI and implementation steps together.
2. ChatGPT acts as:
   - planner
   - architecture advisor
   - UI/UX sparring partner
   - Codex prompt producer
3. Codex performs the actual code changes.
4. ChatGPT gives the user a clear, directly copyable Codex prompt.
5. Changes are done in small, safe, testable steps.
6. Do not replace the whole application unless absolutely necessary.
7. Do not refactor working views unnecessarily.
8. After each coding step, run:

```bash
npm run lint
npm run build
```

If GitHub Pages live demo must be updated, also run:

```bash
npm run deploy
```

When giving Codex instructions, always use clear anchors:

- ETSI TÄMÄ KOHTA
- LISÄÄ TÄMÄ TÄMÄN JÄLKEEN
- LISÄÄ TÄMÄ TÄMÄN ENNEN
- KORVAA TÄMÄ
- KOPIOI TÄMÄ KOODI

Always provide a small surrounding code snippet or clear anchor so the change location is easy to find.

---

## Data Privacy / Demo Data Rule

FleetFlow Planner must use only fictional demo data.

Do not use:

- real customer names
- real company names
- real order numbers
- real trip numbers
- real unit/trailer identifiers
- real registration numbers
- real drivers
- real people
- real addresses
- real loading or unloading times
- real contact details
- real links
- real port, terminal, ferry or work system identifiers
- real work system rows
- employer screenshots in GitHub, README or demo
- production data
- employer data

Real TMS/EVO/SAP-style workflows can be used only as general inspiration for structure, layout and process logic.

---

## Core Model

FleetFlow Planner’s core planning model is:

```text
Trip → Orders → Nodes / Stops → Jobs → Assignment → Plan Check
```

### Trip

A trip is a transport chain or logistics movement. It can include one or multiple orders and one or multiple physical events.

A trip does not necessarily belong to one driver from start to finish.

### Order

An order is a customer shipment or shipment part attached to a trip.

Possible order fields:

- order reference
- customer
- pickup
- delivery
- pickup/delivery time window
- goods summary
- kg
- ldm
- pallets/colli
- temperature requirement
- ADR requirement
- GDP requirement
- trailer requirement
- order status
- planning status

### Node / Stop

A node is a physical or planning event in the trip chain.

Examples:

- pickup
- loading
- delivery
- unloading
- port pickup
- port drop
- ferry departure
- ferry arrival
- terminal drop
- terminal pickup
- trailer parked
- trailer plugged to electricity
- trailer exchange
- workshop visit
- cold unit service
- body repair
- inspection
- ADR / VAK technical repair
- trailer cleaning
- fuel check
- load securing equipment check

Nodes affect planning, timing, trailer availability, driver sequence and plan validation.

### Job

A job is the executable work unit assigned to one truck / driver / carrier combination.

One trip can create one or multiple jobs.

Important principle:

```text
Trip can continue even when one driver’s job ends.
```

### Assignment

A job is assigned to a carrier / truck / trailer / driver combination.

FleetFlow must later check:

- ADR capability
- GDP capability
- trailer type
- thermo suitability
- assignment status
- not feasible / warning results

Current assumption:

- all demo drivers can handle temperature-controlled transport
- thermo is checked mainly against trailer type
- ADR and GDP are checked against the carrier/truck/driver combination

### Plan Check

FleetFlow checks whether the current daily plan is feasible.

Plan Check should later consider:

- driving times
- handling times
- loading
- unloading
- trailer pickup/drop
- terminal events
- port/ferry events
- workshop/inspection nodes
- breaks
- 4h30 driving → 45 min break
- 9h daily driving limit
- location continuity
- truck-specific job sequences
- ADR/GDP requirements
- trailer type
- buffer
- open/risk/not feasible situations
- need for additional truck/driver

---

## Main Views

FleetFlow Planner has four main workspace tabs:

```text
Board | Job | Fleet | Route & Risk
```

---

## Board

Board is the daily overview.

Main question:

```text
What is the current situation of the day?
```

Current Board structure:

```text
Board
├── Left Control Column
│   ├── Daily Capacity
│   └── Board Detail Panel
│       ├── Selected Job
│       └── Operational Notes
│
├── Center Status Column
│   ├── Day Status
│   ├── Workload
│   ├── Fleet Status
│   └── Next Attention
│
└── Right Operations Column
    ├── Daily Traffic Plan
    └── Fleet Preview
```

Board is not a heavy edit view.

Board must not include:

- full trip/order editing
- Fleet-level Check Plan
- Suggested Plan
- Accept/Reject suggestion
- Additional Truck Needed algorithm
- Route & Risk deep analysis

---

## Job

Job is the selected job workspace.

Main question:

```text
What must be done for the selected job, which trip/orders/nodes does it include, and is it feasible with the selected truck/driver?
```

Current Job Workspace structure:

```text
Job Workspace
├── Job workspace header
├── Selected job dropdown
├── Internal tabs
│   ├── Overview
│   ├── Trip & Orders
│   ├── Stops / Nodes
│   ├── Assignment
│   ├── Instructions
│   └── Validation
└── Job Planning Log
```

Current Job implementation includes:

- `jobWorkspaceTab` state
- `jobWorkspaceTabs` definition
- `selectedJobId` sync
- `syncPlannerStateFromJob`
- current Open-job assignment action
- demo helpers:
  - `getDemoTripDetailsForJob`
  - `getDemoOrdersForJob`
  - `getDemoNodesForJob`
  - `getDemoAssignmentCheckForJob`

Job Workspace tabs are styled to match the Board Detail Panel tab selector style.

---

## Fleet

Fleet is the daily capacity and plan validation core view.

Main question:

```text
Can the available trucks complete the current daily plan?
```

Fleet currently includes:

- truck-specific job sequences
- Fleet Timeline
- jobs in chronological order
- handling
- status
- Fleet Event Log
- Plan Actions area
- Suggested Plan area
- Plan Check Result area
- Additional Truck Needed placeholder

Fleet will later include:

- Check Plan
- issues / warnings
- Suggested recovery plan
- Accept suggestion
- Reject suggestion
- Additional Truck Needed result

Fleet is not an order editing view.

---

## Route & Risk

Route & Risk shows route and risk context for the selected job/trip.

It can include:

- Route Map
- Route Summary
- Route Risk Log
- selected job route
- origin/destination markers
- route polyline
- driving time warning
- break warning
- buffer warning
- ferry / port notes
- terminal / workshop nodes
- route continuity placeholder

Route & Risk must not include:

- Fleet-level Check Plan
- Suggested Plan
- Accept/Reject actions
- Additional Truck Needed decision
- full Job Details/Edit form

---

## Current Technical Status

Implemented:

- React + Vite project
- Leaflet map
- route polyline
- city-based distance calculation
- ETA calculation
- basic EU driving time logic:
  - 4h30 driving → 45 min break
  - 9h daily driving limit
- driver hours today preview
- status logic:
  - OK
  - Break required
  - Risk
  - Open
- dynamic Event Log
- theme selector:
  - classic
  - light / SAP Light
  - dark
- GitHub Pages deploy
- cockpit main tabs:
  - Board
  - Job
  - Fleet
  - Route & Risk
- Board 3-column cockpit layout
- Fleet truck sequence view
- Job Workspace internal tabs
- README screenshots updated
- live demo updated

---

## Themes

FleetFlow Planner has three themes.

### classic

TMS/EVO-inspired default style.

### light / SAP Light

SAP-inspired beige/grey business UI.

Code value remains:

```js
light
```

Target colors:

```css
--bg-main: #f3efe7;
--panel-bg: #fbf8f1;
--panel-header: #e6ded2;
--border: #c9bfb0;
--text-main: #1f2933;
--text-muted: #6b7280;
--accent: #0a6ed1;
```

### dark

Modern dark control room style.

---

## Latest Completed Steps

### Step 8.1A — Job Workspace Internal Tabs

Completed.

Job tab was changed from a long Job Input/Edit style view into a TMS-style Job Workspace.

Added internal tabs:

- Overview
- Trip & Orders
- Stops / Nodes
- Assignment
- Instructions
- Validation

Added:

- Job Planning Log
- selected job dropdown
- `jobWorkspaceTab`
- demo helper functions
- existing assignment action preserved

Board, Fleet and Route & Risk remained unchanged.

### Step 8.1A.1 — Job Workspace Tab UI Polish

Completed.

Fixed internal Job tab layout and hover issue.

### Step 8.1A.2 — Align Job Workspace Tabs with Board Detail Panel

Completed.

Job Workspace tabs were aligned visually with Board Detail Panel tab selectors.

### Step 8.1A.3 — Main Workspace Tab Hover Fix

Completed.

Fixed main workspace tab hover/active styling for:

- Board
- Job
- Fleet
- Route & Risk

Hover no longer turns black in GitHub Pages live demo.

### Step 8.1B — Job Workspace Data Polish

Completed.

Job Workspace was made more data-driven without a full Trip Builder or large refactor.

Added a controlled fictional demo detail structure for selected jobs, including:

- tripId
- tripType
- planningStatus
- orders
- nodes
- requirements
- instructionNotes
- validationNotes

Existing Job Workspace helper functions now read from the improved demo data first and use fallbacks when data is missing.

Board, Fleet and Route & Risk remained unchanged.

### Step 8.1C — Job Workspace Visual Density Polish

Completed.

Job Workspace visual density was improved without changing data logic.

Polished:

- more compact assignment cards
- denser stops / nodes rows
- slightly tighter trip/order table
- clearer instructions layout
- more compact validation rows
- tighter Job Planning Log
- Job Workspace scoped CSS so Board, Fleet and Route & Risk remain unchanged

No data model, helper logic or main workspace tab changes were made.

### Step 8.1C.1 — Compact Job Workspace Header

Completed.

Job Workspace header was compacted without changing data logic or tab content.

Polished:

- reduced vertical whitespace in the Job header
- aligned selected job dropdown with the header area
- made the header more toolbar-like and TMS/SAP-style
- kept Job Workspace tabs and data-driven content unchanged
- preserved responsive stacking for narrower screens

Board, Fleet and Route & Risk remained unchanged.

### Step 8.1C.1.1 — Reduce Job Header Vertical Whitespace

Completed.

Reduced remaining vertical whitespace in the compact Job Workspace header.

Adjusted only scoped Job Workspace header spacing, margins and line-height.

No data logic, helper functions, tab content or other main workspace views were changed.

### Step 8.1C.1.2 — Force Compact Job Header Height

Completed.

Final compact header spacing correction for Job Workspace.

Reduced remaining parent/header whitespace so the selected job header is closer to a compact TMS/SAP toolbar.

No data logic, helper functions, tab content or other workspace views were changed.

### Step 8.1C.1.3 — Convert Job Header to True Compact Toolbar

Completed.

Job Workspace header was converted from a hero-like panel into a true compact toolbar-style header.

Polished:

- title and selected job dropdown aligned in the same compact header area
- Job workspace label moved into the compact description line
- reduced remaining vertical whitespace
- kept selected job dropdown logic unchanged
- kept Job Workspace tabs and content unchanged

Board, Fleet and Route & Risk remained unchanged.

Final correction: ensured the actually rendered Job Workspace header uses the compact toolbar layout.

### Step 8.1C.2 — Add All Jobs Tab to Job Workspace

Completed.

Added an All Jobs internal tab to the Job Workspace.

The All Jobs tab shows a compact clickable list of the current daily jobs so the user can select a job inside the Job workspace without relying only on the selected job dropdown.

Added:

- All Jobs tab before Overview
- compact job list with job id, customer, route, time window, truck/resource, handling and status
- selected row highlight
- click action that selects the job and opens the Overview tab
- scoped Job Workspace CSS for the All Jobs list

The existing selected job dropdown remains available in the compact Job header.

Board, Fleet and Route & Risk remained unchanged.

### README screenshot update

Completed.

Removed old Traffic Coordinator Planner screenshots.

Added new screenshots:

- `images/fleetflow-board.png`
- `images/fleetflow-job-workspace.png`
- `images/fleetflow-fleet.png`
- `images/fleetflow-route-risk.png`

---

## Current Repository Status

Latest known status:

```text
nothing to commit, working tree clean
```

Live demo was updated with:

```bash
npm run deploy
```

---

## Next Recommended Step

### Step 8.1D — Job Workspace Mobile Check / Responsive Polish

Goal:

Check and polish the Job Workspace on narrower screens after the Job Workspace data, density, header and All Jobs improvements.

Possible focus areas:

- internal tab wrapping
- All Jobs responsive list behavior
- order table horizontal scroll
- assignment grid stacking
- validation row readability
- Job Planning Log placement
- no data logic changes
