import Link from "next/link";
import { Shield, Lock, Activity, Dna, Database, ChevronRight, Hexagon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-brand-cyan selection:text-brand-dark">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-brand-card-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-wider text-white">
            <Hexagon className="h-8 w-8 text-brand-cyan fill-brand-cyan/20" />
            <span>BIOVAULT</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#" className="text-gray-400 hover:text-brand-cyan transition-colors">Network</Link>
            <Link href="#" className="text-gray-400 hover:text-brand-cyan transition-colors">Ecosystem</Link>
            <Link href="#" className="text-gray-400 hover:text-brand-cyan transition-colors">Docs</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="rounded-full bg-brand-cyan px-6 py-2.5 text-sm font-bold text-brand-dark hover:bg-brand-cyan-hover transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              Connect Wallet
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1 text-xs font-medium text-brand-cyan mb-8">
                  SECURE DATA PROTOCOL V2.4
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-6 leading-[1.1]">
                  Your Biology.<br />
                  <span className="text-brand-cyan">Your Bunker.</span><br />
                  Your Benefit.
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-gray-400 max-w-lg">
                  Privacy-preserving medical data marketplace powered by <strong className="text-white">iExec Confidential Computing</strong>. 
                  Secure your genome, health records, and clinical data while earning rewards.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <button className="rounded bg-brand-cyan px-8 py-3.5 text-sm font-bold text-brand-dark shadow-lg shadow-brand-cyan/20 hover:bg-brand-cyan-hover hover:scale-105 transition-all">
                    Start Earning
                  </button>
                  <button className="rounded border border-brand-card-border px-8 py-3.5 text-sm font-bold text-white hover:bg-brand-card hover:border-brand-cyan/50 transition-all">
                    Learn More
                  </button>
                </div>
              </div>
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative h-[500px] w-[500px] rounded-2xl border border-brand-card-border bg-brand-card/50 backdrop-blur-sm p-4 flex items-center justify-center shadow-2xl shadow-brand-cyan/5">
                  <div className="absolute inset-0 bg-gradient-to-tr from-brand-cyan/5 via-transparent to-transparent rounded-2xl" />
                  {/* Abstract DNA Representation */}
                  <div className="relative animate-pulse">
                     <Dna className="h-64 w-64 text-brand-cyan/80 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]" />
                  </div>
                  {/* Decorative Circles */}
                  <div className="absolute inset-0 rounded-full border border-brand-cyan/10 scale-75" />
                  <div className="absolute inset-0 rounded-full border border-brand-cyan/5 scale-90" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* User Type Cards */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Patient Card */}
              <div className="group relative overflow-hidden rounded-2xl border border-brand-card-border bg-brand-card p-10 transition-all hover:border-brand-cyan/30">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-cyan/10 text-brand-cyan">
                  <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">For Patients</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Contribute your medical history to global research without compromising your identity. Own your data, always.
                </p>
                <button className="w-full rounded bg-brand-cyan py-3 text-sm font-bold text-brand-dark hover:bg-brand-cyan-hover transition-colors">
                  Start Earning
                </button>
              </div>

              {/* Researcher Card */}
              <div className="group relative overflow-hidden rounded-2xl border border-brand-card-border bg-brand-card p-10 transition-all hover:border-brand-cyan/30">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 text-white">
                  <Database className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">For Researchers</h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Access high-quality, verified medical datasets via decentralized TEEs. Perform analysis without data leakage.
                </p>
                <button className="w-full rounded border border-brand-card-border bg-transparent py-3 text-sm font-bold text-white hover:bg-white/5 hover:border-white/20 transition-colors">
                  Explore Data
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-4xl font-bold text-white mb-6">How it Works</h2>
              <p className="text-gray-400">
                Our protocol leverages Trusted Execution Environments (TEE) and iExec's tech stack to ensure data privacy at rest, in transit, and in use.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  id: "01",
                  title: "Encrypt",
                  desc: "Your data is encrypted locally using iExec Confidential Computing. You retain the cryptographic keys to your biological vault.",
                  icon: Lock
                },
                {
                  id: "02",
                  title: "Scan",
                  desc: "AI models scan your anonymized data within secure enclaves. Insights are extracted without researchers ever seeing raw data.",
                  icon: Shield
                },
                {
                  id: "03",
                  title: "Earn",
                  desc: "Receive instant payouts in tokens for every research contribution. High-quality data yields higher reputation scores and rewards.",
                  icon: Activity
                }
              ].map((step) => (
                <div key={step.id} className="relative rounded-2xl border border-brand-card-border bg-brand-card p-8 hover:bg-brand-card/80 transition-colors group">
                  <div className="absolute top-4 right-6 text-6xl font-bold text-white/5 select-none group-hover:text-brand-cyan/5 transition-colors">
                    {step.id}
                  </div>
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-cyan/10 text-brand-cyan">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-card-border bg-brand-dark py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 font-bold text-xl tracking-wider text-white mb-6">
                <Hexagon className="h-6 w-6 text-brand-cyan" />
                <span>BIOVAULT</span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs">
                The decentralized bunker for your biological identity. Powered by iExec V8 Engine.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-cyan mb-4">Ecosystem</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">iExec Network</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Developer Portal</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-cyan mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Ethics Board</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-brand-card-border pt-8 sm:flex-row">
            <p className="text-xs text-gray-600">SYSTEM STATUS: ALL_ENCLAVES_OPERATIONAL</p>
            <p className="text-xs text-gray-600">© 2024 BioVault Protocol. Secure. Private. Sovereign.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
