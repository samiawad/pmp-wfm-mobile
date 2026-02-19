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
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    SwipeableDrawer,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Radio,
} from '@mui/material';
import {
    Search as SearchIcon,
    EmojiEvents as RecognitionIcon,
    Gavel as DisciplinaryIcon,
    Close as CloseIcon,
    List as FilterIcon,
    School as CoachingIcon,
    Assignment as EvaluationIcon,
    NotificationImportant as AlertIcon,
    Description as LogIcon,
    ExpandMore as DropdownIcon,
} from '@mui/icons-material';

// ============================================
// Styled Components
// ============================================

const PageContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#f5f5f5',
    width: '100%',
    padding: '16px',
    boxSizing: 'border-box',
    paddingBottom: theme.spacing(2),
}));

const FilterRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    overflowX: 'auto',
    paddingBottom: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
    flexWrap: 'nowrap',
}));

const PageTitle = styled(Typography)({
    fontWeight: 700,
    fontSize: '1rem',
    color: 'var(--color-on-background)',
    whiteSpace: 'nowrap',
    flexShrink: 0,
});

const FilterSearchField = styled(TextField)({
    width: 'fit-content',
    flexShrink: 0,
    '& .MuiOutlinedInput-root': {
        height: 32,
        borderRadius: 20,
        backgroundColor: '#fff',
        fontSize: '0.75rem',
        '& fieldset': { borderColor: '#e0e0e0' },
    },
    minWidth: 120,
});

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

const ActivityTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    fontSize: '1rem',
    color: 'var(--text-primary)',
}));

const ActivityMeta = styled(Typography)(({ theme }) => ({
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
}));

const FilterChip = styled(Chip)(({ theme, active, selected }) => ({
    height: 32,
    borderRadius: 20,
    backgroundColor: (active || selected) ? undefined : '#fff',
    background: (active || selected) ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined,
    color: (active || selected) ? '#fff' : 'var(--text-primary)',
    fontWeight: 500,
    fontSize: '0.75rem',
    border: (active || selected) ? 'none' : '1px solid #e0e0e0',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    '& .MuiChip-icon': {
        color: (active || selected) ? '#fff' : 'inherit',
        fontSize: 16,
        marginLeft: '8px',
    },
    '&:hover': {
        opacity: 0.85,
    },
}));

const DropdownTrigger = styled(Box)(({ theme }) => ({
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    padding: '0 12px 0 8px',
    borderRadius: 20,
    backgroundColor: '#fff',
    border: '1px solid #c4c4c4',
    cursor: 'pointer',
    color: 'var(--text-primary)',
    fontWeight: 500,
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    '&:hover': {
        borderColor: '#212121',
        backgroundColor: '#fafafa',
    },
    '&:active': {
        backgroundColor: '#f5f5f5',
    },
}));

const DragHandle = styled(Box)({
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d0d0d0',
    margin: '12px auto 8px',
});

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
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const categories = ['All', 'Coaching', 'Logs', 'Events', 'Evaluations', 'Alerts'];

    const handleCategorySelect = (category) => {
        setFilterCategory(category);
        setIsBottomSheetOpen(false);
    };

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
            {/* Title + Filters in one horizontal scrolling row */}
            <FilterRow>
                <PageTitle>Activities</PageTitle>
                <DropdownTrigger onClick={() => setIsBottomSheetOpen(true)}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {/* <FilterIcon sx={{ fontSize: '1rem', color: '#757575' }} /> */}
                        {filterCategory}
                    </Box>
                    <DropdownIcon sx={{ fontSize: '1.2rem', color: '#757575' }} />
                </DropdownTrigger>
                <FilterSearchField
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: 16 }} color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </FilterRow>

            {Object.keys(groupedActivities).length > 0 ? (
                Object.keys(groupedActivities).map((date) => (
                    <TimelineGroup key={date}>
                        <GroupDate>{date}</GroupDate>
                        <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                            <Table size="small">
                                <TableHead sx={{ backgroundColor: '#f9f9f9' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700, width: '80px' }}>Time</TableCell>
                                        {filterCategory === 'All' && <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>}
                                        <TableCell sx={{ fontWeight: 700 }}>Activity</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }} align="right">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {groupedActivities[date].map((activity) => (
                                        <TableRow
                                            key={activity.id}
                                            hover
                                            onClick={() => setSelectedActivity(activity)}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                                {activity.time}
                                            </TableCell>
                                            {filterCategory === 'All' && (
                                                <TableCell>
                                                    <Chip
                                                        label={activity.category}
                                                        size="small"
                                                        sx={{
                                                            fontSize: '0.65rem',
                                                            height: 20,
                                                            backgroundColor: `${activity.color}15`,
                                                            color: activity.color,
                                                            fontWeight: 600,
                                                            border: `1px solid ${activity.color}30`
                                                        }}
                                                    />
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{activity.title}</Typography>
                                                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{activity.description}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={activity.status}
                                                    size="small"
                                                    color={getStatusColor(activity.status)}
                                                    sx={{ textTransform: 'capitalize', fontWeight: 600, height: 22, fontSize: '0.7rem' }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TimelineGroup>
                ))
            ) : (
                <Box sx={{ textAlign: 'center', mt: 5, color: 'text.secondary' }}>
                    <Typography>No activities found for this filter.</Typography>
                </Box>
            )}

            {/* Bottom Sheet for Category Filter */}
            <SwipeableDrawer
                anchor="bottom"
                open={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                onOpen={() => setIsBottomSheetOpen(true)}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        paddingBottom: '20px',
                        maxHeight: '60vh'
                    }
                }}
            >
                <DragHandle />
                <Box sx={{ px: 3, pt: 1, pb: 2 }}>
                    <Typography variant="h6" fontWeight={700} textAlign="center">Filter Category</Typography>
                </Box>
                <List sx={{ pt: 1 }}>
                    {categories.map((cat) => (
                        <ListItem disablePadding key={cat}>
                            <ListItemButton onClick={() => handleCategorySelect(cat)} sx={{ px: 3 }}>
                                <Radio
                                    checked={filterCategory === cat}
                                    onChange={() => handleCategorySelect(cat)}
                                    size="small"
                                    sx={{ mr: 1 }}
                                />

                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

            </SwipeableDrawer>

            {/* Activity Details Sheet */}
            <SwipeableDrawer
                anchor="bottom"
                open={Boolean(selectedActivity)}
                onClose={() => setSelectedActivity(null)}
                onOpen={() => setSelectedActivity(selectedActivity)}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        padding: '0',
                        maxHeight: '85vh'
                    }
                }}
            >
                {selectedActivity && (
                    <Box sx={{ pb: 4 }}>
                        <DragHandle />
                        {/* Header */}
                        <Box sx={{ px: 3, pt: 1, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: '16px',
                                        backgroundColor: `${selectedActivity.color}15`,
                                        color: selectedActivity.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 56,
                                        height: 56,
                                    }}
                                >
                                    {React.cloneElement(selectedActivity.icon, { sx: { fontSize: 32 } })}
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2, mb: 0.5 }}>
                                        {selectedActivity.category}
                                    </Typography>
                                    <Chip
                                        label={selectedActivity.status}
                                        size="small"
                                        color={getStatusColor(selectedActivity.status)}
                                        sx={{
                                            fontWeight: 600,
                                            textTransform: 'capitalize',
                                            height: 24
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ px: 3 }}>
                            {/* Details */}
                            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                                {selectedActivity.title}
                            </Typography>

                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                                {selectedActivity.description}
                            </Typography>

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: '12px',
                                    backgroundColor: '#f9fafb',
                                    border: '1px solid #eef2f6',
                                    mb: 3
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                    <Typography variant="body2" color="text.secondary">Date</Typography>
                                    <Typography variant="body2" fontWeight={600}>{selectedActivity.date}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Time</Typography>
                                    <Typography variant="body2" fontWeight={600}>{selectedActivity.time}</Typography>
                                </Box>
                            </Paper>


                        </Box>
                    </Box>
                )}
            </SwipeableDrawer>
        </PageContainer >
    );
};

export default ActivitiesPage;
