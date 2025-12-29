import { Box, Select, SimpleGrid } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import DoctorCard from "../Doctors/DoctorCard";
import { Link } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";
import Typography from "../ui/Typography";

const TopDoctors = ({ id, doctors, setDoctors }) => {
  const [showMap, setShowMap] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading Doctors...");
  const getSingleDoctor = async (id) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/user/${id}`
    );
    return data.doctor;
  };

  const fetchDoctors = async (queryName) => {
    setShowMap(false);
    try {
      if (queryName) {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/user/?filter=${queryName}`
        );
        setDoctors(data.doctors);
      } else {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/user`
        );
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  const fetchDoctorsNearUser = async () => {
    try {
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const { data } = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/v1/user`,
            {
              params: {
                lat: latitude,
                lng: longitude,
                filter: "location",
              },
            }
          );
          setShowMap(true);
          if (data.doctors.length === 0) {
            setLoadingText("No clinic available near you.");
          }
          setDoctors(data.doctors);
        },
        (error) => {
          console.error("Failed to get location:", error);
        }
      );
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  const setFilter = (e) => {
    if (e.target.value === "rating") {
      fetchDoctors("rating");
    } else if (e.target.value === "price") {
      fetchDoctors("price");
    } else if (e.target.value === "near-me") {
      fetchDoctorsNearUser();
    } else {
      fetchDoctors();
    }
  };
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      minH={"80vh"}
      flexDir={"column"}
      paddingX={"var(--page-padding-x)"}
      paddingY={"var(--page-padding-y)"}
      width={{ sm: "100%", md: "100%" }}
      id={id}
    >
      <>
        <p
          style={{
            display: "inline-block",
            padding: "6px 20px",
            background: `linear-gradient(
  135deg,
  #E6EEF6 0%,
  #D4E2F1 50%,
  #C1D6EB 100%
)`,
            color: "var(--primary-green-color)",
            fontWeight: 600,
            fontSize: "18px",
            borderRadius: "999px",
            letterSpacing: "0.3px",
            marginBottom: "10px",
          }}
        >
          Popular Doctors
        </p>

        <Typography
          variant="heading"
          weight="semibold"
          style={{
            textAlign: "center",
            lineHeight: "1.1",
            margin: "6px 0 48px",
          }}
        >
          Highly rated and trusted
          <br />
          by patients across the platform
        </Typography>

        {/* filter will implement in /doctor page */}
        {/* <Select
            placeholder="All"
            width="200px"
            alignSelf={"flex-start"}
            _focus={{ border: "none", outline: "none", borderColor: "white" }}
            onChange={setFilter} // Call function on change

          >
            <option value="rating">Rating</option>
            <option value="near-me">Clinic near you</option>
            <option value="price">Price</option>
          </Select> */}
        {doctors.length > 0 ? (
          <>
            <SimpleGrid
              columns={{ base: 1,sm:1, md: 2, lg: 3,xl:4 }}
              spacing="40px"
              spacingY={"56px"}
              p={"0 0 20px"}
            >
              {doctors.slice(0, 8).map((d) => (
                <DoctorCard
                  key={d._id}
                  doctor={d}
                  handleFunction={() => getSingleDoctor(d._id)}
                />
              ))}
            </SimpleGrid>
            {/* this link to doctor page once we have one */}
            <Link to={"/#"} className="viewAllLink">
              View all doctors <FaLongArrowAltRight size={25} />
            </Link>
          </>
        ) : (
          <h1 className="no-item-text" style={{ alignSelf: "center" }}>
            {loadingText}
          </h1> // Loading fallback
        )}
      </>
    </Box>
  );
};

export default TopDoctors;
