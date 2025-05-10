import { useQuery } from "@tanstack/react-query";
import { fetchMyOrders, CheckoutEvent } from "../../api/myOrdersApi";
import getUserDetails from "../../customHooks/extractPayload";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  useTheme,
  Button,
} from "@mui/material";
import {
  ShoppingBag,
  Person,
  Email,
  Phone,
  Home,
  Receipt,
  Launch,
} from "@mui/icons-material";
import Navbar from "../../components/layOuts/Navbar";
import { motion } from "framer-motion";
import Footer from "../../components/layOuts/Footer";

const PaidOrders = () => {
  const theme = useTheme();
  const userDetails = getUserDetails();
  const email = userDetails?.email;

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["paidOrders", email],
    queryFn: () => fetchMyOrders(email!),
    enabled: !!email,
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Navbar />
        <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            Failed to load orders. Please try again.
          </Alert>
        </Box>
      </>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <>
        <Navbar />
        <Box sx={{ p: 4, textAlign: "center", minHeight: "60vh" }}>
          <Paper
            elevation={3}
            sx={{ p: 4, borderRadius: 3, maxWidth: 600, mx: "auto" }}
          >
            <ShoppingBag
              sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              You have no paid orders yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your orders will appear here after you make a purchase
            </Typography>
          </Paper>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 900, mx: "auto" }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            My Orders
          </Typography>
          <Typography variant="subtitle1">
            Managing your purchase history
          </Typography>
        </Paper>

        <Stack spacing={3}>
          {orders.map((order: CheckoutEvent) => {
            // The members object directly holds all your fields:
            const m = order?.data?.object?.members;

            // metadata and customer_details are under m
            const metadata = m?.metadata?.members;
            const customer = m?.billing_details?.members;
            const addr = customer?.address?.members;

            // amounts are nested one level deeper in .value
            const total = m?.amount?.value?.value;
            const pId = m?.payment_intent?.value;
            const receiptUrl = m?.receipt_url?.value;
            const signedUrl = metadata?.signedUrl?.value;

            return (
              <Card
                key={order.id}
                elevation={2}
                sx={{
                  borderRadius: 3,
                  overflow: "visible",
                  position: "relative",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <Box sx={{ position: "absolute", top: -16, right: 20 }}>
                  <Chip
                    label="Paid"
                    color="success"
                    sx={{ fontWeight: "bold", px: 1 }}
                  />
                </Box>

                <Box sx={{ width: "100%", height: 200, overflow: "hidden" }}>
                  <img
                    src={signedUrl}
                    alt={metadata?.foodName?.value || "Order image"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems="flex-start"
                    justifyContent="space-between"
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {metadata?.foodName?.value}
                      </Typography>

                      <Stack spacing={1.5} sx={{ mt: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Person fontSize="small" color="action" />
                          <Typography variant="body2">
                            {customer?.name?.value}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                          <Email fontSize="small" color="action" />
                          <Typography variant="body2">
                            {customer?.email?.value}
                          </Typography>
                          
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center">
                          <Phone fontSize="small" color="action" />
                          <Typography variant="body2">
                            {metadata?.phone?.value}
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="flex-start"
                        >
                          <Home
                            fontSize="small"
                            color="action"
                            sx={{ mt: 0.5 }}
                          />
                          <Typography variant="body2">
                            {addr?.line1?.value}
                            {addr?.line2?.value && `, ${addr?.line2?.value}`}
                            <br />
                            {addr?.city?.value}, {addr?.country?.value}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>

                    <Box>
                      <Paper
                        elevation={0}
                        sx={{
                          backgroundColor: theme.palette.grey[50],
                          p: 2,
                          borderRadius: 2,
                          minWidth: { xs: "100%", sm: 140 },
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Order Total
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="primary"
                        >
                          Rs. {(Number(total) / 100).toFixed(2)}

                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          spacing={0.5}
                        >
                          <Receipt fontSize="small" color="action" />
                          <Button
                            href={receiptUrl ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<Launch fontSize="small" />}
                            size="small"
                          >
                            View Receipt
                          </Button>
                          <Typography variant="body2">
                            {pId}
                          </Typography>
                        </Stack>
                      </Paper>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Box>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Footer />
      </motion.div>
    </>
  );
};

export default PaidOrders;
