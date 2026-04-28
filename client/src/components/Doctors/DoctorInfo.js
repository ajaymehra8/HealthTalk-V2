import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Flex, Stack, Text, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useAuthState } from "../../context/AuthProvider";
import InfoBox from "../User/InfoBox";
import axios from "axios";

const MotionBox = motion(Box);

const DoctorInfo = ({ image }) => {
  const { user, setUser } = useAuthState();
  const [name, setName] = useState("");
  const [description, setdescription] = useState("");
  const [clinicFee, setclinicFee] = useState();
  const [onlineFee, setonlineFee] = useState();
  const [education, seteducation] = useState();
  const [loading, setLoading] = useState(false);

  const setUserInLocalStorage = useCallback(async () => {
    const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
  }, [setUser]);

  useEffect(() => {
    setUserInLocalStorage();
  }, [setUserInLocalStorage]);

  const allInfo = [
    {
      title: "Name",
      value: user?.name,
      edit: true,
      color: user?.name ? true : false,
      handleFunction: setName,
    },
    {
      title: "Email",
      value: user?.email,
      edit: false,
      color: user?.email ? true : false,
    },
    {
      title: "Description",
      value: user?.description || "Enter your description",
      edit: true,
      color: user?.description ? true : false,
      handleFunction: setdescription,
    },
    {
      title: "Clinic Fee",
      value: user?.clinicFee || "Enter your clinic fee",
      edit: true,
      color: user?.clinicFee ? true : false,
      handleFunction: setclinicFee,
    },
    {
      title: "Online Fee",
      value: user?.onlineFee || "Enter your online Fee",
      edit: true,
      color: user?.onlineFee ? true : false,
      handleFunction: setonlineFee,
    },
    {
      title: "Education",
      value: user?.education || "Enter your education",
      edit: true,
      color: user?.education ? true : false,
      handleFunction: seteducation,
    },
  ];

  const toast = useToast();

  const handleChanges = async () => {
    if (
      !name &&
      !clinicFee &&
      !education &&
      !description &&
      !onlineFee &&
      !image
    ) {
      toast({
        title: "No field are change for update",
        status: "error",
        isClosable: true,
        duration: 500,
        position: "top",
      });
      return;
    }

    const token = user?.jwt;
    const url = `${process.env.REACT_APP_API_URL}/api/v1/user/update-doctor`;
    const form = new FormData();

    if (name) form.append("name", name);
    if (clinicFee) form.append("clinicFee", clinicFee);
    if (education) form.append("education", education);
    if (description) form.append("description", description);
    if (onlineFee) form.append("onlineFee", onlineFee);
    if (image) {
      form.append("image", image);
    }

    setLoading(true);
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
    }

    setLoading(false);
  };

  return (
    <Box
      display="flex"
      flexDir="column"
      alignItems="stretch"
      justifyContent="flex-start"
      overflowY="auto"
      w="full"
      maxW="1180px"
      minH="85vh"
      maxH="85vh"
      height="auto"
      mx="auto"
      sx={{
        "@media(max-width:500px)": {
          minHeight: "63vh",
          maxHeight: "63vh",
        },
      }}
    >
      <MotionBox
        w="full"
        initial={{ opacity: 0, y: 18, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <Box
          w="full"
          bg="linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,251,253,0.94))"
          border="1px solid"
          borderColor="rgba(31, 58, 95, 0.08)"
          borderRadius="28px"
          boxShadow="0 28px 64px rgba(31, 58, 95, 0.12)"
          overflow="hidden"
        >
          <Box
            px={{ base: 5, md: 6 }}
            pt={{ base: 5, md: 6 }}
            pb={5}
            borderBottom="1px solid rgba(31, 58, 95, 0.08)"
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              align={{ md: "center" }}
              justify="space-between"
              gap={4}
            >
              <Stack spacing={1.5} maxW="2xl">
                <Text
                  as="h1"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="800"
                  color="var(--heading-color)"
                  letterSpacing="-0.03em"
                >
                  Your Info
                </Text>
                <Text
                  fontSize="sm"
                  lineHeight="1.7"
                  color="var(--regular-color)"
                  maxW="48ch"
                >
                  Keep your doctor profile details, consultation fees, and
                  education up to date.
                </Text>
              </Stack>

              <Box
                px={4}
                py={3}
                borderRadius="20px"
                bg="rgba(31, 58, 95, 0.04)"
                border="1px solid rgba(31, 58, 95, 0.08)"
                minW={{ md: "240px" }}
              >
                <Text
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="0.16em"
                  fontWeight="800"
                  color="var(--secondary-gray-color)"
                >
                  Doctor profile
                </Text>
                <Text
                  mt={2}
                  fontSize="sm"
                  fontWeight="700"
                  color="var(--heading-color)"
                  lineHeight="1.6"
                >
                  Review each field and save the updates when you&apos;re ready.
                </Text>
              </Box>
            </Flex>
          </Box>

          <Stack spacing={4} px={{ base: 5, md: 6 }} py={5}>
            {allInfo?.map((info, ind) => (
              <InfoBox info={info} key={info.title} index={ind} />
            ))}
          </Stack>

          <Flex justify="flex-end" px={{ base: 5, md: 6 }} pb={{ base: 5, md: 6 }}>
            <Button
              onClick={!loading ? handleChanges : undefined}
              isDisabled={loading}
              isLoading={loading}
              loadingText="Updating..."
              variant="unstyled"
              minW={{ base: "full", md: "220px" }}
              h="54px"
              px="20px"
              borderRadius="16px"
              border="1px solid"
              borderColor="var(--auth-soft-accent-border)"
              bg="var(--auth-soft-accent-bg)"
              color="var(--primary-green-color)"
              fontSize="14px"
              fontWeight="700"
              letterSpacing="0.02em"
              boxShadow="0 12px 22px rgba(31, 58, 95, 0.06)"
              transition="transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, color 0.25s ease"
              _hover={{
                transform: "translateY(-1px)",
                bg: "rgba(41, 128, 78, 0.16)",
                color: "var(--secondary-green-color)",
                boxShadow: "0 16px 26px rgba(31, 58, 95, 0.1)",
              }}
              _focusVisible={{
                outline: "none",
                boxShadow: "0 0 0 4px var(--auth-focus-ring)",
              }}
            >
              Apply Changes
            </Button>
          </Flex>
        </Box>
      </MotionBox>
    </Box>
  );
};

export default DoctorInfo;
