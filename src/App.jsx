import React, { useState, useEffect } from "react";
import { initLiff, isLoggedIn } from "./services/liffService.js";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Homepage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const profile = await initLiff();
        if (profile) {
          setUser(profile);
        }
      } catch (error) {
        console.error("App initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!user && !isLoggedIn()) {
    return <LoginPage />;
  }

  return (
    <div>
      <Header user={user} />
      <Homepage user={user} />
      <Footer />
    </div>
  );
}