import React from 'react';
import { Box, Typography, styled, Avatar } from '@mui/material';
import LeaderboardRow from './LeaderboardRow';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';

const LeaderboardContainer = styled(Box)(({ theme }) => ({
    maxWidth: 900,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

const TopThreeContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: theme.spacing(4),
    marginBottom: theme.spacing(6),
    marginTop: theme.spacing(4),
}));

const podiumStyles = {
    1: { height: 160, color: '#FFD700', label: '1st', size: 100 },
    2: { height: 120, color: '#C0C0C0', label: '2nd', size: 80 },
    3: { height: 100, color: '#CD7F32', label: '3rd', size: 70 },
};

const PodiumPillar = styled(Box)(({ rank }) => ({
    width: 100,
    height: podiumStyles[rank].height,
    background: `linear-gradient(180deg, ${podiumStyles[rank].color}33 0%, rgba(255, 255, 255, 0) 100%)`,
    borderTop: `4px solid ${podiumStyles[rank].color}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 16,
    position: 'relative',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.05)'
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
        pointerEvents: 'none',
    }
}));

const PodiumAvatar = styled(Avatar)(({ rank }) => ({
    width: podiumStyles[rank].size,
    height: podiumStyles[rank].size,
    border: `3px solid ${podiumStyles[rank].color}`,
    boxShadow: `0 4px 12px rgba(0,0,0,0.1)`,
    marginBottom: 16,
    position: 'relative',
    zIndex: 2,
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.1)'
    }
}));

const RankText = styled(Typography)(({ rank }) => ({
    color: podiumStyles[rank].color,
    fontWeight: 900,
    fontSize: '1.5rem',
}));

const mockLeaderboard = [
    { id: 1, name: "Sarah Connor", level: 65, totalGold: 125000, avatar: "https://i.pravatar.cc/150?u=1", recentBadges: ['Gold', 'Silver', 'Gold'], rank: 1, activeStreak: 15 },
    { id: 2, name: "John Doe", level: 58, totalGold: 98000, avatar: "https://i.pravatar.cc/150?u=2", recentBadges: ['Silver', 'Silver', 'Bronze'], rank: 2, activeStreak: 8 },
    { id: 3, name: "Alex Mercer", level: 42, totalGold: 75000, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d", recentBadges: ['Gold', 'Bronze', 'Bronze'], rank: 3, activeStreak: 3 },
    { id: 4, name: "Emily Chen", level: 38, totalGold: 62000, avatar: "https://i.pravatar.cc/150?u=4", recentBadges: ['Silver', 'Bronze', 'Bronze'], rank: 4, activeStreak: 5 },
    { id: 5, name: "Michael Chang", level: 25, totalGold: 45000, avatar: "https://i.pravatar.cc/150?u=5", recentBadges: ['Bronze', 'Bronze', 'Bronze'], rank: 5, activeStreak: 2 },
    { id: 6, name: "Jessica Alba", level: 12, totalGold: 15000, avatar: "https://i.pravatar.cc/150?u=6", recentBadges: ['Bronze'], rank: 6, activeStreak: 1 },
    { id: 7, name: "David Smith", level: 8, totalGold: 5000, avatar: "https://i.pravatar.cc/150?u=7", recentBadges: [], rank: 7, activeStreak: 0 },
];

const HallOfFame = ({ onViewUser }) => {
    const topThree = [mockLeaderboard[1], mockLeaderboard[0], mockLeaderboard[2]]; // 2nd, 1st, 3rd for podium
    const rest = mockLeaderboard.slice(3);

    return (
        <LeaderboardContainer>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: 'var(--text-primary)', letterSpacing: 1, mb: 1 }}>
                    <TrophyIcon sx={{ fontSize: 40, color: '#FFD700', verticalAlign: 'middle', mr: 2 }} />
                    Hall of Fame
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'var(--text-secondary)' }}>
                    Global Agent Rankings & Status
                </Typography>
            </Box>

            {/* Top 3 Podium */}
            <TopThreeContainer>
                {topThree.map((user) => {
                    const rank = user.rank;
                    return (
                        <Box key={user.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <PodiumAvatar src={user.avatar} rank={rank} onClick={() => onViewUser && onViewUser(user)} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: 'var(--text-primary)' }}>
                                {user.name.split(' ')[0]}
                            </Typography>
                            <PodiumPillar rank={rank} onClick={() => onViewUser && onViewUser(user)}>
                                <RankText rank={rank}>{podiumStyles[rank].label}</RankText>
                                <Typography variant="h6" sx={{ mt: 1, color: 'var(--text-primary)', fontWeight: 800 }}>
                                    Lvl {user.level}
                                </Typography>
                            </PodiumPillar>
                        </Box>
                    );
                })}
            </TopThreeContainer>

            {/* Rest of the Leaderboard */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {rest.map(user => (
                    <LeaderboardRow key={user.id} user={user} onClick={() => onViewUser && onViewUser(user)} />
                ))}
            </Box>
        </LeaderboardContainer>
    );
};

export default HallOfFame;
