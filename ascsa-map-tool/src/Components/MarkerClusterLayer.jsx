import { useEffect } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useMap } from "react-leaflet";
import getGenericIcon from "../assets/Icons/Markers/GenericIcon";

import "leaflet-markers-canvas";
import "../leaflet-iconex";
import "../demo.css";

import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { bboxPolygon } from "@turf/bbox-polygon";
import { point } from "@turf/helpers";

function calculateBounds(bounds) {
  const northEast = bounds.getNorthEast();
  const southWest = bounds.getSouthWest();
  const bboxList = [
    southWest.lng, // West
    southWest.lat, // South
    northEast.lng, // East
    northEast.lat, // North
  ];

  return bboxPolygon(bboxList);
}

const eraToColor = {
  Prehistoric: "#71717A",
  Greek: "#3B82F6",
  Roman: "#EF4444",
  Byzantine: "#F97316",
  Medieval: "#22C55E",
  Turkish: "#EAB308",
  Modern: "#EC4899",
  No: "#000000",
};

const MarkerClusterLayer = ({ geojson, bounds, setSelectedProperty }) => {
  const map = useMap();



  useEffect(() => {
    if (!map || !geojson) return;

    console.log("[LOG] - Rendering MarkerCluster");

    const bbox = calculateBounds(bounds);

    const markerClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false,
      removeOutsideVisibleBounds: true,
      disableClusteringAtZoom: 22,
      animate: true,
      chunkedLoading: true,
    });

    geojson.features
      .filter((f) => {  
        const p = point(f.geometry.coordinates);
        return booleanPointInPolygon(p, bbox);
      })
      .forEach((f) => {
        const marker = L.marker(
          [f.geometry.coordinates[1], f.geometry.coordinates[0]],
          {
            opacity: 1,
            icon: new L.IconEx({
              contentHtml: `<i class="fas fa-monument"></i>`,
              iconFill: eraToColor[f.properties.Era],
              contentColor: "#000",
            }),
          }
        ).on({
          click: (e) => {
            setSelectedProperty({ f });
            console.log("Clicked marker:", f.id);
          },
        });
        marker.bindPopup(f.properties.Item || "Point");
        markerClusterGroup.addLayer(marker);
      });

    map.addLayer(markerClusterGroup);

    // Cleanup on unmount
    return () => {
      map.removeLayer(markerClusterGroup);
    };
  }, [map, bounds, geojson]);

  return null;
};

export default MarkerClusterLayer;
