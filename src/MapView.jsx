import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Yksinkertainen "geokoodaus" (laajennetaan myöhemmin)
const cityCoordinates = {
  helsinki: [60.1699, 24.9384],
  tampere: [61.4978, 23.7610],
  turku: [60.4518, 22.2666],
  oulu: [65.0121, 25.4651],
};

export default function MapView({ loadingCity, unloadingCity }) {
  const start = cityCoordinates[loadingCity?.toLowerCase()];
  const end = cityCoordinates[unloadingCity?.toLowerCase()];

  if (!start || !end) {
    return <p>Syötä tunnetut kaupungit (esim. Helsinki, Tampere)</p>;
  }

  return (
    <MapContainer
      center={start}
      zoom={6}
      style={{ height: "300px", borderRadius: "10px" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={start} />
      <Marker position={end} />

      <Polyline positions={[start, end]} />
    </MapContainer>
  );
}