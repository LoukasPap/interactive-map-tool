import {
  Box,
  Tabs,
  Text,
  VStack,
  Separator,
  Button,
  Card,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import PeriodBar from "../PeriodBar/Bar";
import ArtifactsFilters from "./Subcomponets/FiltersAccordion";

const FilterCard = ({
  areFiltersOpen = false,
  setFilters,
}) => {
  const [value, setValue] = useState("artifacts");

  const filtersState = useRef({});


  function updateFilterState(props) {
    filtersState.current = { ...filtersState.current, ...props };
  }

  const applyFilters = () => {
    console.log("changed,", filtersState.current);

    setFilters(filtersState.current);
  };

  return (
    <Card.Root
      style={{
        opacity: areFiltersOpen ? 1 : 0,
        pointerEvents: areFiltersOpen ? "auto" : "none",
        transition: "opacity 0.4s cubic-bezier(.4,0,.2,1)",
      }}
      w={{ sm: "30vw", md: "25vw", lg: "22.5vw" }}
      bg="white"
      // p="30px 22px"
      rounded="xl"
      border="1px solid #C6C6C6"
      top="calc(3.5vh + 5px)"
      bottom="calc(12px + 12px)"
      position="absolute"
    >
      {/* <Box
        display="flex"
        justifyContent="start"
        flexDir="column"
        // gapY="5px"
        w="100%"
        overflowY="scroll"
        overflowX="hidden"
        h="100vh"
      > */}
      <Card.Header>
        <Text fontSize="3xl" fontWeight="bold">
          Filters
        </Text>
      </Card.Header>

      <Card.Body overflow="scroll">
        <Tabs.Root
          h="inherit"
          justifyContent="space-between"
          defaultValue="artifacts"
          fitted
          variant="plain"
          value={value}
          onValueChange={(e) => setValue(e.value)}
        >
          <Tabs.List bg="white" position="sticky" gap={2}>
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
          
          <Tabs.Content value="artifacts">
            <ArtifactsFilters setArtifactsFilters={updateFilterState} />
          </Tabs.Content>

          <Tabs.Content value="periods">
            <PeriodBar setPeriodFilters={updateFilterState} />
          </Tabs.Content>
        </Tabs.Root>
      </Card.Body>

      <Card.Footer justifyContent="flex-end">
        <Button
          size="md"
          w="100%"
          fontSize="lg"
          mt={2}
          onClick={applyFilters}
        >
          Apply
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default FilterCard;
