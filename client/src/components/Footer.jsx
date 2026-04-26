import React from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import Logo from "./Logo/Logo";

const MotionBox = motion(Box);

const footerBadges = ["Trusted care", "Patient first", "Doctor friendly"];
const footerLinks = [
  { label: "About us", to: "/" },
  { label: "Join us", to: "/doctor/form" },
];
const socialItems = [
  { label: "Facebook", icon: FaFacebookF },
  { label: "Instagram", icon: FaInstagram },
  { label: "LinkedIn", icon: FaLinkedinIn },
];

const SectionTitle = ({ children }) => (
  <Text
    fontSize="sm"
    fontWeight="800"
    letterSpacing="0.18em"
    textTransform="uppercase"
    color="var(--secondary-gray-color)"
  >
    {children}
  </Text>
);

const FooterLinkItem = ({ label, to }) => (
  <Button
    as={NavLink}
    to={to}
    variant="ghost"
    justifyContent="flex-start"
    w="fit-content"
    px={0}
    color="var(--heading-color)"
    _hover={{ bg: "transparent", color: "var(--primary-green-color)" }}
  >
    {label}
  </Button>
);

const SocialBadge = ({ label, icon: Icon }) => (
  <MotionBox
    whileHover={{ y: -3, scale: 1.02 }}
    transition={{ duration: 0.18 }}
    display="flex"
    alignItems="center"
    justifyContent="center"
    w="44px"
    h="44px"
    borderRadius="full"
    bg="rgba(255,255,255,0.82)"
    border="1px solid rgba(31,58,95,0.08)"
    color="var(--heading-color)"
    boxShadow="0 10px 22px rgba(31,58,95,0.06)"
    title={label}
  >
    <Box as={Icon} fontSize="16px" />
  </MotionBox>
);

const Footer = () => {
  return (
    <Box
      as="footer"
      mt={{ base: 12, md: 16 }}
      py={{ base: 10, md: 14 }}
      px={'var(--page-padding-x)'}
      position="relative"
      overflow="hidden"
      bg="linear-gradient(180deg, rgba(247,251,253,0.88), rgba(237,244,251,0.96))"
      borderTop="1px solid rgba(31,58,95,0.08)"
    >
      <Box
        position="absolute"
        top="-120px"
        right="-80px"
        w="320px"
        h="320px"
        borderRadius="full"
        bg="rgba(55, 189, 115, 0.12)"
        filter="blur(90px)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-130px"
        left="-90px"
        w="340px"
        h="340px"
        borderRadius="full"
        bg="rgba(31, 58, 95, 0.10)"
        filter="blur(90px)"
        pointerEvents="none"
      />

      <Box w="full" position="relative" zIndex={1}>
        <Stack spacing={10}>
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={8}>
            <Stack spacing={4}>
              <Logo />
              <Text
                fontSize="sm"
                lineHeight="1.8"
                color="var(--regular-color)"
                maxW="sm"
              >
                A calmer way to connect patients, doctors, and care teams with a
                cleaner, more trustworthy digital experience.
              </Text>

              <HStack spacing={2} flexWrap="wrap">
                {footerBadges.map((badge) => (
                  <Badge
                    key={badge}
                    px={3}
                    py={1.5}
                    borderRadius="full"
                    bg="rgba(41, 128, 78, 0.10)"
                    color="var(--primary-green-color)"
                    fontSize="10px"
                    fontWeight="800"
                    letterSpacing="0.12em"
                    textTransform="uppercase"
                  >
                    {badge}
                  </Badge>
                ))}
              </HStack>
            </Stack>

            <Stack spacing={4}>
              <SectionTitle>Quick links</SectionTitle>
              <Stack spacing={2} align="flex-start">
                {footerLinks.map((link) => (
                  <FooterLinkItem key={link.label} label={link.label} to={link.to} />
                ))}
              </Stack>
            </Stack>

            <Stack spacing={4}>
              <SectionTitle>Stay connected</SectionTitle>
              <HStack spacing={3}>
                {socialItems.map((item) => (
                  <SocialBadge key={item.label} label={item.label} icon={item.icon} />
                ))}
              </HStack>
              <Text fontSize="sm" color="var(--regular-color)" lineHeight="1.7">
                Follow the journey, see product updates, and stay close to what
                we&apos;re improving next.
              </Text>
            </Stack>
          </SimpleGrid>

          <Divider borderColor="rgba(31,58,95,0.08)" />

          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            gap={3}
          >
            <Text fontSize="sm" color="var(--regular-color)">
              2024 HealthTalk. All rights reserved.
            </Text>
            <Text fontSize="sm" color="var(--regular-color)">
              Designed with a softer, more focused care experience.
            </Text>
          </Flex>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
