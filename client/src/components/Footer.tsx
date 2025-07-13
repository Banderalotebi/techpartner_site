import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Link } from "wouter";
import techPartnerLogo from "@assets/tech partner logo_1751927733407.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-screen-xl mx-auto px-6">
        
        {/* Enhanced Logo Section */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <img 
              src={techPartnerLogo} 
              alt="TechPartner Logo" 
              className="h-14 w-auto"
            />
          </div>
          <p className="text-gray-400 max-w-md leading-relaxed">
            Transforming ideas into exceptional digital experiences. We are your trusted partner for all design and development needs.
          </p>
        </div>

        {/* Contact Info Bar */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-[#01A1C1]" />
              <div>
                <div className="text-white font-medium">Call Us</div>
                <div className="text-gray-400 text-sm">+966 56 176 1867</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-[#01A1C1]" />
              <div>
                <div className="text-white font-medium">Email Us</div>
                <div className="text-gray-400 text-sm">info@techpartner.sa</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-[#01A1C1]" />
              <div>
                <div className="text-white font-medium">Location</div>
                <div className="text-gray-400 text-sm">Riyadh, Saudi Arabia</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-12"></div>

        {/* Enhanced Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Services Column */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">Our Services</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/categories/logo-and-identity" className="hover:text-[#01A1C1] transition-colors hover:translate-x-1 transform duration-200 block">Logo & Branding</Link></li>
              <li><Link to="/categories/web-and-app-design" className="hover:text-[#01A1C1] transition-colors hover:translate-x-1 transform duration-200 block">Web Design</Link></li>
              <li><Link to="/categories/web-development" className="hover:text-[#01A1C1] transition-colors hover:translate-x-1 transform duration-200 block">Web Development</Link></li>
              <li><Link to="/categories/business-advertising" className="hover:text-[#01A1C1] transition-colors hover:translate-x-1 transform duration-200 block">Business Advertising</Link></li>
              <li><Link to="/categories/art-illustration" className="hover:text-[#01A1C1] transition-colors hover:translate-x-1 transform duration-200 block">Art & Illustration</Link></li>
              <li><Link to="/categories/packaging-label" className="hover:text-[#01A1C1] transition-colors hover:translate-x-1 transform duration-200 block">Packaging & Labels</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-white mb-6 text-lg">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-[#01A1C1] transition-colors hover:translate-x-1 transform duration-200 block">About Us</a></li>
              <li><a href="#" className="hover:text-[#01A1C1] transition-colors hover:translate-x-1 transform duration-200 block">Our Team</a></li>
              <li><a href="#" className="hover:text-[#01A1C1] transition-colors hover:translate-x-1 transform duration-200 block">Careers</a></li>
              <li><Link href="/portfolio" className="hover:text-[#01A1C1] transition-colors hover:translate-x-1 transform duration-200 block">Portfolio</Link></li>
              <li><a href="#" className="hover:text-[#01A1C1] transition-colors hover:translate-x-1 transform duration-200 block">Success Stories</a></li>
              <li><a href="#" className="hover:text-[#01A1C1] transition-colors hover:translate-x-1 transform duration-200 block">Awards</a></li>
            </ul>
          </div>

          {/* Get a Design Column */}
          <div>
            <h4 className="font-medium text-black mb-4 text-lg">Get a Design</h4>
            <ul className="space-y-2 text-base text-gray-700">
              <li><a href="#" className="hover:text-black transition-colors">Logo Design</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Business Card</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Web Page Design</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Brand Guide</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Packaging Design</a></li>
              <li><a href="#" className="hover:text-black transition-colors">T-Shirt Design</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Book Cover Design</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Browse All Categories</a></li>
            </ul>
          </div>

          {/* Design Services Column */}
          <div>
            <h4 className="font-medium text-black mb-4 text-lg">Design Services</h4>
            <ul className="space-y-2 text-base text-gray-700">
              <li><a href="#" className="hover:text-black transition-colors">Design Contests</a></li>
              <li><a href="#" className="hover:text-black transition-colors">1-to-1 Projects</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Find a Designer</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Discover Inspiration</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Pricings</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Agencies</a></li>
              <li><a href="#" className="hover:text-black transition-colors">TechPartner Studio</a></li>
              <li><a href="#" className="hover:text-black transition-colors">TechPartner Select</a></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-medium text-black mb-4 text-lg">Resources</h4>
            <ul className="space-y-2 text-base text-gray-700">
              <li><a href="#" className="hover:text-black transition-colors">Become A Designer</a></li>
              <li><Link href="/blog" className="hover:text-black transition-colors">Blog</Link></li>
              <li><a href="#" className="hover:text-black transition-colors">Design with out Borders</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Logo Ideas</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Affiliates</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Designer Resources</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Terms and Conditions</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        {/* Vertical divider lines */}
        <div className="relative mb-8">
          <div className="absolute left-1/4 top-0 h-16 w-px bg-gray-400"></div>
          <div className="absolute left-2/4 top-0 h-16 w-px bg-gray-400"></div>
          <div className="absolute left-3/4 top-0 h-16 w-px bg-gray-400"></div>
        </div>

        {/* Bottom divider line */}
        <div className="h-px bg-gray-400 w-full mb-8"></div>
        
        {/* Copyright and Help */}
        <div className="flex justify-between items-center">
          <p className="text-gray-700 text-base">
            All rights reserved © 2024 TechPartner Est.
          </p>
          <div className="text-gray-700 text-base">
            Help
          </div>
        </div>
      </div>
    </footer>
  );
}
