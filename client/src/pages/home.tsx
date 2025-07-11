import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users, Award, Clock, Star } from "lucide-react";
import AnimatedCounter from "@/components/AnimatedCounter";
import LoadingSpinner, { ServiceCardSkeleton } from "@/components/LoadingSpinner";
import heroImage from "@assets/image_1751882806746.png";
import techPartnerDeveloper from "@assets/19362653 [Converted]_1751929167532.png";
import logoDesignImage from "@assets/image_1751882996727.png";
import webDesignImage from "@assets/image_1751883007179.png";
import businessAdvertisingImage from "@assets/image_1751883014077.png";
import artIllustrationImage from "@assets/image_1751883022348.png";
import packagingLabelImage from "@assets/image_1751883029057.png";
import startBrandImage from "@assets/image_1751883149385.png";
import fullStackImage from "@assets/Full-Stack-Dev_1751883915476.jpg";

const HeroSVG = () => (
  <svg width="605" height="428" viewBox="0 0 605 428" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-lg">
    <path d="M15.026 5.215C19.688 5.215 23.762 6.118 27.248 7.924C30.776 9.688 33.485 12.25 35.375 15.61C37.307 18.928 38.273 22.813 38.273 27.265C38.273 31.717 37.307 35.581 35.375 38.857C33.485 42.133 30.776 44.653 27.248 46.417C23.762 48.139 19.688 49 15.026 49H0.725V5.215H15.026ZM15.026 43.141C20.15 43.141 24.077 41.755 26.807 38.983C29.537 36.211 30.902 32.305 30.902 27.265C30.902 22.183 29.537 18.214 26.807 15.358C24.077 12.502 20.15 11.074 15.026 11.074H7.907V43.141H15.026Z" fill="#1F2937"/>
    <path d="M8.536 185.848V187.032H3.688V190.792H7.624V191.976H3.688V197H2.232V185.848H8.536ZM11.7505 189.656C12.0065 189.155 12.3692 188.765 12.8385 188.488C13.3185 188.211 13.8998 188.072 14.5825 188.072V189.576H14.1985C12.5665 189.576 11.7505 190.461 11.7505 192.232V197H10.2945V188.232H11.7505V189.656Z" fill="#6B7280"/>
    <path d="M52.248 355.848L49.016 367H47.384L44.792 358.024L42.104 367L40.488 367.016L37.368 355.848H38.92L41.352 365.304L44.04 355.848H45.672L48.232 365.272L50.68 355.848H52.248Z" fill="#9CA3AF"/>
    <path d="M393.982 356.595C393.64 355.936 393.165 355.442 392.557 355.113C391.949 354.771 391.246 354.6 390.448 354.6C389.574 354.6 388.795 354.796 388.111 355.189C387.427 355.582 386.889 356.139 386.496 356.861C386.116 357.583 385.926 358.419 385.926 359.369C385.926 360.319 386.116 361.161 386.496 361.896C386.889 362.618 387.427 363.175 388.111 363.568C388.795 363.961 389.574 364.157 390.448 364.157C391.626 364.157 392.582 363.828 393.317 363.169C394.052 362.51 394.501 361.617 394.664 360.49H391.5V359.27H396.144C396.176 359.473 396.192 359.665 396.192 359.845C396.192 361.315 395.8 362.524 395.016 363.472C394.232 364.42 393.125 364.894 391.696 364.894C390.6 364.894 389.65 364.651 388.848 364.166C388.046 363.681 387.432 363.006 387.008 362.142C386.584 361.278 386.372 360.283 386.372 359.156C386.372 358.029 386.584 357.034 387.008 356.17C387.432 355.306 388.046 354.631 388.848 354.146C389.65 353.661 390.6 353.418 391.696 353.418C392.963 353.418 394.019 353.758 394.864 354.438C395.709 355.118 396.198 356.043 396.33 357.213H394.84C394.742 356.617 394.449 356.128 393.96 355.746C393.471 355.364 392.86 355.173 392.128 355.173C391.354 355.173 390.667 355.36 390.068 355.734C389.469 356.108 389.006 356.633 388.68 357.309C388.354 357.985 388.191 358.747 388.191 359.595C388.191 360.443 388.354 361.205 388.68 361.881C389.006 362.557 389.469 363.082 390.068 363.456C390.667 363.83 391.354 364.017 392.128 364.017C393.066 364.017 393.835 363.747 394.434 363.207C395.033 362.667 395.382 361.94 395.481 361.026H392.548V359.845H395.481C395.481 361.315 395.089 362.524 394.305 363.472C393.521 364.42 392.414 364.894 390.985 364.894Z" fill="#01A1C1"/>
    <path d="M15.854 417.168C15.854 417.663 15.7373 418.129 15.504 418.568C15.2707 419.007 14.8973 419.366 14.384 419.646C13.8707 419.917 13.2127 420.052 12.41 420.052H10.646V424H9.05V414.27H12.41C13.1567 414.27 13.7867 414.401 14.3 414.662C14.8227 414.914 15.21 415.259 15.462 415.698C15.7233 416.137 15.854 416.627 15.854 417.168ZM12.41 418.75C13.0167 418.75 13.4693 418.615 13.768 418.344C14.0667 418.064 14.216 417.672 14.216 417.168C14.216 416.104 13.614 415.572 12.41 415.572H10.646V418.75H12.41Z" fill="#374151"/>
    <path d="M351.964 418.974C352.319 419.03 352.641 419.175 352.93 419.408C353.229 419.641 353.462 419.931 353.63 420.276C353.807 420.621 353.896 420.99 353.896 421.382C353.896 421.877 353.77 422.325 353.518 422.726C353.266 423.118 352.897 423.431 352.412 423.664C351.936 423.888 351.371 424 350.718 424H347.078V414.242H350.578C351.241 414.242 351.805 414.354 352.272 414.578C352.739 414.793 353.089 415.087 353.322 415.46C353.555 415.833 353.672 416.253 353.672 416.72C353.672 417.299 353.525 417.797 353.23 418.212C352.944 418.618 352.52 418.871 351.964 418.974ZM348.352 418.478H350.48C351.045 418.478 351.473 418.357 351.762 418.114C352.061 417.871 352.21 417.535 352.21 417.106C352.21 416.677 352.061 416.341 351.762 416.098C351.473 415.855 351.045 415.734 350.48 415.734H348.352V418.478ZM350.606 422.508C351.199 422.508 351.655 422.378 351.972 422.116C352.299 421.854 352.462 421.489 352.462 421.02C352.462 420.551 352.299 420.186 351.972 419.924C351.655 419.662 351.199 419.532 350.606 419.532H348.352V422.508H350.606Z" fill="#6B7280"/>
  </svg>
);

const services = [
  {
    id: 1,
    title: "Logo & branding design",
    image: logoDesignImage,
    description: "Create a memorable brand identity that stands out"
  },
  {
    id: 2,
    title: "Website & app design",
    image: webDesignImage,
    description: "Modern, responsive designs for digital experiences"
  },
  {
    id: 3,
    title: "Business & advertising",
    image: businessAdvertisingImage,
    description: "Professional marketing materials that convert"
  },
  {
    id: 4,
    title: "Art & illustration",
    image: artIllustrationImage,
    description: "Custom artwork and illustrations for any project"
  },
  {
    id: 5,
    title: "Packaging & label",
    image: packagingLabelImage,
    description: "Product packaging that attracts and sells"
  },
  {
    id: 6,
    title: "Custom web and apps development",
    image: fullStackImage,
    description: "Professional custom development using modern full stack solutions"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {/* Hero Image */}
            <div className="relative flex-shrink-0">
              <img 
                src={heroImage} 
                alt="Design showcase" 
                className="w-32 sm:w-48 md:w-64 lg:w-80 xl:w-96 h-auto rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl"
              />
              
              {/* Decorative SVG positioned behind */}
              <div className="absolute -top-3 -right-3 lg:-top-6 lg:-right-6 opacity-15 hidden lg:block">
                <HeroSVG />
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0 space-y-4 sm:space-y-6 lg:space-y-8">
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  Design personalized to fit your needs perfectly.
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  Get custom designs that perfectly match your vision. From logos to websites, 
                  our expert designers bring your ideas to life with creativity and precision.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4">
                <Link to="/categories">
                  <Button size="sm" className="bg-[#01A1C1] hover:bg-[#0891B2] text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg w-full sm:w-auto">
                    Start Your Project
                    <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  </Button>
                </Link>
                <Link to="/portfolio">
                  <Button variant="outline" size="sm" className="px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg border-gray-300 w-full sm:w-auto">
                    View Portfolio
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Design and Development
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional design and development solutions for every business need
            </p>
          </div>

          {/* Custom Development Section */}
          <div className="mb-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">Custom Web Development</h3>
                <p className="text-blue-100 mb-6 text-lg">
                  Professional full-stack development solutions using modern technologies. 
                  From simple websites to complex web applications with complete technical requirements gathering.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                    <span>Custom UI/UX Design</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                    <span>Full-Stack Development</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                    <span>CMS Integration & Backend</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                    <span>8-Step Technical Assessment</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <Link to="/categories/web-development">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                      Start Development Project
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <div className="text-sm text-blue-100">
                    Starting from <span className="font-bold text-white">25,000 SAR</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <img 
                  src={fullStackImage} 
                  alt="Custom Web Development" 
                  className="rounded-lg shadow-xl max-w-sm w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
            {services.map((service) => {
              // Define route based on service type
              const getServiceRoute = (serviceId: number) => {
                switch (serviceId) {
                  case 1: // Logo & branding design
                    return "/categories/logo-and-identity";
                  case 2: // Website & app design
                    return "/categories/web-and-app-design";
                  case 3: // Business & advertising
                    return "/categories/business-advertising";
                  case 4: // Art & illustration
                    return "/categories/art-illustration";
                  case 5: // Packaging & label
                    return "/categories/packaging-label";
                  case 6: // Custom web and apps development
                    return "/categories/web-development";
                  default:
                    return "/categories";
                }
              };

              return (
                <Link key={service.id} to={getServiceRoute(service.id)}>
                  <div className="group cursor-pointer">
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#01A1C1]/20">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#01A1C1] transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Your Business Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Your business,<br />
                <span className="text-[#01A1C1]">exceptional design.</span>
              </h2>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Our trusted designer community specializes in logos, websites, packaging design, and more. 
                We've assisted thousands of businesses in launching, growing, expanding, and rebranding 
                with custom, professional design.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#01A1C1] rounded-full"></div>
                  <span className="text-gray-700">Expert designers with proven track records</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#01A1C1] rounded-full"></div>
                  <span className="text-gray-700">Custom solutions tailored to your brand</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-[#01A1C1] rounded-full"></div>
                  <span className="text-gray-700">Fast turnaround with unlimited revisions</span>
                </div>
              </div>

              <Link to="/categories">
                <Button size="lg" className="bg-[#01A1C1] hover:bg-[#0891B2] text-white px-8 py-4 text-lg mt-6">
                  Start Your Brand
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src={startBrandImage} 
                  alt="Start your brand" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#01A1C1]/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cyan-200/30 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything Begins with a Logo Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-medium text-[#313030] mb-6" style={{ fontFamily: 'Poppins', fontSize: '40px', lineHeight: '30px' }}>
              Everything begins with a logo.
            </h2>
            <p className="text-lg text-black max-w-4xl mx-auto leading-relaxed" style={{ fontFamily: 'Poppins', fontSize: '18px', lineHeight: '44px' }}>
              Whether you're starting fresh or refining your brand, our solutions are tailored to suit your business and elevate your branding
            </p>
          </div>

          {/* Two Options Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
            {/* AI Logo Maker */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-8 mb-6">
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-6xl">🤖</div>
                </div>
              </div>
              <h3 className="text-2xl font-medium text-black mb-4" style={{ fontFamily: 'Poppins', fontSize: '26px', lineHeight: '44px' }}>
                Try Our AI Logo Maker
              </h3>
              <p className="text-[#313030] mb-6 leading-relaxed" style={{ fontFamily: 'Poppins', fontSize: '18px', lineHeight: '38px' }}>
                Easily craft your unique logo in just minutes with our intuitive, AI-powered tool. It's effortless and provides the ideal starting point or inspiration for our expert designers to elevate your branding journey to new heights.
              </p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg font-medium text-black" style={{ fontFamily: 'Poppins', fontSize: '20px', lineHeight: '38px' }}>
                  Create a logo, it's free
                </span>
                <ArrowRight className="w-6 h-6 text-black" />
              </div>
            </div>

            {/* Logo Contest */}
            <div className="text-center">
              <div className="bg-gray-100 rounded-lg p-8 mb-6">
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-6xl">🎨</div>
                </div>
              </div>
              <h3 className="text-2xl font-medium text-black mb-4" style={{ fontFamily: 'Poppins', fontSize: '26px', lineHeight: '44px' }}>
                Start a logo contest.
              </h3>
              <p className="text-[#313030] mb-6 leading-relaxed" style={{ fontFamily: 'Poppins', fontSize: '18px', lineHeight: '38px' }}>
                Elevate your branding journey with a wide array of custom logo options from our talented community of freelancers. Experience next-level creative direction, unmatched expertise, and personalized solutions tailored to your unique business needs.
              </p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg font-medium text-black" style={{ fontFamily: 'Poppins', fontSize: '20px', lineHeight: '38px' }}>
                  Logos from SAR1500
                </span>
                <ArrowRight className="w-6 h-6 text-black" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Portfolio Highlights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See the exceptional work we've delivered for clients across various industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="group cursor-pointer">
              <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-4">🏢</div>
                    <h3 className="text-xl font-bold">Corporate Identity</h3>
                    <p className="text-blue-100">Complete brand package</p>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Tech Solutions Inc.</h4>
                  <p className="text-gray-600 text-sm">Logo design, business cards, and brand guidelines</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-green-500 to-teal-600 p-8 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-4">🛍️</div>
                    <h3 className="text-xl font-bold">E-commerce Platform</h3>
                    <p className="text-green-100">Full website design</p>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Boutique Fashion</h4>
                  <p className="text-gray-600 text-sm">Modern e-commerce website with custom features</p>
                </div>
              </div>
            </div>

            <div className="group cursor-pointer">
              <div className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="aspect-square bg-gradient-to-br from-orange-500 to-red-600 p-8 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl mb-4">📱</div>
                    <h3 className="text-xl font-bold">Social Media Kit</h3>
                    <p className="text-orange-100">Complete branding</p>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Wellness Studio</h4>
                  <p className="text-gray-600 text-sm">Instagram templates and brand consistency</p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-gray-50 rounded-3xl p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h3>
              <p className="text-gray-600">Real feedback from satisfied customers</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Outstanding complete brand identity package. The 6-step logo design process made everything clear and professional."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    AS
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">Ahmed Salem</div>
                    <div className="text-gray-600 text-sm">CEO, Saudi Tech Solutions</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "The 8-step custom web development process was thorough. They built exactly the e-commerce platform we needed."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    LM
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">Layla Mohammed</div>
                    <div className="text-gray-600 text-sm">Owner, Riyadh Fashion Boutique</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "Comprehensive project questionnaire helped them understand our needs. Professional social media and print designs."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    MK
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">Mohammed Khalid</div>
                    <div className="text-gray-600 text-sm">Director, Wellness Studio Jeddah</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TechPartner Expert Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Section */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 relative overflow-hidden">
                <img 
                  src={techPartnerDeveloper} 
                  alt="TechPartner Expert Developer" 
                  className="w-full h-auto relative z-10"
                />
                
                {/* Floating Tech Icons */}
                <div className="absolute top-4 left-4 bg-white shadow-lg rounded-lg p-3 animate-bounce">
                  <div className="w-6 h-6 bg-[#01A1C1] rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">TP</span>
                  </div>
                </div>
                <div className="absolute top-8 right-8 bg-white shadow-lg rounded-lg p-3 animate-pulse">
                  <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs">⚡</span>
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 bg-white shadow-lg rounded-lg p-3 animate-bounce delay-300">
                  <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center px-4 py-2 bg-[#01A1C1]/10 rounded-full text-sm font-medium text-[#01A1C1] mb-4">
                  <Users className="mr-2" size={16} />
                  Expert Development Team
                </div>
                
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Meet Your
                  <span className="block text-[#01A1C1]">TechPartner Experts</span>
                </h2>
                
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Our skilled developers and designers bring years of experience in creating 
                  cutting-edge digital solutions. From complex web applications to stunning 
                  brand identities, we're your dedicated technology partners.
                </p>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Certified Experts</h3>
                    <p className="text-gray-600 text-sm">Industry-certified professionals with proven track records</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                    <p className="text-gray-600 text-sm">Quick turnaround times without compromising quality</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Quality Assured</h3>
                    <p className="text-gray-600 text-sm">Rigorous testing and quality control processes</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#01A1C1]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="text-[#01A1C1]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Client Focused</h3>
                    <p className="text-gray-600 text-sm">Dedicated support and personalized service approach</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 py-8 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-[#01A1C1] mb-2">
                    <AnimatedCounter end={500} duration={2000} />+
                  </div>
                  <div className="text-sm text-gray-600">Projects Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-[#01A1C1] mb-2">
                    <AnimatedCounter end={150} duration={2000} />+
                  </div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-[#01A1C1] mb-2">
                    <AnimatedCounter end={99} duration={2000} />%
                  </div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/categories">
                  <Button size="lg" className="bg-[#01A1C1] hover:bg-[#0189A8] text-white font-semibold px-8 py-4 text-lg w-full sm:w-auto">
                    Start Your Project
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="border-[#01A1C1] text-[#01A1C1] hover:bg-[#01A1C1] hover:text-white font-semibold px-8 py-4 text-lg w-full sm:w-auto">
                    Meet Our Team
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories & Questionnaire Steps */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Service Categories & Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive questionnaire flows designed to understand your exact needs and deliver perfect results
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Logo & Identity - 6 Steps */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Logo & Identity</h3>
                <p className="text-gray-600">Complete brand identity design</p>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">1</div>
                  Package Selection & Pricing
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</div>
                  Design Selection from Gallery
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">3</div>
                  Brand Details & Information
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">4</div>
                  Style Preferences (7 Sliders)
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">5</div>
                  Color Selection & Palette
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">6</div>
                  Review & Order Confirmation
                </div>
              </div>
              
              <Link to="/categories/logo-and-identity">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Start Logo Project
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Custom Web Development - 8 Steps */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-200">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💻</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Custom Web Development</h3>
                <p className="text-gray-600">Full-stack development solutions</p>
                <div className="inline-block bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full mt-2">
                  FEATURED
                </div>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">1</div>
                  Project Information & Goals
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</div>
                  Project Idea & Concept Details
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">3</div>
                  Technology Stack Preferences
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">4</div>
                  Features & Functionality Requirements
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">5</div>
                  Design Guidelines & References
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">6</div>
                  User Flows & Experience Design
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">7</div>
                  Budget & Timeline Planning
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">8</div>
                  Review & Technical Assessment
                </div>
              </div>
              
              <Link to="/categories/web-development">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Start Development Project
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <div className="text-center mt-3 text-sm text-gray-600">
                Starting from <span className="font-bold text-purple-600">25,000 SAR</span>
              </div>
            </div>

            {/* Other Categories - General Process */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">All Other Services</h3>
                <p className="text-gray-600">Comprehensive project intake</p>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">1</div>
                  Project Information & Contact
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</div>
                  Detailed Project Description
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">3</div>
                  Timeline & Urgency Assessment
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">4</div>
                  File Uploads & References
                </div>
              </div>
              
              <div className="space-y-2 mb-6 text-sm text-gray-600">
                <div>• Business & Advertising</div>
                <div>• Art & Illustration</div>
                <div>• Packaging & Labels</div>
                <div>• Social Media Design</div>
                <div>• Print Design</div>
              </div>
              
              <Link to="/categories">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  View All Categories
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to bring your vision to life?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied clients who've transformed their brands with our design services.
          </p>
          <Link to="/categories">
            <Button size="lg" className="bg-[#01A1C1] hover:bg-[#0891B2] text-white px-8 py-4 text-lg">
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}