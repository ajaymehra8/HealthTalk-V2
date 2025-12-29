import React, { useEffect, useState, useCallback } from "react";
import { Box } from "@chakra-ui/react";
import axios from "axios";
import Navbar from "../components/Navbar";
import TopDoctors from "../components/HomePage/TopDoctors";
import Testimonial from "../components/HomePage/Testimonial";
import Footer from "../components/Footer";
import HeroSection from "../components/HomePage/HeroSection";
import FAQ from "../components/HomePage/FAQ";
import WebsiteReview from "../components/HomePage/WebsiteReview/WebsiteReviews";

const Home = () => {
  const [doctors, setDoctors] = useState([]);

  const getDoctor = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/user`
      );
      setDoctors(data.doctors);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  }, []);

  useEffect(() => {
    getDoctor(); // Fetch data on component mount
  }, [getDoctor]); // Dependency array ensures it runs only once

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      flexDir={"column"}
      background={"#F5F7FA"}
    >
      <Navbar />

      <HeroSection />
      <TopDoctors id="doctors" doctors={doctors} setDoctors={setDoctors} />
      <WebsiteReview />

      <FAQ />

      {/* <Testimonial /> */}

      <Footer />
    </Box>
  );
};

export default Home;
