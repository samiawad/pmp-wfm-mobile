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
    ChevronRight as ChevronRightIcon,
    SwapHoriz as SwapIcon,
    Close as CloseIcon,
    LocalOffer as TagIcon,
    ArrowUpward as UpArrowIcon,
    ArrowDownward as DownArrowIcon,
    EmojiEventsOutlined as TrophyOutlinedIcon,
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

const StatCard = styled(Card)({
    background: '#ffffff',
    maxWidth: '100%',
    minWidth: '100%',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e0e0e0',
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:active': {
        transform: 'scale(0.97)',
        transition: 'transform 0.1s ease',
    },
});

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
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
        background: 'rgba(255, 255, 255, 1)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    '&:active': {
        transform: 'scale(0.98)',
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

// New Hero Carousel Styles
const HeroCarouselWrapper = styled(Box)({
    height: '45vh',
    maxHeight: '320px',
    marginBottom: 20,
    position: 'relative',
    width: '100%',
});

const HeroSlide = styled(Card)(({ theme, gradient }) => ({
    height: '100%',
    borderRadius: 16,
    background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
}));

const UpcomingShiftRow = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    '&:last-child': {
        borderBottom: 'none',
    },
});

const HeroDot = styled(Box)(({ active }) => ({
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: active ? '#fff' : 'rgba(255,255,255,0.4)',
    margin: '0 4px',
    cursor: 'pointer',
}));

// ============================================
// Component
// ============================================

const HomeDashboard = ({ onAction, onPageChange, onDayClick }) => {
    // Mock shifts for navigation
    const mockShifts = [
        { day: 'Tuesday', date: 'Feb 4', isToday: true, isOffDay: false, startTime: '09:00 AM', endTime: '05:00 PM', duration: '8 hours' }, // Current
        { day: 'Wednesday', date: 'Feb 5', isToday: false, isOffDay: false, startTime: '09:00 AM', endTime: '05:00 PM', duration: '8 hours' }, // Tomorrow
        { day: 'Thursday', date: 'Feb 6', isToday: false, isOffDay: false, startTime: '10:00 AM', endTime: '06:00 PM', duration: '8 hours' }, // Friday
        { day: 'Friday', date: 'Feb 7', isToday: false, isOffDay: true }, // Saturday
    ];

    const navigateToShift = (shift) => {
        if (onDayClick) {
            // scheduleList can be just this shift for simplicity in dashboard view
            onDayClick(shift, 0, [shift]);
        }
    };

    // Announcements State
    const [announcementList, setAnnouncementList] = useState([
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
    ]);
    const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

    // Hero Carousel State
    const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

    // Touch Handling (Universal for both carousels)
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const handleNextAnnouncement = () => {
        if (announcementList.length === 0) return;
        setCurrentAnnouncement((prev) => (prev + 1) % announcementList.length);
    };

    const handlePrevAnnouncement = () => {
        if (announcementList.length === 0) return;
        setCurrentAnnouncement((prev) => (prev - 1 + announcementList.length) % announcementList.length);
    };

    const handleDismissAnnouncement = (id) => {
        const newList = announcementList.filter(a => a.id !== id);
        setAnnouncementList(newList);
        if (currentAnnouncement >= newList.length && newList.length > 0) {
            setCurrentAnnouncement(newList.length - 1);
        }
    };

    const handleNextHero = () => {
        setCurrentHeroSlide((prev) => (prev + 1) % 3);
    };

    const handlePrevHero = () => {
        setCurrentHeroSlide((prev) => (prev - 1 + 3) % 3);
    };

    const onTouchStart = (e, callback) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = (next, prev) => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const minSwipeDistance = 50;
        if (distance > minSwipeDistance) next();
        if (distance < -minSwipeDistance) prev();
    };

    const currentAnn = announcementList[currentAnnouncement];

    return (
        <DashboardContainer>
            {/* Announcement Banner */}
            {announcementList.length > 0 && (
                <BannerCard
                    onTouchStart={(e) => onTouchStart(e)}
                    onTouchMove={onTouchMove}
                    onTouchEnd={() => onTouchEnd(handleNextAnnouncement, handlePrevAnnouncement)}
                >
                    <IconButton
                        size="small"
                        onClick={() => handleDismissAnnouncement(currentAnn.id)}
                        sx={{ position: 'absolute', top: 8, right: 8, color: 'white', opacity: 0.8 }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 1.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <Box sx={{
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                borderRadius: '12px',
                                p: 1,
                                display: 'flex',
                                color: '#fff'
                            }}>
                                {currentAnn.icon}
                            </Box>
                            <Box sx={{ flexGrow: 1, pr: 2 }}>
                                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', mb: 0.2 }}>
                                    {currentAnn.title}
                                </Typography>
                                <Typography sx={{ fontSize: '0.75rem', opacity: 0.95, lineHeight: 1.3, mb: 1 }}>
                                    {currentAnn.message}
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => {
                                            if (currentAnn.target) {
                                                onAction?.(currentAnn.target, currentAnn.tabIndex);
                                            }
                                        }}
                                        sx={{
                                            backgroundColor: '#fff',
                                            color: '#DD2476',
                                            fontWeight: 700,
                                            fontSize: '0.7rem',
                                            textTransform: 'none',
                                            borderRadius: '8px',
                                            px: 1.5,
                                            height: 28,
                                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
                                        }}
                                    >
                                        {currentAnn.actionLabel}
                                    </Button>

                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        {announcementList.map((_, idx) => (
                                            <BannerDot key={idx} active={idx === currentAnnouncement} />
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </BannerCard>
            )}

            {/* Hero Carousel */}
            <HeroCarouselWrapper>
                <Box sx={{
                    height: '100%',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                }}
                    onTouchStart={(e) => onTouchStart(e)}
                    onTouchMove={onTouchMove}
                    onTouchEnd={() => onTouchEnd(handleNextHero, handlePrevHero)}
                >
                    {/* Slide 1: Shift Highlights */}
                    {currentHeroSlide === 0 && (
                        <HeroSlide gradient="linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)">
                            <CardContent sx={{ p: 2.5, height: '100%', display: 'flex' }}>
                                <Box
                                    onClick={() => navigateToShift(mockShifts[0])}
                                    sx={{
                                        flex: 1,
                                        borderRight: '1px solid rgba(255,255,255,0.2)',
                                        pr: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        '&:active': { opacity: 0.7 }
                                    }}
                                >
                                    <Typography sx={{ fontSize: '0.8rem', opacity: 0.8, mb: 0.5 }}>Current Shift</Typography>
                                    <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.2 }}>{mockShifts[0].startTime}</Typography>
                                    <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, mb: 1 }}>{mockShifts[0].endTime}</Typography>
                                    <ModernChip
                                        label="In Progress"
                                        size="small"
                                        chipColor="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                                        sx={{ width: 'fit-content' }}
                                    />
                                </Box>
                                <Box sx={{ flex: 1, pl: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <UpcomingShiftRow
                                        onClick={() => navigateToShift(mockShifts[1])}
                                        sx={{ cursor: 'pointer', '&:active': { opacity: 0.7 } }}
                                    >
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Tomorrow</Typography>
                                        <Typography sx={{ fontSize: '0.7rem' }}>{mockShifts[1].startTime} - {mockShifts[1].endTime.split(' ')[0]}</Typography>
                                    </UpcomingShiftRow>
                                    <UpcomingShiftRow
                                        onClick={() => navigateToShift(mockShifts[2])}
                                        sx={{ cursor: 'pointer', '&:active': { opacity: 0.7 } }}
                                    >
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Friday</Typography>
                                        <Typography sx={{ fontSize: '0.7rem' }}>{mockShifts[2].startTime} - {mockShifts[2].endTime.split(' ')[0]}</Typography>
                                    </UpcomingShiftRow>
                                    <UpcomingShiftRow
                                        onClick={() => navigateToShift(mockShifts[3])}
                                        sx={{ cursor: 'pointer', '&:active': { opacity: 0.7 } }}
                                    >
                                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>Saturday</Typography>
                                        <Typography sx={{ fontSize: '0.7rem', color: '#ffccbc' }}>OFF DAY</Typography>
                                    </UpcomingShiftRow>
                                </Box>
                            </CardContent>
                        </HeroSlide>
                    )}

                    {/* Slide 2: Scorecard */}
                    {currentHeroSlide === 1 && (
                        <HeroSlide gradient="linear-gradient(135deg, #FF0080 0%, #7928CA 100%)">
                            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <StyledAvatar bgGradient="rgba(255,255,255,0.2)">
                                        <TrendingUpIcon sx={{ color: 'white' }} />
                                    </StyledAvatar>
                                    <Typography sx={{ fontWeight: 700, fontSize: '1.2rem' }}>Quality Score</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1 }}>
                                    <Typography sx={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>85%</Typography>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>Goal: 90%</Typography>
                                        <Typography sx={{ fontSize: '0.7rem', opacity: 0.8 }}>Last updated 2h ago</Typography>
                                    </Box>
                                </Box>
                                <StyledLinearProgress variant="determinate" value={85} sx={{ height: 10, borderRadius: 5 }} />
                            </CardContent>
                        </HeroSlide>
                    )}

                    {/* Slide 3: Competition */}
                    {currentHeroSlide === 2 && (
                        <HeroSlide gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" onClick={() => onPageChange('rewards')}>
                            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center' }}>
                                <TrophyOutlinedIcon sx={{ fontSize: 60, mb: 1, opacity: 0.9 }} />
                                <Typography sx={{ fontSize: '1.5rem', fontWeight: 800 }}>Top 3 Salesman</Typography>
                                <Typography sx={{ fontSize: '0.9rem', opacity: 0.9, mb: 2 }}>Current Competition: Spring Sprint</Typography>
                                <Button
                                    variant="outlined"
                                    sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', textTransform: 'none', borderRadius: '20px' }}
                                >
                                    View Leaderboard
                                </Button>
                            </CardContent>
                        </HeroSlide>
                    )}
                </Box>

                {/* Carousel Indicators */}
                <Box sx={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', zIndex: 5 }}>
                    {[0, 1, 2].map((i) => (
                        <HeroDot key={i} active={currentHeroSlide === i} onClick={() => setCurrentHeroSlide(i)} />
                    ))}
                </Box>
            </HeroCarouselWrapper>

            {/* Quick Stats Grid */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#333' }}>Your Performance</Typography>
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
                {/* Adherence */}
                <Grid item size={6} sx={{ display: 'flex' }}>
                    <StatCard onClick={() => onPageChange('performance')} sx={{ cursor: 'pointer' }}>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <ClockIcon sx={{ color: 'var(--primary-color)', fontSize: 18, mr: 0.5 }} />
                                <Typography sx={{ fontSize: '0.7rem', color: '#888' }}>
                                    Adherence
                                </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', mb: 0.25 }}>
                                92%
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: '#4caf50' }}>
                                <UpArrowIcon sx={{ fontSize: 14, mr: 0.2 }} />
                                <Typography sx={{ fontWeight: 700, fontSize: '0.65rem' }}>
                                    3% vs last week
                                </Typography>
                            </Box>
                        </CardContent>
                    </StatCard>
                </Grid>

                {/* Tagging */}
                <Grid item size={6} sx={{ display: 'flex' }}>
                    <StatCard onClick={() => onPageChange('performance')} sx={{ cursor: 'pointer' }}>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <TagIcon sx={{ color: 'var(--primary-color)', fontSize: 18, mr: 0.5 }} />
                                <Typography sx={{ fontSize: '0.7rem', color: '#888' }}>
                                    Tagging
                                </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', mb: 0.25 }}>
                                89%
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: '#f44336' }}>
                                <DownArrowIcon sx={{ fontSize: 14, mr: 0.2 }} />
                                <Typography sx={{ fontWeight: 700, fontSize: '0.65rem' }}>
                                    1% vs last week
                                </Typography>
                            </Box>
                        </CardContent>
                    </StatCard>
                </Grid>

                {/* AHT */}
                <Grid item size={6} sx={{ display: 'flex' }}>
                    <StatCard onClick={() => onPageChange('performance')} sx={{ cursor: 'pointer' }}>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <PhoneIcon sx={{ color: 'var(--primary-color)', fontSize: 18, mr: 0.5 }} />
                                <Typography sx={{ fontSize: '0.7rem', color: '#888' }}>
                                    AHT
                                </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', mb: 0.25 }}>
                                250s
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: '#4caf50' }}>
                                <DownArrowIcon sx={{ fontSize: 14, mr: 0.2 }} />
                                <Typography sx={{ fontWeight: 700, fontSize: '0.65rem' }}>
                                    12s improvement
                                </Typography>
                            </Box>
                        </CardContent>
                    </StatCard>
                </Grid>

                {/* Hold % */}
                <Grid item size={6} sx={{ display: 'flex' }}>
                    <StatCard onClick={() => onPageChange('performance')} sx={{ cursor: 'pointer' }}>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <PhoneIcon sx={{ color: 'var(--primary-color)', fontSize: 18, mr: 0.5 }} />
                                <Typography sx={{ fontSize: '0.7rem', color: '#888' }}>
                                    Hold %
                                </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', mb: 0.25 }}>
                                5%
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', color: '#ff9800' }}>
                                <UpArrowIcon sx={{ fontSize: 14, mr: 0.2 }} />
                                <Typography sx={{ fontWeight: 700, fontSize: '0.65rem' }}>
                                    0.5% increase
                                </Typography>
                            </Box>
                        </CardContent>
                    </StatCard>
                </Grid>
            </Grid>

            {/* Pending Actions */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#333' }}>Team Updates</Typography>
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
                        <ActionItemBox onClick={() => onAction('evaluations')}>
                            <Typography sx={{ fontSize: '0.85rem' }}>Complete Q1 Evaluation</Typography>
                            <Chip label="PMP" size="small" color="secondary" sx={{ height: 22, fontSize: '0.7rem' }} />
                        </ActionItemBox>
                        <ActionItemBox onClick={() => onAction('requests', 3)}>
                            <Typography sx={{ fontSize: '0.85rem' }}>Approve Shift Swap</Typography>
                            <Chip label="WFM" size="small" color="primary" sx={{ height: 22, fontSize: '0.7rem' }} />
                        </ActionItemBox>
                        <ActionItemBox onClick={() => onAction('coaching')}>
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
