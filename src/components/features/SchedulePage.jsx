import { useState, useMemo, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Divider,
    Tooltip,
    IconButton,
} from '@mui/material';
import {
    AccessTimeOutlined as ClockIcon,
    CheckCircleOutlined as CheckIcon,
    EventAvailableOutlined as EventIcon,
    ViewModuleOutlined as CardViewIcon,
    TaskAltOutlined as CompletedIcon,
    CalendarMonthOutlined as CalendarIcon,
    ChevronLeft as ChevronLeftIcon,
    ChevronRight as ChevronRightIcon,
    ViewListOutlined as ListViewIcon,
} from '@mui/icons-material';

// ============================================
// Helper Functions
// ============================================

// Calculate breaks for a shift (15min, 30min, 15min with 2+ hour spacing)
const calculateBreaks = (startTime, endTime) => {
    const parseTime = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes; // Return minutes from midnight
    };

    const formatTime = (minutes) => {
        let hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const period = hours >= 12 ? 'PM' : 'AM';
        if (hours > 12) hours -= 12;
        if (hours === 0) hours = 12;
        return `${hours}:${mins.toString().padStart(2, '0')} ${period}`;
    };

    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);
    let shiftDuration = endMinutes - startMinutes;

    // Handle overnight shifts
    if (shiftDuration < 0) shiftDuration += 24 * 60;

    const breaks = [];
    const minGapMinutes = 120; // 2 hours minimum between breaks

    // First break: 15 minutes (after 2+ hours)
    if (shiftDuration >= minGapMinutes + 15) {
        const break1Start = startMinutes + minGapMinutes;
        breaks.push({
            start: formatTime(break1Start),
            end: formatTime(break1Start + 15),
            duration: 15,
        });

        // Second break: 30 minutes (after 2+ hours from first break)
        if (shiftDuration >= minGapMinutes + 15 + minGapMinutes + 30) {
            const break2Start = break1Start + 15 + minGapMinutes;
            breaks.push({
                start: formatTime(break2Start),
                end: formatTime(break2Start + 30),
                duration: 30,
            });

            // Third break: 15 minutes (after 2+ hours from second break)
            if (shiftDuration >= minGapMinutes + 15 + minGapMinutes + 30 + minGapMinutes + 15) {
                const break3Start = break2Start + 30 + minGapMinutes;
                breaks.push({
                    start: formatTime(break3Start),
                    end: formatTime(break3Start + 15),
                    duration: 15,
                });
            }
        }
    }

    return breaks;
};

// Determine shift status based on week key
const getShiftStatus = (weekKey) => {
    if (weekKey === 'current') return 'published';
    if (weekKey.startsWith('prev')) return 'completed';
    return 'pending';
};

// ============================================
// Mock Data - 2-Week Periods
// ============================================

const scheduleData = {
    'current': {
        label: 'Current Period (Feb 3 - Feb 16)',
        schedule: [
            // Week 1
            { day: 'Monday', date: 'Feb 3', isToday: false, isOffDay: false, startTime: '7:00 AM', endTime: '3:00 PM', duration: '8 hours' },
            { day: 'Tuesday', date: 'Feb 4', isToday: true, isOffDay: false, startTime: '2:00 PM', endTime: '10:00 PM', duration: '8 hours' },
            { day: 'Wednesday', date: 'Feb 5', isToday: false, isOffDay: false, startTime: '9:00 AM', endTime: '5:00 PM', duration: '8 hours' },
            { day: 'Thursday', date: 'Feb 6', isToday: false, isOffDay: false, startTime: '11:00 AM', endTime: '8:00 PM', duration: '9 hours' },
            { day: 'Friday', date: 'Feb 7', isToday: false, isOffDay: true },
            { day: 'Saturday', date: 'Feb 8', isToday: false, isOffDay: false, startTime: '10:00 AM', endTime: '4:00 PM', duration: '6 hours' },
            { day: 'Sunday', date: 'Feb 9', isToday: false, isOffDay: true },
            // Week 2
            { day: 'Monday', date: 'Feb 10', isToday: false, isOffDay: false, startTime: '3:00 PM', endTime: '11:00 PM', duration: '8 hours' },
            { day: 'Tuesday', date: 'Feb 11', isToday: false, isOffDay: false, startTime: '8:00 AM', endTime: '4:00 PM', duration: '8 hours' },
            { day: 'Wednesday', date: 'Feb 12', isToday: false, isOffDay: false, startTime: '12:00 PM', endTime: '8:00 PM', duration: '8 hours' },
            { day: 'Thursday', date: 'Feb 13', isToday: false, isOffDay: true },
            { day: 'Friday', date: 'Feb 14', isToday: false, isOffDay: false, startTime: '6:00 AM', endTime: '2:00 PM', duration: '8 hours' },
            { day: 'Saturday', date: 'Feb 15', isToday: false, isOffDay: false, startTime: '9:00 AM', endTime: '6:00 PM', duration: '9 hours' },
            { day: 'Sunday', date: 'Feb 16', isToday: false, isOffDay: true },
        ]
    },
    'next': {
        label: 'Next Period (Feb 17 - Mar 2)',
        schedule: [
            // Week 1
            { day: 'Monday', date: 'Feb 17', isToday: false, isOffDay: false, startTime: '7:00 AM', endTime: '3:00 PM', duration: '8 hours' },
            { day: 'Tuesday', date: 'Feb 18', isToday: false, isOffDay: false, startTime: '1:00 PM', endTime: '9:00 PM', duration: '8 hours' },
            { day: 'Wednesday', date: 'Feb 19', isToday: false, isOffDay: false, startTime: '9:00 AM', endTime: '5:00 PM', duration: '8 hours' },
            { day: 'Thursday', date: 'Feb 20', isToday: false, isOffDay: false, startTime: '2:00 PM', endTime: '10:00 PM', duration: '8 hours' },
            { day: 'Friday', date: 'Feb 21', isToday: false, isOffDay: true },
            { day: 'Saturday', date: 'Feb 22', isToday: false, isOffDay: false, startTime: '10:00 AM', endTime: '6:00 PM', duration: '8 hours' },
            { day: 'Sunday', date: 'Feb 23', isToday: false, isOffDay: true },
            // Week 2
            { day: 'Monday', date: 'Feb 24', isToday: false, isOffDay: false, startTime: '8:00 AM', endTime: '4:00 PM', duration: '8 hours' },
            { day: 'Tuesday', date: 'Feb 25', isToday: false, isOffDay: false, startTime: '11:00 AM', endTime: '7:00 PM', duration: '8 hours' },
            { day: 'Wednesday', date: 'Feb 26', isToday: false, isOffDay: false, startTime: '6:00 AM', endTime: '2:00 PM', duration: '8 hours' },
            { day: 'Thursday', date: 'Feb 27', isToday: false, isOffDay: true },
            { day: 'Friday', date: 'Feb 28', isToday: false, isOffDay: false, startTime: '3:00 PM', endTime: '11:00 PM', duration: '8 hours' },
            { day: 'Saturday', date: 'Mar 1', isToday: false, isOffDay: false, startTime: '9:00 AM', endTime: '5:00 PM', duration: '8 hours' },
            { day: 'Sunday', date: 'Mar 2', isToday: false, isOffDay: true },
        ]
    },
    'prev1': {
        label: 'Previous Period (Jan 20 - Feb 2)',
        schedule: [
            // Week 1
            { day: 'Monday', date: 'Jan 20', isToday: false, isOffDay: false, startTime: '9:00 AM', endTime: '5:00 PM', duration: '8 hours' },
            { day: 'Tuesday', date: 'Jan 21', isToday: false, isOffDay: false, startTime: '4:00 PM', endTime: '12:00 AM', duration: '8 hours' },
            { day: 'Wednesday', date: 'Jan 22', isToday: false, isOffDay: false, startTime: '6:00 AM', endTime: '2:00 PM', duration: '8 hours' },
            { day: 'Thursday', date: 'Jan 23', isToday: false, isOffDay: true },
            { day: 'Friday', date: 'Jan 24', isToday: false, isOffDay: false, startTime: '2:00 PM', endTime: '10:00 PM', duration: '8 hours' },
            { day: 'Saturday', date: 'Jan 25', isToday: false, isOffDay: true },
            { day: 'Sunday', date: 'Jan 26', isToday: false, isOffDay: false, startTime: '10:00 AM', endTime: '7:00 PM', duration: '9 hours' },
            // Week 2
            { day: 'Monday', date: 'Jan 27', isToday: false, isOffDay: false, startTime: '10:00 AM', endTime: '6:00 PM', duration: '8 hours' },
            { day: 'Tuesday', date: 'Jan 28', isToday: false, isOffDay: false, startTime: '1:00 PM', endTime: '9:00 PM', duration: '8 hours' },
            { day: 'Wednesday', date: 'Jan 29', isToday: false, isOffDay: true },
            { day: 'Thursday', date: 'Jan 30', isToday: false, isOffDay: false, startTime: '7:00 AM', endTime: '3:00 PM', duration: '8 hours' },
            { day: 'Friday', date: 'Jan 31', isToday: false, isOffDay: false, startTime: '11:00 AM', endTime: '7:00 PM', duration: '8 hours' },
            { day: 'Saturday', date: 'Feb 1', isToday: false, isOffDay: false, startTime: '8:00 AM', endTime: '2:00 PM', duration: '6 hours' },
            { day: 'Sunday', date: 'Feb 2', isToday: false, isOffDay: true },
        ]
    },
};

// ============================================
// Full Month Schedule Data
// (keyed by "YYYY-M-D" for fast lookup)
// ============================================

const buildScheduleMap = () => {
    const map = {};
    Object.values(scheduleData).forEach(period => {
        period.schedule.forEach(shift => {
            // Parse "Feb 3" style dates into a lookup key
            const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
            const parts = shift.date.split(' ');
            const month = months[parts[0]];
            const day = parseInt(parts[1]);
            // Determine year from context (2026 for this app)
            const year = 2026;
            const key = `${year}-${month}-${day}`;
            map[key] = shift;
        });
    });
    return map;
};

const SCHEDULE_MAP = buildScheduleMap();

// ============================================
// Mock Adherence Data (% for each day)
// Keyed like SCHEDULE_MAP: "YYYY-M-D"
// ============================================

const ADHERENCE_MAP = (() => {
    const map = {};
    // Generate adherence for every day we have schedule data
    Object.keys(SCHEDULE_MAP).forEach(key => {
        const shift = SCHEDULE_MAP[key];
        if (shift.isOffDay) return; // no adherence for off days
        // Pseudo-random adherence based on day number
        const dayNum = parseInt(key.split('-')[2]);
        const values = [95, 88, 72, 91, 65, 97, 80, 55, 93, 86, 78, 99, 60, 84, 92, 70, 96, 83, 58, 90, 74, 100, 67, 89, 76, 94, 82, 63, 87, 71, 98];
        map[key] = values[dayNum % values.length];
    });
    return map;
})();

const getAdherenceColor = (pct) => {
    if (pct == null) return null;
    if (pct >= 80) return '#4caf50'; // good — green
    return '#f44336'; // bad — red
};

// ============================================
// Styled Components
// ============================================

const ScheduleContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#f5f5f5',
    width: '100%',
    padding: '0 16px 16px',
    boxSizing: 'border-box',
}));


const DayCard = styled(Card)(({ theme, isOffDay, isToday }) => ({
    marginBottom: theme.spacing(1.5),
    backgroundColor: isOffDay ? '#eef0f7' : isToday ? 'var(--primary-color)' : '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: isToday ? '2px solid var(--primary-color)' : '1px solid #e8e8e8',
    '&:active': {
        transform: 'scale(0.98)',
        transition: 'transform 0.1s ease',
    },
}));

const DayHeader = styled(Box)(({ theme, isToday }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
}));

const DayName = styled(Typography)(({ theme, isToday }) => ({
    fontWeight: 700,
    fontSize: '1.1rem',
    color: isToday ? 'white' : '#1a1a1a',
}));

const DateText = styled(Typography)(({ theme, isToday }) => ({
    fontSize: '0.875rem',
    color: isToday ? 'rgba(255,255,255,0.9)' : '#666',
}));

const ShiftDetails = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginTop: theme.spacing(1.5),
}));

const TimeBox = styled(Box)(({ theme, isToday }) => ({
    flex: 1,
    padding: theme.spacing(1.5),
    background: isToday ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.03)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
}));

const TimeLabel = styled(Typography)(({ theme, isToday }) => ({
    fontSize: '0.75rem',
    color: isToday ? 'rgba(255,255,255,0.8)' : '#666',
    marginBottom: theme.spacing(0.5),
}));

const TimeValue = styled(Typography)(({ theme, isToday }) => ({
    fontSize: '1rem',
    fontWeight: 600,
    color: isToday ? 'white' : '#1a1a1a',
}));

const StatusChip = styled(Chip)(({ chipColor }) => ({
    backgroundColor: chipColor || '#4caf50',
    color: 'white',
    fontWeight: 600,
    boxShadow: 'none',
}));

const OffDayText = styled(Typography)(({ theme }) => ({
    fontSize: '1rem',
    fontWeight: 600,
    color: '#c62828',
    textAlign: 'center',
    padding: theme.spacing(2),
}));

// Timeline View Styled Components
const TimelineContainer = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: theme.spacing(2),
    paddingLeft: 0,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    overflowX: 'auto',
}));

const TimelineRowWrapper = styled(Box)(({ theme }) => ({
}));

const TimelineRow = styled(Box)(({ theme, isOffDay }) => ({
    display: 'flex',
    alignItems: 'stretch',
    minHeight: '12px', // Reduced to make blocks perfect squares
    backgroundColor: isOffDay ? '#eef0f7' : 'transparent',
}));

const DayLabel = styled(Box)(({ theme }) => ({
    minWidth: '80px',
    padding: theme.spacing(0.5, 1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRight: '2px solid #e0e0e0',
    backgroundColor: '#f5f5f5',
}));

const DayLabelName = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    fontSize: '0.7rem',
    color: '#1a1a1a',
    lineHeight: 1.2,
}));

const DayLabelDate = styled(Typography)(({ theme }) => ({
    fontSize: '0.6rem',
    color: '#666',
    lineHeight: 1.2,
}));

const TimelineGrid = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(96, 1fr)', // 24 hours × 4 (15-min intervals)
    borderBottom: '1px solid #e0e0e0',
    position: 'relative',
    minWidth: '1200px',
}));

const HourBlock = styled(Box)(({ theme, isWorking, isBreak }) => ({
    borderRight: '1px solid #e0e0e0',
    position: 'relative',
    backgroundColor: isBreak
        ? '#ff9800'
        : isWorking
            ? '#4caf50'
            : 'transparent',
    transition: 'all 0.2s ease',
    '&:hover': {
        opacity: 0.8,
    },
}));

const HourLabel = styled(Typography)(({ theme }) => ({
    position: 'absolute',
    top: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '0.7rem',
    color: '#666',
    whiteSpace: 'nowrap',
}));

const TimelineHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    marginBottom: theme.spacing(1),
    paddingLeft: '80px', // Match DayLabel minWidth
    position: 'relative',
}));

const TimelineHourHeader = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(96, 1fr)', // 24 hours × 4 (15-min intervals)
    minWidth: '1200px',
    borderLeft: '2px solid #e0e0e0',
}));

const HourHeaderCell = styled(Box)(({ theme }) => ({
    borderRight: '1px solid #e0e0e0',
    textAlign: 'center',
    fontSize: '0.6rem',
    color: '#666',
    padding: theme.spacing(0.3, 0),
}));

// ============================================
// Component
// ============================================

const SchedulePage = ({ onDayClick }) => {
    const getInitialView = () => {
        const params = new URLSearchParams(window.location.search);
        const v = params.get('view');
        if (v === 'cards') return 'cards';
        return 'calendar';
    };

    const [selectedWeek, setSelectedWeek] = useState('current');
    const [viewMode, setViewMode] = useState(getInitialView);
    // Sync page=schedule and view= with URL whenever viewMode changes
    useEffect(() => {
        const params = new URLSearchParams();
        params.set('page', 'schedule');
        params.set('view', viewMode);
        window.history.replaceState(null, '', '?' + params.toString());
    }, [viewMode]);

    const MONTH_NAMES = useMemo(() => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], []);

    // Calendar month navigation
    const [calendarMonth, setCalendarMonth] = useState(1); // 0-indexed, 1 = February
    const [calendarYear, setCalendarYear] = useState(2026);

    const weekKeys = ['prev1', 'current', 'next'];
    const currentWeekIndex = weekKeys.indexOf(selectedWeek);

    const navigateToPeriod = (direction) => {
        const newIndex = currentWeekIndex + direction;
        if (newIndex >= 0 && newIndex < weekKeys.length) {
            setSelectedWeek(weekKeys[newIndex]);
        }
    };

    const handleWeekChange = (event) => {
        setSelectedWeek(event.target.value);
    };


    const currentSchedule = scheduleData[selectedWeek];
    const currentStatus = getShiftStatus(selectedWeek);

    // Helper to get status display info
    const getStatusInfo = (status) => {
        switch (status) {
            case 'published':
                return { label: 'Published', color: '#4caf50', icon: <CheckIcon /> };
            case 'completed':
                return { label: 'Completed', color: 'var(--primary-color)', icon: <CompletedIcon /> };
            case 'pending':
                return { label: 'Pending', color: '#ff9800', icon: <ClockIcon /> };
            default:
                return { label: 'Unknown', color: '#757575', icon: <ClockIcon /> };
        }
    };

    const statusInfo = getStatusInfo(currentStatus);

    // Helper to check if a 15-minute interval is within working time
    const isIntervalInRange = (intervalIndex, startTime, endTime) => {
        const parseTime = (timeStr) => {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            return hours * 60 + minutes; // Return minutes from midnight
        };

        const startMinutes = parseTime(startTime);
        const endMinutes = parseTime(endTime);

        // Each interval represents 15 minutes
        const intervalStartMinutes = intervalIndex * 15;
        const intervalEndMinutes = (intervalIndex + 1) * 15;

        // Handle overnight shifts
        if (endMinutes < startMinutes) {
            // Overnight shift
            return (intervalStartMinutes >= startMinutes || intervalEndMinutes <= endMinutes);
        }

        return intervalStartMinutes >= startMinutes && intervalStartMinutes < endMinutes;
    };

    // Helper to check if a 15-minute interval is within a break
    const isIntervalInBreak = (intervalIndex, breaks) => {
        return breaks.some(breakItem => {
            const parseTime = (timeStr) => {
                const [time, period] = timeStr.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                if (period === 'PM' && hours !== 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;
                return hours * 60 + minutes;
            };

            const breakStart = parseTime(breakItem.start);
            const breakEnd = parseTime(breakItem.end);

            const intervalStartMinutes = intervalIndex * 15;
            const intervalEndMinutes = (intervalIndex + 1) * 15;

            // Check if interval overlaps with break
            return intervalStartMinutes >= breakStart && intervalStartMinutes < breakEnd;
        });
    };

    // Render Timeline View
    const renderTimelineView = () => {
        // Create 96 intervals (24 hours × 4 intervals per hour)
        const intervals = Array.from({ length: 96 }, (_, i) => i);

        // Create hour markers (every 4 intervals = 1 hour)
        const hourMarkers = Array.from({ length: 24 }, (_, i) => i);

        return (
            <TimelineContainer>
                {/* Hour Headers */}
                <TimelineHeader>
                    <TimelineHourHeader>
                        {intervals.map(interval => {
                            const hour = Math.floor(interval / 4);
                            const minute = (interval % 4) * 15;

                            // Only show hour labels at the start of each hour (minute === 0)
                            if (minute === 0) {
                                return (
                                    <HourHeaderCell key={interval} style={{ gridColumn: `span 4` }}>
                                        {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                                    </HourHeaderCell>
                                );
                            }
                            return null;
                        })}
                    </TimelineHourHeader>
                </TimelineHeader>

                {/* Timeline Rows for Each Day */}
                {currentSchedule.schedule.map((shift, index) => {
                    const breaks = shift.isOffDay ? [] : calculateBreaks(shift.startTime, shift.endTime);

                    return (
                        <TimelineRowWrapper key={index}>
                            <TimelineRow isOffDay={shift.isOffDay}>
                                <DayLabel>
                                    <DayLabelName>{shift.day}</DayLabelName>
                                    <DayLabelDate>{shift.date}</DayLabelDate>
                                </DayLabel>
                                <TimelineGrid>
                                    {intervals.map(interval => {
                                        const isWorking = !shift.isOffDay && isIntervalInRange(interval, shift.startTime, shift.endTime);
                                        const isBreak = !shift.isOffDay && isWorking && isIntervalInBreak(interval, breaks);

                                        // Calculate interval time for tooltip
                                        const hour = Math.floor(interval / 4);
                                        const minute = (interval % 4) * 15;
                                        const nextMinute = minute + 15;
                                        const formatHour = (h) => {
                                            if (h === 0) return '12 AM';
                                            if (h < 12) return `${h} AM`;
                                            if (h === 12) return '12 PM';
                                            return `${h - 12} PM`;
                                        };
                                        const startTime = `${formatHour(hour).split(' ')[0]}:${minute.toString().padStart(2, '0')} ${formatHour(hour).split(' ')[1]}`;
                                        const endHour = nextMinute === 60 ? hour + 1 : hour;
                                        const endMin = nextMinute === 60 ? 0 : nextMinute;
                                        const endTime = `${formatHour(endHour).split(' ')[0]}:${endMin.toString().padStart(2, '0')} ${formatHour(endHour).split(' ')[1]}`;

                                        // Determine activity type
                                        let activityType = 'Off Day';
                                        if (!shift.isOffDay) {
                                            if (isBreak) {
                                                activityType = 'Break';
                                            } else if (isWorking) {
                                                activityType = 'Shift';
                                            } else {
                                                activityType = 'Free Time';
                                            }
                                        }

                                        const tooltipTitle = `${startTime} - ${endTime}\n${activityType}`;

                                        return (
                                            <Tooltip
                                                key={interval}
                                                title={tooltipTitle}
                                                arrow
                                                placement="top"
                                            >
                                                <HourBlock
                                                    isWorking={isWorking && !isBreak}
                                                    isBreak={isBreak}
                                                />
                                            </Tooltip>
                                        );
                                    })}
                                </TimelineGrid>
                            </TimelineRow>
                        </TimelineRowWrapper>
                    );
                })}
            </TimelineContainer>
        );
    };

    // ============================================
    // Calendar View
    // ============================================

    const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const calendarDays = useMemo(() => {
        const firstDay = new Date(calendarYear, calendarMonth, 1);
        const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
        const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
        const today = new Date();

        const cells = [];

        // Leading empty cells for alignment
        for (let i = 0; i < startDayOfWeek; i++) {
            cells.push({ empty: true });
        }

        // Actual days
        for (let d = 1; d <= daysInMonth; d++) {
            const key = `${calendarYear}-${calendarMonth}-${d}`;
            const shift = SCHEDULE_MAP[key] || null;
            const isToday = today.getDate() === d && today.getMonth() === calendarMonth && today.getFullYear() === calendarYear;
            cells.push({
                empty: false,
                day: d,
                shift,
                isToday,
                isOffDay: shift?.isOffDay || false,
                startTime: shift?.startTime || null,
                adherence: ADHERENCE_MAP[key] ?? null,
            });
        }

        return cells;
    }, [calendarMonth, calendarYear]);

    const goToPrevMonth = () => {
        if (calendarMonth === 0) {
            setCalendarMonth(11);
            setCalendarYear(y => y - 1);
        } else {
            setCalendarMonth(m => m - 1);
        }
    };

    const goToNextMonth = () => {
        if (calendarMonth === 11) {
            setCalendarMonth(0);
            setCalendarYear(y => y + 1);
        } else {
            setCalendarMonth(m => m + 1);
        }
    };

    const renderCalendarView = () => (
        <Box sx={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            {/* Month header with nav arrows */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.5,
                py: 1.5,
            }}>
                <IconButton onClick={goToPrevMonth} size="small" sx={{ color: '#555' }}>
                    <ChevronLeftIcon />
                </IconButton>
                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>
                    {MONTH_NAMES[calendarMonth]} {calendarYear}
                </Typography>
                <IconButton onClick={goToNextMonth} size="small" sx={{ color: '#555' }}>
                    <ChevronRightIcon />
                </IconButton>
            </Box>

            {/* Day-of-week headers */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', px: 1, pb: 0.5 }}>
                {DAY_HEADERS.map(dh => (
                    <Typography key={dh} sx={{
                        textAlign: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: '#999',
                        py: 0.5,
                    }}>
                        {dh}
                    </Typography>
                ))}
            </Box>

            {/* Day cells grid — CIRCLES with adherence dot badge */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', px: 0.5, pb: 1, gap: '4px 0' }}>
                {calendarDays.map((cell, idx) => {
                    if (cell.empty) {
                        return <Box key={`e-${idx}`} sx={{ display: 'flex', justifyContent: 'center', minHeight: 58 }} />;
                    }

                    const hasShift = cell.shift && !cell.isOffDay;
                    const isOff = cell.isOffDay;
                    const noData = !cell.shift;
                    const adherenceColor = getAdherenceColor(cell.adherence);
                    const circleSize = 46;

                    return (
                        <Box
                            key={cell.day}
                            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 58, justifyContent: 'center' }}
                        >
                            <Box
                                onClick={() => {
                                    if (cell.shift && onDayClick) {
                                        const allSchedules = Object.values(scheduleData).flatMap(p => p.schedule);
                                        const matchIdx = allSchedules.findIndex(s => s.date === cell.shift.date);
                                        onDayClick(cell.shift, matchIdx >= 0 ? matchIdx : 0, allSchedules);
                                    }
                                }}
                                sx={{
                                    width: circleSize,
                                    height: circleSize,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: cell.shift ? 'pointer' : 'default',
                                    transition: 'all 0.15s ease',
                                    position: 'relative',
                                    // No border on any day — clean look
                                    ...(isOff && !cell.isToday && {
                                        backgroundColor: 'rgba(var(--primary-rgb), 0.07)',
                                    }),
                                    ...(cell.isToday && {
                                        backgroundColor: 'var(--primary-color)',
                                        boxShadow: '0 3px 10px rgba(6,24,54,0.3)',
                                    }),
                                    '&:active': cell.shift ? {
                                        transform: 'scale(0.9)',
                                    } : {},
                                }}
                            >
                                {/* Adherence dot — bottom center */}
                                {adherenceColor && (
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 3,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: 5,
                                        height: 5,
                                        borderRadius: '50%',
                                        backgroundColor: adherenceColor,
                                    }} />
                                )}

                                {/* Day number */}
                                <Typography sx={{
                                    fontWeight: cell.isToday ? 800 : 500,
                                    fontSize: '0.88rem',
                                    color: cell.isToday ? '#fff' : isOff ? '#7986cb' : noData ? '#ccc' : '#1a1a1a',
                                    lineHeight: 1.1,
                                }}>
                                    {cell.day}
                                </Typography>

                                {/* Shift start time (compact) — only show when no adherence dot overlaps */}
                                {hasShift && !adherenceColor && (
                                    <Typography sx={{
                                        fontSize: '0.45rem',
                                        fontWeight: 600,
                                        color: cell.isToday ? 'rgba(255,255,255,0.85)' : 'var(--primary-color)',
                                        lineHeight: 1,
                                        mt: 0.15,
                                    }}>
                                        {cell.startTime}
                                    </Typography>
                                )}
                                {isOff && (
                                    <Typography sx={{
                                        fontSize: '0.42rem',
                                        fontWeight: 700,
                                        color: cell.isToday ? 'rgba(255,255,255,0.85)' : '#7986cb',
                                        lineHeight: 1,
                                        mt: 0.15,
                                    }}>
                                        OFF
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>

            {/* Legend */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                pb: 2,
                pt: 0.5,
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#4caf50' }} />
                    <Typography sx={{ fontSize: '0.7rem', color: '#666' }}>Adherence ≥ 80%</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#f44336' }} />
                    <Typography sx={{ fontSize: '0.7rem', color: '#666' }}>Adherence &lt; 80%</Typography>
                </Box>
            </Box>
        </Box>
    );

    // Swipe handlers for Cards View
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) navigateToPeriod(1);
        if (isRightSwipe) navigateToPeriod(-1);
    };

    // Render Card View
    const renderCardView = () => {
        const PERIOD_INFO = {
            prev1: { name: 'Previous', range: 'Jan 20 – Feb 2' },
            current: { name: 'Current', range: 'Feb 3 – Feb 16' },
            next: { name: 'Upcoming', range: 'Feb 17 – Mar 2' },
        };

        return (
            <Box>
                {/* Period Tab Navigation — inspired by app's filter tabs */}
                {/* <Box sx={{
                    display: 'flex',
                    backgroundColor: '#fff',
                    borderRadius: '14px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    mb: 2,
                }}>
                    {weekKeys.map((key) => {
                        const active = selectedWeek === key;
                        const info = PERIOD_INFO[key];
                        return (
                            <Box
                                key={key}
                                onClick={() => setSelectedWeek(key)}
                                sx={{
                                    flex: 1,
                                    py: 1.25,
                                    px: 0.5,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    borderBottom: active ? '2.5px solid var(--primary-color)' : '2.5px solid transparent',
                                    backgroundColor: active ? 'rgba(0,86,179,0.04)' : 'transparent',
                                    transition: 'all 0.2s ease',
                                    '&:active': { backgroundColor: 'rgba(0,86,179,0.08)' },
                                }}
                            >
                                <Typography sx={{
                                    fontSize: '0.78rem',
                                    fontWeight: active ? 700 : 500,
                                    color: active ? 'var(--primary-color)' : '#999',
                                    lineHeight: 1.3,
                                }}>
                                    {info.name}
                                </Typography>
                                <Typography sx={{
                                    fontSize: '0.6rem',
                                    color: active ? 'var(--primary-color)' : '#bbb',
                                    mt: 0.25,
                                    lineHeight: 1,
                                }}>
                                    {info.range}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box> */}

                {/* Day Cards */}
                <Box
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {currentSchedule.schedule.map((shift, index) => (
                        <Box
                            key={index}
                            onClick={() => onDayClick && onDayClick(shift, index, currentSchedule.schedule)}
                            sx={{
                                display: 'flex',
                                alignItems: 'stretch',
                                backgroundColor: '#fff',
                                borderRadius: '14px',
                                boxShadow: shift.isToday
                                    ? '0 4px 16px rgba(0,86,179,0.14)'
                                    : '0',
                                mb: 1.25,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: shift.isToday
                                    ? '1.5px solid rgba(0,86,179,0.35)'
                                    : '1px solid #f0f0f0',
                                transition: 'transform 0.15s ease',
                                '&:active': { transform: 'scale(0.98)' },
                                marginBottom: 'var(--card-spacing)',
                            }}
                        >
                            {/* Left accent stripe */}
                            {/* <Box sx={{
                                width: 4,
                                flexShrink: 0,
                                backgroundColor: shift.isOffDay
                                    ? '#9fa8da'
                                    : shift.isToday
                                        ? 'var(--primary-color)'
                                        : '#90caf9',
                            }} /> */}

                            {/* Date column */}
                            <Box sx={{
                                width: 62,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 1.5,
                                flexShrink: 0,
                            }}>
                                <Typography sx={{
                                    fontSize: '0.58rem',
                                    fontWeight: 700,
                                    color: shift.isToday ? 'var(--primary-color)' : '#bbb',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    lineHeight: 1,
                                }}>
                                    {shift.day.substring(0, 3)}
                                </Typography>
                                <Typography sx={{
                                    fontSize: '1.55rem',
                                    fontWeight: 800,
                                    color: shift.isToday ? 'var(--primary-color)' : shift.isOffDay ? '#c62828' : '#1a1a1a',
                                    lineHeight: 1.1,
                                    mt: 0.3,
                                }}>
                                    {shift.date.split(' ')[1]}
                                </Typography>
                                <Typography sx={{
                                    fontSize: '0.58rem',
                                    fontWeight: 500,
                                    color: '#ccc',
                                    lineHeight: 1,
                                }}>
                                    {shift.date.split(' ')[0].toUpperCase()}
                                </Typography>
                                {/* {shift.isToday && (
                                    <Box sx={{
                                        mt: 0.75,
                                        px: 1,
                                        py: 0.3,
                                        backgroundColor: 'var(--primary-color)',
                                        borderRadius: '99px',
                                    }}>
                                        <Typography sx={{ fontSize: '0.45rem', color: '#fff', fontWeight: 700, letterSpacing: '0.05em' }}>
                                            TODAY
                                        </Typography>
                                    </Box>
                                )} */}
                            </Box>

                            {/* Thin vertical divider */}
                            <Box sx={{ width: '1px', backgroundColor: '#f0f0f0', my: 1.25, flexShrink: 0 }} />

                            {/* Main content */}
                            <Box sx={{
                                flex: 1,
                                px: 2,
                                py: 1.5,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}>
                                {shift.isOffDay ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#f44336', flexShrink: 0 }} />
                                        <Typography sx={{ color: '#c62828', fontWeight: 600, fontSize: '0.9rem' }}>
                                            Off Day
                                        </Typography>
                                    </Box>
                                ) : (
                                    <>
                                        {/* Start → duration → End */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.85 }}>
                                            <Box>
                                                <Typography sx={{ fontSize: '0.55rem', color: '#aaa', fontWeight: 600, letterSpacing: '0.04em', lineHeight: 1 }}>
                                                    START
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
                                                    {shift.startTime}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Box sx={{ flex: 1, height: '1px', backgroundColor: '#e8e8e8' }} />
                                                <Typography sx={{ fontSize: '0.58rem', color: '#aaa', px: 0.5, whiteSpace: 'nowrap' }}>
                                                    {shift.duration}
                                                </Typography>
                                                <Box sx={{ flex: 1, height: '1px', backgroundColor: '#e8e8e8' }} />
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography sx={{ fontSize: '0.55rem', color: '#aaa', fontWeight: 600, letterSpacing: '0.04em', lineHeight: 1 }}>
                                                    END
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.92rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
                                                    {shift.endTime}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {/* Status chip inline */}
                                        {/* <StatusChip
                                            label={statusInfo.label}
                                            size="small"
                                            icon={statusInfo.icon}
                                            chipColor={statusInfo.color}
                                            sx={{ alignSelf: 'flex-start', height: 22, fontSize: '0.65rem' }}
                                        /> */}
                                    </>
                                )}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    // ============================================
    // Cards Updated (List) View — ActivitiesPage-style
    // ============================================

    const renderListView = () => {
        const period = scheduleData['current'];

        return (
            <Box sx={{ backgroundColor: '#ffffff', borderRadius: 'var(--card-radius)', overflow: 'hidden' }}>
                {period.schedule.map((shift, index, arr) => (
                    <Box
                        key={index}
                        onClick={() => onDayClick && !shift.isOffDay && onDayClick(shift, index, period.schedule)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            px: 2,
                            py: 1.5,
                            cursor: shift.isOffDay ? 'default' : 'pointer',
                            borderBottom: index < arr.length - 1 ? '1px solid #f1f5f9' : 'none',
                            '&:active': shift.isOffDay ? {} : { backgroundColor: '#f8fafc' },
                        }}
                    >
                        {/* Date column */}
                        <Box sx={{ minWidth: 52, flexShrink: 0 }}>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: shift.isToday ? 'var(--primary-color)' : '#94a3b8', lineHeight: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                {shift.day.substring(0, 3)}
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: shift.isToday ? 'var(--primary-color)' : '#1a1a1a', lineHeight: 1.4 }}>
                                {shift.date}
                            </Typography>
                        </Box>

                        {/* Shift info */}
                        <Typography sx={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: shift.isOffDay ? '#94a3b8' : '#1a1a1a' }}>
                            {shift.isOffDay ? 'Off Day' : `${shift.startTime} – ${shift.endTime}`}
                        </Typography>

                        {/* Duration + chevron */}
                        {!shift.isOffDay ? (
                            <>
                                <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', mr: 0.75 }}>
                                    {shift.duration}
                                </Typography>
                                <ChevronRightIcon sx={{ fontSize: '1.1rem', color: '#cbd5e1', flexShrink: 0 }} />
                            </>
                        ) : (
                            <Box sx={{ width: '1.1rem' }} />
                        )}
                    </Box>
                ))}
            </Box>
        );
    };

    return (
        <ScheduleContainer>
            {/* View Toggle — Segmented Control */}
            <Box sx={{
                display: 'flex',
                backgroundColor: '#e8edf2',
                borderRadius: '14px',
                // padding: '4px',
                mb: 2,
            }}>
                {[
                    { key: 'calendar', label: 'Calendar', icon: <CalendarIcon sx={{ fontSize: 17 }} /> },
                    { key: 'cards', label: 'Cards', icon: <CardViewIcon sx={{ fontSize: 17 }} /> },
                    { key: 'list', label: 'Updated', icon: <ListViewIcon sx={{ fontSize: 17 }} /> },
                ].map(tab => (
                    <Box
                        key={tab.key}
                        onClick={() => setViewMode(tab.key)}
                        sx={{
                            flex: 1,
                            py: 0.9,
                            borderRadius: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.75,
                            backgroundColor: viewMode === tab.key ? 'var(--primary-color)' : 'transparent',
                            color: viewMode === tab.key ? '#fff' : '#5a6a7a',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            // boxShadow: viewMode === tab.key ? '0 2px 8px rgba(0,86,179,0.25)' : 'none',
                            userSelect: 'none',
                        }}
                    >
                        <Box sx={{ display: 'flex', color: 'inherit' }}>{tab.icon}</Box>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: viewMode === tab.key ? 600 : 500, color: 'inherit', lineHeight: 1 }}>
                            {tab.label}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Render View Based on Mode */}
            {viewMode === 'calendar' && renderCalendarView()}
            {viewMode === 'timeline' && renderTimelineView()}
            {viewMode === 'cards' && renderCardView()}
            {viewMode === 'list' && renderListView()}
        </ScheduleContainer>
    );
};

export default SchedulePage;
