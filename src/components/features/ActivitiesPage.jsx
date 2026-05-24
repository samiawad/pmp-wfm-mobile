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
    Radio,
} from '@mui/material';
import {
    SearchOutlined as SearchIcon,
    EmojiEventsOutlined as RecognitionIcon,
    GavelOutlined as DisciplinaryIcon,
    Close as CloseIcon,
    SchoolOutlined as CoachingIcon,
    AssignmentOutlined as EvaluationIcon,
    NotificationImportantOutlined as AlertIcon,
    DescriptionOutlined as LogIcon,
    ChevronRight as ChevronRightIcon,
    FilterAltOutlined as FilterIcon,
    Check as CheckIcon,
    CategoryOutlined as CategoryIcon,
} from '@mui/icons-material';

// ============================================
// Styled Components
// ============================================

const PageContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#f5f5f5',
    width: '100%',
    padding: '0 16px',
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
    // borderLeft: `4px solid ${accentColor}`,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    padding: '14px 14px 12px 14px',
    marginBottom: 'var(--card-spacing)',
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
        id: 301, category: 'Alert', type: 'alert',
        title: 'Sudden Drop in Quality',
        description: 'Quality score dropped below 85%',
        time: '09:00 AM', date: 'Today', status: 'critical',
        icon: <AlertIcon />, color: '#e53935',
    },
    {
        id: 404, category: 'Event', type: 'recognition',
        title: 'Recognition Awarded',
        description: 'Excellent Customer Feedback (+10 Points)',
        time: '08:58 AM', date: 'Today', status: 'success',
        icon: <RecognitionIcon />, color: '#2e7d32',
    },
    {
        id: 502, category: 'Log', type: 'break',
        title: 'Morning Break',
        description: '15 min break ended on time',
        time: '11:15 AM', date: 'Today', status: 'completed',
        icon: <LogIcon />, color: '#607d8b',
    },
    {
        id: 501, category: 'Log', type: 'login',
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
    success: { label: 'Success', color: '#2e7d32', bg: '#e8f5e9' },
    reviewed: { label: 'Reviewed', color: '#6a1b9a', bg: '#f3e5f5' },
    scheduled: { label: 'Scheduled', color: '#0277bd', bg: '#e1f5fe' },
    warning: { label: 'Warning', color: '#e65100', bg: '#fff3e0' },
    critical: { label: 'Critical', color: '#c62828', bg: '#ffebee' },
    rejected: { label: 'Rejected', color: '#c62828', bg: '#ffebee' },
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
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
    const [draftCategory, setDraftCategory] = useState(initialFilter);

    const categories = ['All', 'Coaching', 'Evaluations', 'Alerts', 'Events', 'Logs'];

    // Badge count — 1 when a specific category is active, 0 when 'All'
    const activeFilterCount = filterCategory !== 'All' ? 1 : 0;

    const openFilterSheet = () => {
        setDraftCategory(filterCategory); // seed draft from committed state
        setIsFilterSheetOpen(true);
    };

    const applyFilters = () => {
        setFilterCategory(draftCategory);
        setIsFilterSheetOpen(false);
    };

    const resetFilters = () => {
        setDraftCategory('All');
    };

    const closeSheet = () => {
        setIsFilterSheetOpen(false); // discard draft — do NOT apply
    };

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
            {/* <SearchBar
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
            /> */}


            {/* ── Activity Feed ──────────────────────────── */}
            {Object.keys(groupedActivities).length > 0 ? (
                Object.keys(groupedActivities).map((date) => (
                    <Box key={date}>
                        <DateHeader>{date}</DateHeader>

                        {/* Single grouped container per date — rows stuck together */}
                        <Box sx={{
                            backgroundColor: '#ffffff',
                            borderRadius: 'var(--card-radius)',
                            overflow: 'hidden',
                        }}>
                            {groupedActivities[date].map((activity, index, arr) => (
                                <Box
                                    key={activity.id}
                                    onClick={() => setSelectedActivity(activity)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        px: 2,
                                        py: 1.5,
                                        cursor: 'pointer',
                                        borderBottom: index < arr.length - 1 ? '1px solid #f1f5f9' : 'none',
                                        '&:active': { backgroundColor: '#f8fafc' },
                                    }}
                                >
                                    {/* Time */}
                                    <Typography sx={{
                                        fontSize: '0.75rem',
                                        color: '#94a3b8',
                                        fontWeight: 500,
                                        minWidth: 68,
                                        flexShrink: 0,
                                    }}>
                                        {activity.time}
                                    </Typography>

                                    {/* Category */}
                                    <Typography sx={{
                                        flex: 1,
                                        fontSize: '0.875rem',
                                        // fontWeight: 600,
                                        color: '#1a1a1a',
                                    }}>
                                        {activity.category}
                                    </Typography>

                                    {/* Chevron */}
                                    <ChevronRightIcon sx={{ fontSize: '1.1rem', color: '#cbd5e1', flexShrink: 0 }} />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                ))
            ) : (
                <Box sx={{ textAlign: 'center', mt: 8, color: '#bdbdbd' }}>
                    <Typography variant="body2" fontWeight={500}>No activities found.</Typography>
                </Box>
            )}

            {/* ── Floating Filter Button ─────────────────── */}
            {/* IONIC MIGRATION: replace with <IonFab vertical="bottom" horizontal="end"> */}
            <Box
                onClick={openFilterSheet}
                sx={{
                    position: 'fixed',
                    bottom: 82,
                    right: 18,
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 200,
                    userSelect: 'none',
                    transition: 'transform 0.15s ease',
                    '&:active': { transform: 'scale(0.91)' },
                }}
            >
                <FilterIcon sx={{ color: '#fff', fontSize: '1.25rem' }} />

                {/* Active filter badge */}
                {activeFilterCount > 0 && (
                    <Box sx={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        minWidth: 18,
                        height: 18,
                        borderRadius: '9px',
                        backgroundColor: 'var(--secondary-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 0.5,
                        border: '2px solid #f5f5f5',
                    }}>
                        <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                            {activeFilterCount}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* ── Filter Bottom Sheet ────────────────────── */}
            {/* IONIC MIGRATION: replace with IonModal + sheet: true */}
            <SwipeableDrawer
                anchor="bottom"
                open={isFilterSheetOpen}
                onClose={closeSheet}
                onOpen={openFilterSheet}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        maxHeight: '82vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }
                }}
            >
                <DragHandle />

                {/* Sheet header */}
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2.5, pb: 1.5 }}>
                    <Typography sx={{ flexGrow: 1, fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                        Filters
                    </Typography>
                    <IconButton size="small" onClick={closeSheet} sx={{ color: '#64748b' }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Divider sx={{ borderColor: '#f1f5f9' }} />

                {/* Scrollable body */}
                <Box sx={{ overflowY: 'auto', px: 2.5, pt: 2.5, pb: 2, flex: 1 }}>

                    {/* ── Section: Category ── */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <CategoryIcon sx={{ fontSize: '0.95rem', color: '#94a3b8' }} />
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                            Category
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {categories.map((cat) => {
                            const isSelected = draftCategory === cat;
                            return (
                                <Box
                                    key={cat}
                                    onClick={() => setDraftCategory(cat)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        px: 1.5,
                                        py: 1.25,
                                        borderRadius: 'var(--card-radius)',
                                        cursor: 'pointer',
                                        backgroundColor: isSelected ? 'rgba(6,24,54,0.06)' : 'transparent',
                                        transition: 'background-color 0.12s ease',
                                        '&:active': { backgroundColor: '#e8edf2' },
                                    }}
                                >
                                    <Radio
                                        checked={isSelected}
                                        size="small"
                                        readOnly
                                        sx={{
                                            mr: 1.25, p: 0,
                                            color: '#cbd5e1',
                                            '&.Mui-checked': { color: 'var(--primary-color)' },
                                        }}
                                    />
                                    <Typography sx={{
                                        fontSize: '0.95rem',
                                        fontWeight: isSelected ? 700 : 500,
                                        color: isSelected ? 'var(--primary-color)' : '#334155',
                                        flexGrow: 1,
                                    }}>
                                        {cat}
                                    </Typography>
                                    {isSelected && (
                                        <CheckIcon sx={{ fontSize: '1rem', color: 'var(--primary-color)' }} />
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* ── Sticky footer — Reset + Apply ── */}
                <Box sx={{
                    borderTop: '1px solid #f1f5f9',
                    px: 2.5,
                    pt: 1.5,
                    pb: 'max(1.5rem, env(safe-area-inset-bottom))',
                    display: 'flex',
                    gap: 1.5,
                    backgroundColor: '#fff',
                }}>
                    {/* Reset */}
                    <Box
                        onClick={resetFilters}
                        sx={{
                            flex: 1,
                            height: 48,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 'var(--card-radius)',
                            border: '1.5px solid #e2e8f0',
                            backgroundColor: '#ffffff',
                            cursor: 'pointer',
                            userSelect: 'none',
                            transition: 'all 0.15s ease',
                            '&:active': { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' },
                        }}
                    >
                        <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#64748b' }}>
                            Reset
                        </Typography>
                    </Box>

                    {/* Apply */}
                    <Box
                        onClick={applyFilters}
                        sx={{
                            flex: 1,
                            height: 48,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 'var(--card-radius)',
                            border: '1.5px solid transparent',
                            backgroundColor: 'var(--primary-color)',
                            cursor: 'pointer',
                            userSelect: 'none',
                            transition: 'opacity 0.15s ease',
                            '&:active': { opacity: 0.82 },
                        }}
                    >
                        <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff' }}>
                            Apply
                        </Typography>
                    </Box>
                </Box>
            </SwipeableDrawer>

            {/* ── Activity Detail Bottom Sheet ───────────── */}
            {/* IONIC MIGRATION: replace with IonModal */}
            <SwipeableDrawer
                anchor="bottom"
                open={Boolean(selectedActivity)}
                onClose={() => setSelectedActivity(null)}
                onOpen={() => { }}
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
                                <Box sx={{ flex: 1 }}>
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
                            <Box sx={{ overflowY: 'auto', flex: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>

                                {/* Title + status dot */}
                                <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a', lineHeight: 1.3 }}>
                                        {selectedActivity.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.75 }}>
                                        <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: sc.color, flexShrink: 0 }} />
                                        <Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>
                                            {sc.label}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Details info box */}
                                <Paper elevation={0} sx={{
                                    borderRadius: 'var(--card-radius)',
                                    backgroundColor: '#f9fafb',
                                    border: '1px solid #eef2f6',
                                    overflow: 'hidden',
                                }}>
                                    {[
                                        { label: 'Date', value: selectedActivity.date },
                                        { label: 'Time', value: selectedActivity.time },
                                        { label: 'Type', value: selectedActivity.type.charAt(0).toUpperCase() + selectedActivity.type.slice(1) },
                                        ...(selectedActivity.description ? [{ label: 'Description', value: selectedActivity.description }] : []),
                                    ].map((row, i, arr) => (
                                        <React.Fragment key={row.label}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', px: 2, py: 1.5 }}>
                                                <Typography variant="body2" sx={{ color: '#9e9e9e', fontWeight: 500, flexShrink: 0 }}>{row.label}</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', textAlign: 'right', ml: 2 }}>{row.value}</Typography>
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
