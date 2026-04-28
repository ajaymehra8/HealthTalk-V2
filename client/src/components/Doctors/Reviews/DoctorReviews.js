import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Box, Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import { FiMessageSquare, FiStar, FiUsers } from "react-icons/fi";
import { useAuthState } from "../../../context/AuthProvider";
import DocReviewCard from "./DocReviewCard";
import {
  AdminEmptyState,
  AdminPageHero,
  AdminPanel,
} from "../../Admin/adminPageComponent/AdminLayout";

const DoctorReviews = () => {
  const { user } = useAuthState();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    const token = user?.jwt;
    if (!token) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/review`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [user?.jwt]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const reviewStats = useMemo(() => {
    const totalReviews = reviews.length;
    const averageRating = totalReviews
      ? reviews.reduce((sum, review) => sum + Number(review?.rating || 0), 0) /
        totalReviews
      : 0;
    const fiveStarReviews = reviews.filter((review) => Number(review?.rating || 0) === 5)
      .length;
    const latestReview = reviews[0];

    return {
      totalReviews,
      averageRating,
      fiveStarReviews,
      latestReview,
    };
  }, [reviews]);

  return (
    <Box w="full" maxW="1180px" mx="auto">
      <AdminPageHero
        badge="Doctor workspace"
        title="Patient reviews"
        description="Read and manage the feedback your patients leave in a layout that matches the profile and admin areas."
        stats={[
          {
            label: "Total reviews",
            value: reviewStats.totalReviews,
            detail: "All feedback currently attached to your profile.",
            icon: FiMessageSquare,
          },
          {
            label: "Average rating",
            value: reviewStats.averageRating
              ? reviewStats.averageRating.toFixed(1)
              : "0.0",
            detail: "The overall score from patient feedback.",
            icon: FiStar,
          },
          {
            label: "Five-star reviews",
            value: reviewStats.fiveStarReviews,
            detail: "Perfect reviews collected from patients.",
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
            Latest review
          </Text>
          <Text mt={1} fontSize="2xl" fontWeight="800" color="var(--heading-color)">
            {reviewStats.latestReview?.createdAt
              ? moment(reviewStats.latestReview.createdAt).fromNow()
              : "No reviews yet"}
          </Text>
          <Text fontSize="sm" color="var(--regular-color)" mt={2} lineHeight="1.6">
            Recent feedback appears at the top so you can quickly scan the newest comments.
          </Text>
          <Stack direction="row" spacing={2} mt={3} align="center">
            <Box
              as={FiStar}
              color="var(--primary-green-color)"
              fontSize="14px"
            />
            <Text fontSize="sm" color="var(--heading-color)" fontWeight="700">
              {reviewStats.averageRating
                ? `${reviewStats.averageRating.toFixed(1)} / 5`
                : "No rating yet"}
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
              <Text fontWeight="700">Loading reviews...</Text>
            </Stack>
          </Flex>
        ) : reviews.length > 0 ? (
          <Stack spacing={4}>
            {reviews.map((review, index) => (
              <DocReviewCard
                key={review._id}
                review={review}
                setReviews={setReviews}
                index={index}
              />
            ))}
          </Stack>
        ) : (
          <AdminEmptyState
            title="No reviews yet"
            description="Once patients start leaving feedback, their reviews will show up here in this same polished card layout."
          />
        )}
      </AdminPanel>
    </Box>
  );
};

export default DoctorReviews;
