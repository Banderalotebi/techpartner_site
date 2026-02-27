import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "@/pages/home";
import CategoryPage from "@/pages/category";
import LogoIdentityPage from "@/pages/logo-identity";
import WebAppDesignPage from "@/pages/web-app-design";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/Profile";
import Orders from "@/pages/Orders";
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";
import PortfolioPage from "@/pages/portfolio";
import BlogPage from "@/pages/blog";
import AdminPage from "@/pages/admin";
import PaymentSuccess from "@/pages/payment-success";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/orders" component={Orders} />
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
      <Route path="/payment/success" component={PaymentSuccess} />
      <Route path="/category/:slug" component={CategoryPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
            </div>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
