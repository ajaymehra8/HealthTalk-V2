import React, { useState } from "react";
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
import moment from "moment";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useAuthState } from "../../../context/AuthProvider";

const MotionBox = motion(Box);

const ReviewCard = ({ review, setReviews, index = 0 }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const createdAt = review?.createdAt;
  const timeAgo = createdAt ? moment(createdAt).fromNow() : "Unknown";
  const [loading, setLoading] = useState(false);

  const { user } = useAuthState();
  const doctor = review?.doctor;
  const doctorName = doctor?.name || "Unknown doctor";
  const doctorImage = doctor?.image || "";
  const doctorSpecialization = doctor?.specialization || "Doctor";
  const ratingValue = Number(review?.rating || 0);

  const openDoctorProfile = () => {
    if (!doctor?._id) return;
    navigate(`/doctor-profile/${doctor._id}`);
  };

  const handleDelete = async () => {
    const token = user?.jwt;
    if (!token) return;
    setLoading(true);
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
        prevReview.filter((r) => r._id !== review._id)
      );
      toast({
        title: data.message,
        status: "success",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    }
    setLoading(false);
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
      <Flex direction={{ base: "column", lg: "row" }} align="stretch">
        <MotionBox
          as="button"
          type="button"
          flexShrink={0}
          w={{ base: "full", lg: "280px" }}
          p={5}
          bg="linear-gradient(180deg, rgba(41, 128, 78, 0.05), rgba(255,255,255,0.22))"
          boxShadow="inset 0 1px 0 rgba(255,255,255,0.65)"
          cursor="pointer"
          textAlign="left"
          onClick={openDoctorProfile}
          whileHover={{ scale: 1.01, x: 2 }}
          whileTap={{ scale: 0.99 }}
          transition={{ duration: 0.2 }}
        >
          <Stack spacing={3} align="center" textAlign="center">
            <Avatar
              src={doctorImage}
              name={doctorName}
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
                bg="var(--auth-soft-accent-bg)"
                color="var(--primary-green-color)"
                border="1px solid var(--auth-soft-accent-border)"
                fontSize="10px"
                textTransform="uppercase"
                letterSpacing="0.16em"
              >
                Doctor
              </Badge>
              <Text
                fontSize="lg"
                fontWeight="800"
                color="var(--heading-color)"
                noOfLines={1}
              >
                {doctorName}
              </Text>
              <Text fontSize="sm" color="var(--regular-color)" noOfLines={1}>
                {doctorSpecialization}
              </Text>
            </Stack>
          </Stack>
        </MotionBox>

        <Box flex="1" minW={0} p={{ base: 5, md: 6 }}>
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ md: "flex-start" }}
            justify="space-between"
            gap={4}
          >
            <Stack spacing={3} flex="1" minW={0}>
              <Flex align="center" gap={2} flexWrap="wrap">
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
                  Added {timeAgo}
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
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.75"
                  color="var(--heading-color)"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                  pl={3}
                >
                  {review?.text}
                </Text>
              </Box>

              <Flex align="center" justify="space-between" gap={3} wrap="wrap">
                <HStack
                  spacing={0.5}
                  px={3}
                  py={2}
                  borderRadius="full"
                  bg="rgba(31, 58, 95, 0.04)"
                >
                  {[1, 2, 3, 4, 5].map((starIndex) => (
                    <Box
                      key={starIndex}
                      as="span"
                      lineHeight="1"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {starIndex <= ratingValue ? (
                        <FaStar
                          color="#f5b301"
                          fontSize="15px"
                          style={{
                            filter:
                              "drop-shadow(0 2px 4px rgba(245, 179, 1, 0.18))",
                          }}
                        />
                      ) : (
                        <FaRegStar color="rgba(148, 163, 184, 0.6)" fontSize="15px" />
                      )}
                    </Box>
                  ))}
                </HStack>

                <Text fontSize="xs" color="var(--secondary-gray-color)">
                  {ratingValue ? `${ratingValue.toFixed(1)} / 5` : "No rating"}
                </Text>
              </Flex>
            </Stack>

            <Button
              onClick={() => {
                if (!loading) {
                  handleDelete();
                }
              }}
              isLoading={loading}
              loadingText="Deleting..."
              isDisabled={loading}
              minW={{ base: "full", md: "140px" }}
              h="48px"
              borderRadius="16px"
              border="1px solid"
              borderColor="rgba(239, 68, 68, 0.18)"
              bg="rgba(239, 68, 68, 0.08)"
              color="rgb(185, 28, 28)"
              fontSize="14px"
              fontWeight="800"
              transition="transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease"
              _hover={{
                transform: "translateY(-1px)",
                bg: "rgba(239, 68, 68, 0.12)",
                boxShadow: "0 14px 24px rgba(185, 28, 28, 0.12)",
              }}
              _disabled={{
                opacity: 0.7,
                cursor: "not-allowed",
              }}
            >
              Delete
            </Button>
          </Flex>
        </Box>
      </Flex>
    </MotionBox>
  );
};

export default ReviewCard;
