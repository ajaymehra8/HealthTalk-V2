import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

export const MotionBox = motion(Box);

export const AdminStatCard = ({ label, value, detail, icon: Icon }) => (
  <Box
    p={4}
    borderRadius="22px"
    bg="rgba(255,255,255,0.80)"
    border="1px solid rgba(31, 58, 95, 0.08)"
    boxShadow="0 16px 32px rgba(31, 58, 95, 0.06)"
    backdropFilter="blur(12px)"
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
        {Icon ? <Box as={Icon} fontSize="18px" /> : null}
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
          fontSize="2xl"
          fontWeight="800"
          color="var(--heading-color)"
          lineHeight="1.1"
        >
          {value}
        </Text>
        <Text fontSize="xs" color="var(--regular-color)" mt={1} noOfLines={2}>
          {detail}
        </Text>
      </Box>
    </HStack>
  </Box>
);

export const AdminPageHero = ({
  badge,
  title,
  description,
  stats = [],
  children,
}) => (
  <MotionBox
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, ease: "easeOut" }}
    p={{ base: 5, md: 6 }}
    borderRadius="28px"
    bg="linear-gradient(180deg, rgba(255,255,255,0.97), rgba(247,251,253,0.93))"
    border="1px solid rgba(31, 58, 95, 0.08)"
    boxShadow="0 24px 54px rgba(31, 58, 95, 0.08)"
    mb={5}
  >
    <Flex
      direction={{ base: "column", xl: "row" }}
      align={{ xl: "center" }}
      justify="space-between"
      gap={4}
    >
      <Stack spacing={2} maxW="2xl">
        {badge ? (
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
            {badge}
          </Badge>
        ) : null}
        <Text
          as="h1"
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="800"
          color="var(--heading-color)"
          letterSpacing="-0.03em"
        >
          {title}
        </Text>
        <Text fontSize="sm" color="var(--regular-color)" lineHeight="1.65">
          {description}
        </Text>
      </Stack>

      {children}
    </Flex>

    {stats.length > 0 ? (
      <Grid
        mt={5}
        templateColumns={{ base: "1fr", md: "repeat(2, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" }}
        gap={3}
      >
        {stats.map((stat) => (
          <AdminStatCard key={stat.label} {...stat} />
        ))}
      </Grid>
    ) : null}
  </MotionBox>
);

export const AdminPanel = ({
  children,
  minH = "auto",
  maxH,
  overflowY = "visible",
}) => (
  <MotionBox
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
    p={{ base: 4, md: 5 }}
    borderRadius="28px"
    bg="rgba(255,255,255,0.84)"
    border="1px solid rgba(255,255,255,0.72)"
    boxShadow="0 24px 54px rgba(31, 58, 95, 0.08)"
    backdropFilter="blur(18px)"
    minH={minH}
    maxH={maxH}
    overflowY={overflowY}
  >
    {children}
  </MotionBox>
);

export const AdminEmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <Flex
    minH={{ base: "52vh", md: "60vh" }}
    align="center"
    justify="center"
    textAlign="center"
    px={4}
  >
    <Stack spacing={3} maxW="sm" align="center">
      <Badge
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
        Empty state
      </Badge>
      <Text
        fontSize="xl"
        fontWeight="800"
        color="var(--heading-color)"
        letterSpacing="-0.03em"
      >
        {title}
      </Text>
      <Text fontSize="sm" color="var(--regular-color)" lineHeight="1.65">
        {description}
      </Text>
      {actionLabel && onAction ? (
        <Button
          onClick={onAction}
          h="44px"
          px={5}
          borderRadius="full"
          bg="linear-gradient(135deg, var(--primary-green-color), var(--auth-panel-end))"
          color="white"
          boxShadow="0 16px 28px rgba(41, 128, 78, 0.18)"
          _hover={{
            bg: "linear-gradient(135deg, var(--secondary-green-color), var(--primary-green-color))",
          }}
        >
          {actionLabel}
        </Button>
      ) : null}
    </Stack>
  </Flex>
);
