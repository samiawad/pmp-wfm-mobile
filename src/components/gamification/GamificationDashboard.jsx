import React, { useState } from 'react';
import { Box } from '@mui/material';
import {
    EmojiEvents as TrophyIcon,
    CardGiftcard as CollectionIcon,
    Leaderboard as LeaderboardIcon,
} from '@mui/icons-material';
import CompetitionDashboard from './CompetitionDashboard';
import TrophyCase from './TrophyCase';
import HallOfFame from './HallOfFame';

// ── Tab definitions ───────────────────────────────────────────────────────────
const tabs = [
    { label: 'Competitions', icon: <TrophyIcon sx={{ fontSize: 16 }} /> },
    { label: 'Collection',   icon: <CollectionIcon sx={{ fontSize: 16 }} /> },
    { label: 'Leaderboard',  icon: <LeaderboardIcon sx={{ fontSize: 16 }} /> },
];

// ── Root component ────────────────────────────────────────────────────────────
// IONIC MIGRATION: replace tab logic with <IonTabs> + <IonTabBar>
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

            {/* ── Segmented control (SchedulePage style) ── */}
            <Box sx={{ px: 2, pt: 1.5, pb: 1.5, backgroundColor: '#f5f5f5' }}>
                <Box sx={{
                    display: 'flex',
                    backgroundColor: '#e8edf2',
                    borderRadius: '14px',
                    p: '3px',
                }}>
                    {tabs.map((tab, i) => (
                        <Box
                            key={i}
                            onClick={() => handleTabChange(i)}
                            sx={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.75,
                                py: '7px',
                                borderRadius: '11px',
                                cursor: 'pointer',
                                userSelect: 'none',
                                backgroundColor: currentTab === i ? 'var(--primary-color)' : 'transparent',
                                color: currentTab === i ? '#fff' : '#5a6a7a',
                                transition: 'all 0.2s ease',
                                fontSize: '0.75rem',
                                fontWeight: currentTab === i ? 700 : 500,
                                whiteSpace: 'nowrap',
                                '& svg': {
                                    fontSize: '16px !important',
                                },
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* ── Tab content ── */}
            <Box sx={{ flexGrow: 1, px: 2, pb: 2, overflowY: 'auto' }}>
                {currentTab === 0 && <CompetitionDashboard />}
                {currentTab === 1 && <TrophyCase viewedUser={selectedUser} />}
                {currentTab === 2 && <HallOfFame onViewUser={handleViewUserTrophies} />}
            </Box>
        </Box>
    );
};

export default GamificationDashboard;
