import {
  LuChevronDown,
  LuScissors,
  LuTrash2,
  LuSquarePen,
  LuCheck,
} from "react-icons/lu";

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
        rounded="0"
        bg={nonDrawActions.includes(activeTool) ? "gray.950" : "white"}
        color={nonDrawActions.includes(activeTool) ? "white" : "gray.900"}
        _hover={
          nonDrawActions.includes(activeTool)
            ? { bg: "#161616" }
            : { bg: "gray.200" }
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
        border={0}
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
          rounded="sm"
          border="1px solid #d4d4d8"
          overflow={"clip"}
          backgroundClip={{ base: "padding-box", _hover: "padding-box" }}
          attached
        >
          <SelectTrigger />

          <Select.Trigger
            color={nonDrawActions.includes(activeTool) ? "white" : "gray.950"}
            variant="plain"
            bg={nonDrawActions.includes(activeTool) ? "gray.950" : "white"}
            _hover={{
              bg: nonDrawActions.includes(activeTool) ? "gray.900" : "gray.200",
            }}
            border={0}
            borderStart={"1px solid"}
            borderStartColor="gray.300"
            rounded={0}
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
