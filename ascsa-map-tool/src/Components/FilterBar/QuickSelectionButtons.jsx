import { Stack, IconButton } from "@chakra-ui/react";
import { LuSquareCheck, LuSquareMinus } from "react-icons/lu";

const QuickSelectionButtons = ({ handleSelectAll, handleClearAll }) => {
  return (
    <Stack
      direction={{ lg: "row", md: "column" }}
      justifyContent="space-around"
      gap={0}
    >
      <IconButton
        size="2xl"
        w="fit"
        h="fit"
        variant="plain"
        // Disable event bubbling to not trigger accordion expansion/contraction
        onClick={(e) => {
          e.stopPropagation();
          handleSelectAll();
        }}
        _hover={{ bg: "gray.300" }}
        p={2}
        fontSize="md"
        gap={1}

      >
        <LuSquareCheck />
        Select all
      </IconButton>

      <IconButton
        flexGrow={1}
        size="2xl"
        w="fit"
        h="fit"
        variant="plain"
        onClick={(e) => {
          e.stopPropagation();
          handleClearAll();
        }}
        _hover={{ bg: "gray.300" }}
        p={2}
        fontSize="md"
        gap={1}
      >
        <LuSquareMinus size={"xl"} /> Clear
      </IconButton>
    </Stack>
  );
};

export default QuickSelectionButtons;
