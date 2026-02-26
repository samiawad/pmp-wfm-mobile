import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, styled,
    SwipeableDrawer, List, ListItem, ListItemButton, Radio
} from '@mui/material';
import MilestoneTrack from './MilestoneTrack';
import CelebrationOverlay from './CelebrationOverlay';
import { StarRate as StarIcon, ExpandMore as DropdownIcon } from '@mui/icons-material';

// Styled Components
const DashboardContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    maxWidth: 1200,
    margin: '0 auto',
}));

const HeroHeader = styled(Paper)(({ theme }) => ({
    background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)',
    borderRadius: 24,
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
    color: '#ffffff'
}));

const GlowingText = styled(Typography)(({ theme }) => ({
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#ffffff'
}));

const DropdownTrigger = styled(Box)(({ theme }) => ({
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
    '&:hover': {
        borderColor: '#212121',
        backgroundColor: '#fafafa',
    },
    '&:active': {
        backgroundColor: '#f5f5f5',
    },
}));

const DragHandle = styled(Box)({
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d0d0d0',
    margin: '12px auto 8px',
});


// Mock Data
const competitionsData = [
    {
        id: 'c1',
        title: 'Dawn of Heroes',
        type: 'active',
        currentXP: 4350,
        milestones: Array.from({ length: 11 }).map((_, i) => ({
            id: i,
            requiredXP: i * 1000,
            title: `Milestone ${i}`,
            reward: i % 3 === 0 ? 'Legendary Chest' : 'Gold Coins',
            isAchieved: 4350 >= i * 1000,
            iconUrl: null
        }))
    },
    {
        id: 'c2',
        title: 'Q1 Sales Championship',
        type: 'active',
        currentXP: 1200,
        milestones: Array.from({ length: 6 }).map((_, i) => ({
            id: i,
            requiredXP: i * 800,
            title: `Stage ${i}`,
            reward: 'Silver Badge',
            isAchieved: 1200 >= i * 800,
            iconUrl: null
        }))
    },
    {
        id: 'c3',
        title: 'Annual Support Heroes',
        type: 'available',
        currentXP: 0,
        milestones: Array.from({ length: 5 }).map((_, i) => ({
            id: i,
            requiredXP: i * 2000,
            title: `Tier ${i}`,
            reward: 'Diamond Trophy',
            isAchieved: false,
            iconUrl: null
        }))
    }
];

const CompetitionDashboard = ({ initialOverlay = null, isUrlDriven = false }) => {
    const [showCelebration, setShowCelebration] = useState(false);
    const [selectedCompId, setSelectedCompId] = useState(competitionsData[0].id);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

    const currentCompetition = competitionsData.find(c => c.id === selectedCompId) || competitionsData[0];
    const [currentXP, setCurrentXP] = useState(currentCompetition.currentXP);

    // URL-driven overlays: open immediately on mount for Figma scraper
    useEffect(() => {
        if (initialOverlay === 'filter_sheet') {
            setIsBottomSheetOpen(true);
        }
        if (initialOverlay === 'level_up_celebration') {
            setShowCelebration(true);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Update currentXP when competition changes
    useEffect(() => {
        setCurrentXP(currentCompetition.currentXP);
    }, [currentCompetition.id, currentCompetition.currentXP]);

    // find next milestone
    const nextMilestone = currentCompetition.milestones.find(m => m.requiredXP > currentXP);
    const xpNeeded = nextMilestone ? nextMilestone.requiredXP - currentXP : 0;

    const handleSimulateXP = () => {
        const newXP = currentXP + 700;
        setCurrentXP(newXP);
        if (newXP >= (nextMilestone ? nextMilestone.requiredXP : currentXP)) {
            setShowCelebration(true);
        }
    };

    const handleCompetitionSelect = (id) => {
        setSelectedCompId(id);
        setIsBottomSheetOpen(false);
    };

    return (
        <DashboardContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: -2 }}>
                {/* <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    Competitions
                </Typography> */}

                <DropdownTrigger onClick={() => setIsBottomSheetOpen(true)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {currentCompetition.title}
                    </Box>
                    <DropdownIcon sx={{ fontSize: '1.2rem', color: '#757575' }} />
                </DropdownTrigger>
            </Box>

            <HeroHeader>
                <Box sx={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', zIndex: 0 }} />

                <Box sx={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 700, letterSpacing: 3 }}>
                        {currentCompetition.title}
                    </Typography>
                    <GlowingText variant="h3" gutterBottom>
                        Level {Math.floor(currentXP / 1000)}
                    </GlowingText>
                    <Typography variant="h6" sx={{ color: '#ffffff' }}>
                        <StarIcon sx={{ color: '#FFD700', verticalAlign: 'middle', mr: 0.5, mb: 0.5 }} />
                        {currentXP.toLocaleString()} / {nextMilestone ? nextMilestone.requiredXP.toLocaleString() : 'Max'} XP
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
                        {xpNeeded > 0 ? `${xpNeeded.toLocaleString()} XP away from next milestone` : 'Max Milestone Reached!'}
                    </Typography>

                    <Button
                        variant="contained"
                        sx={{ mt: 3, borderRadius: 8, bgcolor: '#ffffff', color: 'var(--primary-color)', fontWeight: 'bold', '&:hover': { bgcolor: '#f0f0f0' } }}
                        onClick={handleSimulateXP}
                        disabled={currentCompetition.type === 'available'}
                    >
                        {currentCompetition.type === 'available' ? 'Join to Earn XP' : 'Simulate Earn XP (700)'}
                    </Button>
                </Box>
            </HeroHeader>

            <Box>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'var(--text-primary)' }}>
                    Competition Progress
                </Typography>
                <MilestoneTrack
                    milestones={currentCompetition.milestones}
                    currentXP={currentXP}
                />
            </Box>

            {/* Stats Cards Row could go here */}

            {/* Overlay component for leveling up */}
            <CelebrationOverlay
                open={showCelebration}
                onClose={() => setShowCelebration(false)}
                title="Milestone Reached!"
                message={nextMilestone ? `You unlocked ${nextMilestone.title}!` : "Max Level Reached!"}
                staticMode={isUrlDriven && initialOverlay === 'level_up_celebration'}
            />

            {/* Bottom Sheet for Competition Selection */}
            <SwipeableDrawer
                anchor="bottom"
                open={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                onOpen={() => setIsBottomSheetOpen(true)}
                transitionDuration={isUrlDriven && initialOverlay === 'filter_sheet' ? 0 : undefined}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        paddingBottom: '20px',
                        maxHeight: '60vh'
                    }
                }}
            >
                <DragHandle />
                <Box sx={{ px: 3, pt: 1, pb: 2 }}>
                    <Typography variant="h6" fontWeight={700} textAlign="center">Select Competition</Typography>
                </Box>

                <Box sx={{ px: 3, pt: 1, pb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>
                        Active Competitions
                    </Typography>
                </Box>
                <List sx={{ pt: 0, pb: 1 }}>
                    {competitionsData.filter(c => c.type === 'active').map((c) => (
                        <ListItem disablePadding key={c.id}>
                            <ListItemButton onClick={() => handleCompetitionSelect(c.id)} sx={{ px: 3 }}>
                                <Radio
                                    checked={selectedCompId === c.id}
                                    onChange={() => handleCompetitionSelect(c.id)}
                                    size="small"
                                    sx={{ mr: 1 }}
                                />
                                <Typography sx={{ fontWeight: selectedCompId === c.id ? 700 : 500 }}>
                                    {c.title}
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Box sx={{ px: 3, pt: 2, pb: 0.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>
                        Available Competitions
                    </Typography>
                </Box>
                <List sx={{ pt: 0 }}>
                    {competitionsData.filter(c => c.type === 'available').map((c) => (
                        <ListItem disablePadding key={c.id}>
                            <ListItemButton onClick={() => handleCompetitionSelect(c.id)} sx={{ px: 3 }}>
                                <Radio
                                    checked={selectedCompId === c.id}
                                    onChange={() => handleCompetitionSelect(c.id)}
                                    size="small"
                                    sx={{ mr: 1 }}
                                />
                                <Typography sx={{ fontWeight: selectedCompId === c.id ? 700 : 500 }}>
                                    {c.title}
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </SwipeableDrawer>
        </DashboardContainer>
    );
};

export default CompetitionDashboard;
