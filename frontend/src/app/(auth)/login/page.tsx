'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Sparkles, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F9F9F7] overflow-hidden px-4 selection:bg-gold/30 selection:text-white font-sans">
      {/* Dynamic Background */}
      <div className="absolute top-[15%] right-[15%] w-[500px] h-[500px] bg-gold/10 blur-[126px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[20%] left-[10%] w-[350px] h-[350px] bg-gold/5 blur-[100px] pointer-events-none rounded-full" />
      
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
            <Lock size={12} className="text-gold" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold">Secure Access</span>
          </div>
          <h1 className="text-4xl font-serif text-foreground tracking-tight">Welcome Back</h1>
        </div>

        <Card className="border-border bg-white/70 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden rounded-3xl">
          <CardHeader className="space-y-1 py-8 text-center border-b border-border/50">
            <CardDescription className="text-muted-foreground/80 text-xs px-6 font-medium">
              Re-enter the ledger to audit your reasoning and update your outcomes.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-10 pb-8 px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold pl-1">Authorized Email Node</Label>
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
                {loading ? 'Authenticating...' : 'Sign In'}
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </CardContent>
          <CardFooter className="py-6 px-8 bg-bg-2 border-t border-border flex flex-col space-y-4 text-center">
            <div className="text-xs text-muted-foreground font-medium">
              New here?{' '}
              <Link href="/signup" className="text-gold hover:text-gold-dk font-bold transition-colors">
                Create an Account
              </Link>
            </div>
          </CardFooter>
        </Card>
        
        <p className="mt-8 text-center text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-xs mx-auto font-bold">
          Decision Intelligence is the final frontier of self-knowledge.
        </p>
      </div>
    </div>
  );
}
