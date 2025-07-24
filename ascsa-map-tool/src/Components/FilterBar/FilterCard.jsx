import { Box, Tabs, Text, VStack, Bleed, Separator } from "@chakra-ui/react";
import { LuFolder, LuSquareCheck, LuUser } from "react-icons/lu";
import { useState } from "react";
import PeriodBar from "../PeriodBar/Bar";

const FilterCard = () => {
  const [value, setValue] = useState("artifacts");

  return (
    <VStack
      w="20vw"
      h="90vh"
      pos="absolute"
      bg="white"
      p="30px 22px"
      m="12px"
      rounded="10px"
      border="1px solid #C6C6C6"
    >
      <Box w="100%" h="100%">
        <Text fontSize="3xl" fontWeight="bold">
          Filters
        </Text>

        <Tabs.Root
          defaultValue="artifacts"
          fitted
          variant="plain"
          mt="15px"
          value={value}
          onValueChange={(e) => setValue(e.value)}
        >
          <Tabs.List bg="white" p={1} gap={2}>
            <Tabs.Trigger
              value="artifacts"
              bg={value == "artifacts" ? "#C6C6C6" : "white"}
              border="1px solid #c6c6c6"
            >
              {/* <LuUser /> */}
              Artifacts
            </Tabs.Trigger>
            <Tabs.Trigger
              value="periods"
              bg={value == "periods" ? "#C6C6C6" : "white"}
              border="1px solid #c6c6c6"
            >
              {/* <LuFolder /> */}
              Periods
            </Tabs.Trigger>
            <Tabs.Indicator rounded="l2" />
          </Tabs.List>

          <Separator orientation="horizontal" mt="15px" />

          <Tabs.Content value="artifacts">
            Artifacts Filter
          </Tabs.Content>
          <Tabs.Content value="periods">
            <Bleed>
              <PeriodBar />
            </Bleed>
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </VStack>
  );
};

export default FilterCard;
