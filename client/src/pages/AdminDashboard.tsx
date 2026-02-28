import { useState, useEffect } from "react";
import { Activity, Link as LinkIcon, Edit3, Play, CheckCircle, Users, Eye, BarChart2, Search, Shield } from "lucide-react";

interface SEOStats {
  totalProspects: number;
  pendingDrafts: number;
  systemStatus: string;
  lastRun: string;
}

interface TrafficData {
  activeUsers: string;
  pageViews: string;
  sessions: string;
}

interface QueueItem {
  id: number;
  url: string;
  reason: string;
  draft_email: string;
  created_at: string;
}

interface KeywordData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: string;
  position: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<SEOStats>({ 
    totalProspects: 0, 
    pendingDrafts: 0, 
    systemStatus: "Loading...", 
    lastRun: "" 
  });
  const [traffic, setTraffic] = useState<TrafficData>({ 
    activeUsers: "0", 
    pageViews: "0", 
    sessions: "0" 
  });
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [loadingAction, setLoadingAction] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || "";

  useEffect(() => {
    if (isAuthenticated) {
      const headers = { "x-admin-token": adminToken };
      
      fetch("/api/admin/seo/stats", { headers })
        .then(res => res.json())
        .then((data: SEOStats) => setStats(data))
        .catch(err => console.error("Stats error:", err));
        
      fetch("/api/admin/seo/queue", { headers })
        .then(res => res.json())
        .then((data: QueueItem[]) => setQueue(data))
        .catch(err => console.error("Queue error:", err));

      fetch("/api/admin/seo/traffic", { headers })
        .then(res => res.json())
        .then((data: TrafficData | { error: string }) => {
          if (!('error' in data)) setTraffic(data as TrafficData);
        })
        .catch(err => console.error("Traffic error:", err));

      fetch("/api/admin/seo/search-console", { headers })
        .then(res => res.json())
        .then((data: KeywordData[] | { error: string }) => {
          if (!('error' in data)) setKeywords(data as KeywordData[]);
        })
        .catch(err => console.error("GSC error:", err));
    }
  }, [isAuthenticated, adminToken]);

  const handleAuthenticate = () => {
    if (adminToken === ADMIN_SECRET) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid admin token");
    }
  };

  const handleTriggerJob = async (jobName: string) => {
    setLoadingAction(jobName);
    const headers = { "x-admin-token": adminToken };
    
    try {
      const res = await fetch(`/api/admin/seo/trigger/${jobName}`, { 
        method: "POST",
        headers 
      });
      const data = await res.json();
      alert(data.message || "Job triggered!");
    } catch (e) {
      alert("Failed to trigger job.");
    }
    setLoadingAction("");
  };

  const handleApproveAndSend = async (id: number, url: string) => {
    const targetEmail = prompt(`Enter the contact email for ${url}:`);
    if (!targetEmail) return;

    const headers = { 
      "Content-Type": "application/json",
      "x-admin-token": adminToken 
    };

    try {
      const res = await fetch(`/api/admin/seo/approve/${id}`, {
        method: "POST",
        headers,
        body: JSON.stringify({ targetEmail })
      });

      const data = await res.json();
      
      if (res.ok) {
        alert("Pitch sent successfully!");
        setQueue(prev => prev.filter(item => item.id !== id));
      } else {
        alert(data.error || "Failed to send");
      }
    } catch (e) {
      alert("Network error.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-[#01A1C1]" />
            <h1 className="text-2xl font-bold text-gray-900">SEO Command Center</h1>
          </div>
          <p className="text-gray-600 mb-4">Enter your admin secret to access the dashboard.</p>
          <input
            type="password"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder="Admin Secret"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#01A1C1]"
          />
          <button
            onClick={handleAuthenticate}
            className="w-full bg-[#01A1C1] text-white py-3 rounded-lg hover:bg-[#0089a4] transition font-medium"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO Command Center</h1>
          <p className="text-sm text-gray-500 mt-1">Last updated: {new Date(stats.lastRun).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
          <Activity className="w-4 h-4" /> System: {stats.systemStatus}
        </div>
      </div>

      {/* --- GA4 TRAFFIC CARDS --- */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">Traffic Overview (Last 30 Days)</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <Users className="w-5 h-5 text-blue-500" /> Active Users
          </div>
          <span className="text-4xl font-bold text-gray-900">{traffic.activeUsers}</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col border-l-4 border-l-indigo-500">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <Eye className="w-5 h-5 text-indigo-500" /> Page Views
          </div>
          <span className="text-4xl font-bold text-gray-900">{traffic.pageViews}</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <BarChart2 className="w-5 h-5 text-emerald-500" /> Total Sessions
          </div>
          <span className="text-4xl font-bold text-gray-900">{traffic.sessions}</span>
        </div>
      </div>

      {/* --- SEO KPI CARDS --- */}
      <h2 className="text-xl font-bold mb-4 text-gray-800">SEO Engine Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <LinkIcon className="w-5 h-5" /> Qualified Prospects
          </div>
          <span className="text-4xl font-bold text-[#01A1C1]">{stats.totalProspects}</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 text-gray-500 mb-2">
            <Edit3 className="w-5 h-5" /> Pending Drafts
          </div>
          <span className="text-4xl font-bold text-[#01A1C1]">{stats.pendingDrafts}</span>
        </div>
      </div>

      {/* --- CONTROL DECK --- */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Manual Overrides</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => handleTriggerJob("scout")}
            disabled={loadingAction !== ""}
            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
          >
            <Play className="w-4 h-4" /> 
            {loadingAction === "scout" ? "Running..." : "Run Scout Crawler"}
          </button>
          <button 
            onClick={() => handleTriggerJob("build-pseo")}
            disabled={loadingAction !== ""}
            className="flex items-center gap-2 bg-[#01A1C1] text-white px-4 py-2 rounded-lg hover:bg-[#0089a4] transition disabled:opacity-50"
          >
            <Play className="w-4 h-4" /> 
            {loadingAction === "build-pseo" ? "Building..." : "Rebuild Astro pSEO"}
          </button>
          <button 
            onClick={() => handleTriggerJob("syndicate")}
            disabled={loadingAction !== ""}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            <Play className="w-4 h-4" /> 
            {loadingAction === "syndicate" ? "Publishing..." : "Syndicate Content"}
          </button>
          <button 
            onClick={() => handleTriggerJob("generate-images")}
            disabled={loadingAction !== ""}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
          >
            <Play className="w-4 h-4" /> 
            {loadingAction === "generate-images" ? "Generating..." : "Generate AI Images"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- APPROVAL QUEUE --- */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">AI Draft Queue (Needs Review)</h2>
            <p className="text-sm text-gray-500">Outreach emails drafted by Qwen overnight.</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                  <th className="p-4 font-medium text-gray-600">Target URL</th>
                  <th className="p-4 font-medium text-gray-600">AI Reasoning</th>
                  <th className="p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-sm text-blue-600 truncate max-w-[200px]">
                      <a href={row.url} target="_blank" rel="noreferrer" className="hover:underline">
                        {row.url}
                      </a>
                    </td>
                    <td className="p-4 text-sm text-gray-600 max-w-[200px] truncate" title={row.reason}>
                      {row.reason}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleApproveAndSend(row.id, row.url)}
                        className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800 font-medium transition"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve & Send
                      </button>
                    </td>
                  </tr>
                ))}
                {queue.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500">
                      No pending drafts in queue. Run the scout to find new prospects!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- GSC TOP KEYWORDS --- */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Top Search Queries</h2>
              <p className="text-sm text-gray-500">Live 30-day data from Google Search Console.</p>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white">
                <tr className="bg-gray-50 border-b border-gray-200 text-sm">
                  <th className="p-4 font-medium text-gray-600">Keyword</th>
                  <th className="p-4 font-medium text-gray-600">Clicks</th>
                  <th className="p-4 font-medium text-gray-600">Impr.</th>
                  <th className="p-4 font-medium text-gray-600">Pos.</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((kw, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-sm font-medium text-gray-900 max-w-[200px] truncate" title={kw.query}>
                      {kw.query}
                    </td>
                    <td className="p-4 text-sm text-green-600 font-semibold">{kw.clicks}</td>
                    <td className="p-4 text-sm text-gray-600">{kw.impressions}</td>
                    <td className="p-4 text-sm text-blue-600">#{kw.position}</td>
                  </tr>
                ))}
                {keywords.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      No keyword data found. Check your GSC configuration.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
