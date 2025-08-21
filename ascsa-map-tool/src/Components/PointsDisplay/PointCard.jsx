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
  For,
  Image,
  Heading,
  Box,
  Tag,
} from "@chakra-ui/react";
import {
  LuCopy,
  LuX,
  LuMapPin,
  LuMapPinCheckInside,
  LuInfo,
} from "react-icons/lu";
import { Tooltip } from "../ui/tooltip";

import { useEffect, useState } from "react";
import PointCardFooter from "./PointCardFooter";
import DimensionsTable from "./DimensionsTable";

const initialObject = {
  name: "name",
  title: "title",
  period: "period",
  era: "era",
  chronology: "chronology",
  section: "section",
  date: "date",
  material: "material",
  materialCategory: "materialCategory",
  description: "description",
  coords: [23.722605, 37.976641],
  dimensions: [],
  type: "type",
  category: "category",
  link: "https://ascsa.net",
  images: [],
  lot: "lot",
  deposit: "deposit",
};

const SinglePointCard = ({ marker }) => {
  const [pointDetails, setPointDetails] = useState(initialObject);

  useEffect(() => {
    console.log("[DEBUG] SELECTED MARKER", marker);
    if (marker) {
      setPointDetails({
        ...pointDetails,

        name: marker.properties.Name,
        title: marker.properties.Title || "N/A",
        period: marker.properties.Period || "N/A", // goes with Chronology
        era: marker.properties.Era || "N/A",
        chronology: marker.properties.Chronology || "N/A",

        section: marker.properties.SectionNumber || "N/A",
        date: marker.properties.Date || "N/A",

        material: marker.properties.ListedMaterial.join(", ") || "N/A",
        materialCategory: marker.properties.MaterialCategory || "N/A",

        description: marker.properties.Description || "N/A",
        coords: marker.geometry.coordinates,

        dimensions: marker.properties.FormattedDimensions || [],
        type: marker.properties.Type || "N/A",
        category: marker.properties.Category || "N/A",

        link: `https://ascsa-net.gr/id/agora/${marker.properties.Type}/${marker.properties.Name}`, // https://ascsa-net.gr/id/agora/coin/n 205887
        images: marker.properties.Parent || [],

        lot: marker.properties.Lot || "N/A",
        deposit: marker.properties.Deposit || "N/A",
      });
    }
  }, [marker]);

  const propList = ["title", "period", "material", "section", "date"];

  const [copied, setCopied] = useState(false);
  const [visible, setVisibility] = useState(true);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    console.log("finito");
  };

  const calculateAspectRatio = (width, height) => {
    // Simplify the ratio
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);

    const simplifiedWidth = width / divisor;
    const simplifiedHeight = height / divisor;

    return {
      ratio: simplifiedWidth / simplifiedHeight,
      displayRatio: `${simplifiedWidth}:${simplifiedHeight}`,
    };
  };

  function ImageWithSpinner({ src }) {
    const [isLoading, setIsLoading] = useState(true);

    return (
      <>
        {/* {isLoading && <Spinner position="absolute" zIndex={1} />} */}
        <Image
          border="1px solid black"
          // aspectRatio={3 / 2}

          h="100px"
          src={src}
          fit="fill"
          rounded="md"
          onLoad={(e) => {
            setIsLoading(false);
            const { width, height } = e.target;
            const { ratio, displayRatio } = calculateAspectRatio(width, height);
            console.log(width, height, ratio);
            e.target.style.aspectRatio = ratio;
          }}
          onError={(e) => {
            setIsLoading(false);
            e.target.style.display = "none";
          }}
        />
      </>
    );
  }

  return (
    <Card.Root
      visibility={visible ? "visible" : "hidden"}
      w="20vw"
      position="fixed"
      top="12px"
      right="12px"
      
      maxH="calc(100% - 12px*2)" // we set 12px * 2 to take into the 12px distance from top and bottom
      rounded="xl"
      border="1px solid"
      borderColor="gray.300"

      overflow="scroll"
      scrollbarColor="black transparent"
      scrollbarWidth="thin"
    >
      <Card.Header mt="2">
        <HStack
          alignItems="center"
          justifyContent="space-between"
          h="fit"
          gap="1"
        >
          <Group>
            <Card.Title h="fit" overflow="visible">
              <Text fontSize="3xl">{(marker && pointDetails.name) || "-"}</Text>
            </Card.Title>

            <Clipboard.Root
              value={(marker && `Agora:Object:${pointDetails.name}`) || "-"}
            >
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

          <Tooltip
            content={`Deposit: ${pointDetails.deposit}`}
            interactive
            openDelay={200}
            closeDelay={200}
          >
            <Tag.Root colorPalette="orange" size="xl">
              <Tag.Label>{pointDetails.deposit}</Tag.Label>
              <Tag.EndElement>
                <LuInfo />
              </Tag.EndElement>
            </Tag.Root>
          </Tooltip>

          <Tooltip
            content={`Lot: ${pointDetails.lot}`}
            interactive
            openDelay={200}
            closeDelay={200}
          >
            <Tag.Root colorPalette="blue" size="xl">
              <Tag.Label>{pointDetails.lot}</Tag.Label>
              <Tag.EndElement>
                <LuInfo />
              </Tag.EndElement>
            </Tag.Root>
          </Tooltip>

          <CloseButton
            _hover={{ bg: "gray.300" }}
            onClick={(e) => setVisibility(!!e.visibility)}
          >
            <LuX style={{ width: "2em", height: "auto" }} />
          </CloseButton>
        </HStack>
        <Separator size="sm" mt={1} borderColor={"gray.300"} />
      </Card.Header>

      <Card.Body gap="4" maxH="100%" overflow="scroll">
        <DataList.Root color="black" size="lg">
          <SimpleGrid columns={2} gap="4">
            {/* {point && point.f.proper} */}
            {propList.map((prop) => (
              <DataList.Item key={prop}>
                <DataList.ItemLabel
                  fontSize="xl"
                  fontWeight="semibold"
                  color="black"
                >
                  {prop.charAt(0).toUpperCase() + prop.slice(1)}
                </DataList.ItemLabel>
                <DataList.ItemValue fontSize={"lg"}>
                  {pointDetails[prop]}
                </DataList.ItemValue>
              </DataList.Item>
            ))}

            <Clipboard.Root
              display="flex"
              flexDir="column"
              justifyContent="center"
              value={pointDetails["coords"]}
              onStatusChange={handleCopy}
            >
              <Clipboard.Trigger asChild>
                <Button
                  variant="solid"
                  fontSize="lg"
                  bg="black"
                  p={2}
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

            <Box gridColumn="span 2">
              <Heading mb="1">Dimensions</Heading>
              <DimensionsTable dimensions={pointDetails.dimensions} />
            </Box>
          </SimpleGrid>
        </DataList.Root>

        <Box>
          <Heading mb={2}>Images</Heading>
          <HStack
            gap="4"
            h="fit"
            maxH="120px"
            overflow="scroll"
            pb="0.8em"
            scrollbarColor="black transparent"
            scrollbarWidth="thin"
            onWheel={(e) => {
              e.preventDefault();
              e.currentTarget.scrollBy({
                left: e.deltaY * 2.5,
                behavior: "smooth",
              });
            }}
          >
            <For
              each={pointDetails["images"].slice(0, 10)}
              fallback={<Text color="gray">No images</Text>}
            >
              {(item, index) => <ImageWithSpinner key={index} src={item} />}
            </For>

            {+pointDetails["images"].length > 10 ? ( // prefixing "+" transforms str to int
              <Button w="100px" h="100px" variant="outline" border="1px dashed black">
              <Text>Visit source<br/>for more images</Text>
            </Button>
            ) : null}
          </HStack>
        </Box>

            {/* {errorImages == pointDetails["images"].length ? ( */}
            {/* <Text color="gray">No images</Text> */}
            {/* ) : ( */}

        <Box>
          <Heading>Description</Heading>
          <Text
            textAlign="justify"
            maxH="20vh"
            overflow="scroll"
            scrollbarColor="black transparent"
            scrollbarWidth="thin"
            pr="1em"
          >
            {pointDetails["description"]}
          </Text>
        </Box>
      </Card.Body>

      <Card.Footer
        justifyContent="center"
        flexDir="row"
        bg="black"
        p={0}
      >
        <PointCardFooter source={pointDetails.link} />
      </Card.Footer>
    </Card.Root>
  );
};

export default SinglePointCard;
