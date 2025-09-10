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

import { isSectionEmpty, getSectionFilter, isArrayEmpty } from "./Helpers";
import { onShapeCreated } from "./GeometryOperations";
import { deactivateHandlers, handleDrawShape, handleEvent } from "./Handlers";
import MultipleMarkersCard from "./PointsDisplay/MultipleMarkersCard";

const initialBounds = [
  [37.972834, 23.721197], // Southwest corner
  [37.976726, 23.724362], // Northeast corner
];

const CLOSE = false;
const OPEN = true;

const MapLayer = () => {
  console.log("[LOG] - Render Map Layer");

  const currentShape = useRef(null);

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

  const [activeTool, setActiveTool] = useState(null);

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const [zoom, setZoom] = useState(13);

  const [markersCard, toggleMarkersCard] = useState("");
  const [areFiltersOpen, toggleFilters] = useState(false);
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
    console.log("ActiveData updated:", activeData);
  }, [activeData]);

  useEffect(() => {
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

    if (monumentsVisibility != "No") {
      const conditions = filters.monument.Condition || [];
      let monumentData = monument_data.features;
      if (!isArrayEmpty(conditions)) {
        monumentData = monumentData.filter((f) =>
          conditions.includes(f.properties.CleanCondition)
        );
      }
      newActiveData.push(...monumentData);
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
    }
    console.log("[DEBUG] only", newActiveData);

    let newMonumentData = [];
    const areMonumentsVisible = showMonuments(monumentsVisibility);

    if (areMonumentsVisible) {
      console.log("[DEBUG] visiblr");
      const conditions = filters.monument.Condition || [];
      newMonumentData = monument_data.features.filter((f) =>
        conditions.includes(f.properties.CleanCondition)
      );
    }

    newActiveData.push(...newMonumentData);

    setActiveData(newActiveData);
  }, [filters, periodFilters, bounds]);

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
    toggleMarkerCard(OPEN);
  }

  function finishShapeCreation() {
    setTool("Select");
    toggleShapesBar(CLOSE);
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
        console.log("setTool() - Default case", tool)
    }
    
  }

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
            toggleFilters={toggleFilters}
            toggleExtra={toggleShapesBar}
          ></EasyButtons>

          {/* The filters Card*/}
          <FilterCard areFiltersOpen={areFiltersOpen} setFilters={setFilters} />
        </VStack>

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
