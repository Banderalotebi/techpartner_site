import { useState, useEffect } from "react";
import axios from 'axios';

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

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"overview" | "crm" | "users" | "settings">("overview");
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            
            // Fetch CRM stats
            const statsRes = await axios.get("/api/crm/stats");
            
            if (statsRes.ok) {
                const stats = await statsRes.json();
            }

            // Fetch leads
            const leadsRes = await axios.get("/api/crm/leads");
            
            if (leadsRes.ok) {
                const leadsData = await leadsRes.json();
                setLeads(leadsData);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // ... rest of the code remains the same ...
}
