import { useState, useRef, useMemo, useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMapEvents,
  Rectangle,
  ScaleControl,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { Icon, divIcon, icon } from "leaflet";
import { data } from "./data";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import CoinIcon from "../assets/Icons/Markers/CoinIcon";
import JeweleryIcon from "../assets/Icons/Markers/JeweleryIcon";
import StatueIcon from "../assets/Icons/Markers/StatueIcon";
import Info from "./Info";
import MapTitle from "./MapTitle";

const DraggableRectangle = ({ bounds }) => {
  return <Rectangle bounds={bounds} />;
};

const LMap = () => {
  const [drawing, setDrawing] = useState(false);
  const [bounds, setBounds] = useState(null);
  const startPoint = useRef(null);
  const [markersInBounds, setMarkersInBounds] = useState([]);
  const mapRef = useRef();
  const [geoJsonData, setGeoJsonData] = useState(null);

  const [info, setInfo] = useState(null);

  const toggleDrawing = () => {
    setDrawing(!drawing);
    if (drawing) {
      // Reset bounds when exiting drawing mode
      setBounds(null);
      startPoint.current = null;
      setMarkersInBounds([]); // Clear detected markers
    }
  };

  const [selectedProperty, setSelectedProperty] = useState(null);
  const onEachFeature = (feature, layer) => {
    const ttip = `
    <div class="flex flex-col justify-center ">
    <p class="p-2 m-2">${feature.properties.Item}</p>
    <img src="https://img.icons8.com/fluency/80/kawaii-coffee.png"></img>
    </div>
    `;

    layer.bindTooltip(ttip || "No tooltip available");

    layer.on({
      click: () => {
        // Retrieve the property you want to display
        const property = feature.properties; // Adjust this based on your GeoJSON structure
        console.log(property.Period);
        setSelectedProperty(property.Period);
      },
    });
  };

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (drawing) {
          if (!startPoint.current) {
            // First click: set the starting point
            startPoint.current = e.latlng;
            console.log(startPoint.current);
          } else {
            // Second click: set the ending point and create the rectangle
            const firstPoint = startPoint.current;
            const secondPoint = e.latlng;
            startPoint.current = null; // Reset the starting point for the next rectangle
            setBounds([firstPoint, secondPoint]);

            if (firstPoint.lat > secondPoint.lat) {
              const tmp = firstPoint.lat;
              firstPoint.lat = secondPoint.lat;
              secondPoint.lat = tmp;
            }
            if (firstPoint.lng > secondPoint.lng) {
              const tmp = firstPoint.lng;
              firstPoint.lng = secondPoint.lng;
              secondPoint.lng = tmp;
            }
            // console.log(data)
            // Check which points are intersecting with the drawing box
            const markersInside = data.features.filter((marker) => {
              // 0 = latitude, 1 = longitude
              const markerLatLng = marker.geometry["coordinates"];

              return (
                firstPoint.lat <= markerLatLng[1] &&
                markerLatLng[1] <= secondPoint.lat &&
                firstPoint.lng <= markerLatLng[0] &&
                markerLatLng[0] <= secondPoint.lng
              );
            });
            console.log(markersInside);
            setMarkersInBounds(markersInside);
          }
        }
      },
      mousemove(e) {
        if (drawing && startPoint.current) {
          const southWest = startPoint.current;
          const northEast = e.latlng;
          setBounds([southWest, northEast]);
        }
      },
    });
    return null;
  };

  const getIcon = (properties) => {
    // Determine which icon to use based on properties
    if (properties.Item === "Coin") {
      return CoinIcon;
    } else if (properties.Item === "Jewelery") {
      return JeweleryIcon;
    } else {
      return StatueIcon;
    }
  };

  // const toP = (feature, latlng, layer) => {
  //   return L.circleMarker(latlng);
  // };

  // const ClusteredGeoJSON = ({ data }) => {
  //   const map = useMap();

  //   useEffect(() => {
  //     const clusterGroup = L.markerClusterGroup();

  //     data.features.forEach((feature) => {
  //       const layer = L.geoJSON(feature, {
  //         onEachFeature: onEachFeature,
  //         pointToLayer: toP,
  //       });

  //       clusterGroup.addLayer(layer);
  //     });

  //     map.addLayer(clusterGroup);

  //     // Cleanup function to remove the cluster group when the component unmounts
  //     return () => {
  //       map.removeLayer(clusterGroup);
  //     };
  //   }, [data, map]);

  //   return null; // This component does not render anything itself
  // };

  return (
    <>
      <button
        class="text-gray-200 absolute top-[100px] left-10 z-10 w-40 h-70 border-2 hover:bg-gray-300 border-black bg-gray-500 p-5 rounded-md "
        onClick={toggleDrawing}
      >
        {drawing ? "Stop Drawing" : "Draw Rectangle"}
      </button>

      <section class="section-selected">
        <h3>Markers inside the rectangle:</h3>
        {markersInBounds.length > 0 && (
          <div>
            <ol>
              {markersInBounds.map((marker, index) => (
                <li key={index}>{marker.properties.Item}</li>
              ))}
            </ol>
          </div>
        )}
      </section>

      <Info picked={selectedProperty}> </Info>

      <MapContainer
        center={[37.976724, 23.722502]}
        zoom={13}
        scrollWheelZoom={true}
        whenReady={(mapInstance) => {
          mapRef.current = mapInstance; // Store the map instance
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {bounds && <DraggableRectangle bounds={bounds} />}
        <MapEvents />
        <GeoJSON
          data={data}
          onEachFeature={onEachFeature}
          pointToLayer={(feature, latlng) => {
            return L.circleMarker(latlng); // Use the custom icon for points
            // return L.marker(latlng, { icon: getIcon(feature.properties) }); // Use the custom icon for points
          }}
          style={() => ({
            weight: 1,
            color: "black",
            fillColor: "whitesmoke",
            fillOpacity: 0.5,
          })}
        />
        <ScaleControl position="bottomright" />
      </MapContainer>
    </>
  );
};

export default LMap;
