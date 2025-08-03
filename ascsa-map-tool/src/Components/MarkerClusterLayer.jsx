import { useEffect } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useMap } from "react-leaflet";
import getGenericIcon from "../assets/Icons/Markers/GenericIcon";

import "leaflet-markers-canvas";

const MarkerClusterLayer = ({ geojson, setSelectedProperty }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !geojson) return;

    const canvasLayer = new L.MarkersCanvas({});

    const markerClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false,
      removeOutsideVisibleBounds: true,
      disableClusteringAtZoom: 22,
      animate: true,
      chunkedLoading: true,
    });

    geojson.features
      .filter((f) => f.geometry.type === "Point")
      .forEach((f) => {
        const marker = L.marker(
          [f.geometry.coordinates[1], f.geometry.coordinates[0]],
          {
            icon: getGenericIcon(f.properties.Path),
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
  }, [map, geojson]);

  return null;
};

export default MarkerClusterLayer;
