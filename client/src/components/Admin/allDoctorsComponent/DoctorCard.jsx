import React, { useCallback, useEffect, useState } from "react";
import { Box, HStack } from "@chakra-ui/react";
import axios from "axios";
import { useAuthState } from "../../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor, setDoctors }) => {
  const navigate = useNavigate();
  const [appoinmentCount, setAppoinmentCount] = useState(0);
  const { headers } = useAuthState();

  const fetchAppoinments = useCallback(async () => {
    if (!headers) return; // Ensure token is available before making the API call
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/booking/get-doctor-appoinments/${doctor?._id}`,
        {
          headers,
        }
      );
      if (data.success) {
        setAppoinmentCount(data.bookings.length);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
    }
  }, [headers, doctor?._id]);

  useEffect(() => {
    fetchAppoinments();
  }, [fetchAppoinments]);
  const handleViewProfile = () => {
    if (!doctor?._id) return;
    navigate(`/doctor-profile/${doctor._id}`);
  };

  return (
    <Box
      display={"flex"}
      width={"100%"}
      gap={"8%"}
      justifyContent={"start"}
      alignItems={"start"}
      border={"1px solid #d3d3d3"}
      borderRadius={"20px"}
      cursor={"pointer"}
      p={"5px 20px"}
      bg={"#f0f0f0"}
    >
      <Box
        display={"flex"}
        flexDir={"column"}
        justifyContent={"center"}
        width={"clamp(190px,25%,1000px)"}
        alignItems={"center"}
      >
        <img
          src={doctor?.image}
          alt=""
          className="rectangle-img"
          style={{ height: "clamp(100px,20vh,300px)", width: "100%" }}
        />
        <h4 style={{ alignSelf: "center" }}>
          Dr. {doctor?.name || "Unknown User"}
        </h4>
      </Box>
      <Box width={"70%"}>
        <h2 style={{ fontSize: "clamp(15px,4vw,20px)" }}>
          <b>Doctor:</b> {doctor?.name}.
        </h2>
        <h2 style={{ fontSize: "clamp(15px,4vw,20px)" }}>
          <b>Appoinments:</b> {appoinmentCount}
        </h2>
        <Box
          display={"flex"}
          width={"100%"}
          justifyContent={"start"}
          alignItems={"center"}
          gap={"4px"}
        >
          <h2 style={{ fontSize: "clamp(15px,4vw,20px)" }}>
            <b>Rating: </b>
          </h2>
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
          <h2 style={{ fontSize: "clamp(15px,4vw,20px)" }}>
            ({doctor?.nRating})
          </h2>
        </Box>

        <button
          className=" rounded-btn"
          style={{
            marginTop: "20px",
            backgroundColor: "#78be20",
            color: "white",
            letterSpacing: "1px",
          }}
          onClick={handleViewProfile}
        >
          View
        </button>
      </Box>
    </Box>
  );
};

export default DoctorCard;
