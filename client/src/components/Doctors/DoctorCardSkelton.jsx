import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Skeleton,
  SkeletonText,
  Box,
  Stack,
  HStack,
} from "@chakra-ui/react";

const DoctorCardSkeleton = () => {
  return (
    <Card
      maxW="290px"
      minW="290px"
      borderRadius="10px"
      boxShadow="0 2px 5px rgba(0, 0, 0, 0.08)"
    >
      <CardBody padding="10px 10px 0 10px">
        {/* Image Skeleton */}
        <Skeleton height="200px" borderRadius="10px" />

        <Stack mt="3" spacing="2">
          {/* Doctor Name */}
          <Skeleton height="18px" width="70%" />

          {/* Specialization */}
          <Skeleton height="14px" width="90%" />

          {/* Location */}
          <Skeleton height="14px" width="60%" />
        </Stack>

        {/* Rating */}
        <HStack spacing={1} mt="3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height="14px" width="14px" borderRadius="2px" />
          ))}
          <Skeleton height="14px" width="80px" ml="2" />
        </HStack>

        {/* Divider */}
        <Box height="1px" bg="#E2E8F0" my="10px" />
      </CardBody>

      <CardFooter padding="0 10px 15px">
        <Box width="100%">
          {/* Fee */}
          <Skeleton height="16px" width="60%" mb="10px" />

          {/* Button */}
          <Skeleton height="40px" borderRadius="6px" />
        </Box>
      </CardFooter>
    </Card>
  );
};

export default DoctorCardSkeleton;
