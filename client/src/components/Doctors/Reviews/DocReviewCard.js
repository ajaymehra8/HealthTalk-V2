import React, { useState } from "react";
import moment from "moment";
import axios from "axios";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FiClock, FiTrash2 } from "react-icons/fi";
import { useAuthState } from "../../../context/AuthProvider";
import { MotionBox } from "../../Admin/adminPageComponent/AdminLayout";

const DocReviewCard = ({ review, setReviews, index = 0 }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const createdAt = review?.createdAt;
  const timeAgo = createdAt ? moment(createdAt).fromNow() : "Unknown";
  const { user } = useAuthState();
  const reviewerName = review?.user?.name || "Unknown patient";
  const reviewerImage = review?.user?.image || "";
  const reviewerEmail = review?.user?.email || "No email provided";
  const ratingValue = Number(review?.rating || 0);

  const handleDelete = async () => {
    const token = user?.jwt;
    if (!token) return;

    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/v1/review/${review._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setReviews((prevReview) =>
          prevReview.filter((item) => item._id !== review._id)
        );
        toast({
          title: data.message,
          status: "success",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
    } catch (error) {
      toast({
        title: error?.response?.data?.message || "Unable to delete review",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionBox
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      width="100%"
      borderRadius="28px"
      overflow="hidden"
      bg="linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,251,253,0.94))"
      boxShadow="0 22px 48px rgba(31, 58, 95, 0.08)"
    >
      <Flex direction={{ base: "column", xl: "row" }} align="stretch">
        <Box
          flexShrink={0}
          w={{ base: "full", xl: "280px" }}
          p={5}
          bg="linear-gradient(180deg, rgba(41, 128, 78, 0.05), rgba(255,255,255,0.22))"
          borderRight={{ base: "none", xl: "1px solid rgba(31, 58, 95, 0.06)" }}
          borderBottom={{ base: "1px solid rgba(31, 58, 95, 0.06)", xl: "none" }}
          boxShadow="inset 0 1px 0 rgba(255,255,255,0.6)"
        >
          <Stack spacing={3} align="center" textAlign="center" h="full">
            <Avatar
              src={reviewerImage}
              name={reviewerName}
              size="2xl"
              bg="var(--auth-soft-accent-bg)"
              color="var(--heading-color)"
              border="5px solid rgba(255,255,255,0.92)"
              boxShadow="0 16px 34px rgba(31, 58, 95, 0.12)"
            />

            <Stack spacing={1} align="center" w="full">
              <Badge
                px={3}
                py={1}
                borderRadius="full"
                bg="rgba(31, 58, 95, 0.05)"
                color="var(--heading-color)"
                border="1px solid rgba(31, 58, 95, 0.08)"
                fontSize="10px"
                textTransform="uppercase"
                letterSpacing="0.16em"
              >
                Patient feedback
              </Badge>
              <Text
                fontSize="lg"
                fontWeight="800"
                color="var(--heading-color)"
                noOfLines={1}
              >
                {reviewerName}
              </Text>
              <Text fontSize="sm" color="var(--regular-color)" noOfLines={2}>
                {reviewerEmail}
              </Text>
            </Stack>

            <HStack
              spacing={2}
              px={3}
              py={2}
              borderRadius="full"
              bg="rgba(31, 58, 95, 0.05)"
              color="var(--heading-color)"
            >
              <Box as={FiClock} fontSize="14px" />
              <Text fontSize="sm" fontWeight="700">
                {timeAgo}
              </Text>
            </HStack>
          </Stack>
        </Box>

        <Box flex="1" p={{ base: 5, md: 6 }}>
          <Flex
            direction={{ base: "column", xl: "row" }}
            align={{ xl: "flex-start" }}
            justify="space-between"
            gap={5}
          >
            <Stack spacing={4} flex="1" minW={0}>
              <Flex
                align={{ base: "flex-start", md: "center" }}
                justify="space-between"
                gap={3}
                direction={{ base: "column", md: "row" }}
              >
                <Stack spacing={1} minW={0}>
                  <Badge
                    alignSelf="flex-start"
                    px={3}
                    py={1}
                    borderRadius="full"
                    bg="rgba(31, 58, 95, 0.05)"
                    color="var(--heading-color)"
                    border="1px solid rgba(31, 58, 95, 0.08)"
                    fontSize="10px"
                    textTransform="uppercase"
                    letterSpacing="0.16em"
                  >
                    Review details
                  </Badge>
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="800"
                    color="var(--heading-color)"
                    letterSpacing="-0.03em"
                  >
                    Added {timeAgo}
                  </Text>
                  <Text fontSize="sm" color="var(--regular-color)">
                    Patient feedback appears here in a polished, easy-to-scan card.
                  </Text>
                </Stack>

                <Badge
                  alignSelf="flex-start"
                  px={3}
                  py={1.5}
                  borderRadius="full"
                  bg="rgba(41, 128, 78, 0.1)"
                  color="var(--primary-green-color)"
                  border="1px solid rgba(41, 128, 78, 0.14)"
                  fontSize="10px"
                  textTransform="uppercase"
                  letterSpacing="0.18em"
                  fontWeight="800"
                >
                  {ratingValue ? `${ratingValue.toFixed(1)} / 5` : "No rating"}
                </Badge>
              </Flex>

              <Box
                p={4}
                borderRadius="20px"
                bg="rgba(31, 58, 95, 0.03)"
                border="1px solid rgba(31, 58, 95, 0.05)"
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  left={0}
                  top={0}
                  bottom={0}
                  w="4px"
                  bgGradient="linear(180deg, var(--primary-green-color), var(--secondary-green-color))"
                  opacity={0.9}
                />
                <Text
                  fontSize="sm"
                  fontWeight="800"
                  color="var(--secondary-gray-color)"
                  textTransform="uppercase"
                  letterSpacing="0.16em"
                  mb={2}
                  pl={3}
                >
                  Review
                </Text>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.75"
                  color="var(--heading-color)"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                  pl={3}
                >
                  {review?.text || "No review text available."}
                </Text>
              </Box>

              <Flex align="center" justify="space-between" gap={3} wrap="wrap">
                <Text fontSize="xs" color="var(--secondary-gray-color)">
                  {ratingValue ? `${ratingValue.toFixed(1)} / 5` : "No rating"}
                </Text>
              </Flex>
            </Stack>

            <Stack
              spacing={3}
              minW={{ base: "full", xl: "220px" }}
              align={{ base: "stretch", xl: "flex-end" }}
            >
              <Button
                onClick={() => {
                  if (!loading) {
                    handleDelete();
                  }
                }}
                isLoading={loading}
                loadingText="Deleting..."
                isDisabled={loading}
                h="48px"
                px={5}
                borderRadius="16px"
                border="1px solid rgba(239, 68, 68, 0.18)"
                bg="rgba(239, 68, 68, 0.08)"
                color="rgb(185, 28, 28)"
                fontSize="14px"
                fontWeight="800"
                leftIcon={<FiTrash2 />}
                _hover={{
                  bg: "rgba(239, 68, 68, 0.12)",
                  transform: "translateY(-1px)",
                }}
              >
                Delete review
              </Button>
            </Stack>
          </Flex>
        </Box>
      </Flex>
    </MotionBox>
  );
};

export default DocReviewCard;
