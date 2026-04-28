import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import axios from "axios";
import {
  FiCheckCircle,
  FiDollarSign,
  FiEye,
  FiMapPin,
  FiTag,
  FiXCircle,
} from "react-icons/fi";
import { useAuthState } from "../../context/AuthProvider";
import { MotionBox } from "../Admin/adminPageComponent/AdminLayout";

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

const ReqCard = ({ req, setReqs }) => {
  const { user } = useAuthState();
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleAccept = async () => {
    const token = user?.jwt;
    if (!token) return;

    setAcceptLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/user/update-status`,
        { userId: req.user?._id, status: "Accepted", reqId: req._id },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setReqs((prevReqs) => prevReqs.filter((item) => item._id !== req._id));
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
        title: error?.response?.data?.message || "Unable to accept request",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleReject = async () => {
    const token = user?.jwt;
    if (!token) return;

    setRejectLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/user/update-status`,
        { userId: req.user?._id, status: "Rejected", reqId: req._id },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setReqs((prevReqs) => prevReqs.filter((item) => item._id !== req._id));
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
        title: error?.response?.data?.message || "Unable to reject request",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    } finally {
      setRejectLoading(false);
    }
  };

  const doctorId = req.user?._id || req._id;
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
              src={req?.user?.image}
              name={req?.user?.name || "Applicant"}
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
                Pending review
              </Badge>
              <Text
                fontSize="lg"
                fontWeight="800"
                color="var(--heading-color)"
                noOfLines={1}
              >
                {req?.user?.name || "Unknown applicant"}
              </Text>
              <Text fontSize="sm" color="var(--regular-color)" noOfLines={2}>
                {req?.user?.email || "No email provided"}
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
              <Box as={FiEye} fontSize="14px" />
              <Text fontSize="sm" fontWeight="700">
                Review profile
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
                    Doctor application
                  </Badge>
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="800"
                    color="var(--heading-color)"
                    letterSpacing="-0.03em"
                  >
                    {req?.specialization?.[0] || "Doctor profile"}
                  </Text>
                  <Text fontSize="sm" color="var(--regular-color)">
                    This request includes the doctor&apos;s profile, education, fee, and location details.
                  </Text>
                </Stack>

                <Badge
                  alignSelf="flex-start"
                  px={3}
                  py={1.5}
                  borderRadius="full"
                  bg="rgba(239, 68, 68, 0.08)"
                  color="rgb(185, 28, 28)"
                  border="1px solid rgba(239, 68, 68, 0.12)"
                  fontSize="10px"
                  textTransform="uppercase"
                  letterSpacing="0.18em"
                  fontWeight="800"
                >
                  Queue item
                </Badge>
              </Flex>

              <Flex wrap="wrap" gap={3}>
                <MetaPill
                  label="Specialization"
                  value={req?.specialization || "Not added"}
                  icon={FiTag}
                />
                <MetaPill
                  label="Location"
                  value={req?.clinicLocation?.name || "Unknown clinic"}
                  icon={FiMapPin}
                />
                <MetaPill
                  label="Clinic fee"
                  value={req?.clinicFee ? `Rs. ${req.clinicFee}` : "Not set"}
                  icon={FiDollarSign}
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
                  Application summary
                </Text>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.75"
                  color="var(--heading-color)"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                  pl={3}
                >
                  {req?.description || "No description provided."}
                </Text>
              </Box>
            </Stack>

            <Stack
              spacing={3}
              minW={{ base: "full", xl: "220px" }}
              align={{ base: "stretch", xl: "flex-end" }}
            >
              <Button
                onClick={() => {
                  if (doctorId) {
                    navigate(`/doctor-profile/${doctorId}`);
                  }
                }}
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

              <Button
                onClick={!acceptLoading ? handleAccept : undefined}
                isLoading={acceptLoading}
                loadingText="Accepting..."
                isDisabled={acceptLoading || rejectLoading}
                h="48px"
                px={5}
                borderRadius="16px"
                border="1px solid rgba(41, 128, 78, 0.14)"
                bg="rgba(41, 128, 78, 0.08)"
                color="var(--primary-green-color)"
                fontSize="14px"
                fontWeight="800"
                leftIcon={<FiCheckCircle />}
                _hover={{
                  bg: "rgba(41, 128, 78, 0.12)",
                  transform: "translateY(-1px)",
                }}
              >
                Accept
              </Button>

              <Button
                onClick={!rejectLoading ? handleReject : undefined}
                isLoading={rejectLoading}
                loadingText="Rejecting..."
                isDisabled={acceptLoading || rejectLoading}
                h="48px"
                px={5}
                borderRadius="16px"
                border="1px solid rgba(239, 68, 68, 0.18)"
                bg="rgba(239, 68, 68, 0.08)"
                color="rgb(185, 28, 28)"
                fontSize="14px"
                fontWeight="800"
                leftIcon={<FiXCircle />}
                _hover={{
                  bg: "rgba(239, 68, 68, 0.12)",
                  transform: "translateY(-1px)",
                }}
              >
                Reject
              </Button>
            </Stack>
          </Flex>
        </Box>
      </Flex>
    </MotionBox>
  );
};

export default ReqCard;
