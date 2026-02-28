import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, Search, Mail, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import SEO from "@/components/SEO";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <SEO
        title="Page Not Found - TechPartner"
        description="The page you're looking for doesn't exist. Explore our design services or contact us for help."
        noIndex={true}
      />
      
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardContent className="p-8 md:p-12 text-center">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            Sorry, the page you're looking for doesn't exist or has been moved. 
            Let us help you find what you need.
          </p>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link href="/">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-[#01A1C1] hover:text-white hover:border-[#01A1C1] transition-all">
                <Home className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Home</span>
              </Button>
            </Link>
            
            <Link href="/categories">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-[#01A1C1] hover:text-white hover:border-[#01A1C1] transition-all">
                <Search className="h-5 w-5" />
                <span className="text-sm font-medium">Our Services</span>
              </Button>
            </Link>
            
            <Link href="/contact">
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-[#01A1C1] hover:text-white hover:border-[#01A1C1] transition-all">
                <Mail className="h-5 w-5" />
                <span className="text-sm font-medium">Contact Us</span>
              </Button>
            </Link>
          </div>

          {/* Popular Pages */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Popular Pages
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/categories/logo-and-identity">
                <span className="text-[#01A1C1] hover:underline text-sm">Logo Design</span>
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/categories/web-and-app-design">
                <span className="text-[#01A1C1] hover:underline text-sm">Web Design</span>
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/portfolio">
                <span className="text-[#01A1C1] hover:underline text-sm">Portfolio</span>
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/blog">
                <span className="text-[#01A1C1] hover:underline text-sm">Blog</span>
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/about">
                <span className="text-[#01A1C1] hover:underline text-sm">About Us</span>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700 mb-3">
              Need help finding something specific?
            </p>
            <Link href="/contact">
              <Button className="bg-[#01A1C1] hover:bg-[#0891B2] text-white">
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
