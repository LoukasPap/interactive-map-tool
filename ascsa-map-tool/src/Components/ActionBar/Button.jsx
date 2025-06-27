import { IconButton } from "@chakra-ui/react";

const Button = ({ icon, event, isActive, id }) => {
  return (
    <IconButton
      variant="solid"
      rounded="md"
      bg={isActive ? "gray.950" : "white"}
      color={isActive ? "white" : "gray.900"}
      border="2px solid #d4d4d8"
      _hover={isActive ? { bg: "#161616" } : { bg: "gray.300" }}
      id={id}
      p="2.5"
      w="fit"
      h="fit"
      onClick={event}
  
    >
      {icon}
    </IconButton>
  );
};

export default Button;
