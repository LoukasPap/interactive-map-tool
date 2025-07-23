import {
  DataList,
  Avatar,
  Text,
  Card,
  SimpleGrid,
  Separator,
  HStack,
  Clipboard,
  IconButton,
} from "@chakra-ui/react";
import { LuAArrowDown } from "react-icons/lu";

import PointCardFooter from "./PointCardFooter";

const SinglePointCard = ({ point }) => {
  return (
    <Card.Root
      w="25rem"
      position="fixed"
      right={0}
      top={0}
      pb={0}
      me={5}
      rounded="md"
      mt={"5em"}
      variant="subtle"
    >
      <Card.Body gap="2">
        <HStack alignItems="center" h="fit">
          <Avatar.Root size="2xs" shape="rounded">
            <Avatar.Image src="https://picsum.photos/200/300" />
            <Avatar.Fallback name="Nue Camp" />
          </Avatar.Root>

          <Card.Title mt="2" fontSize="2xl" h="fit" overflow="visible">
            <Text>{(point && point.f.id) || "-"}</Text>
          </Card.Title>

          <Clipboard.Root value={(point && point.f.id) || "-"}>
            <Clipboard.Trigger asChild>
              <IconButton variant="plain" size="md">
                <Clipboard.Indicator />
              </IconButton>
            </Clipboard.Trigger>
          </Clipboard.Root>
        </HStack>
        <Separator my={2} size="xl" colorPalette={"gray"}/>

        <DataList.Root color="black">
          <SimpleGrid columns={[2, null, 3]} gap="6">

            {/* {point && point.f.proper} */}

            <DataList.Item key={"1"}>
              <DataList.ItemLabel
                fontSize="xl"
                color="black"
                fontWeight="semibold"
              >
                {"Period"}
              </DataList.ItemLabel>
              <DataList.ItemValue>{"dummy"}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item key={"2"}>
              <DataList.ItemLabel>{"Title 2"}</DataList.ItemLabel>
              <DataList.ItemValue>{"dummy2"}</DataList.ItemValue>
            </DataList.Item>
            <DataList.Item key={"3"}>
              <DataList.ItemLabel>{"Title 3"}</DataList.ItemLabel>
              <DataList.ItemValue>{"dummy3"}</DataList.ItemValue>
            </DataList.Item>
          </SimpleGrid>
        </DataList.Root>
      </Card.Body>

      <Card.Footer
        justifyContent="center"
        flexDir="row"
        bg="black"
        p={0}
        roundedBottom="md"
      >
        <PointCardFooter />
        {/* <IconButton variant="subtle" bg="blue">
          <LuAArrowDown/>
          View
        </IconButton>
        <Button><LuAArrowDown/>Join</Button> */}
      </Card.Footer>
    </Card.Root>
  );
};

export default SinglePointCard;
