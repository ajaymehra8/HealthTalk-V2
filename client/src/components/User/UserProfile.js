import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useAuthState } from "../../context/AuthProvider";
import Navbar from "../Navbar/Navbar";
import UserInfoCard from "./UserInfoCard";
import ProfSideBar from "../ProfSideBar";
import { Routes, Route, Navigate } from "react-router-dom";
import Approvals from "../Admin/Approvals";
import DoctorInfo from "../Doctors/DoctorInfo";
import UserAppoinments from "./UserAppoinments";
import Appoinments from "../Doctors/Appoinments/Appoinments";
import Reviews from "./Reviews/Reviews";
import DoctorReviews from "../Doctors/Reviews/DoctorReviews";
import Earning from "../Doctors/Earning/Earning";
import WebInfo from "../Admin/adminPageComponent/WebInfo";
import AdminReports from "../Admin/AdminReports";
import AllDoctors from "../Admin/AllDoctors";
import ReqProfCard from "../Admin/ReqProfCard";

const PROFILE_NAV_OFFSET = 66;

const UserInfo = () => {
  const { user } = useAuthState();
  return (
    <>
      <Navbar />

      <Box
        position="relative"
        minH="100vh"
        w="full"
        overflow="hidden"
        pt={`${PROFILE_NAV_OFFSET}px`}
        bgGradient="linear(135deg, var(--profile-page-bg-start) 0%, var(--page-background-color) 50%, var(--profile-page-bg-end) 100%)"
      >
        <Box
          position="absolute"
          top="-90px"
          right="-80px"
          w="260px"
          h="260px"
          borderRadius="full"
          bg="rgba(55, 189, 115, 0.14)"
          filter="blur(10px)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-120px"
          left="-100px"
          w="320px"
          h="320px"
          borderRadius="full"
          bg="rgba(31, 58, 95, 0.1)"
          filter="blur(10px)"
          pointerEvents="none"
        />

        <Flex
          minH={`calc(100vh - ${PROFILE_NAV_OFFSET}px)`}
          alignItems="stretch"
          justifyContent="flex-start"
          position="relative"
          w="full"
        >
          <ProfSideBar topOffset={PROFILE_NAV_OFFSET} />
          <Box
            w={{ lg: "78%", base: "100%" }}
            ml={{ lg: "22%", base: "0" }}
            bg="var(--profile-shell-bg)"
            backdropFilter="blur(18px)"
            borderLeft={{ base: "none", lg: "1px solid var(--profile-shell-border)" }}
            boxSizing="border-box"
            minH="100%"
            height="auto"
            display="flex"
            pt={{ base: 6, md: 8, lg: 10 }}
            pb={{ base: 5, md: 6 }}
            px={{ base: 4, md: 6, xl: 8 }}
            flexDir="column"
            alignItems="center"
            justifyContent="flex-start"
            overflow="hidden"
            position="relative"
            boxShadow="inset 0 1px 0 rgba(255,255,255,0.36)"
          >
            <Box w="full" maxW="1180px">
              <Routes>
                <Route
                  path="my-info"
                  element={
                    user?.role === "doctor" ? (
                      <DoctorInfo />
                    ) : user?.role === "user" ? (
                      <UserInfoCard />
                    ) : (
                      <WebInfo />
                    )
                  }
                />
                <Route path="approvals/:reqId" element={<ReqProfCard />} />
                <Route path="approvals" element={<Approvals />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="all-doctors" element={<AllDoctors />} />

                <Route path="my-appoinment" element={<UserAppoinments />} />
                <Route path="appoinments" element={<Appoinments />} />
                <Route
                  path="my-reviews"
                  element={
                    !(user?.role === "doctor") ? <Reviews /> : <DoctorReviews />
                  }
                />
                <Route path="earning" element={<Earning />} />
                <Route path="/" element={<Navigate to="my-info" replace />} />{" "}
                {/* Default option */}
              </Routes>
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default UserInfo;
