import {
  Box,
  Container,
  For,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import QuickSelectionButtons from "../QuickSelectionButtons";
import MaterialButton from "./MaterialButton";
import { useState } from "react";

const initialMaterialList = [
  {
    title: "Ceramics",
    value: "CE",
    color: "#C66F23",
    checked: false,
  },
  {
    title: "Metals",
    value: "ME",
    color: "#C6B623",
    checked: false,
  },
  {
    title: "Organics",
    value: "OR",
    color: "#7DC623",
    checked: false,
  },
  {
    title: "Stones",
    value: "ST",
    color: "#7F7F7F",
    checked: false,
  },
  {
    title: "Glass and Gems",
    value: "GG",
    color: "#23C698",
    checked: false,
  },
  {
    title: "Miscellaneous",
    value: "MI",
    color: "#000",
    checked: false,
  },
];


const MaterialSection = () => {
  const [materialsList, setMaterialsList] = useState(initialMaterialList);

  const handleSelectAll = () => {
    setMaterialsList(
      materialsList.map((material) => ({
        ...material,
        checked: true,
      }))
    );
  };

  const handleClearAll = () => {
    setMaterialsList(
      materialsList.map((material) => ({
        ...material,
        checked: false,
      }))
    );
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

  return (
    <Box w="100%">
      <HStack justifyContent="space-between">
        <Heading fontWeight={"normal"}>{"Materials".toUpperCase()}</Heading>
        <QuickSelectionButtons handleSelectAll={handleSelectAll} handleClearAll={handleClearAll} />
      </HStack>

      <SimpleGrid mt="1" gap="2" columns={[2]} h="fit">
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
    </Box>
  );
};

export default MaterialSection;
