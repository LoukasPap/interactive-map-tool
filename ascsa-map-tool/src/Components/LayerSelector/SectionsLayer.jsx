import { Box } from "@chakra-ui/react";
import { ImageOverlay } from "react-leaflet/ImageOverlay";
import { Marker } from "react-leaflet/Marker";

const SectionsLayer = ({ sectionImages = [], areTitlesEnabled }) => {
  
  // Label properties
  const offsetLat = 0.0000115;
  const offsetLon = 0.000005;
  function positionLabel(bound) {
    const lat = bound[0];
    const lon = bound[1];
    return [lat + offsetLat, lon + offsetLon];
  }

  return (
    <>
      {sectionImages
        .filter((a) => a.Checked)
        .sort((a, b) => -b.Order + a.Order)
        .map((section, key) => (
          <Box zIndex={key}>
            <ImageOverlay
              key={section.Name}
              url={`./AgoraImages/${section.Path}${section.Title}.jpg`}
              bounds={section.WGS84Bounds}
              opacity={1}
            />

            {areTitlesEnabled && (
              <Marker
                position={positionLabel(section.WGS84Bounds[0])}
                text={section.Title}
                textColor="blue"
                textMarker={true}
              />
            )}
          </Box>
        ))}
    </>
  );
};

export default SectionsLayer;


