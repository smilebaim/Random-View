
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function RedirectPage() {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const links = JSON.parse(localStorage.getItem("websiteLinks") || "[]");
    
    if (links.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      const randomLink = links[Math.floor(Math.random() * links.length)];
      window.location.href = randomLink;
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-6xl font-bold text-primary mb-4"
        >
          {countdown}
        </motion.div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Redirecting you to a random website
        </h1>
        <p className="text-muted-foreground">Please wait...</p>
      </motion.div>
    </div>
  );
}
