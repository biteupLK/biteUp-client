import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Keycloak from "keycloak-js";

// Singleton Keycloak instance
const keycloakInstance = new Keycloak({
    url: "http://localhost:8181", // Replace with your Keycloak URL
    realm: "biteup-realm",
    clientId: "biteup-client",
});

let keycloakInitPromise: Promise<boolean> | null = null; // Ensure init runs only once

const useAuth = () => {
    const location = useLocation();
    const [isLogin, setLogin] = useState(false);

    useEffect(() => {
        // Determine authentication mode based on the current path
        const authMode = location.pathname === "/" ? "check-sso" : "login-required";

        // Initialize Keycloak only once
        if (!keycloakInitPromise) {
            keycloakInitPromise = keycloakInstance.init({
                onLoad: authMode,
                checkLoginIframe: false, // Optional, improves performance
            });

            keycloakInitPromise
                .then((authenticated) => {
                    setLogin(authenticated);
                    console.log("Auth Status Updated:", authenticated);
                })
                .catch((err) => {
                    console.error("Keycloak initialization failed", err);
                    setLogin(false);
                });
        }
    }, []);

    return isLogin;
};

export default useAuth;
