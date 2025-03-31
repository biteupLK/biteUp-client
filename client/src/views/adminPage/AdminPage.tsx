import React from 'react';
import { Box, ThemeProvider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import theme from "../../theme"; // Import your Poppins theme
import Navbar from "../../components/layOuts/Navbar";
import { useQuery } from '@tanstack/react-query';
import { fetchRestaurantData } from "../../api/restaurantApi";

const Error: React.FC = () => {
    const { data: restaurantData, isFetching: isRestFetching } = useQuery({
        queryKey: ["restaurant"],
        queryFn: fetchRestaurantData,
    });

    return (
        <ThemeProvider theme={theme}>
            <Navbar />
            <Box sx={{ padding: 2 }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Restaurant Name</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Quantity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {restaurantData?.map((restaurant: any) => (
                                <TableRow key={restaurant.id}>
                                    <TableCell>{restaurant.restaurantName}</TableCell>
                                    <TableCell>{restaurant.adress}</TableCell>
                                    <TableCell>{restaurant.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </ThemeProvider>
    );
};

export default Error;
