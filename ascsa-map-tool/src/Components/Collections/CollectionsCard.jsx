import { Tabs, Text, Separator, Button, Card } from "@chakra-ui/react";
import { useRef, useState } from "react";

const CollectionsCard = ({ areCollectionsOpen = false, setFilters }) => {
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
        opacity: areCollectionsOpen ? 1 : 0,
        pointerEvents: areCollectionsOpen ? "auto" : "none",
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
          Collections
        </Text>
      </Card.Header>

      <Card.Body h="inherit" overflow="auto">
        Empty
      </Card.Body>
    </Card.Root>
  );
};

export default CollectionsCard;
