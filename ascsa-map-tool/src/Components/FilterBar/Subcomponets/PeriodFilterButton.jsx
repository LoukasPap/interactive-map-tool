import { Button, Text, VStack, Box, HStack } from "@chakra-ui/react";

const PeriodFilterButton = ({
  title = "Ancient Greece",
  value = "gr",
  date = "800 - 146 BC",
  color = "black",
  checked = false,
  onClick,
}) => {

  return (
    <Button
      key={value}
      variant="subtle"
      h={{ lg: "45px", md: "40px" }}
      overflow="hidden"
      border="1px solid"
      borderColor="gray.300"
      rounded="md"
      onClick={onClick}
      justifyContent="start"
      _hover={{ bg: "gray.200" }}
    >
      <HStack align="center" gap={0} >
        <Box
          bg={checked ? color : "white"}
          border="1px solid"
          borderColor={color}
          w="10px"
          h="30px"
          rounded="sm"
          transition="all 0.25s ease-out"
        />

        <VStack
          align={"flex-start"}
          zIndex={1}
          gap={1}
          p="2"
        >
          <Text
            fontSize={{ lg: "lg", md: "sm" }}
            fontWeight="normal"
            color="gray.950"
            transition="color 0.3s ease"
          >
            {title}
          </Text>
          <Text
            fontSize={{ lg: "md", md: "xs" }}
            fontWeight="normal"
            color="gray.600"
            transition="color 0.3s ease"
          >
            {date}
          </Text>
        </VStack>
      </HStack>
      <Box
        bg="gray.300"
        w="100%"
        h={checked ? "100%" : "0"}
        bottom="0"
        left="0"
        pos="absolute"
        transition="height 0.25s ease-out"
        zIndex={-2}
      />
    </Button>
  );
};

export default PeriodFilterButton;
