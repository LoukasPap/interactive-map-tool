import { ActionBar, Portal } from "@chakra-ui/react";

import {
  BiPointer,
  BiEdit,
  BiShapeCircle,
  BiShapeSquare,
  BiShapePolygon,
} from "react-icons/bi";

import { handleDrawShape, deactivateHandlers } from "../../Helpers/ShapeHandlers";

import ActionButton from "./Button";

const Bar = ({ activeTool, setTool, mapRef }) => {
  const customStyle = { width: "2.5em", height: "2.5em" };

  const MainActionBar = () => {
    return (
      <>
        <ActionButton
          icon={<BiPointer style={customStyle} />}
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
          icon={<BiShapeCircle style={customStyle} />}
          event={() => {
            setTool("Circle");
            handleDrawShape(mapRef, "Circle");
          }}
          isActive={activeTool === "Circle"}
          id="circle-action"
        />

        <ActionButton
          icon={<BiShapeSquare style={customStyle} />}
          event={() => {
            setTool("Rectangle");
            handleDrawShape(mapRef, "Rectangle");
          }}
          isActive={activeTool === "Rectangle"}
          id="rect-action"
        />

        <ActionButton
          icon={<BiShapePolygon style={customStyle} />}
          event={() => {
            setTool("Polygons");
            handleDrawShape(mapRef, "Polygons");
          }}
          isActive={activeTool === "Polygons"}
          id="poly-action"
        />

        <ActionButton
          icon={<BiEdit style={customStyle} />}
          event={() => {
            setTool("Edit");
            handleDrawShape(mapRef, "Edit");
          }}
          isActive={activeTool === "Edit"}
          id="edit-action"
        />
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
