import React, { useState } from 'react';
import { Box, Typography, styled, Avatar, SwipeableDrawer, List, ListItem, ListItemButton, Radio } from '@mui/material';
import LeaderboardRow from './LeaderboardRow';
import { EmojiEvents as TrophyIcon, ExpandMore as DropdownIcon } from '@mui/icons-material';

// ── Styled components (exact copy from CompetitionDashboard) ──────────────
const DropdownTrigger = styled(Box)(() => ({
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: '0 12px 0 8px',
    borderRadius: 20,
    backgroundColor: '#fff',
    border: '1px solid #c4c4c4',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    fontWeight: 500,
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    '&:hover': { borderColor: '#212121', backgroundColor: '#fafafa' },
    '&:active': { backgroundColor: '#f5f5f5' },
}));

const DragHandle = styled(Box)({
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: '#d0d0d0', margin: '12px auto 8px',
});

// ── Data ──────────────────────────────────────────────────────────────────
const competitionsData = [
    { id: 'c1', title: 'Dawn of Heroes', type: 'active', participants: 142, endDate: 'Mar 10, 2026', description: 'Compete in quality and speed metrics to earn legendary rewards.' },
    { id: 'c2', title: 'Q1 Sales Championship', type: 'active', participants: 87, endDate: 'Mar 31, 2026', description: 'Top performers in sales conversion rate win exclusive badges.' },
];

const mockLeaderboard = [
    { id: 1, name: 'Sarah Connor', level: 65, totalGold: 125000, milestone: 18, avatar: 'https://i.pravatar.cc/150?u=1', recentBadges: ['Gold', 'Silver', 'Gold'], rank: 1, activeStreak: 15 },
    { id: 2, name: 'John Doe', level: 58, totalGold: 98000, milestone: 15, avatar: 'https://i.pravatar.cc/150?u=2', recentBadges: ['Silver', 'Silver', 'Bronze'], rank: 2, activeStreak: 8 },
    { id: 3, name: 'Alex Mercer', level: 42, totalGold: 75000, milestone: 12, avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', recentBadges: ['Gold', 'Bronze', 'Bronze'], rank: 3, activeStreak: 3 },
    { id: 4, name: 'Emily Chen', level: 38, totalGold: 62000, milestone: 10, avatar: 'https://i.pravatar.cc/150?u=4', recentBadges: ['Silver', 'Bronze', 'Bronze'], rank: 4, activeStreak: 5 },
    { id: 5, name: 'Michael Chang', level: 25, totalGold: 45000, milestone: 8, avatar: 'https://i.pravatar.cc/150?u=5', recentBadges: ['Bronze', 'Bronze', 'Bronze'], rank: 5, activeStreak: 2 },
    { id: 6, name: 'Jessica Alba', level: 12, totalGold: 15000, milestone: 5, avatar: 'https://i.pravatar.cc/150?u=6', recentBadges: ['Bronze'], rank: 6, activeStreak: 1 },
    { id: 7, name: 'David Smith', level: 8, totalGold: 5000, milestone: 2, avatar: 'https://i.pravatar.cc/150?u=7', recentBadges: [], rank: 7, activeStreak: 0 },
];

const podiumMeta = {
    1: { color: '#FFD700', shadow: '0 0 24px rgba(255,215,0,0.45)', height: 90, label: '1st', medal: '🥇', avatarSize: 72 },
    2: { color: '#C0C0C0', shadow: '0 0 16px rgba(192,192,192,0.35)', height: 64, label: '2nd', medal: '🥈', avatarSize: 60 },
    3: { color: '#CD7F32', shadow: '0 0 12px rgba(205,127,50,0.3)', height: 52, label: '3rd', medal: '🥉', avatarSize: 56 },
};

// ── Main component ────────────────────────────────────────────────────────
const HallOfFame = ({ onViewUser }) => {
    const [selectedCompId, setSelectedCompId] = useState(competitionsData[0].id);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const currentCompetition = competitionsData.find(c => c.id === selectedCompId) || competitionsData[0];

    const handleCompSelect = (id) => {
        const comp = competitionsData.find(c => c.id === id);
        if (comp?.type === 'available') {
            // Don't select — open info sheet instead
            setIsFilterOpen(false);
            setEnrollComp(comp);
        } else {
            setSelectedCompId(id);
            setIsFilterOpen(false);
        }
    };

    // Podium order: 2nd left, 1st center, 3rd right
    const podiumOrder = [mockLeaderboard[1], mockLeaderboard[0], mockLeaderboard[2]];
    const rest = mockLeaderboard.slice(3);

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto' }}>

            {/* ── Filter trigger ── */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <DropdownTrigger onClick={() => setIsFilterOpen(true)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {currentCompetition.title}
                    </Box>
                    <DropdownIcon sx={{ fontSize: '1.2rem', color: '#757575' }} />
                </DropdownTrigger>
            </Box>

            {/* ── Page title ── */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-primary)', letterSpacing: 0.5 }}>
                    🏆 Leaderboard
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: 'var(--text-secondary)', mt: 0.5 }}>
                    {currentCompetition.title} · Global Rankings
                </Typography>
            </Box>

            {/* ── Podium ── */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
                gap: 2,
                mb: 4,
                px: 1,
            }}>
                {podiumOrder.map(user => {
                    const meta = podiumMeta[user.rank];
                    const isFirst = user.rank === 1;
                    return (
                        <Box
                            key={user.id}
                            onClick={() => onViewUser && onViewUser(user)}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                flex: isFirst ? '0 0 36%' : '0 0 28%',
                                cursor: 'pointer',
                            }}
                        >
                            {/* Medal emoji above avatar */}
                            <Typography sx={{ fontSize: isFirst ? '1.6rem' : '1.2rem', mb: 0.5, lineHeight: 1 }}>
                                {meta.medal}
                            </Typography>

                            {/* Avatar */}
                            <Avatar
                                src={user.avatar}
                                sx={{
                                    width: meta.avatarSize,
                                    height: meta.avatarSize,
                                    border: `3px solid ${meta.color}`,
                                    boxShadow: meta.shadow,
                                    mb: 0.75,
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'scale(1.07)' },
                                }}
                            />

                            {/* Name */}
                            <Typography sx={{
                                fontWeight: 700,
                                fontSize: isFirst ? '0.85rem' : '0.75rem',
                                color: 'var(--text-primary)',
                                mb: 0.5,
                                textAlign: 'center',
                                lineHeight: 1.2,
                            }}>
                                {user.name.split(' ')[0]}
                            </Typography>

                            {/* Level chip */}
                            <Box sx={{
                                px: 1.25, py: 0.2, mb: 1,
                                borderRadius: 10,
                                bgcolor: `${meta.color}20`,
                                border: `1px solid ${meta.color}55`,
                            }}>
                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: meta.color }}>
                                    Lv. {user.level}
                                </Typography>
                            </Box>

                            {/* Podium block */}
                            <Box sx={{
                                width: '100%',
                                height: meta.height,
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                                background: `linear-gradient(180deg, ${meta.color}44 0%, ${meta.color}18 100%)`,
                                borderTop: `3px solid ${meta.color}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Typography sx={{ fontWeight: 900, fontSize: isFirst ? '1.3rem' : '1.1rem', color: meta.color }}>
                                    {meta.label}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            {/* ── Ranks 4–7 ── */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {rest.map(user => (
                    <LeaderboardRow key={user.id} user={user} onClick={() => onViewUser && onViewUser(user)} />
                ))}
            </Box>

            {/* ── Competition filter sheet ── */}
            <SwipeableDrawer
                anchor="bottom"
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onOpen={() => setIsFilterOpen(true)}
                PaperProps={{ sx: { borderTopLeftRadius: 24, borderTopRightRadius: 24, pb: 3, maxHeight: '65vh' } }}
            >
                <DragHandle />
                <Box sx={{ px: 3, pt: 1, pb: 2 }}>
                    <Typography variant="h6" fontWeight={700} textAlign="center">Select Competition</Typography>
                </Box>

                {/* Active competitions */}
                <Box sx={{ px: 3, pb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.7rem' }}>
                        Active Competitions
                    </Typography>
                </Box>
                <List sx={{ pt: 0, pb: 1 }}>
                    {competitionsData.filter(c => c.type === 'active').map(c => (
                        <ListItem disablePadding key={c.id}>
                            <ListItemButton onClick={() => handleCompSelect(c.id)} sx={{ px: 3 }}>
                                <Radio checked={selectedCompId === c.id} onChange={() => handleCompSelect(c.id)} size="small" sx={{ mr: 1 }} />
                                <Typography sx={{ fontWeight: selectedCompId === c.id ? 700 : 500 }}>{c.title}</Typography>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

            </SwipeableDrawer>
        </Box>
    );
};

export default HallOfFame;
