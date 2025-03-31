import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Article {
  _id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishDate: Date;
  imageUrl: string;
  votesFor: number;
  votesAgainst: number;
  peopleVotesFor: string[];
  peopleVotesAgainst: string[];
  category: string;
}

export interface Opinion {
  _id: string;
  articleId: string;
  userId: string;
  username: string;
  userAura: number;
  content: string;
  createdAt: Date;
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
}

interface DataContextType {
  articles: Article[];
  opinions: Opinion[];
  getArticleById: (id: string) => Article | undefined;
  getOpinionsByArticleId: (articleId: string) => Opinion[];
  addOpinion: (articleId: string, content: string) => void;
  voteOnArticle: (articleId: string, voteType: "for" | "against") => void;
  voteOnOpinion: (opinionId: string, voteType: "like" | "dislike") => void;
  hasVotedOnArticle: (articleId: string) => "for" | "against" | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

// Mock data
const mockArticles: Article[] = [
  {
    _id: "1",
    title: "The Essence of Article 21: Right to Life and Personal Liberty",
    summary: "Exploring the interpretation and scope of Article 21 of the Indian Constitution in modern context.",
    content: `<p>Article 21 of the Indian Constitution states: "No person shall be deprived of his life or personal liberty except according to procedure established by law." This simple yet profound statement has been the foundation of numerous landmark judgments that have expanded civil liberties in India.</p>
    
    <p>The Supreme Court's interpretation of Article 21 has evolved significantly over time. Initially, in the A.K. Gopalan case (1950), the Court adopted a narrow interpretation. However, post-emergency, in Maneka Gandhi vs. Union of India (1978), the Court revolutionized its approach, holding that the procedure established by law must be "fair, just and reasonable."</p>
    
    <p>The scope of Article 21 now extends far beyond its literal meaning, encompassing:</p>
    
    <ul>
      <li>Right to live with human dignity</li>
      <li>Right to health</li>
      <li>Right to education</li>
      <li>Right to clean environment</li>
      <li>Right to privacy</li>
    </ul>
    
    <p>Recent judgments like K.S. Puttaswamy vs. Union of India (2017) have further cemented the right to privacy as a fundamental right under Article 21. The Court held that "the right to privacy is protected as an intrinsic part of the right to life and personal liberty under Article 21."</p>
    
    <p>However, challenges remain. Balancing national security concerns with individual liberty continues to be contentious. The use of preventive detention laws, restrictions during public emergencies, and limitations in the name of public order raise important constitutional questions.</p>
    
    <p>As we move forward, the interpretation of Article 21 must continue to evolve to address new challenges posed by technological advancements, changing social norms, and emerging threats to personal liberty.</p>`,
    author: "Dr. Rajendra Prasad",
    publishDate: new Date("2023-10-15"),
    imageUrl: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aW5kaWFuJTIwY29uc3RpdHV0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    votesFor: 120,
    votesAgainst: 45,
    peopleVotesFor: ['user1', 'user2'],
    peopleVotesAgainst: ['user3', 'user4'],
    category: "Fundamental Rights"
  },
  {
    _id: "2",
    title: "Federalism in India: Cooperative or Competitive?",
    summary: "Analyzing the federal structure of India and the balance of power between the Union and State governments.",
    content: `<p>India's Constitution establishes a federal system with a strong central government, often described as "quasi-federal" or "federalism with a unitary bias." This unique structure raises important questions about the distribution of power and resources between the Union and State governments.</p>
    
    <p>The Seventh Schedule of the Constitution divides legislative powers between the Union and States through three lists: Union List, State List, and Concurrent List. However, the Union enjoys residuary powers and can legislate on state subjects under exceptional circumstances.</p>
    
    <p>Over the decades, India has witnessed phases of both cooperative and competitive federalism. While cooperative federalism emphasizes collaboration and mutual support, competitive federalism encourages states to compete for resources, investment, and development.</p>
    
    <p>Recent initiatives like the Goods and Services Tax (GST) represent a move towards cooperative federalism, with the GST Council serving as a forum for collective decision-making. Similarly, the NITI Aayog was established to foster cooperative federalism by involving states in the national development agenda.</p>
    
    <p>However, challenges persist. Fiscal federalism remains contentious, with debates over revenue sharing, grants-in-aid, and financial autonomy of states. Political tensions between Union and State governments led by different parties often exacerbate these issues.</p>
    
    <p>The COVID-19 pandemic has brought these federalism debates to the forefront, highlighting questions about disaster management, public health responsibilities, and coordination during national crises.</p>
    
    <p>As India moves forward, finding the right balance between a strong center and autonomous states will be crucial for addressing regional disparities and ensuring inclusive development.</p>`,
    author: "Prof. Amartya Sen",
    publishDate: new Date("2023-09-28"),
    imageUrl: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aW5kaWFuJTIwcGFybGlhbWVudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    votesFor: 87,
    votesAgainst: 92,
    peopleVotesFor: ['user1', 'user2'],
    peopleVotesAgainst: ['user3', 'user4'],
    category: "Federal Structure"
  },
  {
    _id: "3",
    title: "Uniform Civil Code: Constitutional Vision and Contemporary Debates",
    summary: "Examining Article 44 of the Directive Principles and the ongoing discourse on a Uniform Civil Code in India.",
    content: `<p>Article 44 of the Indian Constitution, part of the Directive Principles of State Policy, states: "The State shall endeavor to secure for the citizens a uniform civil code throughout the territory of India." This provision has been the subject of intense debate, touching upon questions of religious freedom, personal laws, and gender equality.</p>
    
    <p>India currently follows a system of personal laws where different religious communities are governed by their respective laws in matters of marriage, divorce, inheritance, and adoption. The Uniform Civil Code (UCC) proposes a common set of civil laws for all citizens, irrespective of their religion.</p>
    
    <p>Proponents of the UCC argue that it would promote national integration, gender justice, and equality before the law. They point to discriminatory practices in various personal laws that disadvantage women and violate constitutional guarantees of equality.</p>
    
    <p>Critics, however, express concerns about cultural homogenization and the potential infringement on religious freedom protected under Articles 25-28. They argue that religious communities should have the autonomy to regulate their personal affairs according to their traditions.</p>
    
    <p>The Supreme Court has repeatedly emphasized the need for a UCC, notably in cases like Mohd. Ahmed Khan vs. Shah Bano Begum (1985), Sarla Mudgal vs. Union of India (1995), and more recently in Shayara Bano vs. Union of India (2017). However, implementation has remained politically challenging.</p>
    
    <p>Goa provides an interesting example as the only Indian state with a uniform civil code, inherited from the Portuguese Civil Code of 1867. Its implementation offers insights into the practical aspects of a UCC.</p>
    
    <p>Moving forward, any attempt to implement a UCC must balance constitutional principles with religious and cultural sensitivities. Inclusive consultations with various stakeholders, gradual reforms, and focus on gender equality could be key to building consensus on this contentious issue.</p>`,
    author: "Justice Fali S. Nariman",
    publishDate: new Date("2023-11-05"),
    imageUrl: "https://images.pexels.com/photos/9630216/pexels-photo-9630216.jpeg?auto=compress&cs=tinysrgb&w=600",
    votesFor: 156,
    votesAgainst: 178,
    peopleVotesFor: ['user1', 'user2'],
    peopleVotesAgainst: ['user3', 'user4'],
    category: "Directive Principles"
  }
];

const mockOpinions: Opinion[] = [
  {
    _id: "101",
    articleId: "1",
    userId: "user1",
    username: "ConstitutionExpert",
    userAura: 120,
    content: "Article 21 has been the most transformative provision in our Constitution. The expansive interpretation by the Supreme Court has brought about a rights revolution in India.",
    createdAt: new Date("2023-10-16T10:30:00"),
    likes: 45,
    dislikes: 5,
    likedBy: ["user2", "user3"],
    dislikedBy: ["user4"]
  },
  {
    _id: "102",
    articleId: "1",
    userId: "user2",
    username: "LegalScholar",
    userAura: 85,
    content: "While I appreciate the progressive interpretation of Article 21, I believe the Court should be cautious about judicial overreach. Creating new rights without legislative backing raises democratic concerns.",
    createdAt: new Date("2023-10-16T14:45:00"),
    likes: 30,
    dislikes: 12,
    likedBy: ["user3"],
    dislikedBy: ["user1"]
  },
  {
    _id: "103",
    articleId: "2",
    userId: "user3",
    username: "PolicyAnalyst",
    userAura: 65,
    content: "India's federal structure has shown remarkable resilience and adaptability. The GST implementation, despite its challenges, demonstrates that cooperative federalism can work when there's political will.",
    createdAt: new Date("2023-09-29T09:15:00"),
    likes: 28,
    dislikes: 7,
    likedBy: ["user1"],
    dislikedBy: []
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [opinions, setOpinions] = useState<Opinion[]>(mockOpinions);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, "for" | "against">>({});
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${API_URL}/articles`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          }
        });
        const userVotesData = response.data.reduce((acc, curr) => {
          let voteType = null;
          if (curr.peopleVotedFor.includes(user.id)) {
            voteType = "for";
          } else if (curr.peopleVotedAgainst.includes(user.id)) {
            voteType = "against";
          }
          return { ...acc, [curr._id]: voteType };
        }, {});
        setUserVotes(userVotesData);

        setArticles(response.data);
      } catch (error: any) {
        setError("Failed to fetch articles: " + error.message);
        toast({ title: "Error", description: "Failed to fetch articles", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    const fetchOpinions = async () => {
      try {
        const articleOpinions = await Promise.all(
          articles.map(async (article) => {
            const response = await axios.get(`${API_URL}/opinions/${article._id}`);
            return { articleId: article._id, opinions: response.data };
          })
        );
        const allOpinions = articleOpinions.flatMap((item) => item.opinions);
        setOpinions(allOpinions);
      } catch (error: any) {
        setError("Failed to fetch opinions: " + error.message);
        toast({ title: "Error", description: "Failed to fetch opinions", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchArticles().then(() => fetchOpinions());
    } else {
      setLoading(false);
    }
  }, [user]);
  const getArticleById = (id: string) => {
    return articles.find(article => article._id === id);
  };

  const getOpinionsByArticleId = (articleId: string) => {
    return opinions
      .filter(opinion => opinion.articleId === articleId)
      .sort((a, b) => b.likes - a.likes);
  };

  const addOpinion = async (articleId: string, content: string) => {
    if (!user || !user.token) {
      toast({
        title: "Authentication required",
        description: "Please log in to share your opinion",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/opinions`,
        {
          articleId,
          userId: user.id,
          username: user.username,
          userAura: user.aura,
          content,
          likes: 0,
          dislikes: 0,
          likedBy: [],
          dislikedBy: [],
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Add the new opinion to our state
      const newOpinion = {
        ...response.data,
        createdAt: new Date(response.data.createdAt)
      };

      setOpinions(prev => [...prev, newOpinion]);

      toast({
        title: "Opinion shared",
        description: "Your opinion has been posted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add opinion",
        variant: "destructive",
      });
      throw error;
    }
  };

  const voteOnArticle = async (articleId: string, voteType: "for" | "against") => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote",
        variant: "destructive",
      });
      return;
    }

    // Check if user has already voted on this article
    const existingVote = userVotes[articleId];

    setArticles(articles.map(article => {
      if (article._id === articleId) {
        let newVotesFor = article.votesFor;
        let newVotesAgainst = article.votesAgainst;

        // If user is changing their vote
        if (existingVote) {
          if (existingVote === "for" && voteType === "against") {
            newVotesFor--;
            newVotesAgainst++;
          } else if (existingVote === "against" && voteType === "for") {
            newVotesFor++;
            newVotesAgainst--;
          }
          // If voting the same way, do nothing (toggle off not supported)
        } else {
          // First time voting
          if (voteType === "for") {
            newVotesFor++;
          } else {
            newVotesAgainst++;
          }
        }

        return { ...article, votesFor: newVotesFor, votesAgainst: newVotesAgainst };
      }
      return article;
    }));

    // Update user votes record

    try {
      const response = await axios.put(`${API_URL}/articles/${articleId}/vote`, { voteType }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setArticles(prevArticles => prevArticles.map(a => a._id === articleId ? response.data : a));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to vote on article",
        variant: "destructive",
      });
    }
    setUserVotes({ ...userVotes, [articleId]: voteType });

    toast({
      title: "Vote recorded",
      description: `You voted ${voteType} this article`,
    });
  };

  const voteOnOpinion = async (opinionId: string, voteType: "like" | "dislike") => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote on opinions",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}/opinions/${opinionId}/vote`,
        { voteType },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const opinionIndex = opinions.findIndex((opinion) => opinion._id === opinionId);
      if (opinionIndex !== -1) {
        const updatedOpinions = [...opinions];
        updatedOpinions[opinionIndex] = { ...updatedOpinions[opinionIndex], ...response.data };
        setOpinions(updatedOpinions);
      }

      toast({
        title: "Vote recorded",
        description: `You ${voteType}d this opinion`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to vote on opinion",
        variant: "destructive",
      });
      throw error;
    }
  };

  const hasVotedOnArticle = (articleId: string) => {
    return userVotes[articleId] || null;
  };

  return (
    <DataContext.Provider
      value={{
        articles,
        opinions,
        getArticleById,
        getOpinionsByArticleId,
        addOpinion,
        voteOnArticle,
        voteOnOpinion,
        hasVotedOnArticle,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
