import {
  Text,
  Card,
  Accordion,
  Heading,
  Box,
  Button,
  VStack,
  HStack,
  For,
  Icon,
  IconButton,
  Group,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  LuEye,
  LuEyeClosed,
  LuTrash2,
} from "react-icons/lu";

import { Tooltip } from "../ui/tooltip";
import { BiShapeCircle, BiShapeSquare, BiShapePolygon } from "react-icons/bi";

const CollectionsCard = ({
  areCollectionsOpen = false,
  savedCollections = [{ name: "a" }, { name: "b" }],
  savedMarkers = [],
  viewCollection,
  deleteCollection,
  hideCollection,
}) => {
  const [openItems, setOpenItems] = useState([]);

  const Collection = ({ c }) => {
    const iconSize = 20;
    function findShapeType(shapeType) {
      switch (shapeType) {
        case "Rectangle":
          return <BiShapeSquare size={iconSize} />;
        case "Circle":
          return <BiShapeCircle size={iconSize} />;
        case "Polygon":
          return <BiShapePolygon size={iconSize} />;
        default:
          return <></>;
      }
    }

    return (
      <Flex
        as="li"
        _last={{ mb: "12vh" }}
        w="100%"
        padding={2}
        paddingInline={3}
        bg="gray.200"
        transition={"all 0.2s"}
        border="1px solid"
        borderColor="gray.300"
        rounded="sm"
        h="fit"
        mb={2}
        mt={1}
        alignContent={"start"}
        justifyContent={"start"}
      >
        <VStack w="100%" mb={2} alignItems={"start"}>
          <HStack w="100%" justifyContent={"space-between"}>
            <Text fontSize={"sm"} color="gray.500">
              {c.date}
            </Text>

            <Text fontSize={"sm"} color="gray.500">
              {c.markers.length} items
            </Text>
          </HStack>

          <HStack alignItems="center" justifyContent={"space-between"} w="100%">
            <Heading fontSize={"lg"}>{c.name}</Heading>
            <Tooltip
              content={c.shape.shape}
              contentProps={{ fontSize: "lg", p: 2 }}
              openDelay={200}
              closeDelay={200}
            >
              <Icon>{findShapeType(c.shape.shape)}</Icon>
            </Tooltip>
          </HStack>
          <Text
            maxH="7rem"
            maxLines={2}
            overflow={"auto"}
            pr={2}
            _scrollbar={{ display: "thin", color: "black" }}
          >
            {c.description || "No description provided."}
          </Text>
          <Group w="100%">
            {viewedCollection === c.name ? (
              <Button
                flexGrow={1}
                w="fit"
                onClick={() => {
                  setViewedCollection(null);
                  hideCollection(c);
                }}
              >
                Hide <LuEyeClosed />
              </Button>
            ) : (
              <Button
                flexGrow={1}
                w="fit"
                onClick={() => {
                  setViewedCollection(c.name);
                  viewCollection(c);
                }}
              >
                View <LuEye />
              </Button>
            )}

            <Button
              flexGrow={1}
              bg="red.500"
              onClick={() => {
                deleteCollection(c);
              }}
            >
              Delete
              <LuTrash2 />
            </Button>
          </Group>
        </VStack>
      </Flex>
    );
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
        <Accordion.Root
          multiple
          collapsible
          w="100%"
          variant={"enclosed"}
          size="lg"
          borderColor={"gray.400"}
          rounded="lg"
          onValueChange={(e) => {
            setOpenItems(e.value);
          }}
          value={openItems}
        >


          <Accordion.Item value="collections" h="100%" bg="white">
            <Accordion.ItemTrigger justifyContent="space-between">
              <Heading fontWeight={"normal"} fontSize="md">
                SAVED COLLECTIONS
              </Heading>
              <Accordion.ItemIndicator color={"gray.400"} />
            </Accordion.ItemTrigger>

            <Accordion.ItemContent
              flexGrow={1}
              bottom={0}
              maxH={"100%"}
              overflow={"auto"}
              scrollbarColor="black transparent"
              scrollbarWidth="thin"
            >
              <For each={savedCollections}>{(c) => <Collection c={c} />}</For>
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </Card.Body>
    </Card.Root>
  );
};

export default CollectionsCard;
