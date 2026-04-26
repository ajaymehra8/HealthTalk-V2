import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthState } from "../../../context/AuthProvider";
import {
  Badge,
  Box,
  Flex,
  Grid,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import ReviewCard from "./ReviewCard";

const MotionBox = motion(Box);

const Reviews = () => {
  const { user } = useAuthState();
  const [reviews, setReviews] = useState([]);
  const token = user?.jwt;
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/review`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (data.success) {
      setReviews(data?.reviews);
    }
    setLoading(false);
  }, [ token]);
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const latestReview = useMemo(() => {
    if (!reviews.length) return "";

    return [...reviews]
      .sort(
        (a, b) =>
          new Date(b?.createdAt || 0).getTime() -
          new Date(a?.createdAt || 0).getTime()
      )[0];
  }, [reviews]);

  return (
    <Box w="full" maxW="1180px" mx="auto">
      <MotionBox
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        mb={5}
        p={{ base: 5, md: 6 }}
        borderRadius="28px"
        bg="linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,251,253,0.92))"
        border="1px solid rgba(31, 58, 95, 0.08)"
        boxShadow="0 24px 54px rgba(31, 58, 95, 0.08)"
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ md: "center" }}
          justify="space-between"
          gap={4}
        >
          <Stack spacing={2} maxW="2xl">
            <Badge
              alignSelf="flex-start"
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
              Review hub
            </Badge>
            <Text
              as="h1"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="800"
              color="var(--heading-color)"
              letterSpacing="-0.03em"
            >
              Your Reviews
            </Text>
            <Text fontSize="sm" color="var(--regular-color)" lineHeight="1.6">
              View and remove feedback you have shared with doctors.
            </Text>
          </Stack>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }}
            gap={3}
            w={{ base: "full", md: "auto" }}
          >
            <Box
              minW={{ md: "180px" }}
              p={4}
              borderRadius="20px"
              bg="rgba(31, 58, 95, 0.04)"
              border="1px solid rgba(31, 58, 95, 0.08)"
            >
              <Text fontSize="xs" textTransform="uppercase" letterSpacing="0.16em" color="var(--secondary-gray-color)" fontWeight="800">
                Total
              </Text>
              <Text mt={2} fontSize="2xl" fontWeight="800" color="var(--heading-color)">
                {reviews.length}
              </Text>
            </Box>

            <Box
              minW={{ md: "210px" }}
              p={4}
              borderRadius="22px"
              bg="linear-gradient(180deg, rgba(41, 128, 78, 0.08), rgba(55, 189, 115, 0.05))"
              border="1px solid rgba(41, 128, 78, 0.12)"
              boxShadow="inset 0 1px 0 rgba(255,255,255,0.6)"
            >
              <Flex align="center" gap={3}>
                <Box
                  flexShrink={0}
                  w="42px"
                  h="42px"
                  borderRadius="full"
                  bg="rgba(41, 128, 78, 0.12)"
                  color="var(--primary-green-color)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box as="i" className="bi bi-clock-history" fontSize="18px" />
                </Box>
                <Box minW={0}>
                  <Text
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="0.16em"
                    color="var(--secondary-gray-color)"
                    fontWeight="800"
                  >
                    Last review added at
                  </Text>
                  <Text
                    mt={1}
                    fontSize="sm"
                    fontWeight="800"
                    color="var(--heading-color)"
                    noOfLines={1}
                  >
                    {latestReview
                      ? moment(latestReview?.createdAt).fromNow()
                      : "No activity"}
                  </Text>
                  <Text fontSize="xs" color="var(--regular-color)" mt={1}>
                    {latestReview
                      ? moment(latestReview?.createdAt).format("MMM D, YYYY")
                      : "Nothing to show yet"}
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Grid>
        </Flex>
      </MotionBox>

      <MotionBox
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
        p={{ base: 4, md: 5 }}
        borderRadius="28px"
        bg="rgba(255,255,255,0.84)"
        border="1px solid rgba(255,255,255,0.72)"
        boxShadow="0 24px 54px rgba(31, 58, 95, 0.08)"
        backdropFilter="blur(18px)"
        minH={{ base: "auto", md: "68vh" }}
      >
        {!loading ? (
          reviews.length > 0 ? (
            <Stack spacing={4}>
              <AnimatePresence initial={false}>
                {reviews.map((review, index) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    setReviews={setReviews}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </Stack>
          ) : (
            <MotionBox
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              minH={{ base: "52vh", md: "60vh" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              px={4}
            >
              <Stack spacing={3} maxW="sm" align="center">
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
                  No reviews yet
                </Badge>
                <Text
                  fontSize="xl"
                  fontWeight="800"
                  color="var(--heading-color)"
                  letterSpacing="-0.03em"
                >
                  Your review list is empty
                </Text>
                <Text fontSize="sm" color="var(--regular-color)" lineHeight="1.65">
                  When you leave feedback for a doctor, it will appear here and you can remove it anytime.
                </Text>
              </Stack>
            </MotionBox>
          )
        ) : (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            minH={{ base: "52vh", md: "60vh" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Stack spacing={3} align="center">
              <Spinner
                size="xl"
                thickness="4px"
                color="var(--primary-green-color)"
              />
              <Text fontSize="sm" color="var(--regular-color)">
                Loading reviews...
              </Text>
            </Stack>
          </MotionBox>
        )}
      </MotionBox>
    </Box>
  );
};

export default Reviews;
