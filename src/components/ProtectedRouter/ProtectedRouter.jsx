import React from 'react'
import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRouter({ children, requiredRole }) {

    const storageKey = 'Authorization';
    const tokenWithPrefix = localStorage.getItem(storageKey);

    let actualToken = null;
    if (tokenWithPrefix && tokenWithPrefix.startsWith('MediConnectPro__')) {
        actualToken = tokenWithPrefix.slice('MediConnectPro__'.length);
    }

    if (actualToken) {
        // Now actualToken contains the token without the prefix
        // Decode the token to check validity and expiration
        let decodedToken = null;
        try {
            decodedToken = jwtDecode(actualToken);
        } catch (error) {
            console.error('Error decoding token:', error);
        }

        if (decodedToken && decodedToken.exp) {
            const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
            if (decodedToken.exp < currentTime) {
                // Token has expired, handle expiry logic
                localStorage.removeItem(storageKey); // Remove token from storage
                // Redirect to login page or perform refresh token logic
                // Example using React Router Navigate:
                return <Navigate to='/login' />;
            } else {
                if (requiredRole) {
                    if (decodedToken.role !== requiredRole) {
                        return <Navigate to='/Dashboard' />;
                    }
                }
                // Token is valid, continue rendering protected content
                return <>{children}</>;
            }
        } else {
            // Token is invalid or cannot be decoded, handle invalid token scenario
            localStorage.removeItem(storageKey); // Remove token from storage
            // Redirect to login page or handle invalid token scenario
            // Example using React Router Navigate:
            return <Navigate to='/login' />;
        }
    } else {
        // No valid token found in storage, redirect to login page
        // Example using React Router Navigate:
        return <Navigate to='/login' />;
    }


}