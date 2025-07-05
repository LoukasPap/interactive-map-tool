import { Button, Text, VStack, Box } from "@chakra-ui/react";
import { useState } from "react";

const PeriodButton = ({ title = "Ancient Greece", date = "800 - 146 BC", color="black" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <Button
      w="205px"
      h="66px"
      overflow="hidden"
      bg="gray.200"
      border="1px solid"
      borderColor="gray.300"
      rounded="md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <VStack zIndex={1} gap={3} pt="4" pb="4">
        <Text
          fontSize="3xl"
          color={isActive ? "white" : "black"}
          transition="color 0.3s ease"
        >
          {title}
        </Text>
        <Text
          fontSize="lg"
          color={isActive ? "white" : "gray.600"}
          transition="color 0.3s ease"
        >
          {date}
        </Text>
      </VStack>
      <Box
        bg={color}
        w="200%"
        h={isActive ? "100%" : isHovered ? "15%" : "5px"}
        bottom="0"
        pos="absolute"
        transition="height 0.25s ease-out"
      />
    </Button>
  );
};

export default PeriodButton;
