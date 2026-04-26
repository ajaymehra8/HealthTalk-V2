import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiBookOpen,
  FiClipboard,
  FiDollarSign,
  FiLayers,
  FiMapPin,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import DoctorProf1 from "./DoctorProfile/DoctorProf1";
import Footer from "../Footer";
import ReviewPanel from "./DoctorProfile/ReviewPanel";

const DOCTOR_PROFILE_OFFSET = 66;
const MotionBox = motion(Box);

const formatList = (items) => {
  if (!Array.isArray(items)) return [];
  return items.filter(Boolean);
};

const DetailTile = ({ icon, label, value }) => (
  <Box
    p={4}
    borderRadius="20px"
    bg="rgba(31, 58, 95, 0.04)"
    border="1px solid rgba(31, 58, 95, 0.06)"
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
        <Box as={icon} fontSize="16px" />
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
          fontWeight="700"
          color="var(--heading-color)"
          lineHeight="1.6"
          noOfLines={3}
        >
          {value}
        </Text>
      </Box>
    </HStack>
  </Box>
);

const SectionCard = ({ eyebrow, title, children, delay = 0 }) => (
  <MotionBox
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut", delay }}
    p={{ base: 4, md: 5 }}
    borderRadius="28px"
    bg="rgba(255,255,255,0.86)"
    border="1px solid rgba(31, 58, 95, 0.08)"
    boxShadow="0 20px 46px rgba(31, 58, 95, 0.07)"
    backdropFilter="blur(14px)"
  >
    <Stack spacing={4}>
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
          {eyebrow}
        </Badge>
        <Text
          mt={2}
          fontSize={{ base: "lg", md: "xl" }}
          fontWeight="800"
          color="var(--heading-color)"
          letterSpacing="-0.03em"
        >
          {title}
        </Text>
      </Box>
      {children}
    </Stack>
  </MotionBox>
);

const DocProf = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchDoctor = async () => {
      if (!doctorId) {
        if (isActive) {
          setDoctor(null);
          setFetchError("Open a doctor card to view the profile.");
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setFetchError("");

      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/user/${doctorId}`
        );

        const fetchedDoctor = data?.doctor || data?.user || data?.data || null;

        if (!isActive) return;

        setDoctor(fetchedDoctor);
        if (!fetchedDoctor) {
          setFetchError("Doctor profile is not available right now.");
        }
      } catch (error) {
        if (!isActive) return;

        setDoctor(null);
        setFetchError(
          error?.response?.data?.message ||
            "Unable to load this doctor profile right now."
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchDoctor();

    return () => {
      isActive = false;
    };
  }, [doctorId]);

  const fullText =
    doctor?.description ||
    "A modern doctor profile should make it easy to review qualifications, understand the treatment focus, and move confidently into booking or feedback. The layout below keeps the important details clear, calm, and easy to scan.";

  const previewText = useMemo(
    () => fullText.split(/\s+/).slice(0, 36).join(" "),
    [fullText]
  );

  const treatmentAreas = useMemo(
    () => formatList(doctor?.treatmentArea),
    [doctor?.treatmentArea]
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <Box
          position="relative"
          minH="100vh"
          w="full"
          overflow="hidden"
          pt={`${DOCTOR_PROFILE_OFFSET}px`}
          bgGradient="linear(135deg, var(--profile-page-bg-start) 0%, var(--page-background-color) 50%, var(--profile-page-bg-end) 100%)"
        >
          <Container maxW="980px" px={{ base: 4, md: 6, xl: 8 }} py={8}>
            <MotionBox
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              p={{ base: 6, md: 8 }}
              borderRadius="28px"
              bg="linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,251,253,0.92))"
              border="1px solid rgba(31, 58, 95, 0.08)"
              boxShadow="0 24px 54px rgba(31, 58, 95, 0.08)"
            >
              <Stack spacing={4} align="center" textAlign="center">
                <Spinner size="xl" color="var(--primary-green-color)" thickness="3px" />
                <Text fontSize="xl" fontWeight="800" color="var(--heading-color)">
                  Loading doctor profile...
                </Text>
                <Text fontSize="sm" color="var(--regular-color)" lineHeight="1.7">
                  We are fetching the latest profile details.
                </Text>
              </Stack>
            </MotionBox>
          </Container>
        </Box>
        <Footer />
      </>
    );
  }

  if (!doctor) {
    return (
      <>
        <Navbar />
        <Box
          position="relative"
          minH="100vh"
          w="full"
          overflow="hidden"
          pt={`${DOCTOR_PROFILE_OFFSET}px`}
          bgGradient="linear(135deg, var(--profile-page-bg-start) 0%, var(--page-background-color) 50%, var(--profile-page-bg-end) 100%)"
        >
          <Container maxW="980px" px={{ base: 4, md: 6, xl: 8 }} py={8}>
            <MotionBox
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              p={{ base: 5, md: 6 }}
              borderRadius="28px"
              bg="linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,251,253,0.92))"
              border="1px solid rgba(31, 58, 95, 0.08)"
              boxShadow="0 24px 54px rgba(31, 58, 95, 0.08)"
            >
              <Stack spacing={4}>
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
                  Doctor profile
                </Badge>
                <Text
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="800"
                  color="var(--heading-color)"
                  letterSpacing="-0.03em"
                >
                  Profile not available
                </Text>
                <Text fontSize="sm" color="var(--regular-color)" lineHeight="1.7">
                  {fetchError ||
                    "Open a doctor card, review, or appointment entry to view the full profile with booking and feedback options."}
                </Text>
                <Button
                  onClick={() => navigate(-1)}
                  leftIcon={<Box as={FiArrowLeft} />}
                  h="46px"
                  w="fit-content"
                  borderRadius="14px"
                  border="none"
                  bg="linear-gradient(135deg, var(--primary-green-color), var(--auth-panel-end))"
                  color="white"
                  fontWeight="800"
                  _hover={{
                    bg: "linear-gradient(135deg, var(--secondary-green-color), var(--primary-green-color))",
                  }}
                >
                  Go back
                </Button>
              </Stack>
            </MotionBox>
          </Container>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        position="relative"
        minH="100vh"
        w="full"
        overflow="hidden"
        pt={`${DOCTOR_PROFILE_OFFSET}px`}
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

        <Container maxW="1320px" px={{ base: 4, md: 6, xl: 8 }} py={8}>
          <Stack spacing={6}>
            <DoctorProf1 doctor={doctor} />

            <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5} alignItems="start">
              <Stack spacing={5}>
                <SectionCard
                  eyebrow="Personal statement"
                  title="About the doctor"
                  delay={0.05}
                >
                  <Box
                    p={4}
                    borderRadius="20px"
                    bg="rgba(31, 58, 95, 0.03)"
                    border="1px solid rgba(31, 58, 95, 0.05)"
                  >
                    <Text
                      fontSize="sm"
                      lineHeight="1.8"
                      color="var(--regular-color)"
                      whiteSpace="pre-wrap"
                      wordBreak="break-word"
                    >
                      {isExpanded ? fullText : previewText}
                      {!isExpanded && fullText !== previewText ? "..." : ""}
                    </Text>
                    {fullText !== previewText && (
                      <Button
                        onClick={() => setIsExpanded((prev) => !prev)}
                        variant="link"
                        color="var(--primary-green-color)"
                        fontSize="sm"
                        fontWeight="800"
                        mt={3}
                        _hover={{ textDecoration: "none" }}
                      >
                        {isExpanded ? "Read less" : "Read more"}
                      </Button>
                    )}
                  </Box>
                </SectionCard>

                <SectionCard
                  eyebrow="Doctor information"
                  title="Clinical details"
                  delay={0.1}
                >
                  <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                    <DetailTile
                      icon={FiLayers}
                      label="Speciality"
                      value={doctor?.specialization || "Not listed"}
                    />
                    <DetailTile
                      icon={FiClipboard}
                      label="Experience"
                      value={
                        doctor?.experience
                          ? `${doctor.experience} years`
                          : "Not listed"
                      }
                    />
                    <DetailTile
                      icon={FiBookOpen}
                      label="Education"
                      value={doctor?.education || "Not listed"}
                    />
                    <DetailTile
                      icon={FiDollarSign}
                      label="Consultation fee"
                      value={
                        doctor?.clinicFee ? `$${doctor.clinicFee}` : "Not listed"
                      }
                    />
                  </SimpleGrid>

                  <Box
                    p={4}
                    borderRadius="20px"
                    bg="rgba(31, 58, 95, 0.03)"
                    border="1px solid rgba(31, 58, 95, 0.05)"
                  >
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      letterSpacing="0.16em"
                      color="var(--secondary-gray-color)"
                      fontWeight="800"
                    >
                      Treatment areas
                    </Text>
                    <HStack spacing={2} mt={3} flexWrap="wrap">
                      {treatmentAreas.length > 0 ? (
                        treatmentAreas.map((area) => (
                          <Badge
                            key={area}
                            px={3}
                            py={1}
                            borderRadius="full"
                            bg="rgba(255,255,255,0.9)"
                            color="var(--heading-color)"
                            border="1px solid rgba(31, 58, 95, 0.08)"
                            textTransform="capitalize"
                            fontSize="10px"
                          >
                            {area}
                          </Badge>
                        ))
                      ) : (
                        <Text fontSize="sm" color="var(--regular-color)">
                          No treatment areas listed.
                        </Text>
                      )}
                    </HStack>
                  </Box>
                </SectionCard>

                <SectionCard
                  eyebrow="Clinic location"
                  title="Where patients can visit"
                  delay={0.15}
                >
                  <Box
                    p={4}
                    borderRadius="20px"
                    bg="rgba(31, 58, 95, 0.03)"
                    border="1px solid rgba(31, 58, 95, 0.05)"
                  >
                    <HStack spacing={3} align="flex-start">
                      <Box
                        flexShrink={0}
                        w="42px"
                        h="42px"
                        borderRadius="full"
                        bg="rgba(41, 128, 78, 0.1)"
                        color="var(--primary-green-color)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Box as={FiMapPin} fontSize="16px" />
                      </Box>
                      <Text fontSize="sm" color="var(--regular-color)" lineHeight="1.8">
                        {doctor?.clinicLocation?.name ||
                          "No-157, Bhagya Lakshmi, Sir Balchandra Road, Raja Shivaji Vidyalaya, Landmark : Near Podar College of Commerce."}
                      </Text>
                    </HStack>
                  </Box>
                </SectionCard>
              </Stack>

              <Stack spacing={5}>
                {doctor?.role === "doctor" ? (
                  <MotionBox
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
                  >
                    <ReviewPanel doctor={doctor} />
                  </MotionBox>
                ) : (
                  <SectionCard eyebrow="Document" title="Degree preview" delay={0.2}>
                    <Box
                      borderRadius="20px"
                      overflow="hidden"
                      border="1px solid rgba(31, 58, 95, 0.05)"
                      bg="rgba(31, 58, 95, 0.03)"
                    >
                      {doctor?.degree ? (
                        <iframe
                          src={doctor.degree}
                          style={{
                            width: "100%",
                            minHeight: "640px",
                            border: "none",
                            display: "block",
                          }}
                          title="Doctor Degree"
                        />
                      ) : (
                        <Box p={6}>
                          <Text fontSize="sm" color="var(--regular-color)">
                            No degree document uploaded yet.
                          </Text>
                        </Box>
                      )}
                    </Box>
                  </SectionCard>
                )}
              </Stack>
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default DocProf;
