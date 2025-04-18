
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export function HomePage() {
  const [websites, setWebsites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWebsites();
  }, []);

  async function fetchWebsites() {
    try {
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWebsites(data || []);
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Welcome to Tech Industries</h1>
            <p className="text-muted-foreground mb-8">Discover innovative solutions for your business needs</p>
            
            {websites.length > 0 ? (
              <Button
                asChild
                className="flex items-center gap-2"
              >
                <Link to="/random">
                  <ExternalLink className="w-4 h-4" />
                  Explore Our Solutions
                </Link>
              </Button>
            ) : (
              <p className="text-muted-foreground">Please contact an administrator for access.</p>
            )}
          </header>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="bg-card rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-muted-foreground">
                Leading the way in technological advancement and digital transformation.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-muted-foreground">
                Committed to delivering exceptional quality and reliable solutions.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
