import "./App.css";

// import Map from './assets/Components/Map'
// import OpenStreetMap from './assets/Components/OpenStreetMap'
// import MapD3 from "./assets/Components/MapD3";
// import { MapContainer } from "react-leaflet/MapContainer";
// import LMap from "./assets/Components/LMap";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import LMap from "./Components/LMap";



function App() {
  // const [text, setText] = useState("");

  return (
    <LMap/>
  );
}

export default App;
