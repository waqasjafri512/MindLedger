'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchWithAuth } from '@/lib/api';
import Link from 'next/link';
import { PlusCircle, LogOut, LayoutDashboard, History, Target, Brain, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDecisions = async () => {
      try {
        const data = await fetchWithAuth('/decisions');
        setDecisions(data);
      } catch (err) {
        console.error('Failed to load decisions', err);
      } finally {
        setLoading(false);
      }
    };
    loadDecisions();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to archive this case? it will be hidden from your ledger.')) return;
    
    try {
      await fetchWithAuth(`/decisions/${id}`, {
        method: 'DELETE',
      });
      setDecisions(decisions.filter((d: any) => d.id !== id));
    } catch (err) {
      console.error('Failed to delete decision', err);
      alert('Failed to archive the decision.');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-foreground">
      {/* Main Content */}
      <main className="flex-1 p-10 max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-serif text-foreground">Welcome, {user?.displayName || 'User'}</h2>
            <p className="text-muted-foreground italic font-medium">"Reasoning must be captured before the outcome is known."</p>
          </div>
          <Link href="/dashboard/new">
            <Button className="bg-gold text-white hover:bg-gold-dk gap-2 shadow-[0_4px_15px_rgba(197,160,57,0.2)] border-none font-bold">
              <PlusCircle size={18} />
              Log New Decision
            </Button>
          </Link>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-bg-2 border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Logged Cases</CardDescription>
              <CardTitle className="text-4xl font-serif text-gold">{decisions.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-bg-2 border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Intelligence Rank</CardDescription>
              <CardTitle className="text-4xl font-serif text-gold">A1</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-bg-2 border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Calibration</CardDescription>
              <CardTitle className="text-4xl font-serif text-gold">High</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-bg-2 border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Biases Logged</CardDescription>
              <CardTitle className="text-4xl font-serif text-gold">14</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Ready for Review Alert */}
        {decisions.some((d: any) => !d.isReviewed && new Date(d.reviewDate) <= new Date()) && (
          <section className="mb-12">
            <h3 className="text-xl font-serif text-foreground mb-4 flex items-center gap-2">
              <History className="text-gold" size={20} />
              The Reckoning: Ready for Review
            </h3>
            <div className="space-y-4">
              {decisions
                .filter((d: any) => !d.isReviewed && new Date(d.reviewDate) <= new Date())
                .map((d: any) => (
                  <div key={d.id} className="p-6 bg-gold/5 border border-gold/20 rounded-2xl flex items-center justify-between gap-6 group hover:translate-x-1 transition-all">
                    <div className="space-y-1">
                      <h4 className="text-lg font-serif text-foreground group-hover:text-gold transition-colors">{d.title}</h4>
                      <p className="text-xs text-muted-foreground italic font-medium">Target Date Reached: {format(new Date(d.reviewDate), "PPP")}</p>
                    </div>
                    <Link href={`/decisions/${d.id}/review`}>
                      <Button className="bg-gold text-white hover:bg-gold-dk h-9 px-6 font-bold shadow-[0_4px_15px_rgba(197,160,57,0.15)] border-none">
                        Close Ledger
                      </Button>
                    </Link>
                  </div>
                ))}
            </div>
          </section>
        )}

        <section className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-serif text-foreground">Recent Case Files</h3>
            <Link href="/history" className="text-gold text-sm hover:underline font-bold">View Full Ledger</Link>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="animate-pulse text-gold uppercase tracking-widest text-[10px] font-bold">Accessing Ledger...</div>
            </div>
          ) : decisions.length === 0 ? (
            <Card className="border-dashed border-border bg-bg-2 py-20 text-center rounded-3xl">
              <CardContent className="space-y-4">
                <div className="mx-auto w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center text-gold mb-6 shadow-sm">
                  <Brain size={40} />
                </div>
                <h3 className="text-2xl font-serif text-foreground">The ledger is currently silent</h3>
                <p className="text-muted-foreground max-w-sm mx-auto font-medium italic">
                  Mapping your cognitive blindspots begins with a single archived reasoning.
                </p>
                <Link href="/dashboard/new">
                  <Button variant="outline" className="mt-8 border-gold/30 text-gold hover:bg-gold/5 px-8 h-12 rounded-xl font-bold shadow-sm">
                    Initiate Your First Audit
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {decisions.slice(0, 6).map((decision: any) => (
                <Link key={decision.id} href={`/decisions/${decision.id}`}>
                  <Card className="border-border bg-bg-2 hover:border-gold/40 transition-all cursor-pointer group h-full shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] rounded-2xl relative overflow-hidden">
                    <CardHeader className="p-8">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <span className="text-[10px] uppercase font-bold text-gold tracking-widest bg-gold/10 px-2.5 py-1 rounded">
                          {decision.category || 'General'}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {format(new Date(decision.createdAt), "MMM d")}
                          </span>
                          <button 
                            onClick={(e) => handleDelete(e, decision.id)}
                            className="bg-white/50 hover:bg-red/10 text-muted-foreground/40 hover:text-red transition-all p-1.5 rounded-lg border border-transparent hover:border-red/20 group/del"
                          >
                            <Trash2 size={14} className="group-hover/del:scale-110 transition-transform" />
                          </button>
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-serif group-hover:text-gold transition-colors text-foreground mb-2 leading-tight">{decision.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-sm font-medium text-muted-foreground/80 italic leading-relaxed">
                        "{decision.context}"
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 pt-0">
                      <div className="flex flex-col gap-1 border-t border-border/50 pt-6">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">Confidence Calibration</span>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden border border-border/50">
                            <div 
                              className="h-full bg-gold shadow-[0_0_8px_rgba(197,160,57,0.4)]"
                              style={{ width: `${decision.confidence || 0}%` }}
                            />
                          </div>
                          <span className="text-xl font-serif text-gold">{decision.confidence || 0}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
