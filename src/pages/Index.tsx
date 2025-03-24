
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useData } from "@/contexts/DataContext";
import ArticleCard from "@/components/ArticleCard";

const Index = () => {
  const navigate = useNavigate();
  const { articles } = useData();

  // Get featured articles (first 3 articles)
  const featuredArticles = articles.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-constitution-blue text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Samvidhaan Samvaad</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Engage in meaningful debates about India's Constitution. Share your opinions,
            gain perspective, and build your constitutional knowledge.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => navigate("/articles")}
              className="bg-constitution-orange hover:bg-orange-600 text-white"
              size="lg"
            >
              Explore Articles
            </Button>
            <Button
              onClick={() => navigate("/signup")}
              className="border-white text-white hover:bg-white hover:text-constitution-blue"
              size="lg"
            >
              Join the Community
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Debates</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map(article => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              onClick={() => navigate("/articles")}
              className="bg-constitution-blue hover:bg-blue-800"
            >
              View All Articles
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="bg-constitution-blue h-12 w-12 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Read Articles</h3>
              <p className="text-muted-foreground">
                Explore thought-provoking articles about the Indian Constitution and its interpretations.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="bg-constitution-blue h-12 w-12 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Join Debates</h3>
              <p className="text-muted-foreground">
                Vote on constitutional interpretations and share your perspective on important issues.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="bg-constitution-blue h-12 w-12 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Earn Aura</h3>
              <p className="text-muted-foreground">
                Gain recognition for your insightful opinions as others upvote your contributions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-constitution-dark text-white py-8 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Samvidhaan Samvaad. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
