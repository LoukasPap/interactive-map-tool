import {
  For,
  Heading,
  SimpleGrid,
  Accordion,
  Group,
  Icon,
} from "@chakra-ui/react";
import QuickSelectionButtons, {
  QuickClearButton,
} from "../QuickSelectionButtons";
import MaterialButton from "./MaterialButton";
import { useState, useEffect, useRef } from "react";
import Section from "./SectionFilters";
import Monument from "./MonumentsFilters";
import { Tooltip } from "../../ui/tooltip";
import { LuInfo } from "react-icons/lu";

const initialInventoryList = [
  { title: "A",  value: "A",  fullTitle: "Architecture", color: "#000", checked: false },
  { title: "B",  value: "B",  fullTitle: "Bronze", color: "#000", checked: false },
  { title: "BI", value: "BI", fullTitle: " Bone & Ivory", color: "#000", checked: false },
  { title: "G",  value: "G",  fullTitle: "Glass", color: "#000", checked: false },
  { title: "I",  value: "I",  fullTitle: "Inscriptions", color: "#000", checked: false },
  { title: "IL", value: "IL", fullTitle: " Iron & Lead", color: "#000", checked: false },
  { title: "J",  value: "J",  fullTitle: "Jewelry & Gems", color: "#000", checked: false },
  { title: "L",  value: "L",  fullTitle: "Lamps", color: "#000", checked: false },
  { title: "MC", value: "MC", fullTitle: " Miscellaneous Clay", color: "#000", checked: false },
  { title: "N",  value: "N",  fullTitle: "Coin", color: "#000", checked: false },
  { title: "P",  value: "P",  fullTitle: "Pottery", color: "#000", checked: false },
  { title: "S",  value: "S",  fullTitle: "Sculpture", color: "#000", checked: false },
  { title: "SS", value: "SS", fullTitle: " Stamps & Seals", color: "#000", checked: false },
  { title: "ST", value: "ST", fullTitle: " Stone", color: "#000", checked: false },
  { title: "T",  value: "T",  fullTitle: "Terracotta", color: "#000", checked: false },
  { title: "W",  value: "W",  fullTitle: "Wood", color: "#000", checked: false },
];

const initialSectionState = {
  SectionNumberLetter: "",
  SectionNumberNumber: "",
  SectionNumber: "",
};

const ArtifactsFilters = ({ setArtifactsFilters }) => {
  const [inventoryLetterList, setInventoryLetterList] = useState(initialInventoryList);
  const [section, setSection] = useState(initialSectionState);
  const [monument, setMonument] = useState({
    ShowMonuments: "Yes",
    Condition: [],
  });

  const [openItems, setOpenItems] = useState([
    "material-filter",
    "section-filter",
    "monument-filter",
  ]);

  const handleSelectAll = () => {
    setInventoryLetterList(
      inventoryLetterList.map((material) => ({
        ...material,
        checked: true,
      }))
    );

    controlAccordionState("material-filter");
  };

  const handleClearAll = () => {
    setInventoryLetterList(
      inventoryLetterList.map((material) => ({
        ...material,
        checked: false,
      }))
    );

    controlAccordionState("material-filter");
  };

  const selectMaterial = (value) => {
    setInventoryLetterList(
      inventoryLetterList.map((material) =>
        material.value == value
          ? { ...material, checked: !material.checked }
          : material
      )
    );
  };

  const clearSectionInput = () => {
    setSection(initialSectionState);
    controlAccordionState("section-filter");
  };

  const controlAccordionState = (accordionItem) => {
    if (!openItems.includes(accordionItem)) {
      setOpenItems((ot) => [...ot, accordionItem]);
    }
  };

  useEffect(() => {
    setArtifactsFilters({
      inventory: inventoryLetterList.filter((m) => m.checked).map((m) => m.value),
      section: section,
      monument: monument,
    });
  }, [inventoryLetterList, section, monument]);

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
            INVENTORY LETTERS
          </Heading>
          <Group>
            <QuickSelectionButtons
              handleSelectAll={handleSelectAll}
              handleClearAll={handleClearAll}
            />
            <Accordion.ItemIndicator color={"gray.400"} />
          </Group>
        </Accordion.ItemTrigger>

        <Accordion.ItemContent>
          <SimpleGrid mb="5" gap="2" columns={{ smToXl: 2, md:2, "2xl": 4 }} h="fit">
            <For each={inventoryLetterList}>
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
          <Group>
            <QuickClearButton onClick={clearSectionInput} />
            <Accordion.ItemIndicator color={"gray.400"} />
          </Group>
        </Accordion.ItemTrigger>

        <Accordion.ItemContent>
          <Section sectionObj={section} setSectionObj={setSection} />
        </Accordion.ItemContent>
      </Accordion.Item>

      <Accordion.Item value="monument-filter" bg="gray.100">
        <Accordion.ItemTrigger justifyContent="space-between">
          <Group>
            <Heading fontWeight={"normal"} fontSize="md">
              MONUMENTS
            </Heading>
            <Tooltip
              content="Monuments are not affected by Period filters"
              contentProps={{ fontSize: "md", p: "2" }}
              positioning={{ placement: "right-center" }}
              openDelay={200}
              closeDelay={200}
            >
              <Icon size="md">
                <LuInfo />
              </Icon>
            </Tooltip>
          </Group>
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
