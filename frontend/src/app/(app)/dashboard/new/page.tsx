'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { format } from 'date-fns';
import { Sparkles, BrainCircuit, ShieldAlert, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchWithAuth } from '@/lib/api';

export default function NewDecisionPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: 'general',
    context: '',
    reasoning: '',
    alternatives: '',
    confidence: 50,
    emotion: '',
    reviewDate: format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd'),
  });

  const nextStep = async () => {
    if (step === 3 && !analysis) {
      setAnalyzing(true);
      setStep(4);
      try {
        const data = await fetchWithAuth('/analysis', {
          method: 'POST',
          body: JSON.stringify({
            title: formData.title,
            context: formData.context,
            reasoning: formData.reasoning,
            confidence: formData.confidence,
          })
        });
        setAnalysis(data.analysis);
      } catch (err) {
        setAnalysis("AI Analysis temporarily unavailable. You may proceed to seal the ledger.");
      } finally {
        setAnalyzing(false);
      }
    } else {
      setStep(s => Math.min(s + 1, 5));
    }
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetchWithAuth('/decisions', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          aiAnalysis: analysis,
          // Minor transform for the backend structure if needed
          alternatives: formData.alternatives ? [{ option: formData.alternatives, rejected_reason: "Considered but not prioritized" }] : []
        })
      });
      router.push('/dashboard');
    } catch (err) {
      console.error('Submission failed', err);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-foreground pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-16">
        {/* Header */}
        <header className="mb-12 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-gold">
            <Sparkles size={16} />
            <span className="text-[10px] uppercase tracking-[0.34em] font-bold">New Ledger Entry</span>
          </div>
          <h1 className="text-4xl font-serif text-foreground tracking-tight">Capture Reasoning</h1>
          <p className="text-muted-foreground max-w-md mx-auto italic font-medium">Record the variables before the outcome is known.</p>
        </header>

        {/* Progress Bar */}
        <div className="flex justify-between mb-12 relative px-2">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border -translate-y-1/2 z-0" />
          {[1, 2, 3, 4, 5].map((s) => (
            <div 
              key={s} 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all relative z-10",
                step >= s 
                  ? "bg-gold border-gold text-white shadow-[0_4px_15px_rgba(197,160,57,0.3)]" 
                  : "bg-white border-border text-muted-foreground"
              )}
            >
              {s}
            </div>
          ))}
        </div>

        <Card className="border-border bg-bg-2 shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-3xl overflow-hidden p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif text-foreground">The Situation</h3>
                  <p className="text-sm text-muted-foreground font-medium">What is the core decision you are making?</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Case Title</Label>
                    <Input 
                      placeholder="e.g. Hiring new Senior Engineer" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="h-12 bg-white border-border focus-visible:ring-gold/30 rounded-xl font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Comprehensive Context</Label>
                    <Textarea 
                      placeholder="What are the facts? What led to this moment?" 
                      className="min-h-[120px] bg-white border-border focus-visible:ring-gold/30 rounded-xl"
                      value={formData.context}
                      onChange={(e) => setFormData({...formData, context: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Category</Label>
                    <select 
                      className="w-full h-12 bg-white border border-border rounded-xl px-3 text-sm focus:ring-1 focus:ring-gold/30 outline-none font-medium"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="general">General</option>
                      <option value="career">Career</option>
                      <option value="finance">Finance</option>
                      <option value="health">Health</option>
                      <option value="relationship">Relationship</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif text-foreground">Reasoning Architecture</h3>
                  <p className="text-sm text-muted-foreground font-medium">Be brutally honest. Why are you choosing this path?</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Core Reason / Thesis</Label>
                    <Textarea 
                      placeholder="I am deciding this because..." 
                      className="min-h-[100px] bg-white border-border focus-visible:ring-gold/30 rounded-xl font-medium"
                      value={formData.reasoning}
                      onChange={(e) => setFormData({...formData, reasoning: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Alternatives Rejected</Label>
                    <Textarea 
                      placeholder="What other paths did you discard? Why?" 
                      className="min-h-[100px] bg-white border-border focus-visible:ring-gold/30 rounded-xl font-medium"
                      value={formData.alternatives}
                      onChange={(e) => setFormData({...formData, alternatives: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif text-foreground">Internal State</h3>
                  <p className="text-sm text-muted-foreground font-medium">Emotional noise often distorts logic. Log it now.</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <Label className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Confidence Calibration ({formData.confidence}%)</Label>
                      <span className="text-gold font-bold text-xs">{formData.confidence > 70 ? 'High' : 'Moderate'}</span>
                    </div>
                    <Slider 
                      value={[formData.confidence]} 
                      onValueChange={(v) => {
                        const val = Array.isArray(v) ? v[0] : v;
                        setFormData({...formData, confidence: val as number});
                      }} 
                      max={100} 
                      step={1} 
                      className="py-4 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Prevailing Emotion</Label>
                    <Input 
                      placeholder="e.g. Excitement, Fear of Missing Out, Professional Pride" 
                      value={formData.emotion}
                      onChange={(e) => setFormData({...formData, emotion: e.target.value})}
                      className="h-12 bg-white border-border focus-visible:ring-gold/30 rounded-xl font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">The Reckoning Date</Label>
                    <Input 
                      type="date"
                      value={formData.reviewDate}
                      onChange={(e) => setFormData({...formData, reviewDate: e.target.value})}
                      className="h-12 bg-white border-border focus-visible:ring-gold/30 rounded-xl font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center text-gold animate-pulse">
                    <BrainCircuit size={32} />
                  </div>
                  <h3 className="text-2xl font-serif text-foreground">AI Intelligence Analysis</h3>
                  {analyzing ? (
                    <p className="text-muted-foreground font-bold animate-pulse">Consulting Grok-3 to identify blindspots in your reasoning...</p>
                  ) : (
                    <p className="text-gold font-bold">Analysis Complete.</p>
                  )}
                </div>

                {analysis && (
                  <div className="p-8 bg-white border border-gold/20 rounded-2xl shadow-[0_10px_30px_rgba(212,175,55,0.1)] space-y-4">
                    <div className="flex items-center gap-2 text-gold">
                      <ShieldAlert size={18} />
                      <span className="text-[10px] uppercase tracking-widest font-bold">Intelligence Flash Report</span>
                    </div>
                    <div className="whitespace-pre-wrap text-foreground font-medium leading-relaxed prose prose-sm prose-gold">
                      {analysis}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center py-10">
                <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto mb-6">
                  <Check size={40} />
                </div>
                <h3 className="text-3xl font-serif text-foreground">Ready to Lock</h3>
                <p className="text-muted-foreground max-w-md mx-auto font-bold leading-relaxed">
                  Review your analysis. Once you commit, this reasoning is time-locked and cannot be modified until the review date.
                </p>
              </div>
            )}

            <div className="flex justify-between pt-10 border-t border-border/50">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={prevStep}
                disabled={step === 1 || analyzing || submitting}
                className="text-muted-foreground hover:text-gold font-bold"
              >
                Back
              </Button>
              
              {step < 5 ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  disabled={analyzing}
                  className="bg-gold text-white hover:bg-gold-dk px-8 rounded-xl font-bold border-none shadow-[0_4px_15px_rgba(197,160,57,0.2)]"
                >
                  {step === 3 && !analysis ? 'Run AI Analysis' : 'Proceed'}
                </Button>
              ) : (
                <Button 
                  type="submit"
                  disabled={submitting}
                  className="bg-gold text-white hover:bg-gold-dk px-10 h-12 rounded-xl font-bold border-none shadow-[0_4px_20px_rgba(197,160,57,0.3)] animate-pulse"
                >
                  {submitting ? 'Sealing...' : 'Seal the Ledger'}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
