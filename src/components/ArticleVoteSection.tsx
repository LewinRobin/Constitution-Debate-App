
import React from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

interface ArticleVoteSectionProps {
  articleId: string;
}

const ArticleVoteSection: React.FC<ArticleVoteSectionProps> = ({ articleId }) => {
  const { voteOnArticle, hasVotedOnArticle, getArticleById } = useData();
  const { isAuthenticated } = useAuth();
  
  const article = getArticleById(articleId);
  const userVote = hasVotedOnArticle(articleId);
  
  if (!article) return null;

  return (
    <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
      <h3 className="text-xl font-semibold mb-4">Constitutional Standpoint</h3>
      <p className="text-center text-muted-foreground mb-6">
        What is your stance on this constitutional interpretation? Vote to express your perspective.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button 
          variant={userVote === "for" ? "default" : "outline"}
          className={`flex-1 flex items-center justify-center gap-2 ${
            userVote === "for" ? "bg-constitution-blue" : ""
          }`}
          onClick={() => voteOnArticle(articleId, "for")}
          disabled={!isAuthenticated}
        >
          <ThumbsUp size={20} />
          <div className="flex flex-col items-start">
            <span>Support</span>
            <span className="text-xs">{article.votesFor} votes</span>
          </div>
        </Button>
        
        <Button 
          variant={userVote === "against" ? "default" : "outline"}
          className={`flex-1 flex items-center justify-center gap-2 ${
            userVote === "against" ? "bg-constitution-blue" : ""
          }`}
          onClick={() => voteOnArticle(articleId, "against")}
          disabled={!isAuthenticated}
        >
          <ThumbsDown size={20} />
          <div className="flex flex-col items-start">
            <span>Oppose</span>
            <span className="text-xs">{article.votesAgainst} votes</span>
          </div>
        </Button>
      </div>
      
      {!isAuthenticated && (
        <p className="text-sm text-muted-foreground mt-4">
          Please log in to express your constitutional stance
        </p>
      )}
    </div>
  );
};

export default ArticleVoteSection;
