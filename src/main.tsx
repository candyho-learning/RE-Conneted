import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Homepage from "./pages/Homepage.tsx";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import "./firebase.ts";
import { AuthContextProvider } from "./contexts/authContext.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import CreateSesssion from "./pages/CreateSession.tsx";
import Community from "./pages/Community.tsx";
import Session2 from "./pages/Session2.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import Settings from "./pages/Settings.tsx";
import FindSessions from "./pages/FindSessions.tsx";
import SessionThankYou from "./pages/SessionThankYou.tsx";
import ProtectedRoutes from "./pages/ProtectedRoutes.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-session" element={<CreateSesssion />} />
            <Route path="/find-sessions" element={<FindSessions />} />
            <Route path="/community" element={<Community />} />
            <Route path="/coworking-session" element={<Session2 />} />
            <Route path="/connect/:userId" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/thankyou" element={<SessionThankYou />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);
