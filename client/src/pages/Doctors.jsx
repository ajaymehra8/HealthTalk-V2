import React, { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { FiDollarSign, FiMapPin, FiRefreshCw, FiSliders, FiStar } from "react-icons/fi";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";
import DoctorCard from "../components/Doctors/DoctorCard";
import DoctorCardSkeleton from "../components/Doctors/DoctorCardSkelton";

const MotionBox = motion(Box);

const FILTERS = [
  { value: "all", label: "All doctors", icon: FiRefreshCw },
  { value: "near-me", label: "Near by me", icon: FiMapPin },
  { value: "rating", label: "Top rated", icon: FiStar },
  { value: "price", label: "By price", icon: FiDollarSign },
];

const Doctors = () => {
  const toast = useToast();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [locating, setLocating] = useState(false);

  const skeletonCount = useBreakpointValue({ base: 4, md: 6, xl: 8 }) ?? 4;

  const fetchDoctors = useCallback(
    async (filter = "all") => {
      setLoading(true);
      try {
        const config =
          filter === "rating" || filter === "price"
            ? { params: { filter } }
            : undefined;

        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/user`,
          config
        );

        setDoctors(data?.doctors ?? []);
      } catch (error) {
        setDoctors([]);
        toast({
          title: "Failed to load doctors",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const fetchNearbyDoctors = useCallback(
    (onSuccess) => {
      setLoading(true);
      setLocating(true);

      if (!navigator.geolocation) {
        toast({
          title: "Geolocation is not supported on this device",
          status: "warning",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
        setLoading(false);
        setLocating(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const { data } = await axios.get(
              `${process.env.REACT_APP_API_URL}/api/v1/user`,
              {
                params: {
                  lat: latitude,
                  lng: longitude,
                  filter: "location",
                },
              }
            );

            setDoctors(data?.doctors ?? []);
            onSuccess?.();
          } catch (error) {
            setDoctors([]);
            toast({
              title: "Unable to load nearby doctors",
              status: "error",
              isClosable: true,
              duration: 5000,
              position: "top",
            });
          } finally {
            setLoading(false);
            setLocating(false);
          }
        },
        () => {
          toast({
            title: "Location access is needed to show nearby doctors",
            status: "warning",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
          setLoading(false);
          setLocating(false);
        }
      );
    },
    [toast]
  );

  useEffect(() => {
    fetchDoctors("all");
  }, [fetchDoctors]);

  const handleFilterChange = (value, force = false) => {
    if (value === activeFilter && value !== "near-me" && !force) {
      return;
    }

    if (value === "near-me") {
      fetchNearbyDoctors(() => setActiveFilter("near-me"));
      return;
    }

    setActiveFilter(value);
    fetchDoctors(value);
  };

  const activeFilterLabel =
    FILTERS.find((filter) => filter.value === activeFilter)?.label ??
    "All doctors";

  return (
    <Box minH="100vh" bg="var(--page-background-color)">
      <Navbar />

      <Box position="relative" pt={{ base: "84px", md: "92px" }} pb={{ base: 12, md: 16 }}>
        <Box
          position="absolute"
          top="-40px"
          left="-40px"
          w="220px"
          h="220px"
          borderRadius="full"
          bg="rgba(55, 189, 115, 0.14)"
          filter="blur(30px)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          top="120px"
          right="-80px"
          w="280px"
          h="280px"
          borderRadius="full"
          bg="rgba(31, 58, 95, 0.10)"
          filter="blur(40px)"
          pointerEvents="none"
        />

        <Container maxW="7xl" px={{ base: 4, md: 6, xl: 8 }} position="relative">
          <MotionBox
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            borderRadius="32px"
            border="1px solid var(--border-soft-color)"
            bg="linear-gradient(135deg, rgba(255,255,255,0.88), rgba(255,255,255,0.74))"
            boxShadow="var(--shadow-elevated-color)"
            backdropFilter="blur(22px)"
            px={{ base: 5, md: 6, lg: 8 }}
            py={{ base: 6, md: 7, lg: 8 }}
            overflow="hidden"
          >
            <Stack spacing={4} maxW="3xl">
              <Badge
                alignSelf="flex-start"
                px={3}
                py={1.5}
                borderRadius="full"
                bg="rgba(41, 128, 78, 0.10)"
                color="var(--primary-green-color)"
                fontSize="xs"
                fontWeight="800"
                letterSpacing="0.08em"
                textTransform="uppercase"
              >
                Verified doctor directory
              </Badge>

              <Text
                as="h1"
                fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                fontWeight="800"
                color="var(--heading-color)"
                lineHeight="1.05"
                letterSpacing="-0.04em"
              >
                Find the right doctor for your next appointment.
              </Text>

              <Text
                fontSize={{ base: "md", md: "lg" }}
                color="var(--regular-color)"
                lineHeight="1.8"
                maxW="2xl"
              >
                Browse verified doctors, then sort them by rating, consultation
                fee, or the ones closest to your location.
              </Text>
            </Stack>

            <Flex
              mt={{ base: 6, md: 8 }}
              gap={3}
              direction={{ base: "column", sm: "row" }}
              align={{ base: "stretch", sm: "center" }}
              justify="space-between"
              wrap="wrap"
            >
              <HStack
                spacing={3}
                flexWrap="wrap"
                color="var(--subheading-color)"
                fontSize="sm"
                fontWeight="700"
              >
                <HStack
                  px={4}
                  py={2.5}
                  borderRadius="full"
                  bg="rgba(31, 58, 95, 0.06)"
                  border="1px solid rgba(31, 58, 95, 0.08)"
                >
                  <Icon as={FiSliders} color="var(--primary-green-color)" />
                  <Text>Smart filters</Text>
                </HStack>
                <HStack
                  px={4}
                  py={2.5}
                  borderRadius="full"
                  bg="rgba(41, 128, 78, 0.08)"
                  border="1px solid rgba(41, 128, 78, 0.12)"
                >
                  <Icon as={FiStar} color="var(--secondary-green-color)" />
                  <Text>{doctors.length || "0"} doctors</Text>
                </HStack>
              </HStack>

              <Text
                fontSize="sm"
                color="var(--regular-color)"
                textAlign={{ base: "left", sm: "right" }}
              >
                Active filter:{" "}
                <Text as="span" fontWeight="800" color="var(--subheading-color)">
                  {activeFilterLabel}
                </Text>
              </Text>
            </Flex>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: 0.08, ease: "easeOut" }}
            mt={{ base: 5, md: 6 }}
            p={{ base: 5, md: 6 }}
            borderRadius="28px"
            border="1px solid var(--border-soft-color)"
            bg="rgba(255, 255, 255, 0.70)"
            boxShadow="var(--shadow-soft-color)"
            backdropFilter="blur(18px)"
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              align={{ base: "flex-start", md: "center" }}
              justify="space-between"
              gap={4}
            >
              <Stack spacing={1}>
                <Text
                  fontSize="sm"
                  fontWeight="800"
                  textTransform="uppercase"
                  letterSpacing="0.1em"
                  color="var(--subheading-color)"
                >
                  Sort and filters
                </Text>
                <Text fontSize="sm" color="var(--regular-color)">
                  Pick the view that helps you find the right doctor faster.
                </Text>
              </Stack>

              {locating && (
                <HStack
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg="rgba(31, 58, 95, 0.06)"
                  border="1px solid rgba(31, 58, 95, 0.08)"
                >
                  <Spinner size="sm" color="var(--primary-green-color)" />
                  <Text fontSize="sm" fontWeight="700" color="var(--subheading-color)">
                    Looking near you
                  </Text>
                </HStack>
              )}
            </Flex>

            <Wrap mt={5} spacing={3}>
              {FILTERS.map((filter) => {
                const active = filter.value === activeFilter;
                return (
                  <WrapItem key={filter.value}>
                    <Button
                      onClick={() => handleFilterChange(filter.value)}
                      h="46px"
                      px={5}
                      borderRadius="full"
                      leftIcon={<Icon as={filter.icon} />}
                      bg={
                        active
                          ? "linear-gradient(135deg, var(--primary-green-color), var(--auth-panel-end))"
                          : "rgba(255,255,255,0.82)"
                      }
                      color={active ? "white" : "var(--heading-color)"}
                      border={
                        active
                          ? "1px solid transparent"
                          : "1px solid var(--border-soft-color)"
                      }
                      boxShadow={active ? "var(--shadow-panel-color)" : "none"}
                      _hover={{
                        transform: "translateY(-1px)",
                        bg: active
                          ? "linear-gradient(135deg, var(--secondary-green-color), var(--primary-green-color))"
                          : "rgba(255,255,255,0.94)",
                      }}
                      isDisabled={loading}
                    >
                      {filter.label}
                    </Button>
                  </WrapItem>
                );
              })}
            </Wrap>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: 0.12, ease: "easeOut" }}
            mt={{ base: 6, md: 8 }}
          >
            <Flex
              direction={{ base: "column", sm: "row" }}
              align={{ base: "flex-start", sm: "center" }}
              justify="space-between"
              gap={3}
              mb={5}
            >
              <Text fontSize="lg" fontWeight="800" color="var(--heading-color)">
                {loading ? "Loading doctors..." : `${doctors.length} doctors available`}
              </Text>
              <Text fontSize="sm" color="var(--regular-color)">
                Tap a card to open the full profile
              </Text>
            </Flex>

            <AnimatePresence mode="wait">
              <MotionBox
                key={activeFilter}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {loading ? (
                  <SimpleGrid
                    columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
                    spacing={{ base: 4, md: 6 }}
                  >
                    {Array.from({ length: skeletonCount }).map((_, index) => (
                      <Flex key={index} justify="center">
                        <DoctorCardSkeleton />
                      </Flex>
                    ))}
                  </SimpleGrid>
                ) : doctors.length > 0 ? (
                  <SimpleGrid
                    columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
                    spacing={{ base: 4, md: 6 }}
                  >
                    {doctors.map((doctor, index) => (
                      <MotionBox
                        key={doctor._id}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.26, delay: index * 0.03 }}
                        display="flex"
                        justifyContent="center"
                      >
                        <DoctorCard doctor={doctor} />
                      </MotionBox>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Box
                    p={{ base: 6, md: 10 }}
                    borderRadius="28px"
                    border="1px solid var(--border-soft-color)"
                    bg="rgba(255,255,255,0.8)"
                    boxShadow="var(--shadow-soft-color)"
                  >
                    <Stack spacing={3} maxW="lg">
                      <Text fontSize="xl" fontWeight="800" color="var(--heading-color)">
                        No doctors found
                      </Text>
                      <Text color="var(--regular-color)" lineHeight="1.8">
                        Try a different filter, or switch back to the full list to
                        browse every verified doctor on the platform.
                      </Text>
                      <Button
                        alignSelf="flex-start"
                        onClick={() => handleFilterChange("all", true)}
                        h="46px"
                        px={5}
                        borderRadius="full"
                        bg="var(--primary-green-color)"
                        color="white"
                        _hover={{ bg: "var(--secondary-green-color)" }}
                      >
                        Show all doctors
                      </Button>
                    </Stack>
                  </Box>
                )}
              </MotionBox>
            </AnimatePresence>
          </MotionBox>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Doctors;
