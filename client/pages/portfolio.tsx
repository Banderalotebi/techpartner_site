import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, ExternalLink, Calendar, Tag } from "lucide-react";

const portfolioItems = [
  {
    id: 1,
    title: "Tech Solutions Inc.",
    category: "Corporate Identity",
    description: "Complete brand identity package including logo design, business cards, letterhead, and comprehensive brand guidelines for a technology consulting firm.",
    image: "🏢",
    tags: ["Logo Design", "Brand Identity", "Corporate", "Print Design"],
    price: "15,000 SAR",
    duration: "3 weeks",
    year: "2024",
    features: ["Custom logo design", "Business card design", "Letterhead & envelope", "Brand guidelines document", "Social media templates"]
  },
  {
    id: 2,
    title: "Arabian Retail Store",
    category: "E-commerce Development",
    description: "Full e-commerce platform with Arabic language support, local payment integration, and inventory management system.",
    image: "🛒",
    tags: ["E-commerce", "Web Development", "Arabic Support", "Shopify"],
    price: "45,000 SAR",
    duration: "8 weeks",
    year: "2024",
    features: ["Shopify store setup", "Arabic language integration", "Payment gateway setup", "Inventory management", "Mobile optimization"]
  },
  {
    id: 3,
    title: "Creative Agency Portfolio",
    category: "Web Development",
    description: "Custom portfolio website with interactive galleries, content management system, and advanced animation effects.",
    image: "🎨",
    tags: ["Web Development", "Portfolio", "CMS", "Animation"],
    price: "35,000 SAR",
    duration: "6 weeks",
    year: "2024",
    features: ["Custom web design", "Content management", "Interactive galleries", "Animation effects", "SEO optimization"]
  },
  {
    id: 4,
    title: "Restaurant Chain Rebrand",
    category: "Brand & Print Design",
    description: "Complete rebrand for a restaurant chain including packaging design, menu design, signage, and marketing materials.",
    image: "🍽️",
    tags: ["Branding", "Print Design", "Packaging", "Signage"],
    price: "25,000 SAR",
    duration: "5 weeks",
    year: "2024",
    features: ["Logo redesign", "Menu design", "Packaging design", "Signage system", "Marketing materials"]
  },
  {
    id: 5,
    title: "Medical Clinic Website",
    category: "Healthcare Web Design",
    description: "Professional website for medical clinic with appointment booking system, patient portal, and health resources.",
    image: "🏥",
    tags: ["Web Design", "Healthcare", "Booking System", "Patient Portal"],
    price: "28,000 SAR",
    duration: "4 weeks",
    year: "2024",
    features: ["Appointment booking", "Patient portal", "Medical resources", "HIPAA compliance", "Mobile responsive"]
  },
  {
    id: 6,
    title: "Real Estate Platform",
    category: "Property Listing Website",
    description: "Comprehensive real estate platform with property listings, search functionality, and agent management system.",
    image: "🏠",
    tags: ["Real Estate", "Web Development", "Search System", "CRM"],
    price: "55,000 SAR",
    duration: "10 weeks",
    year: "2024",
    features: ["Property listings", "Advanced search", "Agent profiles", "Lead management", "Map integration"]
  },
  {
    id: 7,
    title: "Fashion Brand Identity",
    category: "Fashion & Lifestyle",
    description: "Complete brand identity for fashion startup including logo, packaging, social media templates, and brand guidelines.",
    image: "👗",
    tags: ["Fashion", "Brand Identity", "Social Media", "Packaging"],
    price: "18,000 SAR",
    duration: "4 weeks",
    year: "2024",
    features: ["Fashion logo design", "Packaging design", "Social media kit", "Brand guidelines", "Photography direction"]
  },
  {
    id: 8,
    title: "Educational Platform",
    category: "E-learning Development",
    description: "Online learning platform with course management, student tracking, and interactive learning modules.",
    image: "📚",
    tags: ["E-learning", "Web Development", "LMS", "Education"],
    price: "65,000 SAR",
    duration: "12 weeks",
    year: "2024",
    features: ["Course management", "Student tracking", "Interactive modules", "Progress analytics", "Mobile learning"]
  }
];

const categories = [
  "All Projects",
  "Brand Identity", 
  "Web Development",
  "E-commerce",
  "Print Design",
  "Healthcare",
  "Real Estate",
  "Fashion",
  "Education"
];

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Projects");
  const [selectedProject, setSelectedProject] = useState<typeof portfolioItems[0] | null>(null);

  const filteredProjects = selectedCategory === "All Projects" 
    ? portfolioItems 
    : portfolioItems.filter(item => 
        item.category.includes(selectedCategory) || 
        item.tags.some(tag => tag.includes(selectedCategory))
      );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="text-[#01A1C1]">Portfolio</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Explore our recent work and see how we've helped businesses across various industries 
              achieve their design and development goals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/categories" className="bg-[#01A1C1] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0189A8] transition-colors">
                Start Your Project
              </Link>
              <Link href="/contact" className="border border-[#01A1C1] text-[#01A1C1] px-8 py-3 rounded-lg font-semibold hover:bg-[#01A1C1] hover:text-white transition-colors">
                Discuss Your Ideas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#01A1C1] mb-2">500+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#01A1C1] mb-2">150+</div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#01A1C1] mb-2">99%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#01A1C1] mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
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

      {/* Portfolio Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div key={project.id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-center relative">
                  <div className="text-4xl mb-4">{project.image}</div>
                  <div className="text-white">
                    <h3 className="font-bold text-xl mb-2">{project.title}</h3>
                    <p className="text-blue-100">{project.category}</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-white text-xs font-medium">{project.year}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[#01A1C1] font-bold text-lg">{project.price}</span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar size={16} className="mr-1" />
                      {project.duration}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{project.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-gray-500 text-xs px-2 py-1">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full bg-[#01A1C1] text-white py-3 rounded-lg font-semibold hover:bg-[#0189A8] transition-colors flex items-center justify-center"
                  >
                    View Details
                    <ArrowRight className="ml-2" size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-center rounded-xl mb-6">
                <div className="text-5xl mb-4">{selectedProject.image}</div>
                <div className="text-white">
                  <h3 className="font-bold text-2xl mb-2">{selectedProject.title}</h3>
                  <p className="text-blue-100">{selectedProject.category}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Project Value</div>
                  <div className="text-xl font-bold text-[#01A1C1]">{selectedProject.price}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="text-xl font-bold text-gray-900">{selectedProject.duration}</div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Project Description</h4>
                <p className="text-gray-600 leading-relaxed">{selectedProject.description}</p>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Services Included</h4>
                <ul className="space-y-2">
                  {selectedProject.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-[#01A1C1] rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Technologies & Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, idx) => (
                    <span key={idx} className="bg-[#01A1C1] text-white px-3 py-2 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <Link 
                  href="/categories" 
                  className="flex-1 bg-[#01A1C1] text-white py-3 rounded-lg font-semibold hover:bg-[#0189A8] transition-colors text-center"
                  onClick={() => setSelectedProject(null)}
                >
                  Start Similar Project
                </Link>
                <Link 
                  href="/contact" 
                  className="flex-1 border border-[#01A1C1] text-[#01A1C1] py-3 rounded-lg font-semibold hover:bg-[#01A1C1] hover:text-white transition-colors text-center"
                  onClick={() => setSelectedProject(null)}
                >
                  Discuss Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-[#01A1C1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Let's bring your vision to life with professional design and development services 
            tailored to your business needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/categories" className="bg-white text-[#01A1C1] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center">
              Start Your Project
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link href="/about" className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#01A1C1] transition-colors">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}