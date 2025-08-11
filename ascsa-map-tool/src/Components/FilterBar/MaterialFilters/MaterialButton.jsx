import { Box, Button, createIcon, HStack, Text } from "@chakra-ui/react";
import { Icon } from "lucide-react";
import { getMaterialIconSVG } from "./MaterialIcons";
import { useState } from "react";

const MaterialButton = ({ material, color, checked, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Button
        h="40px"
        size="xl"
        justifyContent={"start"}
        variant={"subtle"}
        overflow="hidden"
        border="1px solid"
        borderColor="gray.300"
        _hover={{ bg: "gray.300" }}
        onClick={onClick}
      >
        {getMaterialIconSVG(material, color)}
        <Text
          fontSize={"lg"}
          fontWeight={"sem"}
          color={checked ? "#fff" : "#000"}
          transition="color 0.3s ease"
        >
          {material}
        </Text>

        <Box
          bg="#3A3A3A"
          w="100%"
          h={checked ? "100%" : "0"}
          bottom="0"
          left="0"
          pos="absolute"
          transition="height 0.25s ease-out"
          zIndex={-2}
        />
      </Button>
    </>
  );
};

export default MaterialButton;
