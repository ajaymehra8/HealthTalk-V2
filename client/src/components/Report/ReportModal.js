import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";
import { useAuthState } from "../../context/AuthProvider";
import axios from "axios";

const MotionBox = motion(Box);

function ReportModal({ isOpen, onClose, doctorId }) {
  const { user } = useAuthState();
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleReport = async () => {
    const token = user?.jwt;
    if (!user) {
      toast({
        title: "Please logged in first",
        status: "warning",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
      return;
    }

    if (!token) {
      return;
    }

    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      };

      if (report.length <= 3) {
        toast({
          title: "Write a valid report",
          status: "warning",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
        setLoading(false);
        return;
      }

      const body = {
        report,
        doctorId: doctorId,
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/report`,
        body,
        { headers }
      );

      if (data.success) {
        toast({
          title: data.message,
          status: "success",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
        setReport("");
        onClose();
      } else {
        console.log(data);
      }
    } catch (err) {
      toast({
        title: err.response.data.message,
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    }

    setLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="scale"
      scrollBehavior="inside"
    >
      <ModalOverlay
        bg="rgba(15, 23, 42, 0.48)"
        backdropFilter="blur(10px)"
      />
      <ModalContent
        mx={3}
        maxW={{ base: "calc(100vw - 1.5rem)", sm: "480px", md: "560px" }}
        bg="transparent"
        boxShadow="none"
        border="none"
      >
        <MotionBox
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          borderRadius="28px"
          overflow="hidden"
          bg="linear-gradient(180deg, var(--surface-strong-color), var(--surface-glass-color))"
          border="1px solid var(--border-soft-color)"
          boxShadow="var(--shadow-deep-color)"
          backdropFilter="blur(24px)"
        >
          <Box
            position="relative"
            px={{ base: 5, md: 6 }}
            pt={{ base: 5, md: 6 }}
            pb={5}
            bg="linear-gradient(135deg, rgba(31, 58, 95, 0.08), rgba(55, 189, 115, 0.08))"
            borderBottom="1px solid var(--border-soft-color)"
          >
            <HStack spacing={4} align="flex-start">
              <Box
                flexShrink={0}
                w="48px"
                h="48px"
                borderRadius="16px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="linear-gradient(135deg, rgba(41, 128, 78, 0.16), rgba(31, 58, 95, 0.14))"
                color="var(--primary-green-color)"
                border="1px solid var(--border-soft-color)"
                boxShadow="var(--shadow-soft-color)"
              >
                <Icon as={FiAlertTriangle} boxSize={5} />
              </Box>

              <Box flex="1" minW={0} pr={8}>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="700"
                  color="var(--heading-color)"
                  lineHeight="1.2"
                >
                  Report a concern
                </Text>
                <Text
                  mt={1}
                  fontSize="sm"
                  color="var(--regular-color)"
                  lineHeight="1.6"
                >
                  Share the issue clearly so it can be reviewed quickly.
                </Text>
              </Box>
            </HStack>

            <ModalCloseButton
              top={4}
              right={4}
              borderRadius="full"
              bg="var(--surface-strong-color)"
              border="1px solid var(--border-soft-color)"
              _hover={{ bg: "var(--surface-muted-color)" }}
            />
          </Box>

          <ModalBody px={{ base: 5, md: 6 }} py={5}>
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="700"
                  color="var(--subheading-color)"
                  textTransform="uppercase"
                  letterSpacing="0.08em"
                >
                  Details
                </Text>
                <Text mt={1} fontSize="sm" color="var(--regular-color)">
                  Be specific about the behavior, date, or anything that helps
                  the review team.
                </Text>
              </Box>

              <FormControl>
                <Textarea
                  placeholder="Write a report here."
                  value={report}
                  onChange={(e) => {
                    setReport(e.target.value);
                  }}
                  rows={6}
                  resize="vertical"
                  minH="180px"
                  borderRadius="20px"
                  border="1px solid var(--border-soft-color)"
                  bg="var(--surface-strong-color)"
                  color="var(--subheading-color)"
                  px={4}
                  py={3}
                  lineHeight="1.7"
                  _placeholder={{ color: "var(--auth-placeholder-color)" }}
                  _hover={{
                    borderColor: "rgba(31, 58, 95, 0.22)",
                  }}
                  _focusVisible={{
                    borderColor: "var(--secondary-green-color)",
                    boxShadow: "0 0 0 4px var(--auth-focus-ring)",
                  }}
                />
                <FormHelperText mt={3} fontSize="sm" color="var(--regular-color)">
                  Write at least a short explanation so the report can be processed.
                </FormHelperText>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter px={{ base: 5, md: 6 }} pb={{ base: 5, md: 6 }} pt={0}>
            <Button
              onClick={!loading ? handleReport : undefined}
              isDisabled={loading}
              h="48px"
              minW={{ base: "full", sm: "160px" }}
              px={6}
              borderRadius="16px"
              bg={loading ? "gray.400" : "var(--primary-green-color)"}
              color="white"
              fontWeight="700"
              boxShadow="0 12px 24px rgba(41, 128, 78, 0.18)"
              _hover={{
                bg: loading ? "gray.400" : "var(--secondary-green-color)",
              }}
              _active={{ transform: "translateY(1px)" }}
            >
              {!loading ? "Report" : "Wait..."}
            </Button>
          </ModalFooter>
        </MotionBox>
      </ModalContent>
    </Modal>
  );
}

export default ReportModal;
