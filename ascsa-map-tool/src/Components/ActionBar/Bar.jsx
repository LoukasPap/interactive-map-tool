import { HStack, IconButton, Box } from "@chakra-ui/react";

import { PiPolygonThin, PiCircleThin, PiSquareThin } from "react-icons/pi";
import { LuMousePointer2 } from "react-icons/lu";
import Button from "./Button";

const ActionBar = ({ activeTool, setActiveTool }) => {
  const customStyle = { width: "2.6em", height: "2.6em" };
  const customStroke = "1.5px";

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
        icon={<LuMousePointer2 style={customStyle} strokeWidth={"1px"} />}
        event={() => console.log("Custom button clicked")}
        id="act0"
      />

      <Button
        icon={<PiSquareThin style={customStyle} strokeWidth={customStroke} />}
        event={() => {setActiveTool("rectangle");}}
        isActive={activeTool === "rectangle"}
        id="act2"
      />

      <Button
        icon={<PiCircleThin style={customStyle} strokeWidth={customStroke} />}
        event={() => {setActiveTool("circle");}}
        isActive={activeTool === "circle"}
        id="act3"
      />

      <Button
        icon={<PiPolygonThin style={customStyle} strokeWidth={customStroke} />}
        event={() => console.log("Circle clicked")}
        id="act3"
      />
    </HStack>
  );
};

export default ActionBar;
