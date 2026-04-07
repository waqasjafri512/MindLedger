'use client';

import Link from "next/link";
import { Sparkles, Brain, History, Target, ShieldAlert, Zap, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-foreground selection:bg-gold/20 selection:text-gold-dk">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-white/80 backdrop-blur-xl border-b border-border/50">
        <div className="font-serif text-2xl text-foreground tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-gold rounded flex items-center justify-center text-white font-bold text-lg shadow-[0_4px_10px_rgba(197,160,57,0.2)]">M</div>
          MindLedger
        </div>
        <div className="flex items-center gap-4 md:gap-10">
          <Link href="#pricing" className="text-muted-foreground text-xs uppercase tracking-widest hover:text-gold transition-colors font-bold hidden md:block">Pricing</Link>
          <Link href="/login" className="text-muted-foreground text-xs uppercase tracking-widest hover:text-gold transition-colors font-bold">Login</Link>
          <Link href="/signup" className="bg-gold hover:bg-gold-dk text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all active:scale-95 shadow-[0_4px_15px_rgba(197,160,57,0.2)] tracking-widest uppercase">
            Get Started
          </Link>
        </div>
      </nav>

      <main>
        {/* HERO */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-16 overflow-hidden bg-bg-2">
          {/* Ambient Background Glow */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gold/10 blur-[120px] pointer-events-none rounded-full" />

          {/* <div className="inline-flex items-center gap-2 bg-white border border-border rounded-full px-4 py-1.5 text-[0.7rem] text-gold tracking-[0.2em] mb-10 animate-fade-in-up font-bold shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            ELITE COGNITIVE LAYER
          </div> */}

          <h1 className="font-serif text-5xl md:text-8xl font-medium leading-[1.05] tracking-tight mb-8 animate-fade-in-up [animation-delay:100ms] text-foreground">
            Track <em className="italic text-gold not-italic">why</em> you<br />
            decide, not just what.
          </h1>

          <p className="max-w-[600px] text-lg md:text-xl text-muted-foreground font-medium leading-relaxed mb-12 animate-fade-in-up [animation-delay:200ms]">
            MindLedger captures your <strong className="text-foreground">reasoning architecture</strong> in real-time, mapping the cognitive blindspots that generic habit trackers ignore.
          </p>

          <div className="flex flex-col md:flex-row gap-4 w-full max-w-[480px] animate-fade-in-up [animation-delay:300ms]">
            <Link href="/signup" className="flex-1">
              <button className="w-full bg-gold hover:bg-gold-dk text-white font-bold px-8 py-4 rounded-2xl transition-all active:scale-95 whitespace-nowrap shadow-[0_10px_30px_rgba(197,160,57,0.2)] text-lg">
                Build Your Ledger →
              </button>
            </Link>
            <Link href="/login" className="flex-1">
              <button className="w-full bg-white border border-border text-foreground font-bold px-8 py-4 rounded-2xl transition-all hover:bg-bg-2 active:scale-95 text-lg shadow-sm">
                Log In
              </button>
            </Link>
          </div>

          <p className="text-[0.7rem] text-muted-foreground/60 mt-8 animate-fade-in-up [animation-delay:400ms] uppercase tracking-[0.3em] font-bold">
            100% Private · Zero Tracking · Pure Intelligence
          </p>
        </section>

        {/* FEATURES GRID */}
        <section className="py-24 md:py-40 px-6 bg-white border-y border-border/30">
          <div className="max-w-[1100px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-6">
                <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold shadow-sm">
                  <ShieldAlert size={24} />
                </div>
                <h3 className="text-2xl font-serif text-foreground">Bias Detection</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">Grok-3 analyzes your reasoning in real-time to identify overconfidence, sunk cost, and emotional noise before you commit.</p>
              </div>
              <div className="space-y-6">
                <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold shadow-sm">
                  <History size={24} />
                </div>
                <h3 className="text-2xl font-serif text-foreground">The Reckoning</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">Closing the feedback loop. Review your original logic against outcomes to neutralize the distortion of hindsight bias.</p>
              </div>
              <div className="space-y-6">
                <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold shadow-sm">
                  <Target size={24} />
                </div>
                <h3 className="text-2xl font-serif text-foreground">Cognitive DNA</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">Aggregate your entire history into a single profile. Discover your recurring patterns across finance, career, and health.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="bg-bg-2 py-24 md:py-32 px-6 overflow-hidden">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-gold/5 blur-[80px] rounded-full pointer-events-none" />
              <p className="text-[0.7rem] tracking-[0.3em] text-gold uppercase mb-6 font-bold">The Intellectual Cost</p>
              <h2 className="font-serif text-4xl md:text-6xl font-medium leading-tight mb-8 text-foreground">
                You repeat mistakes because you <em className="text-gold italic not-italic">forget</em> why you made them.
              </h2>
              <p className="text-muted-foreground font-medium text-lg leading-relaxed mb-10">
                Generic trackers log outcomes. MindLedger logs the <strong className="text-foreground">Internal Variable</strong>. We show you the mirror your brain refuses to hold.
              </p>
              <Link href="/signup">
                <button className="flex items-center gap-2 text-gold font-bold hover:gap-4 transition-all">
                  START YOUR AUDIT <ArrowRight size={18} />
                </button>
              </Link>
            </div>

            <div className="bg-white border border-border p-8 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.03)] space-y-6">
              {[
                { t: "Hindsight Distortion", d: "Your brain rewrites your past reasoning to fit the current outcome." },
                { t: "Pattern Blindness", d: "You have 3 specific cognitive leakages. You just haven't seen the data yet." },
                { t: "Confidence Mismatch", d: "You are consistentally 40% more confident than your historical accuracy justifies." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-bg-2 rounded-2xl border border-border/50">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold font-bold text-xs shrink-0">{i+1}</div>
                  <div>
                    <h4 className="font-serif text-lg text-foreground mb-1">{item.t}</h4>
                    <p className="text-sm text-muted-foreground font-medium">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-24 md:py-40 px-6 bg-white border-t border-border/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/5 blur-[126px] pointer-events-none rounded-full" />
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-serif text-4xl md:text-6xl text-foreground">Intelligence Tiers</h2>
              <p className="text-muted-foreground font-medium italic">Scale your cognitive capacity as your decision volume grows.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  t: "Free", 
                  p: "$0", 
                  d: "Basic cognitive logging.", 
                  f: ["5 Total Ledger Entries", "Standard Hindsight", "Basic DNA Mapping"],
                  b: "Start Archiving"
                },
                { 
                  t: "Pro", 
                  p: "$19", 
                  d: "Unlimited archival storage.", 
                  f: ["Unlimited Entries", "AI Reasoning Synthesis", "Bias Vulnerability Reports", "Priority Support"],
                  b: "Upgrade to Pro",
                  popular: true
                },
                { 
                  t: "Team", 
                  p: "$49", 
                  d: "Collective intelligence.", 
                  f: ["Shared Case Files", "Risk Analysis console", "Dedicated Support", "Unlimited Entries"],
                  b: "Contact Sales"
                }
              ].map((tier, i) => (
                <div key={i} className={`p-8 rounded-3xl border transition-all ${tier.popular ? 'border-gold shadow-[0_20px_50px_rgba(197,160,57,0.1)] bg-white scale-105 relative z-10' : 'border-border bg-bg-2'}`}>
                  {tier.popular && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold text-white text-[10px] uppercase tracking-[0.3em] font-bold px-4 py-1.5 rounded-full">Recommended</span>}
                  <h4 className="font-serif text-2xl mb-4 text-foreground">{tier.t}</h4>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-serif text-foreground">{tier.p}</span>
                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-widest">/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-8 italic font-medium">{tier.d}</p>
                  <ul className="space-y-4 mb-8">
                    {tier.f.map((feat, fi) => (
                      <li key={fi} className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold" /> {feat}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup">
                    <button className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${tier.popular ? 'bg-gold text-white hover:bg-gold-dk shadow-lg' : 'bg-white border border-border text-foreground hover:bg-bg-2'}`}>
                      {tier.b}
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-40 px-6 text-center relative overflow-hidden bg-white">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold/10 blur-[100px] pointer-events-none rounded-full" />
            <h2 className="font-serif text-5xl md:text-7xl font-medium mb-8 mx-auto max-w-[700px] text-foreground tracking-tight">Stop guessing. <br /><span className="text-gold">Start knowing.</span></h2>
            <p className="text-muted-foreground text-xl font-medium mb-12 mx-auto max-w-[600px] leading-relaxed">Join elite thinkers building a clearer mirror for their own minds.</p>
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-[440px] mx-auto">
                <Link href="/signup" className="w-full">
                  <button className="w-full bg-gold hover:bg-gold-dk text-white font-bold px-10 py-5 rounded-2xl transition-all active:scale-95 shadow-[0_10px_40px_rgba(197,160,57,0.2)] text-xl border-none">
                    Start Your Ledger Free
                  </button>
                </Link>
            </div>
            <p className="mt-12 text-[10px] text-muted-foreground/40 uppercase tracking-[0.4em] font-bold">Encrypted · Anonymous · Private</p>
        </section>
      </main>

<footer className="px-6 md:px-12 py-16 border-t border-border/50 bg-bg-2 flex flex-col md:flex-row items-center justify-between gap-10">
  
  {/* Left Section */}
  <div className="flex flex-col items-center md:items-start gap-4">
    <div className="font-serif text-foreground text-2xl tracking-tight flex items-center gap-2">
      <div className="w-6 h-6 bg-gold rounded flex items-center justify-center text-white font-bold text-xs">
        M
      </div>
      MindLedger
    </div>

    <p className="text-[0.7rem] text-muted-foreground font-bold uppercase tracking-widest leading-loose text-center md:text-left">
      Built for people who want to understand the architecture of their own minds.
    </p>
  </div>

  {/* Right Section */}
  <div className="text-center md:text-right text-[0.75rem] text-muted-foreground">
    © {new Date().getFullYear()} Made with{" "}
    <span className="text-red-500">❤️</span> by{" "}
    <span className="font-semibold text-foreground">Waqas Anjum</span>
  </div>

</footer>
    </div>
  );
}
