
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { RandomPage } from "./pages/RandomPage";
import { LoginPage } from "./pages/LoginPage";
import { ManageWebsitesPage } from "./pages/ManageWebsitesPage";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/random" element={<RandomPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/manage" 
            element={
              <ProtectedRoute>
                <ManageWebsitesPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
