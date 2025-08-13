import { Box, Tabs, Text, VStack, Separator, Button } from "@chakra-ui/react";
import { useState } from "react";
import PeriodBar from "../PeriodBar/Bar";
import Filters from "./Filters";

const FilterCard = ({ areFiltersOpen = false, setPeriodFilters, setFilters }) => {
  const [value, setValue] = useState("artifacts");

  return (
    <VStack
      style={{
        opacity: areFiltersOpen ? 1 : 0,
        pointerEvents: areFiltersOpen ? "auto" : "none",
        transition: "opacity 0.4s cubic-bezier(.4,0,.2,1)",
      }}
      w={{ sm: "30vw", md: "25vw", lg: "22.5vw" }}
      bg="white"
      p="30px 22px"
      rounded="10px"
      border="1px solid #C6C6C6"
      top="calc(5vh + 5px)"
      bottom="calc(12px + 12px)"
      position="absolute"
    >
      <Box
        display="flex"
        justifyContent="start"
        flexDir="column"
        // gapY="5px"
        w="100%"
        overflowY="scroll"
        overflowX="hidden"
        h="100vh"
      >
        <Text fontSize="3xl" fontWeight="bold">
          Filters
        </Text>

        <Tabs.Root
          h="inherit"
          justifyContent="space-between"
          defaultValue="artifacts"
          fitted
          variant="plain"
          value={value}
          onValueChange={(e) => setValue(e.value)}
        >
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

          <Separator size="sm" mt={4} borderColor={"gray.300"} />

            <Tabs.Content value="artifacts" pos={"relative"}>
              <Filters applyFilters={setFilters}/>
            </Tabs.Content>

          <Tabs.Content justifyContent="space-between" value="periods">
            <PeriodBar setPeriodFilters={setPeriodFilters} />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </VStack>
  );
};

export default FilterCard;
