import {
  Box,
  Tabs,
  Text,
  VStack,
  Separator,
} from "@chakra-ui/react";
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu";
import { useState } from "react";
import PeriodBar from "../PeriodBar/Bar";

const FilterCard = ({ areFiltersOpen = false, setPeriodFilters }) => {
  const [value, setValue] = useState("artifacts");

  return (
    <VStack
       style={{
        opacity: areFiltersOpen ? 1 : 0,
        pointerEvents: areFiltersOpen ? "auto" : "none",
        transition: "opacity 0.4s cubic-bezier(.4,0,.2,1)",
      }}
      w={{ sm: "30vw", md: "25vw", lg: "20vw" }}
      h="90vh"
      pos="fixed"
      bg="white"
      p="30px 22px"
      rounded="10px"
      border="1px solid #C6C6C6"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        flexDir="column"
        gapY="10px"
        w="100%"
        overflowY="scroll"
        overflowX="hidden"
      >
        <Tabs.Root
          justifyContent="space-between"
          defaultValue="artifacts"
          fitted
          variant="plain"
          value={value}
          onValueChange={(e) => setValue(e.value)}
        >

          <Text fontSize="3xl" fontWeight="bold" position="sticky">
            Filters
          </Text>

          <Tabs.List bg="white" position="sticky" gap={2} mt={2}>
            <Tabs.Trigger
              value="artifacts"
              bg={value == "artifacts" ? "#C6C6C6" : "white"}
              border="1px solid #c6c6c6"
            >
              Artifacts
            </Tabs.Trigger>
            <Tabs.Trigger
              value="periods"
              bg={value == "periods" ? "#C6C6C6" : "white"}
              border="1px solid #c6c6c6"
            >
              Periods
            </Tabs.Trigger>
            <Tabs.Indicator rounded="l2" />
          </Tabs.List>

          <Separator
            orientation="horizontal"
            mt="15px"
            size="sm"
            colorPalette="green"
          />

          <Tabs.Content value="artifacts">Artifacts Filter</Tabs.Content>
          <Tabs.Content
            justifyContent="space-between"
            value="periods"
            h="100%"
          >
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </VStack>
  );
};

export default FilterCard;
