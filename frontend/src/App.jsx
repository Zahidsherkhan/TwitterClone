import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import MainLayout from "./components/MainLayout";

const App = () => {
  const location = useLocation();
  const hideLayoutRoutes = ["/login", "/signup"];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {shouldHideLayout ? (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      ) : (
        <MainLayout />
      )}
    </>
  );
};

export default App;
