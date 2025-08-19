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

const Monument = ({ setMonumentObj }) => {
  const [monuments, setMonuments] = useState({
    ShowMonuments: "",
    Condition: [],
  });

  useEffect(() => {
    setMonumentObj(monuments);
  }, [monuments]);

  const conditons = createListCollection({
    items: [
      { label: "Excellent", value: "Excellent" },
      { label: "Good", value: "Good" },
      { label: "Fair", value: "Fair" },
      { label: "Poor", value: "Poor" },
      { label: "Very Poor", value: "Very Poor" },
      { label: "Known", value: "Known" },
      { label: "Reburied", value: "Reburied" },
      { label: "Mixed", value: "Mixed" },
    ],
  });

  return (
    <Stack gap="5" maxW="sm" mb="5">
      <Field.Root orientation="horizontal">
        <Field.Label fontSize="md">
          <Text w="100px">Show Monuments</Text>
        </Field.Label>
        <SegmentGroup.Root
          defaultValue="Yes"
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
        <Select.Root multiple collection={conditons} size="lg" width="100%">
          <Select.HiddenSelect />
          <Select.Control>
            <Select.Trigger border="1px solid" borderColor="gray.300">
              <Select.ValueText placeholder="Select condition" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup >
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
