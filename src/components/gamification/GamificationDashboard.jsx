import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { EmojiEvents as TrophyIcon, CardGiftcard as CollectionIcon, Leaderboard as LeaderboardIcon } from '@mui/icons-material';
import CompetitionDashboard from './CompetitionDashboard';
import TrophyCase from './TrophyCase';
import HallOfFame from './HallOfFame';

// ── Tab definitions ───────────────────────────────────────────────────────────
const tabs = [
    { label: 'Competitions', icon: <TrophyIcon sx={{ fontSize: 16 }} /> },
    { label: 'Collection', icon: <CollectionIcon sx={{ fontSize: 16 }} /> },
    { label: 'Leaderboard', icon: <LeaderboardIcon sx={{ fontSize: 16 }} /> },
];

// ── Root component ────────────────────────────────────────────────────────────
const GamificationDashboard = () => {
    const [currentTab, setCurrentTab] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleTabChange = (i) => {
        setCurrentTab(i);
        if (i !== 1) setSelectedUser(null);
    };

    const handleViewUserTrophies = (user) => {
        setSelectedUser(user);
        setCurrentTab(1);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', bgcolor: '#f5f5f5' }}>

            {/* Segmented control — same pattern as SchedulePage */}
            <Box sx={{ px: 2, mb: '16px', backgroundColor: '#f5f5f5' }}>
                <Box sx={{
                    display: 'flex',
                    backgroundColor: '#e8edf2',
                    borderRadius: '14px',
                }}>
                    {tabs.map((tab, i) => (
                        <Box
                            key={i}
                            onClick={() => handleTabChange(i)}
                            sx={{
                                flex: 1,
                                py: 0.9,
                                borderRadius: '11px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.75,
                                backgroundColor: currentTab === i ? 'var(--primary-color)' : 'transparent',
                                color: currentTab === i ? '#fff' : '#5a6a7a',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                userSelect: 'none',
                                '&:active': { opacity: 0.85 },
                            }}
                        >
                            <Box sx={{ display: 'flex', color: 'inherit' }}>{tab.icon}</Box>
                            <Typography sx={{
                                fontSize: '0.875rem',
                                fontWeight: currentTab === i ? 700 : 500,
                                color: 'inherit',
                                lineHeight: 1,
                                whiteSpace: 'nowrap',
                            }}>
                                {tab.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Page content */}
            <Box sx={{ flexGrow: 1, px: 2, pb: 2 }}>
                {currentTab === 0 && <CompetitionDashboard />}
                {currentTab === 1 && <TrophyCase viewedUser={selectedUser} />}
                {currentTab === 2 && <HallOfFame onViewUser={handleViewUserTrophies} />}
            </Box>
        </Box>
    );
};

export default GamificationDashboard;
