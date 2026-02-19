import { useMemo, useState, useRef, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    IconButton,
    Chip,
    SwipeableDrawer,
    Divider,
    Fab,
    TextField,
    Button,
    Snackbar,
    Alert,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
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
    Person as PersonIcon,
} from '@mui/icons-material';

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

const HOUR_HEIGHT = 64; // px per hour
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
    padding: '12px 12px 12px 4px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
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
    fontSize: '1.1rem',
    lineHeight: 1.3,
});

const HeaderDate = styled(Typography)({
    fontSize: '0.8rem',
    opacity: 0.85,
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

const ActivityBlock = styled(Box)(({ bgcolor, gradient }) => ({
    position: 'absolute',
    left: 4,
    right: 4,
    borderRadius: 10,
    background: gradient || bgcolor || '#ccc',
    color: '#fff',
    padding: '8px 10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.2)',
    zIndex: 3,
    cursor: 'default',
    transition: 'box-shadow 0.2s ease',
    '&:hover': {
        boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
    },
}));

const ActivityTitle = styled(Typography)({
    fontWeight: 700,
    fontSize: '0.8rem',
    lineHeight: 1.3,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
});

const ActivityTime = styled(Typography)({
    fontSize: '0.7rem',
    opacity: 0.9,
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

const SheetBanner = styled(Box)(({ gradient }) => ({
    margin: '8px 16px 0',
    borderRadius: 14,
    padding: '16px 18px',
    background: gradient || '#ccc',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
}));

const SheetBannerTitle = styled(Typography)({
    fontWeight: 700,
    fontSize: '1rem',
});

const SheetBannerSub = styled(Typography)({
    fontSize: '0.8rem',
    opacity: 0.85,
    marginTop: 2,
});

const DetailRow = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 20px',
});

const DetailIcon = styled(Box)(({ color }) => ({
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${color}14`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color,
    flexShrink: 0,
}));

const DetailLabel = styled(Typography)({
    fontSize: '0.7rem',
    color: '#888',
    fontWeight: 500,
    lineHeight: 1.2,
});

const DetailValue = styled(Typography)({
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#1a1a1a',
    lineHeight: 1.3,
});

// ============================================
// Request Type Definitions
// ============================================

const REQUEST_TYPES = [
    { id: 'day_off', label: 'Day Off', icon: <DayOffIcon />, color: '#e91e63', needsTime: false, isSwap: false },
    { id: 'personal_leave', label: 'Personal Leave', icon: <PersonalLeaveIcon />, color: '#667eea', needsTime: true, isSwap: false },
    { id: 'sick_leave', label: 'Sick Leave', icon: <SickLeaveIcon />, color: '#ff9800', needsTime: true, isSwap: false },
    { id: 'sick_day_off', label: 'Sick Day Off', icon: <SickDayOffIcon />, color: '#f44336', needsTime: false, isSwap: false },
    { id: 'shift_swap', label: 'Shift Swap', icon: <SwapIcon />, color: '#2196f3', needsTime: false, isSwap: true },
    { id: 'break_swap', label: 'Break Swap', icon: <SwapIcon />, color: '#009688', needsTime: true, isSwap: true },
    { id: 'day_off_swap', label: 'Day Off Swap', icon: <SwapIcon />, color: '#795548', needsTime: false, isSwap: true },
];

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
    left: 4,
    right: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(102, 126, 234, 0.18)',
    border: '2px dashed rgba(102, 126, 234, 0.5)',
    zIndex: 6,
    pointerEvents: 'none',
});

// ============================================
// Component
// ============================================

const DayTimelinePage = ({ dayData, scheduleList = [], onDayChange, onBack }) => {
    const isOffDay = dayData?.isOffDay;
    const [selectedActivity, setSelectedActivity] = useState(null);

    // ---- Request creation state ----
    const [showTypePicker, setShowTypePicker] = useState(false);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [selectedRequestType, setSelectedRequestType] = useState(null);
    const [requestFromTime, setRequestFromTime] = useState('');
    const [requestToTime, setRequestToTime] = useState('');
    const [requestReason, setRequestReason] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // ---- Swap agent selection state ----
    const [showAgentPicker, setShowAgentPicker] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [showSwapConfirm, setShowSwapConfirm] = useState(false);

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
        setShowTypePicker(true);
    }, []);

    const selectRequestType = useCallback((type) => {
        setSelectedRequestType(type);
        setShowTypePicker(false);
        if (type.isSwap) {
            // Swap types go to agent selection
            setShowAgentPicker(true);
        } else {
            if (!type.needsTime) {
                setRequestFromTime('');
                setRequestToTime('');
            }
            setShowRequestForm(true);
        }
    }, []);

    const closeRequestForm = useCallback(() => {
        setShowRequestForm(false);
        setShowAgentPicker(false);
        setShowSwapConfirm(false);
        setSelectedRequestType(null);
        setSelectedAgent(null);
        setRequestFromTime('');
        setRequestToTime('');
        setRequestReason('');
        setSelectionStart(null);
        setSelectionEnd(null);
    }, []);

    const submitRequest = useCallback(() => {
        // In production this would call an API
        setSnackbarOpen(true);
        closeRequestForm();
    }, [closeRequestForm]);

    // ---- Swap agent helpers ----
    const selectAgent = useCallback((agent) => {
        setSelectedAgent(agent);
        setShowAgentPicker(false);
        setShowSwapConfirm(true);
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
            // Only show leave types for timeline selection
            setSelectedRequestType(null);
            setShowTypePicker(true);
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

    // Filter request types for timeline selection
    const availableRequestTypes = useMemo(() => {
        if (requestFromTime && requestToTime) {
            // From timeline selection: only leave types
            return REQUEST_TYPES.filter((t) => t.needsTime);
        }
        return REQUEST_TYPES;
    }, [requestFromTime, requestToTime]);

    // Mock detail data for each activity type
    const getActivityDetails = (act) => {
        if (!act) return [];
        const isBreak = act.id.startsWith('break');
        return [
            { icon: <TypeIcon />, label: 'Activity Type', value: act.label, color: '#667eea' },
            { icon: <TimeIcon />, label: 'Time', value: act.timeText, color: '#ff9800' },
            { icon: <DurationIcon />, label: 'Duration', value: act.sub, color: '#4caf50' },
            { icon: <StatusIcon />, label: 'Status', value: 'Approved', color: '#11998e' },
            { icon: <ApprovedByIcon />, label: 'Approved By', value: isBreak ? 'Auto-Scheduled' : 'Ahmad Khalil', color: '#764ba2' },
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
            gradient: 'linear-gradient(180deg, rgba(102,126,234,0.85) 0%, rgba(118,75,162,0.85) 100%)',
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
                gradient: 'linear-gradient(180deg, rgba(255,152,0,0.92) 0%, rgba(245,124,0,0.92) 100%)',
                timeText: `${formatMinutesToTime(brk.start)} - ${formatMinutesToTime(brk.end)}`,
                sub: `${brk.end - brk.start} min`,
            });
        });

        return items;
    }, [dayData, isOffDay]);

    // ---- Swap agent eligibility (must be after activities) ----
    const eligibleAgents = useMemo(() => {
        if (!selectedRequestType?.isSwap || !dayData) return [];
        const myBreaks = activities.filter(a => a.id.startsWith('break'));

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
                case 'break_swap':
                    if (agent.isOff) { eligible = false; reason = 'Off day'; }
                    else {
                        const hasConflict = myBreaks.some(myBrk =>
                            agent.breaks.some(ab => ab.start === myBrk.startMin && ab.end === myBrk.endMin)
                        );
                        if (hasConflict) {
                            eligible = false;
                            reason = 'Break time conflict';
                        } else if (agent.breaks.length === 0) {
                            eligible = false;
                            reason = 'No breaks scheduled';
                        } else {
                            reason = agent.breaks.map(b => `${formatMinutesToTime(b.start)}-${formatMinutesToTime(b.end)}`).join(', ');
                        }
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
                <IconButton onClick={onBack} sx={{ color: '#fff' }}>
                    <BackIcon />
                </IconButton>
                {canGoPrev && (
                    <IconButton onClick={goToPrev} sx={{ color: '#fff', p: 0.5 }} disabled={isAnimating}>
                        <ChevronLeftIcon />
                    </IconButton>
                )}
                <HeaderTextBlock sx={{ flex: 1 }}>
                    <HeaderDay>
                        {dayData.day}{dayData.isToday ? ' (Today)' : ''}
                    </HeaderDay>
                    <HeaderDate>{dayData.date}</HeaderDate>
                </HeaderTextBlock>
                {!isOffDay && (
                    <Chip
                        label={dayData.duration}
                        size="small"
                        sx={{
                            ml: 'auto',
                            mr: 1,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            backdropFilter: 'blur(4px)',
                        }}
                    />
                )}
                {canGoNext && (
                    <IconButton onClick={goToNext} sx={{ color: '#fff', p: 0.5 }} disabled={isAnimating}>
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
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.65rem',
                        height: 24,
                    }}
                />
                <Chip
                    size="small"
                    label="Break"
                    sx={{
                        background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.65rem',
                        height: 24,
                    }}
                />
                {isOffDay && (
                    <Chip
                        size="small"
                        label="Off Day"
                        sx={{
                            background: '#ffcdd2',
                            color: '#c62828',
                            fontWeight: 600,
                            fontSize: '0.65rem',
                            height: 24,
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
                                        gradient={act.gradient}
                                        onClick={(e) => { e.stopPropagation(); setSelectedActivity(act); }}
                                        sx={{
                                            top,
                                            height,
                                            cursor: 'pointer',
                                            ...(isBreak && {
                                                left: 12,
                                                right: 12,
                                                zIndex: 4,
                                                padding: '0 10px',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'flex-start',
                                                gap: '4px',
                                            }),
                                        }}
                                    >
                                        {isBreak ? (
                                            <Typography sx={{
                                                fontWeight: 600,
                                                fontSize: '0.7rem',
                                                lineHeight: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}>
                                                {act.icon}
                                                {act.label}: {act.timeText} ({act.sub})
                                            </Typography>
                                        ) : (
                                            <>
                                                <ActivityTitle>
                                                    {act.icon}
                                                    {act.label}
                                                </ActivityTitle>
                                                <ActivityTime>{act.timeText}</ActivityTime>
                                                {act.sub && (
                                                    <Typography sx={{
                                                        fontSize: '0.65rem',
                                                        opacity: 0.8,
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
            <SwipeableDrawer
                anchor="bottom"
                open={!!selectedActivity}
                onClose={() => setSelectedActivity(null)}
                onOpen={() => { }}
                disableSwipeToOpen
                PaperProps={{
                    sx: {
                        borderRadius: '20px 20px 0 0',
                        maxHeight: '70vh',
                        backgroundColor: '#ffffff',
                    },
                }}
                ModalProps={{ keepMounted: true }}
            >
                <Box>
                    {/* Drag handle */}
                    <SheetHandle />

                    {/* Close button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1, pt: 0.5 }}>
                        <IconButton
                            size="small"
                            onClick={() => setSelectedActivity(null)}
                            sx={{ color: '#aaa' }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* Color banner with activity name */}
                    {selectedActivity && (
                        <>
                            <SheetBanner gradient={selectedActivity.gradient}>
                                <Box sx={{ fontSize: 28, display: 'flex' }}>
                                    {selectedActivity.icon}
                                </Box>
                                <Box>
                                    <SheetBannerTitle>{selectedActivity.label}</SheetBannerTitle>
                                    <SheetBannerSub>{selectedActivity.timeText}</SheetBannerSub>
                                </Box>
                            </SheetBanner>

                            {/* Detail rows */}
                            <Box sx={{ pt: 1, pb: 3 }}>
                                {getActivityDetails(selectedActivity).map((detail, i) => (
                                    <Box key={i}>
                                        <DetailRow>
                                            <DetailIcon color={detail.color}>
                                                {detail.icon}
                                            </DetailIcon>
                                            <Box>
                                                <DetailLabel>{detail.label}</DetailLabel>
                                                <DetailValue>{detail.value}</DetailValue>
                                            </Box>
                                        </DetailRow>
                                        {i < getActivityDetails(selectedActivity).length - 1 && (
                                            <Divider sx={{ mx: 2.5, ml: '70px' }} />
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        </>
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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 6px 20px rgba(102,126,234,0.4)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4092 100%)',
                    },
                    zIndex: 20,
                }}
            >
                <AddIcon />
            </Fab>

            {/* ===== Type Picker Bottom Sheet ===== */}
            <SwipeableDrawer
                anchor="bottom"
                open={showTypePicker}
                onClose={() => { setShowTypePicker(false); setSelectionStart(null); setSelectionEnd(null); }}
                onOpen={() => { }}
                disableSwipeToOpen
                PaperProps={{
                    sx: {
                        borderRadius: '20px 20px 0 0',
                        backgroundColor: '#ffffff',
                    },
                }}
            >
                <Box>
                    <SheetHandle />
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', px: 2.5, pt: 1.5, pb: 0.5 }}>
                        Select Request Type
                    </Typography>
                    <List sx={{ pb: 2 }}>
                        {availableRequestTypes.map((type) => (
                            <ListItemButton
                                key={type.id}
                                onClick={() => selectRequestType(type)}
                                sx={{ py: 1.5, px: 2.5 }}
                            >
                                <ListItemIcon sx={{ minWidth: 44 }}>
                                    <Box sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '10px',
                                        backgroundColor: `${type.color}14`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: type.color,
                                    }}>
                                        {type.icon}
                                    </Box>
                                </ListItemIcon>
                                <ListItemText
                                    primary={type.label}
                                    secondary={type.isSwap ? 'Select agent to swap with' : type.needsTime ? 'Select time range' : 'Full day'}
                                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                                    secondaryTypographyProps={{ fontSize: '0.75rem', color: '#888' }}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </SwipeableDrawer>

            {/* ===== Agent Selection Bottom Sheet ===== */}
            <SwipeableDrawer
                anchor="bottom"
                open={showAgentPicker}
                onClose={() => { setShowAgentPicker(false); closeRequestForm(); }}
                onOpen={() => { }}
                disableSwipeToOpen
                PaperProps={{
                    sx: {
                        borderRadius: '20px 20px 0 0',
                        maxHeight: '85vh',
                        backgroundColor: '#ffffff',
                    },
                }}
            >
                <Box sx={{ pb: 2 }}>
                    <SheetHandle />

                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, pt: 1.5, pb: 1 }}>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>
                                Select Agent
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                                {selectedRequestType?.label} - {dayData?.day}, {dayData?.date}
                            </Typography>
                        </Box>
                        <IconButton size="small" onClick={() => { setShowAgentPicker(false); closeRequestForm(); }} sx={{ color: '#aaa' }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    <Divider sx={{ mb: 1 }} />

                    {/* Agent list */}
                    <List sx={{ px: 0.5 }}>
                        {eligibleAgents.map((agent) => (
                            <ListItemButton
                                key={agent.id}
                                onClick={() => agent.eligible && selectAgent(agent)}
                                disabled={!agent.eligible}
                                sx={{
                                    py: 1.5,
                                    px: 2,
                                    borderRadius: '12px',
                                    mx: 1,
                                    mb: 0.5,
                                    opacity: agent.eligible ? 1 : 0.45,
                                    '&.Mui-disabled': {
                                        opacity: 0.45,
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 48 }}>
                                    <Box sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '50%',
                                        background: agent.eligible
                                            ? `linear-gradient(135deg, ${selectedRequestType?.color || '#667eea'}, ${selectedRequestType?.color || '#667eea'}88)`
                                            : '#e0e0e0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                    }}>
                                        <PersonIcon sx={{ fontSize: 22 }} />
                                    </Box>
                                </ListItemIcon>
                                <ListItemText
                                    primary={agent.name}
                                    secondary={agent.reason}
                                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                                    secondaryTypographyProps={{
                                        fontSize: '0.75rem',
                                        color: agent.eligible ? '#555' : '#c62828',
                                    }}
                                />
                                {agent.eligible && (
                                    <Chip
                                        label="Available"
                                        size="small"
                                        sx={{
                                            backgroundColor: '#e8f5e9',
                                            color: '#2e7d32',
                                            fontWeight: 600,
                                            fontSize: '0.7rem',
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </SwipeableDrawer>

            {/* ===== Swap Confirmation Bottom Sheet ===== */}
            <SwipeableDrawer
                anchor="bottom"
                open={showSwapConfirm}
                onClose={closeRequestForm}
                onOpen={() => { }}
                disableSwipeToOpen
                PaperProps={{
                    sx: {
                        borderRadius: '20px 20px 0 0',
                        maxHeight: '80vh',
                        backgroundColor: '#ffffff',
                    },
                }}
            >
                <Box sx={{ pb: 3 }}>
                    <SheetHandle />

                    {/* Close button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1, pt: 0.5 }}>
                        <IconButton size="small" onClick={closeRequestForm} sx={{ color: '#aaa' }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {selectedRequestType && selectedAgent && (
                        <>
                            {/* Swap banner */}
                            <SheetBanner gradient={`linear-gradient(135deg, ${selectedRequestType.color}, ${selectedRequestType.color}cc)`}>
                                <Box sx={{ fontSize: 28, display: 'flex' }}>
                                    <SwapIcon />
                                </Box>
                                <Box>
                                    <SheetBannerTitle>{selectedRequestType.label}</SheetBannerTitle>
                                    <SheetBannerSub>with {selectedAgent.name}</SheetBannerSub>
                                </Box>
                            </SheetBanner>

                            <Box sx={{ px: 2.5, pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {/* Swap summary */}
                                <Box sx={{
                                    p: 2,
                                    borderRadius: '12px',
                                    backgroundColor: '#f8f9fa',
                                    border: '1px solid #e9ecef',
                                }}>
                                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 1, color: '#333' }}>
                                        Swap Summary
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                            <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Day</Typography>
                                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{dayData?.day}, {dayData?.date}</Typography>
                                        </Box>
                                        {selectedRequestType.id === 'shift_swap' && (
                                            <>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Your Shift</Typography>
                                                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{dayData?.startTime} - {dayData?.endTime}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Their Shift</Typography>
                                                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{selectedAgent.shift?.start} - {selectedAgent.shift?.end}</Typography>
                                                </Box>
                                            </>
                                        )}
                                        {selectedRequestType.id === 'break_swap' && (
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Their Breaks</Typography>
                                                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                                                    {selectedAgent.breaks.map(b => `${formatMinutesToTime(b.start)}-${formatMinutesToTime(b.end)}`).join(', ')}
                                                </Typography>
                                            </Box>
                                        )}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>Agent</Typography>
                                            <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{selectedAgent.name}</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Reason */}
                                <TextField
                                    label="Reason (optional)"
                                    multiline
                                    rows={2}
                                    value={requestReason}
                                    onChange={(e) => setRequestReason(e.target.value)}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                        },
                                    }}
                                />

                                {/* Submit */}
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={submitRequest}
                                    sx={{
                                        mt: 1,
                                        py: 1.3,
                                        borderRadius: '14px',
                                        fontWeight: 700,
                                        fontSize: '0.95rem',
                                        textTransform: 'none',
                                        background: `linear-gradient(135deg, ${selectedRequestType.color}, ${selectedRequestType.color}cc)`,
                                        boxShadow: `0 4px 14px ${selectedRequestType.color}40`,
                                        '&:hover': {
                                            background: `linear-gradient(135deg, ${selectedRequestType.color}dd, ${selectedRequestType.color}aa)`,
                                        },
                                    }}
                                >
                                    Send Swap Request
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </SwipeableDrawer>

            {/* ===== Request Form Bottom Sheet ===== */}
            <SwipeableDrawer
                anchor="bottom"
                open={showRequestForm}
                onClose={closeRequestForm}
                onOpen={() => { }}
                disableSwipeToOpen
                PaperProps={{
                    sx: {
                        borderRadius: '20px 20px 0 0',
                        maxHeight: '80vh',
                        backgroundColor: '#ffffff',
                    },
                }}
            >
                <Box sx={{ pb: 3 }}>
                    <SheetHandle />

                    {/* Close button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1, pt: 0.5 }}>
                        <IconButton size="small" onClick={closeRequestForm} sx={{ color: '#aaa' }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {selectedRequestType && (
                        <>
                            {/* Request type banner */}
                            <SheetBanner gradient={`linear-gradient(135deg, ${selectedRequestType.color}, ${selectedRequestType.color}cc)`}>
                                <Box sx={{ fontSize: 28, display: 'flex' }}>
                                    {selectedRequestType.icon}
                                </Box>
                                <Box>
                                    <SheetBannerTitle>{selectedRequestType.label}</SheetBannerTitle>
                                    <SheetBannerSub>{dayData?.day}, {dayData?.date}</SheetBannerSub>
                                </Box>
                            </SheetBanner>

                            <Box sx={{ px: 2.5, pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {/* Time pickers (only for leave types) */}
                                {selectedRequestType.needsTime && (
                                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                                        <TextField
                                            label="From"
                                            type="time"
                                            value={requestFromTime}
                                            onChange={(e) => setRequestFromTime(e.target.value)}
                                            size="small"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                },
                                            }}
                                        />
                                        <TextField
                                            label="To"
                                            type="time"
                                            value={requestToTime}
                                            onChange={(e) => setRequestToTime(e.target.value)}
                                            size="small"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: '12px',
                                                },
                                            }}
                                        />
                                    </Box>
                                )}

                                {/* Reason */}
                                <TextField
                                    label="Reason (optional)"
                                    multiline
                                    rows={3}
                                    value={requestReason}
                                    onChange={(e) => setRequestReason(e.target.value)}
                                    size="small"
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                        },
                                    }}
                                />

                                {/* Submit button */}
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={submitRequest}
                                    sx={{
                                        mt: 1,
                                        py: 1.3,
                                        borderRadius: '14px',
                                        fontWeight: 700,
                                        fontSize: '0.95rem',
                                        textTransform: 'none',
                                        background: `linear-gradient(135deg, ${selectedRequestType.color}, ${selectedRequestType.color}cc)`,
                                        boxShadow: `0 4px 14px ${selectedRequestType.color}40`,
                                        '&:hover': {
                                            background: `linear-gradient(135deg, ${selectedRequestType.color}dd, ${selectedRequestType.color}aa)`,
                                        },
                                    }}
                                >
                                    Submit Request
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
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
