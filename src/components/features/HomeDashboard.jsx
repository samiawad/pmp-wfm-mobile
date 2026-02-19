import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Chip,
    Grid,
    Avatar,
    Divider,
    Button,
    IconButton,
} from '@mui/material';
import {
    CalendarMonth as CalendarIcon,
    TrendingUp as TrendingUpIcon,
    EmojiEvents as TrophyIcon,
    AccessTime as ClockIcon,
    CheckCircle as CheckIcon,
    Warning as WarningIcon,
    Phone as PhoneIcon,
    NotificationsActive as AlertIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    SwapHoriz as SwapIcon,
} from '@mui/icons-material';

// ============================================
// Styled Components
// ============================================

const DashboardContainer = styled(Box)({
    padding: '16px',
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
});


// Modern Card with gradient
const ModernCard = styled(Card)(({ gradient }) => ({
    marginBottom: 12,
    background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 12,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
        pointerEvents: 'none',
    },
    '&:active': {
        transform: 'scale(0.98)',
        transition: 'transform 0.1s ease',
    },
}));

const GlassCard = styled(Card)(({ bgColor }) => ({
    marginBottom: 12,
    background: bgColor || 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    '&:active': {
        transform: 'scale(0.98)',
        transition: 'transform 0.1s ease',
    },
}));

const StatCard = styled(Card)(({ accentColor }) => ({
    background: '#ffffff',
    maxWidth: '100%',
    minWidth: '100%',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: `2px solid ${accentColor || '#e0e0e0'}`,
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:active': {
        transform: 'scale(0.97)',
        transition: 'transform 0.1s ease',
    },
}));

const StyledAvatar = styled(Avatar)(({ bgGradient }) => ({
    background: bgGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    width: 40,
    height: 40,
    marginRight: 12,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
}));

const ModernChip = styled(Chip)(({ chipColor }) => ({
    background: chipColor || 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    color: 'white',
    fontWeight: 600,
    fontSize: '0.75rem',
    height: 24,
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    border: 'none',
}));

const StyledLinearProgress = styled(LinearProgress)({
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    '& .MuiLinearProgress-bar': {
        background: 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)',
        borderRadius: 4,
    },
});

const ActionItemBox = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    border: '1px solid rgba(255, 255, 255, 0.5)',
    '&:active': {
        background: 'rgba(255, 255, 255, 1)',
        transform: 'scale(0.98)',
        transition: 'transform 0.1s ease',
    },
});

const BannerCard = styled(Card)(({ theme }) => ({
    background: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
    borderRadius: 16,
    color: 'white',
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(221, 36, 118, 0.25)',
    border: 'none',
}));

const BannerDot = styled(Box)(({ active }) => ({
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: active ? '#fff' : 'rgba(255,255,255,0.4)',
    transition: 'all 0.3s ease',
}));

// ============================================
// Component
// ============================================

const HomeDashboard = ({ onAction, onPageChange }) => {
    const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const announcements = [
        {
            id: 1,
            title: "Pending Shift Swap",
            message: "You have an incoming shift swap request from Omar Jabri that needs action.",
            icon: <SwapIcon />,
            actionLabel: "View Request",
            target: 'requests',
            tabIndex: 3 // Incoming Tab
        },
        {
            id: 2,
            title: "New Evaluation",
            message: "Your Q1 Performance Evaluation is now available for review and feedback.",
            icon: <TrophyIcon />,
            actionLabel: "Open Dashboard",
            target: 'performance'
        },
        {
            id: 3,
            title: "General Alert",
            message: "Team Meeting scheduled for 3:00 PM in Conference Room B.",
            icon: <AlertIcon />,
            actionLabel: "Dismiss",
            target: null
        }
    ];

    const handleNext = () => {
        setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    };

    const handlePrev = () => {
        setCurrentAnnouncement((prev) => (prev - 1 + announcements.length) % announcements.length);
    };

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;
        if (distance > minSwipeDistance) handleNext();
        if (distance < -minSwipeDistance) handlePrev();
    };

    const current = announcements[currentAnnouncement];

    return (
        <DashboardContainer>

            {/* Announcement Banner (Toaster-style) */}
            <BannerCard
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 1.5 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Box sx={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            p: 1,
                            display: 'flex',
                            color: '#fff'
                        }}>
                            {current.icon}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', mb: 0.2 }}>
                                {current.title}
                            </Typography>
                            <Typography sx={{ fontSize: '0.8rem', opacity: 0.95, lineHeight: 1.4, mb: 1.5 }}>
                                {current.message}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => {
                                        if (current.target) {
                                            if (onAction) {
                                                onAction(current.target, current.tabIndex);
                                            } else if (onPageChange) {
                                                onPageChange(current.target);
                                            }
                                        }
                                    }}
                                    sx={{
                                        backgroundColor: '#fff',
                                        color: '#DD2476',
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        px: 2,
                                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                                    }}
                                >
                                    {current.actionLabel}
                                </Button>

                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    {announcements.map((_, idx) => (
                                        <BannerDot key={idx} active={idx === currentAnnouncement} />
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </BannerCard>

            {/* Next Shift Card */}
            <ModernCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <StyledAvatar bgGradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                            <CalendarIcon sx={{ fontSize: 20 }} />
                        </StyledAvatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography sx={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>
                                Next Shift
                            </Typography>
                            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
                                Tomorrow, Feb 5
                            </Typography>
                        </Box>
                        <ModernChip
                            label="Confirmed"
                            size="small"
                            icon={<CheckIcon sx={{ fontSize: 14 }} />}
                            chipColor="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                        />
                    </Box>
                    <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.2)' }} />
                    <Grid container spacing={1.5}>
                        <Grid item xs={6}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>
                                Start Time
                            </Typography>
                            <Typography sx={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>
                                9:00 AM
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>
                                End Time
                            </Typography>
                            <Typography sx={{ fontWeight: 600, color: 'white', fontSize: '0.95rem' }}>
                                5:00 PM
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </ModernCard>

            {/* Performance Snapshot */}
            <GlassCard bgColor="rgba(243, 229, 245, 0.8)">
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <StyledAvatar bgGradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
                            <TrendingUpIcon sx={{ fontSize: 20 }} />
                        </StyledAvatar>
                        <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                Performance Score
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                Feb 1 - Today
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ mb: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '1.75rem' }}>
                                85%
                            </Typography>
                            <ModernChip
                                label="+5%"
                                size="small"
                                chipColor="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                            />
                        </Box>
                        <StyledLinearProgress variant="determinate" value={85} />
                    </Box>
                    <Typography sx={{ color: '#666', fontSize: '0.75rem' }}>
                        Great job! You're in the top quartile
                    </Typography>
                </CardContent>
            </GlassCard>

            {/* Quick Stats Grid */}
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
                <Grid item size={6} sx={{ display: 'flex' }}>
                    <StatCard>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <ClockIcon sx={{ color: 'var(--primary-color)', fontSize: 18, mr: 0.5 }} />
                                <Typography sx={{ fontSize: '0.7rem', color: '#888' }}>
                                    Adherence
                                </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', mb: 0.25 }}>
                                92%
                            </Typography>
                            <Typography sx={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.65rem' }}>
                                ↑ 3% from last week
                            </Typography>
                        </CardContent>
                    </StatCard>
                </Grid>

                <Grid item size={6} sx={{ display: 'flex' }}>
                    <StatCard>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <TrophyIcon sx={{ color: 'var(--primary-color)', fontSize: 18, mr: 0.5 }} />
                                <Typography sx={{ fontSize: '0.7rem', color: '#888' }}>
                                    Competition
                                </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', mb: 0.25 }}>
                                #3
                            </Typography>
                            <Typography sx={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.65rem' }}>
                                Best Sales
                            </Typography>
                        </CardContent>
                    </StatCard>
                </Grid>

                <Grid item size={6} sx={{ display: 'flex' }}>
                    <StatCard>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <PhoneIcon sx={{ color: 'var(--primary-color)', fontSize: 18, mr: 0.5 }} />
                                <Typography sx={{ fontSize: '0.7rem', color: '#888' }}>
                                    AHT
                                </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', mb: 0.25 }}>
                                250s
                            </Typography>
                            <Typography sx={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.65rem' }}>
                                Average Handle Time
                            </Typography>
                        </CardContent>
                    </StatCard>
                </Grid>

                <Grid item size={6} sx={{ display: 'flex' }}>
                    <StatCard>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <PhoneIcon sx={{ color: 'var(--primary-color)', fontSize: 18, mr: 0.5 }} />
                                <Typography sx={{ fontSize: '0.7rem', color: '#888' }}>
                                    Hold %
                                </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1.5rem', mb: 0.25 }}>
                                5%
                            </Typography>
                            <Typography sx={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.65rem' }}>
                                Average Handle Time
                            </Typography>
                        </CardContent>
                    </StatCard>
                </Grid>
            </Grid>

            {/* Pending Actions */}
            <ModernCard gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)">
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <StyledAvatar bgGradient="linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%)">
                            <WarningIcon sx={{ fontSize: 20 }} />
                        </StyledAvatar>
                        <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                Pending Actions
                            </Typography>
                            <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>
                                3 items need your attention
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                        <ActionItemBox>
                            <Typography sx={{ fontSize: '0.85rem' }}>Complete Q1 Evaluation</Typography>
                            <Chip label="PMP" size="small" color="secondary" sx={{ height: 22, fontSize: '0.7rem' }} />
                        </ActionItemBox>
                        <ActionItemBox>
                            <Typography sx={{ fontSize: '0.85rem' }}>Approve Shift Swap</Typography>
                            <Chip label="WFM" size="small" color="primary" sx={{ height: 22, fontSize: '0.7rem' }} />
                        </ActionItemBox>
                        <ActionItemBox>
                            <Typography sx={{ fontSize: '0.85rem' }}>Review Coaching Plan</Typography>
                            <Chip label="PMP" size="small" color="secondary" sx={{ height: 22, fontSize: '0.7rem' }} />
                        </ActionItemBox>
                    </Box>
                </CardContent>
            </ModernCard>
        </DashboardContainer>
    );
};

export default HomeDashboard;
