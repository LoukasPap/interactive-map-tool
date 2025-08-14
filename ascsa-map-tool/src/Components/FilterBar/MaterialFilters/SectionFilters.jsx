import {
  Field,
  Input,
  NumberInput,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Section = ({ setSectionObj }) => {
  const [section, setSection] = useState({
    SectionNumberLetter: "",
    SectionNumberNumber: 0,
    SectionNumber: "",
  });

  useEffect(() => {
    setSectionObj(section);
  }, [section]);

  function concatSectionNumber(letter, number) {
    return `${letter} ${number}`.trim();
  }

  return (
    <Stack gap="5" maxW="sm" mb="5">
      <Field.Root orientation="horizontal">
        <Field.Label fontSize="md">
          <Text w="100px">Section Letter</Text>
        </Field.Label>
        <Input
          placeholder="Enter Letter"
          flex="1"
          value={section.SectionLetter}
          onChange={(e) =>
            setSection((s) => ({
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
          flex="1"
          min={0}
          value={section.sectionNumber}
          onValueChange={(e) =>
            setSection((s) => ({
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
          <NumberInput.Input />
        </NumberInput.Root>
      </Field.Root>
    </Stack>
  );
};

export default Section;
