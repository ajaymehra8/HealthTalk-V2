import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  FiCheckCircle,
  FiMapPin,
  FiSearch,
  FiTrash2,
  FiUpload,
  FiX,
} from "react-icons/fi";

const MotionBox = motion(Box);

export const sharedInputProps = {
  h: "48px",
  bg: "rgba(255,255,255,0.95)",
  borderRadius: "16px",
  borderColor: "rgba(31,58,95,0.12)",
  color: "var(--heading-color)",
  _placeholder: { color: "var(--auth-placeholder-color)" },
  _focusVisible: {
    borderColor: "var(--primary-green-color)",
    boxShadow: "0 0 0 4px var(--auth-focus-ring)",
  },
};

export const sharedTextareaProps = {
  bg: "rgba(255,255,255,0.95)",
  borderRadius: "16px",
  borderColor: "rgba(31,58,95,0.12)",
  color: "var(--heading-color)",
  minH: "150px",
  px: 4,
  py: 3,
  _placeholder: { color: "var(--auth-placeholder-color)" },
  _focusVisible: {
    borderColor: "var(--primary-green-color)",
    boxShadow: "0 0 0 4px var(--auth-focus-ring)",
  },
};

const GEOAPIFY_API_KEY =
  process.env.REACT_APP_GEOAPIFY_API_KEY ||
  "17bcdbc86fda4dfca3ad3328a4ebb4d8";
const DEFAULT_CENTER = [77.1025, 28.7041];
const DEFAULT_ZOOM = 4;

const formatLocationLabel = (properties = {}) => {
  const namePart =
    properties.name ||
    properties.address_line1 ||
    properties.neighbourhood ||
    properties.district ||
    properties.hamlet ||
    properties.formatted ||
    "";
  const cityPart = properties.city || properties.state || properties.county || "";
  return [namePart, cityPart].filter(Boolean).join(", ") || "Selected location";
};

const createMapPin = () => {
  const pin = document.createElement("div");
  pin.style.width = "18px";
  pin.style.height = "18px";
  pin.style.borderRadius = "50%";
  pin.style.background = "linear-gradient(135deg, #37bd73, #29804e)";
  pin.style.border = "4px solid rgba(255,255,255,0.96)";
  pin.style.boxShadow = "0 14px 28px rgba(41, 128, 78, 0.32)";
  return pin;
};

export const SectionCard = ({
  eyebrow,
  title,
  description,
  action,
  children,
  delay = 0,
}) => (
  <MotionBox
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, ease: "easeOut", delay }}
    whileHover={{ y: -2 }}
    borderRadius="30px"
    p={{ base: 4, md: 5 }}
    bg="linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,251,253,0.92))"
    border="1px solid rgba(31,58,95,0.08)"
    boxShadow="0 22px 48px rgba(31,58,95,0.08)"
    backdropFilter="blur(18px)"
  >
    <Stack spacing={5}>
      {(eyebrow || title || description || action) && (
        <Flex
          align={{ base: "flex-start", md: "center" }}
          justify="space-between"
          gap={4}
          direction={{ base: "column", md: "row" }}
        >
          <Stack spacing={1}>
            {eyebrow ? (
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
                {eyebrow}
              </Badge>
            ) : null}
            {title ? (
              <Text
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="800"
                color="var(--heading-color)"
                letterSpacing="-0.03em"
              >
                {title}
              </Text>
            ) : null}
            {description ? (
              <Text
                fontSize="sm"
                color="var(--regular-color)"
                lineHeight="1.7"
                maxW="3xl"
              >
                {description}
              </Text>
            ) : null}
          </Stack>
          {action ? <Box flexShrink={0}>{action}</Box> : null}
        </Flex>
      )}
      {children}
    </Stack>
  </MotionBox>
);

export const FormField = ({ label, helperText, required = false, children }) => (
  <FormControl isRequired={required}>
    <Stack spacing={2}>
      <HStack justify="space-between" align="start" spacing={3}>
        <FormLabel
          m={0}
          fontSize="sm"
          fontWeight="800"
          color="var(--heading-color)"
          letterSpacing="-0.01em"
        >
          {label}
        </FormLabel>
        {required ? (
          <Badge
            px={2}
            py={1}
            borderRadius="full"
            bg="rgba(31, 58, 95, 0.06)"
            color="var(--regular-color)"
            fontSize="10px"
            fontWeight="700"
          >
            Required
          </Badge>
        ) : null}
      </HStack>
      {children}
      {helperText ? (
        <Text fontSize="xs" color="var(--regular-color)" lineHeight="1.6">
          {helperText}
        </Text>
      ) : null}
    </Stack>
  </FormControl>
);

export const PersonalDetailsSection = ({
  name,
  setName,
  email,
  setEmail,
}) => (
  <SectionCard
    eyebrow="Step 1"
    title="Personal details"
    description="We prefill your account information so you can move quickly."
    delay={0.04}
  >
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
      <FormField label="Full name" required>
        <Input
          {...sharedInputProps}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
        />
      </FormField>

      <FormField label="Email address" required>
        <Input
          {...sharedInputProps}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
        />
      </FormField>
    </SimpleGrid>
  </SectionCard>
);

export const ProfessionalDetailsSection = ({
  education,
  setEducation,
  pastExperience,
  setPastExperience,
  specialization,
  setSpecialization,
  clinicFee,
  setClinicFee,
  experienceYear,
  setExperienceYear,
  description,
  setDescription,
}) => (
  <SectionCard
    eyebrow="Step 2"
    title="Professional profile"
    description="Add the background, focus areas, and fees that help the team review your application."
    delay={0.08}
  >
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
      <FormField label="Education" required>
        <Input
          {...sharedInputProps}
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          placeholder="MBBS, BDS, MD, etc."
        />
      </FormField>

      <FormField label="Years of experience" required>
        <Input
          {...sharedInputProps}
          type="number"
          min={2}
          max={25}
          value={experienceYear || ""}
          onChange={(e) => {
            const rawValue = e.target.value;
            if (rawValue === "") {
              setExperienceYear(0);
              return;
            }
            const numericValue = Number(rawValue);
            if (Number.isNaN(numericValue)) {
              setExperienceYear(0);
              return;
            }
            setExperienceYear(Math.min(25, Math.max(2, Math.round(numericValue))));
          }}
          placeholder="2-25"
        />
      </FormField>

      <FormField label="Specialization" required>
        <Input
          {...sharedInputProps}
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          placeholder="Cardiology, Pediatrics, Dermatology..."
        />
      </FormField>

      <FormField label="Clinic fee" required>
        <Input
          {...sharedInputProps}
          type="number"
          min={1}
          max={30}
          value={clinicFee || ""}
          onChange={(e) => {
            const rawValue = e.target.value;
            if (rawValue === "") {
              setClinicFee(0);
              return;
            }
            const numericValue = Number(rawValue);
            if (Number.isNaN(numericValue)) {
              setClinicFee(0);
              return;
            }
            setClinicFee(Math.min(30, Math.max(1, Math.round(numericValue))));
          }}
          placeholder="1-30"
        />
      </FormField>
    </SimpleGrid>

    <Stack spacing={4} mt={4}>
      <FormField
        label="Past experience"
        required
        helperText="Briefly describe where you have worked and the work you have done."
      >
        <Input
          {...sharedInputProps}
          value={pastExperience}
          onChange={(e) => setPastExperience(e.target.value)}
          placeholder="6 years at city hospital, OPD and teleconsultation"
        />
      </FormField>

      <FormField
        label="Description"
        required
        helperText="Share a short, friendly summary of your practice."
      >
        <Textarea
          {...sharedTextareaProps}
          value={description}
          resize="vertical"
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell patients what kind of care you provide..."
        />
      </FormField>
    </Stack>
  </SectionCard>
);

export const TreatmentAreaSection = ({
  treatmentArea,
  setTreatmentArea,
  currentArea,
  setCurrentArea,
}) => {
  const toast = useToast();

  const addArea = useCallback(
    (rawValue = currentArea) => {
      const cleanedValue = rawValue.trim().replace(/\s+/g, " ");

      if (!cleanedValue) return;

      if (treatmentArea.length >= 5) {
        toast({
          title: "You can add only 5 treatment areas",
          status: "warning",
          position: "top",
          isClosable: true,
          duration: 4000,
        });
        return;
      }

      const alreadyAdded = treatmentArea.some(
        (area) => area.name.toLowerCase() === cleanedValue.toLowerCase()
      );

      if (alreadyAdded) {
        toast({
          title: "This treatment area is already added",
          status: "info",
          position: "top",
          isClosable: true,
          duration: 3500,
        });
        return;
      }

      setTreatmentArea((prevAreas) => [
        ...prevAreas,
        {
          name: cleanedValue,
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        },
      ]);
      setCurrentArea("");
    },
    [currentArea, setCurrentArea, setTreatmentArea, toast, treatmentArea]
  );

  return (
    <SectionCard
      eyebrow="Step 3"
      title="Treatment areas"
      description="Press Enter or use the add button to save up to five areas."
      delay={0.12}
    >
      <Stack spacing={4}>
        <FormField
          label="Areas you treat"
          helperText="Keep each treatment area short and specific."
          required
        >
          <Stack spacing={3}>
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={3}
              align="stretch"
            >
              <Input
                {...sharedInputProps}
                value={currentArea}
                maxLength={40}
                onChange={(e) => setCurrentArea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addArea();
                  }
                }}
                placeholder="Type a treatment area and press Enter"
              />
              <Button
                h="48px"
                px={6}
                borderRadius="16px"
                bg="linear-gradient(135deg, var(--primary-green-color), var(--auth-panel-end))"
                color="white"
                fontWeight="800"
                _hover={{
                  bg: "linear-gradient(135deg, var(--secondary-green-color), var(--primary-green-color))",
                }}
                onClick={() => addArea()}
                minW={{ base: "full", md: "160px" }}
              >
                Add area
              </Button>
            </Flex>
            <Text fontSize="xs" color="var(--regular-color)">
              Added {treatmentArea.length}/5 areas
            </Text>
          </Stack>
        </FormField>

        <Flex wrap="wrap" gap={3}>
          <AnimatePresence initial={false}>
            {treatmentArea.map((area) => (
              <MotionBox
                key={area.id}
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -8 }}
                transition={{ duration: 0.18 }}
                display="flex"
                alignItems="center"
                gap={2}
                px={3}
                py={2}
                borderRadius="full"
                bg="rgba(55, 189, 115, 0.12)"
                border="1px solid rgba(41, 128, 78, 0.14)"
                color="var(--heading-color)"
                boxShadow="0 10px 24px rgba(31, 58, 95, 0.04)"
              >
                <Text fontSize="sm" fontWeight="800" noOfLines={1}>
                  {area.name}
                </Text>
                <IconButton
                  aria-label={`Remove ${area.name}`}
                  icon={<FiX />}
                  size="xs"
                  minW="24px"
                  h="24px"
                  borderRadius="full"
                  bg="white"
                  color="var(--heading-color)"
                  _hover={{ bg: "rgba(255,255,255,0.92)" }}
                  onClick={() =>
                    setTreatmentArea((prevAreas) =>
                      prevAreas.filter((item) => item.id !== area.id)
                    )
                  }
                />
              </MotionBox>
            ))}
          </AnimatePresence>
        </Flex>
      </Stack>
    </SectionCard>
  );
};

export const DegreeUploadSection = ({
  fileName,
  onFileChange,
  onClearFile,
}) => (
  <SectionCard
    eyebrow="Step 4"
    title="Verification document"
    description="Upload your degree or registration certificate as a PDF."
    delay={0.16}
  >
    <Stack spacing={4}>
      <Text fontSize="sm" color="var(--regular-color)" lineHeight="1.7">
        We only accept a single PDF file here. Keep the file clear and legible
        so the review process can move faster.
      </Text>

      <Flex
        direction={{ base: "column", md: "row" }}
        gap={3}
        align={{ base: "stretch", md: "center" }}
      >
        <Button
          as="label"
          h="48px"
          px={6}
          borderRadius="16px"
          bg="linear-gradient(135deg, var(--primary-green-color), var(--auth-panel-end))"
          color="white"
          fontWeight="800"
          cursor="pointer"
          _hover={{
            bg: "linear-gradient(135deg, var(--secondary-green-color), var(--primary-green-color))",
          }}
          leftIcon={<FiUpload />}
        >
          Add your degree
          <Input
            type="file"
            accept="application/pdf"
            onChange={onFileChange}
            display="none"
          />
        </Button>

        <HStack
          flex="1"
          minW={0}
          px={3}
          py={2}
          borderRadius="16px"
          border="1px solid rgba(31,58,95,0.08)"
          bg="rgba(255,255,255,0.74)"
          justify="space-between"
          gap={3}
        >
          <Text
            fontSize="sm"
            color={fileName === "No file chosen" ? "var(--regular-color)" : "var(--heading-color)"}
            fontWeight={fileName === "No file chosen" ? "500" : "800"}
            noOfLines={1}
            title={fileName}
          >
            {fileName}
          </Text>

          {fileName !== "No file chosen" ? (
            <IconButton
              aria-label="Remove selected file"
              icon={<FiTrash2 />}
              size="sm"
              borderRadius="12px"
              bg="rgba(239, 68, 68, 0.08)"
              color="rgb(185, 28, 28)"
              _hover={{ bg: "rgba(239, 68, 68, 0.14)" }}
              onClick={onClearFile}
            />
          ) : (
            <Badge
              px={2}
              py={1}
              borderRadius="full"
              bg="rgba(31,58,95,0.06)"
              color="var(--regular-color)"
            >
              PDF only
            </Badge>
          )}
        </HStack>
      </Flex>
    </Stack>
  </SectionCard>
);

export const ClinicMapSection = ({
  clinicLocation,
  clinicCoordinates,
  onLocationChange,
}) => {
  const toast = useToast();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [searchValue, setSearchValue] = useState(clinicLocation || "");
  const [isSearching, setIsSearching] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const reverseGeocode = useCallback(async (lat, lng) => {
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${GEOAPIFY_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    const properties = data?.features?.[0]?.properties;
    if (!properties) return "";
    return formatLocationLabel(properties);
  }, []);

  const selectLocation = useCallback(
    async ({ lat, lng, label = "" }) => {
      const resolvedLabel = label || (await reverseGeocode(lat, lng));
      if (!resolvedLabel) {
        toast({
          title: "Location not found",
          description: "Please pick another point on the map.",
          status: "warning",
          position: "top",
          isClosable: true,
          duration: 4000,
        });
        return;
      }

      onLocationChange({
        location: resolvedLabel,
        coordinates: { lat, lng },
      });
      setSearchValue(resolvedLabel);
    },
    [onLocationChange, reverseGeocode, toast]
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://maps.geoapify.com/v1/styles/osm-carto/style.json?apiKey=${GEOAPIFY_API_KEY}`,
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    const handleLoad = () => {
      setMapReady(true);
      map.resize();
    };

    const handleClick = async (event) => {
      const { lng, lat } = event.lngLat;
      await selectLocation({ lat, lng });
    };

    map.on("load", handleLoad);
    map.on("click", handleClick);

    return () => {
      map.off("load", handleLoad);
      map.off("click", handleClick);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [selectLocation]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !clinicCoordinates?.lat || !clinicCoordinates?.lng) {
      return;
    }

    const { lat, lng } = clinicCoordinates;

    if (markerRef.current) {
      markerRef.current.remove();
    }

    markerRef.current = new maplibregl.Marker({
      element: createMapPin(),
      anchor: "bottom",
    })
      .setLngLat([lng, lat])
      .addTo(mapRef.current);

    mapRef.current.flyTo({
      center: [lng, lat],
      zoom: 14.5,
      speed: 0.85,
      curve: 1.45,
      essential: true,
    });
  }, [clinicCoordinates, mapReady]);

  useEffect(() => {
    setSearchValue(clinicLocation || "");
  }, [clinicLocation]);

  useEffect(() => {
    const handleResize = () => {
      mapRef.current?.resize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const useCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        status: "error",
        position: "top",
        isClosable: true,
        duration: 4000,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const locationLabel = await reverseGeocode(latitude, longitude);
          if (!locationLabel) {
            toast({
              title: "Unable to resolve your location",
              status: "warning",
              position: "top",
              isClosable: true,
              duration: 4000,
            });
            return;
          }

          onLocationChange({
            location: locationLabel,
            coordinates: { lat: latitude, lng: longitude },
          });
          setSearchValue(locationLabel);
        } catch (error) {
          toast({
            title: "Unable to get your location",
            description: "Please try selecting the pin manually.",
            status: "error",
            position: "top",
            isClosable: true,
            duration: 4000,
          });
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          toast({
            title: "Location permission denied",
            description: "Enable location access or choose the pin on the map.",
            status: "error",
            position: "top",
            isClosable: true,
            duration: 5000,
          });
          return;
        }
        toast({
          title: "Unable to fetch location",
          description: "Please try again or select a point manually.",
          status: "error",
          position: "top",
          isClosable: true,
          duration: 5000,
        });
      }
    );
  };

  const searchPlace = async () => {
    const query = searchValue.trim();
    if (!query) {
      toast({
        title: "Type a place first",
        status: "info",
        position: "top",
        isClosable: true,
        duration: 3000,
      });
      return;
    }

    setIsSearching(true);
    try {
      const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        query
      )}&limit=1&apiKey=${GEOAPIFY_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      const feature = data?.features?.[0];

      if (!feature) {
        toast({
          title: "No results found",
          description: "Try a different neighborhood or landmark.",
          status: "warning",
          position: "top",
          isClosable: true,
          duration: 4000,
        });
        return;
      }

      const latitude = feature.geometry?.coordinates?.[1] ?? feature.properties?.lat;
      const longitude = feature.geometry?.coordinates?.[0] ?? feature.properties?.lon;
      const locationLabel = formatLocationLabel(feature.properties);

      if (latitude == null || longitude == null) {
        toast({
          title: "Unable to place pin",
          status: "error",
          position: "top",
          isClosable: true,
          duration: 4000,
        });
        return;
      }

      onLocationChange({
        location: locationLabel,
        coordinates: { lat: latitude, lng: longitude },
      });
      setSearchValue(locationLabel);
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Please try again in a moment.",
        status: "error",
        position: "top",
        isClosable: true,
        duration: 4000,
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <SectionCard
      eyebrow="Step 5"
      title="Clinic location"
      description="Search a place, use your current location, or tap directly on the map to set the pin."
      delay={0.02}
      action={
        <Button
          h="42px"
          px={4}
          borderRadius="14px"
          variant="outline"
          borderColor="rgba(31,58,95,0.14)"
          color="var(--heading-color)"
          bg="rgba(255,255,255,0.78)"
          _hover={{ bg: "rgba(255,255,255,0.94)" }}
          leftIcon={<FiMapPin />}
          onClick={useCurrentLocation}
        >
          Use my location
        </Button>
      }
    >
      <Stack spacing={4}>
        <Stack spacing={3}>
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={3}
            align="stretch"
          >
            <Input
              {...sharedInputProps}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search neighborhood, city, or landmark"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  searchPlace();
                }
              }}
            />
            <Button
              h="48px"
              px={6}
              borderRadius="16px"
              bg="linear-gradient(135deg, var(--primary-green-color), var(--auth-panel-end))"
              color="white"
              fontWeight="800"
              leftIcon={<FiSearch />}
              onClick={searchPlace}
              isLoading={isSearching}
              loadingText="Searching..."
              _hover={{
                bg: "linear-gradient(135deg, var(--secondary-green-color), var(--primary-green-color))",
              }}
              minW={{ base: "full", md: "160px" }}
            >
              Search
            </Button>
          </Flex>
        </Stack>

        <Box
          position="relative"
          borderRadius="24px"
          overflow="hidden"
          border="1px solid rgba(31,58,95,0.08)"
          boxShadow="0 22px 48px rgba(31,58,95,0.08)"
          bg="rgba(255,255,255,0.72)"
        >
          {!mapReady ? (
            <Center
              h={{ base: "280px", md: "340px", xl: "420px" }}
              bg="linear-gradient(135deg, rgba(255,255,255,0.7), rgba(237,244,251,0.96))"
            >
              <Stack spacing={3} align="center">
                <Spinner
                  thickness="3px"
                  speed="0.8s"
                  color="var(--primary-green-color)"
                  size="lg"
                />
                <Text fontSize="sm" color="var(--regular-color)">
                  Loading clinic map...
                </Text>
              </Stack>
            </Center>
          ) : null}

          <Box
            ref={mapContainerRef}
            h={{ base: "280px", md: "340px", xl: "420px" }}
            w="full"
            opacity={mapReady ? 1 : 0}
            transition="opacity 0.3s ease"
          />

          <Box
            position="absolute"
            top={4}
            left={4}
            px={3}
            py={2}
            borderRadius="full"
            bg="rgba(23, 50, 79, 0.82)"
            color="white"
            fontSize="xs"
            fontWeight="700"
            letterSpacing="0.08em"
            textTransform="uppercase"
            pointerEvents="none"
          >
            Tap to place clinic pin
          </Box>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
          <Box
            p={3}
            borderRadius="18px"
            bg="rgba(31,58,95,0.05)"
            border="1px solid rgba(31,58,95,0.06)"
          >
            <Text
              fontSize="10px"
              textTransform="uppercase"
              letterSpacing="0.18em"
              color="var(--secondary-gray-color)"
              fontWeight="800"
            >
              Selected location
            </Text>
            <Text
              mt={1}
              fontSize="sm"
              fontWeight="800"
              color="var(--heading-color)"
              noOfLines={2}
            >
              {clinicLocation || "Choose a location on the map"}
            </Text>
          </Box>

          <HStack
            p={3}
            borderRadius="18px"
            bg="rgba(55,189,115,0.08)"
            border="1px solid rgba(41,128,78,0.12)"
            align="start"
          >
            <Box as={FiMapPin} color="var(--primary-green-color)" mt="2px" />
            <Stack spacing={0} minW={0}>
              <Text
                fontSize="10px"
                textTransform="uppercase"
                letterSpacing="0.18em"
                color="var(--secondary-gray-color)"
                fontWeight="800"
              >
                Coordinates
              </Text>
              <Text
                mt={1}
                fontSize="sm"
                fontWeight="800"
                color="var(--heading-color)"
                noOfLines={1}
              >
                {clinicCoordinates?.lat && clinicCoordinates?.lng
                  ? `${clinicCoordinates.lat.toFixed(5)}, ${clinicCoordinates.lng.toFixed(5)}`
                  : "Not selected yet"}
              </Text>
            </Stack>
          </HStack>
        </SimpleGrid>
      </Stack>
    </SectionCard>
  );
};

export const ApplicationChecklist = () => {
  const items = useMemo(
    () => [
      "Pick a clinic pin before you submit so the location is accurate.",
      "Upload a clean PDF of your degree or registration document.",
      "Keep treatment areas to five or fewer for a faster review.",
      "You will be redirected to your profile after a successful submission.",
    ],
    []
  );

  return (
    <SectionCard
      eyebrow="Helpful note"
      title="Before you submit"
      description="A quick checklist to help your application move smoothly through review."
      delay={0.08}
    >
      <Stack spacing={3}>
        {items.map((item) => (
          <HStack key={item} spacing={3} align="start">
            <Box
              as={FiCheckCircle}
              color="var(--primary-green-color)"
              mt="2px"
              flexShrink={0}
            />
            <Text fontSize="sm" color="var(--regular-color)" lineHeight="1.7">
              {item}
            </Text>
          </HStack>
        ))}
      </Stack>
    </SectionCard>
  );
};

export const SubmitActionSection = ({ onSubmit, isSubmitting }) => (
  <SectionCard
    eyebrow="Finish"
    title="Ready to submit?"
    description="We will review your details and verify the uploaded document before approval."
    delay={0.2}
  >
    <Stack spacing={4}>
      <Button
        h="48px"
        w="full"
        borderRadius="16px"
        bg="linear-gradient(135deg, var(--primary-green-color), var(--auth-panel-end))"
        color="white"
        fontWeight="800"
        fontSize="md"
        _hover={{
          bg: "linear-gradient(135deg, var(--secondary-green-color), var(--primary-green-color))",
        }}
        onClick={onSubmit}
        isLoading={isSubmitting}
        loadingText="Submitting..."
      >
        Submit your application
      </Button>

      <Text fontSize="xs" color="var(--regular-color)" lineHeight="1.6">
        After submission, we will move your profile to the review queue and
        update your account status once it is approved.
      </Text>
    </Stack>
  </SectionCard>
);

