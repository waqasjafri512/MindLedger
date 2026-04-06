'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { fetchWithAuth } from '@/lib/api';
import { ChevronLeft, CheckCircle2, AlertCircle, TrendingUp, History, Target, Sparkles, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function OutcomeReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [decision, setDecision] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actualOutcome, setActualOutcome] = useState('');
  const [accuracyScore, setAccuracyScore] = useState(50);
  const [hindsightAnalysis, setHindsightAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDecision = async () => {
      try {
        const data = await fetchWithAuth(`/decisions/${id}`);
        setDecision(data);
        if (data.isReviewed) {
          router.push(`/decisions/${id}`);
        }
      } catch (err: any) {
        setError('Failed to load decision.');
      } finally {
        setLoading(false);
      }
    };
    loadDecision();
  }, [id, router]);

  const handleNextToAnalysis = async () => {
    if (!actualOutcome) return setError('Please describe the actual outcome.');
    setIsAnalyzing(true);
    setStep(2);
    try {
      const data = await fetchWithAuth('/analysis/hindsight', {
        method: 'POST',
        body: JSON.stringify({
          title: decision.title,
          reasoning: decision.reasoning,
          confidence: decision.confidence,
          actualOutcome: actualOutcome,
        }),
      });
      setHindsightAnalysis(data.analysis);
    } catch (err: any) {
      setHindsightAnalysis('### ⚠️ AI Hindsight Analysis Unavailable\nWe were unable to perform the reconciliation at this time. You can still finalize your calibration below.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetchWithAuth(`/decisions/${id}/outcome`, {
        method: 'POST',
        body: JSON.stringify({ actualOutcome, accuracyScore }),
      });
      router.push(`/decisions/${id}`);
    } catch (err: any) {
      setError('Failed to save outcome.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center animate-fade-in">
        <History className="text-gold animate-spin mb-4" size={32} />
        <h2 className="text-2xl font-serif text-foreground italic">Opening Case File...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-10 font-sans text-foreground pb-24">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => router.push(`/decisions/${id}`)} 
          className="mb-10 hover:bg-gold/10 text-muted-foreground hover:text-gold -ml-4 font-bold"
        >
          <ChevronLeft size={18} className="mr-2" /> Back to Case
        </Button>

        <header className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-gold bg-gold/10 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold">
            <Sparkles size={14} />
            The Reckoning
          </div>
          <h1 className="text-5xl font-serif text-foreground tracking-tight">Hindsight Reconciliation</h1>
          <p className="text-muted-foreground mt-4 italic font-medium">Reconciling your original thesis for <strong className="text-foreground">"{decision.title}"</strong> with current reality.</p>
        </header>

        <Card className="border-border bg-bg-2 shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-3xl overflow-hidden p-8 md:p-12 transition-all">
          <CardHeader className="p-0 mb-10 border-b border-border/50 pb-8">
            <CardTitle className="text-3xl font-serif text-foreground flex items-center gap-4">
              {step === 1 ? (
                <>
                  <Target className="text-gold" size={28} />
                  Phase 1: Recording Reality
                </>
              ) : (
                <>
                  <BrainCircuit className="text-gold" size={28} />
                  Phase 2: Cognitive Mapping
                </>
              )}
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium italic mt-2">
              {step === 1 ? 'Describe the objective result without self-deception.' : 'Identify the discrepancy between your prediction and the actual outcome.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-0 space-y-10">
            {step === 1 ? (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <Label className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold pl-1">Actual Outcome Architecture</Label>
                  <Textarea 
                    placeholder="Describe what occurred. Focus on cold, hard facts..." 
                    className="min-h-[180px] bg-white border-border focus-visible:ring-gold/30 rounded-2xl p-6 font-medium leading-relaxed shadow-sm"
                    value={actualOutcome}
                    onChange={(e) => setActualOutcome(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground font-bold tracking-wider uppercase pl-1">Pro Tip: Avoid rationalizing the result. Log the data only.</p>
                </div>

                <div className="space-y-6 bg-white p-8 rounded-2xl border border-border shadow-sm">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Self-Calibration Score ({accuracyScore}%)</Label>
                    <span className="text-gold font-bold text-xs">{accuracyScore > 70 ? 'High Accuracy' : 'Low Accuracy'}</span>
                  </div>
                  <Slider 
                    value={[accuracyScore]} 
                    onValueChange={(v) => {
                      const val = Array.isArray(v) ? v[0] : v;
                      setAccuracyScore(val as number);
                    }} 
                    max={100} 
                    step={1} 
                    className="py-4 cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground font-medium italic text-center">How closely did the reality match your initial predictions?</p>
                </div>
              </div>
            ) : (
              <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
                {isAnalyzing ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                    <p className="text-gold font-serif italic text-xl">Consulting Hindsight Module...</p>
                  </div>
                ) : (
                  <div className="p-10 bg-white border border-gold/20 rounded-3xl shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 blur-3xl -mr-16 -mt-16" />
                    <div className="whitespace-pre-wrap text-foreground font-medium leading-relaxed prose prose-sm prose-gold max-w-none">
                      {hindsightAnalysis}
                    </div>
                  </div>
                )}
              </div>
            )}
            {error && <div className="text-sm font-bold text-red bg-red/5 p-4 rounded-xl border border-red/10 animate-shake">{error}</div>}
          </CardContent>

          <CardFooter className="p-0 mt-12 pt-8 border-t border-border/50 flex justify-between">
            {step === 1 ? (
              <>
                <Button variant="ghost" onClick={() => router.push(`/decisions/${id}`)} className="text-muted-foreground hover:text-gold font-bold">Cancel</Button>
                <Button onClick={handleNextToAnalysis} disabled={!actualOutcome} className="bg-gold text-white hover:bg-gold-dk px-10 rounded-xl font-bold border-none shadow-[0_4px_20px_rgba(197,160,57,0.25)]">
                  Continue to Audit <TrendingUp size={18} className="ml-2" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setStep(1)} disabled={isSubmitting || isAnalyzing} className="text-muted-foreground hover:text-gold font-bold">Modify Outcome</Button>
                <Button onClick={handleFinalSubmit} disabled={isSubmitting || isAnalyzing} className="bg-gold text-white hover:bg-gold-dk px-10 h-12 rounded-xl font-bold border-none shadow-[0_4px_30px_rgba(197,160,57,0.3)] animate-pulse">
                  {isSubmitting ? 'Closing Ledger...' : 'Finalize Audit & Lock'} <CheckCircle2 size={18} className="ml-2" />
                </Button>
              </>
            )}
          </CardFooter>
        </Card>

        {/* Comparison Reference */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-bg-2 border border-border/50 rounded-3xl shadow-sm">
            <h5 className="text-[10px] uppercase tracking-[0.3em] text-gold mb-4 flex items-center gap-2 font-bold">
              <History size={16} /> Original Reasoning
            </h5>
            <p className="text-sm italic font-medium leading-relaxed text-muted-foreground">"{decision.reasoning}"</p>
          </div>
          <div className="p-8 bg-bg-2 border border-border/50 rounded-3xl shadow-sm flex flex-col justify-center items-center text-center">
            <h5 className="text-[10px] uppercase tracking-[0.3em] text-gold mb-4 flex items-center gap-2 font-bold">
              <Target size={16} /> Initial Confidence
            </h5>
            <p className="text-5xl font-serif text-foreground">{decision.confidence}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
