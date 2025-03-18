
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Flame } from "lucide-react";
import { Opinion } from "@/contexts/DataContext";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";

interface OpinionCardProps {
  opinion: Opinion;
}

const OpinionCard: React.FC<OpinionCardProps> = ({ opinion }) => {
  const { voteOnOpinion } = useData();
  const { user } = useAuth();
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const hasLiked = user && opinion.likedBy.includes(user.id);
  const hasDisliked = user && opinion.dislikedBy.includes(user.id);

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-semibold mr-2">{opinion.username}</span>
            <div className="flex items-center">
              <Flame 
                className={`fire-icon mr-1 ${opinion.userAura > 0 ? 'text-aura-positive' : 'text-aura-negative'}`} 
                size={16} 
              />
              <span className="text-sm">{opinion.userAura}</span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {formatDate(new Date(opinion.createdAt))}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-800">{opinion.content}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-end">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            className={`flex items-center ${hasLiked ? 'text-green-600' : ''}`}
            onClick={() => voteOnOpinion(opinion.id, "like")}
          >
            <ThumbsUp size={16} className="mr-1" />
            <span>{opinion.likes}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className={`flex items-center ${hasDisliked ? 'text-red-600' : ''}`}
            onClick={() => voteOnOpinion(opinion.id, "dislike")}
          >
            <ThumbsDown size={16} className="mr-1" />
            <span>{opinion.dislikes}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OpinionCard;
