import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiDollarSign, FiFlag, FiMapPin, FiTrash2 } from "react-icons/fi";
import { useAuthState } from "../../../context/AuthProvider";
import ReportModal from "../../Report/ReportModal";

const MotionBox = motion(Box);

const formatDoctorName = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const ActionStat = ({ label, value }) => (
  <Box
    flex="1"
    minW={{ base: "full", sm: "150px" }}
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
);

const DoctorProf1 = ({ doctor }) => {
  const { user } = useAuthState();
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const doctorName = doctor?.name ? formatDoctorName(doctor.name) : "Doctor";
  const doctorSpecialization = doctor?.specialization || "Specialist";
  const doctorExperience = doctor?.experience
    ? `${doctor.experience} years experience`
    : "Experience not listed";
  const doctorEducation = doctor?.education || "Education not listed";
  const doctorLocation =
    doctor?.clinicLocation?.name || doctor?.clinicLocation || "Location not listed";
  const doctorFee = doctor?.clinicFee ? `$${doctor.clinicFee}` : "Fee not listed";

  const handleDelete = async () => {
    if (!user?.jwt || !doctor?._id) return;

    setLoading(true);
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/v1/user/doctor/${doctor._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.jwt}`,
          },
        }
      );

      if (data?.success) {
        toast({
          title: data.message,
          status: "success",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
        navigate("/all-doctors");
      } else {
        toast({
          title: data?.message || "Unable to delete doctor",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
    } catch (error) {
      toast({
        title:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to delete doctor",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const bookAppoinment = async () => {
    if (!doctor?._id) return;

    if (!user) {
      return toast({
        title: "You are not logged in",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    }

    setLoading(true);
    try {
      const body = { doctor };
      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${user?.jwt}`,
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/booking/create-booking`,
        body,
        { headers }
      );

      if (data?.success) {
        toast({
          title: data.message,
          status: "success",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      } else {
        toast({
          title: data?.message || "Unable to book appointment",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
    } catch (error) {
      toast({
        title:
          error?.response?.data?.message ||
          error?.message ||
          "Unable to book appointment",
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
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      width="full"
      borderRadius="32px"
      overflow="hidden"
      bg="linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,251,253,0.94))"
      boxShadow="0 22px 48px rgba(31, 58, 95, 0.08)"
      border="1px solid rgba(31, 58, 95, 0.08)"
    >
      <Flex
        direction={{ base: "column", xl: "row" }}
        align="stretch"
        gap={0}
      >
        <Box
          flexShrink={0}
          w={{ base: "full", xl: "340px" }}
          p={{ base: 4, md: 5 }}
          bg="linear-gradient(180deg, rgba(41, 128, 78, 0.06), rgba(255,255,255,0.2))"
          borderRight={{ base: "none", xl: "1px solid rgba(31, 58, 95, 0.06)" }}
          borderBottom={{ base: "1px solid rgba(31, 58, 95, 0.06)", xl: "none" }}
        >
          <Stack spacing={4} align={{ base: "center", xl: "flex-start" }}>
            <Flex
              w="full"
              direction={{ base: "column", sm: "row" }}
              align={{ base: "center", sm: "flex-start" }}
              gap={4}
            >
              <Avatar
                src={doctor?.image}
                name={doctorName}
                size="2xl"
                bg="var(--auth-soft-accent-bg)"
                color="var(--heading-color)"
                border="5px solid rgba(255,255,255,0.96)"
                boxShadow="0 16px 34px rgba(31, 58, 95, 0.12)"
              />

              <Stack spacing={1} flex="1" w="full" align={{ base: "center", sm: "flex-start" }}>
                <Text
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="800"
                  color="var(--heading-color)"
                  letterSpacing="-0.03em"
                  textAlign={{ base: "center", sm: "left" }}
                >
                  Dr. {doctorName}
                </Text>
                <Text
                  fontSize="sm"
                  color="var(--regular-color)"
                  textAlign={{ base: "center", sm: "left" }}
                >
                  {doctorSpecialization}
                </Text>
                <Text
                  fontSize="sm"
                  color="var(--regular-color)"
                  textAlign={{ base: "center", sm: "left" }}
                >
                  {doctorExperience}
                </Text>
                <Text
                  fontSize="sm"
                  color="var(--regular-color)"
                  textAlign={{ base: "center", sm: "left" }}
                  noOfLines={2}
                >
                  {doctorEducation}
                </Text>
              </Stack>
            </Flex>

            <Flex w="full" gap={3} wrap="wrap">
              <HStack
                flex="1 1 180px"
                minW="0"
                spacing={2}
                px={3}
                py={2}
                borderRadius="full"
                bg="rgba(31, 58, 95, 0.05)"
                color="var(--heading-color)"
              >
                <Box as={FiMapPin} />
                <Text fontSize="sm" fontWeight="700" noOfLines={1}>
                  {doctorLocation}
                </Text>
              </HStack>

              <HStack
                flex="1 1 180px"
                minW="0"
                spacing={2}
                px={3}
                py={2}
                borderRadius="full"
                bg="rgba(41, 128, 78, 0.08)"
                color="var(--primary-green-color)"
              >
                <Box as={FiDollarSign} />
                <Text fontSize="sm" fontWeight="700" noOfLines={1}>
                  {doctorFee} consultation
                </Text>
              </HStack>
            </Flex>
          </Stack>
        </Box>

        <Box flex="1" p={{ base: 4, md: 5 }}>
          <Flex direction="column" justify="space-between" h="full" gap={4}>
            <Stack spacing={3}>
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="800"
                  color="var(--heading-color)"
                  letterSpacing="-0.01em"
                >
                  Quick actions
                </Text>
                <Text
                  mt={1}
                  fontSize="sm"
                  color="var(--regular-color)"
                  lineHeight="1.65"
                >
                  Book an appointment or report details that need attention.
                </Text>
              </Box>

              <Flex gap={3} wrap="wrap">
                <ActionStat label="Speciality" value={doctorSpecialization} />
                <ActionStat label="Experience" value={doctorExperience} />
                <ActionStat label="Consult fee" value={doctorFee} />
              </Flex>
            </Stack>

            <Flex
              direction={{ base: "column", sm: "row" }}
              gap={3}
              align={{ base: "stretch", sm: "center" }}
              justify="flex-start"
            >
              {user?.role === "admin" ? (
                <Button
                  onClick={!loading ? handleDelete : undefined}
                  isLoading={loading}
                  loadingText="Deleting..."
                  isDisabled={loading}
                  h="44px"
                  w={{ base: "full", sm: "auto" }}
                  px={6}
                  borderRadius="16px"
                  border="1px solid rgba(239, 68, 68, 0.18)"
                  bg="rgba(239, 68, 68, 0.08)"
                  color="rgb(185, 28, 28)"
                  fontSize="14px"
                  fontWeight="800"
                  leftIcon={<Box as={FiTrash2} />}
                  _hover={{
                    bg: "rgba(239, 68, 68, 0.12)",
                  }}
                >
                  Delete this doctor
                </Button>
              ) : (
                <Button
                  onClick={!loading ? bookAppoinment : undefined}
                  isLoading={loading}
                  loadingText="Please wait..."
                  isDisabled={loading}
                  h="44px"
                  w={{ base: "full", sm: "auto" }}
                  px={6}
                  borderRadius="16px"
                  border="none"
                  bg="linear-gradient(135deg, var(--primary-green-color), var(--auth-panel-end))"
                  color="white"
                  fontSize="14px"
                  fontWeight="800"
                  leftIcon={<Box as={FiCalendar} />}
                  boxShadow="0 16px 30px rgba(41, 128, 78, 0.2)"
                  _hover={{
                    bg: "linear-gradient(135deg, var(--secondary-green-color), var(--primary-green-color))",
                  }}
                >
                  Book Appointment
                </Button>
              )}

              {user?.role !== "admin" && (
                <Tooltip label="Report" aria-label="Report doctor" placement="top">
                  <IconButton
                    onClick={onOpen}
                    aria-label="Report doctor"
                    icon={<Box as={FiFlag} />}
                    h="44px"
                    minW="44px"
                    borderRadius="16px"
                    border="1px solid rgba(31, 58, 95, 0.08)"
                    bg="rgba(255,255,255,0.9)"
                    color="var(--heading-color)"
                    _hover={{
                      bg: "rgba(31, 58, 95, 0.06)",
                    }}
                  />
                </Tooltip>
              )}
            </Flex>
          </Flex>
        </Box>
      </Flex>

      <ReportModal
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        doctorId={doctor?._id}
      />
    </MotionBox>
  );
};

export default DoctorProf1;
