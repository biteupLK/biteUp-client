// useWebSocketOrders.tsx
import { useEffect, useState } from 'react';

const useWebSocketOrders = (email: string | undefined) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;

    const socket = new WebSocket('ws://localhost:8084/ws'); // <-- Using raw WebSocket

    socket.onopen = () => {
      console.log('WebSocket connected');

      // Send email to the server as soon as the connection is established
      socket.send(email);
    };

    socket.onmessage = (event) => {
      try {
        const receivedOrders = JSON.parse(event.data);
        setOrders(receivedOrders);
        setLoading(false);
      } catch (e) {
        setError('Error processing the data');
        setLoading(false);
      }
    };

    socket.onerror = (event) => {
      setError('WebSocket connection error');
      setLoading(false);
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      socket.close();
    };
  }, [email]);

  return { orders, loading, error };
};

export default useWebSocketOrders;
