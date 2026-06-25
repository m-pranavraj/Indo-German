import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'wouter';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  LogOut, LayoutDashboard, Route, CheckCircle, FileText, BookOpen,
  Briefcase, Award, LifeBuoy, Users, Building, ShieldCheck, MapPin,
  Sparkles, Network, Globe, Landmark, Info, BarChart3
} from 'lucide-react';
import { AIChatPopup } from '@/components/AIChatPopup';
import { MentorPopup } from '@/components/MentorPopup';

const ACCENT = '#A855F7';
const ACCENT2 = '#C084FC';
const BG = '#0F0520';
const CARD = '#1A0B3B';
const TEXT2 = '#C4B5FD';
const BORDER = 'rgba(168,85,247,0.15)';

const roleNavMap: Record<string, { label: string, href: string, icon: React.ReactNode }[]> = {
  candidate: [
    { label: 'Dashboard',      href: '/candidate/dashboard',     icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'AI Roadmap',     href: '/candidate/roadmap',       icon: <Sparkles className="h-4 w-4" /> },
    { label: 'AI Resume',      href: '/candidate/resume',        icon: <FileText className="h-4 w-4" /> },
    { label: 'Journey',        href: '/candidate/journey',       icon: <Route className="h-4 w-4" /> },
    { label: 'Readiness',      href: '/candidate/readiness',     icon: <CheckCircle className="h-4 w-4" /> },
    { label: 'Documents',      href: '/candidate/documents',     icon: <FileText className="h-4 w-4" /> },
    { label: 'Certifications', href: '/candidate/certifications',icon: <Award className="h-4 w-4" /> },
    { label: 'Training',       href: '/candidate/training',      icon: <BookOpen className="h-4 w-4" /> },
    { label: 'Recognition',    href: '/candidate/recognition',   icon: <Award className="h-4 w-4" /> },
    { label: 'Job Market',     href: '/candidate/applications',  icon: <Briefcase className="h-4 w-4" /> },
    { label: 'Sectors',        href: '/candidate/sectors',       icon: <BarChart3 className="h-4 w-4" /> },
    { label: 'Visa',           href: '/candidate/visa',          icon: <MapPin className="h-4 w-4" /> },
    { label: 'German Language',href: '/candidate/language',      icon: <Globe className="h-4 w-4" /> },
    { label: 'Culture',        href: '/candidate/culture',       icon: <Landmark className="h-4 w-4" /> },
    { label: 'Info Hub',       href: '/candidate/info-hub',      icon: <Info className="h-4 w-4" /> },
    { label: 'Network',        href: '/candidate/network',       icon: <Network className="h-4 w-4" /> },
    { label: 'Welfare',        href: '/candidate/welfare',       icon: <LifeBuoy className="h-4 w-4" /> },
  ],
  employer: [
    { label: 'Dashboard',       href: '/employer/dashboard',     icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Vacancies',       href: '/employer/vacancies',     icon: <Briefcase className="h-4 w-4" /> },
    { label: 'Applications',    href: '/employer/applications',  icon: <FileText className="h-4 w-4" /> },
    { label: 'Interviews',      href: '/employer/interviews',    icon: <Users className="h-4 w-4" /> },
    { label: 'Offers',          href: '/employer/offers',        icon: <Award className="h-4 w-4" /> },
    { label: 'Company Profile', href: '/employer/profile',       icon: <Building className="h-4 w-4" /> },
  ],
  trainer: [
    { label: 'Dashboard', href: '/trainer/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Courses',   href: '/trainer/courses',   icon: <BookOpen className="h-4 w-4" /> },
    { label: 'Batches',   href: '/trainer/batches',   icon: <Users className="h-4 w-4" /> },
    { label: 'Students',  href: '/trainer/students',  icon: <FileText className="h-4 w-4" /> },
  ],
  facilitator: [
    { label: 'Dashboard',   href: '/facilitator/dashboard',   icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Candidates',  href: '/facilitator/candidates',  icon: <Users className="h-4 w-4" /> },
    { label: 'Recognition', href: '/facilitator/recognition', icon: <Award className="h-4 w-4" /> },
    { label: 'Visa Cases',  href: '/facilitator/visa',        icon: <MapPin className="h-4 w-4" /> },
    { label: 'Welfare',     href: '/facilitator/welfare',     icon: <LifeBuoy className="h-4 w-4" /> },
  ],
  government: [
    { label: 'Dashboard',    href: '/government/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Pipeline',     href: '/government/pipeline',  icon: <Route className="h-4 w-4" /> },
    { label: 'Districts Map', href: '/government/districts', icon: <MapPin className="h-4 w-4" /> },
  ],
  admin: [
    { label: 'Dashboard',  href: '/admin/dashboard',  icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Candidates', href: '/admin/candidates', icon: <Users className="h-4 w-4" /> },
    { label: 'Employers',  href: '/admin/employers',  icon: <Building className="h-4 w-4" /> },
    { label: 'Documents',  href: '/admin/documents',  icon: <ShieldCheck className="h-4 w-4" /> },
  ]
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user) return (
    <div className="p-8 text-center text-white min-h-screen flex items-center justify-center" style={{ background: BG }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
        <div className="text-purple-300 text-sm">Loading…</div>
      </div>
    </div>
  );

  const navItems = roleNavMap[user.role] || [];

  return (
    <div className="min-h-screen flex" style={{ background: BG }}>
      {/* Sidebar */}
      <aside className="w-60 flex flex-col hidden md:flex fixed h-full z-10 overflow-y-auto"
        style={{ background: 'linear-gradient(180deg, #1A0B3B 0%, #130828 100%)', borderRight: `1px solid ${BORDER}` }}>

        {/* Logo */}
        <div className="p-5 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', boxShadow: '0 0 16px rgba(168,85,247,0.4)' }}>
              IG
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-white">Indo German</div>
              <div className="text-[9px] tracking-widest uppercase" style={{ color: '#6B3FA0' }}>Mobility Platform</div>
            </div>
          </div>

          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = location === item.href || location.startsWith(`${item.href}/`);
              const isAI = item.label.startsWith('AI');
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-all text-sm group"
                    style={
                      isActive
                        ? { background: 'linear-gradient(90deg, rgba(168,85,247,0.2), rgba(168,85,247,0.05))', color: ACCENT, borderLeft: `3px solid ${ACCENT}`, boxShadow: '0 0 12px rgba(168,85,247,0.1)' }
                        : { color: TEXT2, borderLeft: '3px solid transparent' }
                    }
                  >
                    <span style={{ color: isActive ? ACCENT : isAI ? '#E879F9' : TEXT2 }}>
                      {item.icon}
                    </span>
                    <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
                    {isAI && !isActive && (
                      <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                        style={{ background: 'rgba(232,121,249,0.15)', color: '#E879F9' }}>AI</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Role indicator */}
        <div className="mx-4 my-2 px-3 py-2 rounded-xl flex-shrink-0"
          style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.12)' }}>
          <div className="text-[10px] uppercase tracking-widest font-bold mb-0.5" style={{ color: '#6B3FA0' }}>Current Role</div>
          <div className="text-xs font-semibold capitalize" style={{ color: ACCENT2 }}>{user.role.replace('_', ' ')}</div>
        </div>

        {/* User section */}
        <div className="mt-auto p-4 flex-shrink-0" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2.5 mb-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', color: '#fff', fontSize: 13, fontWeight: 700 }}>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs truncate" style={{ color: TEXT2 }}>{user.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all hover:opacity-80"
            style={{ color: TEXT2, background: 'rgba(168,85,247,0.06)', border: `1px solid ${BORDER}` }}>
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-60 min-h-screen" style={{ background: BG }}>
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <AIChatPopup />
      <MentorPopup />
    </div>
  );
}
