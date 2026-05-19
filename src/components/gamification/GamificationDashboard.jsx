import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import CompetitionDashboard from './CompetitionDashboard';
import TrophyCase from './TrophyCase';
import HallOfFame from './HallOfFame';

// ── Activities-style header: title + pills on the same scrolling row ──────────
const tabLabels = ['Competitions', 'Collection', 'Leaderboard'];

const PageHeader = ({ currentTab, onTabChange }) => (
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        pt: 2,
        pb: 1.5,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        flexWrap: 'nowrap',
        backgroundColor: '#f5f5f5',
    }}>
        <Typography sx={{
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--text-primary, #212529)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
        }}>
            Gamification
        </Typography>

        {tabLabels.map((label, i) => (
            <Box
                key={i}
                onClick={() => onTabChange(i)}
                sx={{
                    flexShrink: 0,
                    height: 32,
                    px: 2,
                    borderRadius: 20,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    backgroundColor: currentTab === i ? undefined : '#fff',
                    background: currentTab === i
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : undefined,
                    color: currentTab === i ? '#fff' : 'var(--text-primary, #212529)',
                    border: currentTab === i ? 'none' : '1px solid #e0e0e0',
                    transition: 'all 0.2s',
                }}
            >
                {label}
            </Box>
        ))}
    </Box>
);

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
            <PageHeader currentTab={currentTab} onTabChange={handleTabChange} />
            <Box sx={{ flexGrow: 1, px: 2, pb: 2, overflowY: 'auto' }}>
                {currentTab === 0 && <CompetitionDashboard />}
                {currentTab === 1 && <TrophyCase viewedUser={selectedUser} />}
                {currentTab === 2 && <HallOfFame onViewUser={handleViewUserTrophies} />}
            </Box>
        </Box>
    );
};

export default GamificationDashboard;
