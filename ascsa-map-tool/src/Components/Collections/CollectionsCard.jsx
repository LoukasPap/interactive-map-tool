import { Text, Card } from "@chakra-ui/react";

const CollectionsCard = () => {
  return (
    <Card.Root
      w={{ sm: "30vw", md: "25vw", lg: "22.5vw" }}
      bg="white"
      // p="30px 22px"
      rounded="xl"
      border="1px solid #C6C6C6"
      top="calc(3.5vh + 5px)"
      bottom="calc(12px + 12px)"
      position="absolute"
    >
      <Card.Header>
        <Text fontSize="3xl" fontWeight="bold">
          Collections
        </Text>
      </Card.Header>

      <Card.Body h="inherit" overflow="auto">
        Empty
      </Card.Body>
    </Card.Root>
  );
};

export default CollectionsCard;
