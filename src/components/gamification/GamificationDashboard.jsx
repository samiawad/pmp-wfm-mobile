import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import CompetitionDashboard from './CompetitionDashboard';
import TrophyCase from './TrophyCase';
import HallOfFame from './HallOfFame';

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
    const [selectedUser, setSelectedUser] = useState(null); // Used to pass user from Hall of Fame to Trophy Case

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
        if (newValue !== 1 && selectedUser !== null) {
            // clear selected user if navigating away from Trophy Case
            setSelectedUser(null);
        }
    };

    const handleViewUserTrophies = (user) => {
        setSelectedUser(user);
        setCurrentTab(1); // switch to Trophy Case
    };

    return (
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
                    <Tab label="Collection" />
                    <Tab label="Leaderboard" />
                </Tabs>
            </Box>

            <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
                {currentTab === 0 && <CompetitionDashboard initialOverlay={initialOverlay} isUrlDriven={isUrlDriven} />}
                {currentTab === 1 && <TrophyCase viewedUser={selectedUser} />}
                {currentTab === 2 && <HallOfFame onViewUser={handleViewUserTrophies} />}
            </Box>
        </Box>
    );
};

export default GamificationDashboard;
