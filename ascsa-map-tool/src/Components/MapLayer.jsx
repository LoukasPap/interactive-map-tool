import { useState, useRef, useEffect } from "react";

import L from "leaflet";
import "leaflet-draw";

import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Rectangle,
  ScaleControl,
  ImageOverlay,
  ZoomControl,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { LuMenu } from "react-icons/lu";
// import ClusteredPoints from "./ClusteredPoints";
import { data } from "../data/data_many";

import Info from "./Info";
import CanvasMarkersLayer from "./MarkersLayer";
import MarkersList from "./MarkersList";
import Bar from "./ActionBar/ActionBar";
import FilterCard from "./FilterBar/FilterCard";
import EasyButtons from "./FilterBar/EasyButtons";
import SinglePointCard from "./PointsDisplay/PointCard";

import {
  Box,
  HStack,
  Icon,
  Text,
  CloseButton,
  Drawer,
  Portal,
  VStack,
} from "@chakra-ui/react";
import MarkerClusterLayer from "./MarkerClusterLayer";

// for spatial operations
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { bboxPolygon } from "@turf/bbox-polygon";
import { point, polygon } from "@turf/helpers";

import {
  isSectionEmpty,
  getSectionFilter,
} from "./Helpers";

const initialBounds = [
  [37.972834, 23.721197], // Southwest corner
  [37.976726, 23.724362], // Northeast corner
];

const MapLayer = () => {
  console.log("[LOG] - Render Map Layer");
  const [periodFilters, setPeriodFilters] = useState([]);

  const [filters, setFilters] = useState({ materials: [], section: "" });
  const prevFilters = usePrevious(filters);
  const [bounds, setBounds] = useState(null);
  const dataInBounds = useRef(null);

  const mapRef = useRef();
  const [activeData, setActiveData] = useState([]);

  const mapRef = useRef();

  const [markersInBounds, setMarkersInBounds] = useState([]);

  const [activeTool, setActiveTool] = useState(null);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const [zoom, setZoom] = useState(13);

  const [areFiltersOpen, toggleFilters] = useState(false);
  const [isExtraOpen, toggleExtra] = useState(false);

  const checkIntersectingMarkers = (shapeType, layer) => {
    if (shapeType === "Circle") {
      const center = layer.getLatLng();
      const radius = layer.getRadius();

      const intersectingMarkers = activeData.filter((marker) => {
        const [lng, lat] = marker.geometry["coordinates"];
        const markerLatLng = L.latLng(lat, lng);
        return center.distanceTo(markerLatLng) <= radius;
      });
      setMarkersInBounds(intersectingMarkers);
      console.log("Circle intersecting markers:", intersectingMarkers);
    } else if (shapeType === "Rectangle") {
      const bounds = layer.getBounds();
      const intersectingMarkers = activeData.filter((marker) => {
        const [lng, lat] = marker.geometry["coordinates"];
        const markerLatLng = L.latLng(lat, lng);
        return bounds.contains(markerLatLng);
      });
      setMarkersInBounds(intersectingMarkers);
      console.log("Rectangle intersecting markers:", intersectingMarkers);
    } else if (shapeType === "Polygon") {
      const bounds = layer.getLatLngs()[0].map((m) => [m.lng, m.lat]);
      const closedBounds = [...bounds, bounds[0]];
      const polygonBounds = polygon([closedBounds]);
      const intersectingMarkers = activeData.filter((marker) => {
        const p = point([
          marker.geometry["coordinates"][0],
          marker.geometry["coordinates"][1],
        ]);
        return booleanPointInPolygon(p, polygonBounds);
      });
      setMarkersInBounds(intersectingMarkers);
      console.log("Polygon intersecting markers:", intersectingMarkers);
    }
  };

  const onCircleCreated = (e) => {
    if (e.shape === "Circle") {
      const circle = e.layer;
      circle.on("pm:edit", () => {
        checkIntersectingMarkers("Circle", circle);
        console.log("This circle was updated!");
      });
      checkIntersectingMarkers("Circle", circle);
      setActiveTool("select");
    }
  };

  const onRectangleCreated = (e) => {
    if (e.shape === "Rectangle") {
      const rectangle = e.layer;
      rectangle.on("pm:edit", () => {
        checkIntersectingMarkers("Rectangle", rectangle);
        console.log("This rectangle was updated!");
      });
      checkIntersectingMarkers("Rectangle", rectangle);
      setActiveTool("select");
    }
  };

  const onPolygonCreated = (e) => {
    if (e.shape === "Polygon") {
      const polygonLayer = e.layer;
      polygonLayer.on("pm:edit", () => {
        checkIntersectingMarkers("Polygon", polygonLayer);
        console.log("This polygon was updated!");
      });
      checkIntersectingMarkers("Polygon", polygonLayer);
      setActiveTool("select");
    }
  };

  const ZoomTracker = () => {
    useMapEvents({
      zoomend: (e) => {
        const newZoom = e.target.getZoom();
        setZoom(newZoom);

  const MoveTracker = () => {
    useMapEvents({
      moveend: (e) => {
        setBounds(mapRef.current.getBounds());
        console.log("New bounds:", bounds);
        
      },
    });
    return null;
  };

  function calculateBounds(bounds) {
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    const bboxList = [
      southWest.lng, // West
      southWest.lat, // South
      northEast.lng, // East
      northEast.lat, // North
    ];

    return bboxPolygon(bboxList);
  }

  useEffect(() => {
    console.log("ActiveData updated:", activeData);
  }, [activeData]);

  useEffect(() => {
      let bbox = initialBounds;
      if (bounds != null) {
        bbox = calculateBounds(bounds);
      }

    let newActiveData = data.features
      .filter((f) => periodFilters.includes(f.properties.Era))
      .filter((f) =>
        filters.materials.some((material) =>
          f.properties.MaterialCategory.includes(material)
        )
      )
      .filter((f) => {
        const p = point(f.geometry.coordinates);
        return booleanPointInPolygon(p, bbox);
      });

    if (!isSectionEmpty(filters.section)) {
      const sectionFilter = getSectionFilter(filters.section);
      console.log("[DEBUG] sectionFilter:", sectionFilter);
      newActiveData = newActiveData.filter(
        (f) => f.properties[sectionFilter] == filters.section[sectionFilter]
      );
    }

    setActiveData(newActiveData);
  }, [filters, periodFilters, bounds]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    setActiveTool("select");

    map.on("pm:create", onCircleCreated);
    map.on("pm:create", onRectangleCreated);
    map.on("pm:create", onPolygonCreated);

    return () => {
      map.off("pm:create", onCircleCreated);
      map.off("pm:create", onRectangleCreated);
      map.off("pm:create", onPolygonCreated);
    };
  }, [mapReady, activeData]);

  const [open, setOpen] = useState(false);
  return (
    <>
      <MapContainer
        center={[37.974724, 23.722502]}
        zoom={17}
        minZoom={0}
        maxZoom={24}
        zoomControl={false}
        scrollWheelZoom={true}
        whenReady={({ target }) => {
          setMapReady(true);
          mapRef.current = target;
          mapRef.current.fitBounds(initialBounds);
          setBounds(mapRef.current.getBounds());
        }}
      >
        <TileLayer
          maxZoom="24"
          zoom="17"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {zoom >= 18 && (
          <ImageOverlay
            url="balloon.jpg"
            bounds={[
              [37.972834, 23.721197], // Southwest corner
              [37.976726, 23.724362], // Northeast corner
            ]}
            opacity={1}
          />
        )}
        {zoom >= 18 && (
          <ImageOverlay
            url="SectionBZ_BE-2002.jpg"
            bounds={[
              [37.976383, 23.722364], // Southwest corner
              [37.976816, 23.722842], // Northeast corner
            ]}
            opacity={0.95}
          />
        )}

        {/* {mapReady && (
          <CanvasMarkersLayer
            map={mapRef.current}
            geodata={data}
            setSelectedProperty={setSelectedProperty}
          />
        )} */}

        {/* <ClusteredPoints geojson={data} /> */}

        <MarkerClusterLayer
          geojson={activeData}
          setSelectedProperty={setSelectedProperty}
        />

        <ZoomTracker />
        <MoveTracker />
        <ScaleControl position="bottomleft" />
        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* <Info picked={selectedProperty}> </Info> */}

      {console.log("MAP LAYER", [selectedProperty])}
      <SinglePointCard point={selectedProperty} />

      <Bar
        isPeriodBarOpen={isExtraOpen}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        mapRef={mapRef.current}
      />

      <Box w="fit" m="12px" pos={"relative"} h="100%" pointerEvents="none">
        <HStack alignItems="flex-end" pointerEvents="auto">
          <VStack>
            <HStack
              w="22.5vw"
              h="5vh"
              bg="white"
              justifyContent="flex-start"
              paddingInline="10px"
              border="1px solid #C6C6C6"
              rounded="10px"
            >
              <Icon
                variant="plain"
                pos="absolute"
                rounded="sm"
                _hover={{ bg: "gray.300" }}
                onClick={() => setOpen(true)}
              >
                <LuMenu size="20" cursor="pointer" />
              </Icon>
              <Text fontSize="2xl" textAlign="center" flexGrow={1}>
                ASCSA Map Tool
              </Text>
            </HStack>

            {/* The filters Card*/}
            <FilterCard
              areFiltersOpen={areFiltersOpen}
              setPeriodFilters={setPeriodFilters}
              setFilters={setFilters}
            />
          </VStack>

          <EasyButtons
            toggleFilters={toggleFilters}
            toggleExtra={toggleExtra}
          ></EasyButtons>
        </HStack>

        <Drawer.Root
          open={open}
          size="sm"
          placement="start"
          onOpenChange={(e) => setOpen(e.open)}
        >
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Header>
                  <Drawer.Title>Drawer Title</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <p>
                    Drawer Body
                  </p>
                </Drawer.Body>
                <Drawer.Footer>
                </Drawer.Footer>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>

        <FilterCard areFiltersOpen={areFiltersOpen}/>
      </Box>

      {activeTool in ["rectangle", "circle", "polygon"] && (
        <MarkersList markers={markersInBounds} />
      )}
    </>
  );
};
export default MapLayer;
