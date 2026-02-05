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
} from '@mui/material';
import {
    AccessTime as ClockIcon,
    CheckCircle as CheckIcon,
    EventAvailable as EventIcon,
} from '@mui/icons-material';

// ============================================
// Mock Data - Multiple Weeks
// ============================================

const scheduleData = {
    'current': {
        label: 'Current Week (Feb 3 - Feb 9)',
        schedule: [
            { day: 'Monday', date: 'Feb 3', isToday: false, isOffDay: false, startTime: '7:00 AM', endTime: '3:00 PM', duration: '8 hours', status: 'confirmed' },
            { day: 'Tuesday', date: 'Feb 4', isToday: true, isOffDay: false, startTime: '2:00 PM', endTime: '10:00 PM', duration: '8 hours', status: 'confirmed' },
            { day: 'Wednesday', date: 'Feb 5', isToday: false, isOffDay: false, startTime: '9:00 AM', endTime: '5:00 PM', duration: '8 hours', status: 'confirmed' },
            { day: 'Thursday', date: 'Feb 6', isToday: false, isOffDay: false, startTime: '11:00 AM', endTime: '8:00 PM', duration: '9 hours', status: 'confirmed' },
            { day: 'Friday', date: 'Feb 7', isToday: false, isOffDay: true },
            { day: 'Saturday', date: 'Feb 8', isToday: false, isOffDay: false, startTime: '10:00 AM', endTime: '4:00 PM', duration: '6 hours', status: 'confirmed' },
            { day: 'Sunday', date: 'Feb 9', isToday: false, isOffDay: true },
        ]
    },
    'next': {
        label: 'Next Week (Feb 10 - Feb 16)',
        schedule: [
            { day: 'Monday', date: 'Feb 10', isToday: false, isOffDay: false, startTime: '3:00 PM', endTime: '11:00 PM', duration: '8 hours', status: 'pending' },
            { day: 'Tuesday', date: 'Feb 11', isToday: false, isOffDay: false, startTime: '8:00 AM', endTime: '4:00 PM', duration: '8 hours', status: 'pending' },
            { day: 'Wednesday', date: 'Feb 12', isToday: false, isOffDay: false, startTime: '12:00 PM', endTime: '8:00 PM', duration: '8 hours', status: 'pending' },
            { day: 'Thursday', date: 'Feb 13', isToday: false, isOffDay: true },
            { day: 'Friday', date: 'Feb 14', isToday: false, isOffDay: false, startTime: '6:00 AM', endTime: '2:00 PM', duration: '8 hours', status: 'pending' },
            { day: 'Saturday', date: 'Feb 15', isToday: false, isOffDay: false, startTime: '9:00 AM', endTime: '6:00 PM', duration: '9 hours', status: 'pending' },
            { day: 'Sunday', date: 'Feb 16', isToday: false, isOffDay: true },
        ]
    },
    'prev1': {
        label: 'Previous Week (Jan 27 - Feb 2)',
        schedule: [
            { day: 'Monday', date: 'Jan 27', isToday: false, isOffDay: false, startTime: '10:00 AM', endTime: '6:00 PM', duration: '8 hours', status: 'confirmed' },
            { day: 'Tuesday', date: 'Jan 28', isToday: false, isOffDay: false, startTime: '1:00 PM', endTime: '9:00 PM', duration: '8 hours', status: 'confirmed' },
            { day: 'Wednesday', date: 'Jan 29', isToday: false, isOffDay: true },
            { day: 'Thursday', date: 'Jan 30', isToday: false, isOffDay: false, startTime: '7:00 AM', endTime: '3:00 PM', duration: '8 hours', status: 'confirmed' },
            { day: 'Friday', date: 'Jan 31', isToday: false, isOffDay: false, startTime: '11:00 AM', endTime: '7:00 PM', duration: '8 hours', status: 'confirmed' },
            { day: 'Saturday', date: 'Feb 1', isToday: false, isOffDay: false, startTime: '8:00 AM', endTime: '2:00 PM', duration: '6 hours', status: 'confirmed' },
            { day: 'Sunday', date: 'Feb 2', isToday: false, isOffDay: true },
        ]
    },
    'prev2': {
        label: '2 Weeks Ago (Jan 20 - Jan 26)',
        schedule: [
            { day: 'Monday', date: 'Jan 20', isToday: false, isOffDay: false, startTime: '9:00 AM', endTime: '5:00 PM', duration: '8 hours', status: 'confirmed' },
            { day: 'Tuesday', date: 'Jan 21', isToday: false, isOffDay: false, startTime: '4:00 PM', endTime: '12:00 AM', duration: '8 hours', status: 'confirmed' },
            { day: 'Wednesday', date: 'Jan 22', isToday: false, isOffDay: false, startTime: '6:00 AM', endTime: '2:00 PM', duration: '8 hours', status: 'confirmed' },
            { day: 'Thursday', date: 'Jan 23', isToday: false, isOffDay: true },
            { day: 'Friday', date: 'Jan 24', isToday: false, isOffDay: false, startTime: '2:00 PM', endTime: '10:00 PM', duration: '8 hours', status: 'confirmed' },
            { day: 'Saturday', date: 'Jan 25', isToday: false, isOffDay: true },
            { day: 'Sunday', date: 'Jan 26', isToday: false, isOffDay: false, startTime: '10:00 AM', endTime: '7:00 PM', duration: '9 hours', status: 'confirmed' },
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

// ============================================
// Component
// ============================================

const SchedulePage = () => {
    const [selectedWeek, setSelectedWeek] = useState('current');

    const handleWeekChange = (event) => {
        setSelectedWeek(event.target.value);
    };

    const currentSchedule = scheduleData[selectedWeek];

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
                        <MenuItem value="prev2">{scheduleData.prev2.label}</MenuItem>
                        <MenuItem value="prev1">{scheduleData.prev1.label}</MenuItem>
                        <MenuItem value="current">{scheduleData.current.label}</MenuItem>
                        <MenuItem value="next">{scheduleData.next.label}</MenuItem>
                    </Select>
                </StyledFormControl>
            </FilterContainer>

            {/* Weekly Schedule */}
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
                                    label={shift.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                    size="small"
                                    icon={shift.status === 'confirmed' ? <CheckIcon /> : <ClockIcon />}
                                    chipColor={
                                        shift.status === 'confirmed'
                                            ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                                            : 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)'
                                    }
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
        </ScheduleContainer>
    );
};

export default SchedulePage;
