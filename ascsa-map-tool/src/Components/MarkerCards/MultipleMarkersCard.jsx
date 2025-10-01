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
  Dialog,
  Portal,
  Stack,
  Group,
  ColorSwatch,
} from "@chakra-ui/react";

import { useState, useRef } from "react";
import {
  LuSaveAll,
  LuChevronLeft,
  LuChevronRight,
  LuCircleX,
  LuSave,
  LuEye,
  LuArrowBigRight,
  LuArrowRight,
} from "react-icons/lu";

import { MarkerButton } from "./SingleMarkerCardFooter";

const eraToColorMapping = {
  Neolithic: "gray.700",
  "Bronze Age": "orange.700",
  Geometric: "yellow.400",
  Protoattic: "yellow.200",
  Archaic: "blue.900",
  Classical: "blue.700",
  "Late Classical": "blue.500",
  Hellenistic: "blue.300",
  Roman: "red.500",
  "Late Roman": "red.400",
  Byzantine: "orange.500",
  Frankish: "green.500",
  Ottoman: "yellow.600",
  Modern: "pink.500",
  Unknown: "gray.950",
};

const pageSize = 25;

const MultipleMarkersCard = ({
  markers,
  saveCollection,
  discardCollection,
  updateCollection,
  isSavedInCollection = -1,
  isVisible,
  viewMarker,
}) => {
  console.log("markers in MultipleMarkersCard: ", markers);

  const [page, setPage] = useState(1);

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const visibleMarkers = markers.slice(startRange, endRange);

  const lastSelected = useRef("-1");

  const Marker = ({ info }) => {
    return (
      <Button
        alignContent="center"
        h="60px"
        minH="60px"
        w="100%"
        rounded="md"
        bg="gray.100"
        _hover={{ bg: "gray.200" }}
        overflow="hidden"
        p={0}
        variant="outline"
        border={lastSelected.current==info._id ? "1px solid black" : "none"}
        
      >
        {/* <Box
          w="100%"
          h="5px"
          bg={eraToColorMapping[info.Era]}
          pos="absolute"
          bottom="0"
          zIndex={-1}
        /> */}

        <HStack
          w="100%"
          gap={4}
          pl="5px"
          pr="5px"
          justifyContent="start"
        >
          <Image
            src={
              info.Images != null &&
              (info.Images[2] || info.Images[1] || info.Images[0])
            }
            w="50px"
            maxW="50px"
            h="50px"
            rounded="sm"
          />
          <Group flexGrow={1} gap={3}>
            <Box
              bg={eraToColorMapping[info.Era]}
              border="1px solid"
              borderColor={eraToColorMapping[info.Era]}
              w="10px"
              h="30px"
              rounded="sm"
              transition="all 0.25s ease-out"
            />
            <VStack alignItems="self-start" maxW="180px" w="fit" gap={1}>
              <Text
                textAlign="start"
                fontWeight="regular"
                fontSize="lg"
                whiteSpace="normal"              >
                {info.Title || info.Name}
              </Text>
              {info.Title && (
                <Text fontSize="md" color="gray">
                  {info.Name}
                </Text>
              )}
            </VStack>
          </Group>

          <IconButton
            mr={2}
            onClick={() => {
              lastSelected.current = info._id;
              viewMarker(info);
            }}
          >
            <LuArrowRight />
          </IconButton>
        </HStack>
      </Button>
    );
  };

  const Footer = ({ save }) => {
    const [nameValue, setNameValue] = useState("");
    const [descriptionValue, setDescriptionValue] = useState("");
    const [error, setError] = useState(false);
    const ref = useRef(null);

    function clearInput() {
      setNameValue("");
      setDescriptionValue("");
      setError(false);
    }

    return (
      <Card.Footer
        w="100%"
        justifyContent="center"
        p={0}
        pl="5"
        flexDir="row"
        bg="black"
      >
        {/* <Field.Root fontSize="lg" w="fit-content" color="white" size="xl">
          <Field.Label>Collection name</Field.Label>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. Bag of coins"
            variant="flushed"

            // w="100px"
          />{" "}
        </Field.Root> */}

        {/* <MarkerButton
          id="save-group"
          label="Save"
          icon={
            <LuSave
              style={{ width: "2.25em", height: "2.25em" }}
              strokeWidth="1.5px"
            />
          }
          onClick={() => save("here")}/> */}

        {isSavedInCollection == -1 ? (
          <>
            <Dialog.Root initialFocusEl={() => ref.current}>
              <Dialog.Trigger asChild>
                <MarkerButton
                  id="save-group"
                  label="Save"
                  icon={
                    <LuSave
                      style={{ width: "2.25em", height: "2.25em" }}
                      strokeWidth="1.5px"
                    />
                  }
                />
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>Save Collection</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body pb="4">
                      <Stack gap="4">
                        <Field.Root required invalid={error}>
                          <Field.Label>
                            Name <Field.RequiredIndicator color="black" />
                          </Field.Label>
                          <Input
                            value={nameValue}
                            // _invalid={{border:"1px red solid"}}
                            onChange={(e) => setNameValue(e.target.value)}
                            required
                            placeholder="E.g. ProtoatticAmphoras2"
                            ref={ref}
                          />
                          <Field.ErrorText>
                            This field is required
                          </Field.ErrorText>
                        </Field.Root>

                        <Field.Root>
                          <Field.Label>Description</Field.Label>
                          <Input
                            value={descriptionValue}
                            onChange={(e) =>
                              setDescriptionValue(e.target.value)
                            }
                            placeholder="A short description of the collection"
                          />
                        </Field.Root>
                      </Stack>
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Dialog.ActionTrigger asChild>
                        <Button variant="outline" onClick={clearInput}>
                          Cancel
                        </Button>
                      </Dialog.ActionTrigger>
                      <Button
                        onClick={() => {
                          if (nameValue == "" || nameValue == null) {
                            setError(true);
                          } else {
                            save({
                              name: nameValue,
                              description: descriptionValue,
                            });
                          }
                        }}
                      >
                        Save
                      </Button>
                    </Dialog.Footer>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>

            <MarkerButton
              id="discard-group"
              label="Discard"
              icon={
                <LuCircleX
                  style={{ width: "2.25em", height: "2.25em" }}
                  strokeWidth="1.5px"
                />
              }
              onClick={discardCollection}
            />
          </>
        ) : (
          <MarkerButton
            id="update"
            label="Update"
            icon={
              <LuSaveAll
                style={{ width: "2.25em", height: "2.25em" }}
                strokeWidth="1.5px"
              />
            }
            onClick={updateCollection}
          />
        )}
      </Card.Footer>
    );
  };

  return (
    <Card.Root
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        transition: "opacity 0.5s",
      }}
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
      <Footer save={saveCollection} />
    </Card.Root>
  );
};

export default MultipleMarkersCard;
