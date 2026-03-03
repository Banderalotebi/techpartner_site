import { useEffect, useState } from "react";
import { Code, Terminal, Cpu, Sparkles, Zap, Shield, ChevronRight, Play, Settings, FileCode, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function CoderPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading the coder app
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg">Initializing AI Coder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Development
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            TechPartner AI Coder
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Transform your development workflow with our advanced AI coding assistant. 
            Featuring RAG pipeline, fine-tuned models, and agentic workflows.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8"
              onClick={() => window.open('/coder-app', '_blank')}
            >
              <Play className="w-5 h-5 mr-2" />
              Launch AI Coder
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Code, label: "Lines of Code Analyzed", value: "10M+" },
            { icon: Zap, label: "Response Time", value: "< 2s" },
            { icon: Shield, label: "Accuracy Rate", value: "95%" },
            { icon: Cpu, label: "AI Model", value: "Llama 3.1" },
          ].map((stat, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6 text-center">
                <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div id="features" className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful AI Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Database,
                title: "RAG Pipeline",
                description: "Semantic code search with vector database integration for intelligent context-aware responses."
              },
              {
                icon: Cpu,
                title: "Fine-Tuned Models",
                description: "Custom-trained Llama 3.1 models optimized for your specific codebase and coding patterns."
              },
              {
                icon: Terminal,
                title: "Agentic Workflows",
                description: "Autonomous AI agents that can run linters, execute code, and navigate your project structure."
              },
              {
                icon: FileCode,
                title: "Multi-Language Support",
                description: "Expert-level assistance in Python, JavaScript, TypeScript, React, and more."
              },
              {
                icon: Settings,
                title: "Customizable",
                description: "Configure models, tools, and workflows to match your development needs."
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "All processing happens locally on your infrastructure. No code leaves your servers."
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-colors">
                <CardHeader>
                  <feature.icon className="w-10 h-10 text-cyan-400 mb-3" />
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Index Your Code", desc: "Upload your codebase for semantic analysis" },
              { step: "2", title: "Ask Questions", desc: "Query about architecture, bugs, or improvements" },
              { step: "3", title: "AI Analysis", desc: "RAG + Fine-tuned model provides context-aware answers" },
              { step: "4", title: "Implement", desc: "Get code suggestions, fixes, and optimizations" }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
                {index < 3 && (
                  <ChevronRight className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 text-slate-600 transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-2xl p-12 border border-cyan-500/20">
          <h2 className="text-3xl font-bold mb-4">Ready to Supercharge Your Development?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers using TechPartner AI Coder to write better code faster.
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8"
            onClick={() => window.open('/coder-app', '_blank')}
          >
            <Code className="w-5 h-5 mr-2" />
            Start Coding with AI
          </Button>
        </div>

        <Separator className="my-16 bg-slate-700" />

        {/* Footer Note */}
        <div className="text-center text-slate-500 text-sm">
          <p>Powered by Llama 3.1 • Ollama • ChromaDB • FastAPI</p>
          <p className="mt-2">Running locally on TechPartner infrastructure</p>
        </div>
      </div>
    </div>
  );
}
