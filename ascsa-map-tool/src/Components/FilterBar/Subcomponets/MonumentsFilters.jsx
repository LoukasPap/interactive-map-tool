import {
  SegmentGroup,
  Stack,
  Field,
  Text,
  Portal,
  Select,
  createListCollection,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const conditons = createListCollection({
  items: [
    { label: "Excellent", value: "Excellent" },
    { label: "Good", value: "Good" },
    { label: "Fair", value: "Fair" },
    { label: "Fully", value: "Fully" },
    { label: "Poor", value: "Poor" },
    { label: "Reburied", value: "Reburied" },
    // We skip Known and Mixed conditions because the monuments in these conditions
    // do not have coordinates to be drawn on map (i.e. WGS84Centroid)
  ],
});

const initialFilterState = {
  ShowMonuments: "Yes",
  Condition: [],
};

const Monument = ({ setMonumentObj }) => {
  const [monuments, setMonuments] = useState(initialFilterState);

  useEffect(() => {
    setMonumentObj(monuments);
  }, [monuments]);

  return (
    <Stack gap="5" maxW="sm" mb="5">
      <Field.Root orientation="horizontal">
        <Field.Label fontSize="md">
          <Text w="100px">Show Monuments</Text>
        </Field.Label>
        <SegmentGroup.Root
          value={monuments.ShowMonuments}
          onValueChange={(e) => {
            setMonuments((m) => ({
              ...m,
              ShowMonuments: e.value,
            }));      
          }}
          size="lg"
          flex="1"
          border="1px solid"
          borderColor="gray.300"
        >
          <SegmentGroup.Indicator bg="gray.300"/>
          <SegmentGroup.Items w="100%" items={["Yes", "No", "Only"]} />
        </SegmentGroup.Root>
      </Field.Root>

      <Field.Root orientation="horizontal">
        <Field.Label fontSize="md">
          <Text w="100px">Condition</Text>
        </Field.Label>
        <Select.Root
          value={monuments.Condition}
          onValueChange={(e) => {
            setMonuments((m) => ({
              ...m,
              Condition: e.value,
            }));
          }}
          multiple
          collection={conditons}
          size="lg"
        >
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger border="1px solid" borderColor="gray.300">
              <Select.ValueText placeholder="Select condition" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                {conditons.items.map((condition) => (
                  <Select.Item item={condition} key={condition.value}>
                    {condition.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </Field.Root>
    </Stack>
  );
};

export default Monument;
