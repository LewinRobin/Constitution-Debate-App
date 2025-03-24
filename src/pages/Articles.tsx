
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { useData } from "@/contexts/DataContext";
import ArticleCard from "@/components/ArticleCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Book } from "lucide-react";

const Articles = () => {
  const { articles } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories
  const categories = [...new Set(articles.map(article => article.category))];

  // Filter articles based on search term and selected category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory ? article.category === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center mb-2">
            <Book className="text-constitution-blue mr-2" size={28} />
            <h1 className="text-3xl font-bold">Constitutional Articles</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Explore articles of the Indian Constitution, including amendments and new legislation. Join the debate on these constitutional topics.
          </p>

          {/* Search and Filter */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search constitutional articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "bg-constitution-blue" : ""}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-constitution-blue" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map(article => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No constitutional articles found matching your criteria</p>
              <Button
                variant="link"
                onClick={() => { setSearchTerm(""); setSelectedCategory(null); }}
                className="mt-2"
              >
                Clear filters
              </Button>
            </div>
          )}
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

export default Articles;
