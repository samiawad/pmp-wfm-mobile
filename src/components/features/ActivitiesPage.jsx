import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    Chip,
    TextField,
    InputAdornment,
    IconButton,
    SwipeableDrawer,
    Divider,
    Paper,
} from '@mui/material';
import {
    Search as SearchIcon,
    EmojiEvents as RecognitionIcon,
    Gavel as DisciplinaryIcon,
    Close as CloseIcon,
    School as CoachingIcon,
    Assignment as EvaluationIcon,
    NotificationImportant as AlertIcon,
    Description as LogIcon,
} from '@mui/icons-material';

// ============================================
// Styled Components
// ============================================

const PageContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#f5f5f5',
    width: '100%',
    padding: '16px',
    boxSizing: 'border-box',
    paddingBottom: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

// Full-width pill search bar
const SearchBar = styled(TextField)({
    width: '100%',
    '& .MuiOutlinedInput-root': {
        height: 44,
        borderRadius: 24,
        backgroundColor: '#ffffff',
        fontSize: '0.875rem',
        '& fieldset': { borderColor: '#e0e0e0' },
        '&:hover fieldset': { borderColor: '#bdbdbd' },
        '&.Mui-focused fieldset': { borderColor: 'var(--primary-color)' },
    },
});

// Horizontally scrollable chip row — no title, no dropdown
const ChipsRow = styled(Box)({
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': { display: 'none' },
    flexWrap: 'nowrap',
});

// Pill filter chip — selected = solid blue, unselected = white outlined
// IONIC MIGRATION: replace with IonSegment / IonSegmentButton
const FilterChip = styled(Chip, {
    shouldForwardProp: (prop) => prop !== 'isSelected',
})(({ isSelected }) => ({
    height: 34,
    borderRadius: 17,
    fontWeight: 600,
    fontSize: '0.8rem',
    cursor: 'pointer',
    flexShrink: 0,
    backgroundColor: isSelected ? 'var(--primary-color)' : '#ffffff',
    color: isSelected ? '#ffffff' : '#555',
    border: isSelected ? '1.5px solid var(--primary-color)' : '1.5px solid #e0e0e0',
    transition: 'all 0.15s ease',
    '&:hover': {
        backgroundColor: isSelected ? 'var(--primary-color)' : '#f5f5f5',
        border: isSelected ? '1.5px solid var(--primary-color)' : '1.5px solid #bdbdbd',
    },
    '& .MuiChip-label': {
        paddingLeft: 14,
        paddingRight: 14,
    },
}));

// Date section header — "Today", "Yesterday", "Oct 23, 2023"
const DateHeader = styled(Typography)({
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#9e9e9e',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    marginBottom: 8,
    paddingLeft: 2,
});

// Activity feed card — left accent border, white bg, tap feedback
const ActivityCard = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'accentColor',
})(({ accentColor }) => ({
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    borderLeft: `4px solid ${accentColor}`,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    padding: '14px 14px 12px 14px',
    marginBottom: 8,
    cursor: 'pointer',
    transition: 'opacity 0.1s ease',
    '&:active': {
        opacity: 0.85,
    },
}));

// Sheet drag handle
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
    // Today
    {
        id: 101, category: 'Coaching', type: 'coaching',
        title: 'Coaching on AHT',
        description: 'Session completed with supervisor',
        time: '10:00 AM', date: 'Today', status: 'completed',
        icon: <CoachingIcon />, color: '#1565c0',
    },
    {
        id: 301, category: 'Alerts', type: 'alert',
        title: 'Sudden Drop in Quality',
        description: 'Quality score dropped below 85%',
        time: '09:00 AM', date: 'Today', status: 'critical',
        icon: <AlertIcon />, color: '#e53935',
    },
    {
        id: 404, category: 'Events', type: 'recognition',
        title: 'Recognition Awarded',
        description: 'Excellent Customer Feedback (+10 Points)',
        time: '08:58 AM', date: 'Today', status: 'success',
        icon: <RecognitionIcon />, color: '#2e7d32',
    },
    {
        id: 502, category: 'Logs', type: 'break',
        title: 'Morning Break',
        description: '15 min break ended on time',
        time: '11:15 AM', date: 'Today', status: 'completed',
        icon: <LogIcon />, color: '#607d8b',
    },
    {
        id: 501, category: 'Logs', type: 'login',
        title: 'System Login',
        description: 'Logged in from Mobile App',
        time: '08:55 AM', date: 'Today', status: 'success',
        icon: <LogIcon />, color: '#607d8b',
    },

    // Yesterday
    {
        id: 201, category: 'Evaluations', type: 'evaluation',
        title: 'Call Quality Audit',
        description: 'Score: 92% — Excellent',
        time: '04:30 PM', date: 'Yesterday', status: 'reviewed',
        icon: <EvaluationIcon />, color: '#6a1b9a',
    },
    {
        id: 302, category: 'Alerts', type: 'alert',
        title: 'Adherence Warning',
        description: 'Out of adherence for > 15 mins',
        time: '01:45 PM', date: 'Yesterday', status: 'warning',
        icon: <AlertIcon />, color: '#e65100',
    },
    {
        id: 401, category: 'Events', type: 'disciplinary',
        title: 'Disciplinary Action',
        description: 'Severe customer mishandling (−15 Points)',
        time: '09:15 AM', date: 'Yesterday', status: 'warning',
        icon: <DisciplinaryIcon />, color: '#c62828',
    },
    {
        id: 102, category: 'Coaching', type: 'coaching',
        title: 'Coaching on Quality Score',
        description: 'Session scheduled with team lead',
        time: '02:00 PM', date: 'Yesterday', status: 'scheduled',
        icon: <CoachingIcon />, color: '#1565c0',
    },

    // Older
    {
        id: 202, category: 'Evaluations', type: 'evaluation',
        title: 'Email Etiquette Check',
        description: 'Score: 88% — Good',
        time: '11:15 AM', date: 'Oct 23, 2023', status: 'reviewed',
        icon: <EvaluationIcon />, color: '#6a1b9a',
    },
    {
        id: 403, category: 'Events', type: 'disciplinary',
        title: 'Security Compliance',
        description: 'Sharing account with others (−50 Points)',
        time: '04:00 PM', date: 'Oct 24, 2023', status: 'critical',
        icon: <DisciplinaryIcon />, color: '#c62828',
    },
];

// ============================================
// Status Config
// ============================================

const STATUS_CONFIG = {
    completed: { label: 'Completed', color: '#2e7d32', bg: '#e8f5e9' },
    success:   { label: 'Success',   color: '#2e7d32', bg: '#e8f5e9' },
    reviewed:  { label: 'Reviewed',  color: '#6a1b9a', bg: '#f3e5f5' },
    scheduled: { label: 'Scheduled', color: '#0277bd', bg: '#e1f5fe' },
    warning:   { label: 'Warning',   color: '#e65100', bg: '#fff3e0' },
    critical:  { label: 'Critical',  color: '#c62828', bg: '#ffebee' },
    rejected:  { label: 'Rejected',  color: '#c62828', bg: '#ffebee' },
};
const getStatusConfig = (status) =>
    STATUS_CONFIG[status] || { label: status, color: '#757575', bg: '#f5f5f5' };

// ============================================
// Component
// ============================================

const ActivitiesPage = ({ initialFilter = 'All' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState(initialFilter);
    const [selectedActivity, setSelectedActivity] = useState(null);

    const categories = ['All', 'Coaching', 'Evaluations', 'Alerts', 'Events', 'Logs'];

    useEffect(() => {
        setFilterCategory(initialFilter);
    }, [initialFilter]);

    const filteredActivities = activities.filter((a) => {
        const matchesSearch =
            a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || a.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Group by date — order is preserved from mock data
    const groupedActivities = filteredActivities.reduce((acc, a) => {
        if (!acc[a.date]) acc[a.date] = [];
        acc[a.date].push(a);
        return acc;
    }, {});

    return (
        <PageContainer>

            {/* ── Search Bar ─────────────────────────────── */}
            <SearchBar
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ fontSize: 18, color: '#9e9e9e' }} />
                        </InputAdornment>
                    ),
                    endAdornment: searchTerm ? (
                        <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setSearchTerm('')} edge="end">
                                <CloseIcon sx={{ fontSize: 16, color: '#9e9e9e' }} />
                            </IconButton>
                        </InputAdornment>
                    ) : null,
                }}
            />

            {/* ── Category Filter Chips ──────────────────── */}
            {/* IONIC MIGRATION: replace with IonSegment */}
            <ChipsRow>
                {categories.map((cat) => (
                    <FilterChip
                        key={cat}
                        label={cat}
                        isSelected={filterCategory === cat}
                        onClick={() => setFilterCategory(cat)}
                    />
                ))}
            </ChipsRow>

            {/* ── Activity Feed ──────────────────────────── */}
            {Object.keys(groupedActivities).length > 0 ? (
                Object.keys(groupedActivities).map((date) => (
                    <Box key={date}>
                        <DateHeader>{date}</DateHeader>

                        {groupedActivities[date].map((activity) => {
                            const sc = getStatusConfig(activity.status);
                            return (
                                <ActivityCard
                                    key={activity.id}
                                    accentColor={activity.color}
                                    onClick={() => setSelectedActivity(activity)}
                                >
                                    {/* Row 1: title + time */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                                        <Typography sx={{
                                            fontWeight: 700,
                                            fontSize: '0.925rem',
                                            color: '#1a1a1a',
                                            flex: 1,
                                            pr: 1,
                                            lineHeight: 1.3,
                                        }}>
                                            {activity.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.72rem', color: '#9e9e9e', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                            {activity.time}
                                        </Typography>
                                    </Box>

                                    {/* Row 2: description */}
                                    <Typography sx={{ fontSize: '0.82rem', color: '#666', mb: 1.25, lineHeight: 1.4 }}>
                                        {activity.description}
                                    </Typography>

                                    {/* Row 3: category chip + status chip */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Chip
                                            label={activity.category}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.68rem',
                                                fontWeight: 600,
                                                backgroundColor: `${activity.color}18`,
                                                color: activity.color,
                                                border: `1px solid ${activity.color}35`,
                                            }}
                                        />
                                        <Chip
                                            label={sc.label}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: '0.68rem',
                                                fontWeight: 700,
                                                backgroundColor: sc.bg,
                                                color: sc.color,
                                            }}
                                        />
                                    </Box>
                                </ActivityCard>
                            );
                        })}
                    </Box>
                ))
            ) : (
                <Box sx={{ textAlign: 'center', mt: 8, color: '#bdbdbd' }}>
                    <Typography variant="body2" fontWeight={500}>No activities found.</Typography>
                </Box>
            )}

            {/* ── Activity Detail Bottom Sheet ───────────── */}
            {/* IONIC MIGRATION: replace with IonModal */}
            <SwipeableDrawer
                anchor="bottom"
                open={Boolean(selectedActivity)}
                onClose={() => setSelectedActivity(null)}
                onOpen={() => {}}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        maxHeight: '85vh',
                        display: 'flex',
                        flexDirection: 'column',
                    }
                }}
            >
                {selectedActivity && (() => {
                    const sc = getStatusConfig(selectedActivity.status);
                    return (
                        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <DragHandle />

                            {/* Sheet nav header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 1.5 }}>
                                <Box sx={{ width: 40 }} />
                                <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>
                                        {selectedActivity.category}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                                        {selectedActivity.date} · {selectedActivity.time}
                                    </Typography>
                                </Box>
                                <IconButton size="small" onClick={() => setSelectedActivity(null)}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <Divider sx={{ borderColor: '#f0f0f0' }} />

                            {/* Scrollable body */}
                            <Box sx={{ overflowY: 'auto', flex: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

                                {/* Icon + title block */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{
                                        width: 52, height: 52, borderRadius: 3, flexShrink: 0,
                                        backgroundColor: `${selectedActivity.color}15`,
                                        color: selectedActivity.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        {React.cloneElement(selectedActivity.icon, { sx: { fontSize: 28 } })}
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2, color: '#1a1a1a' }}>
                                            {selectedActivity.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.25, color: '#666' }}>
                                            {selectedActivity.description}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Chips row */}
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Chip
                                        label={selectedActivity.category}
                                        size="small"
                                        sx={{
                                            backgroundColor: `${selectedActivity.color}15`,
                                            color: selectedActivity.color,
                                            fontWeight: 600,
                                            border: `1px solid ${selectedActivity.color}30`,
                                        }}
                                    />
                                    <Chip
                                        label={sc.label}
                                        size="small"
                                        sx={{
                                            backgroundColor: sc.bg,
                                            color: sc.color,
                                            fontWeight: 700,
                                        }}
                                    />
                                </Box>

                                {/* Details info box */}
                                <Paper elevation={0} sx={{
                                    borderRadius: '12px',
                                    backgroundColor: '#f9fafb',
                                    border: '1px solid #eef2f6',
                                    overflow: 'hidden',
                                }}>
                                    {[
                                        { label: 'Date', value: selectedActivity.date },
                                        { label: 'Time', value: selectedActivity.time },
                                        { label: 'Type', value: selectedActivity.type.charAt(0).toUpperCase() + selectedActivity.type.slice(1) },
                                    ].map((row, i, arr) => (
                                        <React.Fragment key={row.label}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, py: 1.5 }}>
                                                <Typography variant="body2" sx={{ color: '#9e9e9e', fontWeight: 500 }}>{row.label}</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>{row.value}</Typography>
                                            </Box>
                                            {i < arr.length - 1 && <Divider sx={{ borderColor: '#f0f0f0' }} />}
                                        </React.Fragment>
                                    ))}
                                </Paper>
                            </Box>
                        </Box>
                    );
                })()}
            </SwipeableDrawer>
        </PageContainer>
    );
};

export default ActivitiesPage;
