import { IconButton } from "@chakra-ui/react";

const Button = ({ icon, event, isActive, id }) => {
  return (
    <IconButton
      variant="solid"
      rounded="md"
      bg={isActive ? "#161616" : "#EEEEEE"}
      color={isActive ? "white" : "black"}
      border={"1px solid #C6C6C6"}
      _hover={isActive ? { bg: "#161616" } : { bg: "#C6C6C6" }}
      id={id}
      p={2.5}
      w={"fit"}
      h={"fit"}
      onClick={event}
    >
      {icon}
    </IconButton>
  );
};


export default Button;