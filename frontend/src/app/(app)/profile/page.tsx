'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchWithAuth } from '@/lib/api';
import { Brain, Sparkles, ShieldAlert, Zap, Target } from 'lucide-react';
import { useStats } from '@/hooks/useStats';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { toast } from 'sonner';

export default function BiasProfilePage() {
  const [profile, setProfile] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const { stats, loading: statsLoading } = useStats();

  const loadProfile = useCallback(async (force = false) => {
    if (force) setRegenerating(true);
    else setLoading(true);

    try {
      const data = await fetchWithAuth(`/analysis/profile-summary${force ? '?force=true' : ''}`);
      setProfile(data.analysis);
      if (force) toast.success('Cognitive DNA refreshed.');
    } catch (err: any) {
      console.error('Failed to load profile', err);
      toast.error('Failed to generate your cognitive profile.');
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-gold/20 rounded-full animate-ping absolute opacity-40" />
          <Brain size={48} className="text-gold animate-pulse relative" />
        </div>
        <div>
          <h2 className="text-2xl font-serif text-foreground">Synthesizing Your Cognitive DNA</h2>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto font-medium italic">Consulting AI Architecture to identify patterns across your entire history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-foreground">
      <div className="max-w-5xl mx-auto p-10 pb-24">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gold">
              <Sparkles size={16} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Analysis Aggregate</span>
            </div>
            <h1 className="text-5xl font-serif text-foreground tracking-tight">Your Bias Profile</h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed italic font-medium">
              A high-fidelity mirror of your decision-making architecture, based on every entry in your ledger.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => loadProfile(true)}
            disabled={regenerating}
            className="border-gold/30 text-gold hover:bg-gold/5 font-bold rounded-xl h-12 px-6"
          >
            {regenerating ? 'Re-auditing...' : 'Force Refresh DNA'}
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Pulse Stats */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-bg-2 border-border/50 overflow-hidden relative group shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-3xl -mr-12 -mt-12 group-hover:bg-gold/10 transition-colors" />
              <CardHeader className="pb-2">
                <CardDescription className="text-[10px] uppercase tracking-widest text-gold font-bold">Calibration</CardDescription>
                <CardTitle className="text-3xl font-serif text-foreground">{statsLoading ? '...' : stats.calibrationLabel}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground font-medium">
                  {stats.calibrationLabel === 'Elite' 
                    ? 'Your reasoning accuracy is exceptional.' 
                    : stats.calibrationLabel === 'High' 
                    ? 'Your predictions frequently align with reality.'
                    : 'Calibration in progress... log more outcomes.'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-bg-2 border-border/50 overflow-hidden relative group shadow-sm">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal/5 blur-3xl -mr-12 -mt-12 group-hover:bg-teal/10 transition-colors" />
              <CardHeader className="pb-2">
                <CardDescription className="text-[10px] uppercase tracking-widest text-teal font-bold">Patterns</CardDescription>
                <CardTitle className="text-3xl font-serif text-foreground">{statsLoading ? '...' : stats.biasesDetected}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground font-medium">Unique cognitive triggers identified through AI analysis of your history.</p>
              </CardContent>
            </Card>
          </div>

          {/* Main AI Report */}
          <div className="lg:col-span-3">
            <Card className="bg-white border-border/60 relative shadow-[0_20px_50px_rgba(0,0,0,0.03)] overflow-hidden min-h-[600px] rounded-3xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(212,175,55,0.05),transparent)] pointer-events-none" />
              <CardHeader className="border-b border-border/50 pb-6 flex flex-row items-center justify-between bg-bg-2/50">
                <div>
                  <CardTitle className="text-2xl font-serif text-foreground">Cognitive DNA Report</CardTitle>
                  <CardDescription className="font-medium italic">Synthesized via AI Intelligence Layer</CardDescription>
                </div>
                <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold">
                    <Brain size={28} />
                </div>
              </CardHeader>
              <CardContent className="pt-10 px-10">
                <MarkdownRenderer content={profile} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Strategies Section (Hardcoded for now, but better styled) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-bg-2 border border-border/50 rounded-3xl space-y-4 hover:border-gold/30 transition-all shadow-sm group">
            <ShieldAlert size={28} className="text-gold group-hover:scale-110 transition-transform" />
            <h4 className="text-xl font-serif text-foreground">Defense Strategy</h4>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium italic">"Prioritize Pre-Mortems on high-stakes entries to neutralize detected blindspots."</p>
          </div>
          <div className="p-8 bg-bg-2 border border-border/50 rounded-3xl space-y-4 hover:border-gold/30 transition-all shadow-sm group">
            <Zap size={28} className="text-gold group-hover:scale-110 transition-transform" />
            <h4 className="text-xl font-serif text-foreground">Growth Lever</h4>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium italic">"Identify domains with high calibration and increase decision velocity there."</p>
          </div>
          <div className="p-8 bg-bg-2 border border-border/50 rounded-3xl space-y-4 hover:border-gold/30 transition-all shadow-sm group">
            <Target size={28} className="text-gold group-hover:scale-110 transition-transform" />
            <h4 className="text-xl font-serif text-foreground">Core Focus</h4>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium italic">"Reduce the 'Hindsight Gap' by logging more granular emotional data in real-time."</p>
          </div>
        </div>
      </div>
    </div>
  );
}
