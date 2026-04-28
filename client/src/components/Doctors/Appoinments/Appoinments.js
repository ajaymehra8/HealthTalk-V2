import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { FiCalendar, FiCheckCircle, FiClock, FiUser } from "react-icons/fi";
import { useAuthState } from "../../../context/AuthProvider";
import AppoinmentCard from "./AppoinmentCard";
import {
  AdminEmptyState,
  AdminPageHero,
  AdminPanel,
} from "../../Admin/adminPageComponent/AdminLayout";

const Appoinments = () => {
  const { user } = useAuthState();
  const [appoinments, setAppoinments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppoinments = useCallback(async () => {
    const token = user?.jwt;
    if (!token) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/booking/get-doctor-appoinments/${user?.id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setAppoinments(Array.isArray(data?.bookings) ? data.bookings : []);
      } else {
        setAppoinments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
      setAppoinments([]);
    } finally {
      setLoading(false);
    }
  }, [user?.jwt]);

  useEffect(() => {
    fetchAppoinments();
  }, [fetchAppoinments]);

  const appointmentStats = useMemo(() => {
    const scheduled = appoinments.filter((appt) => Boolean(appt?.time)).length;
    const waiting = appoinments.length - scheduled;
    const paid = appoinments.filter((appt) => Boolean(appt?.payment)).length;

    return {
      total: appoinments.length,
      scheduled,
      waiting,
      paid,
    };
  }, [appoinments]);

  return (
    <Box w="full" maxW="1180px" mx="auto">
      <AdminPageHero
        badge="Doctor workspace"
        title="Your appointment queue"
        description="Review incoming patient bookings, set visit times, and keep the schedule moving in the same calm visual language as the rest of the app."
        stats={[
          {
            label: "Total appointments",
            value: appointmentStats.total,
            detail: "All bookings currently in the queue.",
            icon: FiCalendar,
          },
          {
            label: "Scheduled",
            value: appointmentStats.scheduled,
            detail: "Bookings that already have a confirmed time.",
            icon: FiClock,
          },
          {
            label: "Waiting",
            value: appointmentStats.waiting,
            detail: "Bookings that still need a time slot.",
            icon: FiUser,
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
            {appointmentStats.waiting}
          </Text>
          <Text fontSize="sm" color="var(--regular-color)" mt={2} lineHeight="1.6">
            Bookings still waiting for a scheduled visit time.
          </Text>
          <Stack direction="row" spacing={2} mt={3} align="center">
            <Box
              as={FiCheckCircle}
              color="var(--primary-green-color)"
              fontSize="14px"
            />
            <Text fontSize="sm" color="var(--heading-color)" fontWeight="700">
              {appointmentStats.paid} paid visits
            </Text>
          </Stack>
        </Box>
      </AdminPageHero>

      <AdminPanel minH={{ base: "58vh", md: "64vh" }}>
        {loading ? (
          <Flex minH="48vh" align="center" justify="center">
            <Stack spacing={3} align="center" color="var(--heading-color)">
              <Spinner
                thickness="3px"
                speed="0.7s"
                color="var(--primary-green-color)"
                size="xl"
              />
              <Text fontWeight="700">Loading appointments...</Text>
            </Stack>
          </Flex>
        ) : appoinments.length > 0 ? (
          <Stack spacing={4}>
            {appoinments.map((appoinment, index) => (
              <AppoinmentCard
                key={appoinment._id}
                appoinment={appoinment}
                setAppoinments={setAppoinments}
                index={index}
              />
            ))}
          </Stack>
        ) : (
          <AdminEmptyState
            title="No appointments waiting right now"
            description="Once a patient books a visit, it will appear here with the same polished card style used across the rest of the workspace."
          />
        )}
      </AdminPanel>
    </Box>
  );
};

export default Appoinments;
