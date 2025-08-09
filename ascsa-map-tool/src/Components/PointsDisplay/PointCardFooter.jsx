import {
  Flex,
  Button,
  Text,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { LuExpand, LuSave, LuStickyNote, LuGlobe } from "react-icons/lu";

const PointButton = ({ id, label, icon }) => {
  return (
    <Button
      flexGrow={1}
      key={id}
      variant="plain"
      _hover={{ bg: "gray.950" }}
      color="white"
      flexDir="column"
      py={3}
      w="1"
      h="fit"
      _target={"blank"}
    >
      {icon}

      <Text textStyle="lg">{label}</Text>

    </Button>
  );
};

const PointCardFooter = ({ source }) => {
  const customStyle = { width: "2.25em", height: "2.25em" };

  return (
    <Flex w="100%">
      <PointButton
        id="expand-action"
        label="Expand"
        icon={<LuExpand style={customStyle} strokeWidth="1.5px" />}
      />

      <PointButton
        id="save-action"
        label="Save"
        icon={<LuSave style={customStyle} strokeWidth="1.5px" />}
      />

      <PointButton
        id="note-action"
        label="Note"
        icon={<LuStickyNote style={customStyle} strokeWidth="1.5px" />}
      />

      <PointButton
        id="source-action"
        label="Source"
        icon={
          <LinkBox >
            <LinkOverlay href={source}>
            <LuGlobe style={customStyle} strokeWidth="1.5px" />
            </LinkOverlay>
          </LinkBox>
        }
      />
    </Flex>
  );
};

export default PointCardFooter;
