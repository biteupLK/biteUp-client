// src/pages/RestaurantOrders.tsx
import React, { useState, useRef, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const RestaurantOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const clientRef = useRef<Client | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const restaurantEmail = "pizzahut@katugasthota.biteup.lk";

  useEffect(() => {
    // Ensure this runs only in client-side
    if (typeof window === 'undefined') return;

    const connect = () => {
      try {
        const socket = new SockJS("http://localhost:8084/ws");
        const client = new Client({
          webSocketFactory: () => socket,
          debug: (str) => {
            console.log(str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
          console.log("Connected to WebSocket");

          client.subscribe("/topic/restaurant-order", (message) => {
            try {
              const response = JSON.parse(message.body);
              console.log("Received order:", response);
              displayOrders(response);
            } catch (error) {
              console.error("Error parsing message:", error);
            }
          });

          client.subscribe("/topic/response", (message) => {
            try {
              const response = JSON.parse(message.body);
              console.log("Server Response:", response);
            } catch (error) {
              console.error("Error parsing response:", error);
            }
          });

          sendRestaurantOrderRequest(client);

          intervalRef.current = setInterval(() => {
            sendRestaurantOrderRequest(client);
          }, 5000);
        };

        client.onStompError = (frame) => {
          console.error("STOMP protocol error:", frame.headers.message);
        };

        client.onWebSocketError = (event) => {
          console.error("WebSocket error:", event);
        };

        client.activate();
        clientRef.current = client;
      } catch (error) {
        console.error("Connection error:", error);
      }
    };

    connect();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (clientRef.current) {
        clientRef.current.deactivate().catch(error => {
          console.error("Deactivation error:", error);
        });
      }
      console.log("Cleanup WebSocket connection");
    };
  }, []);

  const sendRestaurantOrderRequest = (client: Client) => {
    if (client?.connected) {
      try {
        client.publish({
          destination: "/app/get-restaurant-order",
          body: JSON.stringify(restaurantEmail),
        });
        console.log("Sent order request");
      } catch (error) {
        console.error("Error sending request:", error);
      }
    }
  };

  const displayOrders = (response: any) => {
    if (response?.orders?.length > 0) {
      setOrders(response.orders);
    } else {
      setOrders([]);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Restaurant Orders</h1>
      <div style={{ marginTop: "20px" }}>
        {orders.length === 0 ? (
          <p>No orders found for this restaurant.</p>
        ) : (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
};

// Extracted order card component for better readability
const OrderCard: React.FC<{ order: any }> = ({ order }) => {
  const paymentData = order.paymentData || {};
  const customer = paymentData.customer || {};
  const address = customer.address || {};
  const orderDetails = paymentData.orderDetails || {};

  return (
    <div style={styles.order}>
      <div style={styles.orderHeader}>
        <div>
          <h3>{orderDetails.foodName || "Unknown Item"}</h3>
          <div style={styles.orderId}>Order ID: {order.id}</div>
        </div>
        <div style={styles.status}>
          {paymentData.paymentStatus || "Unknown Status"}
        </div>
      </div>

      <div style={styles.orderInfo}>
        <p>
          <strong>Amount:</strong> {paymentData.amount || "0"}{" "}
          {paymentData.currency || ""}
        </p>
        <p>
          <strong>Payment Intent:</strong> {paymentData.paymentIntent || ""}
        </p>
      </div>

      <div style={styles.customerInfo}>
        <h4>Customer Details</h4>
        <p>
          <strong>Name:</strong> {customer.name || "Unknown"}
        </p>
        <p>
          <strong>Email:</strong> {customer.email || ""}
        </p>
        <p>
          <strong>Phone:</strong> {orderDetails.phone || ""}
        </p>
        <div style={styles.address}>
          <strong>Address:</strong>
          <br />
          {address.line1 || ""} {address.line2 || ""}
          <br />
          {address.city || ""}, {address.postalCode || ""}
          <br />
          {address.country || ""}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
  },
  order: {
    border: "1px solid #ddd",
    borderRadius: "5px",
    padding: "15px",
    marginBottom: "15px",
    backgroundColor: "#f9f9f9",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    paddingBottom: "10px",
    borderBottom: "1px solid #eee",
  },
  orderId: {
    color: "#666",
    fontSize: "14px",
  },
  status: {
    fontWeight: "bold",
    color: "green",
  },
  orderInfo: {
    marginTop: "10px",
  },
  customerInfo: {
    marginTop: "10px",
  },
  address: {
    marginTop: "5px",
    color: "#555",
  },
} as const;

export default RestaurantOrders;