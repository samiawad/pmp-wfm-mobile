import { useState, useEffect } from 'react';
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
    background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    borderRadius: 16,
    color: 'white',
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0, 114, 255, 0.25)',
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
    height: '240px',
    marginBottom: 20,
    position: 'relative',
    width: '100%',
});

const HeroSlide = styled(Card)(({ theme }) => ({
    height: '100%',
    borderRadius: 22,
    background: '#1C1C1E',
    color: 'white',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'row',
}));

const HeroDot = styled(Box)(({ active }) => ({
    width: active ? 16 : 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: active ? '#ffffff' : 'rgba(255,255,255,0.3)',
    margin: '0 3px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
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

    // Hero Carousel State — synced with ?carousel= URL param
    const heroSlideKeys = ['shifts', 'scorecards', 'rewards'];
    const getInitialHeroSlide = () => {
        const params = new URLSearchParams(window.location.search);
        const c = params.get('carousel');
        const idx = heroSlideKeys.indexOf(c);
        return idx >= 0 ? idx : 0;
    };
    const [currentHeroSlide, setCurrentHeroSlide] = useState(getInitialHeroSlide);

    // Keep URL in sync whenever hero slide changes
    useEffect(() => {
        const params = new URLSearchParams();
        params.set('page', 'home');
        params.set('carousel', heroSlideKeys[currentHeroSlide]);
        window.history.replaceState(null, '', '?' + params.toString());
    }, [currentHeroSlide]);

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
                                            color: '#0072ff',
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
                                            <BannerDot
                                                key={idx}
                                                active={idx === currentAnnouncement}
                                                onClick={() => setCurrentAnnouncement(idx)}
                                                sx={{ cursor: 'pointer' }}
                                            />
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
                        <HeroSlide>
                            <Box
                                onClick={() => navigateToShift(mockShifts[0])}
                                sx={{
                                    flex: 0.45,
                                    p: 2.5,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    '&:active': { opacity: 0.7 }
                                }}
                            >
                                <Box>
                                    <Typography sx={{ color: '#FF453A', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {mockShifts[0].day}
                                    </Typography>
                                    <Typography sx={{ fontSize: '4rem', fontWeight: 400, lineHeight: 1.1, mt: 0.5, mb: 1 }}>
                                        {mockShifts[0].date.split(' ')[1]}
                                    </Typography>
                                </Box>
                                <Typography sx={{ color: '#98989D', fontSize: '1rem', fontWeight: 500, lineHeight: 1.3 }}>
                                    Current Shift<br/>
                                    <span style={{ fontSize: '0.85rem' }}>{mockShifts[0].startTime}</span>
                                </Typography>
                            </Box>
                            
                            <Box sx={{ flex: 0.55, p: 2.5, pl: 0, display: 'flex', flexDirection: 'column' }}>
                                <Typography sx={{ color: '#98989D', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5 }}>
                                    Upcoming Shifts
                                </Typography>
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {/* Item 1 */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#2C2C2E', borderRadius: '8px', p: 1.25 }}>
                                        <Box sx={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#30D158', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5, flexShrink: 0 }}>
                                            <CalendarIcon sx={{ fontSize: 13, color: '#1C1C1E' }} />
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Tomorrow</Typography>
                                        </Box>
                                    </Box>
                                    {/* Item 2 */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#2C2C2E', borderRadius: '8px', p: 1.25 }}>
                                        <Box sx={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #30D158', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5, flexShrink: 0 }}>
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Friday</Typography>
                                            <Typography sx={{ fontSize: '0.75rem', color: '#98989D' }}>{mockShifts[2].startTime}</Typography>
                                        </Box>
                                    </Box>
                                    {/* Item 3 */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#2C2C2E', borderRadius: '8px', p: 1.25 }}>
                                        <Box sx={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #30D158', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5, flexShrink: 0 }}>
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Saturday</Typography>
                                            <Typography sx={{ fontSize: '0.75rem', color: '#98989D' }}>OFF DAY</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </HeroSlide>
                    )}

                    {/* Slide 2: Scorecard */}
                    {currentHeroSlide === 1 && (
                        <HeroSlide>
                            <Box
                                sx={{
                                    flex: 0.45,
                                    p: 2.5,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Box>
                                    <Typography sx={{ color: '#0A84FF', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        QUALITY
                                    </Typography>
                                    <Typography sx={{ fontSize: '4rem', fontWeight: 400, lineHeight: 1.1, mt: 0.5, mb: 1 }}>
                                        85<span style={{fontSize: '2rem'}}>%</span>
                                    </Typography>
                                </Box>
                                <Typography sx={{ color: '#98989D', fontSize: '1rem', fontWeight: 500, lineHeight: 1.3 }}>
                                    Performance<br/>
                                    <span style={{ fontSize: '0.85rem' }}>Updated 2h ago</span>
                                </Typography>
                            </Box>
                            
                            <Box sx={{ flex: 0.55, p: 2.5, pl: 0, display: 'flex', flexDirection: 'column' }}>
                                <Typography sx={{ color: '#98989D', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5 }}>
                                    METRICS
                                </Typography>
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {/* Item 1 */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#2C2C2E', borderRadius: '8px', p: 1.25 }}>
                                        <Box sx={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#0A84FF', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5, flexShrink: 0 }}>
                                            <TrendingUpIcon sx={{ fontSize: 13, color: '#1C1C1E' }} />
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Goal: 90%</Typography>
                                        </Box>
                                    </Box>
                                    {/* Item 2 */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#2C2C2E', borderRadius: '8px', p: 1.25 }}>
                                        <Box sx={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #0A84FF', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5, flexShrink: 0 }}>
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>On Track</Typography>
                                            <Typography sx={{ fontSize: '0.75rem', color: '#98989D' }}>Keep training</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </HeroSlide>
                    )}

                    {/* Slide 3: Competition */}
                    {currentHeroSlide === 2 && (
                        <HeroSlide onClick={() => onPageChange('rewards')} sx={{ cursor: 'pointer', '&:active': { opacity: 0.7 } }}>
                            <Box
                                sx={{
                                    flex: 0.45,
                                    p: 2.5,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Box>
                                    <Typography sx={{ color: '#FFD60A', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        RANKING
                                    </Typography>
                                    <Typography sx={{ fontSize: '4rem', fontWeight: 400, lineHeight: 1.1, mt: 0.5, mb: 1 }}>
                                        #1
                                    </Typography>
                                </Box>
                                <Typography sx={{ color: '#98989D', fontSize: '1rem', fontWeight: 500, lineHeight: 1.3 }}>
                                    Spring Sprint<br/>
                                    <span style={{ fontSize: '0.85rem' }}>Top Salesman</span>
                                </Typography>
                            </Box>
                            
                            <Box sx={{ flex: 0.55, p: 2.5, pl: 0, display: 'flex', flexDirection: 'column' }}>
                                <Typography sx={{ color: '#98989D', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5 }}>
                                    LEADERBOARD
                                </Typography>
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {/* Item 1 */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#2C2C2E', borderRadius: '8px', p: 1.25 }}>
                                        <Box sx={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#FFD60A', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5, flexShrink: 0 }}>
                                            <TrophyIcon sx={{ fontSize: 13, color: '#1C1C1E' }} />
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Omar Jabri</Typography>
                                        </Box>
                                    </Box>
                                    {/* Item 2 */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#2C2C2E', borderRadius: '8px', p: 1.25 }}>
                                        <Box sx={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #FFD60A', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5, flexShrink: 0 }}>
                                            <Typography sx={{fontSize: '0.6rem', color: '#FFD60A', fontWeight: 800}}>2</Typography>
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Sara Ahmed</Typography>
                                        </Box>
                                    </Box>
                                    {/* Item 3 */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#2C2C2E', borderRadius: '8px', p: 1.25 }}>
                                        <Box sx={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #FFD60A', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1.5, flexShrink: 0 }}>
                                            <Typography sx={{fontSize: '0.6rem', color: '#FFD60A', fontWeight: 800}}>3</Typography>
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>Ali Hasan</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
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
            <ModernCard gradient="linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)">
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <StyledAvatar bgGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
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
