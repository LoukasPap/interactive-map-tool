import {
  For,
  Heading,
  SimpleGrid,
  Accordion,
  Group,
} from "@chakra-ui/react";
import QuickSelectionButtons from "../QuickSelectionButtons";
import MaterialButton from "./MaterialButton";
import Section from "./SectionFilters";

const initialMaterialList = [
  {
    title: "Ceramics",
    value: "Ceramics",
    color: "#C66F23",
    checked: false,
  },
  {
    title: "Metals",
    value: "Metals",
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

const MaterialSection = () => {
  const [materialsList, setMaterialsList] = useState(initialMaterialList);
  const [section, setSection] = useState("");

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

  const handleToggleMaterial = (value) => {
    setMaterialsList(
      materialsList.map((material) =>
        material.value === value
          ? { ...material, checked: !material.checked }
          : material
      )
    );
  };


  const controlAccordionState = () => {
      if (!value.includes("material-filter")) {
        setValue(["material-filter"]);
    }
  }


  return (
    <Accordion.Root
      multiple
      collapsible
      w="100%"
      variant={"enclosed"}
      size="lg"
      borderColor={"gray.400"}
      rounded="xl"
      onValueChange={(e) => {
        setValue(e.value);
        console.log("value is", e.value);
      }}
      value={value}
    >
      <Accordion.Item value="material-filter">
        <Accordion.ItemTrigger justifyContent="space-between">
          <Heading fontWeight={"normal"}>{"Materials".toUpperCase()}</Heading>
          <Group>
            <QuickSelectionButtons
              handleSelectAll={handleSelectAll}
              handleClearAll={handleClearAll}
            />
            <Accordion.ItemIndicator color={"gray.400"} />
          </Group>
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <SimpleGrid mt="1" gap="2" columns={[2]} h="fit" mb="5">
            <For each={materialsList}>
              {(m) => (
                <MaterialButton
                  key={m.value}
                  material={m.title}
                  color={m.color}
                  checked={m.checked}
                  onClick={() => handleToggleMaterial(m.value)}
                />
              )}
            </For>
          </SimpleGrid>
        </Accordion.ItemContent>

      </Accordion.Item>

      <Accordion.Item value="section-filter" bg="gray.100">
        
        <Accordion.ItemTrigger justifyContent="space-between">
          <Heading fontWeight={"normal"} fontSize="md">
            {"SECTION"}
          </Heading>
          <Accordion.ItemIndicator color={"gray.400"} />
        </Accordion.ItemTrigger>
        
        <Accordion.ItemContent>
          <Section setSection={setSection}/>
        </Accordion.ItemContent>

      </Accordion.Item>
    </Accordion.Root>
  );
};

export default MaterialSection;
