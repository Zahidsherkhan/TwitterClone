import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import MainLayout from "./components/MainLayout";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import HomePage from "./pages/home/HomePage";
import Profile from "./pages/Profile";

import { IoLogoHackernews } from "react-icons/io";

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
      <div className="h-screen flex justify-center flex-col gap-2 items-center bg-red-200">
        <div className="animate-bounce text-9xl text-red-500">
          <IoLogoHackernews />
        </div>
        <div className="text-red-500 animate-bubble">
          Greetings from Zahid ❤️💕
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
      </Routes>
    </>
  );
};

export default App;
