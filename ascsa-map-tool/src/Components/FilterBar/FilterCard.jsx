import { Text, Button, Card, Spinner } from "@chakra-ui/react";
import { useRef, useState } from "react";
import ArtifactsFilters from "./Subcomponets/ArtifactsFilters";

const FilterCard = ({ areFiltersOpen = false, setFilters }) => {
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
      <Card.Header>
        <Text fontSize="3xl" fontWeight="bold">
          Filters
        </Text>
      </Card.Header>

      <Card.Body overflow="auto">
        <ArtifactsFilters setArtifactsFilters={updateFilterState} />
      </Card.Body>

      <Card.Footer justifyContent="flex-end">
        <Button size="md" w="100%" fontSize="lg" mt={2} onClick={applyFilters}>
          Apply
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default FilterCard;
