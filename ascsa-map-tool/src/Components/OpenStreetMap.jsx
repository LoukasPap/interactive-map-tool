import React, { useState } from "react";
import Plot from "react-plotly.js";

const OpenStreetMap = ({ onPoclick }) => {
  const [data] = useState([
    {
      type: "scattermapbox",
      lat: [37.976724, 37.974675], // Example latitudes (San Francisco, Los Angeles, New York)
      lon: [23.72266, 23.722502], // Example longitudes
      mode: "markers",
      marker: { size: 7, color: "red" },
      text: ["Object1", "Object2"], // Tooltip text
      customdata: ["Jewelry and Gems", "Coin:N 30531"], // Custom data for each point
    },
  ]);

  const layout = {
    title: "",
    mapbox: {
      style: "open-street-map", // You can use other styles like 'carto-positron', 'stamen-terrain', etc.
      center: { lat: 37.976724, lon: 23.722502 }, // Center of the map
      zoom: 14, // Zoom level
    },
    autosize: true, // Automatically size the plot
    margin: { l: 0, r: 0, t: 0, b: 0 }, // Remove margins
  };

  const handleClick = (data) => {
    if (data.points && data.points.length > 0) {
      const point = data.points[0];
      console.log("Clicked point:", point.customdata);
      onPoclick(point.customdata);
    }
  };

  return (
    <Plot
      data={data}
      layout={layout}
      onClick={handleClick}
      config={{
        modeBarButtonsToAdd: [
          "drawline",
          "drawopenpath",
          "drawclosedpath",
          "drawcircle",
          "drawrect",
          "eraseshape",
        ],
      }}
      style={{ width: "100%", height: "100vh" }} // Optional: If using Mapbox
    />
  );
};

export default OpenStreetMap;
