import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Chip,
  Button,
  CircularProgress,
  Alert
} from "@mui/material";
import { Refresh, LocationOn, DirectionsBike } from "@mui/icons-material";

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

const DeliveryPerson = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [tracking, setTracking] = useState(false);
  const [locationHistory, setLocationHistory] = useState<Array<{ lat: number; lng: number }>>([]);
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    newSocket.on("new-order", (order: any) => {
      setOrders((prev) => [...prev, order]);
      alert(`📦 New Order Received! ${order?.data?.object?.members?.metadata?.members?.foodName?.value}`);
    });

    return () => {
      newSocket.disconnect();
      stopTracking();
    };
  }, []);

  // Load Google Maps script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCVIbSbVplABKuBC_NOIOILnLYZ4yrfGvc&libraries=places`;
      script.async = true;
      script.onload = () => {
        setLoading(false);
        if (location) {
          initMap();
        }
      };
      script.onerror = () => {
        setError("Failed to load Google Maps");
        setLoading(false);
      };
      document.head.appendChild(script);
    } else {
      setLoading(false);
      if (location) {
        initMap();
      }
    }
  }, [location]);

  // Initialize map
  const initMap = () => {
    if (!location || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: location,
      zoom: 15,
      mapTypeId: "roadmap",
    });

    const marker = new window.google.maps.Marker({
      position: location,
      map: map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#FFFFFF",
      },
      title: "Your Location",
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Add polyline for location history
    if (locationHistory.length > 1) {
      new window.google.maps.Polyline({
        path: locationHistory,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map,
      });
    }
  };

  // Update map when location changes
  useEffect(() => {
    if (location && mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.panTo(location);
      markerRef.current.setPosition(location);

      // Add to location history
      setLocationHistory(prev => [...prev, location]);
    }
  }, [location]);

  const startTracking = () => {
    setTracking(true);
    setError(null);

    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const loc = { lat: latitude, lng: longitude };
          setLocation(loc);
          
          // Send to server
          if (socket) {
            socket.emit("send-location", loc);
          }

          // Initialize map if not already done
          if (!mapInstanceRef.current && window.google) {
            initMap();
          }
        },
        (error) => {
          setError(`Geolocation error: ${error.message}`);
          console.error("Geolocation error:", error);
        },
        { 
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000
        }
      );
      setWatchId(id);
    } else {
      setError("Geolocation is not supported by this browser");
    }
  };

  const stopTracking = () => {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setTracking(false);
  };

  const toggleTracking = () => {
    if (tracking) {
      stopTracking();
    } else {
      startTracking();
    }
  };

  const refreshLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const loc = { lat: latitude, lng: longitude };
          setLocation(loc);
          
          if (socket) {
            socket.emit("send-location", loc);
          }
        },
        (error) => {
          setError(`Error getting location: ${error.message}`);
        }
      );
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          <DirectionsBike sx={{ verticalAlign: 'middle', mr: 1 }} />
          Delivery Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            {location && (
              <Typography variant="body1">
                <LocationOn color="primary" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                Current Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </Typography>
            )}
            <Chip
              label={socket?.connected ? "Connected" : "Disconnected"}
              color={socket?.connected ? "success" : "error"}
              sx={{ mt: 1 }}
            />
          </Box>
          
          <Box>
            <Button
              variant="contained"
              color={tracking ? "error" : "success"}
              onClick={toggleTracking}
              startIcon={<LocationOn />}
              sx={{ mr: 1 }}
            >
              {tracking ? "Stop Tracking" : "Start Tracking"}
            </Button>
            <Button
              variant="outlined"
              onClick={refreshLocation}
              startIcon={<Refresh />}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Paper elevation={3} sx={{ p: 2, mb: 3, height: 400 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : (
              <div 
                ref={mapRef} 
                style={{ width: '100%', height: '100%', borderRadius: 4 }}
              />
            )}
          </Paper>
        </Box>

        <Box sx={{ flex: 1 }}>
          {orders.length > 0 ? (
            <Paper elevation={3} sx={{ p: 2, height: 400, overflow: 'auto' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Current Orders ({orders.length})
              </Typography>
              <List>
                {orders.map((order, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={order?.data?.object?.members?.metadata?.members?.foodName?.value || "Unknown Order"}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" display="block">
                            Order ID: {order?.id}
                          </Typography>
                          <Typography component="span" variant="body2">
                            Customer: {order?.data?.object?.members?.billing_details?.members?.name?.value}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          ) : (
            <Paper elevation={3} sx={{ p: 3, textAlign: "center", height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body1">No orders assigned yet</Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DeliveryPerson;