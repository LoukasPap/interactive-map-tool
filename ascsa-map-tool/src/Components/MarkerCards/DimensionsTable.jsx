import { Code, For, Table, Text } from "@chakra-ui/react";

const DimensionsTable = ({ dimensions }) => {
  if (!dimensions || dimensions.length === 0) {
    return <Text color="gray.500">No dimensions available</Text>;
  }

  return (
    <Table.ScrollArea
      rounded="sm"
      maxW="xl"
      maxH="150px"
      pr="0.8em"
      overflow="auto"
      scrollbarColor="black transparent"
      scrollbarWidth="thin"
    >
      <Table.Root
        stripped
        native
        showColumnBorder
        size="md"
        variant="outline"
        colorPalette="gray"
      >
        <Table.Header>
          <Table.Row bg="gray.300">
            {/* <Table.ColumnHeader>Abbreviation</Table.ColumnHeader> */}
            <Table.ColumnHeader>Dimension</Table.ColumnHeader>
            <Table.ColumnHeader>Value</Table.ColumnHeader>
            <Table.ColumnHeader>Note</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <For
            each={dimensions}
            fallback={<Text>No dimensions available</Text>}
          >
            {(d, index) => (
              <Table.Row key={index} _hover={{ bg: "gray.200" }}>
                {/* <Table.Cell>{d.abbr}</Table.Cell> */}
                <Table.Cell>{d.name} ({d.abbr})</Table.Cell>
                <Table.Cell>{d.value}</Table.Cell>
                <Table.Cell>{d.note || "-"}</Table.Cell>
              </Table.Row>
            )}
          </For>
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

export default DimensionsTable;
