import React from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { FiSearch, FiUserPlus } from "react-icons/fi";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthState } from "../../context/AuthProvider";
import Logo from "../Logo/Logo";

const MotionBox = motion(Box);

const NAV_ITEMS = [
  { label: "Find Doctors", action: "login", icon: FiSearch },
  { label: "Apply as Doctor", action: "/doctor/form", icon: FiUserPlus },
];

const navButtonStyles = {
  h: "42px",
  px: 4,
  borderRadius: "full",
  fontSize: "sm",
  fontWeight: "800",
  letterSpacing: "-0.01em",
  transition: "all 0.2s ease",
};

const actionButtonStyles = {
  h: "42px",
  px: 5,
  borderRadius: "full",
  fontSize: "sm",
  fontWeight: "800",
  letterSpacing: "-0.01em",
  transition: "all 0.2s ease",
};

const DesktopNavButton = ({ icon: Icon, onClick, children, ...buttonProps }) => (
  <Button
    variant="ghost"
    onClick={onClick}
    leftIcon={Icon ? <Box as={Icon} /> : undefined}
    color="var(--heading-color)"
    _hover={{ bg: "rgba(31, 58, 95, 0.06)" }}
    {...navButtonStyles}
    {...buttonProps}
  >
    {children}
  </Button>
);

const MobileNavButton = ({ icon: Icon, onClick, children, ...buttonProps }) => (
  <Button
    onClick={onClick}
    leftIcon={Icon ? <Box as={Icon} /> : undefined}
    justifyContent="space-between"
    w="full"
    bg="rgba(31, 58, 95, 0.04)"
    color="var(--heading-color)"
    border="1px solid rgba(31,58,95,0.08)"
    _hover={{ bg: "rgba(31, 58, 95, 0.08)" }}
    {...navButtonStyles}
    {...buttonProps}
  >
    {children}
  </Button>
);

const PrimaryActionButton = ({ onClick, children, ...buttonProps }) => (
  <Button
    onClick={onClick}
    bg="linear-gradient(135deg, var(--primary-green-color), var(--auth-panel-end))"
    color="white"
    boxShadow="0 16px 28px rgba(41, 128, 78, 0.18)"
    _hover={{
      bg: "linear-gradient(135deg, var(--secondary-green-color), var(--primary-green-color))",
      transform: "translateY(-1px)",
    }}
    {...actionButtonStyles}
    {...buttonProps}
  >
    {children}
  </Button>
);

const SecondaryActionButton = ({ onClick, children, ...buttonProps }) => (
  <Button
    onClick={onClick}
    variant="ghost"
    color="var(--heading-color)"
    _hover={{ bg: "rgba(31, 58, 95, 0.06)" }}
    {...actionButtonStyles}
    {...buttonProps}
  >
    {children}
  </Button>
);

const ProfileButton = ({ user, onClick }) => (
  <Button
    as={NavLink}
    to="/my-profile"
    onClick={onClick}
    h="46px"
    px={{ base: 2, md: 3 }}
    borderRadius="full"
    bg="rgba(255,255,255,0.84)"
    color="var(--heading-color)"
    border="1px solid rgba(31,58,95,0.10)"
    boxShadow="0 14px 28px rgba(31, 58, 95, 0.08)"
    backdropFilter="blur(16px)"
    _hover={{
      bg: "rgba(255,255,255,0.96)",
      transform: "translateY(-1px)",
    }}
  >
    <HStack spacing={2}>
      <Avatar
        src={user?.image || ""}
        name={user?.name || "Anonymous Member"}
        size="sm"
        bg="var(--auth-soft-accent-bg)"
        color="var(--heading-color)"
        border="1px solid var(--auth-soft-accent-border)"
      />
      <Stack
        spacing={0}
        align="start"
        display={{ base: "none", md: "flex" }}
        lineHeight="1.1"
      >
        <Text fontSize="sm" fontWeight="800">
          My profile
        </Text>
        <Text fontSize="xs" color="var(--regular-color)">
          Account center
        </Text>
      </Stack>
    </HStack>
  </Button>
);

const Navbar = () => {
  const { user } = useAuthState();
  const navigate = useNavigate();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const goToLogin = () => {
    onClose();
    navigate("/login");
  };

  const goToSignup = () => {
    onClose();
    navigate("/signup");
  };

  const goToDoctorForm = () => {
    onClose();
    navigate("/doctor/form");
  };

  const goToProfile = () => {
    onClose();
    navigate("/my-profile");
  };

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1200}
      borderBottom="1px solid rgba(31,58,95,0.08)"
      bg="rgba(245, 247, 250, 0.82)"
      backdropFilter="blur(18px)"
      boxShadow="0 10px 30px rgba(31, 58, 95, 0.08)"
    >
      <Container maxW="7xl" px={{ base: 4, md: 6, xl: 8 }}>
        <Flex
          h={{ base: "64px", md: "72px" }}
          align="center"
          justify="space-between"
          gap={3}
        >
          <HStack spacing={{ base: 3, lg: 8 }} minW={0} flex="1">
            <Logo />

            <HStack display={{ base: "none", lg: "flex" }} spacing={2}>
              <DesktopNavButton icon={FiSearch} onClick={goToLogin}>
                Find Doctors
              </DesktopNavButton>
              <DesktopNavButton icon={FiUserPlus} onClick={goToDoctorForm}>
                Apply as Doctor
              </DesktopNavButton>
            </HStack>
          </HStack>

          <HStack spacing={2.5} flexShrink={0}>
            {user ? (
              <ProfileButton user={user} onClick={goToProfile} />
            ) : (
              <HStack display={{ base: "none", lg: "flex" }} spacing={2.5}>
                <SecondaryActionButton onClick={goToLogin}>
                  Login
                </SecondaryActionButton>
                <PrimaryActionButton onClick={goToSignup}>
                  Signup
                </PrimaryActionButton>
              </HStack>
            )}

            <IconButton
              display={{ base: "inline-flex", lg: "none" }}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              icon={isOpen ? <RxCross2 size={20} /> : <RxHamburgerMenu size={20} />}
              onClick={onToggle}
              h="44px"
              w="44px"
              borderRadius="full"
              border="1px solid rgba(31,58,95,0.10)"
              bg="rgba(255,255,255,0.92)"
              color="var(--heading-color)"
              boxShadow="0 12px 24px rgba(31, 58, 95, 0.08)"
              _hover={{ bg: "rgba(255,255,255,0.98)" }}
            />
          </HStack>
        </Flex>
      </Container>

      <AnimatePresence>
        {isOpen && (
          <>
            <MotionBox
              display={{ base: "block", lg: "none" }}
              position="fixed"
              top={{ base: "64px", md: "72px" }}
              left={0}
              right={0}
              bottom={0}
              bg="rgba(9, 18, 31, 0.28)"
              backdropFilter="blur(4px)"
              zIndex={1100}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />

            <MotionBox
              display={{ base: "block", lg: "none" }}
              position="fixed"
              top={{ base: "64px", md: "72px" }}
              left={0}
              right={0}
              zIndex={1110}
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <Container maxW="7xl" px={{ base: 4, md: 6, xl: 8 }}>
                <Box
                  mt={3}
                  p={4}
                  borderRadius="28px"
                  bg="rgba(255,255,255,0.94)"
                  border="1px solid rgba(31,58,95,0.08)"
                  boxShadow="0 24px 50px rgba(31, 58, 95, 0.16)"
                  backdropFilter="blur(20px)"
                >
                  <Stack spacing={4}>
                    <Stack spacing={3}>
                      {NAV_ITEMS.map((item) => (
                        <MobileNavButton
                          key={item.label}
                          icon={item.icon}
                          onClick={
                            item.action === "login"
                              ? goToLogin
                              : item.action === "/doctor/form"
                              ? goToDoctorForm
                              : onClose
                          }
                        >
                          {item.label}
                        </MobileNavButton>
                      ))}
                    </Stack>

                    <Divider borderColor="rgba(31,58,95,0.10)" />

                    {user ? (
                      <Button
                        onClick={goToProfile}
                        w="full"
                        h="56px"
                        justifyContent="flex-start"
                        px={3}
                        borderRadius="22px"
                        bg="rgba(31, 58, 95, 0.04)"
                        border="1px solid rgba(31,58,95,0.08)"
                        color="var(--heading-color)"
                        _hover={{ bg: "rgba(31, 58, 95, 0.08)" }}
                      >
                        <HStack spacing={3} w="full">
                          <Avatar
                            src={user?.image || ""}
                            name={user?.name || "Anonymous Member"}
                            size="sm"
                            bg="var(--auth-soft-accent-bg)"
                            color="var(--heading-color)"
                            border="1px solid var(--auth-soft-accent-border)"
                          />
                          <Stack spacing={0} align="start" minW={0}>
                            <Text fontSize="sm" fontWeight="800" noOfLines={1}>
                              {user?.name || "My profile"}
                            </Text>
                            <Text
                              fontSize="xs"
                              color="var(--regular-color)"
                              noOfLines={1}
                            >
                              Open your account
                            </Text>
                          </Stack>
                        </HStack>
                      </Button>
                    ) : (
                      <Stack spacing={3}>
                        <SecondaryActionButton onClick={goToLogin} w="full">
                          Login
                        </SecondaryActionButton>
                        <PrimaryActionButton onClick={goToSignup} w="full">
                          Signup
                        </PrimaryActionButton>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              </Container>
            </MotionBox>
          </>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Navbar;
