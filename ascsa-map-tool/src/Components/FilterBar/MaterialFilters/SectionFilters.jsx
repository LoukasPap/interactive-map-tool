import {
  Field,
  Input,
  NumberInput,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Section = ({setSection}) => {
  const [sectionLetter, setSectionLetter] = useState('');
  const [sectionNumber, setSectionNumber] = useState("0");

  useEffect(() => {
    setSection(`${sectionLetter.trim()} ${sectionNumber.trim()}`);
  }, [sectionNumber, sectionLetter]);

  return (
    <Stack gap="5" maxW="sm" mb="5">
      <Field.Root orientation="horizontal">
        <Field.Label fontSize="md">
          <Text w="100px">Section Letter</Text>
        </Field.Label>
        <Input
          placeholder="Enter Letter"
          flex="1"
          value={sectionLetter}
          onChange={(e) => setSectionLetter(e.target.value)}
        />
      </Field.Root>

      <Field.Root orientation="horizontal">
        <Field.Label fontSize="md">
          <Text w="100px">Section Number</Text>
        </Field.Label>
        <NumberInput.Root
          flex="1"
          min={0}
          value={sectionNumber}
          onValueChange={(e) => setSectionNumber(e.value)}
        >
          <NumberInput.Control />
          <NumberInput.Input />
        </NumberInput.Root>
      </Field.Root>
    </Stack>
  );
};

export default Section;
