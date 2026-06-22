import React, { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Users, TrendingUp, Award, MapPin } from 'lucide-react';

const BG    = '#0F0520';
const CARD  = '#1A0B3B';
const CARD2 = '#130828';
const ACCENT = '#A855F7';
const BORDER = 'rgba(168,85,247,0.15)';
const TEXT2  = '#C4B5FD';

/* ── District data with approximate SVG geo positions ── */
const DISTRICTS = [
  /* name           cands  placed  rate  lang  sector          svgX  svgY */
  { name: 'Nashik',       c: 687,  p: 187, r: 81, l: 'B1', s: 'Electricians', x: 178, y: 110 },
  { name: 'Thane',        c: 598,  p: 142, r: 69, l: 'A2', s: 'IT Services',  x: 120, y: 195 },
  { name: 'Mumbai City',  c: 892,  p: 198, r: 68, l: 'A2', s: 'Healthcare',   x: 105, y: 225 },
  { name: 'Ahmednagar',   c: 398,  p:  87, r: 71, l: 'A2', s: 'Agriculture',  x: 220, y: 220 },
  { name: 'Aurangabad',   c: 534,  p: 128, r: 76, l: 'A1', s: 'Manufacturing',x: 280, y: 175 },
  { name: 'Jalgaon',      c: 287,  p:  69, r: 74, l: 'A2', s: 'Electricians', x: 295, y: 105 },
  { name: 'Pune',         c: 1245, p: 312, r: 72, l: 'B1', s: 'Automotive',   x: 185, y: 275 },
  { name: 'Solapur',      c: 487,  p: 118, r: 78, l: 'A1', s: 'Textiles',     x: 252, y: 310 },
  { name: 'Satara',       c: 367,  p:  92, r: 85, l: 'B2', s: 'Nursing',      x: 178, y: 330 },
  { name: 'Sangli',       c: 342,  p:  77, r: 79, l: 'B1', s: 'Healthcare',   x: 178, y: 365 },
  { name: 'Kolhapur',     c: 423,  p: 104, r: 83, l: 'B1', s: 'Engineering',  x: 155, y: 400 },
  { name: 'Latur',        c: 298,  p:  61, r: 66, l: 'A1', s: 'Construction', x: 310, y: 335 },
  { name: 'Nanded',       c: 243,  p:  48, r: 68, l: 'A1', s: 'Caregivers',   x: 350, y: 295 },
  { name: 'Amravati',     c: 276,  p:  58, r: 72, l: 'A2', s: 'Hospitality',  x: 395, y: 150 },
  { name: 'Nagpur',       c: 623,  p: 154, r: 74, l: 'B1', s: 'Automotive',   x: 450, y: 165 },
] as const;

type District = typeof DISTRICTS[number];

/* ── color from rate ── */
function rateColor(r: number): string {
  if (r >= 83) return '#00C853';
  if (r >= 78) return '#34D399';
  if (r >= 73) return '#A855F7';
  if (r >= 68) return '#818CF8';
  return '#F59E0B';
}

function rateLabel(r: number) {
  if (r >= 83) return 'Excellent';
  if (r >= 78) return 'Great';
  if (r >= 73) return 'Good';
  if (r >= 68) return 'Average';
  return 'Below Avg';
}

/* ── radius scales with candidate count ── */
function radius(c: number) {
  return 10 + (c / 1245) * 22;
}

/* ── edges between geographically adjacent districts ── */
const EDGES: [string, string][] = [
  ['Mumbai City', 'Thane'],
  ['Thane', 'Nashik'],
  ['Nashik', 'Ahmednagar'],
  ['Nashik', 'Aurangabad'],
  ['Nashik', 'Jalgaon'],
  ['Jalgaon', 'Aurangabad'],
  ['Aurangabad', 'Ahmednagar'],
  ['Aurangabad', 'Nanded'],
  ['Aurangabad', 'Latur'],
  ['Ahmednagar', 'Pune'],
  ['Pune', 'Solapur'],
  ['Pune', 'Satara'],
  ['Satara', 'Sangli'],
  ['Satara', 'Solapur'],
  ['Sangli', 'Kolhapur'],
  ['Solapur', 'Latur'],
  ['Latur', 'Nanded'],
  ['Nanded', 'Amravati'],
  ['Amravati', 'Nagpur'],
  ['Nagpur', 'Nanded'],
];

function getPos(name: string) {
  return DISTRICTS.find(d => d.name === name)!;
}

export function MaharashtraMap() {
  const [hovered, setHovered] = useState<District | null>(null);
  const [tooltip, setTooltip] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<District | null>(null);

  const totalCandidates = DISTRICTS.reduce((s, d) => s + d.c, 0);
  const totalPlaced     = DISTRICTS.reduce((s, d) => s + d.p, 0);
  const avgRate         = Math.round(DISTRICTS.reduce((s, d) => s + d.r, 0) / DISTRICTS.length);

  const handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
    const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
    setTooltip({ x: e.clientX - rect.left + 14, y: e.clientY - rect.top - 10 });
  };

  return (
    <div className="space-y-6" style={{ background: BG }}>
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/government/dashboard">
          <button className="mt-1 p-2 rounded-xl transition-all hover:opacity-80 flex-shrink-0"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <ArrowLeft className="w-4 h-4" style={{ color: TEXT2 }} />
          </button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-lg">📍</span>
            <h1 className="text-2xl font-black text-white">Maharashtra — District Intelligence Map</h1>
          </div>
          <p className="text-sm" style={{ color: TEXT2 }}>Indo-German Mobility Corridor · Top 15 contributing districts · Bubble size = candidate count · Color = placement rate</p>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Users className="w-5 h-5" />, label: 'Total Candidates',  val: totalCandidates.toLocaleString(), color: ACCENT },
          { icon: <TrendingUp className="w-5 h-5" />, label: 'Total Placed', val: totalPlaced.toLocaleString(),     color: '#34D399' },
          { icon: <Award className="w-5 h-5" />, label: 'Avg Placement Rate',val: `${avgRate}%`,                    color: '#818CF8' },
        ].map((k, i) => (
          <div key={i} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: CARD, border: `1px solid ${k.color}20` }}>
            <div className="p-2.5 rounded-xl flex-shrink-0" style={{ background: `${k.color}18`, color: k.color }}>
              {k.icon}
            </div>
            <div>
              <div className="text-2xl font-black" style={{ color: k.color }}>{k.val}</div>
              <div className="text-xs" style={{ color: TEXT2 }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Map */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden relative" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="px-5 pt-5 pb-3">
            <div className="font-bold text-white text-sm mb-0.5">Interactive Geo Map</div>
            <div className="text-xs" style={{ color: TEXT2 }}>Hover over a district to see details · Click to pin</div>
          </div>

          <div className="relative px-4 pb-4">
            <svg
              viewBox="0 0 570 470"
              className="w-full"
              style={{ cursor: 'default', maxHeight: 420 }}
              onMouseMove={handleMouseMove}
            >
              {/* Subtle state outline hint */}
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#2D0F5A" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0F0520" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background atmosphere */}
              <ellipse cx="285" cy="235" rx="260" ry="210" fill="url(#bgGrad)" />

              {/* State label */}
              <text x="285" y="30" textAnchor="middle" fill="rgba(196,181,253,0.25)" fontSize="13" fontWeight="800" letterSpacing="3">
                MAHARASHTRA
              </text>

              {/* Compass */}
              <g transform="translate(520, 40)">
                <text textAnchor="middle" y="-8" fill="rgba(196,181,253,0.4)" fontSize="9" fontWeight="600">N</text>
                <line x1="0" y1="-5" x2="0" y2="5" stroke="rgba(196,181,253,0.25)" strokeWidth="1" />
                <line x1="-5" y1="0" x2="5" y2="0" stroke="rgba(196,181,253,0.25)" strokeWidth="1" />
              </g>

              {/* Edges (geographic adjacency lines) */}
              {EDGES.map(([a, b], i) => {
                const da = getPos(a), db = getPos(b);
                if (!da || !db) return null;
                const isActive = hovered?.name === a || hovered?.name === b || selected?.name === a || selected?.name === b;
                return (
                  <line key={i}
                    x1={da.x} y1={da.y} x2={db.x} y2={db.y}
                    stroke={isActive ? 'rgba(168,85,247,0.4)' : 'rgba(168,85,247,0.1)'}
                    strokeWidth={isActive ? 1.5 : 0.8}
                    strokeDasharray={isActive ? 'none' : '4 3'}
                  />
                );
              })}

              {/* District bubbles */}
              {DISTRICTS.map((d) => {
                const r = radius(d.c);
                const col = rateColor(d.r);
                const isHov = hovered?.name === d.name;
                const isSel = selected?.name === d.name;
                const isActive = isHov || isSel;
                return (
                  <g key={d.name}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHovered(d)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelected(prev => prev?.name === d.name ? null : d)}
                  >
                    {/* Outer glow ring when active */}
                    {isActive && (
                      <circle cx={d.x} cy={d.y} r={r + 7}
                        fill="none" stroke={col} strokeWidth="2" opacity="0.35"
                        style={{ filter: 'url(#glow)' }} />
                    )}
                    {/* Selection pulse ring */}
                    {isSel && (
                      <circle cx={d.x} cy={d.y} r={r + 12}
                        fill="none" stroke={col} strokeWidth="1" opacity="0.2" />
                    )}
                    {/* Main bubble */}
                    <circle cx={d.x} cy={d.y} r={r}
                      fill={col}
                      fillOpacity={isActive ? 0.95 : 0.7}
                      stroke={col}
                      strokeWidth={isActive ? 2 : 1}
                      style={{ transition: 'all 0.15s ease' }}
                    />
                    {/* Inner shimmer */}
                    <circle cx={d.x - r * 0.25} cy={d.y - r * 0.3} r={r * 0.22}
                      fill="white" fillOpacity="0.15" />

                    {/* District name */}
                    <text x={d.x} y={d.y - r - 6}
                      textAnchor="middle" fill="#E8E5F5"
                      fontSize={isActive ? 11 : 10}
                      fontWeight={isActive ? '800' : '600'}
                      style={{ userSelect: 'none', textShadow: '0 1px 3px #0F0520' }}
                    >
                      {d.name}
                    </text>
                    {/* Rate label inside bubble */}
                    {r > 14 && (
                      <text x={d.x} y={d.y + 4}
                        textAnchor="middle" fill="white"
                        fontSize={r > 20 ? 10 : 8}
                        fontWeight="800"
                        style={{ userSelect: 'none' }}
                      >
                        {d.r}%
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Hover tooltip inside SVG */}
              {hovered && (
                <g transform={`translate(${Math.min(tooltip.x, 380)}, ${Math.min(tooltip.y, 360)})`}>
                  <rect x="0" y="0" width="155" height="90" rx="10" ry="10"
                    fill="#1A0B3B" stroke={rateColor(hovered.r)} strokeWidth="1.5" opacity="0.97" />
                  <text x="10" y="20" fill="white" fontSize="12" fontWeight="800">{hovered.name}</text>
                  <text x="10" y="35" fill="#C4B5FD" fontSize="9">{hovered.s} · Lang {hovered.l}</text>
                  <text x="10" y="52" fill="#C4B5FD" fontSize="9">Candidates</text>
                  <text x="100" y="52" fill="white" fontSize="10" fontWeight="700">{hovered.c.toLocaleString()}</text>
                  <text x="10" y="67" fill="#C4B5FD" fontSize="9">Placed in Germany</text>
                  <text x="100" y="67" fill="#34D399" fontSize="10" fontWeight="700">{hovered.p.toLocaleString()}</text>
                  <text x="10" y="82" fill="#C4B5FD" fontSize="9">Placement Rate</text>
                  <text x="100" y="82" fill={rateColor(hovered.r)} fontSize="10" fontWeight="800">{hovered.r}%</text>
                </g>
              )}
            </svg>

            {/* Legend */}
            <div className="flex items-center gap-4 px-2 pb-1 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: TEXT2 }}>Placement Rate</span>
              {[
                { col: '#F59E0B', label: '<68%' },
                { col: '#818CF8', label: '68–72%' },
                { col: '#A855F7', label: '73–77%' },
                { col: '#34D399', label: '78–82%' },
                { col: '#00C853', label: '83%+' },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: l.col }} />
                  <span className="text-[10px]" style={{ color: TEXT2 }}>{l.label}</span>
                </div>
              ))}
              <span className="text-[10px] ml-auto" style={{ color: TEXT2 }}>Bubble size = candidate count</span>
            </div>
          </div>
        </div>

        {/* Side panel — selected district detail OR ranked list */}
        <div className="flex flex-col gap-4">
          {selected ? (
            <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${rateColor(selected.r)}30` }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <MapPin className="w-4 h-4" style={{ color: rateColor(selected.r) }} />
                    <span className="font-black text-white text-lg">{selected.name}</span>
                  </div>
                  <div className="text-xs" style={{ color: TEXT2 }}>{selected.s} · Language Level {selected.l}</div>
                </div>
                <button onClick={() => setSelected(null)} className="text-xs px-2 py-1 rounded-lg" style={{ background: CARD2, color: TEXT2 }}>✕</button>
              </div>

              {/* Radial rate */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  {(() => {
                    const r2 = 34, circ = 2 * Math.PI * r2, offset = circ - (selected.r / 100) * circ;
                    return (
                      <svg width="80" height="80" className="transform -rotate-90">
                        <circle cx="40" cy="40" r={r2} stroke="rgba(255,255,255,0.06)" strokeWidth="7" fill="none" />
                        <circle cx="40" cy="40" r={r2} stroke={rateColor(selected.r)} strokeWidth="7" fill="none"
                          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
                      </svg>
                    );
                  })()}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-black text-white">{selected.r}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ color: TEXT2 }}>Placement Rate</div>
                  <div className="font-black text-lg" style={{ color: rateColor(selected.r) }}>{rateLabel(selected.r)}</div>
                  <div className="text-xs mt-1" style={{ color: TEXT2 }}>Top sector: {selected.s}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Registered',      val: selected.c.toLocaleString(), color: ACCENT },
                  { label: 'Placed in 🇩🇪',  val: selected.p.toLocaleString(), color: '#34D399' },
                  { label: 'Language Level',  val: selected.l,                  color: '#818CF8' },
                  { label: 'Primary Sector',  val: selected.s,                  color: '#F59E0B' },
                ].map((s2, i) => (
                  <div key={i} className="rounded-xl p-3 text-center" style={{ background: CARD2 }}>
                    <div className="font-black text-base" style={{ color: s2.color }}>{s2.val}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: TEXT2 }}>{s2.label}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: TEXT2 }}>Top Districts by Rate</div>
              <div className="space-y-2">
                {[...DISTRICTS].sort((a, b) => b.r - a.r).slice(0, 6).map((d, i) => {
                  const rankCol = i === 0 ? '#F59E0B' : i === 1 ? '#9CA3AF' : i === 2 ? '#CD7F32' : TEXT2;
                  return (
                    <button key={d.name} onClick={() => setSelected(d)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl transition-all hover:scale-[1.01] text-left"
                      style={{ background: CARD2, border: `1px solid ${rateColor(d.r)}20` }}>
                      <span className="text-sm font-black w-5 text-center" style={{ color: rankCol }}>#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white truncate">{d.name}</div>
                        <div className="text-[10px]" style={{ color: TEXT2 }}>{d.p} placed · {d.s}</div>
                      </div>
                      <span className="text-sm font-black flex-shrink-0" style={{ color: rateColor(d.r) }}>{d.r}%</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom stats */}
          <div className="rounded-2xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: TEXT2 }}>Sector Distribution</div>
            {(() => {
              const sectorMap: Record<string, number> = {};
              DISTRICTS.forEach(d => { sectorMap[d.s] = (sectorMap[d.s] || 0) + d.c; });
              const sorted = Object.entries(sectorMap).sort((a, b) => b[1] - a[1]);
              const total2 = sorted.reduce((s, [, v]) => s + v, 0);
              const colors = [ACCENT, '#818CF8', '#34D399', '#F59E0B', '#C084FC', '#06B6D4', '#EF4444', '#10B981'];
              return sorted.map(([sector, count], i) => (
                <div key={sector} className="mb-2">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span style={{ color: TEXT2 }}>{sector}</span>
                    <span style={{ color: colors[i] }}>{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(count / total2) * 100}%`, background: colors[i] }} />
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
