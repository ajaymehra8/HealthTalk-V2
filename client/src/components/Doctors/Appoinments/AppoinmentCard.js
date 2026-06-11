import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import axios from "axios";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FiCalendar, FiCheckCircle, FiClock, FiMessageSquare, FiTrash2, FiVideo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../../../context/AuthProvider";
import { MotionBox } from "../../Admin/adminPageComponent/AdminLayout";

const MetaPill = ({ label, value, icon: Icon }) => (
  <Box
    px={3}
    py={2}
    borderRadius="16px"
    bg="rgba(31, 58, 95, 0.04)"
    border="1px solid rgba(31, 58, 95, 0.06)"
  >
    <HStack spacing={2} align="center">
      {Icon ? (
        <Box as={Icon} fontSize="14px" color="var(--primary-green-color)" />
      ) : null}
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
          fontWeight="700"
          color="var(--heading-color)"
          noOfLines={1}
        >
          {value}
        </Text>
      </Box>
    </HStack>
  </Box>
);

const AppoinmentCard = ({ appoinment, setAppoinments, index = 0 }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentAppointment, setCurrentAppointment] = useState(appoinment);
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuthState();
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  useEffect(() => {
    setCurrentAppointment(appoinment);
    setSelectedDate(appoinment?.time ? new Date(appoinment.time) : null);
  }, [appoinment]);

  const createdAt = currentAppointment?.createdAt;
  const timeAgo = createdAt ? moment(createdAt).fromNow() : "Unknown";
  const scheduledLabel = currentAppointment?.time
    ? moment(currentAppointment.time).format("MMM D, YYYY h:mm A")
    : "Awaiting schedule";

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const cancelAppoinment = async () => {
    const token = user?.jwt;
    if (!token) return;

    setRejectLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/booking/cancel-appoinment`,
        {
          appoinmentId: currentAppointment._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setAppoinments((prevAppoinments) =>
          prevAppoinments.filter((appt) => appt._id !== currentAppointment._id)
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
      console.error("Error canceling appointment:", error);
      toast({
        title: "An error occurred",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    } finally {
      setRejectLoading(false);
    }
  };

  const setAppoinmentByDoc = async () => {
    const token = user?.jwt;
    if (!token) return;

    if (!selectedDate) {
      toast({
        title: "Please select a valid date",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
      return;
    }

    setAcceptLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/booking/set-appoinment`,
        {
          appoinmentId: currentAppointment._id,
          time: selectedDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setSelectedDate(new Date(data.appoinment.time));
        setCurrentAppointment(data?.appoinment);
        toast({
          title: "Appointment updated successfully",
          status: "success",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      } else {
        toast({
          title: data.message || "Failed to set appointment",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
    } catch (error) {
      console.error("Error setting appointment:", error);
      toast({
        title: "An error occurred",
        description: error.message,
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    } finally {
      setAcceptLoading(false);
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
              src={currentAppointment?.user?.image}
              name={currentAppointment?.user?.name || "Patient"}
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
                bg={currentAppointment?.payment ? "var(--auth-soft-accent-bg)" : "rgba(239, 68, 68, 0.08)"}
                color={currentAppointment?.payment ? "var(--primary-green-color)" : "rgb(185, 28, 28)"}
                border="1px solid"
                borderColor={currentAppointment?.payment ? "var(--auth-soft-accent-border)" : "rgba(239, 68, 68, 0.12)"}
                fontSize="10px"
                textTransform="uppercase"
                letterSpacing="0.16em"
              >
                {currentAppointment?.payment ? "Paid booking" : "Unpaid booking"}
              </Badge>
              <Text
                fontSize="lg"
                fontWeight="800"
                color="var(--heading-color)"
                noOfLines={1}
              >
                {currentAppointment?.user?.name || "Unknown patient"}
              </Text>
              <Text fontSize="sm" color="var(--regular-color)" noOfLines={2}>
                {currentAppointment?.user?.email || "No email provided"}
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
                    Appointment details
                  </Badge>
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="800"
                    color="var(--heading-color)"
                    letterSpacing="-0.03em"
                  >
                    {scheduledLabel}
                  </Text>
                  <Text fontSize="sm" color="var(--regular-color)">
                    Plan the visit time and keep the doctor queue balanced.
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
                  {currentAppointment?.mode || "Offline"}
                </Badge>
              </Flex>

              <Flex wrap="wrap" gap={3}>
                <MetaPill
                  label="Mode"
                  value={currentAppointment?.mode || "Offline"}
                  icon={FiVideo}
                />
                <MetaPill
                  label="Payment"
                  value={currentAppointment?.payment ? "Paid" : "Unpaid"}
                  icon={FiCheckCircle}
                />
                <MetaPill
                  label="Schedule"
                  value={currentAppointment?.time ? "Confirmed" : "Pending"}
                  icon={FiCalendar}
                />
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
                  Scheduling note
                </Text>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.75"
                  color="var(--heading-color)"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                  pl={3}
                >
                  {currentAppointment?.time
                    ? `This visit is locked for ${scheduledLabel}.`
                    : "Choose a date and confirm when you are ready."}
                </Text>
              </Box>
            </Stack>

            <Stack
              spacing={3}
              minW={{ base: "full", xl: "260px" }}
              align={{ base: "stretch", xl: "flex-end" }}
            >
              <Box
                p={4}
                borderRadius="20px"
                bg="rgba(31, 58, 95, 0.03)"
                border="1px solid rgba(31, 58, 95, 0.05)"
              >
                <Text
                  fontSize="sm"
                  fontWeight="800"
                  color="var(--secondary-gray-color)"
                  textTransform="uppercase"
                  letterSpacing="0.16em"
                  mb={2}
                >
                  Appointment time
                </Text>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMM d, yyyy h:mm aa"
                  placeholderText="Select date and time"
                  disabled={Boolean(currentAppointment?.time)}
                  minDate={new Date()}
                  customInput={
                    <Input
                      h="48px"
                      borderRadius="16px"
                      border="1px solid rgba(31, 58, 95, 0.12)"
                      bg="rgba(255,255,255,0.92)"
                      color="var(--heading-color)"
                      fontWeight="700"
                      _placeholder={{ color: "var(--secondary-gray-color)" }}
                    />
                  }
                />
                <Text fontSize="sm" color="var(--regular-color)" mt={2} lineHeight="1.6">
                  {currentAppointment?.time
                    ? "This visit is already scheduled."
                    : "Choose a slot before confirming the appointment."}
                </Text>
              </Box>

              <Button
                onClick={!currentAppointment?.time ? setAppoinmentByDoc : undefined}
                isLoading={acceptLoading}
                loadingText="Saving..."
                isDisabled={acceptLoading || rejectLoading}
                h="48px"
                px={5}
                borderRadius="16px"
                border="1px solid rgba(41, 128, 78, 0.14)"
                bg="rgba(41, 128, 78, 0.08)"
                color="var(--primary-green-color)"
                fontSize="14px"
                fontWeight="800"
                leftIcon={<FiCalendar />}
                _hover={{
                  bg: "rgba(41, 128, 78, 0.12)",
                  transform: "translateY(-1px)",
                }}
              >
                {currentAppointment?.time ? "Scheduled" : "Set time"}
              </Button>

              {currentAppointment?.payment ? (
                <Button
                  onClick={() =>
                    navigate(`/my-profile/chat/${currentAppointment._id}`)
                  }
                  h="48px"
                  px={5}
                  borderRadius="16px"
                  border="1px solid var(--auth-soft-accent-border)"
                  bg="var(--auth-soft-accent-bg)"
                  color="var(--primary-green-color)"
                  fontSize="14px"
                  fontWeight="800"
                  leftIcon={<FiMessageSquare />}
                  _hover={{
                    bg: "rgba(41, 128, 78, 0.12)",
                    transform: "translateY(-1px)",
                  }}
                >
                  Message patient
                </Button>
              ) : null}

              {!currentAppointment?.time ? (
                <Button
                  onClick={!rejectLoading ? cancelAppoinment : undefined}
                  isLoading={rejectLoading}
                  loadingText="Canceling..."
                  isDisabled={acceptLoading || rejectLoading}
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
                  Cancel booking
                </Button>
              ) : null}
            </Stack>
          </Flex>
        </Box>
      </Flex>
    </MotionBox>
  );
};

export default AppoinmentCard;
