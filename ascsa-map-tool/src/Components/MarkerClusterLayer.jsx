import { useEffect } from "react";
import { useMap } from "react-leaflet";

import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import "../leaflet-iconex";
import "../demo.css";

import { createMarker, attachEvents } from "./MarkersHelpers";
import { useQueryClient } from "@tanstack/react-query";

const MarkerClusterLayer = ({ data, onMarkerClick }) => {
  const map = useMap();
  const qc = useQueryClient();

  useEffect(() => {
    console.log("[LOG] Data in MarkerClusterLayer:", data);
    if (!map || !data) return;

    const markerClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: true,
      zoomToBoundsOnClick: false,
      spiderfyOnEveryZoom: true,
      removeOutsideVisibleBounds: true,
      disableClusteringAtZoom: 22,
      animate: true,
      chunkedLoading: true,
    });

    let markers = [];

    data.forEach((feature) => {
      const marker = createMarker(feature);
      attachEvents(marker, onMarkerClick, feature, qc);

      marker.options.pmIgnore = true;
      markers.push(marker);
    });

    markerClusterGroup.addLayers(markers);
    map.addLayer(markerClusterGroup);
    markerClusterGroup.options.pmIgnore = true;

    // Cleanup on unmount
    return () => {
      markerClusterGroup.clearLayers();
      map.removeLayer(markerClusterGroup);
    };
  }, [map, data]);

  return null;
};

export default MarkerClusterLayer;
