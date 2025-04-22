import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { createPayment } from "../../api/paymentApi";
import { fetchUserByEmail } from "../../api/userApi";
import getUserDetails from "../../customHooks/extractPayload";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PAYEMENT_KEY);

const PaymentForm = () => {
  const stripe = useStripe();
  const [foodName, setFoodName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [customerPhone, setMobile] = useState("");

  const [userDetails, setUserDetails] = useState<any>(null);
  useEffect(() => {
    const details = getUserDetails();
    setUserDetails(details);
  }, []);

  const { data: userData } = useQuery({
    queryKey: ["users", userDetails?.email],
    queryFn: () => fetchUserByEmail(userDetails?.email),
    enabled: !!userDetails?.email,
  });

  const { mutate: paymentMutation, isPending: isPaymentPending } = useMutation({
    mutationFn: createPayment,
    onSuccess: async (data) => {
      if (data.id && stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.id,
        });

        if (error) {
          setMessage(error.message || "An unknown error occurred.");
        } else {
          enqueueSnackbar("Redirecting to Stripe...", { variant: "info" });
        }
      } else {
        setMessage("Failed to create checkout session.");
      }
    },
    onError: (error) => {
      console.log(error);

      // Ensure we get a readable error message
      const errorMsg =
        (error as any)?.response?.data?.message ?? "Payment Failed";

      enqueueSnackbar(errorMsg, { variant: "error" });
      setMessage(errorMsg);
    },
  });

  const handlePayment = async () => {
    if (!foodName || !amount) {
      setMessage("Please fill in all fields.");
      return;
    }

    const paymentData = {
      foodName,
      currency,
      amount: parseFloat(amount), //////////
      email,
      customerPhone,
    };

    paymentMutation(paymentData);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen p-4">
      <h2 className="text-xl font-semibold mb-4">Make a Payment</h2>

      <label className="block mb-2">Food Name:</label>
      <input
        type="text"
        value={foodName}
        onChange={(e) => setFoodName(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />

      <label className="block mb-2">Currency:</label>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="LKR">LKR</option>
      </select>

      <label className="block mb-2">Amount:</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />

      <label className="block mb-2">Mobile:</label>
      <input
        type="number"
        value={userData?.map((user: any) => user.mobile) || ""}
        onChange={(e) => setMobile(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />
      <label className="block mb-2">Email:</label>
      <input
        type="email"
        value={userData?.map((user: any) => user.email) || ""}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />

      <button
        type="button"
        onClick={handlePayment}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        disabled={isPaymentPending}
      >
        {isPaymentPending ? "Processing..." : "Pay Now"}
      </button>

      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
};

const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default PaymentPage;
