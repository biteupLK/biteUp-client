import React from "react";
import { Box, Skeleton } from "@mui/material";

const MenuItemSkeleton: React.FC = () => {
  return (
    <Box sx={{ width: 300, mb: 2 }}>
      <Skeleton
        variant="rectangular"
        height={180}
        sx={{ borderRadius: "8px 8px 0 0" }}
      />
      <Box sx={{ p: 1.5 }}>
        <Skeleton variant="text" height={40} sx={{ mt: 1 }} />
        <Skeleton variant="text" height={80} />
        <Skeleton variant="text" width={80} height={30} />
      </Box>
    </Box>
  );
};

export default MenuItemSkeleton;
