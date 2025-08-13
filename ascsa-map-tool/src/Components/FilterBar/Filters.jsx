import { useEffect, useState } from "react";
import MaterialSection from "./MaterialFilters/MaterialSection";
import { Button, VStack } from "@chakra-ui/react";

const Filters = ({ applyFilters }) => {
  const [allFilters, setAllFilters] = useState({});

  const handleApplyFilter = () => {
    applyFilters(allFilters);
  };

  return (
    <VStack justifyContent="space-between">
      <VStack w="100%" flexGrow={1} overflow={"scroll"}>
        <MaterialSection setFilters={setAllFilters} />
      </VStack>
      <Button size="md" w="100%" fontSize="lg" onClick={handleApplyFilter}>
        Apply
      </Button>
    </VStack>
  );
};

export default Filters;
