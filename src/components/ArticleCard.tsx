
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, BookOpen } from "lucide-react";
import { Article } from "@/contexts/DataContext";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const navigate = useNavigate();
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <CalendarIcon size={14} className="mr-1" />
          <span>{formatDate(article.publishDate)}</span>
        </div>
        <div className="flex items-start">
          <BookOpen size={18} className="text-constitution-blue mt-1 mr-2 flex-shrink-0" />
          <CardTitle className="line-clamp-2">{article.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{article.summary}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2">
        <div className="text-sm">
          <span className="text-constitution-blue font-semibold">{article.votesFor}</span>
          <span className="mx-1 text-muted-foreground">Support</span>
          <span className="text-gray-700 font-semibold">{article.votesAgainst}</span>
          <span className="ml-1 text-muted-foreground">Oppose</span>
        </div>
        <Button 
          onClick={() => navigate(`/article/${article.id}`)}
          className="bg-constitution-blue hover:bg-blue-800"
        >
          Read Article
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
