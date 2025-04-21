import React from "react";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

// Define the MenuItem type
interface MenuItem {
  id: string | number;
  name: string;
  description: string;
  price: number;
  signedUrl: string;
}

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  return (
    <Card 
      sx={{ 
        width: 300,
        height: "100%",
        display: "flex", 
        flexDirection: "column",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: 8,
        },
        borderRadius: 2,
        overflow: "hidden"
      }}
    >
      <Box sx={{ position: "relative", height: 180, width: "100%" }}>
        <CardMedia
          component="img"
          image={item.signedUrl}
          alt={item.name}
          sx={{ 
            height: "100%",
            objectFit: "cover",
            backgroundPosition: "center"
          }}
        />
      </Box>
      <CardContent sx={{ 
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 3
      }}>
        <Box>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ 
              fontWeight: 600,
              mb: 1,
              color: "#333"
            }}
          >
            {item.name}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mb: 2,
              lineHeight: 1.6
            }}
          >
            {item.description}
          </Typography>
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            color: "primary.main",
            display: "inline-block",
            position: "relative",
            "&::before": {
              content: '"$"',
              fontSize: "0.8em",
              position: "relative",
              top: "-0.2em",
              marginRight: "2px",
            }
          }}
        >
          {item.price}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;