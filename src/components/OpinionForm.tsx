import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface OpinionFormProps {
  articleId: string;
}

const OpinionForm: React.FC<OpinionFormProps> = ({ articleId }) => {
  const [content, setContent] = useState("");
  const { addOpinion } = useData();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    addOpinion(articleId, content);
    setContent("");
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Share Your Constitutional Perspective</h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="What is your interpretation of this constitutional article?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-32 mb-4"
          />
          <Button
            type="submit"
            className="bg-constitution-blue hover:bg-blue-800"
            disabled={!content.trim()}
          >
            Submit Your Perspective
          </Button>
        </form>
      ) : (
        <div className="text-center py-4">
          <p className="mb-4 text-muted-foreground">
            Log in to share your constitutional perspective on this article
          </p>
          <Button onClick={handleLoginRedirect}>
            Log In to Participate
          </Button>
        </div>
      )}
    </div>
  );
};

export default OpinionForm;
