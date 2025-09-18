import { useEffect } from "react";
import { useMap } from "react-leaflet";

import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import "../leaflet-iconex";
import "../demo.css";

import { createMarker, attachEvents } from "./MarkersHelpers";

const MarkerClusterLayer = ({ data, onMarkerClick }) => {
  const map = useMap();

  useEffect(() => {
    console.log("[LOG] - Rendering MarkerCluster");
    if (!map || !data) return;

    const markerClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: true,
      zoomToBoundsOnClick: false,
      removeOutsideVisibleBounds: true,
      disableClusteringAtZoom: 21,
      animate: true,
      chunkedLoading: true,
    });

    data.forEach((feature) => {
      const marker = createMarker(feature);

      attachEvents(marker, onMarkerClick, feature);

      marker.options.pmIgnore = true;
    });

    map.addLayer(markerClusterGroup);
    markerClusterGroup.options.pmIgnore = true;

    // Cleanup on unmount
    return () => {
      map.removeLayer(markerClusterGroup);
    };
  }, [map, data]);

  return null;
};

export default MarkerClusterLayer;
