import { useState, useRef, useEffect, createRef } from "react";

import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

import {
  MapContainer,
  TileLayer,
  useMapEvents,
  ScaleControl,
  ZoomControl,
} from "react-leaflet";

import Bar from "./ActionBar/ActionBar";
import FilterCard from "./FilterBar/FilterCard";
import CollectionsCard from "./Collections/CollectionsCard";
import EasyButtons from "./FilterBar/EasyButtons";

import SingleMarkerCard from "./MarkerCards/SingleMarkerCard";
import MultipleMarkersCard from "./MarkerCards/MultipleMarkersCard";

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
import { bboxPolygon } from "@turf/bbox-polygon";

import {
  applySectionFilter,
  applyMonumentFilter,
  applyPeriodFilter,
  applyInventoryFilter,
  hasTextSearchFilterChanged,
  isTextSearchFilterEmpty,
  calculateBounds,
  getCurrentDateTime,
  generateRandomIdUrlSafe,
  setOpacityOfDOMMarkers,
} from "./Helpers";

import { onShapeCreated } from "./GeometryOperations";
import { deactivateHandlers, handleDrawShape, handleEvent } from "./Handlers";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import usePrevious from "./CustomHooks/usePrevious";
import SectionsLayer from "./LayerSelector/SectionsLayer";
import SectionsLayerCard from "./LayerSelector/SectionsLayerCard";

export const globalMIBRef = createRef([]); // MIB: MarkersInBound

const initialBounds = [
  [37.972834, 23.721197], // Southwest corner
  [37.976726, 23.724362], // Northeast corner
];

const CLOSE = false;
const OPEN = true;

const FILTER_CARD = "filters";
const COLLECTIONS_CARD = "collections";
const LAYERS_CARD = "layers";
const NONE = "";

const emptyFiltersState = {
  textSearch: {
    includeInput: "",
    excludeInput: "",
    limit: "",
  },
  periods: [],
  inventory: [],
  section: {
    SectionNumber: "",
    SectionNumberLetter: "",
    SectionNumberNumber: "",
  },
  monument: {
    ShowMonuments: "No",
    Condition: [],
  },
};
const iconExClass = ".leaflet-iconex";

const MapLayer = () => {
  console.log("[LOG] - Render Map Layer");

  const currentShape = useRef(null);

  const [filters, setFilters] = useState(emptyFiltersState);
  const prevFilter = usePrevious(filters);

  const [bounds, setBounds] = useState(null);

  const mapRef = useRef();
  const [activeData, setActiveData] = useState([]);

  const [markersInBounds, setMarkersInBounds] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState({});

  const [activeTool, setActiveTool] = useState("select");

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const [zoom, setZoom] = useState(13);

  const [markersCard, toggleMarkersCard] = useState("");
  const [userCardOpen, setUserCardOpen] = useState(NONE);

  const [savedCollections, setSavedCollections] = useState([]);
  const allCollectionsRef = useRef([]);
  const isSavedInCollection = useRef(false);

  const savedIDS = useRef([]);
  const tempIDS = useRef([]);

  const [visibleCollections, setVisibleCollections] = useState([]);

  const [sectionImages, setSectionImages] = useState([]);
  const [titlesVisibility, setTitlesVisibility] = useState(true);

  const cidRef = useRef(0);
  const qc = useQueryClient();

  const token = localStorage.getItem("token");
  const cachedUser = qc.getQueryData(["verifyToken", token]); // may be undefined
  const currentUser = cachedUser;

    onMutate: (variables) => {
      // A mutation is about to happen!
      console.log("LOG] Starting to mutate!");

      return { id: 1 };
    },
    onSuccess: (data, variables, context) => {
      console.log("[LOG] Success!");
      qc.setQueryData(["data"], data);
      console.log("[LOG] Changed Query data", qc.getQueryData(["data"]));
    },
    onError: (error, variables, context) => {
      // An error happened!
      console.log(`[LOG] Error! --> ${error}`);
    },
  });

  async function fetchPoints() {
    const res = await fetch(`${BASE_URL}/objects`);
    if (!res.ok) throw new Error("Failed to fetch points");
    const dt = await res.json();
    console.log("Fetched points data:", dt);
    return dt;
  }

  let { isLoading, isError, data, error } = useQuery({
    queryKey: ["data"], // unique key for caching
    queryFn: fetchPoints,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

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

  useEffect(() => {
    console.log("Markers in bound:", markersInBounds);

    if (globalMIBRef.current != null && globalMIBRef.current.length != 0) {
      const selectedMarkersNames = markersInBounds.map((m) => m.Name);
      const domIconElements = document.querySelectorAll(iconExHTMLClass);

      domIconElements.forEach((icon) => {
        const markerName = icon.id;
        if (!selectedMarkersNames.includes(markerName)) {
          icon.style.opacity = "0.2";
        } else {
          icon.style.opacity = "1";
        }
      });
    }
  }, [markersInBounds, zoom]);

  async function runTextSearchMutation() {
    if (hasTextSearchFilterChanged(filters.textSearch, prevFilter.textSearch)) {
      if (isTextSearchFilterEmpty(filters.textSearch)) {
        console.log("[LOG] REFETCHING");
        await qc.refetchQueries({ queryKey: ["data"] });
      } else {
        await mutation.mutateAsync();
      }

      console.log("[LOG] Done fetching text!");
      return qc.getQueryData(["data"]);
    }

    return null;
  }

  useEffect(() => {
    console.log("[LOG] Filters applied:", filters);
    console.log("[LOG] Points fetched:", data);

    (async () => {
      let updated = await runTextSearchMutation();

      if (updated) {
        console.log("[LOG] Updated --> ", updated);
        applyClientSideFilters(updated);
      } else {
        let current = qc.getQueryData(["data"]) || data;
        applyClientSideFilters(current);
      }

      console.log("[LOG] Finished updated markers in map.");
    })();
  }, [filters]);

  // on create shape
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    map.on("pm:create", (e) => {
      console.log("[DEBUG] - [ON CREATE SHAPE] - ENTER");
      currentShape.current = e;
      e.layer._path.style.strokeDasharray = "10px";
      onShapeCreated(e, activeData, onEditEvents);

      createCollection({
        name: `Temporary #${cidRef.current}`,
        description: "-",
        type: e.shape,
      });

      toggleMarkersCard("multi");
      setTool("Edit");
      console.log("[DEBUG] - [ON CREATE SHAPE] - EXIT");
    });

    return () => {
      map.off("pm:create");
    };
  }, [mapReady, activeData]);

  function applyClientSideFilters(newActiveData) {
    console.log("[LOG] Applying client side filters, with data", newActiveData);

    let monumentData = newActiveData.features.filter((m) => m.Type == "monument" && m.geometry != null);
    newActiveData = newActiveData.features.filter((m) => m.geometry != null && m.Type != "monument");

    let bbox = initialBounds;
    if (bounds != null) bbox = calculateBounds(bounds);

    const monumentsVisibility = filters.monument.ShowMonuments;

    if (monumentsVisibility != "Only") {
      newActiveData = applyPeriodFilter(newActiveData, filters);
      // newActiveData = applyBoundFilter(newActiveData, bbox);
    }

    newActiveData = applyInventoryFilter(newActiveData, filters);
    // We push the monuments_data second to be more efficient (they are just ~50 allocations)
    newActiveData = applyMonumentFilter(
      newActiveData,
      monumentData,
      monumentsVisibility,
      filters
    );

    newActiveData = applySectionFilter(newActiveData, filters);
    newActiveData = newActiveData.filter((x) => x.geometry != null); // Remove points with no geometry for now

    console.log("[LOG] new newActiveData", newActiveData);
    setActiveData(newActiveData);
  }

  function onShapeClick(c) {
    isSavedInCollection.current = isCollectionSaved(c.id);

    setSelectedCollection(
      allCollectionsRef.current.find((col) => col.id === c.id)
    );
    toggleMarkersCard("multi");
  }

  async function onShapeEdit(collection) {
    console.log("[DEBUG] - START EDIT SHAPE:", collection);

    const currentCollectionState = allCollectionsRef.current.find(
      (c) => c.id == collection.id
    );

    if (currentCollectionState.isSaved) {
      await updateCollection({
        ...currentCollectionState,
        shape: collection.shape,
      });
    }

    setSelectedCollection((prev) => ({
      ...prev,
      markers: globalMIBRef.current,
    }));

    allCollectionsRef.current = allCollectionsRef.current.map((col) =>
      col.id === collection.id
        ? {
            ...col,
            markers: globalMIBRef.current,
            date: getCurrentDateTime(),
          }
        : col
    );

    setSavedCollections((prev) => {
      const next = prev.map((col) =>
        col.id === collection.id
          ? {
              ...col,
              markers: globalMIBRef.current,
              date: getCurrentDateTime(),
            }
          : col
      );
      return next;
    });

    console.log("[DEBUG] - FINISH EDIT SHAPE:", collection.id);
  }

  function onEditEvents(e) {
    setMarkersInBounds(e);
  }

  function displayMarkerCard(e) {
    setSelectedMarker({ feature: e.point });
    toggleMarkersCard("single");
  }

  function createCollection(c) {
    console.log("[DEBUG] - [CREATE COLLECTION] - ENTER", c);

    const rid = generateRandomIdUrlSafe();
    const newCollection = {
      id: rid,
      name: c.name,
      description: c.description,
      markers: globalMIBRef.current,
      shape: currentShape.current,
      date: getCurrentDateTime(),
      isSaved: false,
      type: currentShape.current.shape,
    };
    console.log("[DEBUG] - [CREATE COLLECTION] - newCollection", newCollection);

    allCollectionsRef.current = [...allCollectionsRef.current, newCollection];
    setSavedCollections((prev) => [...prev, newCollection]);

    if (newCollection.shape) {
      newCollection.shape.layer.on("click", () => onShapeClick(newCollection));
      newCollection.shape.layer.on(
        "pm:edit",
        async () => await onShapeEdit(newCollection)
      );
    }

    setSelectedCollection(newCollection);
    setVisibleCollections((prev) =>
      prev.includes(newCollection.id) ? prev : [...prev, newCollection.id]
    );

    pushAndIncreaseTempsId(rid);

    console.log("[DEBUG] - [CREATE COLLECTION] - EXIT");
  }

  function saveCollection(c) {
    console.log("[DEBUG] - [SAVE COLLECTION] - ENTER", c);

    const savedCollection = {
      id: c.id,
      name: c.name,
      description: c.description,
      markers: markersInBounds,
      date: getCurrentDateTime(),
      shape: c.shape,
      isSaved: true,
    };

    allCollectionsRef.current = allCollectionsRef.current.map((col) =>
      col.id == c.id ? savedCollection : col
    );

    setSavedCollections(allCollectionsRef.current);
    c.shape.layer._path.style.strokeDasharray = "";

    savedIDS.current.push(c.id);
    removeTempId(c.id);
    setSelectedCollection(savedCollection);

    console.log("[DEBUG] - [SAVE COLLECTION] - EXIT");
  }

  function viewCollection(c) {
    currentShape.current = c.shape;
    globalMIBRef.current = c.markers;
    isSavedInCollection.current = c.id;
    setMarkersInBounds([...c.markers]);
    // Draw the shape on the map
    if (c.shape && c.shape.layer) {
      c.shape.layer.addTo(mapRef.current);
    }
    // setOpacityOfDOMMarkers(0.2);
  }

  function hideCollection(c) {
    if (currentShape.current && currentShape.current.layer) {
      currentShape.current.layer.remove();
    }
    currentShape.current = null;
    globalMIBRef.current = [];
    toggleMarkersCard("");
    isSavedInCollection.current = -1;
    setOpacityOfDOMMarkers(1);
  }

  function deleteCollection(c) {
    globalMIBRef.current = [];
    setOpacityOfDOMMarkers(1);
    console.log("Here it is");
    c.shape.layer.remove();
    currentShape.current = null;
    setMarkersInBounds([]);

    const newSavedCollections = savedCollections.filter(
      (col) => col.id !== c.id
    );
    setSavedCollections(newSavedCollections);
  }

  function updateCollection() {
    console.log("Update Collection", isSavedInCollection.current);
    const updatedCollections = savedCollections.map((col) =>
      col.id === isSavedInCollection.current
        ? {
            ...col,
            markers: markersInBounds,
            shape: currentShape.current,
            date: new Date().toLocaleDateString(),
          }
        : col
    );
    setSavedCollections(updatedCollections);
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

  function isCollectionSaved(id) {
    return savedIDS.current.find((cid) => cid == id) != undefined;
  }

  function pushAndIncreaseTempsId(id) {
    tempIDS.current.push(id);
    cidRef.current = cidRef.current + 1; // increase id
  }

  function removeTempId(id) {
    const tempId = tempIDS.current.indexOf(id);
    tempIDS.current = tempIDS.current.filter((cid) => cid != tempId);
  }

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

        <SectionsLayer />

        <MarkerClusterLayer
          data={activeData}
          onMarkerClick={displayMarkerCard}
        />

        <ZoomTracker />
        <MoveTracker />
        <ScaleControl position="bottomleft" />
        <ZoomControl position="bottomright" />

        <SectionsLayer sectionImages={sectionImages} areTitlesEnabled={titlesVisibility}/>
      </MapContainer>

      <SingleMarkerCard
        marker={
          selectedMarker != null ? selectedMarker.feature : selectedMarker
        }
        toggleCard={toggleMarkersCard}
        isVisible={markersCard == "single"}
      />

      <MultipleMarkersCard
        collection={selectedCollection}
        markers={markersInBounds}
        saveCollection={saveCollection}
        isSavedInCollection={isSavedInCollection.current}
        isVisible={markersCard == "multi"}
        onMarkerClick={displayMarkerCard}
      />

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

          <CollectionsCard
            areCollectionsOpen={userCardOpen == COLLECTIONS_CARD}
            savedCollections={savedCollections}
            viewCollection={viewCollection}
            hideCollection={hideCollection}
            deleteCollection={deleteCollection}
          />

          <FilterCard
            areFiltersOpen={userCardOpen == FILTER_CARD}
            setFilters={setFilters}
            filterLoading={qc.isMutating() + qc.isFetching() > 0}
          />

          <SectionsLayerCard
            areLayersOpen={userCardOpen == LAYERS_CARD}
            setImages={setSectionImages}
            toggleTitles={setTitlesVisibility}
          />
        </VStack>
      </Box>
    </>
  );
};

export default MapLayer;
