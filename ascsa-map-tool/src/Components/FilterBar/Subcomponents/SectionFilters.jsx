import {
  Field,
  Group,
  Input,
  NumberInput,
  Stack,
  Text,
} from "@chakra-ui/react";

const Section = ({ sectionObj, setSectionObj }) => {
  function concatSectionNumber(letter, number) {
    return `${letter} ${number || ""}`.trim();
  }

  return (
    <Stack gap={5} mb={5} mt={1} flexDir={{smToXl:"column", "2xl":"row"}} justifyContent="space-between">
      <Field.Root orientation="horizontal">
        <Field.Label fontSize="md">
          <Text w="50px">Section</Text>
        </Field.Label>
      </Field.Root>
      <Group gap={1}>
        <Input
          size="lg"
          w="10vw"
          border="1px solid"
          borderColor="gray.300"
          placeholder="Letter(s)"
          value={sectionObj.SectionNumberLetter}
          onChange={(e) =>
            setSectionObj((s) => ({
              ...s,
              SectionNumberLetter: e.target.value,
              SectionNumber: concatSectionNumber(
                e.target.value,
                s.SectionNumberNumber
              ),
            }))
          }
        />

        <NumberInput.Root
          size="lg"
          w="fit"
          min={0}
          value={sectionObj.SectionNumberNumber}
          onValueChange={(e) =>
            setSectionObj((s) => ({
              ...s,
              SectionNumberNumber: e.value,
              SectionNumber: concatSectionNumber(
                s.SectionNumberLetter,
                e.valueAsNumber
              ),
            }))
          }
        >
          <NumberInput.Control />
          <NumberInput.Input
            placeholder="Number"
            border="1px solid"
            borderColor="gray.300"
          />
        </NumberInput.Root>
      </Group>
    </Stack>
  );
};

export default Section;
