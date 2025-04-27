import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

const WelcomePage: React.FC = ({}) => {
    return (
        <Box sx={{ p: 2 }}>
            <Card elevation={3} sx={{ mb: 3, backgroundColor: "#f5f9ff" }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Welcome to Your Restaurant Setup
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Before you can start using the platform, you need to complete your restaurant profile. This information will be used to create your restaurant page.
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  This setup wizard will guide you through the process step by step. You'll need:
                </Typography>
                <ul>
                  <Typography component="li" variant="body1">Your restaurant logo (high-quality image)</Typography>
                  <Typography component="li" variant="body1">Basic restaurant information</Typography>
                  <Typography component="li" variant="body1">Restaurant location and address details</Typography>
                  <Typography component="li" variant="body1">Contact information</Typography>
                </ul>
                <Typography variant="body1" sx={{ mt: 2, fontWeight: "bold" }}>
                  Let's get started!
                </Typography>
              </CardContent>
            </Card>
          </Box>
    );
};

export default WelcomePage;