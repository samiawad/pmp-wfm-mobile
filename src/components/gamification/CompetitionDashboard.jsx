import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, Chip, LinearProgress,
    SwipeableDrawer, List, ListItem, ListItemButton, Radio, styled, Tooltip,
} from '@mui/material';
import MilestoneTrack from './MilestoneTrack';
import CelebrationOverlay from './CelebrationOverlay';
import {
    StarRate as StarIcon, ExpandMore as DropdownIcon,
    InfoOutlined as InfoIcon, EmojiEvents as TrophyIcon,
    CheckCircle as CheckIcon, CardGiftcard as GiftIcon,
    LocalFireDepartment as FireIcon, Diamond as DiamondIcon,
    BrushOutlined as DesignIcon, Lock as LockIcon,
    WorkspacePremium as BadgeIcon,
} from '@mui/icons-material';

// ─── Shared ────────────────────────────────────────────────────────────────
const DashboardContainer = styled(Box)(({ theme }) => ({
    display: 'flex', flexDirection: 'column', gap: theme.spacing(4), maxWidth: 1200, margin: '0 auto',
}));
const DropdownTrigger = styled(Box)({
    height: 32, display: 'flex', alignItems: 'center', gap: 6,
    padding: '0 12px 0 8px', borderRadius: 20, backgroundColor: '#fff',
    border: '1px solid #c4c4c4', cursor: 'pointer', color: 'var(--text-primary)',
    fontWeight: 500, fontSize: '0.75rem', whiteSpace: 'nowrap', flexShrink: 0,
    '&:hover': { borderColor: '#212121', backgroundColor: '#fafafa' },
});
const DragHandle = styled(Box)({ width: 36, height: 4, borderRadius: 2, backgroundColor: '#d0d0d0', margin: '12px auto 8px' });

// ─── Mock Data ─────────────────────────────────────────────────────────────
const competitionsData = [
    {
        id: 'c1', title: 'Dawn of Heroes', type: 'active', currentXP: 4350,
        milestones: Array.from({ length: 11 }).map((_, i) => ({
            id: i, requiredXP: i * 1000, title: `Milestone ${i}`,
            reward: i % 3 === 0 ? 'Legendary Chest' : 'Gold Coins',
            isAchieved: 4350 >= i * 1000, iconUrl: null,
        })),
    },
    {
        id: 'c2', title: 'Q1 Sales Championship', type: 'active', currentXP: 1200,
        milestones: Array.from({ length: 6 }).map((_, i) => ({
            id: i, requiredXP: i * 800, title: `Stage ${i}`, reward: 'Silver Badge',
            isAchieved: 1200 >= i * 800, iconUrl: null,
        })),
    },
    {
        id: 'c3', title: 'Annual Support Heroes', type: 'available', participants: 210,
        endDate: 'Dec 31, 2026', currentXP: 0,
        description: 'Year-long competition for overall support excellence. Join now and start earning points.',
        milestones: Array.from({ length: 5 }).map((_, i) => ({
            id: i, requiredXP: i * 2000, title: `Tier ${i}`, reward: 'Diamond Trophy',
            isAchieved: false, iconUrl: null,
        })),
    },
];

const designVariants = [
    { id: 0, label: 'Sample 1 – Original (Blue Hero)' },
    { id: 1, label: 'Sample 2 – Dark Galaxy' },
    { id: 2, label: 'Sample 3 – Neon RPG' },
    { id: 3, label: 'Sample 4 – Minimal Card' },
    { id: 4, label: 'Sample 5 – Warm Trophy' },
    { id: 5, label: 'Sample 6 – Glass Morphism' },
];

// ═══════════════════════════════════════════════════════════════════
// UPPER CARD SAMPLES
// ═══════════════════════════════════════════════════════════════════

// Sample 0 – Original Blue Hero (restored)
const Card0 = ({ comp, xp, next, needed, onSim }) => (
    <Paper sx={{
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)',
        borderRadius: '24px', p: 4, color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
        <Box sx={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, letterSpacing: 3 }}>{comp.title}</Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: '#fff', my: 1 }}>
            Level {Math.floor(xp / 1000)}
        </Typography>
        <Typography variant="h6" sx={{ color: '#fff' }}>
            <StarIcon sx={{ color: '#FFD700', verticalAlign: 'middle', mr: 0.5, mb: 0.5 }} />
            {xp.toLocaleString()} / {next ? next.requiredXP.toLocaleString() : 'Max'} XP
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
            {needed > 0 ? `${needed.toLocaleString()} XP away from next milestone` : 'Max Milestone Reached!'}
        </Typography>
        <Button variant="contained" sx={{ mt: 3, borderRadius: 8, bgcolor: '#fff', color: 'var(--primary-color)', fontWeight: 'bold', '&:hover': { bgcolor: '#f0f0f0' } }}
            onClick={onSim} disabled={comp.type === 'available'}>
            {comp.type === 'available' ? 'Join to Earn XP' : 'Simulate Earn XP (700)'}
        </Button>
    </Paper>
);

// Sample 1 – Dark Galaxy
const Card1 = ({ comp, xp, next, needed, onSim }) => {
    const pct = next ? Math.min((xp / next.requiredXP) * 100, 100) : 100;
    return (
        <Box sx={{ background: 'linear-gradient(145deg,#0a0a1a,#0d1b4b,#1a0a3a)', borderRadius: 4, p: 3, color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
            {[...Array(18)].map((_, i) => (
                <Box key={i} sx={{ position: 'absolute', width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.6)', top: `${(i * 37 + 7) % 95}%`, left: `${(i * 53 + 11) % 95}%` }} />
            ))}
            <Box sx={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,215,0,0.15),transparent 70%)' }} />
            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <Chip label={comp.title.toUpperCase()} size="small" sx={{ bgcolor: 'rgba(255,215,0,0.15)', color: '#FFD700', fontWeight: 700, fontSize: '0.6rem', letterSpacing: 2, mb: 2, border: '1px solid rgba(255,215,0,0.4)' }} />
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2, width: 110, height: 110 }}>
                    {(() => {
                        const r = 48, cx = 55, cy = 55, circ = 2 * Math.PI * r;
                        const offset = circ - (pct / 100) * circ;
                        return (
                            <svg width="110" height="110" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
                                {/* track */}
                                <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" />
                                {/* progress arc */}
                                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FFD700" strokeWidth="5"
                                    strokeLinecap="round"
                                    strokeDasharray={circ}
                                    strokeDashoffset={offset}
                                    style={{ filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.85))', transition: 'stroke-dashoffset 0.6s ease' }}
                                />
                            </svg>
                        );
                    })()}
                    <Box sx={{ inset: 0, position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.6)', letterSpacing: 1 }}>LEVEL</Typography>
                        <Typography sx={{ fontWeight: 900, fontSize: '1.6rem', lineHeight: 1 }}>{Math.floor(xp / 1000)}</Typography>
                    </Box>
                </Box>
                <Typography sx={{ color: '#FFD700', fontWeight: 700, fontSize: '1rem', mb: 0.5 }}>⭐ {xp.toLocaleString()} / {next?.requiredXP.toLocaleString() ?? 'MAX'} XP</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', mb: 2.5 }}>{needed > 0 ? `${needed.toLocaleString()} XP to next milestone` : '🎉 Max reached!'}</Typography>
                <Button variant="outlined" onClick={onSim} disabled={comp.type === 'available'} sx={{ borderColor: '#FFD700', color: '#FFD700', fontWeight: 700, borderRadius: 6, fontSize: '0.75rem', '&:hover': { bgcolor: 'rgba(255,215,0,0.1)', borderColor: '#FFD700' } }}>
                    {comp.type === 'available' ? 'Join to Earn XP' : '✦ Simulate Earn XP (700)'}
                </Button>
            </Box>
        </Box>
    );
};

// Sample 2 – Neon RPG
const Card2 = ({ comp, xp, next, needed, onSim }) => {
    const pct = next ? Math.min((xp / next.requiredXP) * 100, 100) : 100;
    return (
        <Paper sx={{ background: '#0e0e1a', borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(138,43,226,0.4)', boxShadow: '0 0 30px rgba(138,43,226,0.2)' }}>
            <Box sx={{ height: 4, background: 'linear-gradient(90deg,#8a2be2,#00ffff,#ff00ff)' }} />
            <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography sx={{ fontSize: '0.6rem', color: '#00ffff', letterSpacing: 3, fontWeight: 700 }}>▶ COMPETITION</Typography>
                        <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>{comp.title}</Typography>
                    </Box>
                    <Box sx={{ width: 56, height: 56, borderRadius: 2, border: '2px solid #8a2be2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(138,43,226,0.6)', bgcolor: 'rgba(138,43,226,0.1)' }}>
                        <Typography sx={{ fontSize: '0.45rem', color: '#8a2be2', letterSpacing: 1, fontWeight: 700 }}>LVL</Typography>
                        <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', color: '#fff', lineHeight: 1 }}>{Math.floor(xp / 1000)}</Typography>
                    </Box>
                </Box>
                <Box sx={{ mb: 0.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography sx={{ fontSize: '0.65rem', color: '#00ffff', fontWeight: 700 }}>XP PROGRESS</Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{xp.toLocaleString()} / {next?.requiredXP.toLocaleString() ?? 'MAX'}</Typography>
                    </Box>
                    <Box sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ position: 'absolute', inset: '0 auto 0 0', width: `${pct}%`, background: 'linear-gradient(90deg,#8a2be2,#00ffff)', borderRadius: 5, boxShadow: '0 0 8px rgba(0,255,255,0.7)', transition: 'width 0.5s' }} />
                    </Box>
                </Box>
                <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', mb: 2 }}>{needed > 0 ? `⚡ ${needed.toLocaleString()} XP remaining` : '🏆 Max level!'}</Typography>
                <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
                    {[{ label: 'RANK', val: '#12' }, { label: 'STREAK', val: '5d' }, { label: 'BADGES', val: '7' }].map(s => (
                        <Box key={s.label} sx={{ flex: 1, py: 1, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(138,43,226,0.2)', textAlign: 'center' }}>
                            <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: '0.9rem' }}>{s.val}</Typography>
                            <Typography sx={{ fontSize: '0.55rem', color: '#8a2be2', letterSpacing: 1 }}>{s.label}</Typography>
                        </Box>
                    ))}
                </Box>
                <Button fullWidth onClick={onSim} disabled={comp.type === 'available'} sx={{ background: 'linear-gradient(135deg,#8a2be2,#ff00ff)', color: '#fff', fontWeight: 800, borderRadius: 2, fontSize: '0.8rem', py: 1.2, boxShadow: '0 4px 20px rgba(138,43,226,0.4)', '&:hover': { opacity: 0.9 }, '&:disabled': { opacity: 0.5, color: 'rgba(255,255,255,0.5)' } }}>
                    {comp.type === 'available' ? 'JOIN TO UNLOCK' : '⚡ SIMULATE +700 XP'}
                </Button>
            </Box>
        </Paper>
    );
};

// Sample 3 – Minimal Card
const Card3 = ({ comp, xp, next, needed, onSim }) => {
    const pct = next ? Math.min((xp / next.requiredXP) * 100, 100) : 100;
    const achieved = comp.milestones?.filter(m => m.isAchieved).length ?? 0;
    return (
        <Paper elevation={0} sx={{ bgcolor: '#fff', borderRadius: 4, overflow: 'hidden', border: '1px solid #ebebeb', boxShadow: '0 2px 20px rgba(0,0,0,0.07)' }}>
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ width: 6, bgcolor: 'var(--primary-color,#1976d2)', flexShrink: 0 }} />
                <Box sx={{ flex: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                        <Box>
                            <Typography sx={{ fontSize: '0.65rem', color: 'var(--text-secondary,#757575)', letterSpacing: 1, textTransform: 'uppercase', mb: 0.3 }}>Active Competition</Typography>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary,#212121)' }}>{comp.title}</Typography>
                        </Box>
                        <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'rgba(25,118,210,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography sx={{ fontSize: '0.5rem', color: 'var(--primary-color,#1976d2)', fontWeight: 700 }}>LV</Typography>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--primary-color,#1976d2)', lineHeight: 1 }}>{Math.floor(xp / 1000)}</Typography>
                        </Box>
                    </Box>
                    <Typography sx={{ fontSize: '0.7rem', color: 'var(--text-secondary)', mb: 0.8 }}>{xp.toLocaleString()} / {next?.requiredXP.toLocaleString() ?? 'MAX'} XP</Typography>
                    <LinearProgress variant="determinate" value={pct} sx={{ height: 6, borderRadius: 3, mb: 0.8, bgcolor: '#f0f0f0', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: 'var(--primary-color,#1976d2)' } }} />
                    <Typography sx={{ fontSize: '0.65rem', color: 'var(--text-secondary)', mb: 2 }}>{needed > 0 ? `${needed.toLocaleString()} XP to next milestone` : '✅ All milestones reached'}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                        <CheckIcon sx={{ fontSize: 18, color: '#4caf50' }} />
                        <Typography sx={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>{achieved} / {comp.milestones?.length} milestones complete</Typography>
                    </Box>
                    <Button variant="contained" fullWidth onClick={onSim} disabled={comp.type === 'available'} disableElevation sx={{ bgcolor: 'var(--primary-color,#1976d2)', borderRadius: 2, fontWeight: 700, fontSize: '0.8rem', '&:hover': { bgcolor: 'var(--primary-hover,#1565c0)' } }}>
                        {comp.type === 'available' ? 'Join to Earn XP' : 'Simulate Earn XP (700)'}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

// Sample 4 – Warm Trophy
const Card4 = ({ comp, xp, next, needed, onSim }) => {
    const pct = next ? Math.min((xp / next.requiredXP) * 100, 100) : 100;
    return (
        <Paper sx={{ background: 'linear-gradient(160deg,#ff8c00,#ff6600,#cc3300)', borderRadius: 4, p: 3, color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(255,100,0,0.35)' }}>
            <Box sx={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', top: -60, right: -60 }} />
            <Box sx={{ position: 'absolute', width: 120, height: 120, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', bottom: -40, left: -40 }} />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                    <Box sx={{ width: 64, height: 64, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.25)' }}>
                        <TrophyIcon sx={{ fontSize: 36, color: '#FFD700', filter: 'drop-shadow(0 2px 8px rgba(255,215,0,0.6))' }} />
                    </Box>
                    <Box>
                        <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.75)', letterSpacing: 2, fontWeight: 700 }}>COMPETITION</Typography>
                        <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>{comp.title}</Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <Box sx={{ px: 3, py: 1, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.3)', textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '0.55rem', letterSpacing: 3, color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>LEVEL</Typography>
                        <Typography sx={{ fontWeight: 900, fontSize: '2.2rem', lineHeight: 1 }}>{Math.floor(xp / 1000)}</Typography>
                    </Box>
                </Box>
                <Typography sx={{ textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', mb: 0.5 }}>
                    <FireIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />{xp.toLocaleString()} / {next?.requiredXP.toLocaleString() ?? 'MAX'} XP
                </Typography>
                <Typography sx={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)', mb: 2 }}>{needed > 0 ? `${needed.toLocaleString()} XP until next reward` : '🏆 All milestones achieved!'}</Typography>
                <Box sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.2)', mb: 3, position: 'relative', overflow: 'hidden' }}>
                    <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${pct}%`, bgcolor: '#FFD700', borderRadius: 4, boxShadow: '0 0 8px rgba(255,215,0,0.6)', transition: 'width 0.5s' }} />
                </Box>
                <Button fullWidth onClick={onSim} disabled={comp.type === 'available'} sx={{ bgcolor: '#fff', color: '#cc3300', fontWeight: 800, borderRadius: 3, fontSize: '0.8rem', py: 1.2, '&:hover': { bgcolor: '#ffe0cc' }, '&:disabled': { bgcolor: 'rgba(255,255,255,0.4)', color: 'rgba(255,255,255,0.7)' } }}>
                    {comp.type === 'available' ? 'Join to Earn XP' : '🔥 Simulate Earn XP (700)'}
                </Button>
            </Box>
        </Paper>
    );
};

// Sample 5 – Glass Morphism
const Card5 = ({ comp, xp, next, needed, onSim }) => {
    const pct = next ? Math.min((xp / next.requiredXP) * 100, 100) : 100;
    return (
        <Box sx={{ background: 'linear-gradient(135deg,#1de9b6,#1565c0,#6200ea)', borderRadius: 4, p: '2px', boxShadow: '0 8px 40px rgba(21,101,192,0.35)' }}>
            <Box sx={{ background: 'linear-gradient(135deg,#1de9b6,#1565c0,#6200ea)', borderRadius: '14px', p: 3, position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.08)', borderRadius: '14px' }} />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                        <Box>
                            <Typography sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)', letterSpacing: 2, fontWeight: 700 }}>ACTIVE SEASON</Typography>
                            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>{comp.title}</Typography>
                        </Box>
                        <Box sx={{ width: 48, height: 48, backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <DiamondIcon sx={{ color: '#fff', fontSize: 26, filter: 'drop-shadow(0 2px 6px rgba(255,255,255,0.5))' }} />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
                        {[{ label: 'LEVEL', val: Math.floor(xp / 1000) }, { label: 'YOUR XP', val: xp.toLocaleString() }, { label: 'NEXT AT', val: next?.requiredXP.toLocaleString() ?? 'MAX' }].map(s => (
                            <Box key={s.label} sx={{ flex: 1, backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 2, py: 1.2, px: 1, textAlign: 'center' }}>
                                <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>{s.val}</Typography>
                                <Typography sx={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.7)', letterSpacing: 1 }}>{s.label}</Typography>
                            </Box>
                        ))}
                    </Box>
                    <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.75)', mb: 0.8 }}>{needed > 0 ? `${needed.toLocaleString()} XP to next milestone` : '🎉 Max reached!'}</Typography>
                    <Box sx={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.2)', mb: 3, position: 'relative', overflow: 'hidden' }}>
                        <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${pct}%`, background: 'linear-gradient(90deg,#fff,rgba(255,255,255,0.7))', borderRadius: 4, boxShadow: '0 0 10px rgba(255,255,255,0.5)', transition: 'width 0.5s' }} />
                    </Box>
                    <Button fullWidth onClick={onSim} disabled={comp.type === 'available'} sx={{ backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.45)', color: '#fff', fontWeight: 800, borderRadius: 3, fontSize: '0.8rem', py: 1.2, '&:hover': { background: 'rgba(255,255,255,0.28)' }, '&:disabled': { opacity: 0.5, color: 'rgba(255,255,255,0.6)' } }}>
                        {comp.type === 'available' ? '💎 Join to Unlock' : '💎 Simulate Earn XP (700)'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

// ═══════════════════════════════════════════════════════════════════
// PROGRESS SECTION SAMPLES
// ═══════════════════════════════════════════════════════════════════

// Progress 0 – Original horizontal scrollable track
const Progress0 = ({ milestones, currentXP }) => (
    <>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'var(--text-primary)' }}>Competition Progress</Typography>
        <MilestoneTrack milestones={milestones} currentXP={currentXP} />
    </>
);

// Progress 1 – Vertical Stepper
const Progress1 = ({ milestones, currentXP }) => {
    const visible = milestones.filter(m => m.requiredXP > 0);
    return (
        <>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: 'var(--text-primary)' }}>Competition Progress</Typography>
            <Box sx={{ position: 'relative' }}>
                {/* vertical line */}
                <Box sx={{ position: 'absolute', left: 19, top: 0, bottom: 0, width: 2, bgcolor: 'var(--border-color,#e0e0e0)', zIndex: 0 }} />
                {visible.map((m, i) => {
                    const done = currentXP >= m.requiredXP;
                    const isNext = !done && (i === 0 || currentXP >= visible[i - 1].requiredXP);
                    return (
                        <Box key={m.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2, position: 'relative', zIndex: 1 }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: done ? 'var(--primary-color,#1976d2)' : isNext ? '#fff' : '#f5f5f5', border: `2px solid ${done ? 'var(--primary-color,#1976d2)' : isNext ? 'var(--primary-color,#1976d2)' : 'var(--border-color,#e0e0e0)'}`, boxShadow: isNext ? '0 0 0 4px rgba(25,118,210,0.15)' : 'none' }}>
                                {done ? <CheckIcon sx={{ color: '#fff', fontSize: 20 }} /> : <GiftIcon sx={{ fontSize: 18, color: isNext ? 'var(--primary-color,#1976d2)' : '#bdbdbd' }} />}
                            </Box>
                            <Box sx={{ flex: 1, pt: 0.5, pb: 1.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography sx={{ fontWeight: done ? 700 : 500, fontSize: '0.9rem', color: done ? 'var(--text-primary)' : isNext ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{m.reward}</Typography>
                                    <Chip label={`${m.requiredXP >= 1000 ? `${m.requiredXP / 1000}k` : m.requiredXP} XP`} size="small" sx={{ fontSize: '0.65rem', height: 20, bgcolor: done ? 'rgba(25,118,210,0.1)' : '#f5f5f5', color: done ? 'var(--primary-color,#1976d2)' : 'var(--text-secondary)', fontWeight: 700 }} />
                                </Box>
                                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    {done ? '✓ Milestone achieved' : isNext ? `${(m.requiredXP - currentXP).toLocaleString()} XP away` : `Requires ${m.requiredXP.toLocaleString()} XP`}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </>
    );
};

// Progress 2 – Reward Grid Cards
const Progress2 = ({ milestones, currentXP }) => {
    const visible = milestones.filter(m => m.requiredXP > 0);
    return (
        <>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: 'var(--text-primary)' }}>Milestone Rewards</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
                {visible.map((m) => {
                    const done = currentXP >= m.requiredXP;
                    return (
                        <Box key={m.id} sx={{ borderRadius: 2.5, p: 1.5, textAlign: 'center', position: 'relative', bgcolor: done ? 'rgba(25,118,210,0.07)' : '#f9f9f9', border: `1px solid ${done ? 'var(--primary-color,#1976d2)' : '#e8e8e8'}`, transition: 'all 0.25s' }}>
                            <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: done ? 'var(--primary-color,#1976d2)' : '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 0.8 }}>
                                {done ? <CheckIcon sx={{ color: '#fff', fontSize: 20 }} /> : <LockIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />}
                            </Box>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: done ? 'var(--primary-color,#1976d2)' : 'var(--text-secondary)', lineHeight: 1.2, mb: 0.3 }}>{m.reward}</Typography>
                            <Typography sx={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{m.requiredXP >= 1000 ? `${m.requiredXP / 1000}k` : m.requiredXP} XP</Typography>
                        </Box>
                    );
                })}
            </Box>
        </>
    );
};

// Progress 3 – Horizontal Chapter Cards (scrollable)
const Progress3 = ({ milestones, currentXP }) => {
    const visible = milestones.filter(m => m.requiredXP > 0);
    return (
        <>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: 'var(--text-primary)' }}>Journey Chapters</Typography>
            <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: 2 } }}>
                {visible.map((m, i) => {
                    const done = currentXP >= m.requiredXP;
                    const isNext = !done && (i === 0 || currentXP >= visible[i - 1].requiredXP);
                    return (
                        <Box key={m.id} sx={{ minWidth: 90, flexShrink: 0, borderRadius: 3, p: 1.5, textAlign: 'center', position: 'relative', background: done ? 'linear-gradient(135deg,var(--primary-color,#1976d2),#42a5f5)' : isNext ? '#fff' : '#f5f5f5', border: `1.5px solid ${done ? 'transparent' : isNext ? 'var(--primary-color,#1976d2)' : '#e0e0e0'}`, boxShadow: done ? '0 4px 12px rgba(25,118,210,0.3)' : isNext ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }}>
                            <Typography sx={{ fontSize: '0.55rem', fontWeight: 700, color: done ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)', letterSpacing: 1, textTransform: 'uppercase' }}>Stage</Typography>
                            <Typography sx={{ fontWeight: 900, fontSize: '1.4rem', lineHeight: 1, color: done ? '#fff' : isNext ? 'var(--primary-color,#1976d2)' : '#bdbdbd' }}>{i + 1}</Typography>
                            <Typography sx={{ fontSize: '0.6rem', color: done ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)', mt: 0.5, lineHeight: 1.2 }}>{m.reward}</Typography>
                            <Typography sx={{ fontSize: '0.6rem', fontWeight: 700, color: done ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)', mt: 0.5 }}>{m.requiredXP >= 1000 ? `${m.requiredXP / 1000}k` : m.requiredXP} XP</Typography>
                            {done && <CheckIcon sx={{ position: 'absolute', top: 6, right: 6, fontSize: 14, color: 'rgba(255,255,255,0.9)' }} />}
                        </Box>
                    );
                })}
            </Box>
        </>
    );
};

// Progress 4 – Segmented Bar with labeled ticks
const Progress4 = ({ milestones, currentXP }) => {
    const visible = milestones.filter(m => m.requiredXP > 0);
    const maxXP = visible[visible.length - 1]?.requiredXP || 1;
    const pct = Math.min((currentXP / maxXP) * 100, 100);
    return (
        <>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: 'var(--text-primary)' }}>Competition Progress</Typography>
            <Box sx={{ px: 1 }}>
                {/* Reward labels above */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    {visible.filter((_, i) => i % 2 === 1).map(m => (
                        <Box key={m.id} sx={{ textAlign: 'center', flex: 1 }}>
                            <Chip label={`500 ${m.reward}`} size="small" sx={{ fontSize: '0.55rem', height: 18, bgcolor: currentXP >= m.requiredXP ? 'var(--primary-color,#1976d2)' : '#f0f0f0', color: currentXP >= m.requiredXP ? '#fff' : 'var(--text-secondary)', fontWeight: 700 }} />
                        </Box>
                    ))}
                </Box>
                {/* Bar */}
                <Box sx={{ position: 'relative', height: 16, borderRadius: 8, bgcolor: '#e8e8e8', overflow: 'visible', my: 1.5 }}>
                    <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${pct}%`, background: 'linear-gradient(90deg,var(--primary-color,#1976d2),#42a5f5)', borderRadius: 8, transition: 'width 0.6s ease', boxShadow: '0 2px 8px rgba(25,118,210,0.4)' }} />
                    {/* Tick marks */}
                    {visible.map(m => {
                        const tickPct = (m.requiredXP / maxXP) * 100;
                        const done = currentXP >= m.requiredXP;
                        return (
                            <Box key={m.id} sx={{ position: 'absolute', top: '50%', left: `${tickPct}%`, transform: 'translate(-50%,-50%)', width: 20, height: 20, borderRadius: '50%', bgcolor: done ? 'var(--primary-color,#1976d2)' : '#fff', border: `2px solid ${done ? 'var(--primary-color,#1976d2)' : '#ccc'}`, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {done && <CheckIcon sx={{ fontSize: 12, color: '#fff' }} />}
                            </Box>
                        );
                    })}
                </Box>
                {/* XP labels below */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {visible.map(m => (
                        <Typography key={m.id} sx={{ fontSize: '0.6rem', color: currentXP >= m.requiredXP ? 'var(--primary-color,#1976d2)' : 'var(--text-secondary)', fontWeight: currentXP >= m.requiredXP ? 700 : 400, flex: 1, textAlign: 'center' }}>
                            {m.requiredXP >= 1000 ? `${m.requiredXP / 1000}k` : m.requiredXP}
                        </Typography>
                    ))}
                </Box>
            </Box>
        </>
    );
};

// Progress 5 – Trophy Shelf (icon row with glow)
const Progress5 = ({ milestones, currentXP }) => {
    const visible = milestones.filter(m => m.requiredXP > 0);
    const achieved = visible.filter(m => currentXP >= m.requiredXP).length;
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>Trophy Shelf</Typography>
                <Chip label={`${achieved} / ${visible.length} earned`} size="small" sx={{ fontWeight: 700, bgcolor: 'rgba(255,193,7,0.15)', color: '#e65100', fontSize: '0.7rem' }} />
            </Box>
            {/* Shelf board */}
            <Box sx={{ position: 'relative', bgcolor: '#fff', border: '1px solid #e8e8e8', borderRadius: 3, px: 2, pt: 2.5, pb: 1.5, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: 3 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#e0e0e0', borderRadius: 2 } }}>
                    {visible.map((m, i) => {
                        const done = currentXP >= m.requiredXP;
                        const isNext = !done && (i === 0 || currentXP >= visible[i - 1].requiredXP);
                        return (
                            <Tooltip key={m.id} title={`${m.reward} · ${m.requiredXP.toLocaleString()} XP`} arrow placement="top">
                                <Box sx={{ minWidth: 64, textAlign: 'center', flexShrink: 0, cursor: 'default' }}>
                                    <Box sx={{ width: 48, height: 48, borderRadius: 2, mx: 'auto', mb: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: done ? '#fffbea' : '#f5f5f5', border: `1.5px solid ${done ? '#FFD700' : '#e0e0e0'}`, boxShadow: done ? '0 0 12px rgba(255,215,0,0.5)' : 'none', position: 'relative' }}>
                                        {done
                                            ? <BadgeIcon sx={{ fontSize: 28, color: '#FFD700', filter: 'drop-shadow(0 2px 4px rgba(255,193,7,0.6))' }} />
                                            : isNext
                                                ? <TrophyIcon sx={{ fontSize: 24, color: 'var(--primary-color,#1976d2)', opacity: 0.7 }} />
                                                : <LockIcon sx={{ fontSize: 20, color: '#bdbdbd' }} />}
                                        {isNext && <Box sx={{ position: 'absolute', top: -4, right: -4, width: 10, height: 10, borderRadius: '50%', bgcolor: 'var(--primary-color,#1976d2)', border: '2px solid #fff' }} />}
                                    </Box>
                                    <Typography sx={{ fontSize: '0.6rem', color: done ? '#e65100' : 'var(--text-secondary)', fontWeight: done ? 700 : 400 }}>
                                        {m.requiredXP >= 1000 ? `${m.requiredXP / 1000}k` : m.requiredXP} XP
                                    </Typography>
                                </Box>
                            </Tooltip>
                        );
                    })}
                </Box>
                {/* Shelf plank */}
                <Box sx={{ height: 4, bgcolor: '#e0d8cc', borderRadius: '0 0 4px 4px', mx: -2, mt: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
            </Box>
        </>
    );
};

// ═══════════════════════════════════════════════════════════════════
// Main Dashboard
// ═══════════════════════════════════════════════════════════════════
const cards = [Card0, Card1, Card2, Card3, Card4, Card5];
const progressSections = [Progress0, Progress1, Progress2, Progress3, Progress4, Progress5];

const CompetitionDashboard = () => {
    const [selectedCompId, setSelectedCompId] = useState(competitionsData[0].id);
    const [isCompSheetOpen, setIsCompSheetOpen] = useState(false);
    const [isDesignSheetOpen, setIsDesignSheetOpen] = useState(false);
    const [enrollComp, setEnrollComp] = useState(null);
    const [activeDesign, setActiveDesign] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);

    const currentComp = competitionsData.find(c => c.id === selectedCompId) || competitionsData[0];
    const [currentXP, setCurrentXP] = useState(currentComp.currentXP);

    useEffect(() => { setCurrentXP(currentComp.currentXP); }, [currentComp.id]);

    const nextMilestone = currentComp.milestones.find(m => m.requiredXP > currentXP);
    const xpNeeded = nextMilestone ? nextMilestone.requiredXP - currentXP : 0;

    const handleSimulate = () => {
        const newXP = currentXP + 700;
        setCurrentXP(newXP);
        if (nextMilestone && newXP >= nextMilestone.requiredXP) setShowCelebration(true);
    };

    const handleCompSelect = (id) => {
        const comp = competitionsData.find(c => c.id === id);
        if (comp?.type === 'available') { setIsCompSheetOpen(false); setEnrollComp(comp); }
        else { setSelectedCompId(id); setIsCompSheetOpen(false); }
    };

    const CardComponent = cards[activeDesign];
    const ProgressComponent = progressSections[activeDesign];

    const updatedMilestones = currentComp.milestones.map(m => ({ ...m, isAchieved: currentXP >= m.requiredXP }));

    return (
        <DashboardContainer>
            {/* ── Toolbar ── */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: -2 }}>
                <DropdownTrigger onClick={() => setIsCompSheetOpen(true)}>
                    {currentComp.title}
                    <DropdownIcon sx={{ fontSize: '1.2rem', color: '#757575' }} />
                </DropdownTrigger>
                <DropdownTrigger onClick={() => setIsDesignSheetOpen(true)}>
                    <DesignIcon sx={{ fontSize: '1rem', color: '#757575' }} />
                    Sample {activeDesign + 1}
                    <DropdownIcon sx={{ fontSize: '1.2rem', color: '#757575' }} />
                </DropdownTrigger>
            </Box>

            {/* ── Upper Card ── */}
            <CardComponent comp={currentComp} xp={currentXP} next={nextMilestone} needed={xpNeeded} onSim={handleSimulate} />

            {/* ── Progress Section ── */}
            <Box>
                <ProgressComponent milestones={updatedMilestones} currentXP={currentXP} />
            </Box>

            <CelebrationOverlay open={showCelebration} onClose={() => setShowCelebration(false)} title="Milestone Reached!" message={nextMilestone ? `You unlocked ${nextMilestone.title}!` : 'Max Level Reached!'} />

            {/* ── Competition Selector Sheet ── */}
            <SwipeableDrawer anchor="bottom" open={isCompSheetOpen} onClose={() => setIsCompSheetOpen(false)} onOpen={() => setIsCompSheetOpen(true)} PaperProps={{ sx: { borderTopLeftRadius: 24, borderTopRightRadius: 24, pb: '20px', maxHeight: '60vh' } }}>
                <DragHandle />
                <Box sx={{ px: 3, pt: 1, pb: 2 }}><Typography variant="h6" fontWeight={700} textAlign="center">Select Competition</Typography></Box>
                <Box sx={{ px: 3, pb: 0.5 }}><Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>Active</Typography></Box>
                <List sx={{ pt: 0, pb: 1 }}>
                    {competitionsData.filter(c => c.type === 'active').map(c => (
                        <ListItem disablePadding key={c.id}>
                            <ListItemButton onClick={() => handleCompSelect(c.id)} sx={{ px: 3 }}>
                                <Radio checked={selectedCompId === c.id} size="small" sx={{ mr: 1 }} />
                                <Typography sx={{ fontWeight: selectedCompId === c.id ? 700 : 500 }}>{c.title}</Typography>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ px: 3, pt: 1, pb: 0.5 }}><Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>Available to Join</Typography></Box>
                <List sx={{ pt: 0 }}>
                    {competitionsData.filter(c => c.type === 'available').map(c => (
                        <ListItem disablePadding key={c.id}>
                            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TrophyIcon sx={{ color: '#FFD700', fontSize: 20 }} />
                                    <Box>
                                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.title}</Typography>
                                        <Typography sx={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{c.participants} participants</Typography>
                                    </Box>
                                </Box>
                                <Button size="small" variant="outlined" startIcon={<InfoIcon sx={{ fontSize: '14px !important' }} />} onClick={() => { setIsCompSheetOpen(false); setEnrollComp(c); }} sx={{ borderRadius: 10, fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap', ml: 1, flexShrink: 0 }}>
                                    Info &amp; Enroll
                                </Button>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </SwipeableDrawer>

            {/* ── Design Switcher Sheet ── */}
            <SwipeableDrawer anchor="bottom" open={isDesignSheetOpen} onClose={() => setIsDesignSheetOpen(false)} onOpen={() => setIsDesignSheetOpen(true)} PaperProps={{ sx: { borderTopLeftRadius: 24, borderTopRightRadius: 24, pb: '24px' } }}>
                <DragHandle />
                <Box sx={{ px: 3, pt: 1, pb: 2 }}>
                    <Typography variant="h6" fontWeight={700} textAlign="center">Choose Design Sample</Typography>
                    <Typography variant="body2" textAlign="center" sx={{ color: 'var(--text-secondary)', mt: 0.5, fontSize: '0.8rem' }}>Each sample changes both the card and the progress section</Typography>
                </Box>
                <List sx={{ pt: 0 }}>
                    {designVariants.map(d => (
                        <ListItem disablePadding key={d.id}>
                            <ListItemButton onClick={() => { setActiveDesign(d.id); setIsDesignSheetOpen(false); }} sx={{ px: 3, py: 1.2 }}>
                                <Radio checked={activeDesign === d.id} size="small" sx={{ mr: 1 }} />
                                <Typography sx={{ fontWeight: activeDesign === d.id ? 700 : 500, fontSize: '0.9rem' }}>{d.label}</Typography>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </SwipeableDrawer>

            {/* ── Enroll Sheet ── */}
            <SwipeableDrawer anchor="bottom" open={Boolean(enrollComp)} onClose={() => setEnrollComp(null)} onOpen={() => { }} PaperProps={{ sx: { borderTopLeftRadius: 24, borderTopRightRadius: 24, pb: 4, maxHeight: '70vh' } }}>
                <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: '#d0d0d0', margin: '12px auto 8px' }} />
                <Box sx={{ px: 3, pt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <TrophyIcon sx={{ color: '#FFD700', fontSize: 32 }} />
                        <Box>
                            <Typography variant="h6" fontWeight={800}>{enrollComp?.title}</Typography>
                            <Chip label="Not Enrolled" size="small" sx={{ fontSize: '0.65rem', height: 20, bgcolor: '#FFF3E0', color: '#E65100', fontWeight: 700 }} />
                        </Box>
                    </Box>
                    <Typography sx={{ fontSize: '0.9rem', color: 'var(--text-secondary)', mb: 3, lineHeight: 1.6 }}>{enrollComp?.description}</Typography>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        {[{ label: 'Participants', value: enrollComp?.participants }, { label: 'Ends', value: enrollComp?.endDate }].map(s => (
                            <Box key={s.label} sx={{ flex: 1, p: 1.5, bgcolor: 'var(--surface-color)', borderRadius: 2, border: '1px solid var(--border-color)', textAlign: 'center' }}>
                                <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>{s.value}</Typography>
                                <Typography sx={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</Typography>
                            </Box>
                        ))}
                    </Box>
                    <Button fullWidth variant="contained" size="large" sx={{ borderRadius: 3, fontWeight: 800, fontSize: '0.95rem', py: 1.5, bgcolor: 'var(--primary-color)', '&:hover': { bgcolor: 'var(--primary-hover,#004494)' } }} onClick={() => setEnrollComp(null)}>
                        Enroll Now
                    </Button>
                </Box>
            </SwipeableDrawer>
        </DashboardContainer>
    );
};

export default CompetitionDashboard;
