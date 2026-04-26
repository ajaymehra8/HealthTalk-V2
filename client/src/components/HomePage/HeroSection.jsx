import React from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import {
  FiArrowRight,
  FiClock,
  FiHeart,
  FiShield,
  FiStar,
} from "react-icons/fi";

const MotionBox = motion(Box);
const MotionImage = motion(Image);

const heroHighlights = [
  { icon: FiShield, label: "Verified doctors" },
  { icon: FiClock, label: "24/7 booking" },
  { icon: FiHeart, label: "Patient-first care" },
];

const heroStats = [
  { value: "250+", label: "Trusted doctors" },
  { value: "4.9/5", label: "Patient rating" },
  { value: "10 min", label: "Fast booking" },
];

const HeroStat = ({ value, label }) => (
  <MotionBox
    whileHover={{ y: -3 }}
    transition={{ duration: 0.18 }}
    flex="1 1 160px"
    minW={{ base: "140px", sm: "160px" }}
    px={4}
    py={3.5}
    borderRadius="22px"
    bg="rgba(255,255,255,0.82)"
    border="1px solid rgba(31,58,95,0.08)"
    boxShadow="0 16px 32px rgba(31,58,95,0.08)"
    backdropFilter="blur(16px)"
  >
    <Text
      fontSize={{ base: "xl", md: "2xl" }}
      fontWeight="800"
      color="var(--heading-color)"
      letterSpacing="-0.03em"
      lineHeight="1"
    >
      {value}
    </Text>
    <Text mt={1} fontSize="xs" fontWeight="700" color="var(--regular-color)">
      {label}
    </Text>
  </MotionBox>
);

const HighlightPill = ({ icon: Icon, label }) => (
  <HStack
    spacing={2}
    px={3.5}
    py={2}
    borderRadius="full"
    bg="rgba(255,255,255,0.8)"
    border="1px solid rgba(31,58,95,0.08)"
    boxShadow="0 12px 24px rgba(31,58,95,0.06)"
    backdropFilter="blur(16px)"
  >
    <Box as={Icon} color="var(--primary-green-color)" fontSize="14px" />
    <Text fontSize="sm" fontWeight="700" color="var(--heading-color)">
      {label}
    </Text>
  </HStack>
);

const HeroSection = () => {
  const scrollToDoctors = React.useCallback(() => {
    const target = document.getElementById("doctors");
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      w="full"
      pt={{ base: "92px", md: "104px", xl: "116px" }}
      pb={{ base: 14, md: 18, xl: 24 }}
      bgGradient="linear(180deg, #edf4fb 0%, #f5f8fc 45%, #eef5f7 100%)"
    >
      <Box
        position="absolute"
        top="-140px"
        right="-80px"
        w="360px"
        h="360px"
        borderRadius="full"
        bg="rgba(55, 189, 115, 0.14)"
        filter="blur(100px)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-160px"
        left="-100px"
        w="380px"
        h="380px"
        borderRadius="full"
        bg="rgba(31, 58, 95, 0.10)"
        filter="blur(100px)"
        pointerEvents="none"
      />

      <Container maxW="7xl" px={{ base: 4, md: 6, xl: 8 }} position="relative" zIndex={1}>
        <SimpleGrid columns={{ base: 1, xl: 2 }} gap={{ base: 10, xl: 14 }} alignItems="center">
          <Stack
            spacing={{ base: 6, md: 7 }}
            align={{ base: "center", xl: "flex-start" }}
            textAlign={{ base: "center", xl: "left" }}
          >
            <Badge
              w="fit-content"
              px={3}
              py={1}
              borderRadius="full"
              bg="rgba(41, 128, 78, 0.12)"
              color="var(--primary-green-color)"
              fontSize="10px"
              letterSpacing="0.24em"
              textTransform="uppercase"
              fontWeight="800"
            >
              Trusted healthcare platform
            </Badge>

            <Stack spacing={4} maxW="3xl" align={{ base: "center", xl: "flex-start" }}>
              <Heading
                as="h1"
                fontSize={{ base: "3xl", sm: "4xl", md: "5xl", xl: "6xl" }}
                lineHeight="1.04"
                letterSpacing="-0.05em"
                color="var(--heading-color)"
              >
                Guiding you to better patient outcomes
              </Heading>

              <Text
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.8"
                color="var(--regular-color)"
                maxW="2xl"
              >
                Connect with verified doctors, book appointments in a few taps,
                and manage clinic care with a calmer, more modern experience.
              </Text>
            </Stack>

            <HStack
              spacing={3}
              flexWrap="wrap"
              justify={{ base: "center", xl: "flex-start" }}
            >
              {heroHighlights.map((item) => (
                <HighlightPill key={item.label} icon={item.icon} label={item.label} />
              ))}
            </HStack>

            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={3}
              align={{ base: "stretch", sm: "center" }}
              w={{ base: "full", sm: "auto" }}
            >
              <Button
                onClick={scrollToDoctors}
                h="48px"
                px={6}
                borderRadius="full"
                bg="linear-gradient(135deg, var(--primary-green-color), var(--auth-panel-end))"
                color="white"
                fontWeight="800"
                boxShadow="0 18px 34px rgba(41, 128, 78, 0.2)"
                _hover={{
                  bg: "linear-gradient(135deg, var(--secondary-green-color), var(--primary-green-color))",
                  transform: "translateY(-1px)",
                }}
                rightIcon={<FiArrowRight />}
                w={{ base: "full", sm: "auto" }}
              >
                Find a doctor
              </Button>

              <Button
                as={RouterLink}
                to="/doctor/form"
                h="48px"
                px={6}
                borderRadius="full"
                bg="rgba(255,255,255,0.82)"
                color="var(--heading-color)"
                border="1px solid rgba(31,58,95,0.10)"
                fontWeight="800"
                boxShadow="0 14px 28px rgba(31,58,95,0.08)"
                _hover={{
                  bg: "rgba(255,255,255,0.96)",
                  transform: "translateY(-1px)",
                }}
                w={{ base: "full", sm: "auto" }}
              >
                Apply as doctor
              </Button>
            </Stack>

            <Flex
              w="full"
              wrap="wrap"
              gap={3}
              justify={{ base: "center", xl: "flex-start" }}
            >
              {heroStats.map((stat) => (
                <HeroStat key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </Flex>
          </Stack>

          <Box
            position="relative"
            w="full"
            maxW={{ base: "100%", xl: "560px" }}
            justifySelf={{ xl: "end" }}
          >
            <MotionBox
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              position="relative"
              borderRadius={{ base: "28px", md: "34px" }}
              overflow="hidden"
              minH={{ base: "300px", md: "420px", xl: "520px" }}
              bg="linear-gradient(180deg, rgba(255,255,255,0.9), rgba(247,251,253,0.8))"
              border="1px solid rgba(31,58,95,0.08)"
              boxShadow="0 30px 70px rgba(31,58,95,0.16)"
            >
              <MotionImage
                src="/images/hero.png"
                alt="Doctor using a tablet in a clinic"
                w="full"
                h="full"
                objectFit="cover"
                objectPosition={{ base: "72% center", md: "center center" }}
                initial={{ scale: 1.04 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />

              <Box
                position="absolute"
                inset={0}
                bgGradient="linear(180deg, rgba(15,23,42,0.02) 0%, rgba(15,23,42,0.10) 100%)"
              />

              <MotionBox
                position="absolute"
                top={{ base: 4, md: 6 }}
                right={{ base: 4, md: 6 }}
                px={3.5}
                py={2}
                borderRadius="full"
                bg="rgba(255,255,255,0.88)"
                border="1px solid rgba(31,58,95,0.08)"
                boxShadow="0 14px 28px rgba(31,58,95,0.08)"
                backdropFilter="blur(16px)"
                display={{ base: "none", md: "flex" }}
                alignItems="center"
                gap={2}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
              >
                <Box
                  w="10px"
                  h="10px"
                  borderRadius="full"
                  bg="var(--secondary-green-color)"
                  boxShadow="0 0 0 4px rgba(55,189,115,0.14)"
                />
                <Text fontSize="sm" fontWeight="800" color="var(--heading-color)">
                  Verified doctors
                </Text>
              </MotionBox>

              <MotionBox
                position="absolute"
                left={{ base: 4, md: 6 }}
                bottom={{ base: 4, md: 6 }}
                maxW={{ base: "calc(100% - 32px)", md: "280px" }}
                px={4}
                py={3.5}
                borderRadius="24px"
                bg="rgba(255,255,255,0.9)"
                border="1px solid rgba(31,58,95,0.08)"
                boxShadow="0 18px 34px rgba(31,58,95,0.12)"
                backdropFilter="blur(18px)"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, duration: 0.35 }}
              >
                <HStack spacing={3} align="start">
                  <Avatar
                    size="sm"
                    bg="var(--auth-soft-accent-bg)"
                    color="var(--heading-color)"
                    border="1px solid var(--auth-soft-accent-border)"
                    icon={<FiStar color="var(--primary-green-color)" />}
                  />
                  <Stack spacing={0}>
                    <Text fontSize="sm" fontWeight="800" color="var(--heading-color)">
                      Book in minutes
                    </Text>
                    <Text fontSize="xs" color="var(--regular-color)" lineHeight="1.6">
                      Find the right doctor and schedule your visit without the noise.
                    </Text>
                  </Stack>
                </HStack>
              </MotionBox>
            </MotionBox>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default HeroSection;
