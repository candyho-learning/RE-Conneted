import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import Homepage from "./pages/Homepage.tsx";
import Signup from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import "./firebase.ts";
import { AuthContextProvider } from "./context/authContext.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import CreateSesssion from "./pages/CreateSession.tsx";
import Community from "./pages/Community.tsx";
import Session2 from "./pages/Session2.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Homepage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-session" element={<CreateSesssion />} />
            <Route path="/community" element={<Community />} />
            <Route path="/coworking-session" element={<Session2 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);