import { useEffect } from "react";
import L from "leaflet";
import "leaflet-markers-canvas";
import { getIcon } from "./Interactions";

const iconImg = new window.Image();
iconImg.src = "/public/coin-img.png"; // Use absolute path or public URL

const CanvasMarkersLayer = ({ map, geodata, setSelectedProperty }) => {
  useEffect(() => {
    if (!map || !geodata) return;
    
    console.log("Render CanvasMarkersLayer");
    
    const canvasLayer = new L.MarkersCanvas({});
    map.addLayer(canvasLayer);

    geodata.features
      .filter((f) => f.geometry.type === "Point")
      .forEach((f) => {
        const marker = L.marker(
          [f.geometry.coordinates[1], f.geometry.coordinates[0]],
          {
            icon: getIcon
              ? getIcon(f.properties.Item)
              : L.icon({
                  iconUrl: iconImg.src,
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                }),
          }
        ).on({
          mouseover: (e) => {
            e.target
              .bindTooltip(
                `
                <div class="flex flex-col justify-center ">
                <p class="p-2 m-2">${f.properties.Item}</p>
                <img src="https://img.icons8.com/fluency/80/archeology.png"></img>
                </div>
              ` || "No tooltip"
              )
              .openTooltip();
          },
          click: (e) => {
            
            setSelectedProperty({f});
            console.log("Clicked marker:", f.id);

          },
        });

        marker.feature = f; // Attach feature for event access
        canvasLayer.addMarker(marker);

        
      });

    return () => {
      canvasLayer.clear();
      map.removeLayer(canvasLayer);
    };
  }, [map, geodata]);

  return null;
};

export default CanvasMarkersLayer;
