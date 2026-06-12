import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiDownload,
  FiFile,
  FiPaperclip,
  FiRefreshCw,
  FiSend,
} from "react-icons/fi";
import moment from "moment";
import { useAuthState } from "../../context/AuthProvider";
import { useSocket } from "../../context/SocketProvider";
import {
  downloadDocument,
  getMessages,
  sendMessage,
  uploadDocument,
} from "../../Api/Chat";

const MotionBox = motion(Box);

const formatBytes = (bytes) => {
  if (!bytes) return "";
  const units = ["B", "KB", "MB"];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(value < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
};

const Chat = () => {
  const { bookingId } = useParams();
  const { user } = useAuthState();
  const socket = useSocket();
  const toast = useToast();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);

  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);
  const token = user?.jwt;

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  const loadMessages = useCallback(async () => {
    if (!token || !bookingId) return;
    setLoading(true);
    setError(null);
    try {
      const msgs = await getMessages(bookingId, token);
      setMessages(msgs);
      scrollToBottom();
    } catch (err) {
      const status = err?.response?.status;
      const fallback =
        status === 404
          ? "Chat service is unavailable. Make sure the server is running and up to date."
          : "Unable to open this conversation.";
      setError(err?.response?.data?.message || fallback);
    } finally {
      setLoading(false);
    }
  }, [bookingId, token, scrollToBottom]);

  // Initial load (re-runs if the booking or auth changes).
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Realtime: join the booking room and listen for new messages / typing.
  useEffect(() => {
    if (!socket || !bookingId) return undefined;

    socket.emit("join", bookingId);

    const handleNewMessage = (msg) => {
      if (msg.booking?.toString() !== bookingId) return;
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      scrollToBottom();
    };

    const handleTyping = ({ userId, isTyping }) => {
      if (userId !== user?._id) setOtherTyping(isTyping);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);

    return () => {
      socket.emit("leave", bookingId);
      socket.off("newMessage", handleNewMessage);
      socket.off("typing", handleTyping);
    };
  }, [socket, bookingId, user?._id, scrollToBottom]);

  const emitTyping = (isTyping) => {
    if (socket) socket.emit("typing", { bookingId, isTyping });
  };

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);
    emitTyping(false);
    try {
      const message = await sendMessage(bookingId, text, token);
      setMessages((prev) =>
        prev.some((m) => m._id === message._id) ? prev : [...prev, message]
      );
      setDraft("");
      scrollToBottom();
    } catch (err) {
      toast({
        title: err?.response?.data?.message || "Message could not be sent",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setSending(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    setUploading(true);
    try {
      const message = await uploadDocument(bookingId, file, token);
      setMessages((prev) =>
        prev.some((m) => m._id === message._id) ? prev : [...prev, message]
      );
      scrollToBottom();
    } catch (err) {
      toast({
        title: err?.response?.data?.message || "Document upload failed",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (message) => {
    try {
      const url = await downloadDocument(message._id, token);
      const link = document.createElement("a");
      link.href = url;
      link.download = message.file?.name || "document";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast({
        title: err?.response?.data?.message || "Download failed",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const otherParty = messages.find(
    (m) => m.sender?._id !== user?._id
  )?.sender;

  return (
    <Flex
      direction="column"
      w="full"
      h={{ base: "calc(100vh - 140px)", md: "calc(100vh - 160px)" }}
      borderRadius="28px"
      overflow="hidden"
      bg="linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,251,253,0.94))"
      boxShadow="0 22px 48px rgba(31, 58, 95, 0.08)"
      border="1px solid rgba(31, 58, 95, 0.06)"
    >
      {/* Header */}
      <HStack
        spacing={3}
        px={{ base: 4, md: 6 }}
        py={4}
        borderBottom="1px solid rgba(31, 58, 95, 0.06)"
        bg="linear-gradient(180deg, rgba(41, 128, 78, 0.06), rgba(255,255,255,0.2))"
      >
        <IconButton
          aria-label="Go back"
          icon={<FiArrowLeft />}
          onClick={() => navigate(-1)}
          variant="ghost"
          borderRadius="full"
          color="var(--heading-color)"
        />
        <Avatar
          size="md"
          src={otherParty?.image}
          name={otherParty?.name || "Conversation"}
          bg="var(--auth-soft-accent-bg)"
        />
        <Box minW={0}>
          <Text fontWeight="800" color="var(--heading-color)" noOfLines={1}>
            {otherParty?.name || "Secure conversation"}
          </Text>
          <Text fontSize="xs" color="var(--primary-green-color)" fontWeight="700">
            {otherTyping ? "typing…" : "End-to-end encrypted at rest"}
          </Text>
        </Box>
      </HStack>

      {/* Messages */}
      <Box
        ref={scrollRef}
        flex="1"
        overflowY="auto"
        px={{ base: 4, md: 6 }}
        py={5}
      >
        {loading ? (
          <Flex h="full" align="center" justify="center">
            <Spinner color="var(--primary-green-color)" />
          </Flex>
        ) : error ? (
          <Flex
            h="full"
            align="center"
            justify="center"
            direction="column"
            gap={4}
            textAlign="center"
            px={4}
          >
            <Flex
              w="56px"
              h="56px"
              borderRadius="full"
              align="center"
              justify="center"
              bg="rgba(239, 68, 68, 0.1)"
              color="rgb(185, 28, 28)"
            >
              <Box as={FiAlertCircle} fontSize="26px" />
            </Flex>
            <Box>
              <Text fontWeight="800" color="var(--heading-color)">
                Couldn't open this conversation
              </Text>
              <Text fontSize="sm" color="var(--regular-color)" mt={1} maxW="360px">
                {error}
              </Text>
            </Box>
            <HStack spacing={3}>
              <Button
                onClick={loadMessages}
                leftIcon={<FiRefreshCw />}
                borderRadius="14px"
                bg="var(--auth-soft-accent-bg)"
                color="var(--primary-green-color)"
                _hover={{ bg: "rgba(41, 128, 78, 0.14)" }}
              >
                Try again
              </Button>
              <Button
                onClick={() => navigate(-1)}
                variant="ghost"
                borderRadius="14px"
                color="var(--heading-color)"
              >
                Go back
              </Button>
            </HStack>
          </Flex>
        ) : messages.length === 0 ? (
          <Flex h="full" align="center" justify="center" direction="column" gap={2}>
            <Text color="var(--regular-color)" fontWeight="600">
              No messages yet
            </Text>
            <Text fontSize="sm" color="var(--secondary-gray-color)">
              Say hello or share a document to get started.
            </Text>
          </Flex>
        ) : (
          messages.map((msg) => {
            const mine = msg.sender?._id === user?._id;
            return (
              <MotionBox
                key={msg._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                display="flex"
                justifyContent={mine ? "flex-end" : "flex-start"}
                mb={3}
              >
                <Box
                  maxW="78%"
                  px={4}
                  py={3}
                  borderRadius="18px"
                  borderBottomRightRadius={mine ? "4px" : "18px"}
                  borderBottomLeftRadius={mine ? "18px" : "4px"}
                  bg={
                    mine
                      ? "linear-gradient(135deg, var(--primary-green-color), var(--secondary-green-color))"
                      : "rgba(31, 58, 95, 0.05)"
                  }
                  color={mine ? "white" : "var(--heading-color)"}
                  boxShadow={
                    mine ? "0 10px 22px rgba(41, 128, 78, 0.18)" : "none"
                  }
                >
                  {msg.type === "file" ? (
                    <HStack
                      spacing={3}
                      align="center"
                      cursor="pointer"
                      onClick={() => handleDownload(msg)}
                    >
                      <Flex
                        w="40px"
                        h="40px"
                        borderRadius="12px"
                        align="center"
                        justify="center"
                        bg={mine ? "rgba(255,255,255,0.2)" : "rgba(41,128,78,0.1)"}
                        color={mine ? "white" : "var(--primary-green-color)"}
                        flexShrink={0}
                      >
                        <Box as={FiFile} fontSize="18px" />
                      </Flex>
                      <Box minW={0}>
                        <Text fontWeight="700" fontSize="sm" noOfLines={1}>
                          {msg.file?.name || "Document"}
                        </Text>
                        <Text
                          fontSize="xs"
                          opacity={0.85}
                          noOfLines={1}
                        >
                          {formatBytes(msg.file?.size)}
                        </Text>
                      </Box>
                      <Box
                        as={FiDownload}
                        fontSize="18px"
                        flexShrink={0}
                        ml={1}
                      />
                    </HStack>
                  ) : (
                    <Text whiteSpace="pre-wrap" wordBreak="break-word">
                      {msg.text}
                    </Text>
                  )}
                  <Text
                    fontSize="10px"
                    mt={1}
                    textAlign="right"
                    opacity={0.7}
                  >
                    {moment(msg.createdAt).format("h:mm A")}
                  </Text>
                </Box>
              </MotionBox>
            );
          })
        )}
      </Box>

      {/* Composer */}
      <HStack
        spacing={2}
        px={{ base: 3, md: 5 }}
        py={3}
        borderTop="1px solid rgba(31, 58, 95, 0.06)"
        bg="rgba(255,255,255,0.7)"
        display={error ? "none" : "flex"}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <IconButton
          aria-label="Attach document"
          icon={uploading ? <Spinner size="sm" /> : <FiPaperclip />}
          onClick={() => fileInputRef.current?.click()}
          isDisabled={uploading}
          variant="ghost"
          borderRadius="full"
          color="var(--primary-green-color)"
        />
        <Input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            emitTyping(e.target.value.length > 0);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          onBlur={() => emitTyping(false)}
          placeholder="Type a secure message…"
          h="48px"
          borderRadius="16px"
          bg="white"
          border="1px solid rgba(31, 58, 95, 0.12)"
          _focus={{
            borderColor: "var(--primary-green-color)",
            boxShadow: "0 0 0 1px var(--primary-green-color)",
          }}
        />
        <IconButton
          aria-label="Send message"
          icon={<FiSend />}
          onClick={handleSend}
          isLoading={sending}
          isDisabled={!draft.trim()}
          h="48px"
          w="48px"
          borderRadius="16px"
          color="white"
          bg="linear-gradient(135deg, var(--primary-green-color), var(--auth-panel-end))"
          _hover={{
            bg: "linear-gradient(135deg, var(--secondary-green-color), var(--primary-green-color))",
          }}
        />
      </HStack>
    </Flex>
  );
};

export default Chat;
