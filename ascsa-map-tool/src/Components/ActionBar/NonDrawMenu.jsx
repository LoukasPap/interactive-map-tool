import {
  LuChevronDown,
  LuScissors,
  LuTrash2,
  LuSquarePen,
} from "react-icons/lu";
import { IconButton, Menu, Box, Portal, ButtonGroup } from "@chakra-ui/react";

import Button from "./Button";

import { handleEdit } from "../Handlers";

const NonDrawMenu = ({ activeTool, setActiveTool, mapRef }) => {
  const customStyle = { width: "2.25em", height: "2.25em" };

  return (
    <ButtonGroup
      w="fit-content"
      h="100%"
      overflow="hidden"
      rounded="md"
      bg={activeTool == "edit" ? "gray.950" : "white"}
      attached
    >
      <IconButton
        variant="solid"
        rounded="md"
        bg={activeTool === "edit" ? "gray.950" : "white"}
        color={activeTool === "edit" ? "white" : "gray.900"}
        border="2px solid #d4d4d8"
        _hover={activeTool === "edit" ? { bg: "#161616" } : { bg: "gray.300" }}
        id="edit-action"
        p="2.5"
        w="fit"
        h="fit"
        onClick={() => {
          if (activeTool != "edit") {
            handleEdit(mapRef);
            setActiveTool("edit");
          }
        }}
        borderTopEndRadius="0"
        borderRight="none"
        borderBottomEndRadius="0"
      >
        <LuSquarePen style={customStyle} strokeWidth={"1.25px"} />
      </IconButton>

      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton
            color={activeTool == "edit" ? "white" : "gray.950"}
            minW="0em"
            w="2em"
            h="100%"
            variant="plain"
            _hover={{
              bg: activeTool == "edit" ? "gray.900" : "gray.300",
            }}
            border="2px solid #d4d4d8"

            rounded="md"
            borderTopStartRadius="0"
            borderBottomStartRadius="0"
            borderLeft="none"
          >
            <LuChevronDown strokeWidth="2px" />
          </IconButton>
        </Menu.Trigger>

        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.Item value="cut">
                <LuScissors />
                <Box flex="1">Cut</Box>
                <Menu.ItemCommand>⌘X</Menu.ItemCommand>
              </Menu.Item>
              <Menu.Item value="copy">
                <LuTrash2 />
                <Box flex="1">Copy</Box>
                <Menu.ItemCommand>⌘C</Menu.ItemCommand>
              </Menu.Item>
              <Menu.Item value="paste">
                <LuTrash2 />
                <Box flex="1">Paste</Box>
                <Menu.ItemCommand>⌘V</Menu.ItemCommand>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </ButtonGroup>
  );
};

export default NonDrawMenu;
