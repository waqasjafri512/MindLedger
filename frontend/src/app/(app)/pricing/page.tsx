'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles, Zap, ShieldCheck, Trophy, ArrowRight } from 'lucide-react';
import { fetchWithAuth } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';

export default function PricingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (searchParams.get('canceled') === 'true') {
      toast.error('Intelligence Upgrade Aborted. You remain on the standard tier.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  const handleUpgrade = async (plan: 'pro' | 'team') => {
    setLoading(plan);
    try {
      const data = await fetchWithAuth('/stripe/create-checkout', {
        method: 'POST',
        body: JSON.stringify({
          plan,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        }),
      });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to initiate checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const PricingTier = ({ 
    title, 
    price, 
    description, 
    features, 
    plan, 
    isPopular = false,
    icon: Icon
  }: { 
    title: string; 
    price: string; 
    description: string; 
    features: string[]; 
    plan: 'free' | 'pro' | 'team';
    isPopular?: boolean;
    icon: any;
  }) => {
    const isCurrentPlan = user?.plan === plan;

    return (
      <Card className={`relative flex flex-col h-full border-border bg-bg-2 shadow-[0_20px_50px_rgba(0,0,0,0.03)] rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] ${isPopular ? 'border-gold shadow-[0_30px_60px_rgba(212,175,55,0.08)]' : ''}`}>
        {isPopular && (
          <div className="absolute top-0 right-0 bg-gold text-white text-[10px] uppercase tracking-[0.3em] font-bold px-4 py-1.5 rounded-bl-xl shadow-lg">
            Recommended
          </div>
        )}
        <CardHeader className="p-8 md:p-10 pb-4">
          <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mb-6 shadow-sm">
            <Icon size={24} />
          </div>
          <CardTitle className="text-2xl font-serif text-foreground">{title}</CardTitle>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-4xl font-serif text-foreground">{price}</span>
            <span className="text-muted-foreground font-medium text-sm">/month</span>
          </div>
          <CardDescription className="text-muted-foreground font-medium italic mt-4 min-h-[40px]">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 md:p-10 pt-0 flex-1 space-y-6">
          <div className="space-y-4">
            {features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 bg-gold/10 rounded-full flex items-center justify-center text-gold shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="text-sm text-muted-foreground/80 font-medium leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-8 md:p-10 pt-0">
          <Button 
            onClick={() => plan !== 'free' && handleUpgrade(plan)}
            disabled={isCurrentPlan || plan === 'free' || loading !== null}
            className={`w-full h-14 rounded-2xl font-bold transition-all shadow-sm ${
              isCurrentPlan 
                ? 'bg-muted text-muted-foreground' 
                : isPopular 
                  ? 'bg-gold text-white hover:bg-gold-dk shadow-[0_10px_30px_rgba(197,160,57,0.2)]'
                  : 'bg-white border-border text-foreground hover:bg-bg-2'
            }`}
          >
            {loading === plan ? 'Authorizing...' : isCurrentPlan ? 'Current Intelligence Tier' : plan === 'free' ? 'Default Access' : `Upgrade to ${title}`}
            {!isCurrentPlan && plan !== 'free' && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-foreground pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-24">
        {/* Header */}
        <header className="mb-20 text-center space-y-6">
          <div className="inline-flex items-center gap-2 text-gold bg-gold/10 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold animate-fade-in-up">
            <Sparkles size={14} />
            Subscription Tiers
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-foreground tracking-tight animate-fade-in-up [animation-delay:100ms]">
            Intelligence Tiers
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto italic font-medium text-lg leading-relaxed animate-fade-in-up [animation-delay:200ms]">
            Scale your cognitive capacity. Upgrade to unlock unlimited archive space and advanced AI metadata synthesis.
          </p>
        </header>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 animate-fade-in-up [animation-delay:300ms]">
          <PricingTier 
            title="Free"
            price="$0"
            description="Basic cognitive logging for individuals starting their calibration journey."
            icon={Zap}
            plan="free"
            features={[
              'Up to 5 Total Ledger Entries',
              'Standard Hindsight Reckoning',
              'Basic Cognitive DNA Mapping',
              'Community Support'
            ]}
          />
          <PricingTier 
            title="Pro"
            price="$19"
            description="Unlimited archival storage with advanced intelligence synthesis."
            icon={Trophy}
            plan="pro"
            isPopular={true}
            features={[
              'Unlimited Ledger Entries',
              'Advanced AI Reasoning Synthesis',
              'Full Bias Vulnerability Reports',
              'Prioritized Groq API Access',
              'Early Feature Access'
            ]}
          />
          <PricingTier 
            title="Team"
            price="$49"
            description="Organizational intelligence for groups making high-stakes decisions."
            icon={ShieldCheck}
            plan="team"
            features={[
              'Unlimited Ledger Entries',
              'Shared Organizational Case Files',
              'Collective Cognitive Risk Analysis',
              'Admin Intelligence Console',
              'Dedicated Neural Support'
            ]}
          />
        </div>

        {/* FAQ/Reassurance */}
        <div className="mt-32 text-center space-y-4 max-w-2xl mx-auto animate-fade-in-up [animation-delay:400ms]">
          <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground font-bold">Secure Processing</p>
          <p className="text-sm text-muted-foreground leading-relaxed italic">
            Payments are processed securely via Stripe. You can cancel your subscription at any time. Your data remains 100% private and encrypted regardless of your tier.
          </p>
        </div>
      </div>
    </div>
  );
}
