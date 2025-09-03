import {
  ActionBar,
  Button,
  Input,
  HStack,
  Portal,
  VStack,
  Group,
} from "@chakra-ui/react";

import { PiPolygonThin, PiCircleThin, PiSquareThin } from "react-icons/pi";
import { LuCheck, LuMousePointer2, LuX } from "react-icons/lu";

import { handleDrawShape, deactivateHandlers } from "../Handlers";

import ActionButton from "./Button";
import NonDrawMenu from "./NonDrawMenu";

const CLOSE = false;
const OPEN = true;

const Bar = ({ activeTool, setTool, mapRef }) => {
  const customStyle = { width: "2.5em", height: "2.5em" };
  const customStroke = "5px";

  const ShapeDrawingActionBar = () => {
    return (
      <HStack h="50px">
        <Group attached>
          <Input placeholder="Enter name" size="lg" w="120px" />
          <Button p="4" variant="outline" size="lg" color="black">
            <LuCheck />
            Finish
          </Button>
        </Group>
        <Button p="4" variant="outline" size="lg">
          <LuX />
          Cancel
        </Button>
      </HStack>
    );
  };

  const MainActionBar = () => {
    return (
      <>
        <ActionButton
          icon={<LuMousePointer2 style={customStyle} strokeWidth={"1.5px"} />}
          event={() => {
            if (activeTool != "Select") {
              setTool("Select");
              deactivateHandlers(mapRef);
            }
          }}
          isActive={activeTool === "Select"}
          id="select-action"
        />

        <ActionButton
          icon={<PiSquareThin style={customStyle} strokeWidth={customStroke} />}
          event={() => {
            setTool("Rectangle");
            handleDrawShape(mapRef, "Rectangle");
          }}
          isActive={activeTool === "Rectangle"}
          id="rect-action"
        />

        <ActionButton
          icon={<PiCircleThin style={customStyle} strokeWidth={customStroke} />}
          event={() => {
            setTool("Circle");
            handleDrawShape(mapRef, "Circle");
          }}
          isActive={activeTool === "Circle"}
          id="circle-action"
        />

        <ActionButton
          icon={
            <PiPolygonThin style={customStyle} strokeWidth={customStroke} />
          }
          event={() => {
            setTool("Polygons");
            handleDrawShape(mapRef, "Polygons");
          }}
          isActive={activeTool === "Polygons"}
          id="poly-action"
        />

        <NonDrawMenu
          activeTool={activeTool}
          setActiveTool={setTool}
          mapRef={mapRef}
        ></NonDrawMenu>
      </>
    );
  };

  return (
    <>
      <ActionBar.Root open={true}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content
              border="1px solid #C6C6C6"
              rounded="lg"
              boxShadow="0px 2px 4px 0px rgba(0, 0, 0, 0.25)"
              overflow="hidden"
              alignItems="flex-end"
            >
              <MainActionBar />
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </>
  );
};

export default Bar;
