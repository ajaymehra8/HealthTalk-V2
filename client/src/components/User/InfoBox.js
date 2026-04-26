import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const InfoBox = ({ info, index = 0 }) => {
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState("");
  const fieldRef = useRef(null);

  const rawValue =
    typeof info?.value === "string" ? info.value : `${info?.value ?? ""}`;
  const isFilled = Boolean(info?.color);
  const isLongField = info?.title === "Description";

  useEffect(() => {
    if (!edit) {
      setDraft(isFilled ? rawValue : "");
    }
  }, [edit, isFilled, rawValue]);

  useEffect(() => {
    if (edit) {
      requestAnimationFrame(() => {
        fieldRef.current?.focus?.();
      });
    }
  }, [edit]);

  const handleChange = (value) => {
    setDraft(value);
    info?.handleFunction?.(value);
  };

  const handleToggle = () => {
    if (edit) {
      info?.handleFunction?.("");
      setDraft(isFilled ? rawValue : "");
    } else {
      setDraft(isFilled ? rawValue : "");
    }

    setEdit((prev) => !prev);
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      bg="linear-gradient(180deg, rgba(255,255,255,0.94), rgba(247,251,253,0.92))"
      border="1px solid"
      borderColor="rgba(31, 58, 95, 0.08)"
      borderRadius="22px"
      boxShadow="0 14px 30px rgba(31, 58, 95, 0.06)"
      p={{ base: 4, md: 5 }}
      transitionProperty="transform, box-shadow, border-color"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ md: "center" }}
        gap={4}
      >
        <Box minW={{ md: "180px" }}>
          <Text
            fontSize="xs"
            textTransform="uppercase"
            letterSpacing="0.18em"
            fontWeight="800"
            color="var(--secondary-gray-color)"
          >
            {info?.title}
          </Text>
          <Text
            mt={1}
            fontSize="sm"
            color={isFilled ? "var(--primary-green-color)" : "var(--regular-color)"}
            fontWeight="600"
          >
            {edit ? "Editing" : isFilled ? "Saved detail" : "Needs attention"}
          </Text>
        </Box>

        <Box flex="1">
          {edit ? (
            isLongField ? (
              <Textarea
                ref={fieldRef}
                value={draft}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={rawValue || `Enter your ${info?.title?.toLowerCase()}`}
                minH="112px"
                resize="vertical"
                borderRadius="18px"
                borderWidth="1px"
                borderColor="rgba(31, 58, 95, 0.12)"
                bg="var(--surface-color)"
                color="var(--heading-color)"
                boxShadow="var(--shadow-soft-color)"
                _placeholder={{ color: "var(--auth-placeholder-color)" }}
                _focusVisible={{
                  borderColor: "rgba(41, 128, 78, 0.48)",
                  boxShadow: "0 0 0 4px var(--auth-focus-ring)",
                }}
              />
            ) : (
              <Input
                ref={fieldRef}
                value={draft}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={rawValue || `Enter your ${info?.title?.toLowerCase()}`}
                h="54px"
                borderRadius="18px"
                borderWidth="1px"
                borderColor="rgba(31, 58, 95, 0.12)"
                bg="var(--surface-color)"
                color="var(--heading-color)"
                boxShadow="var(--shadow-soft-color)"
                _placeholder={{ color: "var(--auth-placeholder-color)" }}
                _focusVisible={{
                  borderColor: "rgba(41, 128, 78, 0.48)",
                  boxShadow: "0 0 0 4px var(--auth-focus-ring)",
                }}
              />
            )
          ) : (
            <Box
              px={4}
              py={3}
              minH={isLongField ? "112px" : "54px"}
              borderRadius="18px"
              border="1px solid"
              borderColor="rgba(31, 58, 95, 0.08)"
              bg="rgba(255,255,255,0.72)"
              display="flex"
              alignItems={isLongField ? "flex-start" : "center"}
            >
              <Text
                fontSize={isLongField ? "15px" : "16px"}
                lineHeight="1.55"
                color={isFilled ? "var(--heading-color)" : "var(--secondary-gray-color)"}
                whiteSpace="pre-wrap"
                wordBreak="break-word"
                noOfLines={isLongField ? 3 : 1}
              >
                {rawValue}
              </Text>
            </Box>
          )}
        </Box>

        {info?.title !== "Email" && (
          <Button
            onClick={handleToggle}
            variant="unstyled"
            minW={{ base: "100%", md: "110px" }}
            h="44px"
            px="16px"
            borderRadius="14px"
            border="1px solid"
            borderColor={
              edit
                ? "rgba(239, 68, 68, 0.16)"
                : "var(--auth-soft-accent-border)"
            }
            bg={
              edit ? "rgba(239, 68, 68, 0.1)" : "var(--auth-soft-accent-bg)"
            }
            color={edit ? "rgb(185, 28, 28)" : "var(--primary-green-color)"}
            fontSize="13px"
            fontWeight="700"
            letterSpacing="0.02em"
            boxShadow="0 12px 22px rgba(31, 58, 95, 0.06)"
            transition="transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, color 0.25s ease"
            _hover={{
              transform: "translateY(-1px)",
              bg: edit ? "rgba(239, 68, 68, 0.14)" : "rgba(41, 128, 78, 0.16)",
              color: edit ? "rgb(153, 27, 27)" : "var(--secondary-green-color)",
              boxShadow: "0 16px 26px rgba(31, 58, 95, 0.1)",
            }}
            _focusVisible={{
              outline: "none",
              boxShadow: "0 0 0 4px var(--auth-focus-ring)",
            }}
          >
            {edit ? "Cancel" : isFilled ? "Edit" : "Add"}
          </Button>
        )}
      </Flex>
    </MotionBox>
  );
};

export default InfoBox;
