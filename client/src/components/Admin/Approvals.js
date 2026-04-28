import React, { useCallback, useEffect, useState } from "react";
import { useAuthState } from "../../context/AuthProvider";
import { Box, Text } from "@chakra-ui/react";
import ReqCard from "../Approval/ReqCard";
import axios from 'axios';
import { FiUserCheck } from "react-icons/fi";
import { AdminEmptyState, AdminPageHero, AdminPanel } from "./adminPageComponent/AdminLayout";
const Approvals = () => {
  const { user } = useAuthState();
  const [reqs,setReqs]=useState([]);
  const fetchReqs = useCallback(async () => {
    const token = user?.jwt;
  
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/user/request`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
        }
      );
  
      if (data.success) {
        setReqs(data?.reqs);
      }
    } catch (error) {
      console.error("Error fetching requests:", error.response?.data || error.message);
    }
  }, [user?.jwt]);
  
  useEffect(()=>{
    fetchReqs();
  },[fetchReqs])
  return (
    <Box w="full" maxW="1180px" mx="auto">
      <AdminPageHero
        badge="Approvals"
        title="Pending doctor approvals"
        description="Review new doctor applications in the same calm, glassy layout used across the rest of the profile area."
        stats={[
          {
            label: "Pending requests",
            value: reqs.length,
            detail: "Applications waiting for admin review.",
            icon: FiUserCheck,
          },
        ]}
      >
        <Box
          w={{ base: "full", xl: "290px" }}
          p={4}
          borderRadius="22px"
          bg="rgba(31, 58, 95, 0.04)"
          border="1px solid rgba(31, 58, 95, 0.08)"
        >
          <Text fontSize="sm" color="var(--regular-color)">
            Queue status
          </Text>
          <Text mt={1} fontSize="2xl" fontWeight="800" color="var(--heading-color)">
            {reqs.length}
          </Text>
          <Text fontSize="sm" color="var(--regular-color)" mt={2} lineHeight="1.6">
            Every item here comes from the live DoctorInfo request collection.
          </Text>
        </Box>
      </AdminPageHero>

      <AdminPanel minH={{ base: "52vh", md: "60vh" }}>
        {reqs?.length > 0 ? (
          <Box display="flex" flexDir="column" gap={4}>
            {reqs?.map((req) => (
              <ReqCard key={req?._id} req={req} setReqs={setReqs} />
            ))}
          </Box>
        ) : (
          <AdminEmptyState
            title="No requests waiting right now"
            description="When a doctor applies, their request will appear here automatically."
          />
        )}
      </AdminPanel>
    </Box>
  );
};

export default Approvals;
