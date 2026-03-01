import { useState, useEffect } from "react";
import { 
    Users, Shield, Download, MessageSquare, Flame, 
    Snowflake, Target, AlertCircle, TrendingUp, 
    Bot, FileText, BarChart3, Settings
} from "lucide-react";

// Type definitions
interface Lead {
    id: string;
    name: string;
    email: string;
    source: string;
    lead_score: string;
    created_at: string;
    latest_summary?: string;
}

interface CRMStats {
    total: number;
    hot: number;
    warm: number;
    cold: number;
    pending: number;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"overview" | "crm" | "users" | "settings">("overview");
    const [leads, setLeads] = useState<Lead[]>([]);
    const [crmStats, setCrmStats] = useState<CRMStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [autonomousMode, setAutonomousMode] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const ADMIN_TOKEN = "super_secure_admin_token"; // In production, get from auth context

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            
            // Fetch CRM stats
            const statsRes = await fetch("/api/crm/stats", {
                headers: { "x-admin-token": ADMIN_TOKEN }
            });
            
            if (statsRes.ok) {
                const stats = await statsRes.json();
                setCrmStats(stats);
            }

            // Fetch leads
            const leadsRes = await fetch("/api/crm/leads", {
                headers: { "x-admin-token": ADMIN_TOKEN }
            });
            
            if (leadsRes.ok) {
                const leadsData = await leadsRes.json();
                setLeads(leadsData);
            }
        } catch (err) {
            setError("Failed to load dashboard data");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportCSV = async () => {
        try {
            const response = await fetch("/api/crm/export/leads", {
                headers: { "x-admin-token": ADMIN_TOKEN }
            });
            
            if (!response.ok) throw new Error("Export failed");
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `ai_crm_leads_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            alert("Failed to download CSV");
        }
    };

    const renderScoreBadge = (score: string) => {
        switch (score?.toUpperCase()) {
            case "HOT": 
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                        <Flame className="w-3 h-3"/> HOT
                    </span>
                );
            case "WARM": 
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
                        <Target className="w-3 h-3"/> WARM
                    </span>
                );
            case "COLD": 
                return (
                    <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        <Snowflake className="w-3 h-3"/> COLD
                    </span>
                );
            default: 
                return (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                        PENDING
                    </span>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#01A1C1]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#01A1C1] rounded-lg flex items-center justify-center">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">God Mode Command Center</h1>
                        </div>

                        {/* Autonomous Mode Toggle */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                <span className={`text-xs font-medium px-2 py-1 rounded ${!autonomousMode ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
                                    Manual
                                </span>
                                <button
                                    onClick={() => setAutonomousMode(!autonomousMode)}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${
                                        autonomousMode ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                                >
                                    <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                        autonomousMode ? 'translate-x-6' : 'translate-x-0'
                                    }`} />
                                </button>
                                <span className={`text-xs font-medium px-2 py-1 rounded ${autonomousMode ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
                                    Autonomous
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Tabs */}
                <div className="flex gap-1 bg-gray-200 rounded-lg p-1 mb-8 w-fit">
                    <button 
                        onClick={() => setActiveTab("overview")}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition flex items-center gap-2 ${
                            activeTab === "overview" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        <BarChart3 className="w-4 h-4" /> Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab("crm")}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition flex items-center gap-2 ${
                            activeTab === "crm" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        <MessageSquare className="w-4 h-4" /> CRM & Sales
                    </button>
                    <button 
                        onClick={() => setActiveTab("users")}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition flex items-center gap-2 ${
                            activeTab === "users" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        <Users className="w-4 h-4" /> Users
                    </button>
                    <button 
                        onClick={() => setActiveTab("settings")}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition flex items-center gap-2 ${
                            activeTab === "settings" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        <Settings className="w-4 h-4" /> Settings
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                {/* OVERVIEW TAB */}
                {activeTab === "overview" && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
                                    <Users className="w-5 h-5 text-gray-400" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{crmStats?.total || 0}</p>
                                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> AI processed
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">Hot Leads</h3>
                                    <Flame className="w-5 h-5 text-red-500" />
                                </div>
                                <p className="text-3xl font-bold text-red-600">{crmStats?.hot || 0}</p>
                                <p className="text-sm text-gray-500 mt-1">Auto-emails sent</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">Warm Leads</h3>
                                    <Target className="w-5 h-5 text-yellow-500" />
                                </div>
                                <p className="text-3xl font-bold text-yellow-600">{crmStats?.warm || 0}</p>
                                <p className="text-sm text-gray-500 mt-1">Needs nurturing</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-500">Autonomous Actions</h3>
                                    <Bot className="w-5 h-5 text-[#01A1C1]" />
                                </div>
                                <p className="text-3xl font-bold text-[#01A1C1]">{crmStats?.hot || 0}</p>
                                <p className="text-sm text-gray-500 mt-1">Emails sent by AI</p>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900">Recent AI Activity</h3>
                            </div>
                            <div className="p-6">
                                {leads.slice(0, 5).map((lead) => (
                                    <div key={lead.id} className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <MessageSquare className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-gray-900">{lead.name || "Unknown"}</span>
                                                {renderScoreBadge(lead.lead_score)}
                                            </div>
                                            <p className="text-sm text-gray-500">{lead.email}</p>
                                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                {lead.latest_summary || "No summary available"}
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                                {leads.length === 0 && (
                                    <p className="text-center text-gray-500 py-4">
                                        No leads yet. The AI will start capturing them when visitors use the chatbot.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* CRM TAB */}
                {activeTab === "crm" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">AI Lead Pipeline</h2>
                                <p className="text-gray-500 mt-1">
                                    {autonomousMode 
                                        ? "🔥 Autonomous Mode: AI is automatically emailing HOT leads" 
                                        : "👤 Manual Mode: Review leads before taking action"}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={fetchDashboardData}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                                >
                                    Refresh
                                </button>
                                <button 
                                    onClick={handleExportCSV}
                                    className="flex items-center gap-2 bg-[#01A1C1] text-white px-4 py-2 rounded-lg hover:bg-[#0089a4] transition font-medium text-sm"
                                >
                                    <Download className="w-4 h-4" /> Export CSV
                                </button>
                            </div>
                        </div>

                        {/* Leads Table */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                                        <th className="p-4 font-medium text-gray-600">Client / Source</th>
                                        <th className="p-4 font-medium text-gray-600">AI Lead Score</th>
                                        <th className="p-4 font-medium text-gray-600">AI Conversation Summary</th>
                                        <th className="p-4 font-medium text-gray-600">Date Added</th>
                                        <th className="p-4 font-medium text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map((lead) => (
                                        <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="p-4">
                                                <p className="font-bold text-gray-900">{lead.name || "Unknown"}</p>
                                                <p className="text-xs text-gray-500">{lead.email}</p>
                                                <span className="inline-block mt-1 px-2 py-0.5 bg-gray-200 text-gray-700 text-[10px] rounded uppercase tracking-wider">
                                                    {lead.source}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {renderScoreBadge(lead.lead_score)}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600 max-w-md">
                                                <div className="flex items-start gap-2">
                                                    <MessageSquare className="w-4 h-4 text-[#01A1C1] mt-0.5 flex-shrink-0" />
                                                    <p className="line-clamp-2">
                                                        {lead.latest_summary || "Waiting for AI analysis..."}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-500">
                                                {new Date(lead.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <button className="text-[#01A1C1] hover:text-[#0089a4] text-sm font-medium">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {leads.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Bot className="w-12 h-12 text-gray-300" />
                                                    <p>No leads in the pipeline yet.</p>
                                                    <p className="text-sm">The AI will start capturing leads when visitors use the chatbot.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* USERS TAB */}
                {activeTab === "users" && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
                            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">User management interface coming soon.</p>
                        </div>
                    </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === "settings" && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
                        
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                                <div>
                                    <h3 className="font-medium text-gray-900">Autonomous Mode</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Allow AI to automatically send emails to HOT leads without approval
                                    </p>
                                </div>
                                <button
                                    onClick={() => setAutonomousMode(!autonomousMode)}
                                    className={`relative w-14 h-7 rounded-full transition-colors ${
                                        autonomousMode ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                                >
                                    <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                                        autonomousMode ? 'translate-x-7' : 'translate-x-0'
                                    }`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                                <div>
                                    <h3 className="font-medium text-gray-900">AI Model</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Currently using: Qwen 2.5 7B (Local)
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                    Active
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-gray-900">Content Director</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Auto-generate SEO content weekly (Wednesdays at 4:00 AM)
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                                    Scheduled
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
