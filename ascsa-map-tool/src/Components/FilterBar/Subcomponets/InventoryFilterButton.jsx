import { Box, Button, Text } from "@chakra-ui/react";;

const InventoryFilterButton = ({ inventoryObject, onClick }) => {
                  
  return (
    <>
      <Button
        key={inventoryObject.key}
        h="30px"
        justifyContent={"center"}
        variant={"subtle"}
        overflow="hidden"
        border="1px solid"
        borderColor="gray.300"
        _hover={{ bg: "gray.200" }}
        onClick={onClick}
      >
        <Text
          fontSize={{smToXl:"md", "2xl":"lg"}}
          fontWeight={"sem"}
          transition="color 0.3s ease"
        >
          {inventoryObject.title}
        </Text>

        <Box
          bg="gray.300"
          w="100%"
          h={inventoryObject.checked ? "100%" : "0"}
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

export default InventoryFilterButton;
