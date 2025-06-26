import { HStack, IconButton, Box } from "@chakra-ui/react";

import { PiPolygonThin, PiCircleThin, PiSquareThin } from "react-icons/pi";
import { LuMousePointer2, LuSquarePen } from "react-icons/lu";

import Button from "./Button";
import { handleDrawShape, handleEdit, deactivateHandlers } from "../Handlers";

const ActionBar = ({ activeTool, setActiveTool, mapRef }) => {
  const customStyle = { width: "2em", height: "2em" };
  const customStroke = "5px";

  return (
    <HStack
      w={"fit"}
      justifyContent={"space-around"}
      justifySelf={"center"}
      left={0}
      right={0}
      gap={3}
      p={"7px 10px 7px 10px"}
      bg="white"
      border={"1px solid #C6C6C6"}
      rounded={"xl"}
      bottom={5}
      position={"fixed"}
      boxShadow="0px 2px 4px 0px rgba(0, 0, 0, 0.25)"
    >
      <Button
        icon={<LuMousePointer2 style={customStyle} strokeWidth={"1.5px"} />}
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
        icon={<PiSquareThin style={customStyle} strokeWidth={customStroke} />}
        event={() => {
          setActiveTool("rectangle");
          handleDrawShape(mapRef, "Rectangle");
        }}
        isActive={activeTool === "rectangle"}
        id="rect-action"
      />

      <Button
        icon={<PiCircleThin style={customStyle} strokeWidth={customStroke} />}
        event={() => {
          setActiveTool("circle");
          handleDrawShape(mapRef, "Circle");
        }}
        isActive={activeTool === "circle"}
        id="circle-action"
      />

      <Button
        icon={<PiPolygonThin style={customStyle} strokeWidth={customStroke} />}
        event={() => {
          setActiveTool("poly");
          handleDrawShape(mapRef, "Polygons");
        }}
        isActive={activeTool === "poly"}
        id="poly-action"
      />

      <Button
        icon={<LuSquarePen style={customStyle} strokeWidth={"1.5px"} />}
        event={() => {
          if (activeTool != "edit") {
            handleEdit(mapRef);
            setActiveTool("edit");
          }
        }}
        id="edit-action"
        isActive={activeTool === "edit"}
      />
    </HStack>
  );
};

export default ActionBar;
