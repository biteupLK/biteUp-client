import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
}

export default function OpenMyOrdersDialog({
  open,
  onClose,
  orderId,
}: DialogProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [socket, setSocket] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const marker = useRef<any>(null);

  // Load Google Maps script
  useEffect(() => {
    const existingScript = document.querySelector(
      "script[src*='maps.googleapis.com']"
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCVIbSbVplABKuBC_NOIOILnLYZ4yrfGvc`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (location) {
          initMap(location);
        }
      };
      document.head.appendChild(script);
    } else {
      if (window.google && location) {
        initMap(location);
      }
    }
  }, [location]);

  // Connect to Socket.IO server and listen for delivery updates
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/order-location?orderId=${orderId}`
        );
        const data = await response.json();
        if (data.location) {
          setLocation(data.location);
        }
      } catch (err) {
        console.error("❌ Failed to fetch delivery location:", err);
      }
    };

    fetchLocation();
  }, [orderId]);

  const initMap = (loc: { lat: number; lng: number }) => {
    if (!window.google || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: loc,
      zoom: 14,
    });

    const m = new window.google.maps.Marker({
      position: loc,
      map,
      title: "Delivery Location",
    });

    mapInstance.current = map;
    marker.current = m;
  };

  useEffect(() => {
    if (location && mapInstance.current && marker.current) {
      marker.current.setPosition(location);
      mapInstance.current.panTo(location);
    }
  }, [location]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Delivery Tracking for Order #{orderId}</DialogTitle>
      <DialogContent>
        <div style={{ width: "100%", height: "400px" }} ref={mapRef} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
