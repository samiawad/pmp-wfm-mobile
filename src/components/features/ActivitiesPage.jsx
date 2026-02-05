import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    TextField,
    InputAdornment,
    IconButton,
    Avatar,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    Warning as ExceptionIcon,
    Schedule as ScheduleIcon,
    SwapHoriz as SwapIcon,
    School as CoachingIcon,
    Assignment as EvaluationIcon,
    NotificationImportant as AlertIcon,
    Description as LogIcon,
    EmojiEvents as RecognitionIcon,
    Gavel as DisciplinaryIcon,
} from '@mui/icons-material';

// ============================================
// Styled Components
// ============================================

const PageContainer = styled(Box)(({ theme }) => ({
    paddingBottom: theme.spacing(2),
    backgroundColor: '#e7e7e7',
    minHeight: '100%',
    margin: '-var(--spacing-md)',
    padding: 'var(--spacing-md)',
}));

const Header = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}));

const PageTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    color: 'var(--color-on-background)',
}));

const SearchBar = styled(TextField)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: '12px',
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        '& fieldset': {
            border: 'none',
        },
    },
    marginBottom: theme.spacing(3),
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
}));

const TimelineGroup = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

const GroupDate = styled(Typography)(({ theme }) => ({
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginBottom: theme.spacing(1.5),
    paddingLeft: theme.spacing(1),
}));

const ActivityCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(1.5),
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    borderLeft: '4px solid transparent',
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
}));

const ActivityContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
}));

const IconContainer = styled(Avatar)(({ theme, bgcolor }) => ({
    backgroundColor: bgcolor,
    width: 40,
    height: 40,
}));

const ActivityDetails = styled(Box)(({ theme }) => ({
    flex: 1,
}));

const ActivityTime = styled(Typography)(({ theme }) => ({
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginBottom: 2,
}));

const ActivityTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '1rem',
    color: 'var(--text-primary)',
}));

const ActivityMeta = styled(Typography)(({ theme }) => ({
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
}));

// ============================================
// Mock Data
// ============================================

const activities = [
    // --- Coaching ---
    {
        id: 101,
        category: 'Coaching',
        type: 'coaching',
        title: 'Coaching on AHT',
        description: 'Status: Completed',
        time: '10:00 AM',
        date: 'Today',
        status: 'completed',
        icon: <CoachingIcon />,
        color: '#2196f3',
    },
    {
        id: 102,
        category: 'Coaching',
        type: 'coaching',
        title: 'Coaching on Quality Score',
        description: 'Status: Scheduled',
        time: '02:00 PM',
        date: 'Tomorrow',
        status: 'scheduled',
        icon: <CoachingIcon />,
        color: '#ff9800',
    },

    // --- Evaluations ---
    {
        id: 201,
        category: 'Evaluations',
        type: 'evaluation',
        title: 'Call Quality Audit',
        description: 'Score: 92% (Excellent)',
        time: '04:30 PM',
        date: 'Yesterday',
        status: 'reviewed',
        icon: <EvaluationIcon />,
        color: '#9c27b0',
    },
    {
        id: 202,
        category: 'Evaluations',
        type: 'evaluation',
        title: 'Email Etiquette Check',
        description: 'Score: 88% (Good)',
        time: '11:15 AM',
        date: 'Oct 23, 2023',
        status: 'reviewed',
        icon: <EvaluationIcon />,
        color: '#673ab7',
    },

    // --- Alerts ---
    {
        id: 301,
        category: 'Alerts',
        type: 'alert',
        title: 'Sudden Drop in Quality',
        description: 'Quality score dropped below 85%',
        time: '09:00 AM',
        date: 'Today',
        status: 'critical',
        icon: <AlertIcon />,
        color: '#f44336',
    },
    {
        id: 302,
        category: 'Alerts',
        type: 'alert',
        title: 'Adherence Warning',
        description: 'Out of adherence for > 15 mins',
        time: '01:45 PM',
        date: 'Yesterday',
        status: 'warning',
        icon: <AlertIcon />,
        color: '#ff9800',
    },

    // --- Events (Disciplinary & Recognition) ---
    {
        id: 401,
        category: 'Events',
        type: 'disciplinary',
        title: 'Disciplinary Action',
        description: 'Severe customer mishandling (-15 Points)',
        time: '09:15 AM',
        date: 'Yesterday',
        status: 'warning',
        icon: <DisciplinaryIcon />,
        color: '#f44336',
    },
    {
        id: 402,
        category: 'Events',
        type: 'disciplinary',
        title: 'Disciplinary Action',
        description: 'Sarcasm language during call (-5 Points)',
        time: '02:30 PM',
        date: 'Yesterday',
        status: 'rejected',
        icon: <DisciplinaryIcon />,
        color: '#d32f2f',
    },
    {
        id: 403,
        category: 'Events',
        type: 'disciplinary',
        title: 'Security Compliance',
        description: 'Sharing account with others (-50 Points)',
        time: '04:00 PM',
        date: 'Oct 24, 2023',
        status: 'critical',
        icon: <DisciplinaryIcon />,
        color: '#b71c1c',
    },
    {
        id: 404,
        category: 'Events',
        type: 'recognition',
        title: 'Recognition',
        description: 'Excellent Customer Feedback (+10 Points)',
        time: '08:58 AM',
        date: 'Today',
        status: 'success',
        icon: <RecognitionIcon />,
        color: '#4caf50',
    },

    // --- Logs (System Events) ---
    {
        id: 501,
        category: 'Logs',
        type: 'login',
        title: 'System Login',
        description: 'Logged in from Mobile App',
        time: '08:55 AM',
        date: 'Today',
        status: 'success',
        icon: <LogIcon />,
        color: '#607d8b',
    },
    {
        id: 502,
        category: 'Logs',
        type: 'break',
        title: 'Morning Break',
        description: '15 mins break ended',
        time: '11:15 AM',
        date: 'Today',
        status: 'completed',
        icon: <LogIcon />,
        color: '#607d8b',
    },
];

// ============================================
// Component
// ============================================

const ActivitiesPage = ({ initialFilter = 'All' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState(initialFilter);

    useEffect(() => {
        setFilterCategory(initialFilter);
    }, [initialFilter]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'success': return 'success';
            case 'info': return 'info';
            case 'completed': return 'success';
            case 'reviewed': return 'secondary';
            case 'pending': return 'warning';
            case 'warning': return 'warning';
            case 'scheduled': return 'info';
            case 'rejected': return 'error';
            case 'critical': return 'error';
            default: return 'default';
        }
    };

    const handleFilterChange = (event) => {
        setFilterCategory(event.target.value);
    };

    // Filter Activities
    const filteredActivities = activities.filter(activity => {
        const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            activity.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === 'All' || activity.category === filterCategory;

        return matchesSearch && matchesCategory;
    });

    // Group filtered activities by date
    const groupedActivities = filteredActivities.reduce((groups, activity) => {
        const date = activity.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(activity);
        return groups;
    }, {});

    return (
        <PageContainer>
            <Header>
                <PageTitle variant="h4">Activities</PageTitle>
                <FormControl variant="outlined" size="small" sx={{ minWidth: 120, backgroundColor: 'white', borderRadius: 1 }}>
                    <Select
                        value={filterCategory}
                        onChange={handleFilterChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Filter By' }}
                    >
                        <MenuItem value="All">All Activities</MenuItem>
                        <MenuItem value="Coaching">Coaching</MenuItem>
                        <MenuItem value="Logs">Logs</MenuItem>
                        <MenuItem value="Events">Events</MenuItem>
                        <MenuItem value="Evaluations">Evaluations</MenuItem>
                        <MenuItem value="Alerts">Alerts</MenuItem>
                    </Select>
                </FormControl>
            </Header>

            <SearchBar
                fullWidth
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                }}
            />

            {Object.keys(groupedActivities).length > 0 ? (
                Object.keys(groupedActivities).map((date) => (
                    <TimelineGroup key={date}>
                        <GroupDate>{date}</GroupDate>
                        {groupedActivities[date].map((activity) => (
                            <ActivityCard key={activity.id} sx={{ borderLeftColor: activity.color }}>
                                <CardContent sx={{ padding: '16px !important' }}>
                                    <ActivityContent>
                                        <IconContainer bgcolor={`${activity.color}20`} sx={{ color: activity.color }}>
                                            {activity.icon}
                                        </IconContainer>
                                        <ActivityDetails>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <ActivityTitle>{activity.title}</ActivityTitle>
                                                <ActivityTime>{activity.time}</ActivityTime>
                                            </Box>
                                            <ActivityMeta>{activity.description}</ActivityMeta>
                                        </ActivityDetails>
                                        {activity.status && (
                                            <Chip
                                                label={activity.status}
                                                size="small"
                                                color={getStatusColor(activity.status)}
                                                sx={{ textTransform: 'capitalize', fontWeight: 600, height: 24 }}
                                            />
                                        )}
                                    </ActivityContent>
                                </CardContent>
                            </ActivityCard>
                        ))}
                    </TimelineGroup>
                ))
            ) : (
                <Box sx={{ textAlign: 'center', mt: 5, color: 'text.secondary' }}>
                    <Typography>No activities found for this filter.</Typography>
                </Box>
            )}
        </PageContainer>
    );
};

export default ActivitiesPage;
