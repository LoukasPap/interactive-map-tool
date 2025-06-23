import { useState, useRef } from "react";

import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Rectangle,
  ScaleControl,
  ImageOverlay,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

// import ClusteredPoints from "./ClusteredPoints";
import { data } from "../data/data_many";

import Info from "./Info";
import CanvasMarkersLayer from "./MarkersLayer";
import ActionBar from "./ActionBar/Bar";
import DrawRectangleTool from "./RectangleSelection";
import MarkersList from "./MarkersList";

const MapLayer = () => {
  
  console.log("[LOG] - Render Map Layer");

  const mapRef = useRef();
  
  const [markersInBounds, setMarkersInBounds] = useState([]);
  const bounds = useState(null);


  const [zoom, setZoom] = useState(13);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const [activeTool, setActiveTool] = useState(null);


  const ZoomTracker = () => {
    useMapEvents({
      zoomend: (e) => {
        const newZoom = e.target.getZoom();
        setZoom(newZoom);
      },
    });
    return null;
  };


  return (
    <>
      <MapContainer
        center={[37.974724, 23.722502]}
        zoom={15}
        minZoom={0}
        maxZoom={24}
        scrollWheelZoom={true}
        whenReady={({ target }) => {
          mapRef.current = target;
          setMapReady(true);
          mapRef.current.fitBounds([
            [37.972834, 23.721197], // Southwest corner
            [37.976726, 23.724362], // Northeast corner
          ]);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {zoom >= 18 && (
          <ImageOverlay
            url="balloon.jpg"
            bounds={[
              [37.972834, 23.721197], // Southwest corner
              [37.976726, 23.724362], // Northeast corner
            ]}
            opacity={1}
          />
        )}
        {zoom >= 18 && (
          <ImageOverlay
            url="SectionBZ_BE-2002.jpg"
            bounds={[
              [37.976383, 23.722364], // Southwest corner
              [37.976816, 23.722842], // Northeast corner
            ]}
            opacity={0.95}
          />
        )}

        {mapReady && (
          <CanvasMarkersLayer
            map={mapRef.current}
            geodata={data}
            setSelectedProperty={setSelectedProperty}
          />
        )}


        {/* <ClusteredPoints geojson={data} /> */}

        <ZoomTracker />
        <ScaleControl position="bottomleft" />

        <DrawRectangleTool
          active={activeTool === "rectangle"}
          data={data}
          onMarkersSelected={setMarkersInBounds}
          onBoundsChange={bounds.current}
        />
      </MapContainer>

      <Info picked={selectedProperty}> </Info>

      <ActionBar activeTool={activeTool} setActiveTool={setActiveTool} />
      {activeTool == "rectangle" && <MarkersList markers={markersInBounds} />}
      

    </>
  );
};
export default MapLayer;
