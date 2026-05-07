import { useState } from "react";
import "./App.css";
import MapView from "./MapView";

export default function App() {
  const [theme, setTheme] = useState("dark");

  const [loadingCity, setLoadingCity] = useState("");
  const [unloadingCity, setUnloadingCity] = useState("");
  const [loadingTime, setLoadingTime] = useState("");
  const [unloadingTime, setUnloadingTime] = useState("");
  const [trailertype, setTrailertype] = useState("pressu");
  const [drivers, setDrivers] = useState(1);
  const [fixUnload, setFixUnload] = useState(false);

  const cityDistances = {
    helsinki_tampere: 180,
    tampere_helsinki: 180,
    helsinki_turku: 165,
    turku_helsinki: 165,
    turku_tampere: 160,
    tampere_turku: 160,
    helsinki_oulu: 610,
    oulu_helsinki: 610,
    tampere_oulu: 485,
    oulu_tampere: 485,
    turku_oulu: 640,
    oulu_turku: 640,
  };

  const getDistance = () => {
    const key = `${(loadingCity || "").trim().toLowerCase()}_${(
      unloadingCity || ""
    )
      .trim()
      .toLowerCase()}`;

    return cityDistances[key] || null;
  };

  const getDrivingMinutes = (km) => {
    if (!km) return null;
    return Math.round((km / 80) * 60);
  };

  const formatMinutes = (minutes) => {
    if (minutes === null || minutes === undefined) return "-";

    const h = Math.floor(minutes / 60);
    const min = minutes % 60;

    return `${h}h ${min.toString().padStart(2, "0")}min`;
  };

  const timeToMinutes = (time) => {
    if (!time) return null;

    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (totalMinutes) => {
    if (totalMinutes === null || totalMinutes === undefined) return "-";

    const minutesInDay = 24 * 60;
    const normalizedMinutes = totalMinutes % minutesInDay;

    const h = Math.floor(normalizedMinutes / 60);
    const min = normalizedMinutes % 60;

    return `${h.toString().padStart(2, "0")}:${min
      .toString()
      .padStart(2, "0")}`;
  };

  const getScheduleStatus = () => {
    const loadingMinutes = timeToMinutes(loadingTime);
    const unloadingMinutes = timeToMinutes(unloadingTime);

    if (!loadingMinutes || !unloadingMinutes || !drivingMinutes) {
      return {
        arrivalTime: "-",
        scheduleText: "Ei riittäviä aikatietoja",
      };
    }

    const arrivalMinutes = loadingMinutes + drivingMinutes;
    const difference = unloadingMinutes - arrivalMinutes;

    if (difference >= 30) {
      return {
        arrivalTime: minutesToTime(arrivalMinutes),
        scheduleText: `OK, pelivaraa ${formatMinutes(difference)}`,
      };
    }

    if (difference >= 0) {
      return {
        arrivalTime: minutesToTime(arrivalMinutes),
        scheduleText: `Riski, pelivaraa vain ${formatMinutes(difference)}`,
      };
    }

    return {
      arrivalTime: minutesToTime(arrivalMinutes),
      scheduleText: `Myöhästyy ${Math.abs(difference)} min`,
    };
  };

  const distance = getDistance();
  const drivingMinutes = getDrivingMinutes(distance);
  const drivingTime = formatMinutes(drivingMinutes);
  const schedule = getScheduleStatus();

    const getDriverRuleCheck = () => {
    if (!drivingMinutes) {
      return {
        breakNeeded: "-",
        legalDrivingTime: "-",
        totalTimeWithBreaks: null,
        text: "Ei ajotietoja",
      };
    }

    const maxDailyDrivingMinutes = 9 * 60;
    const breakLimitMinutes = 4.5 * 60;
    const breakMinutes = 45;

    const needsBreak = drivingMinutes > breakLimitMinutes;
    const totalWithBreaks = needsBreak
      ? drivingMinutes + breakMinutes
      : drivingMinutes;

    if (drivingMinutes > maxDailyDrivingMinutes) {
      return {
        breakNeeded: needsBreak ? "Kyllä, 45 min" : "Ei",
        legalDrivingTime: "Ei onnistu",
        totalTimeWithBreaks: totalWithBreaks,
        text: "Päivän ajoaika ylittää 9 h",
      };
    }

    return {
      breakNeeded: needsBreak ? "Kyllä, 45 min" : "Ei",
      legalDrivingTime: "OK",
      totalTimeWithBreaks: totalWithBreaks,
      text: needsBreak
        ? "Tauko lisätty ajoaikaan"
        : "Ei taukoa tällä matkalla",
    };
  };

  const driverRules = getDriverRuleCheck();

  const getStatus = () => {
    if (!loadingCity || !unloadingCity) return "Ei tietoja";
    if (!distance) return "Ei tietoja";
    if (driverRules.legalDrivingTime === "Ei onnistu") return "Ei onnistu";

    if (fixUnload && schedule.scheduleText.includes("Myöhästyy")) {
      return "Ei onnistu";
    }

    if (fixUnload && schedule.scheduleText.includes("Riski")) {
      return "Riski";
    }

    if (fixUnload && drivers === 1 && distance > 400) return "Ei onnistu";
    if (fixUnload && drivers === 1 && distance > 250) return "Riski";

    return "OK";
  };

  const status = getStatus();
  const statusClass = status.toLowerCase().replaceAll(" ", "-");

  const getScheduleClass = () => {
  if (!schedule || !schedule.scheduleText) return "";

  if (schedule.scheduleText.includes("Myöhästyy")) return "bad";
  if (schedule.scheduleText.includes("Riski")) return "warn";
  if (schedule.scheduleText.includes("OK")) return "good";

  return "";
  };

  return (
    <div className={`app ${theme}`}>
      <div className="container">
        <h1>Traffic Coordinator Planner</h1>

        <div className="theme-switcher">
          <button onClick={() => setTheme("dark")}>Tumma</button>
          <button onClick={() => setTheme("light")}>Vaalea</button>
          <button onClick={() => setTheme("classic")}>Klassinen</button>
        </div>

        <div className="card">
          <h2>Lastaus</h2>

          <input
            placeholder="Kaupunki"
            value={loadingCity}
            onChange={(e) => setLoadingCity(e.target.value)}
          />

          <input
            type="time"
            value={loadingTime}
            onChange={(e) => setLoadingTime(e.target.value)}
          />
        </div>

        <div className="card">
          <h2>Purku</h2>

          <input
            placeholder="Kaupunki"
            value={unloadingCity}
            onChange={(e) => setUnloadingCity(e.target.value)}
          />

          <input
            type="time"
            value={unloadingTime}
            onChange={(e) => setUnloadingTime(e.target.value)}
          />

          <label>
            <input
              type="checkbox"
              checked={fixUnload}
              onChange={() => setFixUnload(!fixUnload)}
            />
            Fix purku
          </label>
        </div>

        <div className="card">
          <h2>Kalusto</h2>

          <select
            value={trailertype}
            onChange={(e) => setTrailertype(e.target.value)}
          >
            <option value="pressu">Pressu</option>
            <option value="kaappi">Umpikaappi</option>
            <option value="side">Sivusta aukeava</option>
            <option value="temp">2-kylmäkone</option>
          </select>

          <input
            type="number"
            min="1"
            value={drivers}
            onChange={(e) => setDrivers(Number(e.target.value))}
          />
        </div>

        <div className="card">
          <h2>Reitti</h2>
          <MapView loadingCity={loadingCity} unloadingCity={unloadingCity} />
        </div>

        <div className="card">
          <h2>Ajotiedot</h2>
          <p>Etäisyys: {distance ? `${distance} km` : "-"}</p>
          <p>Ajoaika ilman taukoja: {drivingTime}</p>
          <p>Taukotarve: {driverRules.breakNeeded}</p>
          <p>
            Ajoaika taukoineen:{" "}
            {driverRules.totalTimeWithBreaks
              ? formatMinutes(driverRules.totalTimeWithBreaks)
              : "-"}
          </p>
          <p>Arvioitu saapuminen: {schedule.arrivalTime}</p>
          <p className={`schedule ${getScheduleClass()}`}>
            Aikataulu: {schedule.scheduleText}
          </p>
          <p>Ajoaikasääntö: {driverRules.legalDrivingTime}</p>
          <p>Huomio: {driverRules.text}</p>
        </div>

        <div className={`result ${statusClass}`}>
          <h2>Tulos: {status}</h2>
        </div>
      </div>
    </div>
  );
}