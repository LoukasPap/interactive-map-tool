import {
  VStack,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuSquareCheck, LuSquareMinus } from "react-icons/lu";

import PeriodButton from "./Button";

const initialPeriodsList = [
  {
    title: "Prehistoric",
    value: "pr",
    filterKey: "Prehistoric",
    date: "10,000 BC - 1,100 BC",
    color: "gray.500",
    checked: false,
  },
  {
    title: "Greek",
    value: "gr",
filterKey: "Greek",
    date: "900 BC - 30 BC",
    color: "blue.500",
    checked: false,
  },
  {
    title: "Roman Empire",
    value: "ro",
filterKey: "Roman",
    date: "753 BCE - 1453 CE",
    color: "red.500",
    checked: false,
  },
  {
    title: "Byzantine",
    value: "by",
filterKey: "Byzantine",
    date: "330 CE - 1453 CE",
    color: "orange.500",
    checked: false,
  },
  {
    title: "Medieval",
    value: "me",
    filterKey: "Medieval",
    date: "500 CE - 1500 CE",
    color: "green.500",
    checked: false,
  },
  {
    title: "Turkish",
    value: "tu",
    filterKey: "Turkish",
    date: "1071 CE - 1922 CE",
    color: "yellow.500",
    checked: false,
  },
{
    title: "Modern",
    value: "mo",
    filterKey: "Modern",
    date: "1500 CE - Present",
    color: "pink.500",
    checked: false,
  },
  {
    title: "Unknown",
    value: "un",
    filterKey: "Unknown",
    date: "-",
    color: "gray.950",
    checked: false,
  },
];

const PeriodBar = () => {
  const [periodsList, setPeriodsList] = useState(initialPeriodsList);

  const handleSelectAll = () => {
    setPeriodsList(
      periodsList.map((period) => ({
        ...period,
        checked: true,
      }))
    );
  };

  const handleClearAll = () => {
    setPeriodsList(
      periodsList.map((period) => ({
        ...period,
        checked: false,
      }))
    );
  };

  // Toggle a single period
  const handleTogglePeriod = (value) => {
    setPeriodsList(
      periodsList.map((period) =>
        period.value === value
          ? { ...period, checked: !period.checked }
          : period
      )
    );
  };

  return (
    <>
      <VStack gapY="15px">
        {periodsList.map((period) => (
          <PeriodButton
            key={period.value}
            title={period.title}
            date={period.date}
            color={period.color}
            checked={period.checked}
            onClick={() => handleTogglePeriod(period.value)}
          />
        ))}

        <HStack justifyContent="space-around" w="100%">
          <IconButton
            flexGrow={1}
            size="2xl"
            variant="plain"
            onClick={handleSelectAll}
            _hover={{bg:"gray.300"}}
            p={2}
          >
            <LuSquareCheck />
            Select all
          </IconButton>

          <IconButton
            flexGrow={1}
            size="2xl"
            variant="plain"
            onClick={handleClearAll}
            _hover={{bg:"gray.300"}}
            p={2}
          >
            <LuSquareMinus size={"xl"} /> Clear
          </IconButton>
        </HStack>
      </VStack>
    </>
  );
};

export default PeriodBar;
