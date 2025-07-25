import {
  DataList,
  Button,
  Text,
  Card,
  SimpleGrid,
  Separator,
  HStack,
  Clipboard,
  Group,
  Icon,
  IconButton,
  CloseButton,
  Link,
  For,
  Image,
  Container,
  Heading,
  Box,
} from "@chakra-ui/react";
import {
  LuCopy,
  LuX,
  LuMapPin,
  LuMapPinCheckInside,
  LuExternalLink,
} from "react-icons/lu";

import { useState } from "react";

import PointCardFooter from "./PointCardFooter";

const SinglePointCard = ({ point }) => {
  const dummyObject = {
    id: "AgoraID1",
    title: "Vessel",
    chronology: "Ancient Greece",
    date: "July 1st, 1995",
    section: "B4",
    link: (
      <Link href="#" color="blue.500">
        https://ascsa.net
        <LuExternalLink />
      </Link>
    ),
    description:
      "Hephaisteion Garden; fill beside wall. Loose filling encountered in rescue excavation to examine wall found during construction of public toilet in Theseion Park, outside Agora area.",
    images: [
      "https://ascsa-net.gr/image?type=preview&id=Agora%3AImage%3A2016.05.0160",
      "https://ascsa-net.gr/image?type=preview&id=Agora%3AImage%3A2016.05.0161",
      "https://ascsa-net.gr/image?type=preview&id=Agora%3AImage%3A2015.06.1028",
      "https://ascsa-net.gr/image?type=preview&id=Agora%3AImage%3A2015.06.1029",
    ],
    coords: [23.722605, 37.976641],
  };

  const propList = ["title", "chronology", "date", "section", "link"];

  const [copied, setCopied] = useState(false);
  const [visible, setVisibility] = useState(true);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    console.log("finito");
  };

  return (
    <Card.Root
      visibility={visible ? "visible" : "hidden"}
      w="20vw"
      position="fixed"
      top="12px"
      right="12px"
      rounded="md"
      variant="elevated"
      border="1px solid"
      borderColor="gray.300"
    >
      <Card.Header mt="2">
        <HStack
          alignItems="center"
          justifyContent="space-between"
          h="fit"
          gap="4"
        >
          <Group>
            <Card.Title h="fit" overflow="visible">
              <Text fontSize="3xl">
                {(point && point.f.id.substr(6)) || "-"}
              </Text>
            </Card.Title>

            <Clipboard.Root value={(point && point.f.id) || "-"}>
              <Clipboard.Trigger asChild>
                {/* <Icon _hover={{ bg: "gray.300" }} rounded="sm" p={2} >
                  <LuCopy size={30} cursor="pointer"/>
                </Icon> */}
                <IconButton _hover={{ bg: "gray.300" }} variant="plain">
                  <Clipboard.Indicator>
                    <LuCopy size={30} />
                  </Clipboard.Indicator>
                </IconButton>
              </Clipboard.Trigger>
            </Clipboard.Root>
          </Group>

          <CloseButton _hover={{ bg: "gray.300" }} onClick={(e)=>setVisibility(!!e.visibility)}>
            <LuX style={{ width: "2em", height: "auto" }} />
          </CloseButton>
        </HStack>
        <Separator size="sm" mt={1} />
      </Card.Header>

      <Card.Body gap="4">
        <DataList.Root color="black" size="lg">
          <SimpleGrid columns={2} gap="4">
            {/* {point && point.f.proper} */}
            {propList.map((prop) => (
              <DataList.Item key={dummyObject["id"]}>
                <DataList.ItemLabel
                  fontSize="xl"
                  fontWeight="semibold"
                  color="black"
                >
                  {prop.charAt(0).toUpperCase() + prop.slice(1)}
                </DataList.ItemLabel>
                <DataList.ItemValue fontSize={"lg"}>
                  {dummyObject[prop]}
                </DataList.ItemValue>
              </DataList.Item>
            ))}

            <Clipboard.Root
              display="flex"
              flexDir="column"
              justifyContent="center"
              value={dummyObject["coords"]}
              onStatusChange={handleCopy}
            >
              <Clipboard.Trigger asChild>
                <Button
                  variant="solid"
                  fontSize="lg"
                  bg="black"
                  h="80%"
                  w="100%"
                  rounded="md"
                >
                  <Icon size={"xl"}>
                    {copied ? <LuMapPinCheckInside /> : <LuMapPin />}
                  </Icon>
                  Copy WGS84
                </Button>
              </Clipboard.Trigger>
            </Clipboard.Root>
          </SimpleGrid>
        </DataList.Root>

        <Box>
          <Heading mb={2}>Images</Heading>
          <HStack
            gap="4"
            h="fit"
            maxH="100px"
            overflow="scroll"
            scrollbarColor="black transparent"
            scrollbarWidth="thin"
          >
            <For
              each={dummyObject["images"]}
              fallback={<Text color="gray">No images</Text>}
            >
              {(item, index) => (
                <Image
                  border="1px solid black"
                  aspectRatio={3 / 2}
                  h="100px"
                  src={item}
                  fit="contain"
                  rounded="md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://picsum.photos/200/300";
                  }}
                />
              )}
            </For>
          </HStack>
        </Box>

        <Box>
          <Heading>Description</Heading>
          <Text textAlign="justify">{dummyObject["description"]}</Text>
        </Box>
      </Card.Body>

      <Card.Footer
        justifyContent="center"
        flexDir="row"
        bg="black"
        p={0}
        roundedBottom="md"
      >
        <PointCardFooter />
      </Card.Footer>
    </Card.Root>
  );
};

export default SinglePointCard;
