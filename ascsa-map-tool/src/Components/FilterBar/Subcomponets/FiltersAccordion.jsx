import {
  For,
  Heading,
  SimpleGrid,
  Accordion,
  Group,
  Button,
} from "@chakra-ui/react";
import QuickSelectionButtons from "../QuickSelectionButtons";
import MaterialButton from "./MaterialButton";
import { useState, useEffect, useRef } from "react";
import Section from "./SectionFilters";
import Monument from "./MonumentsFilters";

const initialMaterialList = [
  {
    title: "Ceramics",
    value: "Ceramics",
    color: "#C66F23",
    checked: false,
  },
  {
    title: "Metals",
    value: "Metals and Minerals",
    color: "#C6B623",
    checked: false,
  },
  {
    title: "Organics",
    value: "Organics",
    color: "#7DC623",
    checked: false,
  },
  {
    title: "Stones",
    value: "Stones",
    color: "#7F7F7F",
    checked: false,
  },
  {
    title: "Glass and Gems",
    value: "Glass and Gems",
    color: "#23C698",
    checked: false,
  },
  {
    title: "Miscellaneous",
    value: "Miscellaneous",
    color: "#000",
    checked: false,
  },
];

const ArtifactsFilters = ({ setArtifactsFilters }) => {
  const [materialsList, setMaterialsList] = useState(initialMaterialList);
  const [section, setSection] = useState("");
  const [monument, setMonument] = useState({ ShowMonuments: "Yes", Condition: [] });

  const [openItems, setOpenItems] = useState([
    "material-filter",
    "section-filter",
    "monument-filter",
  ]);

  const handleSelectAll = () => {
    setMaterialsList(
      materialsList.map((material) => ({
        ...material,
        checked: true,
      }))
    );

    controlAccordionState();
  };

  const handleClearAll = () => {
    setMaterialsList(
      materialsList.map((material) => ({
        ...material,
        checked: false,
      }))
    );

    controlAccordionState();
  };

  const selectMaterial = (value) => {
    setMaterialsList(
      materialsList.map((material) =>
        material.value == value
          ? { ...material, checked: !material.checked }
          : material
      )
    );
  };

  const controlAccordionState = () => {
    if (!openItems.includes("material-filter")) {
      setOpenItems((ot) => [...ot, "material-filter"]);
    }
  };

  useEffect(() => {
    setArtifactsFilters({
      materials: materialsList.filter((m) => m.checked).map((m) => m.value),
      section: section,
      monument: monument,
    });
  }, [materialsList, section, monument]);

  return (
    <Accordion.Root
      multiple
      collapsible
      w="100%"
      variant={"enclosed"}
      size="lg"
      borderColor={"gray.400"}
      rounded="lg"
      onValueChange={(e) => {
        setOpenItems(e.value);
      }}
      value={openItems}
    >
      <Accordion.Item value="material-filter" bg="gray.100">
        <Accordion.ItemTrigger justifyContent="space-between">
          <Heading fontWeight={"normal"} fontSize="md">
            MATERIALS
          </Heading>
          <Group display={{ md: "none", lg: "flex" }}>
            <QuickSelectionButtons
              handleSelectAll={handleSelectAll}
              handleClearAll={handleClearAll}
            />
            <Accordion.ItemIndicator color={"gray.400"} />
          </Group>
        </Accordion.ItemTrigger>

        <Accordion.ItemContent>
          <SimpleGrid mb="5" gap="2" columns={[2]} h="fit">
            <For each={materialsList}>
              {(m) => (
                <MaterialButton
                  materialObject={m}
                  onClick={() => selectMaterial(m.value)}
                />
              )}
            </For>
          </SimpleGrid>
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="section-filter" bg="gray.100">
        <Accordion.ItemTrigger justifyContent="space-between">
          <Heading fontWeight={"normal"} fontSize="md">
            SECTION
          </Heading>
          <Accordion.ItemIndicator color={"gray.400"} />
        </Accordion.ItemTrigger>

        <Accordion.ItemContent>
          <Section setSectionObj={setSection} />
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="monument-filter" bg="gray.100">
        <Accordion.ItemTrigger justifyContent="space-between">
          <Heading fontWeight={"normal"} fontSize="md">
            MONUMENTS
          </Heading>
          <Accordion.ItemIndicator color={"gray.400"} />
        </Accordion.ItemTrigger>

        <Accordion.ItemContent>
          <Monument setMonumentObj={setMonument} />
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  );
};

export default ArtifactsFilters;
