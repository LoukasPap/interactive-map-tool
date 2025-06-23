// import { memo } from "react";

const MarkersList = ({ markers }) => (
  <div style={{position: "fixed"}}>
    <h3>Markers inside the rectangle:</h3>
    {markers.length > 0 && (
      <div>
        Length: {markers.length}
      </div>
    )}
  </div>
);

export default MarkersList;
