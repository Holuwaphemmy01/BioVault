"use client";

import { useState, useEffect } from "react";
import { getProtectedData } from "../services/api";
import { Shield, Database, FileText, Search } from "lucide-react";

interface ResearcherDashboardProps {
  token: string;
}

interface ProtectedDataItem {
  id: string;
  name: string;
  owner: string;
}

export default function ResearcherDashboard({ token }: ResearcherDashboardProps) {
  const [protectedData, setProtectedData] = useState<ProtectedDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProtectedData(token);
        if (data) {
          setProtectedData(data);
        } else {
          setError("Could not fetch protected data.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 text-blue-400">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold tracking-wider">BIOVAULT</h1>
            <p className="text-[10px] text-blue-400/60 tracking-widest">RESEARCHER PORTAL</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { name: "Available Data", icon: Database, active: true },
            { name: "My Queries", icon: Search, active: false },
            { name: "Data Access History", icon: FileText, active: false },
          ].map((item) => (
            <button
              key={item.name}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                item.active 
                  ? "bg-blue-950/30 text-blue-400 border-l-2 border-blue-400" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">Researcher Dashboard</h2>
          <p className="text-zinc-400 max-w-2xl">
            Access and query anonymized, TEE-protected health data from the BioVault network.
          </p>
        </header>

        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
            <Database className="h-5 w-5 text-blue-400" />
            Available Protected Datasets
          </h3>

          {isLoading && <p className="text-zinc-400">Loading data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          
          {!isLoading && !error && (
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <div className="col-span-6">Dataset Name</div>
                <div className="col-span-4">Data Owner (Anonymized)</div>
                <div className="col-span-2 text-right">Action</div>
              </div>
              
              {protectedData.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800/50 items-center hover:bg-zinc-900/50">
                  <div className="col-span-6 font-medium text-white">{item.name}</div>
                  <div className="col-span-4 text-zinc-400">{item.owner}</div>
                  <div className="col-span-2 text-right">
                    <button className="text-xs font-bold text-blue-400 hover:text-blue-300">
                      QUERY →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
