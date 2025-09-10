import { Box, Button, createIcon, HStack, Text } from "@chakra-ui/react";
import { Icon } from "lucide-react";
import { getMaterialIconSVG } from "./MaterialIcons";
import { useState } from "react";

const MaterialButton = ({ materialObject, onClick }) => {
                  
  return (
    <>
      <Button
        key={materialObject.key}
        h="40px"
        size="xl"
        justifyContent={"start"}
        variant={"subtle"}
        overflow="hidden"
        border="1px solid"
        borderColor="gray.300"
        _hover={{ bg: "gray.200" }}
        onClick={onClick}
      >
        {getMaterialIconSVG(materialObject.value, materialObject.color)}
        <Text
          fontSize={{smToXl:"md", "2xl":"lg"}}
          fontWeight={"sem"}
          // color={materialObject.checked ? "#fff" : "#000"}
          transition="color 0.3s ease"
        >
          {materialObject.title}
        </Text>

        <Box
          bg="gray.300"
          w="100%"
          h={materialObject.checked ? "100%" : "0"}
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
