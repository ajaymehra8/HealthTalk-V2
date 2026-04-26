import React from "react";
import {
  Avatar,
  Badge,
  Box,
  Flex,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const ReviewCard = ({ review }) => {
  const ratingValue = Number(review?.rating || 0);
  const patientName = review?.user?.name || "Anonymous member";

  return (
    <MotionBox
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -2 }}
      w="100%"
      border="1px solid"
      borderColor="rgba(31, 58, 95, 0.08)"
      borderRadius="20px"
      overflow="hidden"
      bg="linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,251,253,0.92))"
      boxShadow="0 14px 30px rgba(31, 58, 95, 0.06)"
    >
      <Flex direction={{ base: "column", sm: "row" }} align="stretch">
        <Box
          w={{ base: "full", sm: "190px" }}
          p={4}
          bg="rgba(31, 58, 95, 0.03)"
          borderRight={{ base: "none", sm: "1px solid rgba(31, 58, 95, 0.08)" }}
          borderBottom={{ base: "1px solid rgba(31, 58, 95, 0.08)", sm: "none" }}
        >
          <Stack spacing={3} align="center" textAlign="center">
            <Avatar
              src={review?.user?.image}
              name={patientName}
              size="lg"
              bg="var(--auth-soft-accent-bg)"
              color="var(--heading-color)"
              border="4px solid rgba(255,255,255,0.82)"
              boxShadow="0 12px 26px rgba(31, 58, 95, 0.1)"
            />
            <Stack spacing={1} align="center">
              <Badge
                px={3}
                py={1}
                borderRadius="full"
                bg="rgba(41, 128, 78, 0.08)"
                color="var(--primary-green-color)"
                border="1px solid rgba(41, 128, 78, 0.12)"
                fontSize="10px"
                textTransform="uppercase"
                letterSpacing="0.14em"
              >
                Patient
              </Badge>
              <Text
                fontSize="sm"
                fontWeight="800"
                color="var(--heading-color)"
                noOfLines={1}
              >
                {patientName.split(" ")[0]}
              </Text>
            </Stack>
          </Stack>
        </Box>

        <Box flex="1" p={4}>
          <Stack spacing={3}>
            <Box
              p={4}
              borderRadius="18px"
              bg="rgba(31, 58, 95, 0.03)"
              border="1px solid rgba(31, 58, 95, 0.06)"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                top="-18px"
                right="-10px"
                fontSize="58px"
                color="rgba(31, 58, 95, 0.08)"
                fontWeight="900"
                lineHeight="1"
              >
                “
              </Box>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                lineHeight="1.7"
                color="var(--heading-color)"
                position="relative"
                zIndex={1}
              >
                {review?.text}
              </Text>
            </Box>

            <Flex
              align="center"
              justify="space-between"
              gap={3}
              wrap="wrap"
            >
              <HStack spacing={1}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <Box key={index} as="span" lineHeight="1">
                    <i
                      className={
                        index <= ratingValue ? "bi bi-star-fill" : "bi bi-star"
                      }
                      style={{
                        color:
                          index <= ratingValue
                            ? "#f5b301"
                            : "rgba(148, 163, 184, 0.55)",
                        fontSize: "14px",
                      }}
                    />
                  </Box>
                ))}
              </HStack>

              <Text fontSize="xs" color="var(--secondary-gray-color)">
                Feedback recorded
              </Text>
            </Flex>
          </Stack>
        </Box>
      </Flex>
    </MotionBox>
  );
};

export default ReviewCard;
