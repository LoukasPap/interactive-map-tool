import { useState, useRef, useEffect } from "react";

import L from "leaflet";
import "leaflet-draw";

import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
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
import MarkersList from "./MarkersList";
import Bar from "./ActionBar/ActionBar";

const MapLayer = () => {
  console.log("[LOG] - Render Map Layer");

  const mapRef = useRef();

  const [markersInBounds, setMarkersInBounds] = useState([]);
  const [bounds, setBounds] = useState(null);
  const [activeTool, setActiveTool] = useState(null);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const [zoom, setZoom] = useState(13);

  const checkIntersectingMarkers = (shapeType, layer) => {
    if (shapeType === "Circle") {
      
      const center = layer.getLatLng();
      const radius = layer.getRadius();
      const intersectingMarkers = data.features.filter((marker) => {
        const [lng, lat] = marker.geometry["coordinates"];
        const markerLatLng = L.latLng(lat, lng);
        return center.distanceTo(markerLatLng) <= radius;
      });
      setMarkersInBounds(intersectingMarkers);
      console.log("Circle intersecting markers:", intersectingMarkers);
   
    } else if (shapeType === "Rectangle") {

      const bounds = layer.getBounds();
      const intersectingMarkers = data.features.filter((marker) => {
        const [lng, lat] = marker.geometry["coordinates"];
        const markerLatLng = L.latLng(lat, lng);
        return bounds.contains(markerLatLng);
      });
      setMarkersInBounds(intersectingMarkers);
      console.log("Rectangle intersecting markers:", intersectingMarkers);
    
    } else if (shapeType === "Polygon") {

      const bounds = layer.getLatLngs()[0].map((m) => [m.lng, m.lat]);
      const closedBounds = [...bounds, bounds[0]];
      const polygonBounds = polygon([closedBounds]);
      const intersectingMarkers = data.features.filter((marker) => {
        const p = point([
          marker.geometry["coordinates"][0],
          marker.geometry["coordinates"][1],
        ]);
        return booleanPointInPolygon(p, polygonBounds);
      });
      setMarkersInBounds(intersectingMarkers);
      console.log("Polygon intersecting markers:", intersectingMarkers);
    }
    
  };

  const onCircleCreated = (e) => {
    if (e.shape === "Circle") {
      const circle = e.layer;
      circle.on("pm:edit", () => {
        checkIntersectingMarkers("Circle", circle);
        console.log("This circle was updated!");
      });
      checkIntersectingMarkers("Circle", circle);
      setActiveTool("select");
    }
  };

  const onRectangleCreated = (e) => {
    if (e.shape === "Rectangle") {
      const rectangle = e.layer;
      rectangle.on("pm:edit", () => {
        checkIntersectingMarkers("Rectangle", rectangle);
        console.log("This rectangle was updated!");
      });
      checkIntersectingMarkers("Rectangle", rectangle);
      setActiveTool("select");
    }
  };

  const onPolygonCreated = (e) => {
    if (e.shape === "Polygon") {
      const polygonLayer = e.layer;
      polygonLayer.on("pm:edit", () => {
        checkIntersectingMarkers("Polygon", polygonLayer);
        console.log("This polygon was updated!");
      });
      checkIntersectingMarkers("Polygon", polygonLayer);
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
    const map = mapRef.current;
    setActiveTool("select");

    map.on("pm:create", onCircleCreated);
    map.on("pm:create", onRectangleCreated);
    map.on("pm:create", onPolygonCreated);

    return () => {
      map.off("pm:create", onCircleCreated);
      map.off("pm:create", onRectangleCreated);
      map.off("pm:create", onPolygonCreated);
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

      <Bar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        mapRef={mapRef.current}
      />
      
      {activeTool in ["rectangle", "circle", "polygon"] && (
        <MarkersList markers={markersInBounds} />
      )}
    </>
  );
};
export default MapLayer;
