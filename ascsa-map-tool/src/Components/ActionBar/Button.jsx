import { IconButton } from "@chakra-ui/react";

const Button = ({ icon, event, isActive, id }) => {
  return (
    <IconButton
      variant="solid"
      rounded="lg"
      bg={isActive ? "#C6C6C6" : "gray.200"}
      color={"black"}
      border={"1px solid #C6C6C6"}
      _hover={{ bg: "#C6C6C6" }}
      id={id}
      p={1}
      w={"fit"}
      h={"fit"}
      onClick={event}
    >
      {icon}
    </IconButton>
  );
};


export default Button;