import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

// Import your logo as needed
import logo from "../../assets/logo/biteUpLogo.png";

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", url: "/about" },
        { name: "Careers", url: "/careers" },
        { name: "Blog", url: "/blog" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", url: "/help" },
        { name: "Contact Us", url: "/contact" },
        { name: "Privacy Policy", url: "/privacy" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "How It Works", url: "/how-it-works" },
        { name: "Partner with Us", url: "/partner" },
        { name: "Gift Cards", url: "/gift-cards" },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        pt: 4,
        pb: 3,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{
                  height: 40,
                  mr: 2,
                }}
              />
              <Typography variant="h6" fontWeight="bold">
                BiteUp
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
              Your favorite restaurants delivered fast to your door.
            </Typography>
            
            {/* Social Media Icons - Compact */}
            <Box sx={{ mb: 2 }}>
              <IconButton
                size="small"
                aria-label="facebook"
                sx={{ 
                  color: "text.secondary",
                  "&:hover": { color: "#1877F2" },
                }}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label="twitter"
                sx={{ 
                  color: "text.secondary",
                  "&:hover": { color: "#1DA1F2" },
                }}
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label="instagram"
                sx={{ 
                  color: "text.secondary",
                  "&:hover": { color: "#E4405F" },
                }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Footer Links - Compact */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {footerLinks.map((section, index) => (
                <Grid item xs={6} sm={4} key={index}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                  >
                    {section.title}
                  </Typography>
                  {section.links.map((link, linkIndex) => (
                    <Link
                      href={link.url}
                      key={linkIndex}
                      underline="none"
                      color="text.secondary"
                      variant="body2"
                      sx={{
                        display: "block",
                        mb: 1,
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Divider and Contact Info */}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row", 
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: 1
        }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PhoneIcon sx={{ mr: 1, fontSize: "1rem", color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                +94 (76) 4748263
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <EmailIcon sx={{ mr: 1, fontSize: "1rem", color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                support@biteup.com
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} BiteUp. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;