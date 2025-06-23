import { useRef, useState } from "react";
import { useMapEvents, Rectangle } from "react-leaflet";

const DrawRectangleTool = ({ active, data, onMarkersSelected, onBoundsChange }) => {
  const [bounds, setBounds] = useState(null);
  const startPoint = useRef(null);

  useMapEvents({
    click(e) {
      if (!active) return;
      if (!startPoint.current) {
        startPoint.current = e.latlng;
        console.log(startPoint.current);
      } else {
        const firstPoint = startPoint.current;
        const secondPoint = e.latlng;
        startPoint.current = null;
        setBounds([firstPoint, secondPoint]);
        onBoundsChange = [firstPoint, secondPoint];

        const minPointLat = Math.min(firstPoint.lat, secondPoint.lat);
        const maxPointLat = Math.max(firstPoint.lat, secondPoint.lat);
        const minPointLng =  Math.min(firstPoint.lng, secondPoint.lng);
        const maxpointLng = Math.max(firstPoint.lng, secondPoint.lng);


        // Find markers inside rectangle
        if (data) {
          const markersInside = data.features.filter(marker => {
            const [lng, lat] = marker.geometry["coordinates"];
            return (
              minPointLat <= lat && lat <= maxPointLat &&
              minPointLng <= lng && lng <= maxpointLng
            );
          });
          onMarkersSelected(markersInside);
        }

      }
    },
    mousemove(e) {
      if (active && startPoint.current) {
        setBounds([startPoint.current, e.latlng]);
        onBoundsChange = [startPoint.current, e.latlng];
      }
    },
  });

  return bounds ? <Rectangle bounds={bounds} /> : null;
};

export default DrawRectangleTool;