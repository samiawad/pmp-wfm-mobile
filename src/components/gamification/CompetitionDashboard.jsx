import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, styled, Chip,
    SwipeableDrawer, List, ListItem, ListItemButton, Radio,
    IconButton, Divider, Fab,
} from '@mui/material';
import MilestoneTrack from './MilestoneTrack';
import CelebrationOverlay from './CelebrationOverlay';
import {
    StarRate as StarIcon,
    InfoOutlined as InfoIcon,
    EmojiEvents as TrophyIcon,
    FilterAlt as FilterIcon,
    Close as CloseIcon,
} from '@mui/icons-material';

// ── Styled components ─────────────────────────────────────────────────────────
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
    color: '#ffffff',
}));

const GlowingText = styled(Typography)({
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#ffffff',
});

const DragHandle = styled(Box)({
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d0d0d0',
    margin: '12px auto 8px',
});

// ── Mock data ─────────────────────────────────────────────────────────────────
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
            iconUrl: null,
        })),
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
            iconUrl: null,
        })),
    },
    {
        id: 'c3',
        title: 'Annual Support Heroes',
        type: 'available',
        participants: 210,
        endDate: 'Dec 31, 2026',
        description:
            'Year-long competition for overall support excellence. Join now and start earning points.',
        currentXP: 0,
        milestones: Array.from({ length: 5 }).map((_, i) => ({
            id: i,
            requiredXP: i * 2000,
            title: `Tier ${i}`,
            reward: 'Diamond Trophy',
            isAchieved: false,
            iconUrl: null,
        })),
    },
];

// ── Component ─────────────────────────────────────────────────────────────────
// IONIC MIGRATION: replace SwipeableDrawer with <IonModal> presentingElement sheet
const CompetitionDashboard = () => {
    const [showCelebration, setShowCelebration]   = useState(false);
    const [selectedCompId, setSelectedCompId]     = useState(competitionsData[0].id);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [enrollComp, setEnrollComp]             = useState(null);

    const currentCompetition =
        competitionsData.find(c => c.id === selectedCompId) || competitionsData[0];

    const [currentXP, setCurrentXP] = useState(currentCompetition.currentXP);

    useEffect(() => {
        setCurrentXP(currentCompetition.currentXP);
    }, [currentCompetition.id, currentCompetition.currentXP]);

    const nextMilestone = currentCompetition.milestones.find(m => m.requiredXP > currentXP);
    const xpNeeded      = nextMilestone ? nextMilestone.requiredXP - currentXP : 0;

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

            {/* ── Hero card ── */}
            <HeroHeader>
                <Box sx={{
                    position: 'absolute', top: '-50%', left: '-50%',
                    width: '200%', height: '200%',
                    background: 'radial-gradient(circle, rgba(255,215,0,0.05) 0%, rgba(0,0,0,0) 70%)',
                    pointerEvents: 'none', zIndex: 0,
                }} />

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
                        {xpNeeded > 0
                            ? `${xpNeeded.toLocaleString()} XP away from next milestone`
                            : 'Max Milestone Reached!'}
                    </Typography>

                    <Button
                        variant="contained"
                        sx={{
                            mt: 3, borderRadius: 8,
                            bgcolor: '#ffffff', color: 'var(--primary-color)',
                            fontWeight: 'bold', '&:hover': { bgcolor: '#f0f0f0' },
                        }}
                        onClick={handleSimulateXP}
                        disabled={currentCompetition.type === 'available'}
                    >
                        {currentCompetition.type === 'available' ? 'Join to Earn XP' : 'Simulate Earn XP (700)'}
                    </Button>
                </Box>
            </HeroHeader>

            {/* ── Vertical milestone timeline ── */}
            <Box>
                <Typography sx={{ mb: 2, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Competition Progress
                </Typography>
                <MilestoneTrack
                    milestones={currentCompetition.milestones}
                    currentXP={currentXP}
                />
            </Box>

            {/* ── Celebration overlay ── */}
            <CelebrationOverlay
                open={showCelebration}
                onClose={() => setShowCelebration(false)}
                title="Milestone Reached!"
                message={nextMilestone ? `You unlocked ${nextMilestone.title}!` : 'Max Level Reached!'}
            />

            {/* ── Floating filter FAB ── */}
            {/* IONIC MIGRATION: replace with <IonFab> */}
            <Fab
                size="medium"
                onClick={() => setIsBottomSheetOpen(true)}
                sx={{
                    position: 'fixed',
                    bottom: 82,
                    right: 18,
                    width: 52,
                    height: 52,
                    bgcolor: 'var(--primary-color)',
                    color: '#fff',
                    boxShadow: '0 4px 14px rgba(6,24,54,0.28)',
                    '&:hover': { bgcolor: 'var(--primary-color)', opacity: 0.92 },
                    zIndex: 999,
                }}
            >
                <FilterIcon />
            </Fab>

            {/* ── Select Competition sheet ── */}
            <SwipeableDrawer
                anchor="bottom"
                open={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                onOpen={() => setIsBottomSheetOpen(true)}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        pb: 3,
                        maxHeight: '60vh',
                    },
                }}
            >
                <DragHandle />

                {/* Standard header: title left, X right */}
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 1.5 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={700} fontSize="1rem">Select Competition</Typography>
                    </Box>
                    <IconButton size="small" onClick={() => setIsBottomSheetOpen(false)}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Divider />

                {/* Active competitions */}
                <Box sx={{ px: 2, pt: 2, pb: 0.5 }}>
                    <Typography variant="caption" sx={{
                        fontWeight: 700, color: 'var(--text-secondary)',
                        textTransform: 'uppercase', letterSpacing: 1,
                    }}>
                        Active Competitions
                    </Typography>
                </Box>
                <List sx={{ pt: 0, pb: 1 }}>
                    {competitionsData.filter(c => c.type === 'active').map((c) => (
                        <ListItem disablePadding key={c.id}>
                            <ListItemButton onClick={() => handleCompetitionSelect(c.id)} sx={{ px: 2 }}>
                                <Radio
                                    checked={selectedCompId === c.id}
                                    onChange={() => handleCompetitionSelect(c.id)}
                                    size="small"
                                    sx={{
                                        mr: 1,
                                        color: 'var(--primary-color)',
                                        '&.Mui-checked': { color: 'var(--primary-color)' },
                                    }}
                                />
                                <Typography sx={{ fontWeight: selectedCompId === c.id ? 700 : 400, fontSize: '0.9rem' }}>
                                    {c.title}
                                </Typography>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                {/* Available to join */}
                <Box sx={{ px: 2, pt: 1, pb: 0.5 }}>
                    <Typography variant="caption" sx={{
                        fontWeight: 700, color: 'var(--text-secondary)',
                        textTransform: 'uppercase', letterSpacing: 1,
                    }}>
                        Available to Join
                    </Typography>
                </Box>
                <List sx={{ pt: 0 }}>
                    {competitionsData.filter(c => c.type === 'available').map((c) => (
                        <ListItem disablePadding key={c.id}>
                            <Box sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                px: 2,
                                py: 1,
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TrophyIcon sx={{ color: '#FFD700', fontSize: 20, flexShrink: 0 }} />
                                    <Box>
                                        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                                            {c.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                            {c.participants} participants
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<InfoIcon sx={{ fontSize: '14px !important' }} />}
                                    onClick={() => { setIsBottomSheetOpen(false); setEnrollComp(c); }}
                                    sx={{
                                        borderRadius: 10,
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        whiteSpace: 'nowrap',
                                        ml: 1,
                                        flexShrink: 0,
                                        borderColor: 'var(--primary-color)',
                                        color: 'var(--primary-color)',
                                    }}
                                >
                                    Info &amp; Enroll
                                </Button>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </SwipeableDrawer>

            {/* ── Enroll info sheet ── */}
            <SwipeableDrawer
                anchor="bottom"
                open={Boolean(enrollComp)}
                onClose={() => setEnrollComp(null)}
                onOpen={() => {}}
                PaperProps={{ sx: { borderTopLeftRadius: 24, borderTopRightRadius: 24, pb: 4, maxHeight: '70vh' } }}
            >
                <DragHandle />

                {/* Standard header */}
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 1.5 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={700} fontSize="1rem">{enrollComp?.title}</Typography>
                        <Chip
                            label="Not Enrolled"
                            size="small"
                            sx={{ fontSize: '0.65rem', height: 20, bgcolor: '#FFF3E0', color: '#E65100', fontWeight: 700, mt: 0.5 }}
                        />
                    </Box>
                    <IconButton size="small" onClick={() => setEnrollComp(null)}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Divider />

                {/* Body */}
                <Box sx={{ px: 2, pt: 2 }}>
                    <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)', mb: 2.5, lineHeight: 1.65 }}>
                        {enrollComp?.description}
                    </Typography>

                    {/* Info tiles */}
                    <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                        {[
                            { label: 'Participants', value: enrollComp?.participants },
                            { label: 'Ends',         value: enrollComp?.endDate },
                        ].map(s => (
                            <Box key={s.label} sx={{
                                flex: 1, p: 1.5,
                                bgcolor: '#f9fafb',
                                borderRadius: 2,
                                border: '1px solid #eef2f6',
                                textAlign: 'center',
                            }}>
                                <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                    {s.value}
                                </Typography>
                                <Typography sx={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    {s.label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* CTA */}
                    <Box
                        onClick={() => setEnrollComp(null)}
                        sx={{
                            bgcolor: 'var(--primary-color)',
                            color: '#fff',
                            borderRadius: 3,
                            py: 1.75,
                            textAlign: 'center',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            userSelect: 'none',
                            '&:active': { opacity: 0.88 },
                        }}
                    >
                        Enroll Now
                    </Box>
                </Box>
            </SwipeableDrawer>

        </DashboardContainer>
    );
};

export default CompetitionDashboard;
