import React from "react";
import moment from "moment";
import {
  Avatar,
  Badge,
  Box,
  Flex,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FiCalendar, FiCheckCircle, FiClock, FiVideo } from "react-icons/fi";
import { useAuthState } from "../../../context/AuthProvider";
import { MotionBox } from "../../Admin/adminPageComponent/AdminLayout";

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

const EarningCard = ({ appoinment, index = 0 }) => {
  const { user } = useAuthState();
  const clinicFee = Number(user?.clinicFee || 0);
  const completedAt = appoinment?.createdAt;
  const timeAgo = completedAt ? moment(completedAt).fromNow() : "Unknown";
  const completedDate = completedAt
    ? moment(completedAt).format("MMM D, YYYY")
    : "Unknown date";

  return (
    <MotionBox
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: "easeOut" }}
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
              src={appoinment?.user?.image}
              name={appoinment?.user?.name || "Patient"}
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
                Payment settled
              </Badge>
              <Text
                fontSize="lg"
                fontWeight="800"
                color="var(--heading-color)"
                noOfLines={1}
              >
                {appoinment?.user?.name || "Unknown patient"}
              </Text>
              <Text fontSize="sm" color="var(--regular-color)" noOfLines={2}>
                {appoinment?.user?.email || "No email provided"}
              </Text>
            </Stack>

            <HStack
              spacing={2}
              px={3}
              py={2}
              borderRadius="full"
              bg="rgba(31, 58, 95, 0.05)"
              color="var(--heading-color)"
            >
              <Box as={FiClock} fontSize="14px" />
              <Text fontSize="sm" fontWeight="700">
                {timeAgo}
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
                    Completed booking
                  </Badge>
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="800"
                    color="var(--heading-color)"
                    letterSpacing="-0.03em"
                  >
                    Revenue recorded on {completedDate}
                  </Text>
                  <Text fontSize="sm" color="var(--regular-color)">
                    Every paid booking is counted here and added to your total income.
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
                  + $ {clinicFee}
                </Badge>
              </Flex>

              <Flex wrap="wrap" gap={3}>
                <MetaPill
                  label="Mode"
                  value={appoinment?.mode || "Offline"}
                  icon={FiVideo}
                />
                <MetaPill
                  label="Payment"
                  value="Settled"
                  icon={FiCheckCircle}
                />
                <MetaPill
                  label="Booked"
                  value={completedDate}
                  icon={FiCalendar}
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
                  pl={3}
                >
                  Earning note
                </Text>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.75"
                  color="var(--heading-color)"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                  pl={3}
                >
                  This completed visit contributes directly to your total income.
                </Text>
              </Box>
            </Stack>

            <Stack
              spacing={3}
              minW={{ base: "full", xl: "220px" }}
              align={{ base: "stretch", xl: "flex-end" }}
            >
              <Box
                p={4}
                borderRadius="20px"
                bg="rgba(31, 58, 95, 0.03)"
                border="1px solid rgba(31, 58, 95, 0.05)"
              >
                <Text
                  fontSize="sm"
                  fontWeight="800"
                  color="var(--secondary-gray-color)"
                  textTransform="uppercase"
                  letterSpacing="0.16em"
                  mb={2}
                >
                  Revenue
                </Text>
                <Text
                  fontSize="2xl"
                  fontWeight="800"
                  color="var(--heading-color)"
                  lineHeight="1.1"
                >
                  $ {clinicFee}
                </Text>
                <Text fontSize="sm" color="var(--regular-color)" mt={2} lineHeight="1.6">
                  The booking payout has already been counted in the earnings total.
                </Text>
              </Box>
            </Stack>
          </Flex>
        </Box>
      </Flex>
    </MotionBox>
  );
};

export default EarningCard;
