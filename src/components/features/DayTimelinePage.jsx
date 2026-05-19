import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    IconButton,
    Chip,
    SwipeableDrawer,
    Divider,
    Paper,
    Radio,
    Fab,
    TextField,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    ArrowBack as BackIcon,
    FreeBreakfast as BreakIcon,
    Work as ShiftIcon,
    WeekendOutlined as OffDayIcon,
    AccessTime as TimeIcon,
    Timelapse as DurationIcon,
    CheckCircle as StatusIcon,
    Person as ApprovedByIcon,
    CalendarToday as RequestDateIcon,
    Category as TypeIcon,
    Close as CloseIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    Add as AddIcon,
    EventBusy as DayOffIcon,
    PersonOff as PersonalLeaveIcon,
    LocalHospital as SickLeaveIcon,
    MedicalServices as SickDayOffIcon,
    SwapHoriz as SwapIcon,
} from '@mui/icons-material';

// ============================================
// Shared field style — matches all request modals in the app
// ============================================

const fieldSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        backgroundColor: '#ffffff',
        fontSize: '0.9rem',
        '& fieldset': { border: '1px solid #00000014' },
        '&:hover fieldset': { border: '1px solid #00000014' },
        '&.Mui-focused fieldset': { border: '1px solid #00000014' },
        '&.Mui-disabled': { backgroundColor: 'rgba(0,0,0,0.04)' },
    },
    '& .MuiInputLabel-root': {
        color: '#94a3b8',
        fontSize: '0.88rem',
        '&.Mui-focused': { color: 'var(--primary-color)' },
    },
};

// ============================================
// Helper Functions
// ============================================

const parseTimeToMinutes = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
};

const formatMinutesToTime = (minutes) => {
    let hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${hours}:${mins.toString().padStart(2, '0')} ${period}`;
};

const calculateBreaks = (startTime, endTime) => {
    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);
    let shiftDuration = endMinutes - startMinutes;
    if (shiftDuration < 0) shiftDuration += 24 * 60;

    const breaks = [];
    const minGap = 120;

    if (shiftDuration >= minGap + 15) {
        const b1 = startMinutes + minGap;
        breaks.push({ start: b1, end: b1 + 15, label: 'Break (15 min)' });

        if (shiftDuration >= minGap + 15 + minGap + 30) {
            const b2 = b1 + 15 + minGap;
            breaks.push({ start: b2, end: b2 + 30, label: 'Lunch Break (30 min)' });

            if (shiftDuration >= minGap + 15 + minGap + 30 + minGap + 15) {
                const b3 = b2 + 30 + minGap;
                breaks.push({ start: b3, end: b3 + 15, label: 'Break (15 min)' });
            }
        }
    }
    return breaks;
};

// ============================================
// Constants
// ============================================

const HOUR_HEIGHT = 96; // px per hour — gives 24px per 15-min slot (min break size)
const TOTAL_HOURS = 24;
const TIMELINE_HEIGHT = HOUR_HEIGHT * TOTAL_HOURS;
const TIME_GUTTER_WIDTH = 56;

// ============================================
// Styled Components
// ============================================

const PageContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#f5f5f5',
});

const Header = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 12px 10px 4px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e8ecf1',
    color: '#1a1a1a',
    position: 'sticky',
    top: 0,
    zIndex: 10,
});

const HeaderTextBlock = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
});

const HeaderDay = styled(Typography)({
    fontWeight: 700,
    fontSize: '1rem',
    lineHeight: 1.3,
    color: '#1a1a1a',
});

const HeaderDate = styled(Typography)({
    fontSize: '0.78rem',
    color: '#666',
    lineHeight: 1.2,
});

const ScrollArea = styled(Box)({
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
    WebkitOverflowScrolling: 'touch',
});

const TimelineBody = styled(Box)({
    position: 'relative',
    display: 'flex',
    height: TIMELINE_HEIGHT,
    marginTop: 0,
});

const TimeGutter = styled(Box)({
    width: TIME_GUTTER_WIDTH,
    flexShrink: 0,
    position: 'relative',
    borderRight: '1px solid #e0e0e0',
    backgroundColor: '#fafafa',
});

const HourLabel = styled(Typography)({
    position: 'absolute',
    right: 8,
    transform: 'translateY(-50%)',
    fontSize: '0.65rem',
    fontWeight: 500,
    color: '#888',
    whiteSpace: 'nowrap',
    userSelect: 'none',
});

const GridArea = styled(Box)({
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
});

const HourLine = styled(Box)({
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#eeeeee',
});

const HalfHourLine = styled(Box)({
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#f5f5f5',
    borderTop: '1px dashed #eee',
});

const NowLine = styled(Box)({
    position: 'absolute',
    left: -6,
    right: 0,
    height: 2,
    backgroundColor: '#f44336',
    zIndex: 5,
    '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: -4,
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: '#f44336',
    },
});

const ActivityBlock = styled(Box)(({ accentcolor }) => ({
    position: 'absolute',
    left: 6,
    right: 6,
    borderRadius: 10,
    backgroundColor: accentcolor ? `${accentcolor}12` : '#f0f4f8',
    borderLeft: `3.5px solid ${accentcolor || '#ccc'}`,
    color: '#1a1a1a',
    padding: '8px 10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    zIndex: 3,
    cursor: 'default',
    transition: 'box-shadow 0.15s ease',
    '&:hover': {
        boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
    },
}));

const ActivityTitle = styled(Typography)({
    fontWeight: 700,
    fontSize: '0.82rem',
    lineHeight: 1.3,
    color: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
});

const ActivityTime = styled(Typography)({
    fontSize: '0.72rem',
    marginTop: 2,
    fontWeight: 500,
});

const OffDayOverlay = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,235,238,0.6)',
    zIndex: 2,
});

const LegendBar = styled(Box)({
    display: 'flex',
    gap: 8,
    padding: '8px 12px',
    backgroundColor: '#fff',
    borderTop: '1px solid #eee',
    overflowX: 'auto',
    flexShrink: 0,
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
});

// Bottom Sheet Styled Components
const SheetHandle = styled(Box)({
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d0d0d0',
    margin: '12px auto 4px',
});


// ============================================
// Request Type Definitions
// ============================================

const REQUEST_TYPES = [
    { id: 'day_off', label: 'Day Off', icon: <DayOffIcon />, color: '#e91e63', needsTime: false, isSwap: false, multiDay: true },
    { id: 'personal_leave', label: 'Personal Leave', icon: <PersonalLeaveIcon />, color: 'var(--primary-color)', needsTime: true, isSwap: false, multiDay: false },
    { id: 'sick_leave', label: 'Sick Leave', icon: <SickLeaveIcon />, color: '#ff9800', needsTime: true, isSwap: false, multiDay: false },
    { id: 'sick_day_off', label: 'Sick Day Off', icon: <SickDayOffIcon />, color: '#f44336', needsTime: false, isSwap: false, multiDay: true },
    { id: 'shift_swap', label: 'Shift Swap', icon: <SwapIcon />, color: '#2196f3', needsTime: false, isSwap: true, multiDay: false },
    { id: 'break_swap', label: 'Break Swap', icon: <SwapIcon />, color: '#009688', needsTime: true, isSwap: true, multiDay: false },
    { id: 'day_off_swap', label: 'Day Off Swap', icon: <SwapIcon />, color: '#795548', needsTime: false, isSwap: true, multiDay: false },
];

// Split types by category
const LEAVE_TYPES = REQUEST_TYPES.filter(t => !t.isSwap);
const SWAP_TYPES = REQUEST_TYPES.filter(t => t.isSwap);

// Step order for the unified request sheet
const STEP_ORDER = ['form', 'agents', 'confirm'];

// ============================================
// Mock Agent Data (skill group peers)
// ============================================

const MOCK_AGENTS = [
    {
        id: 'a1', name: 'Ahmad Khalil',
        shift: { start: '09:00 AM', end: '05:00 PM' },
        breaks: [{ start: 660, end: 675, label: 'Tea Break' }, { start: 780, end: 810, label: 'Lunch Break' }],
        isOff: false,
    },
    {
        id: 'a2', name: 'Sara Hassan',
        shift: { start: '10:00 AM', end: '06:00 PM' },
        breaks: [{ start: 720, end: 735, label: 'Tea Break' }, { start: 840, end: 870, label: 'Lunch Break' }],
        isOff: false,
    },
    {
        id: 'a3', name: 'Omar Jabri',
        shift: { start: '08:00 AM', end: '04:00 PM' },
        breaks: [{ start: 600, end: 615, label: 'Tea Break' }, { start: 720, end: 750, label: 'Lunch Break' }],
        isOff: false,
    },
    {
        id: 'a4', name: 'Lina Nasser',
        shift: null,
        breaks: [],
        isOff: true,
    },
    {
        id: 'a5', name: 'Khaled Mansour',
        shift: { start: '11:00 AM', end: '07:00 PM' },
        breaks: [{ start: 780, end: 795, label: 'Tea Break' }, { start: 900, end: 930, label: 'Lunch Break' }],
        isOff: false,
    },
];

// Selection highlight styled component
const SelectionHighlight = styled(Box)({
    position: 'absolute',
    left: 6,
    right: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 86, 179, 0.1)',
    border: '2px dashed rgba(0, 86, 179, 0.4)',
    zIndex: 6,
    pointerEvents: 'none',
});

// ============================================
// Date Picker Field Component (click to open)
// ============================================

const CALENDAR_BLUE = 'var(--primary-color)';


// ---- iOS drum constants ----
const DRUM_ITEM_H = 44;
const DRUM_VISIBLE = 5;

const IOS_MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
const DRUM_BASE_YEAR = new Date().getFullYear();
const IOS_YEARS = Array.from({ length: 4 }, (_, i) => String(DRUM_BASE_YEAR + i));

const getDrumDays = (monthIdx, year) => {
    const count = new Date(year, monthIdx + 1, 0).getDate();
    return Array.from({ length: count }, (_, i) => String(i + 1));
};

// ---- Single drum column ----
const IOSDrumColumn = ({ items, selectedIndex, onChange }) => {
    const scrollRef = useRef(null);
    const [liveScrollTop, setLiveScrollTop] = useState(selectedIndex * DRUM_ITEM_H);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = selectedIndex * DRUM_ITEM_H;
            setLiveScrollTop(selectedIndex * DRUM_ITEM_H);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleScroll = useCallback((e) => {
        const st = e.target.scrollTop;
        setLiveScrollTop(st);
        const idx = Math.round(st / DRUM_ITEM_H);
        const clamped = Math.max(0, Math.min(idx, items.length - 1));
        onChange(clamped);
    }, [items.length, onChange]);

    const SPACER = DRUM_ITEM_H * Math.floor(DRUM_VISIBLE / 2);
    const CONTAINER_H = DRUM_ITEM_H * DRUM_VISIBLE;

    return (
        <Box sx={{ flex: 1, position: 'relative', height: CONTAINER_H }}>
            <Box
                ref={scrollRef}
                onScroll={handleScroll}
                sx={{
                    height: CONTAINER_H,
                    overflowY: 'scroll',
                    scrollSnapType: 'y mandatory',
                    '&::-webkit-scrollbar': { display: 'none' },
                    scrollbarWidth: 'none',
                }}
            >
                <Box sx={{ height: SPACER, scrollSnapAlign: 'none' }} />
                {items.map((item, i) => {
                    const itemCenter = SPACER + i * DRUM_ITEM_H + DRUM_ITEM_H / 2;
                    const viewCenter = liveScrollTop + CONTAINER_H / 2;
                    const dist = Math.abs(itemCenter - viewCenter) / DRUM_ITEM_H;
                    const opacity = Math.max(0.12, 1 - dist * 0.42);
                    const scaleY = Math.max(0.68, 1 - dist * 0.1);
                    const isCentered = dist < 0.5;
                    return (
                        <Box key={i} sx={{
                            height: DRUM_ITEM_H,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            scrollSnapAlign: 'center',
                            opacity,
                            transform: `scaleY(${scaleY})`,
                            userSelect: 'none',
                            cursor: 'default',
                        }}>
                            <Typography sx={{
                                fontSize: '1.1rem',
                                fontWeight: isCentered ? 600 : 400,
                                color: isCentered ? '#111' : '#777',
                                letterSpacing: '-0.01em',
                                lineHeight: 1,
                                whiteSpace: 'nowrap',
                            }}>
                                {item}
                            </Typography>
                        </Box>
                    );
                })}
                <Box sx={{ height: SPACER, scrollSnapAlign: 'none' }} />
            </Box>
        </Box>
    );
};

// ---- Full date picker (trigger + drum) ----
const InlineDatePicker = ({ value, onChange, label = 'Date' }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = value ? new Date(value + 'T00:00:00') : today;
    const [open, setOpen] = useState(false);

    const [monthIdx, setMonthIdx] = useState(selectedDate.getMonth());
    const [dayIdx, setDayIdx] = useState(selectedDate.getDate() - 1);
    const [yearIdx, setYearIdx] = useState(
        Math.max(0, IOS_YEARS.indexOf(String(selectedDate.getFullYear())))
    );

    const year = parseInt(IOS_YEARS[yearIdx]);
    const drumDays = getDrumDays(monthIdx, year);
    const clampedDayIdx = Math.min(dayIdx, drumDays.length - 1);

    useEffect(() => {
        const d = new Date(year, monthIdx, clampedDayIdx + 1);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        onChange(`${yyyy}-${mm}-${dd}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monthIdx, clampedDayIdx, yearIdx]);

    const displayLabel = selectedDate.toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });

    const CONTAINER_H = DRUM_ITEM_H * DRUM_VISIBLE;

    return (
        <Box>
            {/* Trigger row */}
            <Box
                onClick={() => setOpen(true)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 2,
                    py: 1.4,
                    borderRadius: '12px',
                    border: '1px solid #00000014',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    backgroundColor: '#ffffff',
                    userSelect: 'none',
                }}
            >
                <RequestDateIcon sx={{ fontSize: 20, color: open ? CALENDAR_BLUE : '#94a3b8' }} />
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: '0.65rem', color: open ? CALENDAR_BLUE : '#94a3b8', fontWeight: 600, lineHeight: 1, mb: 0.25 }}>
                        {label}
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#1a1a1a', lineHeight: 1.2 }}>
                        {displayLabel}
                    </Typography>
                </Box>
                <ChevronRightIcon sx={{ fontSize: 18, color: '#c5cdd8' }} />
            </Box>

            {/* iOS-style bottom sheet drum picker */}
            <SwipeableDrawer
                anchor="bottom"
                open={open}
                onClose={() => setOpen(false)}
                onOpen={() => { }}
                disableSwipeToOpen
                PaperProps={{
                    sx: {
                        borderRadius: '20px 20px 0 0',
                        backgroundColor: '#ffffff',
                        pb: 2,
                    },
                }}
                ModalProps={{ keepMounted: false }}
            >
                {/* Drag handle */}
                <Box sx={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#d0d0d0', margin: '12px auto 4px' }} />

                {/* Header row: title + Done */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2.5,
                    pt: 1,
                    pb: 1.5,
                    borderBottom: '1px solid #f0f0f0',
                }}>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#1a1a1a' }}>
                        Select Date
                    </Typography>
                    <Typography
                        onClick={() => setOpen(false)}
                        sx={{ color: CALENDAR_BLUE, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
                    >
                        Done
                    </Typography>
                </Box>

                {/* Selected date display */}
                <Box sx={{ textAlign: 'center', py: 1.5, borderBottom: '1px solid #f5f5f5' }}>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 600, color: '#444' }}>
                        {displayLabel}
                    </Typography>
                </Box>

                {/* Drum wheels */}
                <Box sx={{ position: 'relative', display: 'flex', height: CONTAINER_H, mx: 1 }}>
                    {/* Selection highlight bar */}
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 4, right: 4,
                        height: DRUM_ITEM_H,
                        transform: 'translateY(-50%)',
                        borderTop: '1px solid #d8d8d8',
                        borderBottom: '1px solid #d8d8d8',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(0,0,0,0.04)',
                        pointerEvents: 'none',
                        zIndex: 10,
                    }} />

                    {/* Top fade mask */}
                    <Box sx={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0,
                        height: '38%',
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)',
                        pointerEvents: 'none',
                        zIndex: 5,
                    }} />

                    {/* Bottom fade mask */}
                    <Box sx={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        height: '38%',
                        background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)',
                        pointerEvents: 'none',
                        zIndex: 5,
                    }} />

                    <IOSDrumColumn items={IOS_MONTHS} selectedIndex={monthIdx} onChange={setMonthIdx} />
                    <IOSDrumColumn
                        key={`day-${drumDays.length}-${monthIdx}-${yearIdx}`}
                        items={drumDays}
                        selectedIndex={clampedDayIdx}
                        onChange={setDayIdx}
                    />
                    <IOSDrumColumn items={IOS_YEARS} selectedIndex={yearIdx} onChange={setYearIdx} />
                </Box>
            </SwipeableDrawer>
        </Box>
    );
};

// ============================================
// Component
// ============================================

const DayTimelinePage = ({ dayData, scheduleList = [], onDayChange, onBack }) => {
    const isOffDay = dayData?.isOffDay;
    const [selectedActivity, setSelectedActivity] = useState(null);
    const urlRestoredRef = useRef(false); // prevent re-running on every activities change

    // ---- Request creation state ----
    // Single step state drives the unified bottom sheet
    const [requestStep, setRequestStep] = useState(() => {
        const p = new URLSearchParams(window.location.search);
        if (p.get('view') === 'request' && !p.get('requestType')) return 'form';
        return null;
    });

    // Category selection within the form step
    const [selectedCategory, setSelectedCategory] = useState(null); // 'leaves' | 'swaps' | null

    const [selectedRequestType, setSelectedRequestType] = useState(() => {
        const p = new URLSearchParams(window.location.search);
        const rt = p.get('requestType');
        if (!rt) return null;
        return REQUEST_TYPES.find(t => t.id.replace(/_/g, '-') === rt) || null;
    });
    const [requestFromTime, setRequestFromTime] = useState('');
    const [requestToTime, setRequestToTime] = useState('');
    const [requestReason, setRequestReason] = useState('');
    const [requestDate, setRequestDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [requestToDate, setRequestToDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // same as from by default
    });
    const [expiryDate, setExpiryDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 30); // default: 30 days from today
        return d.toISOString().split('T')[0];
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // ---- Swap agent selection state ----
    const [selectedAgent, setSelectedAgent] = useState(null);

    // ---- Timeline selection state ----
    const [selectionStart, setSelectionStart] = useState(null); // minutes
    const [selectionEnd, setSelectionEnd] = useState(null); // minutes
    const [isSelecting, setIsSelecting] = useState(false);
    const gridRef = useRef(null);

    // ---- Swipe animation ----
    const [slideDirection, setSlideDirection] = useState(null); // 'left' | 'right' | null
    const [isAnimating, setIsAnimating] = useState(false);
    const ANIMATION_DURATION = 250; // ms

    // ---- Swipe navigation ----
    const touchStartX = useRef(null);
    const touchStartY = useRef(null);
    const SWIPE_THRESHOLD = 50;

    const currentIndex = useMemo(() => {
        if (!dayData || !scheduleList.length) return -1;
        return scheduleList.findIndex(
            (d) => d.day === dayData.day && d.date === dayData.date
        );
    }, [dayData, scheduleList]);

    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex >= 0 && currentIndex < scheduleList.length - 1;

    const navigateWithAnimation = useCallback((newDay, direction) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setSlideDirection(direction); // slide current content OUT

        setTimeout(() => {
            // Swap data while off-screen
            onDayChange(newDay);
            // Position incoming content on the opposite side, then slide IN
            setSlideDirection(direction === 'left' ? 'enter-right' : 'enter-left');

            // Force a reflow so the browser registers the new position
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setSlideDirection(null); // animate to center
                    setTimeout(() => setIsAnimating(false), ANIMATION_DURATION);
                });
            });
        }, ANIMATION_DURATION);
    }, [isAnimating, onDayChange]);

    const goToPrev = useCallback(() => {
        if (canGoPrev && onDayChange) navigateWithAnimation(scheduleList[currentIndex - 1], 'right');
    }, [canGoPrev, onDayChange, scheduleList, currentIndex, navigateWithAnimation]);

    const goToNext = useCallback(() => {
        if (canGoNext && onDayChange) navigateWithAnimation(scheduleList[currentIndex + 1], 'left');
    }, [canGoNext, onDayChange, scheduleList, currentIndex, navigateWithAnimation]);

    const handleTouchStart = useCallback((e) => {
        if (isAnimating) return;
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    }, [isAnimating]);

    const handleTouchEnd = useCallback((e) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        const deltaY = e.changedTouches[0].clientY - touchStartY.current;
        touchStartX.current = null;
        touchStartY.current = null;

        // Only swipe if horizontal movement is dominant
        if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
            if (deltaX > 0) goToPrev();  // swipe right = previous day
            else goToNext();              // swipe left = next day
        }
    }, [goToPrev, goToNext]);

    // Mouse drag support (for desktop testing)
    const handleMouseDown = useCallback((e) => {
        if (isAnimating) return;
        touchStartX.current = e.clientX;
        touchStartY.current = e.clientY;
    }, [isAnimating]);

    const handleMouseUp = useCallback((e) => {
        if (touchStartX.current === null) return;
        const deltaX = e.clientX - touchStartX.current;
        const deltaY = e.clientY - touchStartY.current;
        touchStartX.current = null;
        touchStartY.current = null;

        if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
            if (deltaX > 0) goToPrev();
            else goToNext();
        }
    }, [goToPrev, goToNext]);

    // Compute slide transform
    const getSlideTransform = () => {
        switch (slideDirection) {
            case 'left': return 'translateX(-100%)';
            case 'right': return 'translateX(100%)';
            case 'enter-left': return 'translateX(-100%)';
            case 'enter-right': return 'translateX(100%)';
            default: return 'translateX(0)';
        }
    };

    const slideTransition = (slideDirection === 'enter-left' || slideDirection === 'enter-right')
        ? 'none'
        : `transform ${ANIMATION_DURATION}ms ease`;

    // ---- Request creation helpers ----
    const openTypePicker = useCallback(() => {
        const params = new URLSearchParams();
        params.set('page', 'schedule');
        params.set('view', 'request');
        window.history.replaceState(null, '', '?' + params.toString());
        setSelectedCategory('leaves');
        setSelectedRequestType(null);
        setRequestStep('form');
    }, []);

    const closeRequestForm = useCallback(() => {
        setRequestStep(null);
        setSelectedCategory(null);
        setSelectedRequestType(null);
        setSelectedAgent(null);
        setRequestFromTime('');
        setRequestToTime('');
        setRequestReason('');
        setSelectionStart(null);
        setSelectionEnd(null);
    }, []);

    const goBackStep = useCallback(() => {
        const idx = STEP_ORDER.indexOf(requestStep);
        if (idx <= 0) closeRequestForm();
        else setRequestStep(STEP_ORDER[idx - 1]);
    }, [requestStep, closeRequestForm]);

    const submitRequest = useCallback(() => {
        // In production this would call an API
        setSnackbarOpen(true);
        closeRequestForm();
    }, [closeRequestForm]);

    // ---- Swap agent helpers ----
    const selectAgent = useCallback((agent) => {
        setSelectedAgent(agent);
        setRequestStep('confirm');
    }, []);


    // ---- Timeline selection handlers (for grid area) ----
    const getMinutesFromY = useCallback((clientY) => {
        if (!gridRef.current) return 0;
        const rect = gridRef.current.getBoundingClientRect();
        const scrollTop = gridRef.current.closest('[class*="ScrollArea"]')?.scrollTop || 0;
        const y = clientY - rect.top + scrollTop;
        const minutes = Math.round((y / HOUR_HEIGHT) * 60 / 15) * 15; // snap to 15 min
        return Math.max(0, Math.min(minutes, 24 * 60));
    }, []);

    const handleGridPointerDown = useCallback((e) => {
        // Only trigger on empty area (not on activity blocks)
        if (e.target !== gridRef.current) return;
        const minutes = getMinutesFromY(e.clientY);
        setSelectionStart(minutes);
        setSelectionEnd(minutes);
        setIsSelecting(true);
        e.preventDefault();
    }, [getMinutesFromY]);

    const handleGridPointerMove = useCallback((e) => {
        if (!isSelecting) return;
        const minutes = getMinutesFromY(e.clientY);
        setSelectionEnd(minutes);
    }, [isSelecting, getMinutesFromY]);

    const handleGridPointerUp = useCallback(() => {
        if (!isSelecting) return;
        setIsSelecting(false);
        if (selectionStart !== null && selectionEnd !== null && selectionStart !== selectionEnd) {
            const fromMin = Math.min(selectionStart, selectionEnd);
            const toMin = Math.max(selectionStart, selectionEnd);
            setRequestFromTime(formatMinutesToTime(fromMin));
            setRequestToTime(formatMinutesToTime(toMin));
            // Only show leave types for timeline selection — auto-select leaves category
            setSelectedCategory('leaves');
            setSelectedRequestType(null);
            setRequestStep('form');
        } else {
            setSelectionStart(null);
            setSelectionEnd(null);
        }
    }, [isSelecting, selectionStart, selectionEnd]);

    // Compute selection highlight position
    const selectionStyle = useMemo(() => {
        if (selectionStart === null || selectionEnd === null) return null;
        const fromMin = Math.min(selectionStart, selectionEnd);
        const toMin = Math.max(selectionStart, selectionEnd);
        if (fromMin === toMin) return null;
        return {
            top: (fromMin / 60) * HOUR_HEIGHT,
            height: ((toMin - fromMin) / 60) * HOUR_HEIGHT,
        };
    }, [selectionStart, selectionEnd]);

    // Mock detail data for each activity type
    const getActivityDetails = (act) => {
        if (!act) return [];
        const isBreak = act.id.startsWith('break');
        return [
            { icon: <TypeIcon />, label: 'Activity Type', value: act.label, color: 'var(--primary-color)' },
            { icon: <TimeIcon />, label: 'Time', value: act.timeText, color: '#ff9800' },
            { icon: <DurationIcon />, label: 'Duration', value: act.sub, color: '#4caf50' },
            { icon: <StatusIcon />, label: 'Status', value: 'Approved', color: '#11998e' },
            { icon: <ApprovedByIcon />, label: 'Approved By', value: isBreak ? 'Auto-Scheduled' : 'Ahmad Khalil', color: '#9c27b0' },
            { icon: <RequestDateIcon />, label: 'Scheduled On', value: 'Jan 28, 2025', color: '#e91e63' },
        ];
    };

    // Build activity blocks from shift data
    const activities = useMemo(() => {
        if (!dayData || isOffDay) return [];

        const items = [];
        const shiftStart = parseTimeToMinutes(dayData.startTime);
        const shiftEnd = parseTimeToMinutes(dayData.endTime);
        const breaks = calculateBreaks(dayData.startTime, dayData.endTime);

        // Add shift block
        items.push({
            id: 'shift',
            label: 'Shift',
            icon: <ShiftIcon sx={{ fontSize: 16 }} />,
            startMin: shiftStart,
            endMin: shiftEnd,
            accentcolor: '#061836',
            timeText: `${dayData.startTime} - ${dayData.endTime}`,
            sub: dayData.duration,
        });

        // Add break blocks
        breaks.forEach((brk, i) => {
            items.push({
                id: `break-${i}`,
                label: brk.label,
                icon: <BreakIcon sx={{ fontSize: 16 }} />,
                startMin: brk.start,
                endMin: brk.end,
                accentcolor: '#061836',
                timeText: `${formatMinutesToTime(brk.start)} - ${formatMinutesToTime(brk.end)}`,
                sub: `${brk.end - brk.start} min`,
            });
        });

        return items;
    }, [dayData, isOffDay]);

    // After activities are computed, open the correct bottom sheet from URL params (runs once)
    useEffect(() => {
        if (urlRestoredRef.current || activities.length === 0) return;
        urlRestoredRef.current = true;

        const p = new URLSearchParams(window.location.search);
        const view = p.get('view');
        const shiftParam = p.get('shift');
        const rtParam = p.get('requestType');

        // Write the base dailyTimeline URL so back-navigation is clean
        const base = new URLSearchParams();
        base.set('page', 'schedule');
        base.set('view', 'dailyTimeline');

        if (shiftParam) {
            // Find the matching activity by its slugified label
            const match = activities.find(
                a => a.label.replace(/[\s()]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase() === shiftParam
            );
            if (match) {
                setSelectedActivity(match);
                base.set('shift', shiftParam);
            }
        } else if (view === 'request' && rtParam) {
            const type = REQUEST_TYPES.find(t => t.id.replace(/_/g, '-') === rtParam);
            if (type) {
                setSelectedCategory(type.isSwap ? 'swaps' : 'leaves');
                setSelectedRequestType(type);
                setRequestStep('form');
                base.set('view', 'request');
                base.set('requestType', rtParam);
            }
        } else if (view === 'request') {
            setRequestStep('form');
            base.set('view', 'request');
        }

        window.history.replaceState(null, '', '?' + base.toString());
    }, [activities]);

    // ---- Swap agent eligibility (must be after activities) ----
    const eligibleAgents = useMemo(() => {
        if (!selectedRequestType?.isSwap || !dayData) return [];
        const myBreaks = activities.filter(a => a.id.startsWith('break'));

        // For break_swap: expand each agent into one record per break
        if (selectedRequestType.id === 'break_swap') {
            return MOCK_AGENTS.flatMap((agent) => {
                if (agent.isOff || agent.breaks.length === 0) {
                    return [{
                        ...agent,
                        breaks: [],
                        eligible: false,
                        reason: agent.isOff ? 'Off day' : 'No breaks scheduled',
                    }];
                }
                return agent.breaks.map((brk, idx) => {
                    const conflict = myBreaks.some(
                        myBrk => brk.start === myBrk.startMin && brk.end === myBrk.endMin
                    );
                    return {
                        ...agent,
                        id: `${agent.id}_b${idx}`,
                        breaks: [brk],
                        eligible: !conflict,
                        reason: conflict
                            ? 'Break time conflict'
                            : `${brk.label} · ${formatMinutesToTime(brk.start)}-${formatMinutesToTime(brk.end)}`,
                    };
                });
            });
        }

        return MOCK_AGENTS.map((agent) => {
            let eligible = true;
            let reason = '';

            switch (selectedRequestType.id) {
                case 'shift_swap':
                    if (agent.isOff) { eligible = false; reason = 'Off day'; }
                    else if (agent.shift?.start === dayData.startTime && agent.shift?.end === dayData.endTime) {
                        eligible = false; reason = 'Same shift';
                    } else {
                        reason = `${agent.shift?.start} - ${agent.shift?.end}`;
                    }
                    break;
                case 'day_off_swap':
                    if (agent.isOff) {
                        eligible = false;
                        reason = 'Also off';
                    } else {
                        reason = `Working: ${agent.shift?.start} - ${agent.shift?.end}`;
                    }
                    break;
                default:
                    break;
            }

            return { ...agent, eligible, reason };
        });
    }, [selectedRequestType, dayData, activities]);

    // Current time position (for "today" indicator)
    const nowMinutes = useMemo(() => {
        if (!dayData?.isToday) return null;
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
    }, [dayData]);

    // Generate hour labels
    const hours = Array.from({ length: 24 }, (_, i) => {
        if (i === 0) return '12 AM';
        if (i < 12) return `${i} AM`;
        if (i === 12) return '12 PM';
        return `${i - 12} PM`;
    });

    if (!dayData) return null;

    return (
        <PageContainer>
            {/* ===== Header ===== */}
            <Header>
                <IconButton onClick={onBack} sx={{ color: '#1a1a1a' }}>
                    <BackIcon />
                </IconButton>
                {canGoPrev && (
                    <IconButton onClick={goToPrev} sx={{ color: '#555', p: 0.5 }} disabled={isAnimating}>
                        <ChevronLeftIcon />
                    </IconButton>
                )}
                <HeaderTextBlock sx={{ flex: 1 }}>
                    <HeaderDay>
                        {dayData.day}{dayData.isToday ? ' · Today' : ''}
                    </HeaderDay>
                    <HeaderDate>{dayData.date}</HeaderDate>
                </HeaderTextBlock>
                {!isOffDay && (
                    <Chip
                        label={dayData.duration}
                        size="small"
                        sx={{
                            ml: 'auto',
                            mr: canGoNext ? 0.5 : 1,
                            backgroundColor: '#e3f2fd',
                            color: 'var(--primary-color)',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            height: 26,
                            border: '1px solid #bbdefb',
                        }}
                    />
                )}
                {canGoNext && (
                    <IconButton onClick={goToNext} sx={{ color: '#555', p: 0.5 }} disabled={isAnimating}>
                        <ChevronRightIcon />
                    </IconButton>
                )}
            </Header>

            {/* ===== Legend ===== */}
            <LegendBar>
                <Chip
                    size="small"
                    label="Shift"
                    sx={{
                        backgroundColor: '#e3f2fd',
                        color: 'var(--primary-color)',
                        fontWeight: 600,
                        fontSize: '0.65rem',
                        height: 22,
                        border: '1px solid #bbdefb',
                    }}
                />
                <Chip
                    size="small"
                    label="Break"
                    sx={{
                        backgroundColor: '#fff3e0',
                        color: '#e65100',
                        fontWeight: 600,
                        fontSize: '0.65rem',
                        height: 22,
                        border: '1px solid #ffe0b2',
                    }}
                />
                {isOffDay && (
                    <Chip
                        size="small"
                        label="Off Day"
                        sx={{
                            backgroundColor: '#ffebee',
                            color: '#c62828',
                            fontWeight: 600,
                            fontSize: '0.65rem',
                            height: 22,
                            border: '1px solid #ffcdd2',
                        }}
                    />
                )}
            </LegendBar>

            {/* ===== Scrollable Timeline ===== */}
            <ScrollArea
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            >
                <Box sx={{
                    transform: getSlideTransform(),
                    transition: slideTransition,
                    willChange: 'transform',
                }}>
                    <TimelineBody>
                        {/* Time Gutter */}
                        <TimeGutter>
                            {hours.map((label, i) => (
                                <HourLabel
                                    key={i}
                                    sx={{ top: i * HOUR_HEIGHT }}
                                >
                                    {label}
                                </HourLabel>
                            ))}
                        </TimeGutter>

                        {/* Grid Area */}
                        <GridArea
                            ref={gridRef}
                            onPointerDown={handleGridPointerDown}
                            onPointerMove={handleGridPointerMove}
                            onPointerUp={handleGridPointerUp}
                            onPointerLeave={() => { if (isSelecting) handleGridPointerUp(); }}
                            sx={{ touchAction: isSelecting ? 'none' : 'auto' }}
                        >
                            {/* Hour lines */}
                            {hours.map((_, i) => (
                                <HourLine key={`h-${i}`} sx={{ top: i * HOUR_HEIGHT }} />
                            ))}

                            {/* Half-hour lines */}
                            {hours.map((_, i) => (
                                <HalfHourLine key={`hh-${i}`} sx={{ top: i * HOUR_HEIGHT + HOUR_HEIGHT / 2 }} />
                            ))}

                            {/* Time-slot selection highlight */}
                            {selectionStyle && (
                                <SelectionHighlight sx={selectionStyle} />
                            )}

                            {/* Off-day overlay */}
                            {isOffDay && (
                                <OffDayOverlay>
                                    <OffDayIcon sx={{ fontSize: 48, color: '#c62828', opacity: 0.4 }} />
                                    <Typography sx={{
                                        fontWeight: 700,
                                        fontSize: '1.2rem',
                                        color: '#c62828',
                                        mt: 1,
                                        opacity: 0.7,
                                    }}>
                                        Off Day
                                    </Typography>
                                </OffDayOverlay>
                            )}

                            {/* Activity blocks */}
                            {activities.map((act) => {
                                const top = (act.startMin / 60) * HOUR_HEIGHT;
                                let duration = act.endMin - act.startMin;
                                if (duration < 0) duration += 24 * 60;
                                const height = (duration / 60) * HOUR_HEIGHT;
                                const isBreak = act.id.startsWith('break');

                                return (
                                    <ActivityBlock
                                        key={act.id}
                                        accentcolor={act.accentcolor}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedActivity(act);
                                            const params = new URLSearchParams();
                                            params.set('page', 'schedule');
                                            params.set('view', 'dailyTimeline');
                                            params.set('shift', act.label.replace(/[\s()]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase());
                                            window.history.replaceState(null, '', '?' + params.toString());
                                        }}
                                        sx={{
                                            top,
                                            height,
                                            cursor: 'pointer',
                                            ...(isBreak && {
                                                zIndex: 4,
                                                padding: '0 10px',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'flex-start',
                                                gap: '4px',
                                                borderLeft: 'none',
                                            }),
                                        }}
                                    >
                                        {isBreak ? (
                                            <Typography sx={{
                                                fontWeight: 600,
                                                fontSize: '0.72rem',
                                                lineHeight: 1,
                                                color: act.accentcolor,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}>
                                                {act.icon}
                                                {act.label}: {act.timeText}
                                            </Typography>
                                        ) : (
                                            <>
                                                <ActivityTitle sx={{ color: '#1a2138' }}>
                                                    <Box component="span" sx={{ color: act.accentcolor, display: 'flex' }}>{act.icon}</Box>
                                                    {act.label}
                                                </ActivityTitle>
                                                <ActivityTime sx={{ color: act.accentcolor }}>{act.timeText}</ActivityTime>
                                                {act.sub && (
                                                    <Typography sx={{
                                                        fontSize: '0.68rem',
                                                        color: '#666',
                                                        mt: 0.25,
                                                    }}>
                                                        {act.sub}
                                                    </Typography>
                                                )}
                                            </>
                                        )}
                                    </ActivityBlock>
                                );
                            })}

                            {/* Now indicator */}
                            {nowMinutes !== null && (
                                <NowLine sx={{ top: (nowMinutes / 60) * HOUR_HEIGHT }} />
                            )}
                        </GridArea>
                    </TimelineBody>
                </Box>
            </ScrollArea>

            {/* ===== Activity Detail Bottom Sheet ===== */}
            {/* IONIC MIGRATION: replace with IonModal */}
            <SwipeableDrawer
                anchor="bottom"
                open={!!selectedActivity}
                onClose={() => {
                    setSelectedActivity(null);
                    const params = new URLSearchParams();
                    params.set('page', 'schedule');
                    params.set('view', 'dailyTimeline');
                    window.history.replaceState(null, '', '?' + params.toString());
                }}
                onOpen={() => { }}
                disableSwipeToOpen
                PaperProps={{
                    sx: {
                        borderRadius: '20px 20px 0 0',
                        maxHeight: '70vh',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
                ModalProps={{ keepMounted: true }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <SheetHandle />

                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 1.5 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>
                                {selectedActivity?.label}
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                                {selectedActivity?.timeText}
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={() => {
                                setSelectedActivity(null);
                                const params = new URLSearchParams();
                                params.set('page', 'schedule');
                                params.set('view', 'dailyTimeline');
                                window.history.replaceState(null, '', '?' + params.toString());
                            }}
                            sx={{ color: '#aaa' }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    <Divider sx={{ borderColor: '#f0f0f0' }} />

                    {/* Scrollable body */}
                    {selectedActivity && (
                        <Box sx={{ overflowY: 'auto', flex: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>

                            {/* Title + status dot */}
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a', lineHeight: 1.3 }}>
                                    {selectedActivity.label}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.75 }}>
                                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#4caf50', flexShrink: 0 }} />
                                    <Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>Approved</Typography>
                                </Box>
                            </Box>

                            {/* Info box */}
                            <Paper elevation={0} sx={{ borderRadius: 'var(--card-radius)', backgroundColor: '#f9fafb', border: '1px solid #eef2f6', overflow: 'hidden' }}>
                                {[
                                    { label: 'Time', value: selectedActivity.timeText },
                                    { label: 'Duration', value: selectedActivity.sub },
                                    { label: 'Approved By', value: selectedActivity.id.startsWith('break') ? 'Auto-Scheduled' : 'Ahmad Khalil' },
                                    { label: 'Scheduled On', value: 'Jan 28, 2025' },
                                ].filter(r => r.value).map((row, i, arr) => (
                                    <Box key={row.label}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', px: 2, py: 1.5, gap: 2 }}>
                                            <Typography variant="body2" sx={{ color: '#9e9e9e', fontWeight: 500, flexShrink: 0 }}>{row.label}</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', textAlign: 'right' }}>{row.value}</Typography>
                                        </Box>
                                        {i < arr.length - 1 && <Divider sx={{ borderColor: '#f0f0f0' }} />}
                                    </Box>
                                ))}
                            </Paper>
                        </Box>
                    )}
                </Box>
            </SwipeableDrawer>

            {/* ===== FAB Button ===== */}
            <Fab
                color="primary"
                onClick={openTypePicker}
                sx={{
                    position: 'fixed',
                    bottom: 80,
                    right: 20,
                    backgroundColor: 'var(--primary-color)',
                    boxShadow: '0 6px 20px rgba(0,86,179,0.35)',
                    '&:hover': {
                        backgroundColor: 'var(--primary-color)',
                    },
                    zIndex: 20,
                }}
            >
                <AddIcon />
            </Fab>

            {/* ===== Unified Request Sheet ===== */}
            {/* IONIC MIGRATION: replace with <IonModal> using presentingElement for card-style stack */}
            <SwipeableDrawer
                anchor="bottom"
                open={requestStep !== null}
                onClose={closeRequestForm}
                onOpen={() => { }}
                disableSwipeToOpen
                PaperProps={{
                    sx: {
                        borderRadius: '20px 20px 0 0',
                        maxHeight: '90vh',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
            >
                <SheetHandle />

                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pt: 0.5, pb: 1, gap: 0.5, flexShrink: 0 }}>
                    {requestStep !== 'form' && (
                        <IconButton size="small" onClick={goBackStep} sx={{ color: '#444' }}>
                            <BackIcon fontSize="small" />
                        </IconButton>
                    )}

                    <Box sx={{ flex: 1, px: requestStep === 'form' ? 0 : 0.5 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a', lineHeight: 1.2 }}>
                            {requestStep === 'form' && 'New Request'}
                            {requestStep === 'agents' && 'Select Agent'}
                            {requestStep === 'confirm' && 'Confirm Swap'}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', mt: 0.1, lineHeight: 1.2 }}>
                            {requestStep === 'form' && !selectedRequestType && 'Choose a category and type'}
                            {requestStep === 'form' && selectedRequestType && `${dayData?.day}, ${dayData?.date}`}
                            {requestStep === 'agents' && 'Step 2 of 3 · Choose who to swap with'}
                            {requestStep === 'confirm' && 'Step 3 of 3 · Review and send'}
                        </Typography>
                    </Box>

                    {/* Step dots — swap steps 2–3 only */}
                    {selectedRequestType?.isSwap && ['agents', 'confirm'].includes(requestStep) && (
                        <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center', mr: 0.5 }}>
                            {STEP_ORDER.map((s, i) => {
                                const idx = STEP_ORDER.indexOf(requestStep);
                                return (
                                    <Box key={s} sx={{
                                        height: 6, width: i === idx ? 20 : 6, borderRadius: 3,
                                        backgroundColor: i <= idx ? 'var(--primary-color)' : '#d8d8d8',
                                        transition: 'width 0.3s ease, background-color 0.3s ease',
                                    }} />
                                );
                            })}
                        </Box>
                    )}

                    <IconButton size="small" onClick={closeRequestForm} sx={{ color: '#bbb' }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Box sx={{ borderTop: '1px solid #f0f0f0', flexShrink: 0 }} />

                {/* Scrollable content */}
                <Box sx={{ flex: 1, overflowY: 'auto' }}>

                    {/* ── FORM STEP: category + sub-type + fields on one page ── */}
                    {requestStep === 'form' && (
                        <Box sx={{ pb: 3 }}>

                            {/* Category cards */}
                            <Box sx={{ display: 'flex', gap: 1.5, px: 2.5, pt: 2.5 }}>
                                {[
                                    { id: 'leaves', label: 'Leaves', sub: 'Day off · Sick · Personal' },
                                    { id: 'swaps', label: 'Swaps', sub: 'Shift · Break · Day off' },
                                ].map(cat => {
                                    const isSelected = selectedCategory === cat.id;
                                    const isDisabled = cat.id === 'swaps' && !!(requestFromTime && requestToTime);
                                    return (
                                        <Box
                                            key={cat.id}
                                            onClick={() => {
                                                if (isDisabled) return;
                                                setSelectedCategory(cat.id);
                                                setSelectedRequestType(null);
                                            }}
                                            sx={{
                                                flex: 1, px: 2, py: 1.5,
                                                borderRadius: 'var(--card-radius)',
                                                border: `1.5px solid ${isSelected ? 'var(--primary-color)' : '#e2e8f0'}`,
                                                backgroundColor: isSelected ? 'rgba(6,24,54,0.05)' : '#fafafa',
                                                cursor: isDisabled ? 'default' : 'pointer',
                                                opacity: isDisabled ? 0.4 : 1,
                                                userSelect: 'none',
                                                transition: 'all 0.15s ease',
                                                '&:active': isDisabled ? {} : { opacity: 0.8 },
                                            }}
                                        >
                                            <Typography sx={{
                                                fontWeight: 700, fontSize: '0.88rem',
                                                color: isSelected ? 'var(--primary-color)' : '#1a1a1a',
                                            }}>
                                                {cat.label}
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8', mt: 0.25, lineHeight: 1.3 }}>
                                                {cat.sub}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>

                            {/* Sub-type radio list */}
                            {selectedCategory && (
                                <Box sx={{ px: 2.5, pt: 2.5 }}>
                                    <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', mb: 1 }}>
                                        Type
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                                        {(selectedCategory === 'leaves' ? LEAVE_TYPES : SWAP_TYPES).map(type => {
                                            const isSelected = selectedRequestType?.id === type.id;
                                            return (
                                                <Box
                                                    key={type.id}
                                                    onClick={() => {
                                                        setSelectedRequestType(type);
                                                        if (!type.needsTime) {
                                                            setRequestFromTime('');
                                                            setRequestToTime('');
                                                        }
                                                    }}
                                                    sx={{
                                                        display: 'flex', alignItems: 'center',
                                                        px: 1.5, py: 1.1,
                                                        borderRadius: 'var(--card-radius)',
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
                                                        fontWeight: isSelected ? 600 : 500,
                                                        color: isSelected ? 'var(--primary-color)' : '#334155',
                                                        flexGrow: 1,
                                                    }}>
                                                        {type.label}
                                                    </Typography>
                                                    {type.isSwap && (
                                                        <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>3 steps</Typography>
                                                    )}
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </Box>
                            )}

                            {/* Form fields — appear once type is selected */}
                            {selectedRequestType && (
                                <>
                                    <Box sx={{ mx: 2.5, mt: 2.5, borderTop: '1px solid #f1f5f9' }} />
                                    <Box sx={{ px: 2.5, pt: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>

                                        {/* Date(s) */}
                                        {selectedRequestType.multiDay ? (
                                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <InlineDatePicker value={requestDate} onChange={setRequestDate} label="From" />
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <InlineDatePicker value={requestToDate} onChange={setRequestToDate} label="To" />
                                                </Box>
                                            </Box>
                                        ) : (
                                            <InlineDatePicker value={requestDate} onChange={setRequestDate} />
                                        )}

                                        {/* Time range (needsTime types) */}
                                        {selectedRequestType.needsTime && (
                                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                                <TextField
                                                    label="From" type="time" value={requestFromTime}
                                                    onChange={(e) => setRequestFromTime(e.target.value)}
                                                    size="small" fullWidth InputLabelProps={{ shrink: true }}
                                                    sx={fieldSx}
                                                />
                                                <TextField
                                                    label="To" type="time" value={requestToTime}
                                                    onChange={(e) => setRequestToTime(e.target.value)}
                                                    size="small" fullWidth InputLabelProps={{ shrink: true }}
                                                    sx={fieldSx}
                                                />
                                            </Box>
                                        )}

                                        {/* Reason */}
                                        <TextField
                                            label="Reason (optional)" multiline rows={2}
                                            value={requestReason} onChange={(e) => setRequestReason(e.target.value)}
                                            size="small" fullWidth sx={fieldSx}
                                        />

                                        {/* Remaining balance — leaves only */}
                                        {!selectedRequestType.isSwap && (
                                            <Box sx={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                px: 2, py: 1.25, borderRadius: 'var(--card-radius)',
                                                backgroundColor: 'rgba(6,24,54,0.04)', border: '1px solid rgba(6,24,54,0.08)',
                                            }}>
                                                <Typography sx={{ fontSize: '0.82rem', color: '#64748b' }}>Remaining Balance</Typography>
                                                <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--primary-color)' }}>8 Days</Typography>
                                            </Box>
                                        )}

                                        {/* Expiry date */}
                                        <InlineDatePicker value={expiryDate} onChange={setExpiryDate} label="Expiry Date" />
                                    </Box>
                                </>
                            )}
                        </Box>
                    )}

                    {/* ── AGENTS STEP: clean list with initials avatar ── */}
                    {requestStep === 'agents' && (
                        <Box>
                            {eligibleAgents.map((agent, index) => (
                                <Box
                                    key={agent.id}
                                    onClick={() => agent.eligible && selectAgent(agent)}
                                    sx={{
                                        display: 'flex', alignItems: 'center',
                                        px: 2.5, py: 1.5, gap: 1.5,
                                        cursor: agent.eligible ? 'pointer' : 'default',
                                        opacity: agent.eligible ? 1 : 0.38,
                                        borderBottom: index < eligibleAgents.length - 1 ? '1px solid #f5f5f5' : 'none',
                                        '&:active': agent.eligible ? { backgroundColor: '#f8f9fa' } : {},
                                    }}
                                >
                                    {/* Initials circle */}
                                    <Box sx={{
                                        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                                        backgroundColor: agent.eligible ? 'rgba(6,24,54,0.08)' : '#f0f0f0',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: agent.eligible ? 'var(--primary-color)' : '#aaa' }}>
                                            {agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#1a1a1a', lineHeight: 1.3 }}>
                                            {agent.name}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.75rem', color: agent.eligible ? '#64748b' : '#f44336', mt: 0.1, lineHeight: 1.3 }}>
                                            {agent.reason}
                                        </Typography>
                                    </Box>

                                    {agent.eligible && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#4caf50' }} />
                                            <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#4caf50' }}>Available</Typography>
                                        </Box>
                                    )}
                                </Box>
                            ))}
                            <Box sx={{ height: 16 }} />
                        </Box>
                    )}

                    {/* ── CONFIRM STEP: summary Paper ── */}
                    {requestStep === 'confirm' && selectedRequestType && selectedAgent && (
                        <Box sx={{ px: 2.5, pt: 2.5, pb: 2 }}>
                            <Paper elevation={0} sx={{ borderRadius: 'var(--card-radius)', backgroundColor: '#f9fafb', border: '1px solid #eef2f6', overflow: 'hidden' }}>
                                {[
                                    {
                                        label: 'Day',
                                        value: requestDate
                                            ? new Date(requestDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                                            : `${dayData?.day}, ${dayData?.date}`,
                                    },
                                    {
                                        label: 'Expires',
                                        value: expiryDate
                                            ? new Date(expiryDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                                            : '—',
                                    },
                                    ...(selectedRequestType.id === 'shift_swap' ? [
                                        { label: 'Your Shift', value: `${dayData?.startTime} – ${dayData?.endTime}` },
                                        { label: 'Their Shift', value: `${selectedAgent.shift?.start} – ${selectedAgent.shift?.end}` },
                                    ] : []),
                                    ...(selectedRequestType.id === 'break_swap' && selectedAgent.breaks[0] ? [
                                        { label: 'Their Break', value: `${formatMinutesToTime(selectedAgent.breaks[0].start)} – ${formatMinutesToTime(selectedAgent.breaks[0].end)}` },
                                    ] : []),
                                    { label: 'Agent', value: selectedAgent.name },
                                    ...(requestReason ? [{ label: 'Reason', value: requestReason }] : []),
                                ].map((row, i, arr) => (
                                    <Box key={row.label}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', px: 2, py: 1.5, gap: 2 }}>
                                            <Typography variant="body2" sx={{ color: '#9e9e9e', fontWeight: 500, flexShrink: 0 }}>{row.label}</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', textAlign: 'right' }}>{row.value}</Typography>
                                        </Box>
                                        {i < arr.length - 1 && <Divider sx={{ borderColor: '#f0f0f0' }} />}
                                    </Box>
                                ))}
                            </Paper>
                        </Box>
                    )}

                </Box>

                {/* Footer button */}
                {requestStep === 'form' && selectedRequestType && (
                    <Box sx={{ px: 2.5, pt: 1.5, pb: 2.5, borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
                        <Box
                            onClick={selectedRequestType.isSwap ? () => setRequestStep('agents') : submitRequest}
                            sx={{
                                height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: 'var(--card-radius)', backgroundColor: 'var(--primary-color)',
                                cursor: 'pointer', userSelect: 'none',
                                transition: 'opacity 0.15s ease', '&:active': { opacity: 0.82 },
                            }}
                        >
                            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                                {selectedRequestType.isSwap ? 'Select Agent →' : 'Submit Request'}
                            </Typography>
                        </Box>
                    </Box>
                )}
                {requestStep === 'confirm' && (
                    <Box sx={{ px: 2.5, pt: 1.5, pb: 2.5, borderTop: '1px solid #f0f0f0', flexShrink: 0 }}>
                        <Box
                            onClick={submitRequest}
                            sx={{
                                height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: 'var(--card-radius)', backgroundColor: 'var(--primary-color)',
                                cursor: 'pointer', userSelect: 'none',
                                transition: 'opacity 0.15s ease', '&:active': { opacity: 0.82 },
                            }}
                        >
                            <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                                Send Swap Request
                            </Typography>
                        </Box>
                    </Box>
                )}
            </SwipeableDrawer>

            {/* ===== Success Snackbar ===== */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{ bottom: 80 }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{ borderRadius: '12px', fontWeight: 600 }}
                >
                    Request submitted successfully!
                </Alert>
            </Snackbar>
        </PageContainer>
    );
};

export default DayTimelinePage;
