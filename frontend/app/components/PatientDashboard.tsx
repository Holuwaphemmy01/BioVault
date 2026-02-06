"use client";

import { useState } from "react";
import { IExecDataProtector } from "@iexec/dataprotector";
import { Shield, Upload, FileJson, Activity, Lock, Wallet, FileText, CheckCircle, Database } from "lucide-react";

interface PatientDashboardProps {
  provider: any; // Using any for the provider to support both Web3Auth and standard EIP-1193 providers
}

interface VaultItem {
  id: string;
  name: string;
  type: string;
  date: string;
  secured: boolean;
  monetized: boolean;
}

export default function PatientDashboard({ provider }: PatientDashboardProps) {
  const [activeVaults, setActiveVaults] = useState<VaultItem[]>([
    { id: "1", name: "Full Genomic Sequence", type: "Genomic", date: "2h ago", secured: true, monetized: true },
    { id: "2", name: "Cardiovascular History", type: "FHIR", date: "Yesterday", secured: true, monetized: false },
    { id: "3", name: "Sleep Biometrics (Oura)", type: "JSON", date: "3 days ago", secured: true, monetized: true },
  ]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadStatus("Initializing Secure Enclave...");

      // Initialize iExec DataProtector
      const dataProtector = new IExecDataProtector(provider);

      setUploadStatus("Encrypting Data...");
      
      // Protect the data
      // Note: We are wrapping the file content in a buffer to ensure compatibility
      const fileBuffer = await file.arrayBuffer();
      const protectedData = await dataProtector.core.protectData({
        data: {
          file: new Uint8Array(fileBuffer), 
        },
        name: file.name,
      });

      console.log("Protected Data Address:", protectedData.address);
      setUploadStatus("Success! Data Vaulted.");

      // Add to UI
      const newItem: VaultItem = {
        id: protectedData.address,
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || "FILE",
        date: "Just now",
        secured: true,
        monetized: false
      };

      setActiveVaults([newItem, ...activeVaults]);

    } catch (error) {
      console.error("Encryption failed:", error);
      setUploadStatus("Encryption Failed. Check Console.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(""), 3000);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-cyan-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 text-cyan-400">
          <Shield className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold tracking-wider">BIOVAULT</h1>
            <p className="text-[10px] text-cyan-400/60 tracking-widest">V2.0.42-TEE</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { name: "My Vault", icon: Database, active: true },
            { name: "Earnings History", icon: Wallet, active: false },
            { name: "Research Invites", icon: FileText, active: false, dot: true },
            { name: "Security Settings", icon: Lock, active: false },
          ].map((item) => (
            <button
              key={item.name}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                item.active 
                  ? "bg-cyan-950/30 text-cyan-400 border-l-2 border-cyan-400" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
              {item.dot && <div className="ml-auto h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />}
            </button>
          ))}
        </nav>
        
        <div className="mt-auto flex items-center gap-3 px-4 py-3 border-t border-zinc-800">
           <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
             <span className="text-xs font-bold text-zinc-400">#42</span>
           </div>
           <div className="flex flex-col">
             <span className="text-sm font-bold text-zinc-200">Citizen #042</span>
             <span className="text-[10px] text-cyan-500">Biometric Auth Active</span>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="mb-12">
          <div className="text-xs font-bold text-cyan-400 tracking-widest mb-2 uppercase">
            Network Status: Optimized
          </div>
          <h2 className="text-5xl font-bold text-white mb-4">
            Welcome back, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
              Citizen #042
            </span>
          </h2>
          <p className="text-zinc-400 max-w-2xl text-sm leading-relaxed">
            Your medical data is encrypted within a Trusted Execution Environment (TEE). 
            Monetize your genomic profile while maintaining 100% sovereignty.
          </p>
        </header>

        {/* Top Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
           {/* Privacy Score */}
           <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex items-center justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <CheckCircle className="h-24 w-24" />
              </div>
              <div className="z-10">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-[10px] font-bold text-green-500 tracking-widest uppercase">Permissions Granted to iExec TEE</span>
                </div>
                <div className="text-4xl font-bold text-white mb-1">100%</div>
                <div className="text-xs text-cyan-400 font-medium tracking-wider">GLOBAL PRIVACY SCORE</div>
              </div>
           </div>

           {/* Balance */}
           <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex flex-col justify-center relative overflow-hidden">
              <div className="text-4xl font-bold text-white mb-1">1,240.50 <span className="text-lg text-zinc-500">RLC</span></div>
              <div className="text-xs text-zinc-500 mb-4">≈ $3,452.12 USD</div>
              <button className="bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold py-2 px-4 rounded transition-colors w-fit">
                WITHDRAW FUNDS
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active Vaults List */}
            <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                        <Database className="h-5 w-5 text-cyan-400" />
                        ACTIVE VAULTS
                    </h3>
                    <span className="text-xs text-zinc-500 font-medium">{activeVaults.length} DATASETS SECURED</span>
                </div>

                <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        <div className="col-span-5">Dataset</div>
                        <div className="col-span-3 text-center">Security</div>
                        <div className="col-span-2 text-center">Monetize</div>
                        <div className="col-span-2 text-right">Action</div>
                    </div>
                    
                    {activeVaults.map((vault) => (
                        <div key={vault.id} className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800/50 items-center hover:bg-zinc-900/50 transition-colors group">
                            <div className="col-span-5">
                                <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">{vault.name}</div>
                                <div className="text-xs text-zinc-500">{vault.type} • {vault.date}</div>
                            </div>
                            <div className="col-span-3 flex justify-center">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-500 border border-green-500/20">
                                    <Lock className="h-3 w-3" />
                                    PROTECTED
                                </span>
                            </div>
                            <div className="col-span-2 flex justify-center">
                                <div className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${vault.monetized ? 'bg-cyan-500' : 'bg-zinc-700'}`}>
                                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${vault.monetized ? 'left-4.5' : 'left-0.5'}`} />
                                </div>
                            </div>
                            <div className="col-span-2 text-right">
                                <button className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                                    DETAILS →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Secure Ingest Card */}
            <div className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-6">
                     <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                        <Upload className="h-5 w-5 text-cyan-400" />
                        SECURE INGEST
                    </h3>
                </div>

                <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
                    
                    <div className="flex justify-center mb-6">
                        <div className={`h-16 w-16 rounded-full flex items-center justify-center border transition-all duration-500 ${isUploading ? 'bg-cyan-500/20 border-cyan-400 animate-pulse' : 'bg-zinc-800 border-zinc-700'}`}>
                            <Shield className={`h-8 w-8 ${isUploading ? 'text-cyan-400' : 'text-zinc-500'}`} />
                        </div>
                    </div>

                    <h4 className="text-center font-bold text-white mb-2">HOLOGRAPHIC SHIELD UPLINK</h4>
                    <p className="text-center text-xs text-zinc-500 mb-8 leading-relaxed">
                        Drag and drop medical records to initiate secure enclave processing.
                    </p>

                    <div className="flex justify-center gap-2 mb-8">
                        {['FHIR', 'JSON', 'PDF'].map(ext => (
                            <span key={ext} className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-zinc-400">
                                {ext}
                            </span>
                        ))}
                    </div>

                    <div className="relative">
                        <input 
                            type="file" 
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <button className={`w-full py-3 rounded border text-xs font-bold tracking-widest transition-all ${
                            isUploading 
                            ? "bg-cyan-500/10 border-cyan-500 text-cyan-400"
                            : "bg-transparent border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
                        }`}>
                            {uploadStatus || "BROWSE LOCAL STORAGE"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
