// socketService.ts
import SockJS from "sockjs-client";
import { Client, Frame, over, Message } from "stompjs";

type WebSocketMessageHandler = (response: any) => void;

let stompClient: Client | null = null;
let reconnectInterval: NodeJS.Timeout | null = null;
let messageInterval: NodeJS.Timeout | null = null;
const RECONNECT_DELAY = 5000; // 5 seconds
const REQUEST_INTERVAL = 1000; // 1 second

const restaurantEmail = "pizzahut@katugasthota.biteup.lk";
const WS_URL = "http://localhost:8084/ws";
const ORIGIN = "http://localhost:5175";

// Initialize WebSocket connection
export const connectWebSocket = (
  onMessageReceived: WebSocketMessageHandler,
  onConnectionChange?: (connected: boolean) => void
) => {
  // Close any existing connection
  disconnectWebSocket();

  // Create new SockJS connection with Origin header
  const socket = new SockJS(WS_URL, null, {
    transports: ["websocket", "xhr-streaming", "xhr-polling"],
  });

  stompClient = over(socket);

  // Configure STOMP client
  stompClient.debug = (msg: string) => {
    console.debug("[STOMP]", msg);
  };

  // Connect to server
  stompClient.connect(
    { Origin: ORIGIN },
    () => onConnect(onMessageReceived, onConnectionChange),
    (error: Frame | string) =>
      onError(error, onMessageReceived, onConnectionChange)
  );
};

// Handle successful connection
const onConnect = (
  onMessageReceived: WebSocketMessageHandler,
  onConnectionChange?: (connected: boolean) => void
) => {
  console.log("Successfully connected to WebSocket server");

  // Clear any existing reconnect attempts
  if (reconnectInterval) {
    clearInterval(reconnectInterval);
    reconnectInterval = null;
  }

  // Subscribe to channels
  stompClient?.subscribe("/topic/restaurant-order", (message: Message) => {
    try {
      const response = JSON.parse(message.body);
      onMessageReceived(response);
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  stompClient?.subscribe("/topic/response", (message: Message) => {
    try {
      const responseMessage = JSON.parse(message.body);
      console.log("Server response:", responseMessage);
    } catch (error) {
      console.error("Error parsing response message:", error);
    }
  });

  // Send initial request and set up interval
  sendRestaurantOrderRequest();
  messageInterval = setInterval(sendRestaurantOrderRequest, REQUEST_INTERVAL);

  // Notify connection change
  if (onConnectionChange) {
    onConnectionChange(true);
  }
};

// Handle connection errors
const onError = (
  error: Frame | string,
  onMessageReceived: WebSocketMessageHandler,
  onConnectionChange?: (connected: boolean) => void
) => {
  console.error("WebSocket connection error:", error);

  // Notify connection change
  if (onConnectionChange) {
    onConnectionChange(false);
  }

  // Attempt to reconnect
  if (!reconnectInterval) {
    reconnectInterval = setInterval(() => {
      console.log("Attempting to reconnect...");
      connectWebSocket(onMessageReceived, onConnectionChange);
    }, RECONNECT_DELAY);
  }
};

// Send order request to server
export const sendRestaurantOrderRequest = () => {
  if (stompClient && stompClient.connected) {
    try {
      const emailPayload = `"${restaurantEmail}"`; // manually add quotes
      stompClient.send(
        "/app/get-restaurant-order",
        {},
        emailPayload // send raw payload
      );
      console.debug("Sent restaurant order request to server");
    } catch (error) {
      console.error("Error sending order request:", error);
    }
  }
};

// Disconnect WebSocket
export const disconnectWebSocket = () => {
  if (messageInterval) {
    clearInterval(messageInterval);
    messageInterval = null;
  }

  if (stompClient) {
    if (stompClient.connected) {
      stompClient.disconnect(() => {
        console.log("Disconnected from WebSocket server");
      });
    }
    stompClient = null;
  }
};

// Cleanup on window close
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", disconnectWebSocket);
}
