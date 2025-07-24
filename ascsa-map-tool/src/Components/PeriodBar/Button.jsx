import { Button, Text, VStack, Box } from "@chakra-ui/react";
import { useState } from "react";

const PeriodButton = ({
  title = "Ancient Greece",
  value = "gr",
  date = "800 - 146 BC",
  color = "black",
  checked=false,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive((prev) => !prev);
  };

  return (
    <Button
      key={value}
      w="100%"
      h="fit"
      overflow="hidden"
      bg="gray.200"
      border="1px solid"
      borderColor="gray.300"
      rounded="md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <VStack zIndex={1} gap={2} w="2xs" p="3">
        <Text
          fontSize="xl"
          fontWeight="normal"
          color={checked ? "white" : "black"}
          transition="color 0.3s ease"
        >
          {title}
        </Text>
        <Text
          fontSize="lg"
          fontWeight="normal"
          color={checked ? "white" : "gray.600"}
          transition="color 0.3s ease"
        >
          {date}
        </Text>
      </VStack>
      <Box
        bg={color}
        w="100%"
        h={checked ? "100%" : isHovered ? "15%" : "5px"}
        bottom="0"
        pos="absolute"
        transition="height 0.25s ease-out"
      />
    </Button>
  );
};

export default PeriodButton;
