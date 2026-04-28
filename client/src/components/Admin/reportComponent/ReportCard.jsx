import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import axios from "axios";
import { useAuthState } from "../../../context/AuthProvider";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { MotionBox } from "../adminPageComponent/AdminLayout";

const ReportCard = ({ report, setReports }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { user } = useAuthState();

  const createdAt = report?.createdAt;
  const timeAgo = createdAt ? moment(createdAt).fromNow() : "Unknown";
  const reportDate = createdAt ? moment(createdAt).format("MMM D, YYYY") : "Unknown date";

  const handleViewProfile = () => {
    if (!report?.doctor?._id) return;
    navigate(`/doctor-profile/${report.doctor._id}`);
  };

  const handleDelete = async () => {
    const token = user?.jwt;
    if (!token) return;

    setDeleteLoading(true);
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/v1/report/${report._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setReports((prevreport) =>
          prevreport.filter((item) => item._id !== report._id)
        );
        toast({
          title: data.message,
          status: "success",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
    } catch (error) {
      toast({
        title: error?.response?.data?.message || "Unable to delete report",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <MotionBox
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
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
          bg="linear-gradient(180deg, rgba(31, 58, 95, 0.04), rgba(255,255,255,0.22))"
          borderRight={{ base: "none", xl: "1px solid rgba(31, 58, 95, 0.06)" }}
          borderBottom={{ base: "1px solid rgba(31, 58, 95, 0.06)", xl: "none" }}
          boxShadow="inset 0 1px 0 rgba(255,255,255,0.6)"
        >
          <Stack spacing={3} align="center" textAlign="center" h="full">
            <Avatar
              src={report?.doctor?.image}
              name={report?.doctor?.name || "Doctor"}
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
                bg="rgba(239, 68, 68, 0.08)"
                color="rgb(185, 28, 28)"
                border="1px solid rgba(239, 68, 68, 0.12)"
                fontSize="10px"
                textTransform="uppercase"
                letterSpacing="0.16em"
              >
                Reported doctor
              </Badge>
              <Text
                fontSize="lg"
                fontWeight="800"
                color="var(--heading-color)"
                noOfLines={1}
              >
                Dr. {report?.doctor?.name || "Unknown doctor"}
              </Text>
              <Text fontSize="sm" color="var(--regular-color)" noOfLines={2}>
                {report?.doctor?.email || "No email provided"}
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
              <Box as={FiEye} fontSize="14px" />
              <Text fontSize="sm" fontWeight="700">
                View profile
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
                    User report
                  </Badge>
                  <Text
                    fontSize={{ base: "lg", md: "xl" }}
                    fontWeight="800"
                    color="var(--heading-color)"
                    letterSpacing="-0.03em"
                  >
                    Submitted {timeAgo}
                  </Text>
                  <Text fontSize="sm" color="var(--regular-color)">
                    {report?.user?.name || "Anonymous user"} filed this report.
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
                  {reportDate}
                </Badge>
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
                  bgGradient="linear(180deg, #ef4444, #b91c1c)"
                  opacity={0.9}
                />
                <Text
                  fontSize="sm"
                  fontWeight="800"
                  color="var(--secondary-gray-color)"
                  textTransform="uppercase"
                  letterSpacing="0.16em"
                  mb={2}
                >
                  Report details
                </Text>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.75"
                  color="var(--heading-color)"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                  pl={3}
                >
                  {report?.report || "No report text available."}
                </Text>
              </Box>
            </Stack>

            <Stack
              spacing={3}
              minW={{ base: "full", xl: "220px" }}
              align={{ base: "stretch", xl: "flex-end" }}
            >
              <Button
                onClick={handleViewProfile}
                h="48px"
                px={5}
                borderRadius="16px"
                border="1px solid rgba(31, 58, 95, 0.12)"
                bg="rgba(31, 58, 95, 0.04)"
                color="var(--heading-color)"
                fontSize="14px"
                fontWeight="800"
                leftIcon={<FiEye />}
                _hover={{
                  bg: "rgba(31, 58, 95, 0.08)",
                  transform: "translateY(-1px)",
                }}
              >
                View profile
              </Button>

              <Button
                onClick={!deleteLoading ? handleDelete : undefined}
                isLoading={deleteLoading}
                loadingText="Deleting..."
                isDisabled={deleteLoading}
                h="48px"
                px={5}
                borderRadius="16px"
                border="1px solid rgba(239, 68, 68, 0.18)"
                bg="rgba(239, 68, 68, 0.08)"
                color="rgb(185, 28, 28)"
                fontSize="14px"
                fontWeight="800"
                leftIcon={<FiTrash2 />}
                _hover={{
                  bg: "rgba(239, 68, 68, 0.12)",
                  transform: "translateY(-1px)",
                }}
              >
                Delete
              </Button>
            </Stack>
          </Flex>
        </Box>
      </Flex>
    </MotionBox>
  );
};

export default ReportCard;
