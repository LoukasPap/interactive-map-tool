import { ActionBar, Checkbox, Portal } from "@chakra-ui/react";

import { PiPolygonThin, PiCircleThin, PiSquareThin } from "react-icons/pi";
import { LuMousePointer2, LuSquarePen, LuTrash2 } from "react-icons/lu";

import {
  handleDrawShape,
  handleRemove,
  deactivateHandlers,
} from "../Handlers";

import Button from "./Button";
import NonDrawMenu from "./NonDrawMenu";

const Bar = ({ isPeriodBarOpen, activeTool, setActiveTool, mapRef }) => {
  const customStyle = { width: "2.25em", height: "2.25em" };
  const customStroke = "5px";

  return (
    <>
      <ActionBar.Root open={true}>
        <Portal>
          <ActionBar.Positioner mb={isPeriodBarOpen ? "90px" : "0"} transition="margin-bottom 1s">
            <ActionBar.Content
              border="1px solid #C6C6C6"
              rounded="2xl"
              boxShadow="0px 2px 4px 0px rgba(0, 0, 0, 0.25)"
            >
              <Button
                icon={
                  <LuMousePointer2 style={customStyle} strokeWidth={"1.5px"} />
                }
                event={() => {
                  if (activeTool != "select") {
                    setActiveTool("select");
                    deactivateHandlers(mapRef);
                  }
                }}
                isActive={activeTool === "select"}
                id="select-action"
              />

              <Button
                icon={
                  <PiSquareThin
                    style={customStyle}
                    strokeWidth={customStroke}
                  />
                }
                event={() => {
                  setActiveTool("rectangle");
                  handleDrawShape(mapRef, "Rectangle");
                }}
                isActive={activeTool === "rectangle"}
                id="rect-action"
              />

              <Button
                icon={
                  <PiCircleThin
                    style={customStyle}
                    strokeWidth={customStroke}
                  />
                }
                event={() => {
                  setActiveTool("circle");
                  handleDrawShape(mapRef, "Circle");
                }}
                isActive={activeTool === "circle"}
                id="circle-action"
              />

              <Button
                icon={
                  <PiPolygonThin
                    style={customStyle}
                    strokeWidth={customStroke}
                  />
                }
                event={() => {
                  setActiveTool("poly");
                  handleDrawShape(mapRef, "Polygons");
                }}
                isActive={activeTool === "poly"}
                id="poly-action"
              />

              <NonDrawMenu
                activeTool={activeTool}
                setActiveTool={setActiveTool}
                mapRef={mapRef}
              ></NonDrawMenu>

            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </>
  );
};

export default Bar;
