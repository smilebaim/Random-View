
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export function RandomPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    async function redirectToRandomWebsite() {
      try {
        const { data: websites, error } = await supabase
          .from('websites')
          .select('url');

        if (error) throw error;

        if (!websites || websites.length === 0) {
          navigate("/");
          return;
        }

        const timer = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);

        const redirectTimeout = setTimeout(() => {
          const randomWebsite = websites[Math.floor(Math.random() * websites.length)];
          window.location.href = randomWebsite.url;
        }, 3000);

        return () => {
          clearInterval(timer);
          clearTimeout(redirectTimeout);
        };
      } catch (error) {
        console.error('Error fetching random website:', error);
        navigate("/");
      }
    }

    redirectToRandomWebsite();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="mb-8">
          <div className="w-40 h-40 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <div className="text-6xl font-bold text-primary">{countdown}</div>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Preparing Your Solution</h1>
        <p className="text-xl text-muted-foreground">
          Redirecting you to our technology platform
        </p>
      </motion.div>
    </div>
  );
}
