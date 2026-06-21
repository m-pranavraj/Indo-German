import React, { useState } from 'react';
import { Network, Users, MapPin, Star, MessageCircle, TrendingUp, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const CARD = '#1A0B3B';
const CARD2 = '#130828';
const ACCENT = '#A855F7';
const SUCCESS = '#00C853';
const PURPLE = '#C084FC';
const BLUE = '#818CF8';
const BORDER = 'rgba(168,85,247,0.15)';
const TEXT2 = '#C4B5FD';

const SIMILAR_PROFILES = [
  {
    id: 1, name: 'Vikram Nair', occupation: 'Automotive Mechanic (Kfz-Mechatroniker)',
    city: 'Kochi, Kerala', stage: 'Employer Matching', readiness: 85,
    experience: 5, germanLevel: 'B1', education: 'Diploma in Auto Engg.',
    matchReason: 'Same occupation and B1 language level',
    tags: ['Automotive', 'EV Systems', 'B1 Certified'], color: ACCENT, connected: false
  },
  {
    id: 2, name: 'Suresh Kumar', occupation: 'Automotive Mechanic',
    city: 'Chennai, Tamil Nadu', stage: 'Language Training (B1)',
    readiness: 71, experience: 3, germanLevel: 'A2', education: 'ITI Certificate',
    matchReason: 'Same trade — 3 months ahead in journey',
    tags: ['Automotive', 'Diagnostics', 'A2→B1'], color: BLUE, connected: true
  },
  {
    id: 3, name: 'Rajesh Menon', occupation: 'Kfz-Mechatroniker',
    city: 'Pune, Maharashtra', stage: 'Visa Processing',
    readiness: 94, experience: 6, germanLevel: 'B2', education: 'Diploma + IHK Recognition',
    matchReason: '8 months ahead — can mentor your journey',
    tags: ['IHK Recognized', 'B2', 'EU Blue Card'], color: SUCCESS, connected: false
  },
  {
    id: 4, name: 'Anand Pillai', occupation: 'Automotive Tech',
    city: 'Thrissur, Kerala', stage: 'Qualification Recognition',
    readiness: 61, experience: 4, germanLevel: 'A2', education: 'Diploma in Mechanical',
    matchReason: 'Similar education background and occupation',
    tags: ['Recognition Pending', 'ZAB Filed', 'Automotive'], color: PURPLE, connected: false
  },
  {
    id: 5, name: 'Dinesh Rao', occupation: 'Mechanic → Germany (Arrived)',
    city: 'Stuttgart, Germany 🇩🇪', stage: '✅ Migrated — Working',
    readiness: 100, experience: 7, germanLevel: 'B2', education: 'Diploma + 2 German certs',
    matchReason: 'Successfully migrated — same occupation',
    tags: ['In Germany', 'B2', 'Bosch GmbH', 'Mentor'], color: SUCCESS, connected: false
  },
  {
    id: 6, name: 'Preethi Sharma', occupation: 'Auto Electronics Specialist',
    city: 'Hyderabad, Telangana', stage: 'Employer Matching',
    readiness: 79, experience: 5, germanLevel: 'B1', education: 'B.Tech Electronics',
    matchReason: 'Similar skill set and readiness score',
    tags: ['Electronics', 'B1 Certified', 'Women in Auto'], color: '#EC4899', connected: true
  },
];

const COMMUNITY_POSTS = [
  { id: 1, author: 'Rajesh Menon', avatar: 'R', time: '2h ago', post: 'Just received my EU Blue Card! The VFS Pune process was smooth — took exactly 6 weeks. Happy to answer questions for anyone preparing their application! 🎉', likes: 42, role: 'Visa Processing' },
  { id: 2, author: 'Dinesh Rao', avatar: 'D', time: '1 day ago', post: 'Working at Bosch Stuttgart for 3 months now. Salary comes on time, team is welcoming, and Germany is beautiful. Pro tip: Open your German bank account the FIRST day you arrive (Meldepflicht required). 🇩🇪', likes: 87, role: 'In Germany' },
  { id: 3, author: 'Suresh Kumar', avatar: 'S', time: '3 days ago', post: 'Passed my Goethe B1 exam in first attempt! Key tip: Focus on the "Schreiben" (writing) part — that\'s where most candidates lose marks. Use the past 5 exam papers from Goethe website. 📚', likes: 156, role: 'Language Training' },
];

export function CandidateNetwork() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'same-trade' | 'ahead' | 'in-germany'>('all');
  const [connected, setConnected] = useState<Set<number>>(new Set([2, 6]));
  const [activeTab, setActiveTab] = useState<'similar' | 'community'>('similar');
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const filteredProfiles = SIMILAR_PROFILES.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.occupation.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ? true : filter === 'in-germany' ? p.city.includes('Germany') : filter === 'same-trade' ? p.occupation.includes('Mechanic') || p.occupation.includes('Auto') : p.readiness > 80;
    return matchSearch && matchFilter;
  });

  const handleConnect = (id: number) => {
    setConnected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleLike = (id: number) => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 min-h-screen" style={{ background: '#0F0520' }}>
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <Network className="w-7 h-7" style={{ color: ACCENT }} />
          Candidate Network
        </h1>
        <p className="mt-1" style={{ color: TEXT2 }}>Connect with similar candidates, learn from those ahead, and get mentored by those already in Germany.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Similar to You', value: '23', icon: <Users className="w-4 h-4" />, color: ACCENT },
          { label: 'Same Trade', value: '8', icon: <Network className="w-4 h-4" />, color: BLUE },
          { label: 'Ahead in Journey', value: '11', icon: <TrendingUp className="w-4 h-4" />, color: PURPLE },
          { label: 'In Germany', value: '4', icon: <MapPin className="w-4 h-4" />, color: SUCCESS },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg" style={{ background: `${s.color}18` }}>
                <div style={{ color: s.color }}>{s.icon}</div>
              </div>
            </div>
            <div className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: TEXT2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2">
        <button onClick={() => setActiveTab('similar')}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ background: activeTab === 'similar' ? ACCENT : CARD2, color: activeTab === 'similar' ? '#0F0520' : TEXT2, border: `1px solid ${activeTab === 'similar' ? ACCENT : BORDER}` }}>
          👥 Similar Profiles
        </button>
        <button onClick={() => setActiveTab('community')}
          className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{ background: activeTab === 'community' ? ACCENT : CARD2, color: activeTab === 'community' ? '#0F0520' : TEXT2, border: `1px solid ${activeTab === 'community' ? ACCENT : BORDER}` }}>
          💬 Community Posts
        </button>
      </div>

      {activeTab === 'similar' && (
        <>
          {/* Search + Filter */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: TEXT2 }} />
              <Input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, trade, or city…"
                className="pl-10 text-white placeholder:text-purple-300 border"
                style={{ background: CARD, borderColor: 'rgba(255,255,255,0.1)' }} />
            </div>
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'same-trade', label: 'Same Trade' },
                { id: 'ahead', label: 'Ahead of Me' },
                { id: 'in-germany', label: 'In Germany' },
              ].map(f => (
                <button key={f.id} onClick={() => setFilter(f.id as any)}
                  className="px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all"
                  style={{ background: filter === f.id ? 'rgba(168,85,247,0.2)' : CARD2, color: filter === f.id ? ACCENT : TEXT2, border: `1px solid ${filter === f.id ? ACCENT : BORDER}` }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProfiles.map(profile => {
              const isConnected = connected.has(profile.id);
              return (
                <div key={profile.id} className="rounded-2xl p-5 transition-all hover:border-[#A855F7]/40"
                  style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                        style={{ background: `${profile.color}20`, color: profile.color, fontSize: 16 }}>
                        {profile.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{profile.name}</div>
                        <div className="text-xs" style={{ color: TEXT2 }}>{profile.city}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black" style={{ color: profile.color }}>{profile.readiness}%</div>
                      <div className="text-[10px]" style={{ color: TEXT2 }}>Match</div>
                    </div>
                  </div>

                  {/* Occupation */}
                  <div className="text-xs font-semibold mb-2" style={{ color: profile.color }}>{profile.occupation}</div>

                  {/* Stage badge */}
                  <div className="text-xs px-2 py-1 rounded-full inline-block mb-3"
                    style={{ background: `${profile.color}15`, color: profile.color, border: `1px solid ${profile.color}30` }}>
                    {profile.stage}
                  </div>

                  {/* Match reason */}
                  <div className="text-xs mb-3 p-2 rounded-lg" style={{ background: CARD2, color: TEXT2 }}>
                    💡 {profile.matchReason}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {profile.tags.map((tag, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(255,255,255,0.06)', color: TEXT2 }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Details row */}
                  <div className="flex gap-3 text-xs mb-4" style={{ color: TEXT2 }}>
                    <span>🗓️ {profile.experience}yr exp</span>
                    <span>🇩🇪 {profile.germanLevel}</span>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleConnect(profile.id)}
                    className="w-full py-2 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: isConnected ? 'rgba(0,200,83,0.15)' : `${profile.color}20`,
                      color: isConnected ? SUCCESS : profile.color,
                      border: `1px solid ${isConnected ? SUCCESS + '40' : profile.color + '30'}`,
                    }}>
                    {isConnected ? '✅ Connected' : profile.city.includes('Germany') ? '🤝 Request Mentorship' : '👋 Connect'}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'community' && (
        <div className="space-y-4">
          {COMMUNITY_POSTS.map(post => {
            const isLiked = liked.has(post.id);
            return (
              <div key={post.id} className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0"
                    style={{ background: 'rgba(168,85,247,0.2)', color: ACCENT }}>
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{post.author}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(168,85,247,0.1)', color: ACCENT }}>{post.role}</span>
                      <span className="text-xs" style={{ color: TEXT2 }}>{post.time}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: '#E8EDF5' }}>{post.post}</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1.5 text-xs transition-all"
                    style={{ color: isLiked ? ACCENT : TEXT2 }}>
                    <Star className="w-4 h-4" fill={isLiked ? ACCENT : 'none'} />
                    {post.likes + (isLiked ? 1 : 0)} helpful
                  </button>
                  <button className="flex items-center gap-1.5 text-xs" style={{ color: TEXT2 }}>
                    <MessageCircle className="w-4 h-4" /> Reply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
