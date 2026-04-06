'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, History, PlusCircle, LogOut, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-white">
        <div className="text-gold animate-pulse text-lg font-serif italic">Accessing MindLedger...</div>
      </div>
    );
  }

  if (!user) return null;

  const NavItem = ({ href, icon: Icon, label }: { href: string, icon: any, label: string }) => {
    const isActive = pathname === href;
    return (
      <Link 
        href={href} 
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group",
          isActive 
            ? "bg-gold/10 text-gold shadow-[0_4px_15px_rgba(197,160,57,0.08)]" 
            : "text-muted-foreground hover:text-gold hover:bg-gold/5"
        )}
      >
        <Icon size={18} className={cn(isActive ? "text-gold" : "group-hover:text-gold")} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-white flex text-foreground">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-bg-2 p-8 hidden md:flex flex-col h-screen sticky top-0">
        <div className="mb-12">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gold rounded flex items-center justify-center text-white font-serif font-bold text-xl group-hover:scale-105 transition-transform shadow-[0_4px_10px_rgba(197,160,57,0.2)]">M</div>
            <h1 className="font-serif text-2xl text-foreground tracking-tight group-hover:text-gold transition-colors">MindLedger</h1>
          </Link>
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em] mt-3 font-bold">Cognitive Intelligence</p>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/history" icon={History} label="Decision Ledger" />
          <NavItem href="/profile" icon={Brain} label="Bias Profile" />
          
          <div className="pt-8 mt-8 border-t border-border/50">
            <Link href="/dashboard/new">
              <Button className="w-full bg-gold text-white hover:bg-gold-dk h-11 rounded-xl shadow-[0_4px_20px_rgba(197,160,57,0.15)] font-bold transition-all hover:scale-[1.02] active:scale-95 border-none">
                <PlusCircle size={18} className="mr-2" /> New Case Entry
              </Button>
            </Link>
          </div>
        </nav>

        <div className="mt-auto pt-6 border-t border-border/50">
          <div className="flex items-center gap-3 mb-6 px-1">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-serif">
              {user.displayName?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.displayName || 'User'}</p>
              <p className="text-[10px] text-muted-foreground truncate uppercase tracking-widest font-bold">Premium Access</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 text-red/70 hover:text-red hover:bg-red/5 w-full rounded-lg transition-all underline underline-offset-4 decoration-transparent hover:decoration-red/30"
          >
            <LogOut size={16} />
            <span className="text-sm font-medium uppercase tracking-widest text-[10px]">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
