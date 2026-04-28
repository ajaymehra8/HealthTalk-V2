import React, { useCallback, useEffect, useState } from 'react'
import { Box, Text } from '@chakra-ui/react'
import ReportCard from './reportComponent/ReportCard';
import axios from 'axios';
import { useAuthState } from '../../context/AuthProvider';
import { FiFileText } from 'react-icons/fi';
import { AdminEmptyState, AdminPageHero, AdminPanel } from './adminPageComponent/AdminLayout';
const Reports = () => {
  const [reports,setReports]=useState([]);
  const {user}=useAuthState();

  let token = user?.jwt;
  const [loading, setLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    if (!token) return;
    setLoading(true);
       const { data } = await axios.get(
         `${process.env.REACT_APP_API_URL}/api/v1/report`,
         {
           headers: {
             "Content-Type": "application/json",
             authorization: `Bearer ${token}`,
           },
         }
       );
    if (data.success) {
      setReports(data?.reports);
    }
    setLoading(false);
  }, [ token]);
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <Box w="full" maxW="1180px" mx="auto">
      <AdminPageHero
        badge="Reports"
        title="User reports and moderation"
        description="See doctor reports in the same glass-card language so moderation stays focused and easy to scan."
        stats={[
          {
            label: "Reports",
            value: reports.length,
            detail: "Submitted moderation cases.",
            icon: FiFileText,
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
            Moderation focus
          </Text>
          <Text mt={1} fontSize="2xl" fontWeight="800" color="var(--heading-color)">
            {reports.length}
          </Text>
          <Text fontSize="sm" color="var(--regular-color)" mt={2} lineHeight="1.6">
            Each report is fetched live and can be reviewed or removed from this screen.
          </Text>
        </Box>
      </AdminPageHero>

      <AdminPanel minH={{ base: "52vh", md: "60vh" }} overflowY="auto">
        {!loading ? (
          reports.length > 0 ? (
            <Box display="flex" flexDir="column" gap={4}>
              {reports.map((report) => (
                <ReportCard
                  key={report?._id}
                  report={report}
                  setReports={setReports}
                  reports={reports}
                />
              ))}
            </Box>
          ) : (
            <AdminEmptyState
              title="No reports to review"
              description="When a patient files a report, it will appear here with the linked doctor profile."
            />
          )
        ) : (
          <AdminEmptyState
            title="Loading reports"
            description="Hold on while we fetch the latest moderation queue."
          />
        )}
      </AdminPanel>
    </Box>
  )
}

export default Reports
