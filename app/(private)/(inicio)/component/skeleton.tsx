import { Box, Skeleton } from "@mui/material";

export default function LoadingSkeleton() {
  return (
    <Box className="flex flex-col gap-2 bg-[#e9e9e9] animate-pulse p-5 rounded-lg w-full">
      <Skeleton
        variant="rectangular"
        style={{ borderRadius: 10, width: 300, height: 20 }}
      />
      <Skeleton
        variant="rectangular"
        style={{ borderRadius: 10, width: 250, height: 20 }}
      />
      <Skeleton
        variant="rectangular"
        style={{ borderRadius: 10, width: 230, height: 20 }}
      />
      <Box className="flex gap-2">
        <Skeleton
          variant="rectangular"
          style={{ borderRadius: 100, width: 30, height: 30 }}
        />
        <Skeleton
          variant="rectangular"
          style={{ borderRadius: 100, width: 30, height: 30 }}
        />
        <Skeleton
          variant="rectangular"
          style={{ borderRadius: 100, width: 30, height: 30 }}
        />
      </Box>
    </Box>
  );
}
