import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import CompetitionDashboard from './CompetitionDashboard';
import TrophyCase from './TrophyCase';
import HallOfFame from './HallOfFame';

<<<<<<< HEAD
<<<<<<< HEAD
// Maps URL ?view= / ?tab= values → tab index
const TAB_MAP = {
    competitions: 0,
    rewards: 0,
    trophies: 1,
    leaderboard: 2,
    halloffame: 2,
};

const GamificationDashboard = ({ initialTab = null, initialOverlay = null, isUrlDriven = false }) => {
    // Resolve initial tab from URL string, defaulting to 0 (Competitions)
    const resolvedInitialTab = (initialTab && TAB_MAP[initialTab.toLowerCase()]) ?? 0;
    const [currentTab, setCurrentTab] = useState(resolvedInitialTab);
=======
const GamificationDashboard = () => {
    const [currentTab, setCurrentTab] = useState(0);
>>>>>>> parent of 06e16e3 (Will revert this commit)
    const [selectedUser, setSelectedUser] = useState(null); // Used to pass user from Hall of Fame to Trophy Case
=======
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
>>>>>>> fd0f6baee8b068cfb6340cd9bb2fe737188e1707

    const handleTabChange = (i) => {
        setCurrentTab(i);
        if (i !== 1) setSelectedUser(null);
    };

    const handleViewUserTrophies = (user) => {
        setSelectedUser(user);
        setCurrentTab(1);
    };

    return (
<<<<<<< HEAD
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                minHeight: '100vh',
                bgcolor: 'var(--bg-color)',
                color: 'var(--text-primary)',
                overflow: 'hidden'
            }}
        >
            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: 'var(--border-color)',
                    px: 3,
                    pt: 2,
                    bgcolor: 'var(--surface-color)',
                    position: 'relative',
                    zIndex: 10
                }}
            >
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    aria-label="gamification sections"
                    variant="scrollable"
                    scrollButtons={false}
                    sx={{
                        '& .MuiTab-root': {
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1rem',
                            color: 'var(--text-secondary)',
                            '&.Mui-selected': {
                                color: 'var(--primary-color)',
                            }
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'var(--primary-color)',
                        }
                    }}
                >
                    <Tab label="Competitions" />
                    <Tab label="Trophy Case" />
                    <Tab label="Hall of Fame" />
                </Tabs>
            </Box>

            <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
<<<<<<< HEAD
                {currentTab === 0 && <CompetitionDashboard initialOverlay={initialOverlay} isUrlDriven={isUrlDriven} />}
=======
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            <PageHeader currentTab={currentTab} onTabChange={handleTabChange} />
            <Box sx={{ flexGrow: 1, px: 2, pb: 2, overflowY: 'auto' }}>
                {currentTab === 0 && <CompetitionDashboard />}
>>>>>>> fd0f6baee8b068cfb6340cd9bb2fe737188e1707
=======
                {currentTab === 0 && <CompetitionDashboard />}
>>>>>>> parent of 06e16e3 (Will revert this commit)
                {currentTab === 1 && <TrophyCase viewedUser={selectedUser} />}
                {currentTab === 2 && <HallOfFame onViewUser={handleViewUserTrophies} />}
            </Box>
        </Box>
    );
};

export default GamificationDashboard;
