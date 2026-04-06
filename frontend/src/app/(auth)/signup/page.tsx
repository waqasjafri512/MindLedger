'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Sparkles, ArrowRight, Lock } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(email, password, displayName);
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F9F9F7] overflow-hidden px-4 selection:bg-gold/30 selection:text-white font-sans">
      {/* Dynamic Background */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/10 blur-[126px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-gold/5 blur-[100px] pointer-events-none rounded-full" />
      
      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

      <div className="w-full max-w-[460px] relative z-10 animate-fade-in">
        {/* Logo/Branding */}
        <div className="flex flex-col items-center mb-10 text-center">
            <Link href="/" className="mb-6 group">
                <div className="w-14 h-14 bg-gradient-to-br from-gold to-gold-lt p-px rounded-2xl shadow-[0_4px_20px_rgba(197,160,57,0.15)] group-hover:scale-105 transition-transform">
                    <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center text-gold font-serif text-3xl font-bold">M</div>
                </div>
            </Link>
          <div className="flex items-center gap-2 text-gold-dk/60 mb-2">
            <Sparkles size={12} className="text-gold" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold">The Cognitive Archive</span>
          </div>
          <h1 className="text-4xl font-serif text-foreground tracking-tight">Initiate Your Ledger</h1>
        </div>

        <Card className="border-border bg-white/70 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden rounded-3xl">
          <CardHeader className="space-y-1 py-8 text-center border-b border-border/50">
            <CardDescription className="text-muted-foreground/80 text-xs px-6">
              Establish a secure repository for your reasoning, patterns, and cognitive growth.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-10 pb-8 px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="displayName" className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold pl-1">Legal Identity / Display Name</Label>
                <Input 
                  id="displayName" 
                  placeholder="e.g. Marcus Aurelius" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-12 bg-white border-border focus-visible:ring-gold/30 rounded-xl transition-all placeholder:text-muted-foreground/30 text-foreground"
                  required
                />
              </div>
              
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold pl-1">Primary Email Node</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="name@archived.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white border-border focus-visible:ring-gold/30 rounded-xl transition-all placeholder:text-muted-foreground/30 text-foreground"
                  required
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="password" className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold pl-1">Security Key</Label>
                <Input 
                  id="password" 
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-white border-border focus-visible:ring-gold/30 rounded-xl transition-all placeholder:text-muted-foreground/30 text-foreground"
                  required
                />
              </div>

              {error && <div className="text-xs font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-shake">{error}</div>}
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 bg-gold hover:bg-gold-dk text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(197,160,57,0.2)] group transition-all"
              >
                {loading ? 'Processing...' : 'Create Account'}
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="py-6 px-8 bg-bg-2 border-t border-border flex flex-col space-y-4">
            <div className="text-center text-xs text-muted-foreground font-medium">
              Already have an archive?{' '}
              <Link href="/login" className="text-gold hover:text-gold-dk font-bold transition-colors">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        <p className="mt-8 text-center text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-xs mx-auto font-bold">
          Built for those who refuse to repeat history. 100% private. End-to-end reasoning protection.
        </p>
      </div>
    </div>
  );
}
