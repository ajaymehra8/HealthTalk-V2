import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Progress,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAuthState } from "../../context/AuthProvider";
import InfoBox from "./InfoBox";
import axios from "axios";

const MotionBox = motion(Box);

const UserInfoCard = () => {
  const { user, setUser } = useAuthState();
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allInfo, setAllInfo] = useState([]);
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [previewSrc, setPreviewSrc] = useState(user?.image || "");

  useEffect(() => {
    setAllInfo([
      {
        title: "Name",
        value: user?.name || "Enter your name",
        edit: true,
        color: Boolean(user?.name),
        handleFunction: setName,
      },
      {
        title: "Email",
        value: user?.email || "Enter your email",
        edit: false,
        color: Boolean(user?.email),
      },
      {
        title: "Blood Group",
        value: user?.bloodGroup || "Enter your blood group",
        edit: true,
        color: Boolean(user?.bloodGroup),
        handleFunction: setBloodGroup,
      },
      {
        title: "Age",
        value: user?.age || "Enter your age",
        edit: true,
        color: Boolean(user?.age),
        handleFunction: setAge,
      },
      {
        title: "Height",
        value: user?.height || "Enter your height",
        edit: true,
        color: Boolean(user?.height),
        handleFunction: setHeight,
      },
      {
        title: "Weight",
        value: user?.weight || "Enter your weight",
        edit: true,
        color: Boolean(user?.weight),
        handleFunction: setWeight,
      },
    ]);
  }, [user]);

  useEffect(() => {
    if (!imageFile) {
      setPreviewSrc(user?.image || "");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewSrc(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile, user?.image]);

  const setUserInLocalStorage = useCallback(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    }
  }, [setUser]);

  useEffect(() => {
    setUserInLocalStorage();
  }, [setUserInLocalStorage]);

  const filledFields = useMemo(
    () => allInfo.filter((info) => info.color).length,
    [allInfo]
  );
  const completion = allInfo.length
    ? Math.round((filledFields / allInfo.length) * 100)
    : 0;

  const summaryCards = [
    {
      label: "Name",
      value: user?.name || "Not added",
    },
    {
      label: "Email",
      value: user?.email || "Not added",
    },
    {
      label: "Role",
      value: user?.role || "user",
    },
  ];
  const avatarSrc = previewSrc || user?.image || "";
  const avatarName = user?.name || "Anonymous Member";

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewSrc(user?.image || "");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChanges = async () => {
    if (!name && !age && !weight && !bloodGroup && !height && !imageFile) {
      toast({
        title: "No fields have been changed.",
        status: "error",
        isClosable: true,
        duration: 500,
        position: "top",
      });
      return;
    }

    const token = user?.jwt;
    if (!token) return;

    const url = `${process.env.REACT_APP_API_URL}/api/v1/user`;
    const form = new FormData();

    if (name) form.append("name", name);
    if (age) form.append("age", age);
    if (weight) form.append("weight", weight);
    if (bloodGroup) form.append("bloodGroup", bloodGroup);
    if (height) form.append("height", height);
    if (imageFile) form.append("image", imageFile);

    setLoading(true);

    try {
      const { data } = await axios.patch(url, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast({
          title: "Details updated successfully",
          status: "success",
          isClosable: true,
          duration: 5000,
          position: "top",
        });

        const updatedUser = { ...data.user, jwt: token };
        setUser(updatedUser);
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        setPreviewSrc(updatedUser.image || "");
        setImageFile(null);
      }
    } catch (error) {
      toast({
        title: "Failed to update details.",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    }

    setLoading(false);
  };

  return (
    <MotionBox
      w="full"
      initial={{ opacity: 0, y: 18, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <Box
        w="full"
        maxW="1180px"
        mx="auto"
        bg="var(--surface-strong-color)"
        border="1px solid"
        borderColor="var(--border-soft-color)"
        borderRadius="28px"
        boxShadow="0 28px 64px rgba(31, 58, 95, 0.12)"
        backdropFilter="blur(18px)"
        overflow="hidden"
      >
        <Box
          px={{ base: 5, md: 6 }}
          pt={{ base: 5, md: 6 }}
          pb={5}
          bgGradient="linear(180deg, rgba(255,255,255,0.98), rgba(247,251,253,0.94))"
          borderBottom="1px solid rgba(31, 58, 95, 0.08)"
        >
          <Flex
            direction={{ base: "column", xl: "row" }}
            align={{ xl: "center" }}
            justify="space-between"
            gap={5}
          >
            <Flex flex="1" align="center" gap={4} minW={0}>
              <Stack spacing={2} align="center" flexShrink={0}>
                <MotionBox
                  as="button"
                  type="button"
                  role="group"
                  aria-label="Change profile photo"
                  onClick={handleAvatarClick}
                  p={0}
                  bg="transparent"
                  border="none"
                  cursor="pointer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Box
                    position="relative"
                    p="1.5"
                    borderRadius="full"
                    bgGradient="linear(135deg, rgba(41, 128, 78, 0.18), rgba(31, 58, 95, 0.08))"
                    boxShadow="0 16px 28px rgba(31, 58, 95, 0.12)"
                  >
                    <Avatar
                      src={avatarSrc}
                      name={avatarName}
                      size={{ base: "lg", md: "xl" }}
                      bg="var(--auth-soft-accent-bg)"
                      color="var(--heading-color)"
                      border="4px solid rgba(255, 255, 255, 0.82)"
                    />

                    <Box
                      position="absolute"
                      inset={0}
                      borderRadius="full"
                      bg="rgba(7, 16, 28, 0.42)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      opacity={0}
                      transform="scale(0.96)"
                      transition="opacity 0.25s ease, transform 0.25s ease"
                      pointerEvents="none"
                      _groupHover={{
                        opacity: 1,
                        transform: "scale(1)",
                      }}
                    >
                      <Text
                        fontSize="xs"
                        fontWeight="800"
                        letterSpacing="0.14em"
                        color="white"
                        textTransform="uppercase"
                      >
                        Change
                      </Text>
                    </Box>
                  </Box>
                </MotionBox>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </Stack>

              <Stack spacing={1.5} maxW="2xl" minW={0} align="flex-start">
                <Text
                  as="h1"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="800"
                  color="var(--heading-color)"
                  letterSpacing="-0.03em"
                  noOfLines={1}
                >
                  {user?.name || "Profile"}
                </Text>
                <Text
                  fontSize="sm"
                  color="var(--regular-color)"
                  lineHeight="1.55"
                  maxW="44ch"
                >
                  Tap your avatar to upload a photo.
                </Text>
                {imageFile && (
                  <HStack spacing={2}>
                    <Button
                      onClick={handleRemoveImage}
                      size="sm"
                      variant="outline"
                      h="34px"
                      px={3}
                      borderRadius="999px"
                      borderColor="rgba(239, 68, 68, 0.2)"
                      color="rgb(185, 28, 28)"
                      bg="rgba(239, 68, 68, 0.05)"
                      fontSize="12px"
                      fontWeight="700"
                      _hover={{
                        bg: "rgba(239, 68, 68, 0.1)",
                        borderColor: "rgba(239, 68, 68, 0.32)",
                      }}
                    >
                      Remove photo
                    </Button>
                    <Text fontSize="xs" color="var(--secondary-gray-color)">
                      Selected image only
                    </Text>
                  </HStack>
                )}
              </Stack>
            </Flex>

            <Box
              w={{ base: "full", xl: "280px" }}
              p={4}
              borderRadius="22px"
              bg="rgba(31, 58, 95, 0.04)"
              border="1px solid rgba(31, 58, 95, 0.08)"
            >
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontSize="sm" color="var(--regular-color)">
                  Profile completeness
                </Text>
                <Text
                  fontSize="sm"
                  fontWeight="700"
                  color="var(--primary-green-color)"
                >
                  {completion}%
                </Text>
              </Flex>
              <Progress
                value={completion}
                borderRadius="full"
                size="sm"
                bg="rgba(31, 58, 95, 0.08)"
                sx={{
                  "& > div": {
                    background:
                      "linear-gradient(90deg, var(--primary-green-color), var(--secondary-green-color))",
                  },
                }}
              />
            </Box>
          </Flex>

          <Grid
            mt={5}
            templateColumns={{ base: "1fr", md: "repeat(3, minmax(0, 1fr))" }}
            gap={3}
          >
            {summaryCards.map((card) => (
              <MotionBox
                key={card.label}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                p={4}
                borderRadius="18px"
                bg="rgba(255, 255, 255, 0.78)"
                border="1px solid rgba(31, 58, 95, 0.08)"
                boxShadow="0 12px 26px rgba(31, 58, 95, 0.05)"
              >
                <Text
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="0.16em"
                  fontWeight="800"
                  color="var(--secondary-gray-color)"
                >
                  {card.label}
                </Text>
                <Text
                  mt={2}
                  fontSize="md"
                  fontWeight="700"
                  color="var(--heading-color)"
                  noOfLines={1}
                >
                  {card.value}
                </Text>
              </MotionBox>
            ))}
          </Grid>
        </Box>

        <Stack spacing={4} px={{ base: 5, md: 6 }} py={5}>
          {allInfo.map((info, idx) => (
            <InfoBox key={info.title} info={info} index={idx} />
          ))}
        </Stack>

        <Flex justify="flex-end" px={{ base: 5, md: 6 }} pb={{ base: 5, md: 6 }}>
          <Button
            onClick={!loading ? handleChanges : undefined}
            isLoading={loading}
            loadingText="Updating..."
            isDisabled={loading}
            minW={{ base: "100%", md: "220px" }}
            h="54px"
            borderRadius="16px"
            border="none"
            bg="linear-gradient(135deg, var(--primary-green-color), var(--auth-panel-end))"
            color="var(--surface-color)"
            fontSize="15px"
            fontWeight="800"
            letterSpacing="0.02em"
            boxShadow="0 18px 34px rgba(41, 128, 78, 0.24)"
            transition="transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, opacity 0.25s ease"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "0 24px 40px rgba(41, 128, 78, 0.28)",
              bg: "linear-gradient(135deg, var(--secondary-green-color), var(--primary-green-color))",
            }}
            _disabled={{
              opacity: 0.7,
              cursor: "not-allowed",
            }}
          >
            Apply Changes
          </Button>
        </Flex>
      </Box>
    </MotionBox>
  );
};

export default UserInfoCard;
