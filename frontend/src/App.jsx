import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import MainLayout from "./components/MainLayout";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import HomePage from "./pages/home/HomePage";
import Profile from "./pages/Profile";

const App = () => {
  const location = useLocation();
  const hideLayoutRoutes = ["/login", "/signup"];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  const {
    data: authUser,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        console.log("authUser is here:", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center bg-red-200">
        <div className="text-6xl text-red-500 text-center flex justify-center items-center">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />

      <Routes>
        {/* Auth routes */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />

        {/* Protected main layout route */}
        <Route
          path="*"
          element={authUser ? <MainLayout /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile"
          element={authUser ? <MainLayout /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
};

export default App;
