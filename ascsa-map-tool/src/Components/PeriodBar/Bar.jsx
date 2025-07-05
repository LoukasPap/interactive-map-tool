import {
  ActionBar,
  Button,
  createListCollection,
  Portal,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuShare, LuTrash2 } from "react-icons/lu";

import PeriodButton from "./Button";

const PeriodBar = ({ isOpen }) => {
  const [checked, setChecked] = useState(true);
  const [marginBottom, setMarginBottom] = useState(0);

  const togglePeriodBar = () => {
    // setMarginBottom((a) => -a + 40);
    setChecked((ch) => !ch);
    setMarginBottom(checked ? 0 : -20);
    isOpen(checked);
  };

  const PeriodsCollection = createListCollection({
    items: [
      {
        title: "Ancient Greece",
        date: "800 - 146 BC",
        color: "blue.500",
      },
      {
        title: "Roman Empire",
        date: "27 BC - AD 476",
        color: "red.500",
      },
      {
        title: "Byzantine Empire",
        date: "AD 330 - 1453",
        color: "orange.500",
      },
      {
        title: "Franks",
        date: "800 - 146 BC",
        color: "green.500",
      },
      {
        title: "Ottoman Empire",
        date: "AD 1299 - 1922",
        color: "yellow.500",
      },
    ],
  });

  return (
    <>
      <ActionBar.Root open={true}>
        <Portal>
          <ActionBar.Positioner mb={marginBottom} transition="all 1s">
            <ActionBar.Content
              border="1px solid"
              borderColor="gray.300"
              rounded="2xl"
              boxShadow="0px 2px 4px 0px rgba(0, 0, 0, 0.25)"
            >
              {PeriodsCollection.items.map((period) => (
                <PeriodButton
                  title={period.title}
                  date={period.date}
                  color={period.color}
                />
              ))}

              <ActionBar.Separator />

              <Button
                variant="outline"
                bg="red.300"
                size="sm"
                onClick={togglePeriodBar}
              >
                <LuShare />
                Share
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </>
  );
};

export default PeriodBar;
