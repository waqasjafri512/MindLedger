'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Search, History, Calendar, BrainCircuit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useDecisions } from '@/hooks/useDecisions';
import type { Decision } from '@/types';

export default function HistoryPage() {
  const { decisions, loading, handleDelete } = useDecisions();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filteredDecisions = decisions.filter((d: Decision) => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) || 
                         d.context.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || d.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white font-sans text-foreground">
      {/* Main Content */}
      <main className="flex-1 p-10 max-w-5xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif text-foreground tracking-tight">Full Decision Ledger</h1>
            <p className="text-muted-foreground font-medium italic">Audit your reasoning architecture across all domains.</p>
          </div>
          <Link href="/dashboard/new">
            <Button className="bg-gold text-white hover:bg-gold-dk px-6 rounded-xl shadow-[0_4px_15px_rgba(197,160,57,0.2)] border-none font-bold">
              New Case Entry
            </Button>
          </Link>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search by title or context..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 pl-12 bg-bg-2 border-border focus-visible:ring-gold/30 rounded-xl font-medium"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {['all', 'career', 'finance', 'health', 'relationship', 'general'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-xl border text-[10px] uppercase tracking-widest font-bold transition-all",
                  category === cat 
                    ? "bg-gold text-white border-gold shadow-[0_4px_10px_rgba(197,160,57,0.2)]" 
                    : "bg-bg-2 border-border text-muted-foreground hover:border-gold/30"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gold animate-pulse font-serif italic text-xl">Accessing Ledger...</div>
        ) : filteredDecisions.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-border rounded-3xl bg-bg-2/50">
            <History className="text-gold/20 mx-auto mb-6" size={48} />
            <p className="text-muted-foreground font-serif text-lg italic">No matching entries found in your archive.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDecisions.map((decision: Decision) => (
              <Link key={decision.id} href={`/decisions/${decision.id}`}>
                <Card className="bg-bg-2 border-border/50 hover:border-gold/30 transition-all group overflow-hidden relative shadow-sm hover:shadow-md rounded-2xl">
                  {decision.aiAnalysis && (
                    <div className="absolute top-4 right-4 text-gold/30 group-hover:text-gold transition-colors">
                      <BrainCircuit size={16} />
                    </div>
                  )}
                  <CardContent className="p-8 flex items-center justify-between gap-8 md:gap-12">
                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] uppercase font-bold text-gold tracking-widest bg-gold/10 px-2 py-0.5 rounded">{decision.category}</span>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                          <Calendar size={12} className="text-gold/50" />
                          {format(new Date(decision.createdAt), "MMM d, yyyy")}
                        </div>
                      </div>
                      <h4 className="text-2xl font-serif text-foreground group-hover:text-gold transition-colors truncate">{decision.title}</h4>
                      <p className="text-sm text-muted-foreground font-medium line-clamp-1 italic max-w-2xl">{decision.context}</p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 md:pl-6 md:border-l md:border-border/50 min-w-[120px]">
                      <div className="text-right hidden md:block shrink-0">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-1 font-bold">Confidence</p>
                        <p className="text-3xl font-serif text-gold">{decision.confidence}%</p>
                      </div>
                      <button 
                        onClick={(e) => handleDelete(e, decision.id)}
                        className="p-1.5 text-muted-foreground/30 hover:text-red hover:bg-red/5 rounded-lg transition-all border border-transparent hover:border-red/20 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
