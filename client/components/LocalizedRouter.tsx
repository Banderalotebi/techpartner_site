import { Switch, Route, useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import Home from "@/pages/home";
import CategoryPage from "@/pages/category";
import LogoIdentityPage from "@/pages/logo-identity";
import WebAppDesignPage from "@/pages/web-app-design";
import Dashboard from "@/pages/dashboard";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import PortfolioPage from "@/pages/portfolio";
import BlogPage from "@/pages/blog";
import AdminPage from "@/pages/admin";
import AIStudioPage from "@/pages/ai-studio";
import NotFound from "@/pages/not-found";

export function LocalizedRouter() {
  const [location] = useLocation();
  const { language } = useLanguage();

  // Remove language prefix from location for routing
  const getLocalizedPath = (path: string): string => {
    if (language === 'ar') {
      return '/ar' + path;
    }
    return path;
  };

  // Strip language prefix from current location for matching
  const currentPath = location.startsWith('/ar') ? location.substring(3) || '/' : location;

  return (
    <Switch location={currentPath}>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/ai-studio" component={AIStudioPage} />
      <Route path="/categories" component={CategoryPage} />
      <Route path="/categories/logo-and-identity" component={LogoIdentityPage} />
      <Route path="/categories/web-and-app-design" component={WebAppDesignPage} />
      <Route path="/categories/web-development" component={WebAppDesignPage} />
      <Route path="/categories/business-advertising" component={CategoryPage} />
      <Route path="/categories/art-illustration" component={CategoryPage} />
      <Route path="/categories/packaging-label" component={CategoryPage} />
      <Route path="/categories/social-media" component={CategoryPage} />
      <Route path="/categories/print-design" component={CategoryPage} />
      <Route path="/logo-identity" component={LogoIdentityPage} />
      <Route path="/web-app-design" component={WebAppDesignPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route component={NotFound} />
    </Switch>
  );
}
