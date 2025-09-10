import {
  Button,
  Text,
  LinkBox,
  LinkOverlay,
  Clipboard,
  Card,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  LuExpand,
  LuSave,
  LuGlobe,
  LuMapPinCheckInside,
  LuMapPin,
} from "react-icons/lu";

export const PointButton = ({ id, label, icon, onClick = null }) => {
  return (
    <Button
      flexGrow={1}
      key={id}
      variant="plain"
      rounded="xl"
      _hover={{ bg: "gray.950" }}
      color="white"
      flexDir="column"
      w="1"
      h="75px"
      onClick={onClick}
      _target={"blank"}
    >
      {icon}

      <Text textStyle="lg">{label}</Text>
    </Button>
  );
};

const PointCardFooter = ({ source, coords = "-" }) => {
  const customStyle = { width: "2.25em", height: "2.25em" };

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card.Footer
      w="100%"
      roundedBottom="xl"
      backgroundClip="content-box"
      justifyContent="center"
      flexDir="row"
      bg="black"
      p={0}
    >
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
        id="coords-action"
        label="Location"
        icon={
          <Clipboard.Root value={coords} onStatusChange={handleCopy}>
            <Clipboard.Trigger asChild>
              {copied ? (
                <LuMapPinCheckInside style={customStyle} strokeWidth="1.5px" />
              ) : (
                <LuMapPin style={customStyle} strokeWidth="1.5px" />
              )}
            </Clipboard.Trigger>
          </Clipboard.Root>
        }
        onClick={handleCopy}
      />

      <PointButton
        id="source-action"
        label="Source"
        icon={
          <LinkBox>
            <LinkOverlay href={source}>
              <LuGlobe style={customStyle} strokeWidth="1.5px" />
            </LinkOverlay>
          </LinkBox>
        }
      />
    </Card.Footer>
  );
};

export default PointCardFooter;
