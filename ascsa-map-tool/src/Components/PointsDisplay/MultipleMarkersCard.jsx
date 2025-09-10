import {
  Field,
  Button,
  Card,
  For,
  Text,
  Pagination,
  Box,
  ButtonGroup,
  IconButton,
  HStack,
  Image,
  VStack,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuCircleX,
  LuSave,
} from "react-icons/lu";
import { PointButton } from "./PointCardFooter";

const eraToColorMapping = {
  Prehistoric: "gray.500",
  Greek: "blue.500",
  Roman: "red.500",
  Byzantine: "orange.500",
  Turkish: "yellow.500",
  Medieval: "green.500",
  Modern: "pink.500",
  Unknown: "gray.950",
};

const pageSize = 25;

const MultipleMarkersCard = ({ markers, finishShape, cancelShape }) => {
  console.log("markers in MultipleMarkersCard: ", markers);

  const [page, setPage] = useState(1);

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const visibleMarkers = markers.slice(startRange, endRange);

  const Marker = ({ info }) => {
    return (
      <Button
        as="div"
        alignContent="center"
        h="80px"
        minH="80px"
        w="100%"
        rounded="md"
        bg="gray.300"
        overflow="hidden"
        p={0}
        variant="plain"
      >
        <Box
          w="100%"
          h="10px"
          bg={eraToColorMapping[info.properties.Era]}
          pos="absolute"
          bottom="0"
          zIndex={-1}
        />
        <HStack
          w="100%"
          gap={4}
          pl="5px"
          pr="5px"
          justifyContent={"space-between"}
        >
          <Image
            src={
              info.properties.Parent[2] ||
              info.properties.Parent[1] ||
              info.properties.Parent[0]
            }
            w="70px"
            h="70px"
            rounded="sm"

            // style={{ backgroundImage: "url('jewel-img.png')", backgroundSize: 'cover' }}
          />
          <VStack alignItems="self-start" maxW="190px" w="190px" gap={1}>
            <Text
              textAlign="start"
              fontWeight="semibold"
              fontSize="xl"
              whiteSpace="normal"
            >
              {info.properties.Title || info.properties.Name}
            </Text>
            {info.properties.Title && (
              <Text fontSize="lg" color="gray">
                {info.properties.Name}
              </Text>
            )}
          </VStack>
          <Button>❇️</Button>
        </HStack>
      </Button>
    );
  };

  const Footer = () => {
    const [value, setValue] = useState("");

    return (
      <Card.Footer
        w="100%"
        justifyContent="center"
        p={0}
        pl="5"
        flexDir="row"
        bg="black"
      >
        <Field.Root
          fontSize="lg"
          w="fit-content"
          color="white"
          size="xl"
        >
          <Field.Label>Collection name</Field.Label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. Bag of coins"
            variant="flushed"

            // w="100px"
          />{" "}
        </Field.Root>

        <PointButton
          id="save-group"
          label="Save"
          icon={
            <LuSave
              style={{ width: "2.25em", height: "2.25em" }}
              strokeWidth="1.5px"
            />
          }
          onClick={finishShape}
        />

        <PointButton
          id="discard-group"
          label="Discard"
          icon={
            <LuCircleX
              style={{ width: "2.25em", height: "2.25em" }}
              strokeWidth="1.5px"
            />
          }
          onClick={cancelShape}
        />
      </Card.Footer>
    );
  };

  return (
    <Card.Root
      w="20vw"
      position="fixed"
      top="12px"
      right="12px"
      maxH="calc(100% - 12px*2)" // we set 12px * 2 to take into the 12px distance from top and bottom
      rounded="xl"
      border="1px solid"
      borderColor="gray.300"
      gap={2}
      overflow="auto"
    >
      <Card.Header>
        <Text>
          selection: <b>{markers.length}</b>
        </Text>

        <Pagination.Root
          w="30px"
          count={markers.length}
          pageSize={pageSize}
          page={page}
          onPageChange={(e) => setPage(e.page)}
          siblingCount={1}
        >
          <ButtonGroup attached variant="subtle" size="xl">
            <Pagination.PrevTrigger asChild>
              <IconButton border="1px solid" color="gray.400">
                <LuChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>

            <Pagination.Items
              render={(page) => (
                <IconButton
                  border="1px solid"
                  color="gray.400"
                  _selected={{
                    bg: "gray.400",
                    border: "1px solid",
                    borderColor: "gray.400",
                    color: "white",
                  }}
                >
                  {page.value}
                </IconButton>
              )}
            />

            <Pagination.NextTrigger asChild>
              <IconButton border="1px solid" color="gray.400">
                <LuChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </Card.Header>
      <Card.Body
        pt="0"
        gap="2"
        overflow="scroll"
        scrollbarColor="black transparent"
        scrollbarWidth="thin"
      >
        <For each={visibleMarkers} fallback={["-"]}>
          {(item, index) => <Marker info={item} key={index} />}
        </For>
      </Card.Body>
      <Footer />
    </Card.Root>
  );
};

export default MultipleMarkersCard;
