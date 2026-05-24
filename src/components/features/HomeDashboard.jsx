import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Grid,
    Avatar,
    Button,
    IconButton,
} from '@mui/material';
import {
    TrendingUpOutlined as TrendingUpIcon,
    EmojiEventsOutlined as TrophyIcon,
    AccessTimeOutlined as ClockIcon,
    WarningOutlined as WarningIcon,
    PhoneOutlined as PhoneIcon,
    NotificationsActiveOutlined as AlertIcon,
    ChevronRight as ChevronRightIcon,
    SwapHorizOutlined as SwapIcon,
    Close as CloseIcon,
    LocalOfferOutlined as TagIcon,
    ArrowUpward as UpArrowIcon,
    ArrowDownward as DownArrowIcon,
    EmojiEventsOutlined as TrophyOutlinedIcon,
    CalendarTodayOutlined as CalendarTodayIcon,
    ScheduleOutlined as ScheduleIcon,
} from '@mui/icons-material';

// ============================================
// Design Tokens (from /docs screenshots)
// ============================================
const COLORS = {
    primary: '#061836',
    secondary: '#3068F4',
    pageBg: '#F5F7FA',
    cardBg: '#FFFFFF',
    cardBorder: '#E8ECF1',
    textPrimary: '#1A2138',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    trendGreen: '#10B981',
    trendRed: '#EF4444',
    trendOrange: '#F59E0B',
    accentBlue: '#3068F4',
    accentPurple: '#7C3AED',
    accentGreen: '#059669',
    accentOrange: '#EA580C',
    tintBlue: '#EEF2FF',
    tintPurple: '#F3EEFF',
    tintGreen: '#ECFDF5',
    tintOrange: '#FFF7ED',
    chipPmp: '#7C3AED',
    chipWfm: '#3068F4',
};

// ============================================
// Styled Components
// ============================================

const DashboardContainer = styled(Box)({
    padding: '16px',
    backgroundColor: COLORS.pageBg,
    minHeight: '100%',
});

const SectionTitle = styled(Typography)({
    fontWeight: 700,
    fontSize: '1rem',
    color: COLORS.textPrimary,
    marginBottom: 12,
});

const DashCard = styled(Card)({
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    border: `1px solid ${COLORS.cardBorder}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    marginBottom: 16,
    overflow: 'hidden',
    '&:active': {
        transform: 'scale(0.985)',
        transition: 'transform 0.1s ease',
    },
});

const AnnouncementCard = styled(Card)({
    background: `linear-gradient(135deg, ${COLORS.secondary} 0%, #1E50D4 100%)`,
    borderRadius: 16,
    color: '#ffffff',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(48,104,244,0.25)',
    border: 'none',
});

const AnnouncementDot = styled(Box)(({ active }) => ({
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: active ? '#fff' : 'rgba(255,255,255,0.35)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
}));

const AccentStatCard = styled(Card)(({ accentColor, tintColor }) => ({
    backgroundColor: tintColor || COLORS.tintBlue,
    borderRadius: 14,
    border: `1px solid ${COLORS.cardBorder}`,
    boxShadow: 'none',
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderLeft: `3.5px solid ${accentColor || COLORS.accentBlue}`,
    '&:active': {
        transform: 'scale(0.97)',
        transition: 'transform 0.1s ease',
    },
}));

const ShiftRow = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: `1px solid ${COLORS.cardBorder}`,
    cursor: 'pointer',
    '&:last-child': {
        borderBottom: 'none',
    },
    '&:active': {
        opacity: 0.7,
    },
});

const ActionRow = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: `1px solid ${COLORS.cardBorder}`,
    cursor: 'pointer',
    '&:last-child': {
        borderBottom: 'none',
    },
    '&:active': {
        backgroundColor: '#F9FAFB',
    },
});

const CompetitionBanner = styled(Card)({
    background: `linear-gradient(135deg, ${COLORS.secondary} 0%, #1E50D4 100%)`,
    borderRadius: 16,
    color: '#ffffff',
    marginBottom: 16,
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(48,104,244,0.25)',
    border: 'none',
    cursor: 'pointer',
    '&:active': {
        transform: 'scale(0.985)',
        transition: 'transform 0.1s ease',
    },
});

// SVG donut ring component
const DonutRing = ({ value, size = 120, strokeWidth = 10, color = COLORS.secondary }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    return (
        <Box sx={{ position: 'relative', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8ECF1" strokeWidth={strokeWidth} />
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
                    strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
            </svg>
            <Box sx={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1 }}>{value}%</Typography>
            </Box>
        </Box>
    );
};

// ============================================
// Component
// ============================================

const HomeDashboard = ({ onAction, onPageChange, onDayClick }) => {
    // Mock shifts for navigation
    const mockShifts = [
        { day: 'Tuesday', date: 'Feb 4', isToday: true, isOffDay: false, startTime: '09:00 AM', endTime: '05:00 PM', duration: '8 hours' },
        { day: 'Wednesday', date: 'Feb 5', isToday: false, isOffDay: false, startTime: '09:00 AM', endTime: '05:00 PM', duration: '8 hours' },
        { day: 'Thursday', date: 'Feb 6', isToday: false, isOffDay: false, startTime: '10:00 AM', endTime: '06:00 PM', duration: '8 hours' },
        { day: 'Friday', date: 'Feb 7', isToday: false, isOffDay: true },
    ];

    const navigateToShift = (shift) => {
        if (onDayClick) {
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
            tabIndex: 3
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

    // Touch Handling
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

    const onTouchStart = (e) => {
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

    // Hero Carousel State (for carousel comparison section)
    const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
    const handleNextHero = () => setCurrentHeroSlide((prev) => (prev + 1) % 3);
    const handlePrevHero = () => setCurrentHeroSlide((prev) => (prev - 1 + 3) % 3);

    // Stat card configs
    const statCards = [
        { label: 'Adherence', value: '92%', delta: '3% vs last week', deltaDir: 'up', deltaColor: COLORS.trendGreen, icon: <ClockIcon sx={{ fontSize: 18 }} />, accentColor: COLORS.accentBlue, tintColor: COLORS.tintBlue },
        { label: 'Tagging', value: '89%', delta: '1% vs last week', deltaDir: 'down', deltaColor: COLORS.trendRed, icon: <TagIcon sx={{ fontSize: 18 }} />, accentColor: COLORS.accentPurple, tintColor: COLORS.tintPurple },
        { label: 'AHT', value: '250s', delta: '12s improvement', deltaDir: 'down', deltaColor: COLORS.trendGreen, icon: <PhoneIcon sx={{ fontSize: 18 }} />, accentColor: COLORS.accentGreen, tintColor: COLORS.tintGreen },
        { label: 'Hold %', value: '5%', delta: '0.5% increase', deltaDir: 'up', deltaColor: COLORS.trendOrange, icon: <PhoneIcon sx={{ fontSize: 18 }} />, accentColor: COLORS.accentOrange, tintColor: COLORS.tintOrange },
    ];

    // Action items
    const actionItems = [
        { label: 'Complete Q1 Evaluation', chip: 'PMP', chipColor: COLORS.chipPmp, action: () => onAction('evaluations') },
        { label: 'Approve Shift Swap', chip: 'WFM', chipColor: COLORS.chipWfm, action: () => onAction('requests', 3) },
        { label: 'Review Coaching Plan', chip: 'PMP', chipColor: COLORS.chipPmp, action: () => onAction('coaching') },
    ];

    return (
        <DashboardContainer>
            {/* ── Greeting Header ── */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Typography sx={{ fontSize: '0.85rem', color: COLORS.textSecondary, fontWeight: 500 }}>Good Morning,</Typography>
                    <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: COLORS.textPrimary, lineHeight: 1.2 }}>Sami</Typography>
                </Box>
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 0.5,
                    backgroundColor: COLORS.tintBlue, borderRadius: '20px', px: 1.5, py: 0.5,
                }}>
                    <CalendarTodayIcon sx={{ fontSize: 14, color: COLORS.secondary }} />
                    <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: COLORS.secondary }}>Tue, Feb 4</Typography>
                </Box>
            </Box>

            {/* ── Announcement Banner ── */}
            {announcementList.length > 0 && (
                <AnnouncementCard
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={() => onTouchEnd(handleNextAnnouncement, handlePrevAnnouncement)}
                >
                    <IconButton
                        size="small"
                        onClick={() => handleDismissAnnouncement(currentAnn.id)}
                        sx={{ position: 'absolute', top: 8, right: 8, color: 'rgba(255,255,255,0.7)' }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 1.5 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <Box sx={{
                                backgroundColor: 'rgba(255,255,255,0.12)',
                                borderRadius: '12px', p: 1, display: 'flex', color: '#fff',
                            }}>
                                {currentAnn.icon}
                            </Box>
                            <Box sx={{ flexGrow: 1, pr: 2 }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', mb: 0.3 }}>{currentAnn.title}</Typography>
                                <Typography sx={{ fontSize: '0.75rem', opacity: 0.85, lineHeight: 1.35, mb: 1.2 }}>{currentAnn.message}</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Button
                                        size="small"
                                        onClick={() => {
                                            if (currentAnn.target) {
                                                onAction?.(currentAnn.target, currentAnn.tabIndex);
                                            }
                                        }}
                                        sx={{
                                            backgroundColor: COLORS.secondary, color: '#fff',
                                            fontWeight: 700, fontSize: '0.7rem', textTransform: 'none',
                                            borderRadius: '20px', px: 2, height: 28,
                                            '&:hover': { backgroundColor: '#2558D4' },
                                        }}
                                    >
                                        {currentAnn.actionLabel}
                                    </Button>
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                        {announcementList.map((_, idx) => (
                                            <AnnouncementDot key={idx} active={idx === currentAnnouncement} onClick={() => setCurrentAnnouncement(idx)} />
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </CardContent>
                </AnnouncementCard>
            )}

            {/* ── Today's Shift Card ── */}
            <DashCard sx={{ height: 220 }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ width: 3.5, height: 20, backgroundColor: COLORS.secondary, borderRadius: 2, mr: 1.5 }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: COLORS.textPrimary, flex: 1 }}>Today's Shift</Typography>
                        <Chip label="In Progress" size="small" sx={{
                            backgroundColor: `${COLORS.trendGreen}15`, color: COLORS.trendGreen,
                            fontWeight: 700, fontSize: '0.68rem', height: 22, border: `1px solid ${COLORS.trendGreen}30`,
                        }} />
                    </Box>
                    <Box
                        onClick={() => navigateToShift(mockShifts[0])}
                        sx={{
                            display: 'flex', alignItems: 'center', gap: 1.5,
                            backgroundColor: COLORS.tintBlue, borderRadius: '12px', p: 1.2, mb: 1, cursor: 'pointer',
                            '&:active': { opacity: 0.7 },
                        }}
                    >
                        <Box sx={{ backgroundColor: `${COLORS.secondary}15`, borderRadius: '10px', p: 0.8, display: 'flex' }}>
                            <ScheduleIcon sx={{ color: COLORS.secondary, fontSize: 20 }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: '0.68rem', color: COLORS.textSecondary, fontWeight: 500 }}>Current</Typography>
                            <Typography sx={{ fontSize: '0.95rem', fontWeight: 800, color: COLORS.textPrimary }}>
                                {mockShifts[0].startTime} — {mockShifts[0].endTime}
                            </Typography>
                        </Box>
                        <ChevronRightIcon sx={{ color: COLORS.textMuted, fontSize: 20 }} />
                    </Box>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                        {mockShifts.slice(1).map((shift, i) => (
                            <ShiftRow key={i} onClick={() => navigateToShift(shift)} sx={{ py: '6px' }}>
                                <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: COLORS.textPrimary }}>{shift.day}</Typography>
                                {shift.isOffDay ? (
                                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: COLORS.trendOrange }}>OFF DAY</Typography>
                                ) : (
                                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.textSecondary }}>
                                        {shift.startTime} - {shift.endTime.split(' ')[0]}
                                    </Typography>
                                )}
                            </ShiftRow>
                        ))}
                    </Box>
                </CardContent>
            </DashCard>

            {/* ── Scorecard Card ── */}
            <DashCard onClick={() => onPageChange('performance')} sx={{ cursor: 'pointer', height: 220 }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ width: 3.5, height: 20, backgroundColor: COLORS.accentPurple, borderRadius: 2, mr: 1.5 }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: COLORS.textPrimary, flex: 1 }}>Scorecard</Typography>
                    </Box>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', pb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1.5 }}>
                            <Box>
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.textPrimary, mb: 0.2 }}>Quality Score</Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: COLORS.textMuted }}>Last updated 2h ago</Typography>
                            </Box>
                            <Typography sx={{ fontSize: '2.4rem', fontWeight: 800, color: COLORS.secondary, lineHeight: 1 }}>85%</Typography>
                        </Box>
                        <Box sx={{ height: 14, borderRadius: 7, backgroundColor: '#E8ECF1', overflow: 'hidden' }}>
                            <Box sx={{ width: '85%', height: '100%', borderRadius: 7, backgroundColor: COLORS.secondary, transition: 'width 0.6s ease' }} />
                        </Box>
                    </Box>
                </CardContent>
            </DashCard>

            {/* ── Gamification Card ── */}
            <DashCard onClick={() => onPageChange('rewards')} sx={{ cursor: 'pointer', height: 220 }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ width: 3.5, height: 20, backgroundColor: COLORS.trendOrange, borderRadius: 2, mr: 1.5 }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: COLORS.textPrimary, flex: 1 }}>Top 3 Salesman</Typography>
                        <Chip label="Spring Sprint" size="small" sx={{
                            backgroundColor: `${COLORS.trendOrange}15`, color: COLORS.trendOrange,
                            fontWeight: 700, fontSize: '0.68rem', height: 22, border: `1px solid ${COLORS.trendOrange}30`,
                        }} />
                    </Box>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', mt: 0.5 }}>
                        {/* Rank 1 */}
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: '8px', backgroundColor: '#F9FAFB' }}>
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: COLORS.textMuted, width: 20 }}>1</Typography>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: COLORS.secondary, mr: 1, fontWeight: 700 }}>SM</Avatar>
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.textPrimary, flex: 1 }}>Sarah M.</Typography>
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.textPrimary }}>1,250 <span style={{ fontSize: '0.6rem', color: COLORS.textMuted, fontWeight: 500 }}>pts</span></Typography>
                        </Box>
                        {/* Rank 2 (You) */}
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: '8px', backgroundColor: `${COLORS.trendOrange}10`, border: `1px solid ${COLORS.trendOrange}30` }}>
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: COLORS.trendOrange, width: 20 }}>2</Typography>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: COLORS.trendOrange, mr: 1, fontWeight: 700 }}>Y</Avatar>
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.trendOrange, flex: 1 }}>You</Typography>
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: COLORS.trendOrange }}>1,120 <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>pts</span></Typography>
                        </Box>
                        {/* Rank 3 */}
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: '8px', backgroundColor: '#F9FAFB' }}>
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: COLORS.textMuted, width: 20 }}>3</Typography>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: COLORS.secondary, mr: 1, fontWeight: 700 }}>AK</Avatar>
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.textPrimary, flex: 1 }}>Ahmad K.</Typography>
                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.textPrimary }}>980 <span style={{ fontSize: '0.6rem', color: COLORS.textMuted, fontWeight: 500 }}>pts</span></Typography>
                        </Box>
                    </Box>
                </CardContent>
            </DashCard>

            {/* ══════════════════════════════════════════════
                CAROUSEL VERSION (for comparison — remove the one you don't want)
                ══════════════════════════════════════════════ */}
            <Box sx={{ mb: 2 }}>
                <SectionTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Carousel Version
                    <Chip label="COMPARE" size="small" sx={{
                        backgroundColor: `${COLORS.trendOrange}18`, color: COLORS.trendOrange,
                        fontWeight: 700, fontSize: '0.6rem', height: 20,
                    }} />
                </SectionTitle>
                <Box
                    sx={{ position: 'relative', minHeight: 220 }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={() => onTouchEnd(handleNextHero, handlePrevHero)}
                >
                    {/* Slide 1: Shift Highlights */}
                    {currentHeroSlide === 0 && (
                        <DashCard sx={{ mb: 0 }}>
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                    <Box sx={{ width: 3.5, height: 20, backgroundColor: COLORS.secondary, borderRadius: 2, mr: 1.5 }} />
                                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: COLORS.textPrimary, flex: 1 }}>Today's Shift</Typography>
                                    <Chip label="In Progress" size="small" sx={{
                                        backgroundColor: `${COLORS.trendGreen}15`, color: COLORS.trendGreen,
                                        fontWeight: 700, fontSize: '0.68rem', height: 24, border: `1px solid ${COLORS.trendGreen}30`,
                                    }} />
                                </Box>
                                <Box
                                    onClick={() => navigateToShift(mockShifts[0])}
                                    sx={{
                                        display: 'flex', alignItems: 'center', gap: 1.5,
                                        backgroundColor: COLORS.tintBlue, borderRadius: '12px', p: 1.5, mb: 1.5, cursor: 'pointer',
                                        '&:active': { opacity: 0.7 },
                                    }}
                                >
                                    <Box sx={{ backgroundColor: `${COLORS.secondary}15`, borderRadius: '10px', p: 1, display: 'flex' }}>
                                        <ScheduleIcon sx={{ color: COLORS.secondary, fontSize: 22 }} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontSize: '0.72rem', color: COLORS.textSecondary, fontWeight: 500, mb: 0.2 }}>Current Shift</Typography>
                                        <Typography sx={{ fontSize: '1.05rem', fontWeight: 800, color: COLORS.textPrimary }}>
                                            {mockShifts[0].startTime} — {mockShifts[0].endTime}
                                        </Typography>
                                    </Box>
                                    <ChevronRightIcon sx={{ color: COLORS.textMuted, fontSize: 20 }} />
                                </Box>
                                <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.5 }}>Upcoming</Typography>
                                {mockShifts.slice(1).map((shift, i) => (
                                    <ShiftRow key={i} onClick={() => navigateToShift(shift)}>
                                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: COLORS.textPrimary }}>{shift.day}</Typography>
                                        {shift.isOffDay ? (
                                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: COLORS.trendOrange }}>OFF DAY</Typography>
                                        ) : (
                                            <Typography sx={{ fontSize: '0.78rem', color: COLORS.textSecondary }}>
                                                {shift.startTime} - {shift.endTime.split(' ')[0]}
                                            </Typography>
                                        )}
                                    </ShiftRow>
                                ))}
                            </CardContent>
                        </DashCard>
                    )}

                    {/* Slide 2: Quality Score */}
                    {currentHeroSlide === 1 && (
                        <DashCard onClick={() => onPageChange('performance')} sx={{ cursor: 'pointer', mb: 0, height: 220 }}>
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Box sx={{ width: 3.5, height: 20, backgroundColor: COLORS.accentPurple, borderRadius: 2, mr: 1.5 }} />
                                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: COLORS.textPrimary, flex: 1 }}>Scorecard</Typography>
                                </Box>
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', pb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1.5 }}>
                                        <Box>
                                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.textPrimary, mb: 0.2 }}>Quality Score</Typography>
                                            <Typography sx={{ fontSize: '0.7rem', color: COLORS.textMuted }}>Last updated 2h ago</Typography>
                                        </Box>
                                        <Typography sx={{ fontSize: '2.4rem', fontWeight: 800, color: COLORS.secondary, lineHeight: 1 }}>85%</Typography>
                                    </Box>
                                    <Box sx={{ height: 14, borderRadius: 7, backgroundColor: '#E8ECF1', overflow: 'hidden' }}>
                                        <Box sx={{ width: '85%', height: '100%', borderRadius: 7, backgroundColor: COLORS.secondary, transition: 'width 0.6s ease' }} />
                                    </Box>
                                </Box>
                            </CardContent>
                        </DashCard>
                    )}

                    {/* Slide 3: Gamification */}
                    {currentHeroSlide === 2 && (
                        <DashCard onClick={() => onPageChange('rewards')} sx={{ cursor: 'pointer', mb: 0, height: 220 }}>
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Box sx={{ width: 3.5, height: 20, backgroundColor: COLORS.trendOrange, borderRadius: 2, mr: 1.5 }} />
                                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: COLORS.textPrimary, flex: 1 }}>Top 3 Salesman</Typography>
                                    <Chip label="Spring Sprint" size="small" sx={{
                                        backgroundColor: `${COLORS.trendOrange}15`, color: COLORS.trendOrange,
                                        fontWeight: 700, fontSize: '0.68rem', height: 22, border: `1px solid ${COLORS.trendOrange}30`,
                                    }} />
                                </Box>
                                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', mt: 0.5 }}>
                                    {/* Rank 1 */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: '8px', backgroundColor: '#F9FAFB' }}>
                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: COLORS.textMuted, width: 20 }}>1</Typography>
                                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: COLORS.secondary, mr: 1, fontWeight: 700 }}>SM</Avatar>
                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.textPrimary, flex: 1 }}>Sarah M.</Typography>
                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.textPrimary }}>1,250 <span style={{ fontSize: '0.6rem', color: COLORS.textMuted, fontWeight: 500 }}>pts</span></Typography>
                                    </Box>
                                    {/* Rank 2 (You) */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: '8px', backgroundColor: `${COLORS.trendOrange}10`, border: `1px solid ${COLORS.trendOrange}30` }}>
                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: COLORS.trendOrange, width: 20 }}>2</Typography>
                                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: COLORS.trendOrange, mr: 1, fontWeight: 700 }}>Y</Avatar>
                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.trendOrange, flex: 1 }}>You</Typography>
                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: COLORS.trendOrange }}>1,120 <span style={{ fontSize: '0.6rem', fontWeight: 600 }}>pts</span></Typography>
                                    </Box>
                                    {/* Rank 3 */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: '8px', backgroundColor: '#F9FAFB' }}>
                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 800, color: COLORS.textMuted, width: 20 }}>3</Typography>
                                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem', bgcolor: COLORS.secondary, mr: 1, fontWeight: 700 }}>AK</Avatar>
                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: COLORS.textPrimary, flex: 1 }}>Ahmad K.</Typography>
                                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: COLORS.textPrimary }}>980 <span style={{ fontSize: '0.6rem', color: COLORS.textMuted, fontWeight: 500 }}>pts</span></Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </DashCard>
                    )}
                </Box>

                {/* Carousel Dots */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.75, mt: 1.5 }}>
                    {[0, 1, 2].map((i) => (
                        <Box
                            key={i}
                            onClick={() => setCurrentHeroSlide(i)}
                            sx={{
                                width: currentHeroSlide === i ? 20 : 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: currentHeroSlide === i ? COLORS.secondary : COLORS.cardBorder,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* ── Quick Stats Grid ── */}
            <SectionTitle>Your Performance</SectionTitle>
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
                {statCards.map((stat, i) => (
                    <Grid item size={6} sx={{ display: 'flex' }} key={i}>
                        <AccentStatCard
                            accentColor={stat.accentColor}
                            tintColor={stat.tintColor}
                            onClick={() => onPageChange('performance')}
                            sx={{ cursor: 'pointer', width: '100%' }}
                        >
                            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    <Box sx={{ color: stat.accentColor, display: 'flex', mr: 0.5 }}>{stat.icon}</Box>
                                    <Typography sx={{ fontSize: '0.7rem', color: COLORS.textSecondary, fontWeight: 500 }}>{stat.label}</Typography>
                                </Box>
                                <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: COLORS.textPrimary, mb: 0.25 }}>{stat.value}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', color: stat.deltaColor }}>
                                    {stat.deltaDir === 'up'
                                        ? <UpArrowIcon sx={{ fontSize: 14, mr: 0.2 }} />
                                        : <DownArrowIcon sx={{ fontSize: 14, mr: 0.2 }} />
                                    }
                                    <Typography sx={{ fontWeight: 600, fontSize: '0.65rem' }}>{stat.delta}</Typography>
                                </Box>
                            </CardContent>
                        </AccentStatCard>
                    </Grid>
                ))}
            </Grid>

            {/* ── Pending Actions ── */}
            <SectionTitle>Team Updates</SectionTitle>
            <DashCard>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Avatar sx={{
                            width: 40, height: 40, mr: 1.5,
                            backgroundColor: COLORS.tintOrange,
                        }}>
                            <WarningIcon sx={{ fontSize: 20, color: COLORS.accentOrange }} />
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: COLORS.textPrimary }}>Pending Actions</Typography>
                            <Typography sx={{ color: COLORS.textSecondary, fontSize: '0.78rem' }}>3 items need your attention</Typography>
                        </Box>
                    </Box>
                    {actionItems.map((item, i) => (
                        <ActionRow key={i} onClick={item.action}>
                            <Typography sx={{ fontSize: '0.85rem', color: COLORS.textPrimary, fontWeight: 500 }}>{item.label}</Typography>
                            <Chip
                                label={item.chip}
                                size="small"
                                sx={{
                                    height: 22, fontSize: '0.68rem', fontWeight: 700,
                                    backgroundColor: `${item.chipColor}12`, color: item.chipColor,
                                    border: `1px solid ${item.chipColor}25`,
                                }}
                            />
                        </ActionRow>
                    ))}
                </CardContent>
            </DashCard>
        </DashboardContainer>
    );
};

export default HomeDashboard;
