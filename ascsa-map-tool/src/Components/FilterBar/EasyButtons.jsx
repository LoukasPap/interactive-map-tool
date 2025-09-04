import { Checkbox, HStack, Box, Icon, Center } from "@chakra-ui/react";
import { useState } from "react";
import { LuFilter, LuLibraryBig, LuMenu } from "react-icons/lu";

const EasyButtons = ({ toggleDrawer, toggleFilters, toggleExtra }) => {
  const [checkedExtra, setCheckedExtra] = useState(true);
  const [checkedFilter, setCheckedFilter] = useState(true);
  const customStyle = { height: "1.5em" };

  return (
    <HStack w="100%" h="3.5vh" gap="5px" pointerEvents="auto" display="flex">
      <Center w="40px" h="100%" rounded="7.5px" bg="white" border="1px solid #C6C6C6">
        <Icon
          justifySelf="center"
          variant="plain"
          _hover={{ bg: "gray.300" }}
          onClick={() => toggleDrawer(true)}
        >
          <LuMenu size="20" cursor="pointer" />
        </Icon>
      </Center>

      {/* Filter button */}
      <Box
        flexGrow={1}
        bg="white"
        h="100%"
        p={2}
        rounded="7.5px"
        border="1px solid"
        borderColor="gray.300"
        asChild
      >
        <Checkbox.Root
          // visibility={"hidden"}
          cursor="pointer"
          w="fit"
          minW="6.5em"
          checked={checkedFilter}
          onCheckedChange={(e) => {
            setCheckedFilter(!!e.checked);
            toggleFilters(checkedFilter);
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control
            bg="white"
            border="none"
            w="fit"
            h="fit"
            p={0}
            cursor="pointer"
          >
            {console.log("filter", checkedFilter)}
            {checkedFilter ? (
              <LuFilter strokeWidth="1.5px" color="black" style={customStyle} />
            ) : (
              <LuFilter
                strokeWidth="1.5px"
                stroke="black"
                fill="black"
                style={customStyle}
              />
            )}
          </Checkbox.Control>
          <Checkbox.Label w="full" textAlign="center" fontSize="lg" px="1">
            Filters
          </Checkbox.Label>
        </Checkbox.Root>
      </Box>

      {/* Extra btn that may need */}
      <Box
        flexGrow={1}
        bg="white"
        p={2}
        h="100%"
        rounded="md"
        border="1px solid"
        borderColor="gray.300"
        asChild
      >
        <Checkbox.Root
          w="fit"
          minW="6.5em"
          checked={checkedExtra}
          onCheckedChange={(e) => {
            setCheckedExtra(!!e.checked);
            toggleExtra(checkedExtra);
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control
            cursor="pointer"
            bg="white"
            border="none"
            w="fit"
            h="fit"
            p={0}
          >
            {checkedExtra ? (
              <LuLibraryBig
                color="black"
                strokeWidth="1.5px"
                style={customStyle}
              />
            ) : (
              <LuLibraryBig
                color="white"
                strokeWidth="1.5px"
                stroke="black"
                fill="black"
                style={customStyle}
              />
            )}
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
