import { Stack, IconButton } from "@chakra-ui/react";
import { LuSquareCheck, LuSquareMinus } from "react-icons/lu";

const QuickSelectionButtons = ({handleSelectAll, handleClearAll}) => {
  return (
    <Stack
      direction={{ lg: "row", md: "column" }}
      justifyContent="space-around"
    >
      <IconButton
        size="2xl"
        w="fit"
        h="fit"
        variant="plain"
        onClick={handleSelectAll}
        _hover={{ bg: "gray.300" }}
        p={2}
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
        onClick={handleClearAll}
        _hover={{ bg: "gray.300" }}
        p={2}
      >
        <LuSquareMinus size={"xl"} /> Clear
      </IconButton>
    </Stack>
  );
};

export default QuickSelectionButtons;