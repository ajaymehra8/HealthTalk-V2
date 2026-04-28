import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, Badge, Box, Button, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FiCalendar, FiMapPin, FiStar, FiTag } from "react-icons/fi";
import { useAuthState } from "../../../context/AuthProvider";
import { MotionBox } from "../adminPageComponent/AdminLayout";

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
        <Text mt={1} fontSize="sm" fontWeight="700" color="var(--heading-color)" noOfLines={1}>
          {value}
        </Text>
      </Box>
    </HStack>
  </Box>
);

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const [appointmentCount, setAppointmentCount] = useState(0);
  const { user } = useAuthState();

  const fetchAppointments = useCallback(async () => {
    const token = user?.jwt;
    if (!token || !doctor?._id) return;

    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/booking/get-doctor-appoinments/${doctor._id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setAppointmentCount(data?.bookings?.length || 0);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
    }
  }, [doctor?._id, user?.jwt]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleViewProfile = () => {
    if (!doctor?._id) return;
    navigate(`/doctor-profile/${doctor._id}`);
  };

  const specialization = useMemo(
    () => doctor?.specialization?.join(", ") || "Specialist",
    [doctor?.specialization]
  );

  const ratingValue = Number(doctor?.avgRating || 0);

  return (
    <MotionBox
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
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
              src={doctor?.image}
              name={doctor?.name || "Doctor"}
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
                Verified doctor
              </Badge>
              <Text
                fontSize="lg"
                fontWeight="800"
                color="var(--heading-color)"
                noOfLines={1}
              >
                Dr. {doctor?.name || "Unknown doctor"}
              </Text>
              <Text fontSize="sm" color="var(--regular-color)" noOfLines={2}>
                {specialization}
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
              <Box as={FiCalendar} fontSize="14px" />
              <Text fontSize="sm" fontWeight="700">
                {appointmentCount} appointments
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
                    Doctor overview
                  </Badge>
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="800"
                    color="var(--heading-color)"
                    letterSpacing="-0.03em"
                  >
                    {doctor?.education || "Professional profile"}
                  </Text>
                  <Text fontSize="sm" color="var(--regular-color)">
                    Live doctor details, appointments, and ratings are shown here.
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
                  Clinic fee {doctor?.clinicFee ? `Rs. ${doctor.clinicFee}` : "n/a"}
                </Badge>
              </Flex>

              <Flex wrap="wrap" gap={3}>
                <MetaPill
                  label="Location"
                  value={doctor?.clinicLocation?.name || "Unknown clinic"}
                  icon={FiMapPin}
                />
                <MetaPill
                  label="Specialty"
                  value={specialization}
                  icon={FiTag}
                />
                <MetaPill
                  label="Reviews"
                  value={`${doctor?.nRating || 0} ratings`}
                  icon={FiStar}
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
                >
                  Short profile
                </Text>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.75"
                  color="var(--heading-color)"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                  pl={3}
                >
                  {doctor?.description || "No description provided."}
                </Text>
              </Box>

              <HStack spacing={2} px={3} py={2} borderRadius="full" bg="rgba(31, 58, 95, 0.04)" w="fit-content">
                {[1, 2, 3, 4, 5].map((starIndex) => (
                  <Box key={starIndex} as="span" lineHeight="1">
                    {starIndex <= Math.round(ratingValue) ? (
                      <FaStar color="#f5b301" fontSize="15px" />
                    ) : (
                      <FaRegStar color="rgba(148, 163, 184, 0.6)" fontSize="15px" />
                    )}
                  </Box>
                ))}
                <Text fontSize="xs" color="var(--secondary-gray-color)" ml={1}>
                  {ratingValue ? `${ratingValue.toFixed(1)} / 5` : "No rating"}
                </Text>
              </HStack>
            </Stack>

            <Stack
              spacing={3}
              minW={{ base: "full", xl: "220px" }}
              align={{ base: "stretch", xl: "flex-end" }}
            >
              <Button
                onClick={handleViewProfile}
                h="48px"
                px={5}
                borderRadius="16px"
                border="1px solid rgba(31, 58, 95, 0.12)"
                bg="rgba(31, 58, 95, 0.04)"
                color="var(--heading-color)"
                fontSize="14px"
                fontWeight="800"
                _hover={{
                  bg: "rgba(31, 58, 95, 0.08)",
                  transform: "translateY(-1px)",
                }}
              >
                View profile
              </Button>
            </Stack>
          </Flex>
        </Box>
      </Flex>
    </MotionBox>
  );
};

export default DoctorCard;
