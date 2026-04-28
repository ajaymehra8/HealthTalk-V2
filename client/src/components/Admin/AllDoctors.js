import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Text } from '@chakra-ui/react'
import axios from 'axios';
import { useAuthState } from '../../context/AuthProvider';
import DoctorCard from './allDoctorsComponent/DoctorCard';
import { FiUsers } from 'react-icons/fi';
import { AdminEmptyState, AdminPageHero, AdminPanel } from './adminPageComponent/AdminLayout';
const Doctors = () => {
  const [doctors,setDoctors]=useState([]);
  const {user}=useAuthState();

  let token = user?.jwt;
  const [loading, setLoading] = useState(false);

  const fetchDoctors = useCallback(async () => {
    if (!token) return;
    setLoading(true);
       const { data } = await axios.get(
         `${process.env.REACT_APP_API_URL}/api/v1/user`,
         {
           headers: {
             "Content-Type": "application/json",
             authorization: `Bearer ${token}`,
           },
         }
       );
    if (data.success) {
      setDoctors(data?.doctors);
    }
    setLoading(false);
  }, [ token]);
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const averageRating = useMemo(() => {
    if (!doctors.length) return 0;
    const totalRating = doctors.reduce(
      (sum, doctor) => sum + Number(doctor?.avgRating || 0),
      0
    );
    return (totalRating / doctors.length).toFixed(1);
  }, [doctors]);

  return (
    <Box w="full" maxW="1180px" mx="auto">
      <AdminPageHero
        badge="Doctors"
        title="All verified doctors"
        description="This screen now shares the same soft profile-shell styling, so the admin area and profile area feel like one experience."
        stats={[
          {
            label: "Total doctors",
            value: doctors.length,
            detail: "Doctors currently listed in the directory.",
            icon: FiUsers,
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
            Average rating
          </Text>
          <Text mt={1} fontSize="2xl" fontWeight="800" color="var(--heading-color)">
            {averageRating}
          </Text>
          <Text fontSize="sm" color="var(--regular-color)" mt={2} lineHeight="1.6">
            Real appointments and review counts are pulled for each doctor card.
          </Text>
        </Box>
      </AdminPageHero>

      <AdminPanel minH={{ base: "52vh", md: "60vh" }} overflowY="auto">
        {!loading ? (
          doctors.length > 0 ? (
            <Box display="flex" flexDir="column" gap={4}>
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor?._id}
                  doctor={doctor}
                  setDoctors={setDoctors}
                />
              ))}
            </Box>
          ) : (
            <AdminEmptyState
              title="No doctors available"
              description="Once a doctor profile is approved, it will appear here automatically."
            />
          )
        ) : (
          <AdminEmptyState
            title="Loading doctors"
            description="Fetching the current directory now."
          />
        )}
      </AdminPanel>
    </Box>
  )
}

export default Doctors
