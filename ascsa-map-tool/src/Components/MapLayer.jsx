import { useState, useRef, useEffect } from "react";

import L from "leaflet";
import "leaflet-draw";

import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

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
import MarkersList from "./MarkersList";

const MapLayer = () => {
  console.log("[LOG] - Render Map Layer");

  const mapRef = useRef();

  const [markersInBounds, setMarkersInBounds] = useState([]);
  const [bounds, setBounds] = useState(null);
  const [activeTool, setActiveTool] = useState(null);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const [zoom, setZoom] = useState(13);

  const onCircleCreated = (e) => {
    console.log("onCircleSelect - enter");

    if (e.shape === "Circle") {
      const circle = e.layer;
      const center = circle.getLatLng();
      const radius = circle.getRadius();

      // Assuming your data is an array of { lat, lng, ... }
      const intersectingMarkers = data.features.filter((marker) => {
        const [lng, lat] = marker.geometry["coordinates"];
        const markerLatLng = L.latLng(lat, lng);

        return center.distanceTo(markerLatLng) <= radius;
      });

      setMarkersInBounds(intersectingMarkers);
      console.log("Here", intersectingMarkers);

      setActiveTool("select");
      console.log("onCircleSelect - exit");
    }
  };

  const onRectangleCreated = (e) => {
    if (e.shape === "Rectangle") {
      const rectangle = e.layer;
      const bounds = rectangle.getBounds();

      const intersectingMarkers = data.features.filter((marker) => {
        const [lng, lat] = marker.geometry["coordinates"];
        const markerLatLng = L.latLng(lat, lng);

        return bounds.contains(markerLatLng);
      });

      setMarkersInBounds(intersectingMarkers);
      console.log("Rectangle selection:", intersectingMarkers);
      setActiveTool("select");
    }
  };

  const ZoomTracker = () => {
    useMapEvents({
      zoomend: (e) => {
        const newZoom = e.target.getZoom();
        setZoom(newZoom);
      },
    });
    return null;
  };

  useEffect(() => {
    if (!mapRef.current) return;
    setActiveTool("select");

    mapRef.current.on("pm:create", onCircleCreated);
    mapRef.current.on("pm:create", onRectangleCreated);

    // Cleanup
    return () => {
      mapRef.current.off("pm:create", onCircleCreated);
      mapRef.current.off("pm:create", onRectangleCreated);
    };
  }, [mapReady]);

  return (
    <>
      <MapContainer
        center={[37.974724, 23.722502]}
        zoom={15}
        minZoom={0}
        maxZoom={24}
        scrollWheelZoom={true}
        whenReady={({ target }) => {
          setMapReady(true);
          mapRef.current = target;
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
      </MapContainer>

      <Info picked={selectedProperty}> </Info>

      <ActionBar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        mapRef={mapRef.current}
      />
      {activeTool in ["rectangle", "circle"] && (
        <MarkersList markers={markersInBounds} />
      )}
    </>
  );
};
export default MapLayer;
