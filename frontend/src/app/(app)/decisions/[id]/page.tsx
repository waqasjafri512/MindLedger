'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchWithAuth } from '@/lib/api';
import { ChevronLeft, Calendar as CalendarIcon, Target, BrainCircuit, AlertTriangle, CheckCircle2, Lock, History } from 'lucide-react';
import { format } from 'date-fns';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import type { Decision } from '@/types';
import { toast } from 'sonner';

export default function DecisionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDecision = async () => {
      try {
        const data = await fetchWithAuth(`/decisions/${id}`);
        setDecision(data);
      } catch (err: any) {
        console.error('Failed to load decision', err);
        setError(err.message || 'Failed to load decision.');
        toast.error('Failed to load decision history.');
      } finally {
        setLoading(false);
      }
    };
    if (id) loadDecision();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-gold animate-pulse text-xl font-serif italic flex flex-col items-center gap-4">
          <History className="animate-spin" size={32} />
          Accessing Ledger Entry...
        </div>
      </div>
    );
  }

  if (error || !decision) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white font-sans">
        <div className="text-center space-y-6">
          <p className="text-red font-bold text-lg">{error || 'Decision not found.'}</p>
          <Button variant="outline" className="border-gold/20 text-gold hover:bg-gold/5 font-bold" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isReadyForReview = !decision.isReviewed && new Date(decision.reviewDate) <= new Date();

  return (
    <div className="min-h-screen bg-white font-sans text-foreground">
      <div className="max-w-5xl mx-auto p-10 pb-20">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/dashboard')}
          className="mb-10 hover:bg-gold/10 text-muted-foreground hover:text-gold -ml-4 font-bold"
        >
          <ChevronLeft size={18} className="mr-2" /> Back to Dashboard
        </Button>

        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/50 pb-12">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest bg-gold/10 text-gold px-3 py-1 rounded-full font-bold">
                Case Entry: #{decision.id.slice(0, 8)}
              </span>
              <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                <Lock size={12} className="text-gold/50" />
                <span>Session Locked</span>
              </div>
            </div>
            <h1 className="text-5xl font-serif text-foreground tracking-tight">{decision.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mt-4 font-medium italic">
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-gold/60" />
                <span>Logged on {format(new Date(decision.createdAt), "PPP")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target size={16} className="text-gold/60" />
                <span className="capitalize">{decision.category} Intelligence</span>
              </div>
            </div>
          </div>
          
          <div className="bg-bg-2 border border-border p-6 rounded-3xl flex items-center gap-6 shadow-sm">
            <div className="text-center px-4">
              <p className="text-[10px] uppercase text-muted-foreground tracking-widest mb-1 font-bold">Confidence</p>
              <p className="text-3xl font-serif text-gold">{decision.confidence}%</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center px-4">
              <p className="text-[10px] uppercase text-muted-foreground tracking-widest mb-1 font-bold">Status</p>
              <div className="flex items-center gap-2 text-gold">
                {decision.isReviewed ? (
                  <>
                    <CheckCircle2 size={20} className="text-teal" />
                    <span className="text-sm font-bold tracking-widest uppercase text-teal">REVIEWED</span>
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    <span className="text-sm font-bold tracking-widest uppercase">LOCKED</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-12">
            {isReadyForReview && (
              <div className="p-8 bg-gold/10 border border-gold/30 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="space-y-1">
                  <h3 className="text-xl font-serif text-foreground">The Reckoning is here.</h3>
                  <p className="text-sm text-muted-foreground font-medium italic">Target review date has been reached. Time to calibrate.</p>
                </div>
                <Button 
                  onClick={() => router.push(`/decisions/${decision.id}/review`)}
                  className="bg-gold text-white hover:bg-gold-dk px-8 h-12 rounded-xl font-bold shadow-lg border-none shrink-0"
                >
                  Close Ledger Now
                </Button>
              </div>
            )}

            <section className="space-y-6">
              <h3 className="text-xl font-serif text-foreground flex items-center gap-3">
                <BrainCircuit size={24} className="text-gold" />
                Situation & Architecture
              </h3>
              <div className="bg-bg-2 p-8 rounded-3xl border border-border/50 leading-relaxed text-muted-foreground italic font-medium text-lg">
                "{decision.context}"
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-serif text-foreground border-l-4 border-gold pl-4">
                The Reasoning Thesis
              </h3>
              <div className="bg-white p-8 rounded-3xl border border-border leading-relaxed text-foreground font-medium text-lg shadow-sm whitespace-pre-line">
                {decision.reasoning}
              </div>
            </section>

            {decision.aiAnalysis && (
              <section className="space-y-6 pt-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-serif text-foreground">Intelligence Audit Report</h3>
                  <div className="px-3 py-1 bg-gold/10 text-gold text-[10px] rounded-full border border-gold/20 font-bold tracking-widest uppercase">AI Logic Module</div>
                </div>
                <div className="p-10 bg-bg-2 border border-gold/20 rounded-3xl relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 blur-3xl -mr-16 -mt-16" />
                  <MarkdownRenderer content={decision.aiAnalysis} />
                </div>
              </section>
            )}

            {decision.isReviewed && (
              <section className="space-y-6 pt-6 border-t border-border/50">
                <h3 className="text-xl font-serif text-foreground flex items-center gap-3">
                  <Target size={24} className="text-teal" />
                  Actual Outcome & Reconciliation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-3 bg-bg-2 p-8 rounded-3xl border border-border/50 leading-relaxed text-foreground font-medium">
                    {decision.actualOutcome}
                  </div>
                  <div className="bg-teal/5 border border-teal/20 p-8 rounded-3xl flex flex-col items-center justify-center text-center shadow-sm">
                    <p className="text-[10px] uppercase text-teal tracking-widest font-bold mb-2">Accuracy</p>
                    <p className="text-4xl font-serif text-teal">{decision.accuracyScore}%</p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-10">
            <Card className="bg-bg-2 border-border/60 rounded-3xl shadow-sm border-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Session Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div>
                  <p className="text-[10px] uppercase text-gold tracking-widest font-bold mb-3">Internal State</p>
                  <div className="flex flex-wrap gap-2">
                    {decision.emotionTags && decision.emotionTags.length > 0 ? (
                      decision.emotionTags.map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-white border border-border rounded-xl text-[10px] font-bold text-foreground">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground italic text-xs font-medium">Clear of emotional noise</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gold tracking-widest font-bold mb-3">The Reckoning</p>
                  <div className="flex items-center gap-3 text-foreground font-bold">
                    <CalendarIcon size={18} className="text-gold" />
                    <span className="text-sm">{format(new Date(decision.reviewDate), "PPP")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!decision.isReviewed ? (
              <div className="p-8 bg-gold/5 border border-gold/20 rounded-3xl space-y-4 shadow-sm">
                <div className="flex items-center gap-3 text-gold font-bold text-xs tracking-widest uppercase">
                  <AlertTriangle size={20} />
                  Hindsight Barrier
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">
                  Reasoning locked to prevent self-deception. You will evaluate the outcome without "knowing it all along" on your review date.
                </p>
              </div>
            ) : (
              <div className="p-8 bg-teal/5 border border-teal/20 rounded-3xl space-y-4 shadow-sm">
                <div className="flex items-center gap-3 text-teal font-bold text-xs tracking-widest uppercase">
                  <CheckCircle2 size={20} />
                  Case Closed
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">
                  This ledger entry is permanently sealed. Its data now contributes to your global Cognitive DNA profile.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
