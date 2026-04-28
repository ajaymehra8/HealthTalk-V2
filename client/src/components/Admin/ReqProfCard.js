import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Link,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import {
  FiArrowLeft,
  FiBookOpen,
  FiCheckCircle,
  FiDollarSign,
  FiClock,
  FiFileText,
  FiMapPin,
  FiTag,
  FiUser,
  FiXCircle,
} from "react-icons/fi";
import { useAuthState } from "../../context/AuthProvider";
import {
  AdminEmptyState,
  AdminPageHero,
  AdminPanel,
  MotionBox,
} from "./adminPageComponent/AdminLayout";

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

const DetailBlock = ({ title, children }) => (
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
      {title}
    </Text>
    <Box pl={3}>{children}</Box>
  </Box>
);

const ReqProfCard = () => {
  const { reqId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuthState();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const fetchRequest = useCallback(async () => {
    const token = user?.jwt;
    if (!reqId) {
      setLoading(false);
      return;
    }
    if (!token) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/user/request/${reqId}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setRequest(data?.req || null);
      } else {
        setRequest(null);
      }
    } catch (error) {
      setRequest(null);
      toast({
        title: error?.response?.data?.message || "Unable to fetch request",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  }, [reqId, toast, user?.jwt]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const specialization = Array.isArray(request?.specialization)
    ? request.specialization.join(", ")
    : request?.specialization || "Not specified";

  const treatmentAreas = Array.isArray(request?.treatmentArea)
    ? request.treatmentArea
    : request?.treatmentArea
      ? [request.treatmentArea]
      : [];

  const clinicLocationName = request?.clinicLocation?.name || "Unknown clinic";
  const degreeUrl = request?.degree;

  const handleDecision = async (status) => {
    const token = user?.jwt;
    if (!token || !request?._id || !request?.user?._id) return;

    if (status === "Accepted") {
      setAcceptLoading(true);
    } else {
      setRejectLoading(true);
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/user/update-status`,
        {
          userId: request.user._id,
          status,
          reqId: request._id,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
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
        navigate("/my-profile/approvals");
      }
    } catch (error) {
      toast({
        title: error?.response?.data?.message || "Unable to update request",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    } finally {
      setAcceptLoading(false);
      setRejectLoading(false);
    }
  };

  return (
    <Box w="full" maxW="1180px" mx="auto">
      <AdminPageHero
        badge="Request details"
        title={
          request?.user?.name
            ? `${request.user.name}'s application`
            : "Doctor application details"
        }
        description="Inspect every field from the submitted doctor request before making a decision."
        stats={[
          {
            label: "Specialization",
            value: specialization,
            detail: "The role and focus area submitted by the applicant.",
            icon: FiTag,
          },
          {
            label: "Clinic fee",
            value: request?.clinicFee ? `$ ${request.clinicFee}` : "Not set",
            detail: "The expected consultation fee from the application.",
            icon: FiDollarSign,
          },
          {
            label: "Status",
            value: "Pending",
            detail: "This request is waiting for admin review.",
            icon: FiClock,
          },
        ]}
      >
        <Stack spacing={3} align={{ base: "stretch", xl: "flex-end" }}>
          <Button
            onClick={() => navigate("/my-profile/approvals")}
            h="44px"
            px={4}
            borderRadius="full"
            border="1px solid rgba(31, 58, 95, 0.12)"
            bg="rgba(31, 58, 95, 0.04)"
            color="var(--heading-color)"
            fontWeight="800"
            leftIcon={<FiArrowLeft />}
            _hover={{
              bg: "rgba(31, 58, 95, 0.08)",
            }}
          >
            Back to approvals
          </Button>

          {degreeUrl ? (
            <Button
              as="a"
              href={degreeUrl}
              target="_blank"
              rel="noreferrer"
              h="44px"
              px={4}
              borderRadius="full"
              border="1px solid rgba(41, 128, 78, 0.14)"
              bg="rgba(41, 128, 78, 0.08)"
              color="var(--primary-green-color)"
              fontWeight="800"
              leftIcon={<FiBookOpen />}
              _hover={{
                bg: "rgba(41, 128, 78, 0.12)",
              }}
            >
              Open degree file
            </Button>
          ) : null}
        </Stack>
      </AdminPageHero>

      <AdminPanel minH={{ base: "58vh", md: "64vh" }}>
        {loading ? (
          <Flex minH="48vh" align="center" justify="center">
            <Stack spacing={3} align="center" color="var(--heading-color)">
              <Spinner thickness="3px" speed="0.7s" color="var(--primary-green-color)" size="xl" />
              <Text fontWeight="700">Loading request details...</Text>
            </Stack>
          </Flex>
        ) : !request ? (
          <AdminEmptyState
            title="Request not found"
            description="This application may have been processed or removed."
            actionLabel="Back to approvals"
            onAction={() => navigate("/my-profile/approvals")}
          />
        ) : (
          <MotionBox
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
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
                    src={request?.user?.image}
                    name={request?.user?.name || "Applicant"}
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
                      {request?.user?.name || "Unknown applicant"}
                    </Text>
                    <Text fontSize="sm" color="var(--regular-color)" noOfLines={2}>
                      {request?.user?.email || "No email provided"}
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
                    <Box as={FiUser} fontSize="14px" />
                    <Text fontSize="sm" fontWeight="700">
                      Review application
                    </Text>
                  </HStack>
                </Stack>
              </Box>

              <Box flex="1" p={{ base: 5, md: 6 }}>
                <Stack spacing={5}>
                  <Flex
                    direction={{ base: "column", xl: "row" }}
                    align={{ xl: "flex-start" }}
                    justify="space-between"
                    gap={5}
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
                        {specialization}
                      </Text>
                      <Text fontSize="sm" color="var(--regular-color)">
                        This request includes the applicant&apos;s education, clinic, experience, and document details.
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
                      value={specialization}
                      icon={FiTag}
                    />
                    <MetaPill
                      label="Location"
                      value={clinicLocationName}
                      icon={FiMapPin}
                    />
                    <MetaPill
                      label="Clinic fee"
                      value={request?.clinicFee ? `Rs. ${request.clinicFee}` : "Not set"}
                      icon={FiDollarSign}
                    />
                    <MetaPill
                      label="Degree file"
                      value={degreeUrl ? "Uploaded" : "Missing"}
                      icon={FiFileText}
                    />
                  </Flex>

                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }} gap={4}>
                    <DetailBlock title="Education">
                      <Text
                        fontSize={{ base: "md", md: "lg" }}
                        lineHeight="1.75"
                        color="var(--heading-color)"
                        whiteSpace="pre-wrap"
                        wordBreak="break-word"
                      >
                        {request?.education || "No education details provided."}
                      </Text>
                    </DetailBlock>

                    <DetailBlock title="Degree file">
                      {degreeUrl ? (
                        <Stack spacing={2}>
                          <Text
                            fontSize={{ base: "md", md: "lg" }}
                            lineHeight="1.75"
                            color="var(--heading-color)"
                          >
                            The degree document is available as a PDF.
                          </Text>
                          <Link
                            href={degreeUrl}
                            target="_blank"
                            rel="noreferrer"
                            color="var(--primary-green-color)"
                            fontWeight="800"
                            textDecoration="underline"
                            wordBreak="break-all"
                          >
                            Open degree PDF
                          </Link>
                        </Stack>
                      ) : (
                        <Text
                          fontSize={{ base: "md", md: "lg" }}
                          lineHeight="1.75"
                          color="var(--heading-color)"
                          whiteSpace="pre-wrap"
                          wordBreak="break-word"
                        >
                          No degree file attached.
                        </Text>
                      )}
                    </DetailBlock>
                  </Grid>

                  <DetailBlock title="Application summary">
                    <Text
                      fontSize={{ base: "md", md: "lg" }}
                      lineHeight="1.75"
                      color="var(--heading-color)"
                      whiteSpace="pre-wrap"
                      wordBreak="break-word"
                    >
                      {request?.description || "No description provided."}
                    </Text>
                  </DetailBlock>

                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))" }} gap={4}>
                    <DetailBlock title="Experience">
                      <Text
                        fontSize={{ base: "md", md: "lg" }}
                        lineHeight="1.75"
                        color="var(--heading-color)"
                        whiteSpace="pre-wrap"
                        wordBreak="break-word"
                      >
                        {request?.experience || "No experience details provided."}
                      </Text>
                    </DetailBlock>

                    <DetailBlock title="Past work">
                      <Text
                        fontSize={{ base: "md", md: "lg" }}
                        lineHeight="1.75"
                        color="var(--heading-color)"
                        whiteSpace="pre-wrap"
                        wordBreak="break-word"
                      >
                        {request?.pastExperience || "No past work details provided."}
                      </Text>
                    </DetailBlock>
                  </Grid>

                  <DetailBlock title="Treatment areas">
                    {treatmentAreas.length > 0 ? (
                      <Flex wrap="wrap" gap={2}>
                        {treatmentAreas.map((area, index) => (
                          <Badge
                            key={`${area}-${index}`}
                            px={3}
                            py={1}
                            borderRadius="full"
                            bg="rgba(31, 58, 95, 0.05)"
                            color="var(--heading-color)"
                            border="1px solid rgba(31, 58, 95, 0.08)"
                            textTransform="capitalize"
                          >
                            {area}
                          </Badge>
                        ))}
                      </Flex>
                    ) : (
                      <Text
                        fontSize={{ base: "md", md: "lg" }}
                        lineHeight="1.75"
                        color="var(--heading-color)"
                      >
                        No treatment areas provided.
                      </Text>
                    )}
                  </DetailBlock>

                  {request?.clinicLocation?.coordinates?.coordinates ? (
                    <DetailBlock title="Coordinates">
                      <Text
                        fontSize={{ base: "md", md: "lg" }}
                        lineHeight="1.75"
                        color="var(--heading-color)"
                      >
                        {`Lng: ${request.clinicLocation.coordinates.coordinates[0]}, Lat: ${request.clinicLocation.coordinates.coordinates[1]}`}
                      </Text>
                    </DetailBlock>
                  ) : null}

                  <Stack
                    spacing={3}
                    minW="full"
                    direction={{ base: "column", md: "row" }}
                    justify="flex-end"
                  >
                    <Button
                      onClick={() => handleDecision("Accepted")}
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
                      onClick={() => handleDecision("Rejected")}
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
                </Stack>
              </Box>
            </Flex>
          </MotionBox>
        )}
      </AdminPanel>
    </Box>
  );
};

export default ReqProfCard;
