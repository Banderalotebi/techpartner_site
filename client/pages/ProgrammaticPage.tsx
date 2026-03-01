import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2 } from "lucide-react";

interface ProgrammaticPageData {
    id: number;
    slug: string;
    targetKeyword: string;
    city: string;
    industry: string;
    h1Title: string;
    aiGeneratedContent: string;
    jsonLdSchema: object;
    createdAt: string;
}

export default function ProgrammaticPage() {
    const { slug } = useParams();
    const [, setLocation] = useLocation();
    const [page, setPage] = useState<ProgrammaticPageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/p/${slug}`)
            .then(res => {
                if (!res.ok) {
                    if (res.status === 404) {
                        throw new Error("Page not found");
                    }
                    throw new Error("Server error");
                }
                return res.json();
            })
            .then((data: ProgrammaticPageData) => {
                setPage(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching page:", err);
                setError(err.message);
                setLoading(false);
                if (err.message === "Page not found") {
                    setTimeout(() => setLocation("/404"), 100);
                }
            });
    }, [slug, setLocation]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-[#01A1C1]" />
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
                    <p className="text-gray-600">The page you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    // Inject SEO meta tags and JSON-LD schema
    useEffect(() => {
        // Update document title
        document.title = `${page.h1Title} | TechPartner`;
        
        // Helper to create or update meta tags
        const setMetaTag = (name: string, content: string, property = false) => {
            const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
            let meta = document.querySelector(selector) as HTMLMetaElement;
            if (!meta) {
                meta = document.createElement('meta');
                if (property) meta.setAttribute('property', name);
                else meta.setAttribute('name', name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };
        
        // Set meta tags
        setMetaTag('description', `Expert ${page.targetKeyword} services in ${page.city} for the ${page.industry} industry. Professional solutions by TechPartner.`);
        setMetaTag('keywords', `${page.targetKeyword}, ${page.industry}, ${page.city}, Saudi Arabia, tech solutions`);
        setMetaTag('og:title', `${page.h1Title} | TechPartner`, true);
        setMetaTag('og:description', `Expert ${page.targetKeyword} services in ${page.city} for the ${page.industry} industry.`, true);
        setMetaTag('og:url', `https://techpartner.sa/p/${page.slug}`, true);
        setMetaTag('og:type', 'article', true);
        
        // Set canonical link
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', `https://techpartner.sa/p/${page.slug}`);
        
        // Inject JSON-LD schema
        let script = document.getElementById('jsonld-schema') as HTMLScriptElement;
        if (!script) {
            script = document.createElement('script');
            script.id = 'jsonld-schema';
            script.setAttribute('type', 'application/ld+json');
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(page.jsonLdSchema);
        
        // Cleanup on unmount
        return () => {
            document.title = 'TechPartner';
        };
    }, [page]);

    return (
        <div className="min-h-screen bg-white">

            {/* Header */}
            <header className="bg-[#01A1C1] text-white py-4">
                <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
                    <a href="/" className="text-xl font-bold">TechPartner</a>
                    <nav className="hidden md:flex gap-6">
                        <a href="/" className="hover:text-white/80 transition">Home</a>
                        <a href="/about" className="hover:text-white/80 transition">About</a>
                        <a href="/contact" className="hover:text-white/80 transition">Contact</a>
                    </nav>
                </div>
            </header>

            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b">
                <div className="max-w-4xl mx-auto px-4 py-3">
                    <nav className="text-sm text-gray-600">
                        <a href="/" className="hover:text-[#01A1C1]">Home</a>
                        <span className="mx-2">/</span>
                        <span className="text-gray-800">{page.h1Title}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-12">
                <article className="prose prose-lg prose-slate max-w-none 
                    prose-headings:text-[#01A1C1] 
                    prose-a:text-blue-600 hover:prose-a:text-blue-800
                    prose-strong:text-gray-900
                    prose-li:marker:text-[#01A1C1]">
                    
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {page.aiGeneratedContent}
                    </ReactMarkdown>
                </article>

                {/* CTA Section */}
                <div className="mt-12 p-8 bg-gradient-to-r from-[#01A1C1]/10 to-blue-50 rounded-2xl border border-[#01A1C1]/20">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Ready to Transform Your {page.industry} Business in {page.city}?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Get a free consultation and discover how our {page.targetKeyword} solutions can drive growth for your business.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a 
                            href="/contact" 
                            className="inline-flex items-center justify-center px-6 py-3 bg-[#01A1C1] text-white font-semibold rounded-lg hover:bg-[#0189a8] transition">
                            Get Free Consultation
                        </a>
                        <a 
                            href="tel:+966500000000" 
                            className="inline-flex items-center justify-center px-6 py-3 border-2 border-[#01A1C1] text-[#01A1C1] font-semibold rounded-lg hover:bg-[#01A1C1]/5 transition">
                            Call Now
                        </a>
                    </div>
                </div>

                {/* Local Context */}
                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">
                        Serving the {page.industry} industry in {page.city}, Saudi Arabia. 
                        Published: {new Date(page.createdAt).toLocaleDateString('en-SA')}
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-gray-400">
                        © {new Date().getFullYear()} TechPartner. All rights reserved.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        Professional {page.targetKeyword} services in {page.city}
                    </p>
                </div>
            </footer>
        </div>
    );
}
