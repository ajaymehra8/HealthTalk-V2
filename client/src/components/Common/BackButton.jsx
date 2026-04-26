import React from "react";
import { Button } from "@chakra-ui/react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const BackButton = ({
  label = "Go back",
  fallbackTo = "/",
  to,
  onClick,
  ...buttonProps
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick();
      return;
    }

    if (to) {
      navigate(to);
      return;
    }

    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate(fallbackTo);
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      leftIcon={<FiArrowLeft />}
      h="42px"
      px={4}
      borderRadius="14px"
      width={'fit-content'}
      border="1px solid rgba(31,58,95,0.12)"
      bg="rgba(255,255,255,0.82)"
      color="var(--heading-color)"
      fontSize="sm"
      fontWeight="800"
      boxShadow="0 12px 24px rgba(31,58,95,0.06)"
      _hover={{
        bg: "rgba(255,255,255,0.96)",
        transform: "translateX(-2px)",
      }}
      transition="all 0.2s ease"
      {...buttonProps}
    >
      {label}
    </Button>
  );
};

export default BackButton;
