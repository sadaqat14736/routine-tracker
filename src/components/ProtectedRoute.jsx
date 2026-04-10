// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/config";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true); // wait for Firebase
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser); // set logged-in user or null
      setLoading(false);    // auth state is ready
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    // Show loader while Firebase initializes
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    // If not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render the children (the protected page)
  return children;
};

export default ProtectedRoute;