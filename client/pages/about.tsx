import { Link } from "wouter";
import { ArrowRight, Users, Award, Globe, Clock } from "lucide-react";

const stats = [
  { number: "500+", label: "Projects Completed", icon: "📊" },
  { number: "150+", label: "Happy Clients", icon: "😊" },
  { number: "8", label: "Service Categories", icon: "🎯" },
  { number: "24/7", label: "Support Available", icon: "🔧" }
];

const services = [
  {
    title: "Logo & Brand Identity",
    description: "Complete brand identity packages from concept to execution",
    price: "Starting at 1,500 SAR",
    features: ["Custom logo design", "Brand guidelines", "Business cards", "Letterhead"]
  },
  {
    title: "Web Design & Development",
    description: "Professional websites and web applications",
    price: "Starting at 5,000 SAR",
    features: ["Responsive design", "E-commerce integration", "CMS setup", "SEO optimization"]
  },
  {
    title: "Custom Development",
    description: "Full-stack web applications and software solutions",
    price: "Starting at 25,000 SAR",
    features: ["Custom web apps", "API development", "Database design", "Cloud deployment"]
  },
  {
    title: "Print & Packaging",
    description: "Professional print design and packaging solutions",
    price: "Starting at 800 SAR",
    features: ["Brochures & flyers", "Product packaging", "Business materials", "Marketing collateral"]
  }
];

const portfolio = [
  {
    title: "Tech Solutions Inc.",
    category: "Corporate Identity",
    description: "Complete brand identity package including logo, business cards, and brand guidelines",
    image: "🏢",
    tags: ["Logo Design", "Brand Identity", "Corporate"]
  },
  {
    title: "Arabian Retail Store",
    category: "E-commerce Website",
    description: "Full e-commerce platform with Arabic language support and local payment integration",
    image: "🛒",
    tags: ["E-commerce", "Arabic Support", "Shopify"]
  },
  {
    title: "Creative Agency Portfolio",
    category: "Web Development",
    description: "Custom portfolio website with interactive galleries and content management",
    image: "🎨",
    tags: ["Web Development", "Portfolio", "CMS"]
  },
  {
    title: "Restaurant Chain",
    category: "Brand & Print",
    description: "Complete rebrand with packaging design, menu design, and marketing materials",
    image: "🍽️",
    tags: ["Branding", "Print Design", "Packaging"]
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-[#01A1C1]">TechPartner</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Your trusted partner for professional design and development solutions. 
              We create exceptional digital experiences that help businesses grow and succeed.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/categories" className="bg-[#01A1C1] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0189A8] transition-colors">
                View Our Services
              </Link>
              <Link href="/contact" className="border border-[#01A1C1] text-[#01A1C1] px-8 py-3 rounded-lg font-semibold hover:bg-[#01A1C1] hover:text-white transition-colors">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  TechPartner was founded with a simple mission: to provide exceptional design and development 
                  services that help businesses succeed in the digital age. We believe that great design is not 
                  just about aesthetics—it's about creating meaningful connections between brands and their audiences.
                </p>
                <p>
                  Over the years, we've had the privilege of working with hundreds of clients across various 
                  industries, from startups to established corporations. Each project has taught us something new 
                  and helped us refine our approach to delivering outstanding results.
                </p>
                <p>
                  Today, we're proud to be recognized as a leading design and development agency in the region, 
                  known for our creativity, professionalism, and commitment to client satisfaction.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <Users className="text-[#01A1C1] mb-4" size={32} />
                  <h3 className="font-semibold text-gray-900 mb-2">Expert Team</h3>
                  <p className="text-gray-600 text-sm">Skilled designers and developers</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <Clock className="text-[#01A1C1] mb-4" size={32} />
                  <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                  <p className="text-gray-600 text-sm">Quick turnaround times</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <Award className="text-[#01A1C1] mb-4" size={32} />
                  <h3 className="font-semibold text-gray-900 mb-2">Quality Focus</h3>
                  <p className="text-gray-600 text-sm">Attention to every detail</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <Globe className="text-[#01A1C1] mb-4" size={32} />
                  <h3 className="font-semibold text-gray-900 mb-2">Global Reach</h3>
                  <p className="text-gray-600 text-sm">Serving clients worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive design and development solutions tailored to your business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  <span className="text-[#01A1C1] font-semibold">{service.price}</span>
                </div>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-[#01A1C1] rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Highlights */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Recent Work
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A selection of our recent projects showcasing our diverse capabilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {portfolio.map((project, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-center">
                  <div className="text-4xl mb-4">{project.image}</div>
                  <div className="text-white">
                    <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                    <p className="text-blue-100 text-sm">{project.category}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#01A1C1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Let's discuss how we can help bring your vision to life with our professional design and development services.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/categories" className="bg-white text-[#01A1C1] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center">
              Start Your Project
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link href="/contact" className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#01A1C1] transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}