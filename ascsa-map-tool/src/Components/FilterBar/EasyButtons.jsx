import { Checkbox, HStack, Box, Icon, Center } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { LuFilter, LuLibraryBig, LuMenu } from "react-icons/lu";

const FILTERS_CARD = "filters";
const COLLECTIONS_CARD = "collections";
const NONE = "";

const EasyButtons = ({ toggleDrawer, openUserCard }) => {
  const [filterClosed, setFilterClosed] = useState(true);
  const [collectionsClosed, setCollectionsClosed] = useState(true);
  const curOpenCardRef = useRef(NONE);

  const customStyle = { height: "1.5em" };

  return (
    <HStack w="100%" h="3.5vh" gap="5px" pointerEvents="auto" display="flex">
      <Center
        w="40px"
        h="100%"
        rounded="7.5px"
        bg="white"
        border="1px solid #C6C6C6"
      >
        <Icon
          justifySelf="center"
          variant="plain"
          _hover={{ bg: "gray.300" }}
          onClick={() => toggleDrawer(true)}
        >
          <LuMenu size="20" cursor="pointer" />
        </Icon>
      </Center>

      {/* Filters button */}
      <Box
        flexGrow={1}
        bg={filterClosed ? "white" : "gray.900"}
        color={filterClosed ? "black" : "white"}
        h="100%"
        p={2}
        rounded="7.5px"
        border="1px solid"
        borderColor="gray.300"
        asChild
      >
        <Checkbox.Root
          id="fil"
          cursor="pointer"
          w="fit"
          minW="6.5em"
          checked={filterClosed}
          onCheckedChange={(e) => {
            setFilterClosed(!!e.checked);
            setCollectionsClosed(true);

            const checkedCard = !!e.checked ? NONE : FILTERS_CARD;
            curOpenCardRef.current = checkedCard;
            openUserCard(checkedCard);
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control
            bg={filterClosed ? "white" : "gray.900"}
            border="none"
            w="fit"
            h="fit"
            p={0}
            cursor="pointer"
          >
            <LuFilter
              color={filterClosed ? "black" : "white"}
              strokeWidth="1.5px"
              style={customStyle}
            />
          </Checkbox.Control>
          <Checkbox.Label w="full" textAlign="center" fontSize="lg" px="1">
            Filters
          </Checkbox.Label>
        </Checkbox.Root>
      </Box>

      {/* Collections button */}
      <Box
        flexGrow={1}
        bg={collectionsClosed ? "white" : "gray.900"}
        color={collectionsClosed ? "black" : "white"}
        p={2}
        h="100%"
        rounded="md"
        border="1px solid"
        borderColor="gray.300"
        asChild
      >
        <Checkbox.Root
          id="col"
          w="fit"
          minW="6.5em"
          checked={collectionsClosed}
          onCheckedChange={(e) => {
            setCollectionsClosed(!!e.checked);
            setFilterClosed(true);

            const checkedCard = !!e.checked ? NONE : COLLECTIONS_CARD;
            curOpenCardRef.current = checkedCard;
            openUserCard(checkedCard);
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control
            cursor="pointer"
            border="none"
            bg={collectionsClosed ? "white" : "gray.900"}
            w="fit"
            h="fit"
            p={0}
          >
            <LuLibraryBig
              color={collectionsClosed ? "black" : "white"}
              strokeWidth="1.5px"
              style={customStyle}
            />
          </Checkbox.Control>
          <Checkbox.Label
            cursor="pointer"
            w="full"
            textAlign="center"
            fontSize={"lg"}
            pe="1"
          >
            Collections
          </Checkbox.Label>
        </Checkbox.Root>
      </Box>
    </HStack>
  );
};

export default EasyButtons;
