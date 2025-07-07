import { useState } from "react";
import { Link } from "wouter";
import { Calendar, User, ArrowRight, Clock, Tag, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const blogPosts = [
  {
    id: 1,
    title: "The Future of Logo Design in Saudi Arabia's Digital Transformation",
    excerpt: "Explore how Saudi Vision 2030 is reshaping brand identity requirements and what modern businesses need to know about effective logo design in the digital age.",
    content: "Saudi Arabia's Vision 2030 initiative has fundamentally transformed how businesses approach brand identity...",
    author: "Ahmed Al-Rashid",
    date: "2024-12-15",
    readTime: "8 min read",
    category: "Brand Identity",
    tags: ["Logo Design", "Saudi Vision 2030", "Brand Identity", "Digital Transformation"],
    image: "🎨",
    featured: true
  },
  {
    id: 2,
    title: "E-commerce Web Development Trends for MENA Businesses",
    excerpt: "Discover the latest web development technologies and user experience patterns that drive successful e-commerce platforms in the Middle East and North Africa.",
    content: "The e-commerce landscape in the MENA region is experiencing unprecedented growth...",
    author: "Fatima Al-Zahra",
    date: "2024-12-10",
    readTime: "6 min read",
    category: "Web Development",
    tags: ["E-commerce", "Web Development", "MENA", "User Experience"],
    image: "💻"
  },
  {
    id: 3,
    title: "Arabic Typography in Modern Web Design",
    excerpt: "Master the art of Arabic typography in digital design. Learn about font selection, spacing, and cultural considerations for effective Arabic web interfaces.",
    content: "Arabic typography presents unique challenges and opportunities in web design...",
    author: "Omar Khalil",
    date: "2024-12-05",
    readTime: "10 min read",
    category: "Design",
    tags: ["Arabic Typography", "Web Design", "UI/UX", "Cultural Design"],
    image: "✍️"
  },
  {
    id: 4,
    title: "Building Scalable SaaS Applications: A Technical Deep Dive",
    excerpt: "Learn the architecture patterns and technology stack decisions that enable SaaS applications to scale from startup to enterprise levels.",
    content: "Building a scalable SaaS application requires careful consideration of architecture patterns...",
    author: "Mohammed bin Hassan",
    date: "2024-11-28",
    readTime: "12 min read",
    category: "Development",
    tags: ["SaaS", "Architecture", "Scalability", "Full Stack"],
    image: "⚙️"
  },
  {
    id: 5,
    title: "Color Psychology in Middle Eastern Brand Design",
    excerpt: "Understand how cultural color preferences and psychological associations impact brand perception across different Middle Eastern markets.",
    content: "Color psychology plays a crucial role in brand design across all cultures...",
    author: "Layla Mahmoud",
    date: "2024-11-20",
    readTime: "7 min read",
    category: "Brand Strategy",
    tags: ["Color Psychology", "Brand Design", "Cultural Marketing", "Middle East"],
    image: "🎨"
  },
  {
    id: 6,
    title: "Mobile-First Design Strategies for Saudi Market",
    excerpt: "With over 95% mobile penetration in Saudi Arabia, learn how to design mobile-first experiences that resonate with local users.",
    content: "Saudi Arabia leads the world in mobile device adoption and usage...",
    author: "Khalid Al-Sudairi",
    date: "2024-11-15",
    readTime: "9 min read",
    category: "Mobile Design",
    tags: ["Mobile Design", "Saudi Arabia", "UX Design", "Mobile-First"],
    image: "📱"
  },
  {
    id: 7,
    title: "Performance Optimization for Arabic Websites",
    excerpt: "Technical strategies for optimizing website performance when serving Arabic content, including font loading, RTL layouts, and CDN considerations.",
    content: "Optimizing website performance for Arabic content involves unique technical challenges...",
    author: "Nora Al-Faisal",
    date: "2024-11-08",
    readTime: "11 min read",
    category: "Technical",
    tags: ["Performance", "Arabic Websites", "RTL", "Web Optimization"],
    image: "⚡"
  },
  {
    id: 8,
    title: "The Rise of Digital Advertising in GCC Markets",
    excerpt: "Analyze the evolution of digital advertising across Gulf Cooperation Council countries and effective strategies for modern campaigns.",
    content: "Digital advertising in the GCC region has evolved rapidly over the past decade...",
    author: "Saeed Al-Mansoori",
    date: "2024-11-01",
    readTime: "8 min read",
    category: "Digital Marketing",
    tags: ["Digital Advertising", "GCC", "Marketing Strategy", "Campaign Management"],
    image: "📈"
  }
];

const categories = [
  "All Posts",
  "Brand Identity",
  "Web Development", 
  "Design",
  "Development",
  "Brand Strategy",
  "Mobile Design",
  "Technical",
  "Digital Marketing"
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<typeof blogPosts[0] | null>(null);

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All Posts" || post.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              TechPartner <span className="text-[#01A1C1]">Blog</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Insights, tutorials, and industry trends from our expert team. 
              Stay updated with the latest in design, development, and digital transformation.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-[#01A1C1] focus:ring-2 focus:ring-[#01A1C1]/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-[#01A1C1] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && selectedCategory === "All Posts" && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#01A1C1] text-white">
                Featured Article
              </span>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="relative z-10 max-w-4xl">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-4xl">{featuredPost.image}</span>
                  <div>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                  {featuredPost.title}
                </h2>
                
                <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-blue-100">
                    <div className="flex items-center space-x-2">
                      <User size={16} />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={16} />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setSelectedPost(featuredPost)}
                    className="bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                  >
                    Read Article
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </div>
              </div>
              
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
                <div className="text-9xl font-bold transform rotate-12 translate-x-12 translate-y-12">
                  {featuredPost.image}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {regularPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border group"
                >
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 text-center relative">
                    <div className="text-4xl mb-4">{post.image}</div>
                    <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-xs font-medium text-gray-700">{post.category}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={14} />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#01A1C1] transition-colors leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="text-gray-500 text-xs px-2 py-1">
                            +{post.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User size={14} />
                        <span>{post.author}</span>
                      </div>
                      
                      <Button
                        onClick={() => setSelectedPost(post)}
                        variant="outline"
                        size="sm"
                        className="group-hover:bg-[#01A1C1] group-hover:text-white group-hover:border-[#01A1C1] transition-colors"
                      >
                        Read More
                        <ArrowRight className="ml-1" size={14} />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Article Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{selectedPost.image}</span>
                <div>
                  <span className="bg-[#01A1C1] text-white px-3 py-1 rounded-full text-sm">
                    {selectedPost.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                {selectedPost.title}
              </h1>
              
              <div className="flex items-center space-x-6 mb-8 text-gray-600">
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span>{selectedPost.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{new Date(selectedPost.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>{selectedPost.readTime}</span>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {selectedPost.excerpt}
                </p>
                
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>{selectedPost.content}</p>
                  
                  <p>
                    This article continues with comprehensive insights and practical strategies that our expert team has developed 
                    through years of experience working with businesses across the Middle East and North Africa region.
                  </p>
                  
                  <p>
                    At TechPartner, we believe in sharing knowledge and helping businesses succeed in the digital transformation 
                    journey. Our blog serves as a resource for industry insights, technical tutorials, and strategic guidance.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <h4 className="font-semibold text-gray-900 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedPost.tags.map((tag, idx) => (
                    <span key={idx} className="bg-[#01A1C1] text-white px-3 py-2 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  <Link href="/categories" className="flex-1">
                    <Button className="w-full bg-[#01A1C1] hover:bg-[#0189A8] text-white">
                      Start Your Project
                      <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </Link>
                  <Link href="/contact" className="flex-1">
                    <Button variant="outline" className="w-full border-[#01A1C1] text-[#01A1C1] hover:bg-[#01A1C1] hover:text-white">
                      Contact Our Experts
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Section */}
      <section className="py-20 bg-[#01A1C1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Stay Updated with Our Latest Insights
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter and get the latest articles, tutorials, and industry trends 
            delivered directly to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white border-white"
            />
            <Button className="bg-white text-[#01A1C1] hover:bg-gray-100 font-semibold px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}