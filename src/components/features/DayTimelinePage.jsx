import { useMemo, useState, useRef, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    IconButton,
    Chip,
    SwipeableDrawer,
    Divider,
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
// Component
// ============================================

const DayTimelinePage = ({ dayData, scheduleList = [], onDayChange, onBack }) => {
    const isOffDay = dayData?.isOffDay;
    const [selectedActivity, setSelectedActivity] = useState(null);

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

    const goToPrev = useCallback(() => {
        if (canGoPrev && onDayChange) onDayChange(scheduleList[currentIndex - 1]);
    }, [canGoPrev, onDayChange, scheduleList, currentIndex]);

    const goToNext = useCallback(() => {
        if (canGoNext && onDayChange) onDayChange(scheduleList[currentIndex + 1]);
    }, [canGoNext, onDayChange, scheduleList, currentIndex]);

    const handleTouchStart = useCallback((e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    }, []);

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
            timeText: `${dayData.startTime} – ${dayData.endTime}`,
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
                timeText: `${formatMinutesToTime(brk.start)} – ${formatMinutesToTime(brk.end)}`,
                sub: `${brk.end - brk.start} min`,
            });
        });

        return items;
    }, [dayData, isOffDay]);

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
                    <IconButton onClick={goToPrev} sx={{ color: '#fff', p: 0.5 }}>
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
                    <IconButton onClick={goToNext} sx={{ color: '#fff', p: 0.5 }}>
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
            >
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
                    <GridArea>
                        {/* Hour lines */}
                        {hours.map((_, i) => (
                            <HourLine key={`h-${i}`} sx={{ top: i * HOUR_HEIGHT }} />
                        ))}

                        {/* Half-hour lines */}
                        {hours.map((_, i) => (
                            <HalfHourLine key={`hh-${i}`} sx={{ top: i * HOUR_HEIGHT + HOUR_HEIGHT / 2 }} />
                        ))}

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
                            if (duration < 0) duration += 24 * 60; // overnight
                            const height = (duration / 60) * HOUR_HEIGHT;
                            const isBreak = act.id.startsWith('break');

                            return (
                                <ActivityBlock
                                    key={act.id}
                                    gradient={act.gradient}
                                    onClick={() => setSelectedActivity(act)}
                                    sx={{
                                        top,
                                        height,
                                        cursor: 'pointer',
                                        // Breaks: single-line compact layout
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
                                        /* Break: single line — {Icon} {Name}: {Time} ({duration}) */
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
                                        /* Shift: multi-line layout */
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
        </PageContainer>
    );
};

export default DayTimelinePage;
