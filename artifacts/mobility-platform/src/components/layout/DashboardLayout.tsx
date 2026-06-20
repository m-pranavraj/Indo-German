import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  LogOut, LayoutDashboard, Route, CheckCircle, FileText, BookOpen,
  Briefcase, Award, LifeBuoy, Users, Building, ShieldCheck, MapPin,
  Sparkles, Network
} from 'lucide-react';
import { AIChatPopup } from '@/components/AIChatPopup';

const roleNavMap: Record<string, { label: string, href: string, icon: React.ReactNode }[]> = {
  candidate: [
    { label: 'Dashboard',     href: '/candidate/dashboard',     icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'AI Roadmap',    href: '/candidate/roadmap',       icon: <Sparkles className="h-4 w-4" /> },
    { label: 'AI Resume',     href: '/candidate/resume',        icon: <FileText className="h-4 w-4" /> },
    { label: 'Journey',       href: '/candidate/journey',       icon: <Route className="h-4 w-4" /> },
    { label: 'Readiness',     href: '/candidate/readiness',     icon: <CheckCircle className="h-4 w-4" /> },
    { label: 'Documents',     href: '/candidate/documents',     icon: <FileText className="h-4 w-4" /> },
    { label: 'Certifications',href: '/candidate/certifications',icon: <Award className="h-4 w-4" /> },
    { label: 'Training',      href: '/candidate/training',      icon: <BookOpen className="h-4 w-4" /> },
    { label: 'Recognition',   href: '/candidate/recognition',   icon: <Award className="h-4 w-4" /> },
    { label: 'Job Market',    href: '/candidate/applications',  icon: <Briefcase className="h-4 w-4" /> },
    { label: 'Visa',          href: '/candidate/visa',          icon: <MapPin className="h-4 w-4" /> },
    { label: 'Network',       href: '/candidate/network',       icon: <Network className="h-4 w-4" /> },
    { label: 'Welfare',       href: '/candidate/welfare',       icon: <LifeBuoy className="h-4 w-4" /> },
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
    { label: 'Dashboard',  href: '/facilitator/dashboard',  icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Candidates', href: '/facilitator/candidates', icon: <Users className="h-4 w-4" /> },
    { label: 'Recognition',href: '/facilitator/recognition',icon: <Award className="h-4 w-4" /> },
    { label: 'Visa Cases', href: '/facilitator/visa',       icon: <MapPin className="h-4 w-4" /> },
    { label: 'Welfare',    href: '/facilitator/welfare',    icon: <LifeBuoy className="h-4 w-4" /> },
  ],
  government: [
    { label: 'Dashboard', href: '/government/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Pipeline',  href: '/government/pipeline',  icon: <Route className="h-4 w-4" /> },
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

  if (!user) return <div className="p-8 text-center text-white" style={{ background: '#07142B' }}>Loading…</div>;

  const navItems = roleNavMap[user.role] || [];

  return (
    <div className="min-h-screen flex" style={{ background: '#07142B' }}>
      {/* ── Sidebar ── */}
      <aside
        className="w-60 flex flex-col hidden md:flex fixed h-full z-10"
        style={{ background: '#07142B', borderRight: '1px solid rgba(255,157,0,0.12)' }}
      >
        {/* Logo */}
        <div className="p-5 pb-4">
          <div className="flex items-center gap-2.5 mb-7">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ background: '#FF9D00', color: '#07142B' }}>
              IG
            </div>
            <span className="font-bold text-base tracking-tight text-white">Indo German</span>
          </div>

          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = location === item.href || location.startsWith(`${item.href}/`);
              const isAI = item.label.startsWith('AI');
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${
                      isActive ? 'font-semibold' : 'hover:opacity-90'
                    }`}
                    style={
                      isActive
                        ? { background: 'rgba(255,157,0,0.15)', color: '#FF9D00', borderLeft: '3px solid #FF9D00' }
                        : { color: '#B8C4D9', borderLeft: '3px solid transparent' }
                    }
                  >
                    <span style={{ color: isActive ? '#FF9D00' : isAI ? '#8B5CF6' : '#B8C4D9' }}>{item.icon}</span>
                    <span>{item.label}</span>
                    {isAI && !isActive && (
                      <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6' }}>AI</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom user section */}
        <div className="mt-auto p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback style={{ background: 'rgba(255,157,0,0.2)', color: '#FF9D00', fontSize: 13 }}>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs capitalize truncate" style={{ color: '#B8C4D9' }}>{user.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all hover:opacity-80"
            style={{ color: '#B8C4D9', background: 'rgba(255,255,255,0.04)' }}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 md:ml-60 min-h-screen" style={{ background: '#07142B' }}>
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <AIChatPopup />
    </div>
  );
}
