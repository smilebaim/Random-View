
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, ExternalLink, LogOut, Trash2, Link as LinkIcon } from "lucide-react";
import { AddLinkDialog } from "../components/AddLinkDialog";

export default function DashboardPage() {
  const [links, setLinks] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const savedLinks = localStorage.getItem("websiteLinks");
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }
  }, []);

  const saveLinks = (newLinks) => {
    localStorage.setItem("websiteLinks", JSON.stringify(newLinks));
    setLinks(newLinks);
  };

  const addLink = (newLink) => {
    const updatedLinks = [...links, newLink];
    saveLinks(updatedLinks);
    toast({
      title: "Link added successfully",
      description: "The website has been added to your collection.",
    });
  };

  const removeLink = (indexToRemove) => {
    const updatedLinks = links.filter((_, index) => index !== indexToRemove);
    saveLinks(updatedLinks);
    toast({
      title: "Link removed",
      description: "The website has been removed from your collection.",
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const copyRedirectLink = () => {
    const redirectUrl = `${window.location.origin}/r`;
    navigator.clipboard.writeText(redirectUrl);
    toast({
      title: "Link copied",
      description: "Redirect link has been copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your redirect links</p>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={copyRedirectLink}
              className="flex items-center gap-2"
            >
              <LinkIcon className="w-4 h-4" />
              Copy Redirect Link
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        <div className="grid gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Links</h2>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Link
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-lg p-6 shadow-lg"
          >
            {links.length === 0 ? (
              <div className="text-center py-12">
                <img alt="Empty state illustration" className="w-32 h-32 mx-auto mb-4" src="https://images.unsplash.com/photo-1647779118365-a1a071f4529e" />
                <p className="text-muted-foreground">No links added yet. Add some to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {links.map((link, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 rounded-md bg-background border"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm truncate hover:text-primary hover:underline"
                      >
                        {link}
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLink(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Remove link</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <AddLinkDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onAdd={addLink}
        />
      </motion.div>
    </div>
  );
}
