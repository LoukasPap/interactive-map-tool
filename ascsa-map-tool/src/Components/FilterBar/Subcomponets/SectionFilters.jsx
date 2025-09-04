import {
  Field,
  Input,
  NumberInput,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";

const Section = ({ sectionObj, setSectionObj }) => {
  function concatSectionNumber(letter, number) {
    return `${letter} ${number}`.trim();
  }

  return (
    <Stack gap="5" maxW="sm" mb={5} mt={1}>
      <Field.Root orientation="horizontal">
        <Field.Label fontSize="md">
          <Text w="100px">Section Letter</Text>
        </Field.Label>
        <Input
          size="lg"
          border="1px solid"
          borderColor="gray.300"
          placeholder="Enter Letter"
          flex="1"
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
      </Field.Root>

      <Field.Root orientation="horizontal">
        <Field.Label fontSize="md">
          <Text w="100px">Section Number</Text>
        </Field.Label>
        <NumberInput.Root
          size="lg"
          flex="1"
          min={0}
          value={sectionObj.SectionNumberNumber}
          onValueChange={(e) =>
            setSectionObj((s) => ({
              ...s,
              SectionNumberNumber: e.value,
              SectionNumber: concatSectionNumber(
                s.SectionNumberLetter,
                e.value
              ),
            }))
          }
        >
          <NumberInput.Control />
          <NumberInput.Input border="1px solid" borderColor="gray.300" />
        </NumberInput.Root>
      </Field.Root>
    </Stack>
  );
};

export default Section;
