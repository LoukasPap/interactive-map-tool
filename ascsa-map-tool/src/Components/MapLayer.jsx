import { useState, useRef, useEffect } from "react";

import L from "leaflet";
import "leaflet-draw";

import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

import {
  MapContainer,
  TileLayer,
  useMapEvents,
  ScaleControl,
  ZoomControl,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { LuMenu } from "react-icons/lu";
// import ClusteredPoints from "./ClusteredPoints";
import { data } from "../data/dataframe";
import { monumentData } from "../data/m_dataframe";

import Bar from "./ActionBar/ActionBar";
import FilterCard from "./FilterBar/FilterCard";
import EasyButtons from "./FilterBar/EasyButtons";
import SinglePointCard from "./PointsDisplay/PointCard";

import {
  Box,
  CloseButton,
  Drawer,
  Portal,
  Avatar,
  VStack,
} from "@chakra-ui/react";
import MarkerClusterLayer from "./MarkerClusterLayer";

// for spatial operations
import { booleanPointInPolygon } from "@turf/boolean-point-in-polygon";
import { bboxPolygon } from "@turf/bbox-polygon";
import { point } from "@turf/helpers";

import { isSectionEmpty, getSectionFilter, isArrayEmpty } from "./Helpers";

import { onShapeCreated } from "./GeometryOperations";
import { deactivateHandlers, handleDrawShape, handleEvent } from "./Handlers";
import MultipleMarkersCard from "./PointsDisplay/MultipleMarkersCard";
import CollectionsCard from "./Collections/CollectionsCard";

const initialBounds = [
  [37.972834, 23.721197], // Southwest corner
  [37.976726, 23.724362], // Northeast corner
];

const CLOSE = false;
const OPEN = true;

const FILTER_CARD = "filters";
const COLLECTIONS_CARD = "collections";
const NONE = "";

  const emptyFiltersState = {
    periods: [],
    materials: [],
    section: "",
    monument: "Yes",
  };

  const [filters, setFilters] = useState(emptyFiltersState);

  const [bounds, setBounds] = useState(null);

  const mapRef = useRef();
  const [activeData, setActiveData] = useState([]);

  const [markersInBounds, setMarkersInBounds] = useState([]);

  const [activeTool, setActiveTool] = useState("select");

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const [zoom, setZoom] = useState(13);

  const [markersCard, toggleMarkersCard] = useState("");
  const [areFiltersOpen, toggleFilters] = useState(false);
  const [userCardOpen, setUserCardOpen] = useState(NONE);
  const [shapesBar, toggleShapesBar] = useState(false);

  const ZoomTracker = () => {
    useMapEvents({
      zoomend: (e) => {
        const newZoom = e.target.getZoom();
        setZoom(newZoom);
        console.log("zoom", newZoom);
      },
    });
    return null;
  };

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
    toggleMarkersCard("multi");
    console.log("Markers in bound:", markersInBounds);

    const selectedMarkersNames = markersInBounds.map((m) => m.properties.Name);
    const domIconElements = document.querySelectorAll(".leaflet-iconex");

    domIconElements.forEach((icon) => {
      const markerName = icon.id;
      if (!selectedMarkersNames.includes(markerName)) {
        icon.style.opacity = "0.1";
      } else {
        icon.style.opacity = "1";
      }
    });
  }, [markersInBounds]);

  useEffect(() => {
    console.log("[FILTERS] trigger", filters);

    let bbox = initialBounds;
    if (bounds != null) {
      bbox = calculateBounds(bounds);
    }

    let newActiveData = [];
    const monumentsVisibility = filters.monument.ShowMonuments;

    if (monumentsVisibility != "Only") {
      newActiveData = data.features;
      newActiveData = newActiveData.filter((f) =>
        filters.periods.includes(f.properties.Era)
      );
    }

    // We push the monuments_data second to be more efficient (they are just ~50 allocations)
    if (monumentsVisibility != "No") {
      let mData = [];
      const conditions = filters.monument.Condition || [];

      if (!isArrayEmpty(conditions)) {
        mData = monumentData.features.filter((f) =>
          conditions.includes(f.properties.CleanCondition)
        );
      } else {
        mData = monumentData.features;
      }
      newActiveData.push(...mData);
    }

    newActiveData = newActiveData
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
      newActiveData = newActiveData.filter(
        (f) => f.properties[sectionFilter] == filters.section[sectionFilter]
      );
    }

    setActiveData(newActiveData);
  }, [filters, bounds]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    map.on("pm:create", (e) => {
      currentShape.current = e;

      toggleShapesBar(OPEN);
      onShapeCreated(e, activeData, setMarkersInBounds);
      setTool("Edit");
    });

    return () => {
      map.off("pm:create");
    };
  }, [mapReady, activeData]);

  function displayMarkerCard(e) {
    setSelectedMarker(e);
    toggleMarkersCard("single");
  }

  function finishShapeCreation() {
    setTool("Select");
    toggleMarkersCard("");
  }

  function cancelShapeCreation() {
    setTool("Select");
    toggleShapesBar(CLOSE);

    toggleMarkersCard("");

    currentShape.current.layer.remove();
    currentShape.current = null;
  }

  function setTool(tool) {
    setActiveTool(tool);
    
    switch (tool) {
      case "Select":
        deactivateHandlers(mapRef.current);
        break;
      case "Edit":
      case "Remove":
        handleEvent(mapRef.current, tool);
        break;
      case "Circle":
      case "Rectangle":
      case "Polygon":
        handleDrawShape(mapRef.current, tool);
        break;
      default:
        console.log("setTool() - Default case", tool);
    }
  }

  const [isDrawerOpen, toggleDrawer] = useState(CLOSE);
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
          data={activeData}
          onMarkerClick={displayMarkerCard}
        />

        <ZoomTracker />
        <MoveTracker />
        <ScaleControl position="bottomleft" />
        <ZoomControl position="bottomright" />
      </MapContainer>

      {markersCard == "single" ? (
        <SinglePointCard
          marker={
            selectedMarker != null ? selectedMarker.feature : selectedMarker
          }
          toggleCard={toggleMarkersCard}
        />
      ) : markersCard == "multi" ? (
        <MultipleMarkersCard
          markers={markersInBounds}
          finishShape={finishShapeCreation}
          cancelShape={cancelShapeCreation}
        />
      ) : null}

      {mapReady && (
        <Bar
          setTool={setTool}
          activeTool={activeTool}
          mapRef={mapRef.current}
        />
      )}

      <Box w="fit" m="12px" pos="relative" h="100%" pointerEvents="none">
        <VStack w="22.5vw">
          <EasyButtons
            toggleDrawer={toggleDrawer}
            openUserCard={setUserCardOpen}
          ></EasyButtons>

          {/* The User Cards*/}
          {userCardOpen == FILTER_CARD ? (
            <FilterCard
              areFiltersOpen={userCardOpen == FILTER_CARD}
              setFilters={setFilters}
            />
          ) : userCardOpen == COLLECTIONS_CARD ? (
            <CollectionsCard
              areCollectionsOpen={userCardOpen == COLLECTIONS_CARD}
              setFilters={setFilters}
            />
          ) : null}
        </VStack>

        <Drawer.Root
          open={isDrawerOpen}
          size="sm"
          placement="start"
          onOpenChange={(e) => toggleDrawer(e.open)}
        >
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Header>
                  <Avatar.Root size="2xl">
                    <Avatar.Fallback name="Dummy Name" />
                    <Avatar.Image src="./coin-img.png" />
                  </Avatar.Root>
                  <Drawer.Title fontSize="3xl">John Brook</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  <p>Drawer Body</p>
                </Drawer.Body>
                <Drawer.Footer></Drawer.Footer>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root>
      </Box>
    </>
  );
};
export default MapLayer;
