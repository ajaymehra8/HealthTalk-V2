import React, { useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import moment from "moment";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiClock, FiCreditCard, FiMapPin } from "react-icons/fi";
import { loadStripe } from "@stripe/stripe-js";
import { useAuthState } from "../../../context/AuthProvider";

const MotionBox = motion(Box);

const AppoinmentCard = ({
  appoinment,
  setAppoinments,
  index = 0,
}) => {
  const { user } = useAuthState();
  const toast = useToast();
  const navigate = useNavigate();
  const [isPaying, setIsPaying] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const doctor = appoinment?.doctor || {};
  const doctorName = doctor?.name || "Unknown doctor";
  const doctorImage = doctor?.image || "";
  const doctorSpecialization = doctor?.specialization || "Doctor";
  const appointmentTime = appoinment?.time;
  const appointmentDate = appointmentTime
    ? moment(appointmentTime).format("ddd, MMM D, YYYY")
    : "Not scheduled yet";
  const appointmentHour = appointmentTime
    ? moment(appointmentTime).format("hh:mm A")
    : "Waiting for time";
  const bookedAt = appoinment?.createdAt
    ? moment(appoinment.createdAt).fromNow()
    : "Recently";
  const bookedOn = appoinment?.createdAt
    ? moment(appoinment.createdAt).format("MMM D, YYYY")
    : "Not available";
  const isPaid = Boolean(appoinment?.payment);
  const clinicFee = doctor?.clinicFee;
  const modeLabel = appoinment?.mode || "Offline";

  const openDoctorProfile = () => {
    if (!doctor?._id) return;
    navigate("/doctor-profile", { state: { user: doctor } });
  };

  const handleDoctorKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDoctorProfile();
    }
  };

  const handlePayment = async () => {
    if (!user?.jwt) return;
    setIsPaying(true);
    try {
      const stripe = await loadStripe(
        "pk_test_51QKM6JIu0DlivGoxIbEC0QON85mvDvjOLi1RB932paqnvBvWALpan0ZVhIzRHsFVg6S43HHQg7FFLsmzmRtS1qWW00V9RB4lFc"
      );

      const body = {
        doctor,
        appoinmentId: appoinment._id,
      };
      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.jwt}`,
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/booking/create-checkout-session`,
        body,
        { headers }
      );

      if (data.success) {
        const result = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });
        if (result?.error) {
          throw new Error(result.error.message);
        }
        toast({
          title: data.message,
          status: "success",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      } else {
        toast({
          title: data?.message || "Unable to start checkout",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
    } catch (error) {
      console.error("Error creating payment session:", error);
      toast({
        title:
          error?.response?.data?.message ||
          error?.message ||
          "Payment could not be started",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    } finally {
      setIsPaying(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.jwt) return;
    setIsCancelling(true);
    try {
      const body = {
        appoinmentId: appoinment._id,
      };
      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${user.jwt}`,
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/booking/cancel-appoinment`,
        body,
        { headers }
      );
      if (data.success) {
        setAppoinments((prevAppoinments) =>
          prevAppoinments.filter((appt) => appt._id !== appoinment._id)
        );
        toast({
          title: data.message,
          status: "success",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      } else {
        toast({
          title: data?.message || "Unable to cancel appointment",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast({
        title:
          error?.response?.data?.message ||
          error?.message ||
          "Appointment could not be cancelled",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <MotionBox
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      width="100%"
      borderRadius="28px"
      overflow="hidden"
      bg="linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,251,253,0.94))"
      boxShadow="0 22px 48px rgba(31, 58, 95, 0.08)"
    >
      <Box
        display="flex"
        flexDirection={{ base: "column", xl: "row" }}
        alignItems="stretch"
      >
        <MotionBox
          as="div"
          role="button"
          tabIndex={0}
          onClick={openDoctorProfile}
          onKeyDown={handleDoctorKeyDown}
          flexShrink={0}
          w={{ base: "full", xl: "280px" }}
          p={5}
          cursor={doctor?._id ? "pointer" : "default"}
          textAlign="center"
          bg="linear-gradient(180deg, rgba(41, 128, 78, 0.05), rgba(255,255,255,0.22))"
          borderRight={{ base: "none", xl: "1px solid rgba(31, 58, 95, 0.06)" }}
          borderBottom={{ base: "1px solid rgba(31, 58, 95, 0.06)", xl: "none" }}
          boxShadow="inset 0 1px 0 rgba(255,255,255,0.6)"
          whileHover={doctor?._id ? { scale: 1.01, x: 2 } : undefined}
          whileTap={doctor?._id ? { scale: 0.99 } : undefined}
          transition={{ duration: 0.2 }}
        >
          <Stack spacing={3} align="center" justify="center" h="full">
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

            <HStack
              spacing={2}
              px={3}
              py={2}
              borderRadius="full"
              bg="rgba(31, 58, 95, 0.05)"
              color="var(--primary-green-color)"
            >
              <Text fontSize="sm" fontWeight="700">
                View profile
              </Text>
              <Box as={FiArrowRight} fontSize="14px" />
            </HStack>
          </Stack>
        </MotionBox>

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
                    Appointment details
                  </Badge>
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="800"
                    color="var(--heading-color)"
                    letterSpacing="-0.03em"
                  >
                    Scheduled visit
                  </Text>
                </Stack>

                <Badge
                  alignSelf="flex-start"
                  px={3}
                  py={1.5}
                  borderRadius="full"
                  bg={isPaid ? "rgba(41, 128, 78, 0.1)" : "rgba(239, 68, 68, 0.08)"}
                  color={isPaid ? "var(--primary-green-color)" : "rgb(185, 28, 28)"}
                  border="1px solid"
                  borderColor={
                    isPaid ? "rgba(41, 128, 78, 0.15)" : "rgba(239, 68, 68, 0.16)"
                  }
                  fontSize="10px"
                  textTransform="uppercase"
                  letterSpacing="0.18em"
                  fontWeight="800"
                >
                  {isPaid ? "Paid" : "Pending payment"}
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

                <Stack spacing={3} pl={3}>
                  <HStack spacing={3} align="center">
                    <Box
                      w="42px"
                      h="42px"
                      borderRadius="full"
                      bg="rgba(41, 128, 78, 0.1)"
                      color="var(--primary-green-color)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box as={FiCalendar} fontSize="18px" />
                    </Box>
                    <Box minW={0}>
                      <Text
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="0.16em"
                        color="var(--secondary-gray-color)"
                        fontWeight="800"
                      >
                        Appointment time
                      </Text>
                      <Text
                        fontSize="md"
                        fontWeight="800"
                        color="var(--heading-color)"
                        noOfLines={1}
                      >
                        {appointmentDate}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack spacing={3} align="center">
                    <Box
                      w="42px"
                      h="42px"
                      borderRadius="full"
                      bg="rgba(31, 58, 95, 0.06)"
                      color="var(--heading-color)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box as={FiClock} fontSize="18px" />
                    </Box>
                    <Box minW={0}>
                      <Text
                        fontSize="xs"
                        textTransform="uppercase"
                        letterSpacing="0.16em"
                        color="var(--secondary-gray-color)"
                        fontWeight="800"
                      >
                        Time
                      </Text>
                      <Text
                        fontSize="md"
                        fontWeight="800"
                        color="var(--heading-color)"
                        noOfLines={1}
                      >
                        {appointmentHour}
                      </Text>
                    </Box>
                  </HStack>

                  <Text fontSize="sm" color="var(--regular-color)">
                    Booked {bookedAt}
                  </Text>
                </Stack>
              </Box>

              <Grid
                templateColumns={{
                  base: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                }}
                gap={3}
              >
                <Box
                  p={3}
                  borderRadius="18px"
                  bg="rgba(255,255,255,0.8)"
                  border="1px solid rgba(31, 58, 95, 0.06)"
                >
                  <Text
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="0.16em"
                    color="var(--secondary-gray-color)"
                    fontWeight="800"
                  >
                    Booked on
                  </Text>
                  <Text
                    mt={1}
                    fontSize="sm"
                    fontWeight="800"
                    color="var(--heading-color)"
                  >
                    {bookedOn}
                  </Text>
                </Box>

                <Box
                  p={3}
                  borderRadius="18px"
                  bg="rgba(255,255,255,0.8)"
                  border="1px solid rgba(31, 58, 95, 0.06)"
                >
                  <Text
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="0.16em"
                    color="var(--secondary-gray-color)"
                    fontWeight="800"
                  >
                    Visit mode
                  </Text>
                  <HStack mt={1} spacing={2}>
                    <Box as={FiMapPin} color="var(--primary-green-color)" />
                    <Text
                      fontSize="sm"
                      fontWeight="800"
                      color="var(--heading-color)"
                    >
                      {modeLabel}
                    </Text>
                  </HStack>
                </Box>

                <Box
                  p={3}
                  borderRadius="18px"
                  bg="rgba(255,255,255,0.8)"
                  border="1px solid rgba(31, 58, 95, 0.06)"
                >
                  <Text
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="0.16em"
                    color="var(--secondary-gray-color)"
                    fontWeight="800"
                  >
                    Consultation fee
                  </Text>
                  <HStack mt={1} spacing={2}>
                    <Box as={FiCreditCard} color="var(--primary-green-color)" />
                    <Text
                      fontSize="sm"
                      fontWeight="800"
                      color="var(--heading-color)"
                      whiteSpace="nowrap"
                    >
                      {clinicFee ? `$${clinicFee}` : "Not set"}
                    </Text>
                  </HStack>
                </Box>
              </Grid>
            </Stack>

            <Stack
              spacing={3}
              w={{ base: "full", xl: "220px" }}
              pt={{ base: 2, xl: 0 }}
            >
              <Button
                onClick={!isPaid ? handlePayment : undefined}
                isLoading={isPaying}
                loadingText="Redirecting..."
                isDisabled={isPaying || isPaid}
                h="48px"
                borderRadius="16px"
                border="none"
                bg="linear-gradient(135deg, var(--primary-green-color), var(--auth-panel-end))"
                color="white"
                fontSize="14px"
                fontWeight="800"
                boxShadow="0 16px 30px rgba(41, 128, 78, 0.2)"
                _hover={{
                  bg: "linear-gradient(135deg, var(--secondary-green-color), var(--primary-green-color))",
                }}
                _disabled={{
                  opacity: 0.72,
                  cursor: "not-allowed",
                }}
              >
                {isPaid ? "Payment done" : `Pay $${clinicFee || 0}`}
              </Button>

              {!isPaid && (
                <Button
                  onClick={handleDelete}
                  isLoading={isCancelling}
                  loadingText="Cancelling..."
                  isDisabled={isCancelling}
                  h="48px"
                  borderRadius="16px"
                  border="1px solid rgba(239, 68, 68, 0.18)"
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
                    opacity: 0.72,
                    cursor: "not-allowed",
                  }}
                >
                  Cancel
                </Button>
              )}
            </Stack>
          </Flex>
        </Box>
      </Box>
    </MotionBox>
  );
};

export default AppoinmentCard;
