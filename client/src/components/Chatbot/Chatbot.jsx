import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiMessageCircle, FiSend, FiStar, FiX } from "react-icons/fi";
import { sendChat } from "../../Api/Assistant";

const MotionBox = motion(Box);

const GREETING = {
  role: "Assistant",
  text: 'Hi! I\'m HealthBot 👋 I can help you find doctors, book appointments, or explain how HealthTalk works. Try "find the nearest gynecologist".',
  doctors: [],
};

const DoctorCard = ({ doctor, onOpen }) => (
  <Box
    onClick={() => onOpen(doctor.id)}
    cursor="pointer"
    p={3}
    borderRadius="14px"
    bg="white"
    border="1px solid rgba(31, 58, 95, 0.08)"
    _hover={{
      borderColor: "var(--primary-green-color)",
      transform: "translateY(-1px)",
    }}
    transition="all 0.2s ease"
  >
    <HStack spacing={3} align="center">
      <Avatar size="sm" src={doctor.image} name={doctor.name} />
      <Box minW={0} flex="1">
        <Text
          fontWeight="800"
          fontSize="sm"
          color="var(--heading-color)"
          noOfLines={1}
        >
          {doctor.name}
        </Text>
        <Text fontSize="xs" color="var(--regular-color)" noOfLines={1}>
          {doctor.specialization}
        </Text>
        <HStack
          spacing={3}
          mt={1}
          fontSize="11px"
          color="var(--secondary-gray-color)"
        >
          {doctor.clinicFee != null && (
            <Text fontWeight="700" color="var(--primary-green-color)">
              ${doctor.clinicFee}
            </Text>
          )}
          {doctor.distanceKm != null && (
            <HStack spacing={1}>
              <Box as={FiMapPin} />
              <Text>{doctor.distanceKm} km</Text>
            </HStack>
          )}
          {doctor.avgRating > 0 && (
            <HStack spacing={1}>
              <Box as={FiStar} />
              <Text>{Number(doctor.avgRating).toFixed(1)}</Text>
            </HStack>
          )}
        </HStack>
      </Box>
    </HStack>
  </Box>
);

const Chatbot = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const scrollRef = useRef(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  // Ask for location once when the panel first opens (used for "nearest doctor").
  useEffect(() => {
    if (open && !location && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => {}, // denied/unavailable — bot falls back to top-rated doctors
      );
    }
  }, [open, location]);

  useEffect(scrollToBottom, [messages, loading, open]);

  const openDoctor = (id) => {
    navigate(`/doctor-profile/${id}`);
    setOpen(false);
  };

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", text }];
    setMessages(next);
    setDraft("");
    setLoading(true);
    try {
      const payload = next.map(({ role, text }) => ({ role, text }));
      const data = await sendChat(payload, location);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "Sorry, I couldn't process that.",
          doctors: data.doctors || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            err?.response?.data?.message ||
            "I'm having trouble responding right now. Please try again.",
          doctors: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating launcher */}
      <IconButton
        aria-label="Open HealthBot"
        icon={open ? <FiX /> : <FiMessageCircle />}
        onClick={() => setOpen((o) => !o)}
        position="fixed"
        bottom={{ base: "20px", md: "28px" }}
        right={{ base: "20px", md: "28px" }}
        zIndex={1400}
        w="60px"
        h="60px"
        fontSize="24px"
        borderRadius="full"
        color="white"
        bg="linear-gradient(135deg, var(--primary-green-color), var(--secondary-green-color))"
        boxShadow="0 14px 30px rgba(41, 128, 78, 0.35)"
        _hover={{ transform: "scale(1.05)" }}
      />

      <AnimatePresence>
        {open && (
          <MotionBox
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            position="fixed"
            bottom={{ base: "92px", md: "100px" }}
            right={{ base: "16px", md: "28px" }}
            zIndex={1400}
            w={{ base: "calc(100vw - 32px)", md: "380px" }}
            h={{ base: "70vh", md: "520px" }}
            borderRadius="22px"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            bg="white"
            boxShadow="0 24px 60px rgba(31, 58, 95, 0.25)"
            border="1px solid rgba(31, 58, 95, 0.08)"
          >
            {/* Header */}
            <HStack
              spacing={3}
              px={4}
              py={3}
              bg="linear-gradient(135deg, var(--primary-green-color), var(--secondary-green-color))"
              color="white"
            >
              <Flex
                w="38px"
                h="38px"
                borderRadius="full"
                align="center"
                justify="center"
                bg="rgba(255,255,255,0.2)"
              >
                <Box as={FiMessageCircle} fontSize="20px" />
              </Flex>
              <Box>
                <Text fontWeight="800">HealthBot</Text>
                <Text fontSize="11px" opacity={0.9}>
                  Find doctors • Ask anything
                </Text>
              </Box>
            </HStack>

            {/* Messages */}
            <Box
              ref={scrollRef}
              flex="1"
              overflowY="auto"
              px={3}
              py={4}
              bg="#f7fbfd"
            >
              <VStack align="stretch" spacing={3}>
                <Box
                  maxW="85%"
                  px={3}
                  py={2}
                  borderRadius="14px"
                  fontSize="sm"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                  bg={"white"}
                  color={"var(--heading-color)"}
                  border={"1px solid rgba(31, 58, 95, 0.08)"}
                  boxShadow={"none"}
                >
                  {GREETING.text}
                </Box>
                {messages.map((m, i) => (
                  <Box key={i}>
                    <Flex
                      justify={m.role === "user" ? "flex-end" : "flex-start"}
                    >
                      <Box
                        maxW="85%"
                        px={3}
                        py={2}
                        borderRadius="14px"
                        fontSize="sm"
                        whiteSpace="pre-wrap"
                        wordBreak="break-word"
                        bg={
                          m.role === "user"
                            ? "linear-gradient(135deg, var(--primary-green-color), var(--secondary-green-color))"
                            : "white"
                        }
                        color={
                          m.role === "user" ? "white" : "var(--heading-color)"
                        }
                        border={
                          m.role === "user"
                            ? "none"
                            : "1px solid rgba(31, 58, 95, 0.08)"
                        }
                        boxShadow={
                          m.role === "user"
                            ? "0 8px 18px rgba(41,128,78,0.18)"
                            : "none"
                        }
                      >
                        {m.text}
                      </Box>
                    </Flex>

                    {m.doctors?.length > 0 && (
                      <VStack align="stretch" spacing={2} mt={2}>
                        {m.doctors.map((d) => (
                          <DoctorCard
                            key={d.id}
                            doctor={d}
                            onOpen={openDoctor}
                          />
                        ))}
                      </VStack>
                    )}
                  </Box>
                ))}

                {loading && (
                  <Flex justify="flex-start">
                    <HStack
                      px={3}
                      py={2}
                      borderRadius="14px"
                      bg="white"
                      border="1px solid rgba(31, 58, 95, 0.08)"
                      spacing={2}
                    >
                      <Spinner size="xs" color="var(--primary-green-color)" />
                      <Text fontSize="xs" color="var(--regular-color)">
                        HealthBot is typing…
                      </Text>
                    </HStack>
                  </Flex>
                )}
              </VStack>
            </Box>

            {/* Composer */}
            <HStack
              spacing={2}
              p={3}
              borderTop="1px solid rgba(31, 58, 95, 0.08)"
            >
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask HealthBot…"
                h="44px"
                borderRadius="14px"
                bg="#f7fbfd"
                border="1px solid rgba(31, 58, 95, 0.12)"
                _focus={{
                  borderColor: "var(--primary-green-color)",
                  boxShadow: "0 0 0 1px var(--primary-green-color)",
                }}
              />
              <IconButton
                aria-label="Send"
                icon={<FiSend />}
                onClick={handleSend}
                isDisabled={!draft.trim() || loading}
                h="44px"
                w="44px"
                borderRadius="14px"
                color="white"
                bg="linear-gradient(135deg, var(--primary-green-color), var(--secondary-green-color))"
                _hover={{ opacity: 0.92 }}
              />
            </HStack>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
