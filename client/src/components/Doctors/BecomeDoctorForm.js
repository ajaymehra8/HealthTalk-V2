import React, { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useAuthState } from "../../context/AuthProvider";
import BackButton from "../Common/BackButton";
import {
  ApplicationChecklist,
  ClinicMapSection,
  DegreeUploadSection,
  PersonalDetailsSection,
  ProfessionalDetailsSection,
  SubmitActionSection,
  TreatmentAreaSection,
} from "./BecomeDoctorForm/formSections";

const MotionBox = motion(Box);

const BecomeDoctorForm = () => {
  const { user, setUser } = useAuthState();
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [education, setEducation] = useState("");
  const [pastExperience, setPastExperience] = useState("");
  const [description, setDescription] = useState("");
  const [clinicLocation, setClinicLocation] = useState("");
  const [clinicCoordinates, setClinicCoordinates] = useState({
    lat: null,
    lng: null,
  });
  const [treatmentArea, setTreatmentArea] = useState([]);
  const [currentArea, setCurrentArea] = useState("");
  const [clinicFee, setClinicFee] = useState(0);
  const [specialization, setSpecialization] = useState("");
  const [experienceYear, setExperienceYear] = useState(0);
  const [pdfFile, setPdfFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setFileName(file.name);
      return;
    }

    setPdfFile(null);
    setFileName("No file chosen");
  }, []);

  const handleClearFile = useCallback(() => {
    setPdfFile(null);
    setFileName("No file chosen");
  }, []);

  const handleLocationChange = useCallback(({ location, coordinates }) => {
    setClinicLocation(location);
    setClinicCoordinates(coordinates);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (
      !name ||
      !email ||
      !education ||
      !pastExperience ||
      !description ||
      !clinicLocation ||
      !clinicCoordinates?.lat ||
      !clinicCoordinates?.lng ||
      !treatmentArea.length ||
      !clinicFee ||
      !specialization ||
      !experienceYear ||
      !pdfFile
    ) {
      toast({
        title: "Required fields missing",
        description:
          "Please complete your profile, location, treatment areas, and PDF upload.",
        status: "error",
        duration: 3500,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const formData = new FormData();
    const locationForDb = {
      name: clinicLocation,
      coordinates: {
        type: "Point",
        coordinates: [clinicCoordinates?.lng, clinicCoordinates?.lat],
      },
    };

    formData.append("name", name);
    formData.append("email", email);
    formData.append("education", education);
    formData.append("experience", experienceYear);
    formData.append("pastExperience", pastExperience);
    formData.append("description", description);
    formData.append("clinicLocation", JSON.stringify(locationForDb));
    formData.append("specialization", specialization);
    formData.append(
      "treatmentArea",
      JSON.stringify(treatmentArea.map((area) => area.name))
    );
    formData.append("clinicFee", clinicFee);
    formData.append("degree", pdfFile);

    setIsSubmitting(true);
    try {
      const token = user?.jwt;
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/user/requestToBecomeDoctor`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.success) {
        toast({
          title: data.message,
          status: "success",
          isClosable: true,
          duration: 5000,
          position: "top",
        });

        const updatedUser = { ...data.user, jwt: token };
        setUser(updatedUser);
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        navigate("/my-profile/my-info");
        return;
      }

      toast({
        title: data?.message || "Unable to submit application",
        description: data?.subMessage || "Please try again later.",
        status: "warning",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    } catch (err) {
      toast({
        title: err?.response?.data?.message || "Something went wrong",
        description: "Please try again later.",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    clinicCoordinates?.lat,
    clinicCoordinates?.lng,
    clinicFee,
    clinicLocation,
    description,
    education,
    experienceYear,
    name,
    navigate,
    pastExperience,
    pdfFile,
    setUser,
    specialization,
    toast,
    treatmentArea,
    user?.jwt,
    email,
  ]);

  return (
    <>
      <Navbar />

      <MotionBox
        as="main"
        minH="100vh"
        w="full"
        pt={{ base: 20, md: 24 }}
        pb={{ base: 14, md: 20 }}
        position="relative"
        overflow="hidden"
        bgGradient="linear(135deg, var(--profile-page-bg-start) 0%, var(--profile-page-bg-end) 100%)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <Box
          position="absolute"
          top="-140px"
          right="-70px"
          w="360px"
          h="360px"
          borderRadius="full"
          bg="rgba(55, 189, 115, 0.16)"
          filter="blur(90px)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-130px"
          left="-80px"
          w="340px"
          h="340px"
          borderRadius="full"
          bg="rgba(31, 58, 95, 0.10)"
          filter="blur(90px)"
          pointerEvents="none"
        />

        <Container maxW="7xl" position="relative" zIndex={1}>
          <Stack spacing={3} mb={{ base: 6, md: 8 }} maxW="3xl">
            <BackButton
              label="Back"
              fallbackTo="/my-profile/my-info"
              mb={1}
            />
            <Badge
              w="fit-content"
              px={3}
              py={1}
              borderRadius="full"
              bg="rgba(41, 128, 78, 0.12)"
              color="var(--primary-green-color)"
              fontSize="10px"
              letterSpacing="0.2em"
              textTransform="uppercase"
              fontWeight="800"
            >
              Doctor onboarding
            </Badge>
            <Heading
              fontSize={{ base: "3xl", md: "4xl", xl: "5xl" }}
              lineHeight="1.05"
              color="var(--heading-color)"
              letterSpacing="-0.04em"
            >
              Complete your doctor application
            </Heading>
            <Text
              fontSize={{ base: "sm", md: "md" }}
              color="var(--regular-color)"
              lineHeight="1.8"
              maxW="2xl"
            >
              Fill in your professional details, pin your clinic on the map,
              and upload a degree PDF so the review team can verify your
              application.
            </Text>
            <HStack spacing={2} flexWrap="wrap">
              {["Profile details", "Map location", "PDF verification"].map(
                (label) => (
                  <Badge
                    key={label}
                    px={3}
                    py={1.5}
                    borderRadius="full"
                    bg="rgba(255,255,255,0.8)"
                    color="var(--heading-color)"
                    border="1px solid rgba(31,58,95,0.08)"
                    fontSize="xs"
                    fontWeight="700"
                  >
                    {label}
                  </Badge>
                )
              )}
            </HStack>
          </Stack>

          <SimpleGrid columns={{ base: 1, xl: 2 }} gap={6} alignItems="start">
            <Stack spacing={6}>
              <PersonalDetailsSection
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
              />

              <ProfessionalDetailsSection
                education={education}
                setEducation={setEducation}
                pastExperience={pastExperience}
                setPastExperience={setPastExperience}
                specialization={specialization}
                setSpecialization={setSpecialization}
                clinicFee={clinicFee}
                setClinicFee={setClinicFee}
                experienceYear={experienceYear}
                setExperienceYear={setExperienceYear}
                description={description}
                setDescription={setDescription}
              />

              <TreatmentAreaSection
                treatmentArea={treatmentArea}
                setTreatmentArea={setTreatmentArea}
                currentArea={currentArea}
                setCurrentArea={setCurrentArea}
              />

              <DegreeUploadSection
                fileName={fileName}
                onFileChange={handleFileChange}
                onClearFile={handleClearFile}
              />
            </Stack>

            <Stack
              spacing={6}
              alignSelf="start"
              position={{ xl: "sticky" }}
              top={{ xl: "96px" }}
            >
              <ClinicMapSection
                clinicLocation={clinicLocation}
                clinicCoordinates={clinicCoordinates}
                onLocationChange={handleLocationChange}
              />
              <ApplicationChecklist />
              <SubmitActionSection
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </Stack>
          </SimpleGrid>
        </Container>
      </MotionBox>
    </>
  );
};

export default BecomeDoctorForm;
