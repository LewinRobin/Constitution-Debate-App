import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ArticleCreation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }
  else if (!(user.email.endsWith('@samvadh.com'))) {
    navigate("/dashboard");
    return null;

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/articles`,
        { title, summary, content, author, category, imageUrl },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating article:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Create New Article</h1>
          <Card>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <Input placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
                <Input placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} required />
                <Textarea placeholder="Content" rows={6} value={content} onChange={(e) => setContent(e.target.value)} required />
                <Input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
                <Input placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Publishing..." : "Publish Article"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ArticleCreation;
