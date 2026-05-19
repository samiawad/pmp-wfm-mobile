import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, styled, Chip,
    SwipeableDrawer, Divider, IconButton, Radio
} from '@mui/material';
import MilestoneTrack from './MilestoneTrack';
import CelebrationOverlay from './CelebrationOverlay';
import { StarRate as StarIcon, FilterAlt as FilterIcon, Close as CloseIcon, EmojiEvents as TrophyIcon } from '@mui/icons-material';

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
        participants: 210,
        endDate: 'Dec 31, 2026',
        description: 'Year-long competition for overall support excellence. Join now and start earning points.',
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

const CompetitionDashboard = () => {
    const [showCelebration, setShowCelebration] = useState(false);
    const [selectedCompId, setSelectedCompId] = useState(competitionsData[0].id);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [enrollComp, setEnrollComp] = useState(null);

    const currentCompetition = competitionsData.find(c => c.id === selectedCompId) || competitionsData[0];
    const [currentXP, setCurrentXP] = useState(currentCompetition.currentXP);

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
        const comp = competitionsData.find(c => c.id === id);
        if (comp?.type === 'available') {
            setIsBottomSheetOpen(false);
            setEnrollComp(comp);
        } else {
            setSelectedCompId(id);
            setIsBottomSheetOpen(false);
        }
    };

    return (
        <DashboardContainer>

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
                <Typography sx={{ mb: 2, fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a' }}>
                    Competition Progress
                </Typography>
                <MilestoneTrack
                    milestones={currentCompetition.milestones}
                    currentXP={currentXP}
                />
            </Box>

            {/* Floating filter FAB — same pattern as RequestsPage / ActivitiesPage */}
            <Box
                onClick={() => setIsBottomSheetOpen(true)}
                sx={{
                    position: 'fixed', bottom: 82, right: 18,
                    width: 52, height: 52, borderRadius: '50%',
                    backgroundColor: 'var(--primary-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 200, userSelect: 'none',
                    boxShadow: '0 4px 16px rgba(6,24,54,0.28)',
                    transition: 'transform 0.15s ease',
                    '&:active': { transform: 'scale(0.91)' },
                }}
            >
                <FilterIcon sx={{ color: '#fff', fontSize: '1.25rem' }} />
            </Box>

            {/* Overlay component for leveling up */}
            <CelebrationOverlay
                open={showCelebration}
                onClose={() => setShowCelebration(false)}
                title="Milestone Reached!"
                message={nextMilestone ? `You unlocked ${nextMilestone.title}!` : "Max Level Reached!"}
            />

            {/* Bottom Sheet for Competition Selection */}
            <SwipeableDrawer
                anchor="bottom"
                open={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                onOpen={() => setIsBottomSheetOpen(true)}
                disableSwipeToOpen
                PaperProps={{
                    sx: {
                        borderRadius: '20px 20px 0 0',
                        maxHeight: '60vh',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                    }
                }}
            >
                {/* Handle */}
                <Box sx={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#d0d0d0', margin: '12px auto 4px' }} />

                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 1.5 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>
                            Select Competition
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={() => setIsBottomSheetOpen(false)} sx={{ color: '#bbb' }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Box sx={{ borderTop: '1px solid #f0f0f0' }} />

                {/* Scrollable list */}
                <Box sx={{ overflowY: 'auto', flex: 1, pb: 2 }}>
                    {/* Active */}
                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', px: 2.5, pt: 2, pb: 0.75 }}>
                        Active
                    </Typography>
                    {competitionsData.filter(c => c.type === 'active').map((c) => {
                        const isSelected = selectedCompId === c.id;
                        return (
                            <Box
                                key={c.id}
                                onClick={() => handleCompetitionSelect(c.id)}
                                sx={{
                                    display: 'flex', alignItems: 'center',
                                    px: 2.5, py: 1.1,
                                    borderRadius: 'var(--card-radius)',
                                    mx: 1,
                                    cursor: 'pointer',
                                    backgroundColor: isSelected ? 'rgba(6,24,54,0.06)' : 'transparent',
                                    transition: 'background-color 0.12s',
                                    '&:active': { backgroundColor: '#e8edf2' },
                                }}
                            >
                                <Radio checked={isSelected} size="small" readOnly
                                    sx={{ mr: 1.25, p: 0, color: '#cbd5e1', '&.Mui-checked': { color: 'var(--primary-color)' } }}
                                />
                                <Typography sx={{
                                    fontSize: '0.92rem',
                                    fontWeight: isSelected ? 700 : 500,
                                    color: isSelected ? 'var(--primary-color)' : '#334155',
                                    flex: 1,
                                }}>
                                    {c.title}
                                </Typography>
                            </Box>
                        );
                    })}

                    {/* Available to join */}
                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', px: 2.5, pt: 2, pb: 0.75 }}>
                        Available to Join
                    </Typography>
                    {competitionsData.filter(c => c.type === 'available').map((c) => (
                        <Box
                            key={c.id}
                            onClick={() => { setIsBottomSheetOpen(false); setEnrollComp(c); }}
                            sx={{
                                display: 'flex', alignItems: 'center',
                                px: 2.5, py: 1.25, mx: 1,
                                borderRadius: 'var(--card-radius)',
                                cursor: 'pointer',
                                gap: 1.5,
                                '&:active': { backgroundColor: '#f8f9fa' },
                            }}
                        >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', color: '#1a1a1a', lineHeight: 1.3 }}>
                                    {c.title}
                                </Typography>
                                <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', mt: 0.1 }}>
                                    {c.participants} participants
                                </Typography>
                            </Box>
                            <Box sx={{
                                px: 1.5, py: 0.5, borderRadius: 20, flexShrink: 0,
                                border: '1px solid var(--primary-color)',
                            }}>
                                <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary-color)' }}>
                                    Info &amp; Enroll
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </SwipeableDrawer>

            {/* ── Enroll info sheet ── */}
            <SwipeableDrawer
                anchor="bottom"
                open={Boolean(enrollComp)}
                onClose={() => setEnrollComp(null)}
                onOpen={() => { }}
                disableSwipeToOpen
                PaperProps={{
                    sx: {
                        borderRadius: '20px 20px 0 0',
                        maxHeight: '70vh',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                    }
                }}
            >
                {/* Handle */}
                <Box sx={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#d0d0d0', margin: '12px auto 4px' }} />

                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 1.5 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>
                            {enrollComp?.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            Not enrolled
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={() => setEnrollComp(null)} sx={{ color: '#bbb' }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Box sx={{ borderTop: '1px solid #f0f0f0' }} />

                {/* Body */}
                <Box sx={{ overflowY: 'auto', flex: 1, px: 2.5, pt: 2, pb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography sx={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.65 }}>
                        {enrollComp?.description}
                    </Typography>

                    {/* Stats info box */}
                    <Paper elevation={0} sx={{ borderRadius: 'var(--card-radius)', backgroundColor: '#f9fafb', border: '1px solid #eef2f6', overflow: 'hidden' }}>
                        {[
                            { label: 'Participants', value: enrollComp?.participants },
                            { label: 'Ends', value: enrollComp?.endDate },
                        ].map((row, i, arr) => (
                            <Box key={row.label}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5 }}>
                                    <Typography variant="body2" sx={{ color: '#9e9e9e', fontWeight: 500 }}>{row.label}</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a1a' }}>{row.value}</Typography>
                                </Box>
                                {i < arr.length - 1 && <Divider sx={{ borderColor: '#f0f0f0' }} />}
                            </Box>
                        ))}
                    </Paper>

                    {/* CTA */}
                    <Box
                        onClick={() => setEnrollComp(null)}
                        sx={{
                            height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: 'var(--card-radius)', backgroundColor: 'var(--primary-color)',
                            cursor: 'pointer', userSelect: 'none',
                            transition: 'opacity 0.15s ease', '&:active': { opacity: 0.82 },
                        }}
                    >
                        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                            Enroll Now
                        </Typography>
                    </Box>
                </Box>
            </SwipeableDrawer>
        </DashboardContainer>
    );
};

export default CompetitionDashboard;
