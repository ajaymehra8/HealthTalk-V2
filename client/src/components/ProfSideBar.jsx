import React from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Stack,
  Text,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthState } from "../context/AuthProvider";
import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";

const roleNavItems = {
  user: [
    { to: "my-info", icon: "bi bi-info-circle-fill", label: "Your Info" },
    { to: "my-reviews", icon: "bi bi-star-fill", label: "Reviews" },
    {
      to: "my-appoinment",
      icon: "fas fa-user-md",
      label: "Appointed Doctors",
    },
  ],
  admin: [
    { to: "my-info", icon: "bi bi-info-circle-fill", label: "Your Info" },
    {
      to: "approvals",
      icon: "bi bi-person-plus-fill",
      label: "Pending Approvals",
    },
    {
      to: "reports",
      icon: "bi bi-exclamation-circle-fill",
      label: "User Reports",
    },
    { to: "all-doctors", icon: "fas fa-user-md", label: "All Doctors" },
  ],
  doctor: [
    { to: "my-info", icon: "bi bi-info-circle-fill", label: "Your Info" },
    {
      to: "appoinments",
      icon: "bi bi-person-plus-fill",
      label: "Pending Appoinments",
    },
    { to: "my-reviews", icon: "bi bi-star-fill", label: "My Reviews" },
    { to: "earning", icon: "fas fa-user-md", label: "Earning" },
  ],
};

const MotionBox = motion(Box);

const ProfSideBar = ({ topOffset = 66 }) => {
  const { user, show, setShow, setUser } = useAuthState();
  const navigate = useNavigate();
  const toast = useToast();
  const handleButtonLeft = useBreakpointValue({
    base: show ? "calc(clamp(250px, 78vw, 320px) - 108px)" : "12px",
    lg: "calc(22% - 108px)",
  });

  const changeShow = () => {
    setShow(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    setShow(false);
    navigate("/");
    toast({
      title: "Log out successfully",
      position: "top",
      status: "success",
      isClosable: true,
      duration: 10000,
    });
  };

  const displayName = user?.name
    ? `${user.name.charAt(0).toUpperCase()}${user.name
        .slice(1)
        .toLowerCase()}`
    : "Profile";

  const navItems = roleNavItems[user?.role] || [];

  return (
    <>
      <Button
        display={{ base: "flex", lg: "none" }}
        position="fixed"
        top={`calc(${topOffset}px + 16px)`}
        left={handleButtonLeft}
        zIndex={1110}
        aria-label={show ? "Close profile menu" : "Open profile menu"}
        leftIcon={show ? <RxCross2 size={18} /> : <RxHamburgerMenu size={18} />}
        h="48px"
        minW="96px"
        px={4}
        borderRadius="full"
        bg="rgba(255, 255, 255, 0.92)"
        color="var(--heading-color)"
        border="1px solid var(--border-soft-color)"
        boxShadow="0 18px 32px rgba(31, 58, 95, 0.14)"
        backdropFilter="blur(16px)"
        transition="transform 0.25s ease, box-shadow 0.25s ease, left 0.35s ease, background 0.25s ease"
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "0 24px 38px rgba(31, 58, 95, 0.18)",
          bg: "rgba(255, 255, 255, 0.98)",
        }}
        onClick={() => setShow((prev) => !prev)}
      >
        {show ? "Close" : "Menu"}
      </Button>

      <Box
        display={{ base: show ? "block" : "none", lg: "none" }}
        position="fixed"
        top={`${topOffset}px`}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(9, 18, 31, 0.26)"
        backdropFilter="blur(4px)"
        zIndex={990}
        onClick={() => setShow(false)}
      />

      <MotionBox
        position="fixed"
        top={`${topOffset}px`}
        left={0}
        w={{ base: "clamp(250px, 78vw, 320px)", lg: "22%" }}
        h={`calc(100vh - ${topOffset}px)`}
        pt={6}
        px={5}
        pb={5}
        zIndex={1000}
        bgGradient="linear(160deg, var(--auth-panel-start) 0%, var(--auth-panel-mid) 46%, var(--auth-panel-end) 100%)"
        color="var(--profile-sidebar-text)"
        borderRight="1px solid var(--profile-sidebar-card-border)"
        boxShadow={{
          base: "0 20px 50px rgba(12, 24, 39, 0.42)",
          lg: "8px 0 30px rgba(12, 24, 39, 0.18)",
        }}
        backdropFilter="blur(20px)"
        overflowY="auto"
        transform={{
          base: show ? "translateX(0)" : "translateX(-104%)",
          lg: "translateX(0)",
        }}
        transition="transform 0.35s ease, box-shadow 0.35s ease"
      >
        <Stack spacing={5} align="stretch">
          <Box
            role="group"
            display="flex"
            flexDir="column"
            alignItems="center"
            gap={3}
          >
            <Box
              position="relative"
              w="fit-content"
              p="1.5"
              borderRadius="full"
              bg="rgba(255, 255, 255, 0.08)"
            >
              <Avatar
                src={user?.image || ""}
                name={user?.name || "Anonymous Member"}
                size="2xl"
                bg="var(--profile-sidebar-accent-bg)"
                color="white"
                border="4px solid rgba(255, 255, 255, 0.14)"
                boxShadow="0 18px 34px rgba(12, 24, 39, 0.22)"
              />
            </Box>

            <Stack spacing={1} align="center" textAlign="center" w="full">
              <Text
                fontSize="lg"
                fontWeight="700"
                letterSpacing="0.02em"
                noOfLines={1}
              >
                {displayName}
              </Text>
              <Text
                fontSize="sm"
                color="var(--profile-sidebar-text-muted)"
                noOfLines={2}
              >
                {user?.email}
              </Text>
            </Stack>
          </Box>

          {user?.role === "user" && user?.status && (
            <Box
              p={3}
              borderRadius="16px"
              bg="var(--profile-sidebar-card-bg)"
              border="1px solid var(--profile-sidebar-card-border)"
            >
              <Box display="flex" alignItems="center" gap={2}>
                {user?.status === "In process" && (
                  <Box as="i" className="bi bi-hourglass-split" />
                )}
                <Text as="span" fontSize="sm" fontWeight="600" color="white">
                  Your request in queue
                </Text>
              </Box>
            </Box>
          )}

          <Stack as="nav" spacing={3} w="full">
            {navItems.map((item) => (
              <Box
                key={item.to}
                as={NavLink}
                to={item.to}
                onClick={changeShow}
                display="flex"
                alignItems="center"
                gap={3}
                w="full"
                px={4}
                py={3}
                borderRadius="16px"
                border="1px solid"
                borderColor="transparent"
                textDecoration="none"
                fontSize="15px"
                fontWeight="600"
                transition="transform 0.2s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease"
                _hover={{
                  transform: "translateX(3px)",
                  bg: "var(--profile-sidebar-hover-bg)",
                  color: "var(--profile-sidebar-text)",
                }}
                style={({ isActive }) => ({
                  background: isActive
                    ? "var(--profile-sidebar-active-bg)"
                    : "transparent",
                  color: isActive
                    ? "var(--profile-sidebar-text)"
                    : "var(--profile-sidebar-text-muted)",
                  borderColor: isActive
                    ? "var(--profile-sidebar-card-border)"
                    : "transparent",
                  boxShadow: isActive
                    ? "inset 0 0 0 1px rgba(255,255,255,0.08)"
                    : "none",
                })}
              >
                <Box
                  as="i"
                  className={item.icon}
                  fontSize="15px"
                  flexShrink={0}
                />
                <Text>{item.label}</Text>
              </Box>
            ))}
          </Stack>

          <Box pt={2}>
            <Divider borderColor="var(--profile-sidebar-card-border)" mb={4} />
            <Button
              onClick={handleLogout}
              w="full"
              h="46px"
              borderRadius="16px"
              bg="linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)"
              color="white"
              border="1px solid rgba(248, 113, 113, 0.28)"
              boxShadow="0 18px 30px rgba(239, 68, 68, 0.24)"
              fontWeight="800"
              _hover={{
                bg: "linear-gradient(135deg, #f87171 0%, #dc2626 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 22px 34px rgba(239, 68, 68, 0.28)",
              }}
              transition="all 0.2s ease"
              leftIcon={<FiLogOut />}
            >
              Logout
            </Button>
          </Box>
        </Stack>
      </MotionBox>
    </>
  );
};

export default ProfSideBar;
