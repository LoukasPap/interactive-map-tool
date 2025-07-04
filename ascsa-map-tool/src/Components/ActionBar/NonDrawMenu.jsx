import {
  LuChevronDown,
  LuScissors,
  LuTrash2,
  LuSquarePen,
  LuCheck,
} from "react-icons/lu";
 "react-icons/ri";

import {
  IconButton,
  Select,
  Menu,
  Box,
  HStack,
  Portal,
  ButtonGroup,
  createListCollection,
  useSelectContext,
  Text,
  For,
  VisuallyHidden,
} from "@chakra-ui/react";

import { useEffect, useRef, useState } from "react";

import { handleEvent } from "../Handlers";

const NonDrawMenu = ({ activeTool, setActiveTool, mapRef }) => {
  const customStyle = { width: "2.25em", height: "2.25em" };
  const popoverCustomStyle = { width: "1.3em", height: "2.25em" };

  const nonDrawActions = ["edit", "remove"];

  const ndActions = createListCollection({
    items: [
      {
        label: "Edit",
        value: "edit",
        icon: <LuSquarePen style={customStyle} strokeWidth={"1.25px"} />,
      },
      {
        label: "Remove",
        value: "remove",
        icon: <LuTrash2 style={customStyle} strokeWidth={"1.25px"} />,
      },
    ],
  });

  const [selected, setSelected] = useState([ndActions.items[0]]);

  const SelectTrigger = () => {
    const select = useSelectContext();
    const items = select.selectedItems;
    return (
      <IconButton
        variant="solid"
        rounded="md"
        bg={nonDrawActions.includes(activeTool) ? "gray.950" : "white"}
        color={nonDrawActions.includes(activeTool) ? "white" : "gray.900"}
        border="2px solid #d4d4d8"
        _hover={
          nonDrawActions.includes(activeTool)
            ? { bg: "#161616" }
            : { bg: "gray.300" }
        }
        id="edit-action"
        h="max-content"
        p="2.5"
        w="fit"
        onClick={() => {
          const val = selected[0].value;

          console.log("updated action:", val);
          if (nonDrawActions.includes(val)) {
            handleEvent(mapRef, val);
            setActiveTool(val);
          }
        }}
        borderTopEndRadius="0"
        borderBottomEndRadius="0"
        borderRight="none"
      >
        {selected[0].icon}
      </IconButton>
    );
  };

  return (
    <Select.Root
      positioning={{ placement: "top-end" }}
      collection={ndActions}
      value={selected}
      onValueChange={(e) => {
        setSelected(e.items);
        setActiveTool(e.items[0].value);
        handleEvent(mapRef, e.items[0].value);
      }}
    >
      <Select.Control>
        <ButtonGroup
          overflow="hidden"
          rounded="md"
          bg={nonDrawActions.includes(activeTool) ? "gray.950" : "white"}
          attached
        >
          <SelectTrigger />
          <Select.Trigger
            color={nonDrawActions.includes(activeTool) ? "white" : "gray.950"}
            variant="plain"
            _hover={{
              bg: nonDrawActions.includes(activeTool) ? "gray.900" : "gray.300",
            }}
            border="2px solid #d4d4d8"
            rounded="md"
            borderTopStartRadius="0"
            borderBottomStartRadius="0"
            w="2.25em"
            p="2.5"
            display={"flex"}
            justifyContent={"center"}
          >
            <IconButton unstyled>
              <LuChevronDown style={popoverCustomStyle} strokeWidth={"1.5px"} />
            </IconButton>
          </Select.Trigger>
        </ButtonGroup>
      </Select.Control>

      <Portal>
        <Select.Positioner>
          <Select.Content w="fit">
            {ndActions.items.map((action) => (
              <Select.Item item={action} key={action.value}>
                <HStack>
                  {action.icon}
                  <Text textStyle={"lg"}>{action.label}</Text>
                </HStack>
                {action.value == activeTool ? (
                  <LuCheck />
                ) : (
                  <LuCheck style={{ visibility: "hidden" }} />
                )}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};

export default NonDrawMenu;
