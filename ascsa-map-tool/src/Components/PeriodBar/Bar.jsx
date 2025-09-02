import { VStack, Flex, HStack, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import PeriodButton from "./Button";
import QuickSelectionButtons from "../FilterBar/QuickSelectionButtons";

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

const PeriodBar = ({ setPeriodFilters }) => {
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

  useEffect(() => {
    const appliedPeriods = periodsList
      .filter((p) => p.checked)
      .map((p) => p.filterKey);

    setPeriodFilters({ periods: appliedPeriods });
  }, [periodsList]);

  return (
    <Flex flexDir="column" justifyContent="space-between" gap={3} p="0" >
      <HStack justifyContent="space-between">
        <Heading fontWeight="normal" fontSize="md">
          PERIODS
        </Heading>
        <QuickSelectionButtons
          handleSelectAll={handleSelectAll}
          handleClearAll={handleClearAll}
        />
      </HStack>
      <VStack gapY={{ lg: "10px", md: "5px" }} w="100%" overflow={"scroll"}>
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
      </VStack>
    </Flex>
  );
};

export default PeriodBar;
