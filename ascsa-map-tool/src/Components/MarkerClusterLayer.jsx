import { useEffect } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useMap } from "react-leaflet";

import "leaflet-markers-canvas";
import "../leaflet-iconex";
import "../demo.css";
import { getMaterialIconSTR } from "./Interactions";

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

const MarkerClusterLayer = ({ geojson, setSelectedProperty }) => {
  const map = useMap();

  useEffect(() => {
    console.log("[LOG] - Rendering MarkerCluster");
    if (!map || !geojson) return;

    const markerClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: true,
      zoomToBoundsOnClick: false,
      removeOutsideVisibleBounds: true,
      disableClusteringAtZoom: 21,
      animate: true,
      chunkedLoading: true,
    });

    geojson.forEach((f) => {
      const iconSVG = getMaterialIconSTR(f.properties.MaterialCategory[0]);
      const marker = L.marker(
        [f.geometry.coordinates[1], f.geometry.coordinates[0]],
        {
          opacity: 1,
          icon: new L.IconEx({
            contentHtml: iconSVG,
            iconFill: eraToColor[f.properties.Era],
            contentHtmlSize: [16, 16],
          }),
        }
      ).on({
        click: (e) => {
          setSelectedProperty({ f });
          console.log("Clicked marker:", f);
        },
      });
      marker.bindPopup(f.properties.Title || "-");
      markerClusterGroup.addLayer(marker);
    });

    map.addLayer(markerClusterGroup);

    // Cleanup on unmount
    return () => {
      map.removeLayer(markerClusterGroup);
    };
  }, [map, geojson]);

  return null;
};

export default MarkerClusterLayer;
