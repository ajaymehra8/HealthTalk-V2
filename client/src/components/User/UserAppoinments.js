import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Flex,
  Grid,
  HStack,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCalendar, FiCheckCircle, FiClock } from "react-icons/fi";
import { useAuthState } from "../../context/AuthProvider";
import AppoinmentCard from "./Appoinment/AppoinmentCard";

const MotionBox = motion(Box);

const StatCard = ({ label, value, detail, icon }) => (
  <Box
    p={4}
    borderRadius="22px"
    bg="rgba(255,255,255,0.86)"
    border="1px solid rgba(31, 58, 95, 0.08)"
    boxShadow="0 16px 32px rgba(31, 58, 95, 0.06)"
    backdropFilter="blur(12px)"
  >
    <HStack spacing={3} align="flex-start">
      <Box
        flexShrink={0}
        w="42px"
        h="42px"
        borderRadius="full"
        bg="var(--auth-soft-accent-bg)"
        color="var(--primary-green-color)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box as={icon} fontSize="18px" />
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
          fontSize="2xl"
          fontWeight="800"
          color="var(--heading-color)"
          lineHeight="1.1"
        >
          {value}
        </Text>
        <Text fontSize="xs" color="var(--regular-color)" mt={1} noOfLines={2}>
          {detail}
        </Text>
      </Box>
    </HStack>
  </Box>
);

const UserAppoinments = () => {
  const [appoinments, setAppoinments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthState();
  const token = user?.jwt;

  const getAppoinments = useCallback(async () => {
    if (!token) return;

    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    };

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/booking/get-user-appoinments`,
        { headers }
      );
      setAppoinments(data?.bookings || []);
    } catch (error) {
      console.error("Error fetching appointments:", error?.message);
      setAppoinments([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getAppoinments();
  }, [getAppoinments]);

  const appointmentSummary = useMemo(() => {
    const total = appoinments.length;
    const paid = appoinments.filter((appt) => appt?.payment).length;
    const pending = total - paid;

    return {
      total,
      paid,
      pending,
    };
  }, [appoinments]);

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
          direction={{ base: "column", lg: "row" }}
          align={{ lg: "center" }}
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
              Appointments
            </Badge>
            <Text
              as="h1"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="800"
              color="var(--heading-color)"
              letterSpacing="-0.03em"
            >
              Your Appointments
            </Text>
            <Text fontSize="sm" color="var(--regular-color)" lineHeight="1.6">
              Track booked visits, payment status, and doctor details from one
              clean dashboard.
            </Text>
          </Stack>

          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(3, minmax(0, 1fr))",
            }}
            gap={3}
            w={{ base: "full", lg: "auto" }}
          >
            <StatCard
              label="Total"
              value={appointmentSummary.total}
              detail="All bookings in your account."
              icon={FiCalendar}
            />
            <StatCard
              label="Paid"
              value={appointmentSummary.paid}
              detail="Confirmed appointments with payment completed."
              icon={FiCheckCircle}
            />
            <StatCard
              label="Pending"
              value={appointmentSummary.pending}
              detail="Appointments awaiting payment or completion."
              icon={FiClock}
            />
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
        minH={{ base: "52vh", md: "60vh" }}
      >
        {!loading ? (
          appoinments.length > 0 ? (
            <Stack
              spacing={4}
            >
              <AnimatePresence initial={false}>
                {appoinments.map((appoinment, index) => (
                  <AppoinmentCard
                    key={appoinment._id}
                    appoinment={appoinment}
                    setAppoinments={setAppoinments}
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
                  No appointments yet
                </Badge>
                <Text
                  fontSize="xl"
                  fontWeight="800"
                  color="var(--heading-color)"
                  letterSpacing="-0.03em"
                >
                  Your appointment list is empty
                </Text>
                <Text
                  fontSize="sm"
                  color="var(--regular-color)"
                  lineHeight="1.65"
                >
                  Once you book a doctor, the visit details, payment status, and
                  profile actions will appear here.
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
                speed="0.75s"
                color="var(--primary-green-color)"
              />
              <Text fontSize="sm" color="var(--regular-color)">
                Loading appointments...
              </Text>
            </Stack>
          </MotionBox>
        )}
      </MotionBox>
    </Box>
  );
};

export default UserAppoinments;
