
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Calendar, Award, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user } = useAuth();
  const { opinions, articles } = useData();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  // Get user's opinions
  const userOpinions = opinions.filter(opinion => opinion.userId === user.id);

  // Calculate total likes and dislikes received on user's opinions
  const totalLikes = userOpinions.reduce((acc, opinion) => acc + opinion.likes, 0);
  const totalDislikes = userOpinions.reduce((acc, opinion) => acc + opinion.dislikes, 0);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Aura Points</CardDescription>
                <div className="flex items-center">
                  <Flame
                    className={`fire-icon mr-2 ${user.aura > 0 ? 'text-aura-positive animate-fire-pulse' : 'text-aura-negative'}`}
                    size={24}
                  />
                  <CardTitle className="text-2xl">{user.aura}</CardTitle>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Member Since</CardDescription>
                <div className="flex items-center">
                  <Calendar className="mr-2 text-muted-foreground" size={20} />
                  <CardTitle>{formatDate(user.joinDate)}</CardTitle>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Opinions Shared</CardDescription>
                <div className="flex items-center">
                  <MessageSquare className="mr-2 text-muted-foreground" size={20} />
                  <CardTitle className="text-2xl">{userOpinions.length}</CardTitle>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Received Votes</CardDescription>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <ThumbsUp className="mr-1 text-green-600" size={16} />
                    <span className="font-medium">{totalLikes}</span>
                  </div>
                  <div className="flex items-center">
                    <ThumbsDown className="mr-1 text-red-600" size={16} />
                    <span className="font-medium">{totalDislikes}</span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* User Aura Explanation */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Flame className="mr-2 text-aura-positive" size={20} />
                Understanding Your Aura
              </CardTitle>
              <CardDescription>
                How your contributions are valued in the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Your Aura is a reflection of how the community values your contributions to constitutional debates.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold flex items-center mb-2">
                      <ThumbsUp className="mr-2 text-green-600" size={16} />
                      Increasing Your Aura
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Receive upvotes on your opinions</li>
                      <li>• Share well-reasoned, thoughtful perspectives</li>
                      <li>• Contribute regularly to various topics</li>
                    </ul>
                  </div>
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold flex items-center mb-2">
                      <Award className="mr-2 text-constitution-blue" size={16} />
                      Benefits of High Aura
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Your opinions appear higher in discussions</li>
                      <li>• Gain community recognition as a valued contributor</li>
                      <li>• Unlock future features and privileges</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Opinions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">My Recent Opinions</h2>

            {userOpinions.length > 0 ? (
              <div className="space-y-4">
                {userOpinions.slice(0, 5).map(opinion => {
                  const relatedArticle = articles.find(article => article._id === opinion.articleId);

                  return (
                    <Card key={opinion.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/article/${opinion.articleId}`)}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{relatedArticle?.title || "Unknown Article"}</CardTitle>
                        <CardDescription className="flex justify-between">
                          <span>{formatDate(new Date(opinion.createdAt))}</span>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center">
                              <ThumbsUp className="mr-1 text-muted-foreground" size={14} />
                              <span>{opinion.likes}</span>
                            </div>
                            <div className="flex items-center">
                              <ThumbsDown className="mr-1 text-muted-foreground" size={14} />
                              <span>{opinion.dislikes}</span>
                            </div>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-2">{opinion.content}</p>
                      </CardContent>
                    </Card>
                  );
                })}

                {userOpinions.length > 5 && (
                  <div className="text-center mt-4">
                    <Button variant="outline">View All Opinions</Button>
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    You haven't shared any opinions yet
                  </p>
                  <Button
                    onClick={() => navigate("/articles")}
                    className="bg-constitution-blue hover:bg-blue-800"
                  >
                    Browse Articles to Participate
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-constitution-dark text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Samvidhaan Samvaad. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
