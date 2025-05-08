import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Keycloak from "keycloak-js";

// Singleton Keycloak instance
const keycloakInstance = new Keycloak({
  url: "http://localhost:8080", // Replace with your Keycloak URL
  realm: "biteup-realm",
  clientId: "biteup-client",
});

let keycloakInitPromise: Promise<boolean> | null = null; // Ensure init runs only once

const useAuth = () => {
  const location = useLocation();
  const [isLogin, setLogin] = useState(false);

  useEffect(() => {
    // Determine authentication mode based on the current path
    const authMode =
      location.pathname === "/" ||
      location.pathname === "/restaurant" ||
      location.pathname === "/foods"
        ? "check-sso"
        : "login-required";

    if (!keycloakInitPromise) {
      keycloakInitPromise = keycloakInstance.init({
        onLoad: authMode,
        checkLoginIframe: false, // Optional, improves performance
      });

      keycloakInitPromise
        .then((authenticated) => {
          setLogin(authenticated);

          if (authenticated) {
            // Store the access token in localStorage
            localStorage.setItem("access_token", keycloakInstance.token || "");
            console.log("Access Token Stored:", keycloakInstance.token);
          } else {
            localStorage.removeItem("access_token");
          }

          console.log("Auth Status Updated:", authenticated);
        })
        .catch((err) => {
          console.error("Keycloak initialization failed", err);
          setLogin(false);
          localStorage.removeItem("access_token");
        });
    }
  }, []);

  const handleLogout = () => {
    keycloakInstance.logout({
      redirectUri: window.location.origin, // Redirect after logout
    });
    localStorage.removeItem("access_token"); // Clear stored token
  };

  return { isLogin, handleLogout };
};

export default useAuth;
