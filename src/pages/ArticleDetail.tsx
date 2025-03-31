import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useData } from "@/contexts/DataContext";
import ArticleVoteSection from "@/components/ArticleVoteSection";
import OpinionForm from "@/components/OpinionForm";
import OpinionCard from "@/components/OpinionCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarIcon, User, Book } from "lucide-react";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getArticleById, getOpinionsByArticleId } = useData();

  const article = id ? getArticleById(id) : undefined;
  const opinions = id ? getOpinionsByArticleId(id) : [];

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Constitutional Article Not Found</h1>
            <Button
              onClick={() => navigate("/articles")}
              className="bg-constitution-blue hover:bg-blue-800"
            >
              Return to Constitutional Articles
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            className="mb-4 flex items-center"
            onClick={() => navigate("/articles")}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Constitutional Articles
          </Button>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Book className="text-constitution-blue mr-2" size={24} />
              <h1 className="text-3xl md:text-4xl font-bold">{article.title}</h1>
            </div>

            <div className="flex flex-wrap items-center text-muted-foreground mb-4 gap-x-6 gap-y-2">
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon size={16} className="mr-2" />
                <span>{formatDate(article.publishDate)}</span>
              </div>
              <div className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                {article.category}
              </div>
            </div>

            <p className="text-lg text-muted-foreground italic mb-6">{article.summary}</p>

            <div className="w-full h-64 md:h-80 mb-8 overflow-hidden rounded-lg">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none mb-10"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Voting Section */}
          <ArticleVoteSection articleId={article._id} />

          {/* Opinions Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Constitutional Perspectives</h2>

            {opinions.length > 0 ? (
              <div>
                {opinions.map(opinion => (
                  <OpinionCard key={opinion._id} opinion={opinion} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic mb-6">
                No opinions yet. Be the first to share your constitutional perspective!
              </p>
            )}
          </div>

          {/* Opinion Form */}
          <OpinionForm articleId={article._id} />
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

export default ArticleDetail;
