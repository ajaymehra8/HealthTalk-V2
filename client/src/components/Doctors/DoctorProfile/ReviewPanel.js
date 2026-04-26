import {
  Badge,
  Box,
  Button,
  Flex,
  Text,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import ReviewCard from "../../Reviews/ReviewCard";
import { useAuthState } from "../../../context/AuthProvider";

const ReviewPanel = ({ doctor }) => {
  const navigate = useNavigate();
  const { user } = useAuthState();
  const toast = useToast();
  return (
    <Box
      w="100%"
      minW="280px"
      display="flex"
      alignItems="start"
      justifyContent="center"
      flexDir="column"
      borderRadius="24px"
      bg="linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,251,253,0.92))"
      border="1px solid rgba(31, 58, 95, 0.08)"
      boxShadow="0 18px 38px rgba(31, 58, 95, 0.08)"
      p={4}
    >
      <Flex
        w="full"
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        gap={4}
        mb={4}
        direction={{ base: "column", md: "row" }}
      >
        <Box>
          <Badge
            px={3}
            py={1}
            borderRadius="full"
            bg="var(--auth-soft-accent-bg)"
            color="var(--primary-green-color)"
            border="1px solid var(--auth-soft-accent-border)"
            letterSpacing="0.18em"
            textTransform="uppercase"
            fontSize="10px"
            fontWeight="800"
          >
            Patient reviews
          </Badge>
          <Text
            mt={2}
            fontSize={{ base: "lg", md: "xl" }}
            fontWeight="800"
            color="var(--heading-color)"
          >
            What patients are saying
          </Text>
        </Box>

        <Text fontSize="sm" color="var(--regular-color)">
          Submit your own feedback after a visit.
        </Text>
      </Flex>

      <Box
        width="100%"
        minW="280px"
        mb={4}
        pr={2}
        display="flex"
        flexDir="column"
        gap={3}
        overflowY="auto"
        maxH={{ base: "280px", lg: "320px" }}
      >
        {doctor?.reviews?.length > 0 ? (
          doctor?.reviews?.map((review) => (
            <ReviewCard key={review?._id} review={review} />
          ))
        ) : (
          <Text className="no-item-text">No Reviews</Text>
        )}
      </Box>

      <Flex
        gap={3}
        w="full"
        align={{ base: "stretch", md: "center" }}
        justify="space-between"
        direction={{ base: "column", md: "row" }}
        pt={2}
      >
        <Text fontSize="sm" color="var(--regular-color)">
          Submit a review for Dr. {doctor?.name}.
        </Text>
        <Button
          onClick={() => {
            if (user?.role !== "user") {
              return toast({
                title: "You are not allowed to do this action.",
                status: "error",
                isClosable: true,
                duration: 5000,
                position: "top",
              });
            }
            if (!user) {
              return toast({
                title: "You are not logged in",
                status: "error",
                isClosable: true,
                duration: 5000,
                position: "top",
              });
            }
            navigate("/doctor/review", { state: { user: doctor } });
          }}
          h="44px"
          minW={{ base: "full", md: "140px" }}
          borderRadius="14px"
          border="none"
          bg="linear-gradient(135deg, var(--primary-green-color), var(--auth-panel-end))"
          color="white"
          fontSize="14px"
          fontWeight="800"
          boxShadow="0 16px 30px rgba(41, 128, 78, 0.2)"
          _hover={{
            bg: "linear-gradient(135deg, var(--secondary-green-color), var(--primary-green-color))",
          }}
        >
          Review
        </Button>
      </Flex>
    </Box>
  );
};

export default ReviewPanel;
