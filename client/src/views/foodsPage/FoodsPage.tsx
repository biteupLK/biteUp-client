import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Container } from "@mui/material";

import Navbar from "../../components/layOuts/Navbar";
import { getMenuItems, MenuItem } from "../../api/menuItemApi";
import MenuItemSkeleton from "../../components/SkeltonLoader";
import MenuItemCard from "../../components/MenuCard";

const FoodsPage: React.FC = () => {
  const { data: menuItemData, isLoading } = useQuery({
    queryKey: ["menuItems"],
    queryFn: getMenuItems,
  });

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <MenuItemSkeleton key={i} />
              ))
            : menuItemData?.map((item: MenuItem) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
        </Box>
      </Container>
    </>
  );
};

export default FoodsPage;
