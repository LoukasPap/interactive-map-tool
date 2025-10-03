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
    limit: ""
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

  const [activeTool, setActiveTool] = useState("select");

  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const [zoom, setZoom] = useState(13);

  const [markersCard, toggleMarkersCard] = useState("");
  const [userCardOpen, setUserCardOpen] = useState(NONE);

  const [savedCollections, setSavedCollections] = useState([]);
  const isSavedInCollection = useRef(-1);

  const [sectionImages, setSectionImages] = useState([]);
  const [titlesVisibility, setTitlesVisibility] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const cidRef = useRef(0);
  const qc = useQueryClient();


  async function fetchFromTextSearch() {
    return fetch(`${BASE_URL}/search-text?${new URLSearchParams(filters.textSearch).toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Searching text request failed");
        return res.json();
      });
  }

  const mutation = useMutation({
    mutationFn: fetchFromTextSearch,
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

  const MoveTracker = () => {
    // useMapEvents({
    //   moveend: (e) => {
    //     setBounds(mapRef.current.getBounds());
    //     console.log("New bounds:", bounds);
    //   },
    // });
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

  function setOpacityOfDOMMarkers(op) {
    const domIconElements = document.querySelectorAll(iconExClass);
    domIconElements.forEach((icon) => {
      icon.style.opacity = op;
    });
  }

  useEffect(() => {
    console.log("Markers in bound:", markersInBounds);

    if (globalMIBRef.current != null && globalMIBRef.current.length != 0) {
      const selectedMarkersNames = markersInBounds.map((m) => m.Name);
      const domIconElements = document.querySelectorAll(iconExClass);

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
        await qc.refetchQueries({ queryKey: ["data"]});
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


  function clickShape() {
    toggleMarkersCard("multi");
    setMarkersInBounds(globalMIBRef.current);
  }

  function viewMarker(e) {    
    setSelectedMarker({feature: e});
    toggleMarkersCard("single");
  }

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    map.on("pm:create", (e) => {
      currentShape.current = e;
      isSavedInCollection.current = -1;
      toggleMarkersCard("multi");
      onShapeCreated(e, activeData, setMarkersInBounds, clickShape);
      setTool("Edit");

      // temp0.marker._path.setAttribute("fill", "#fff")
    });

    map.on("click", (e) => {
      console.log("Map clicked", e);
      setOpacityOfDOMMarkers(1);
    });

    return () => {
      map.off("pm:create");
    };
  }, [mapReady, activeData]);

  function displayMarkerCard(e) {
    setSelectedMarker(e);
    toggleMarkersCard("single");
  }

  function saveCollection(c) {
    setTool("Select");
    const newCollection = {
      id: cidRef.current,
      name: c.name,
      description: c.description,
      markers: markersInBounds,
      shape: currentShape.current,
      date: new Date().toLocaleDateString(),
    };

    const newSavedCollection = [...savedCollections, newCollection];
    console.log(newSavedCollection);
    setSavedCollections(newSavedCollection);
    isSavedInCollection.current = cidRef.current;
    cidRef.current = cidRef.current + 1;
  }

  function discardCollection() {
    setTool("Select");

    globalMIBRef.current = [];
    setOpacityOfDOMMarkers(1);
    toggleMarkersCard("");

    currentShape.current.layer.remove();
    currentShape.current = null;
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
        markers={markersInBounds}
        saveCollection={saveCollection}
        discardCollection={discardCollection}
        isSavedInCollection={isSavedInCollection.current}
        updateCollection={updateCollection}
        isVisible={markersCard == "multi"}
        viewMarker={viewMarker}
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
            filterLoading={(qc.isMutating() + qc.isFetching()) > 0}
          />

          <SectionsLayerCard
            areLayersOpen={userCardOpen == LAYERS_CARD}
            setImages={setSectionImages}
            toggleTitles={setTitlesVisibility}
          />

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
