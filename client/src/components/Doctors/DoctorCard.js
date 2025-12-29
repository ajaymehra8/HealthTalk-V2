import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Box,
  useToast,
} from "@chakra-ui/react";
import { HStack } from "@chakra-ui/react";
import Typography from "../ui/Typography";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "../../context/AuthProvider";
import axios from "axios";

const DoctorCard = ({ doctor, handleFunction }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const { user } = useAuthState();

  const toast = useToast();

  const handleViewProfile = async () => {
    setLoading(true);
    const doctorProf = await handleFunction(); // Assume this function fetches the doctor's profile data
    setLoading(false);
    navigate("/doctor-profile", { state: { user: doctorProf } }); // Pass the profile data using `state`
  };

  const bookAppoinment = async (e) => {
    e.stopPropagation();
    if (!user) {
      return toast({
        title: "You are not logged in",
        status: "error",
        isClosable: true,
        duration: 5000,
        position: "top",
      });
    }
    const body = {
      doctor,
    };
    const token = user?.jwt;
    setBookLoading(true);
    const headers = {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    };

    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/v1/booking/create-booking`,
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
    }
    setBookLoading(false);
  };

  return (
    <Card
      maxW="290px"
      minW="290px"
      cursor={"pointer"}
      boxShadow={"0 2px 5px rgba(0, 0, 0, 0.08)"}
      _hover={{
        transform: "translateY(-6px)",
        boxShadow: "0 16px 40px rgba(0, 0, 0, 0.08)",
        transition: "all 0.25s ease",
      }}
      borderRadius={"10px"}
      onClick={handleViewProfile}
    >
      <CardBody padding={"10px 10px 0 10px"}>
        <Image
          src={doctor?.image}
          alt="Doctor image"
          borderRadius="10px"
          w={["100%", "100%", "100%"]}
          h={["200px", "200px", "200px"]}
        />
        <Stack mt="3" spacing="1">
          <Typography variant="regular" weight="semibold">
            Dr. {doctor?.name}
          </Typography>

          <Typography
            variant="small"
            weight="medium"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {doctor?.specialization} . {doctor?.experience} years experience
          </Typography>

          <Typography
            weight="medium"
            variant="small"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            <i class="bi bi-geo-alt"></i>{" "}
            {doctor?.clinicLocation
              ? doctor?.clinicLocation?.name
              : "Delhi, India"}
          </Typography>
        </Stack>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            height: "fit",
            marginTop: "5px",
          }}
        >
          <HStack spacing={1}>
            {[1, 2, 3, 4, 5].map((index) => (
              <Box key={index} as="button">
                <i
                  class="bi bi-star-fill"
                  style={{
                    color: index <= doctor?.avgRating ? "#ffd700" : "#d1d1d3",
                  }}
                ></i>
              </Box>
            ))}
          </HStack>
          <Typography variant="small" weight="medium">
            <span
              style={{
                color: "var(--subheading-color)",
                fontWeight: 700,
              }}
            >
              {" "}
              {doctor?.avgRating}
            </span>{" "}
            ({doctor?.nRating} reviews)
          </Typography>
        </div>

        <div
          style={{
            width: "100%",
            height: "1px",
            margin: "10px 0",
            background: "#475569",
          }}
        />
      </CardBody>

      <CardFooter padding={"0 10px 15px"}>
        <Box width={"100%"}>
          <Typography
            variant="regularVariant"
            weight="medium"
            style={{
              marginBottom: "10px",
              color: "#475569",
            }}
          >
            Consultation fee:{" "}
            <span style={{ fontWeight: 700 }}>$ {doctor?.clinicFee}</span>
          </Typography>
          <button
            className="mainButton"
            style={{
              width: "100%",
              fontWeight: "400",
            }}
            onClick={bookAppoinment}
            disabled={bookLoading}
          >
            {!bookLoading ? "Book Appointment" : "Wait..."}
          </button>
        </Box>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
