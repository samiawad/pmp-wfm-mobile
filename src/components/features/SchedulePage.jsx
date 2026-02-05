import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Divider,
    Select,
    MenuItem,
    FormControl,
    ToggleButtonGroup,
    ToggleButton,
    Tooltip,
} from '@mui/material';
import {
    AccessTime as ClockIcon,
    CheckCircle as CheckIcon,
    EventAvailable as EventIcon,
    ViewModule as CardViewIcon,
    Timeline as TimelineIcon,
    TaskAlt as CompletedIcon,
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
// Styled Components
// ============================================

const ScheduleContainer = styled(Box)(({ theme }) => ({
    paddingBottom: theme.spacing(2),
    backgroundColor: '#e7e7e7',
    minHeight: '100vh',
    margin: '-var(--spacing-md)',
    padding: 'var(--spacing-md)',
}));

const PageTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    color: 'var(--color-on-background)',
    marginBottom: theme.spacing(0.5),
}));

const FilterContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    width: '100%',
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'white',
        borderRadius: '12px',
        '&:hover': {
            backgroundColor: '#f5f5f5',
        },
    },
}));

const DayCard = styled(Card)(({ theme, isOffDay, isToday }) => ({
    marginBottom: theme.spacing(2),
    background: isOffDay
        ? 'linear-gradient(135deg, rgba(255,235,238,0.9) 0%, rgba(255,205,210,0.7) 100%)'
        : isToday
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    backdropFilter: 'blur(10px)',
    border: isToday ? '2px solid #667eea' : '1px solid rgba(255, 255, 255, 0.5)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 28px rgba(0, 0, 0, 0.12)',
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
    color: isToday ? 'white' : 'var(--text-primary)',
}));

const DateText = styled(Typography)(({ theme, isToday }) => ({
    fontSize: '0.875rem',
    color: isToday ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)',
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
    color: isToday ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)',
    marginBottom: theme.spacing(0.5),
}));

const TimeValue = styled(Typography)(({ theme, isToday }) => ({
    fontSize: '1rem',
    fontWeight: 600,
    color: isToday ? 'white' : 'var(--text-primary)',
}));

const StatusChip = styled(Chip)(({ theme, chipColor }) => ({
    background: chipColor || 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    color: 'white',
    fontWeight: 600,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
}));

const OffDayText = styled(Typography)(({ theme }) => ({
    fontSize: '1rem',
    fontWeight: 600,
    color: '#c62828',
    textAlign: 'center',
    padding: theme.spacing(2),
}));

const ViewSwitcherContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    '& .MuiToggleButton-root': {
        border: 'none',
        padding: theme.spacing(1, 2),
        '&.Mui-selected': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            '&:hover': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            },
        },
    },
}));

// Timeline View Styled Components
const TimelineContainer = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: theme.spacing(2),
    paddingLeft: 0, // Remove left padding to make day labels flush
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    overflowX: 'auto',
}));

const TimelineRowWrapper = styled(Box)(({ theme }) => ({
}));

const TimelineRow = styled(Box)(({ theme, isOffDay }) => ({
    display: 'flex',
    alignItems: 'stretch',
    minHeight: '12px', // Reduced to make blocks perfect squares
    backgroundColor: isOffDay ? '#ffebee' : 'transparent',
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
    color: 'var(--text-primary)',
    lineHeight: 1.2,
}));

const DayLabelDate = styled(Typography)(({ theme }) => ({
    fontSize: '0.6rem',
    color: 'var(--text-secondary)',
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
    color: 'var(--text-secondary)',
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
    color: 'var(--text-secondary)',
    padding: theme.spacing(0.3, 0),
}));

// ============================================
// Component
// ============================================

const SchedulePage = () => {
    const [selectedWeek, setSelectedWeek] = useState('current');
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'timeline'

    const handleWeekChange = (event) => {
        setSelectedWeek(event.target.value);
    };

    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setViewMode(newView);
        }
    };

    const currentSchedule = scheduleData[selectedWeek];
    const currentStatus = getShiftStatus(selectedWeek);

    // Helper to get status display info
    const getStatusInfo = (status) => {
        switch (status) {
            case 'published':
                return {
                    label: 'Published',
                    color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                    icon: <CheckIcon />,
                };
            case 'completed':
                return {
                    label: 'Completed',
                    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    icon: <CompletedIcon />,
                };
            case 'pending':
                return {
                    label: 'Pending',
                    color: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)',
                    icon: <ClockIcon />,
                };
            default:
                return {
                    label: 'Unknown',
                    color: 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)',
                    icon: <ClockIcon />,
                };
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

    // Render Card View
    const renderCardView = () => {
        return (
            <>
                {currentSchedule.schedule.map((shift, index) => (
                    <DayCard
                        key={index}
                        isOffDay={shift.isOffDay}
                        isToday={shift.isToday}
                    >
                        <CardContent>
                            <DayHeader isToday={shift.isToday}>
                                <Box>
                                    <DayName isToday={shift.isToday}>
                                        {shift.day}
                                        {shift.isToday && ' (Today)'}
                                    </DayName>
                                    <DateText isToday={shift.isToday}>
                                        {shift.date}
                                    </DateText>
                                </Box>
                                {!shift.isOffDay && (
                                    <StatusChip
                                        label={statusInfo.label}
                                        size="small"
                                        icon={statusInfo.icon}
                                        chipColor={statusInfo.color}
                                    />
                                )}
                            </DayHeader>

                            {shift.isOffDay ? (
                                <OffDayText>
                                    Off Day
                                </OffDayText>
                            ) : (
                                <>
                                    <Divider sx={{
                                        my: 1.5,
                                        borderColor: shift.isToday ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)'
                                    }} />
                                    <ShiftDetails>
                                        <TimeBox isToday={shift.isToday}>
                                            <TimeLabel isToday={shift.isToday}>Start Time</TimeLabel>
                                            <TimeValue isToday={shift.isToday}>{shift.startTime}</TimeValue>
                                        </TimeBox>
                                        <TimeBox isToday={shift.isToday}>
                                            <TimeLabel isToday={shift.isToday}>End Time</TimeLabel>
                                            <TimeValue isToday={shift.isToday}>{shift.endTime}</TimeValue>
                                        </TimeBox>
                                        <TimeBox isToday={shift.isToday}>
                                            <TimeLabel isToday={shift.isToday}>Duration</TimeLabel>
                                            <TimeValue isToday={shift.isToday}>{shift.duration}</TimeValue>
                                        </TimeBox>
                                    </ShiftDetails>
                                </>
                            )}
                        </CardContent>
                    </DayCard>
                ))}
            </>
        );
    };

    return (
        <ScheduleContainer>
            {/* Header */}
            <Box sx={{ mb: 2 }}>
                <PageTitle variant="h5">
                    My Schedule
                </PageTitle>
            </Box>

            {/* Week Filter */}
            <FilterContainer>
                <StyledFormControl>
                    <Select
                        value={selectedWeek}
                        onChange={handleWeekChange}
                        displayEmpty
                    >
                        <MenuItem value="prev1">{scheduleData.prev1.label}</MenuItem>
                        <MenuItem value="current">{scheduleData.current.label}</MenuItem>
                        <MenuItem value="next">{scheduleData.next.label}</MenuItem>
                    </Select>
                </StyledFormControl>
            </FilterContainer>

            {/* View Switcher */}
            <ViewSwitcherContainer>
                <StyledToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={handleViewChange}
                    aria-label="view mode"
                >
                    <ToggleButton value="cards" aria-label="card view">
                        <CardViewIcon sx={{ mr: 1 }} />
                        Cards
                    </ToggleButton>
                    <ToggleButton value="timeline" aria-label="timeline view">
                        <TimelineIcon sx={{ mr: 1 }} />
                        Timeline
                    </ToggleButton>
                </StyledToggleButtonGroup>
            </ViewSwitcherContainer>

            {/* Render View Based on Mode */}
            {viewMode === 'timeline' ? renderTimelineView() : renderCardView()}
        </ScheduleContainer>
    );
};

export default SchedulePage;
