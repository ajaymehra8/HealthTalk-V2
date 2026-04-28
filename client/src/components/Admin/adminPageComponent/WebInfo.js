import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge, Box, Flex, SimpleGrid, Spinner, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { FiCalendar, FiDollarSign, FiFileText, FiUserCheck, FiUsers } from "react-icons/fi";
import { useAuthState } from "../../../context/AuthProvider";
import BarGraph from "../../graph/BarGraph";
import LineGraph from "../../graph/LineGraph";
import { AdminEmptyState, AdminPageHero, AdminPanel } from "./AdminLayout";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const WebInfo = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthState();

  const fetchDetails = useCallback(async () => {
    try {
      const token = user?.jwt;
      if (!token) return;

      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/user/get-website-details`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setDashboard(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const overview = dashboard?.overview;
  const charts = dashboard?.charts || {};

  const overviewStats = useMemo(
    () => {
      const currentOverview = overview ?? {};

      return [
        {
          label: "Total Doctors",
          value: currentOverview.doctors ?? 0,
          detail: "Verified doctors on the platform.",
          icon: FiUsers,
        },
        {
          label: "Registered Users",
          value: currentOverview.users ?? 0,
          detail: "Active user accounts in the system.",
          icon: FiUserCheck,
        },
        {
          label: "Appointments",
          value: currentOverview.appoinments ?? 0,
          detail: "Bookings created across the platform.",
          icon: FiCalendar,
        },
        {
          label: "Pending Approvals",
          value: currentOverview.pendingApprovals ?? 0,
          detail: "Doctor applications waiting for review.",
          icon: FiFileText,
        },
        {
          label: "Reports",
          value: currentOverview.reports ?? 0,
          detail: "Patient reports submitted against doctors.",
          icon: FiFileText,
        },
        {
          label: "Estimated Revenue",
          value: currencyFormatter.format(currentOverview.estimatedRevenue || 0),
          detail: "Collected from paid appointments this year.",
          icon: FiDollarSign,
        },
      ];
    },
    [overview]
  );

  const appointmentTrend = charts.appointmentsTrend || {};
  const revenueTrend = charts.revenueTrend || {};
  const roleBreakdown = charts.roleBreakdown || {};

  const chartFrameStyles = {
    p: { base: 4, md: 5 },
    borderRadius: "26px",
    bg: "rgba(255,255,255,0.88)",
    border: "1px solid rgba(31, 58, 95, 0.08)",
    boxShadow: "0 18px 40px rgba(31, 58, 95, 0.06)",
    backdropFilter: "blur(14px)",
  };

  return (
    <Box w="full" maxW="1180px" mx="auto">
      <AdminPageHero
        badge="Admin overview"
        title="A quieter, clearer view of the whole platform"
        description="These charts are tied to live booking, approval, and report data so the dashboard reflects what is really happening right now."
        stats={overviewStats}
      >
        <Box
          w={{ base: "full", xl: "290px" }}
          p={4}
          borderRadius="22px"
          bg="rgba(31, 58, 95, 0.04)"
          border="1px solid rgba(31, 58, 95, 0.08)"
        >
          <Stack spacing={1.5}>
            <Badge
              alignSelf="flex-start"
              px={3}
              py={1}
              borderRadius="full"
              bg="var(--auth-soft-accent-bg)"
              color="var(--primary-green-color)"
              border="1px solid var(--auth-soft-accent-border)"
              letterSpacing="0.16em"
              textTransform="uppercase"
              fontSize="10px"
              fontWeight="800"
            >
              Live stats
            </Badge>
            <Text fontSize="sm" color="var(--regular-color)">
              Current year
            </Text>
            <Text fontSize="2xl" fontWeight="800" color="var(--heading-color)">
              {new Date().getFullYear()}
            </Text>
            <Text fontSize="sm" color="var(--regular-color)" lineHeight="1.6">
              Monthly graphs, revenue estimates, and workload totals are pulled from the backend on each load.
            </Text>
          </Stack>
        </Box>
      </AdminPageHero>

      <AdminPanel minH="auto">
        {loading && !dashboard ? (
          <Flex minH={{ base: "52vh", md: "60vh" }} align="center" justify="center">
            <Stack spacing={3} align="center">
              <Spinner size="xl" thickness="4px" color="var(--primary-green-color)" />
              <Text fontSize="sm" color="var(--regular-color)">
                Loading live dashboard data...
              </Text>
            </Stack>
          </Flex>
        ) : !dashboard ? (
          <AdminEmptyState
            title="Dashboard data is not ready"
            description="The admin summary is only available once the backend returns live platform metrics."
          />
        ) : (
          <Stack spacing={5}>
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
              <Box {...chartFrameStyles}>
                <Stack spacing={1.5} mb={4}>
                  <Text
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="0.18em"
                    fontWeight="800"
                    color="var(--secondary-gray-color)"
                  >
                    Appointments trend
                  </Text>
                  <Text fontSize="lg" fontWeight="800" color="var(--heading-color)">
                    Monthly bookings vs paid bookings
                  </Text>
                  <Text fontSize="sm" color="var(--regular-color)">
                    This line chart shows how the booking queue moved through the year.
                  </Text>
                </Stack>
                <LineGraph
                  labels={appointmentTrend.labels}
                  datasets={appointmentTrend.datasets}
                  height={280}
                />
              </Box>

              <Box {...chartFrameStyles}>
                <Stack spacing={1.5} mb={4}>
                  <Text
                    fontSize="xs"
                    textTransform="uppercase"
                    letterSpacing="0.18em"
                    fontWeight="800"
                    color="var(--secondary-gray-color)"
                  >
                    Revenue trend
                  </Text>
                  <Text fontSize="lg" fontWeight="800" color="var(--heading-color)">
                    Estimated monthly revenue
                  </Text>
                  <Text fontSize="sm" color="var(--regular-color)">
                    Revenue is estimated from paid appointments and doctor clinic fees.
                  </Text>
                </Stack>
                <BarGraph
                  labels={revenueTrend.labels}
                  datasets={revenueTrend.datasets}
                  height={280}
                />
              </Box>
            </SimpleGrid>

            <Box {...chartFrameStyles}>
              <Stack spacing={1.5} mb={4}>
                <Text
                  fontSize="xs"
                  textTransform="uppercase"
                  letterSpacing="0.18em"
                  fontWeight="800"
                  color="var(--secondary-gray-color)"
                >
                  Platform mix
                </Text>
                <Text fontSize="lg" fontWeight="800" color="var(--heading-color)">
                  Users, doctors, and admins
                </Text>
                <Text fontSize="sm" color="var(--regular-color)">
                  A simple bar view of the current account mix on the platform.
                </Text>
              </Stack>
              <BarGraph
                labels={roleBreakdown.labels}
                datasets={roleBreakdown.datasets}
                height={240}
              />
            </Box>
          </Stack>
        )}
      </AdminPanel>
    </Box>
  );
};

export default WebInfo;
