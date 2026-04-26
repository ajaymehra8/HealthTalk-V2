import React, { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  HStack,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegStar, FaStar } from "react-icons/fa";
import {
  FiArrowLeft,
  FiBookOpen,
  FiClock,
  FiDollarSign,
  FiEdit3,
  FiMapPin,
  FiSend,
  FiStar,
} from "react-icons/fi";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";

const MotionBox = motion(Box);

const RatingButton = ({ value, active, onSelect }) => (
  <MotionBox
    as="button"
    type="button"
    onClick={() => onSelect(value)}
    whileHover={{ y: -2, scale: 1.04 }}
    whileTap={{ scale: 0.96 }}
    transition={{ duration: 0.16 }}
    display="flex"
    alignItems="center"
    justifyContent="center"
    w={{ base: "44px", sm: "48px" }}
    h={{ base: "44px", sm: "48px" }}
    borderRadius="16px"
    border="1px solid"
    borderColor={active ? "rgba(245, 179, 1, 0.22)" : "rgba(31, 58, 95, 0.08)"}
    bg={active ? "rgba(245, 179, 1, 0.12)" : "rgba(255,255,255,0.9)"}
    color={active ? "#f5b301" : "rgba(148, 163, 184, 0.75)"}
    boxShadow={active ? "0 12px 24px rgba(245, 179, 1, 0.12)" : "none"}
  >
    {active ? <FaStar /> : <FaRegStar />}
  </MotionBox>
);

const InfoTile = ({ icon, label, value }) => (
  <Box
    p={3}
    borderRadius="18px"
    bg="rgba(31, 58, 95, 0.03)"
    border="1px solid rgba(31, 58, 95, 0.06)"
  >
    <HStack spacing={3} align="flex-start">
      <Box
        flexShrink={0}
        w="38px"
        h="38px"
        borderRadius="full"
        bg="var(--auth-soft-accent-bg)"
        color="var(--primary-green-color)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box as={icon} fontSize="15px" />
      </Box>
      <Box minW={0}>
        <Text
          fontSize="xs"
          textTransform="uppercase"
          letterSpacing="0.16em"
          color="var(--secondary-gray-color)"
          fontWeight="800"
        >
          {label}
        </Text>
        <Text
          mt={1}
          fontSize="sm"
          fontWeight="800"
          color="var(--heading-color)"
          noOfLines={1}
        >
          {value}
        </Text>
      </Box>
    </HStack>
  </Box>
);

const Review = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { currentUser, requireAuth } = useProtectedRoute();
  const doctor = state?.user;

  useEffect(() => {
    if (!doctor) {
      navigate("/my-profile/my-info", { replace: true });
    }
  }, [doctor, navigate]);

  if (!doctor) return null;

  const doctorName = doctor?.name || "Doctor";
  const doctorSpecialization = doctor?.specialization || "Specialist";
  const doctorExperience = doctor?.experience
    ? `${doctor.experience} years experience`
    : "Experience not listed";
  const doctorLocation =
    doctor?.clinicLocation?.name || doctor?.clinicLocation || "Location not listed";
  const doctorFee = doctor?.clinicFee ? `$${doctor.clinicFee}` : "Fee not listed";

  const handleApplication = () => {
    requireAuth(
      () => navigate("/doctor/form"),
      {
        allowedRoles: ["user"],
        unauthorizedMessage: "You are not allowed to do this action.",
        unauthorizedRedirect: "/",
      }
    );
  };

  const handleFeedback = async () => {
    if (
      !requireAuth(null, {
        allowedRoles: ["user"],
        unauthorizedMessage: "You are not allowed to do this action.",
        unauthorizedRedirect: "/",
      })
    ) {
      return;
    }

    const token = currentUser?.jwt;
    const url = `${process.env.REACT_APP_API_URL}/api/v1/review/${doctor?._id}`;
    setLoading(true);
    const { data } = await axios.post(
      url,
      { text, rating },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (data.success) {
      toast({
        title: data.message,
        status: "success",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
      navigate("/my-profile/my-reviews");
    } else {
      toast({
        title: data.message,
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    }
    setLoading(false);
  };

  const ratingText =
    rating === 0
      ? "Tap a star to rate your visit"
      : rating === 1
      ? "Very poor"
      : rating === 2
      ? "Poor"
      : rating === 3
      ? "Good"
      : rating === 4
      ? "Great"
      : "Excellent";

  return (
    <>
      <Navbar />
      <Box
        position="relative"
        minH="100vh"
        w="full"
        overflow="hidden"
        pt="66px"
        bgGradient="linear(135deg, var(--profile-page-bg-start) 0%, var(--page-background-color) 50%, var(--profile-page-bg-end) 100%)"
      >
        <Box
          position="absolute"
          top="-90px"
          right="-80px"
          w="260px"
          h="260px"
          borderRadius="full"
          bg="rgba(55, 189, 115, 0.14)"
          filter="blur(10px)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-120px"
          left="-100px"
          w="320px"
          h="320px"
          borderRadius="full"
          bg="rgba(31, 58, 95, 0.1)"
          filter="blur(10px)"
          pointerEvents="none"
        />

        <Container maxW="1320px" px={{ base: 4, md: 6, xl: 8 }} py={{ base: 5, md: 8 }}>
          <Stack spacing={5}>
            <MotionBox
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
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
                    Review form
                  </Badge>
                  <Text
                    as="h1"
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="800"
                    color="var(--heading-color)"
                    letterSpacing="-0.03em"
                  >
                    Submit feedback for Dr. {doctorName}
                  </Text>
                  <Text fontSize="sm" color="var(--regular-color)" lineHeight="1.7">
                    Share a clear, helpful review so other patients can make
                    better decisions and your doctor can improve the experience.
                  </Text>
                </Stack>

                <HStack
                  spacing={2}
                  px={3}
                  py={2}
                  borderRadius="full"
                  bg="rgba(41, 128, 78, 0.08)"
                  color="var(--primary-green-color)"
                  alignSelf="flex-start"
                >
                  <Box as={FiStar} />
                  <Text fontSize="sm" fontWeight="800">
                    Help others choose confidently
                  </Text>
                </HStack>
              </Flex>
            </MotionBox>

            <Grid
              templateColumns={{ base: "1fr", xl: "minmax(0, 1.2fr) minmax(320px, 0.8fr)" }}
              gap={5}
              alignItems="start"
            >
              <MotionBox
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
                p={{ base: 5, md: 6 }}
                borderRadius="30px"
                bg="rgba(255,255,255,0.9)"
                border="1px solid rgba(31, 58, 95, 0.08)"
                boxShadow="0 24px 54px rgba(31, 58, 95, 0.08)"
                backdropFilter="blur(16px)"
              >
                <Stack spacing={5}>
                  <Flex
                    direction={{ base: "column", sm: "row" }}
                    align={{ base: "center", sm: "flex-start" }}
                    gap={4}
                  >
                    <Avatar
                      src={doctor?.image}
                      name={doctorName}
                      size="xl"
                      bg="var(--auth-soft-accent-bg)"
                      color="var(--heading-color)"
                      border="5px solid rgba(255,255,255,0.95)"
                      boxShadow="0 16px 34px rgba(31, 58, 95, 0.12)"
                    />

                    <Stack spacing={1} flex="1" minW={0} align={{ base: "center", sm: "flex-start" }}>
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
                        You are reviewing
                      </Badge>
                      <Text
                        fontSize={{ base: "xl", md: "2xl" }}
                        fontWeight="800"
                        color="var(--heading-color)"
                        textAlign={{ base: "center", sm: "left" }}
                        noOfLines={1}
                      >
                        Dr. {doctorName}
                      </Text>
                      <Text
                        fontSize="sm"
                        color="var(--regular-color)"
                        textAlign={{ base: "center", sm: "left" }}
                        noOfLines={1}
                      >
                        {doctorSpecialization} • {doctorExperience}
                      </Text>
                    </Stack>
                  </Flex>

                  <Box
                    p={4}
                    borderRadius="22px"
                    bg="rgba(31, 58, 95, 0.03)"
                    border="1px solid rgba(31, 58, 95, 0.06)"
                  >
                    <Stack spacing={3}>
                      <Flex justify="space-between" gap={3} wrap="wrap" align="center">
                        <Box>
                          <Text
                            fontSize="xs"
                            textTransform="uppercase"
                            letterSpacing="0.16em"
                            color="var(--secondary-gray-color)"
                            fontWeight="800"
                          >
                            Rating
                          </Text>
                          <Text
                            mt={1}
                            fontSize="lg"
                            fontWeight="800"
                            color="var(--heading-color)"
                          >
                            {ratingText}
                          </Text>
                        </Box>
                        <Text fontSize="sm" color="var(--regular-color)">
                          {rating ? `${rating} / 5 selected` : "No rating selected"}
                        </Text>
                      </Flex>

                      <HStack spacing={2} flexWrap="wrap">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <RatingButton
                            key={value}
                            value={value}
                            active={value <= rating}
                            onSelect={(ele) => {
                              if (rating > 0 && ele <= rating) {
                                setRating(ele - 1);
                                return;
                              }
                              if (rating <= 5) setRating(ele);
                            }}
                          />
                        ))}
                      </HStack>
                    </Stack>
                  </Box>

                  <Box
                    p={4}
                    borderRadius="22px"
                    bg="rgba(31, 58, 95, 0.03)"
                    border="1px solid rgba(31, 58, 95, 0.06)"
                  >
                    <Stack spacing={3}>
                      <Flex align="center" gap={2}>
                        <Box as={FiEdit3} color="var(--primary-green-color)" />
                        <Text
                          fontSize="xs"
                          textTransform="uppercase"
                          letterSpacing="0.16em"
                          color="var(--secondary-gray-color)"
                          fontWeight="800"
                        >
                          Your review
                        </Text>
                      </Flex>
                      <Textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={`Tell us about your experience with Dr. ${doctorName}...`}
                        minH={{ base: "180px", md: "220px" }}
                        resize="vertical"
                        bg="rgba(255,255,255,0.94)"
                        border="1px solid rgba(31, 58, 95, 0.1)"
                        borderRadius="18px"
                        color="var(--heading-color)"
                        _placeholder={{ color: "var(--auth-placeholder-color)" }}
                        _focus={{
                          borderColor: "rgba(41, 128, 78, 0.35)",
                          boxShadow: "0 0 0 1px rgba(41, 128, 78, 0.12)",
                        }}
                      />
                    </Stack>
                  </Box>

                  <Flex
                    direction={{ base: "column", sm: "row" }}
                    gap={3}
                    align={{ base: "stretch", sm: "center" }}
                    justify="space-between"
                  >
                    <Text fontSize="sm" color="var(--regular-color)" lineHeight="1.6">
                      Be specific and respectful. Your feedback becomes part of your
                      review history after submission.
                    </Text>
                    <Button
                      h="46px"
                      minW={{ base: "full", sm: "fit-content" }}
                      px={7}
                      borderRadius="16px"
                      border="none"
                      bg="linear-gradient(135deg, var(--primary-green-color), var(--auth-panel-end))"
                      color="white"
                      fontSize="14px"
                      fontWeight="800"
                      leftIcon={<Box as={FiSend} />}
                      isLoading={loading}
                      loadingText="Submitting..."
                      isDisabled={loading}
                      boxShadow="0 16px 30px rgba(41, 128, 78, 0.2)"
                      _hover={{
                        bg: "linear-gradient(135deg, var(--secondary-green-color), var(--primary-green-color))",
                      }}
                      onClick={handleFeedback}
                    >
                      Submit Feedback
                    </Button>
                  </Flex>
                </Stack>
              </MotionBox>

              <MotionBox
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
                p={{ base: 5, md: 6 }}
                borderRadius="30px"
                bg="linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,251,253,0.94))"
                border="1px solid rgba(31, 58, 95, 0.08)"
                boxShadow="0 24px 54px rgba(31, 58, 95, 0.08)"
              >
                <Stack spacing={5}>
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
                      Doctor snapshot
                    </Badge>
                    <Text
                      mt={2}
                      fontSize={{ base: "lg", md: "xl" }}
                      fontWeight="800"
                      color="var(--heading-color)"
                    >
                      Quick details
                    </Text>
                  </Box>

                  <Stack spacing={3}>
                    <InfoTile icon={FiBookOpen} label="Speciality" value={doctorSpecialization} />
                    <InfoTile icon={FiClock} label="Experience" value={doctorExperience} />
                    <InfoTile icon={FiDollarSign} label="Consult fee" value={doctorFee} />
                    <InfoTile icon={FiMapPin} label="Location" value={doctorLocation} />
                  </Stack>

                  <Box
                    p={4}
                    borderRadius="22px"
                    bg="rgba(31, 58, 95, 0.03)"
                    border="1px solid rgba(31, 58, 95, 0.06)"
                  >
                    <Text
                      fontSize="sm"
                      color="var(--regular-color)"
                      lineHeight="1.7"
                    >
                      Your review will appear in your profile after submission and
                      can be removed later from the reviews section.
                    </Text>
                  </Box>

                  <Button
                    onClick={handleApplication}
                    h="46px"
                    w="full"
                    borderRadius="16px"
                    border="none"
                    bg="rgba(31, 58, 95, 0.08)"
                    color="var(--heading-color)"
                    fontSize="14px"
                    fontWeight="800"
                    leftIcon={<Box as={FiArrowLeft} transform="rotate(180deg)" />}
                    _hover={{
                      bg: "rgba(31, 58, 95, 0.12)",
                    }}
                  >
                    Become a doctor
                  </Button>
                </Stack>
              </MotionBox>
            </Grid>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Review;
