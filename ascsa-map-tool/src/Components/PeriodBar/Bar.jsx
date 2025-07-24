import {
  ActionBar,
  Button,
  createListCollection,
  Checkbox,
  VStack,
  Show,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuSquareCheck, LuSquareMinus } from "react-icons/lu";

import PeriodButton from "./Button";

import Ripples from "react-ripples";

const initialPeriodsList = [
  {
    title: "Ancient Greece",
    value: "gr",
    date: "800 - 146 BC",
    color: "blue.500",
    checked: false,
  },
  {
    title: "Roman Empire",
    value: "ro",
    date: "27 BC - AD 476",
    color: "red.500",
    checked: false,
  },
  {
    title: "Byzantine Empire",
    value: "by",
    date: "AD 330 - 1453",
    color: "orange.500",
    checked: false,
  },
  {
    title: "Franks",
    value: "fr",
    date: "800 - 146 BC",
    color: "green.500",
    checked: false,
  },
  {
    title: "Ottoman Empire",
    value: "ot",
    date: "AD 1299 - 1922",
    color: "yellow.500",
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
