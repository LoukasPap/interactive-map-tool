import { Checkbox, HStack, Box } from "@chakra-ui/react";
import { useState } from "react";
import { LuEye, LuEyeClosed, LuFilter } from "react-icons/lu";

const Filters = ({ toggleFilters, toggleExtra }) => {
  const [checkedExtra, setCheckedExtra] = useState(true);
  const [checkedFilter, setCheckedFilter] = useState(true);
  const customStyle = { height: "1.5em" };

  return (
    <HStack gap="5px">
      {/* Filter button */}
      <Box
        bg="white"
        p={2}
        rounded="7.5px"
        border="1px solid"
        borderColor="gray.300"
      >
        <Checkbox.Root
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
        bg="white"
        p={2}
        rounded="md"
        border="1px solid"
        borderColor="gray.300"
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
              <LuEyeClosed
                color="black"
                strokeWidth="1.5px"
                style={customStyle}
              />
            ) : (
              <LuEye color="black" strokeWidth="1.5px" style={customStyle} />
            )}
          </Checkbox.Control>
          <Checkbox.Label
            cursor="pointer"
            w="full"
            textAlign="center"
            fontSize={"lg"}
            pe="1"
          >
            Extra
          </Checkbox.Label>
        </Checkbox.Root>
      </Box>
    </HStack>
  );
};

export default Filters;
