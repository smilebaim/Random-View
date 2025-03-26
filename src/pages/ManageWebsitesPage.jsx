
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export function ManageWebsitesPage() {
  const [websites, setWebsites] = useState([]);
  const [newWebsite, setNewWebsite] = useState({ title: "", url: "", description: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    fetchWebsites();
  }, [user, navigate]);

  async function fetchWebsites() {
    try {
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWebsites(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch websites.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const filteredWebsites = websites.filter(website => 
    website.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    website.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    website.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleAddWebsite(e) {
    e.preventDefault();
    if (!newWebsite.title.trim() || !newWebsite.url.trim()) return;

    try {
      let formattedUrl = newWebsite.url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
      }

      const { error } = await supabase
        .from('websites')
        .insert([{
          title: newWebsite.title.trim(),
          url: formattedUrl,
          description: newWebsite.description.trim(),
          created_by: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "New website has been added to the platform.",
      });

      setNewWebsite({ title: "", url: "", description: "" });
      fetchWebsites();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add website.",
        variant: "destructive",
      });
    }
  }

  async function handleRemoveWebsite(id) {
    try {
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Website has been removed from the platform.",
      });

      fetchWebsites();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove website.",
        variant: "destructive",
      });
    }
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Platform Management</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="search"
                placeholder="Search platforms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Platform</h2>
            <form onSubmit={handleAddWebsite} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Platform Name</Label>
                  <Input
                    id="title"
                    value={newWebsite.title}
                    onChange={(e) => setNewWebsite(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter platform name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">Platform URL</Label>
                  <Input
                    id="url"
                    value={newWebsite.url}
                    onChange={(e) => setNewWebsite(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newWebsite.description}
                  onChange={(e) => setNewWebsite(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the platform"
                />
              </div>

              <Button type="submit" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Platform
              </Button>
            </form>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Managed Platforms</h2>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredWebsites.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground">No platforms found. Add your first platform using the form above.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {filteredWebsites.map((website) => (
                  <motion.li
                    key={website.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 rounded-md bg-background border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <h3 className="font-medium truncate">{website.title}</h3>
                      <a 
                        href={website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary truncate block hover:underline"
                      >
                        {website.url}
                      </a>
                      {website.description && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {website.description}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveWebsite(website.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Remove platform</span>
                    </Button>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
