import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    Snackbar,
    Alert,
    SwipeableDrawer,
    IconButton,
    Radio,
    Divider,
    Paper,
} from '@mui/material';
import {
    Schedule as TimeIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    FilterAlt as FilterIcon,
    ChevronRight as ChevronRightIcon,
    ViewAgenda as ViewIcon,
} from '@mui/icons-material';

// ============================================
// Styled Components
// ============================================

const PageContainer = styled(Box)(({ theme }) => ({
    padding: '0 16px',
    paddingBottom: theme.spacing(10),
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

const SheetHandle = styled(Box)({
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: '#d0d0d0', margin: '12px auto 8px',
});

const SectionLabel = styled(Typography)({
    fontSize: '0.72rem',
    fontWeight: 700,
    color: '#9e9e9e',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    paddingLeft: 2,
});

// ============================================
// Helpers
// ============================================

const getStatusColor = (status) => {
    if (status === 'Approved') return '#4caf50';
    if (status === 'Rejected') return '#f44336';
    return '#ff9800';
};

// ============================================
// Mock Data
// ============================================

const mockPendingDisputes = [
    {
        id: 1,
        kpiName: 'Schedule Adherence', reason: 'System Error',
        startDate: 'Feb 3', endDate: 'Feb 3',
        comment: 'System logged me out unexpectedly during shift.',
        created: '2 days ago', status: 'Pending',
    },
    {
        id: 2,
        kpiName: 'AHT', reason: 'Wrong Data',
        startDate: 'Jan 28', endDate: 'Jan 28',
        comment: 'AHT was recorded incorrectly — call dropped due to network issue.',
        created: '1 week ago', status: 'Pending',
    },
];

const mockDisputeHistory = [
    {
        id: 3,
        kpiName: 'Schedule Adherence', reason: 'System Error',
        startDate: 'May 10', endDate: 'May 12',
        comment: 'System logged me out unexpectedly during shift.',
        created: '1 month ago', status: 'Approved',
    },
    {
        id: 4,
        kpiName: 'FCR', reason: 'Call Misattribution',
        startDate: 'Apr 5', endDate: 'Apr 5',
        comment: 'Call was transferred to wrong queue and attributed to my scorecard.',
        created: '2 months ago', status: 'Rejected',
    },
    {
        id: 5,
        kpiName: 'Quality Score', reason: 'Evaluator Error',
        startDate: 'Mar 18', endDate: 'Mar 18',
        comment: 'Evaluation criteria were misapplied by evaluator.',
        created: '3 months ago', status: 'Approved',
    },
];

// ============================================
// Component
// ============================================

const DisputesPage = () => {
    const [viewMode, setViewMode] = useState('pending');
    const [draftViewMode, setDraftViewMode] = useState('pending');
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');

    const viewOptions = [
        { label: 'Pending', value: 'pending' },
        { label: 'History', value: 'history' },
    ];

    // Badge: 1 when not on the default (pending) view
    const activeFilterCount = viewMode !== 'pending' ? 1 : 0;

    const openFilterSheet = () => {
        setDraftViewMode(viewMode);
        setIsFilterSheetOpen(true);
    };

    const applyFilters = () => {
        setViewMode(draftViewMode);
        setIsFilterSheetOpen(false);
    };

    const resetFilters = () => setDraftViewMode('pending');
    const closeSheet = () => setIsFilterSheetOpen(false);

    const displayList = viewMode === 'pending' ? mockPendingDisputes : mockDisputeHistory;

    const renderRow = (item, index, arr) => (
        <Box
            key={item.id}
            onClick={() => setSelectedDispute(item)}
            sx={{
                display: 'flex', alignItems: 'center',
                px: 2, py: 1.5, cursor: 'pointer',
                borderBottom: index < arr.length - 1 ? '1px solid #f1f5f9' : 'none',
                '&:active': { backgroundColor: '#f8fafc' },
            }}
        >
            {/* Date */}
            <Typography sx={{
                fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500,
                minWidth: 68, flexShrink: 0,
            }}>
                {item.startDate}
            </Typography>

            {/* KPI name — more informative than "Dispute" repeated for every row */}
            <Typography sx={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: '#1a1a1a' }}>
                {item.kpiName}
            </Typography>

            {/* Status dot */}
            <Box sx={{
                width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                backgroundColor: getStatusColor(item.status), mr: 1.5,
            }} />

            {/* Chevron */}
            <ChevronRightIcon sx={{ fontSize: '1.1rem', color: '#cbd5e1', flexShrink: 0 }} />
        </Box>
    );

    return (
        <PageContainer>

            {/* ── Context label ── */}
            <SectionLabel>
                {viewMode === 'pending' ? 'Pending' : 'History'}
            </SectionLabel>

            {/* ── List ── */}
            {displayList.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, color: '#bbb' }}>
                    <TimeIcon sx={{ fontSize: 44, opacity: 0.25, mb: 1, display: 'block', mx: 'auto' }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {viewMode === 'pending' ? 'No pending disputes' : 'No dispute history'}
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ backgroundColor: '#ffffff', borderRadius: 'var(--card-radius)', overflow: 'hidden' }}>
                    {displayList.map((item, i, arr) => renderRow(item, i, arr))}
                </Box>
            )}

            {/* ── Floating Filter FAB ── */}
            {/* IONIC MIGRATION: replace with <IonFab vertical="bottom" horizontal="end"> */}
            <Box
                onClick={openFilterSheet}
                sx={{
                    position: 'fixed', bottom: 82, right: 18,
                    width: 52, height: 52, borderRadius: '50%',
                    backgroundColor: 'var(--primary-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 200, userSelect: 'none',
                    transition: 'transform 0.15s ease',
                    '&:active': { transform: 'scale(0.91)' },
                }}
            >
                <FilterIcon sx={{ color: '#fff', fontSize: '1.25rem' }} />
                {activeFilterCount > 0 && (
                    <Box sx={{
                        position: 'absolute', top: -5, right: -5,
                        minWidth: 18, height: 18, borderRadius: '9px',
                        backgroundColor: 'var(--secondary-color)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        px: 0.5, border: '2px solid #f5f5f5',
                    }}>
                        <Typography sx={{ fontSize: '0.6rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                            {activeFilterCount}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* ── Filter Bottom Sheet ── */}
            {/* IONIC MIGRATION: replace with IonModal + sheet: true */}
            <SwipeableDrawer
                anchor="bottom"
                open={isFilterSheetOpen}
                onClose={closeSheet}
                onOpen={openFilterSheet}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
                        maxHeight: '82vh', overflow: 'hidden',
                        display: 'flex', flexDirection: 'column',
                    }
                }}
            >
                <SheetHandle />

                <Box sx={{ display: 'flex', alignItems: 'center', px: 2.5, pb: 1.5 }}>
                    <Typography sx={{ flexGrow: 1, fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                        Filters
                    </Typography>
                    <IconButton size="small" onClick={closeSheet} sx={{ color: '#64748b' }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Divider sx={{ borderColor: '#f1f5f9' }} />

                <Box sx={{ overflowY: 'auto', px: 2.5, pt: 2.5, pb: 2, flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <ViewIcon sx={{ fontSize: '0.95rem', color: '#94a3b8' }} />
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                            View
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {viewOptions.map((opt) => {
                            const isSelected = draftViewMode === opt.value;
                            return (
                                <Box
                                    key={opt.value}
                                    onClick={() => setDraftViewMode(opt.value)}
                                    sx={{
                                        display: 'flex', alignItems: 'center',
                                        px: 1.5, py: 1.25, borderRadius: 'var(--card-radius)',
                                        cursor: 'pointer',
                                        backgroundColor: isSelected ? 'rgba(6,24,54,0.06)' : 'transparent',
                                        transition: 'background-color 0.12s ease',
                                        '&:active': { backgroundColor: '#e8edf2' },
                                    }}
                                >
                                    <Radio checked={isSelected} size="small" readOnly
                                        sx={{ mr: 1.25, p: 0, color: '#cbd5e1', '&.Mui-checked': { color: 'var(--primary-color)' } }}
                                    />
                                    <Typography sx={{
                                        fontSize: '0.95rem',
                                        fontWeight: isSelected ? 700 : 500,
                                        color: isSelected ? 'var(--primary-color)' : '#334155',
                                        flexGrow: 1,
                                    }}>
                                        {opt.label}
                                    </Typography>
                                    {isSelected && <CheckIcon sx={{ fontSize: '1rem', color: 'var(--primary-color)' }} />}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>

                {/* Sticky footer */}
                <Box sx={{
                    borderTop: '1px solid #f1f5f9', px: 2.5, pt: 1.5,
                    pb: 'max(1.5rem, env(safe-area-inset-bottom))',
                    display: 'flex', gap: 1.5, backgroundColor: '#fff',
                }}>
                    <Box onClick={resetFilters} sx={{
                        flex: 1, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 'var(--card-radius)', border: '1.5px solid #e2e8f0',
                        backgroundColor: '#ffffff', cursor: 'pointer', userSelect: 'none',
                        transition: 'all 0.15s ease', '&:active': { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' },
                    }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#64748b' }}>Reset</Typography>
                    </Box>
                    <Box onClick={applyFilters} sx={{
                        flex: 1, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 'var(--card-radius)', border: '1.5px solid transparent',
                        backgroundColor: 'var(--primary-color)', cursor: 'pointer', userSelect: 'none',
                        transition: 'opacity 0.15s ease', '&:active': { opacity: 0.82 },
                    }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff' }}>Apply</Typography>
                    </Box>
                </Box>
            </SwipeableDrawer>

            {/* ── Snackbar ── */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{ bottom: 80 }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled"
                    sx={{ borderRadius: '12px', fontWeight: 600 }}>
                    {snackbarMsg}
                </Alert>
            </Snackbar>

            {/* ── Dispute Detail Bottom Sheet ── */}
            {/* IONIC MIGRATION: replace with IonModal */}
            <SwipeableDrawer
                anchor="bottom"
                open={Boolean(selectedDispute)}
                onClose={() => setSelectedDispute(null)}
                onOpen={() => { }}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
                        maxHeight: '85vh', display: 'flex', flexDirection: 'column',
                    }
                }}
            >
                {selectedDispute && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <SheetHandle />

                        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 1.5 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>
                                    {selectedDispute.kpiName}
                                </Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                                    Dispute · {selectedDispute.reason}
                                </Typography>
                            </Box>
                            <IconButton size="small" onClick={() => setSelectedDispute(null)}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        <Divider sx={{ borderColor: '#f0f0f0' }} />

                        <Box sx={{ overflowY: 'auto', flex: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>

                            {/* Title + status dot */}
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a', lineHeight: 1.3 }}>
                                    {selectedDispute.kpiName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.75 }}>
                                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: getStatusColor(selectedDispute.status), flexShrink: 0 }} />
                                    <Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>
                                        {selectedDispute.status}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Info box — all details in one place */}
                            <Paper elevation={0} sx={{ borderRadius: 'var(--card-radius)', backgroundColor: '#f9fafb', border: '1px solid #eef2f6', overflow: 'hidden' }}>
                                {[
                                    {
                                        label: 'Period',
                                        value: selectedDispute.startDate === selectedDispute.endDate
                                            ? selectedDispute.startDate
                                            : `${selectedDispute.startDate} – ${selectedDispute.endDate}`,
                                    },
                                    { label: 'Submitted', value: selectedDispute.created },
                                    { label: 'Reason', value: selectedDispute.reason },
                                    { label: 'Comment', value: selectedDispute.comment },
                                ].map((row, i, arr) => (
                                    <React.Fragment key={row.label}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', px: 2, py: 1.5, gap: 2 }}>
                                            <Typography variant="body2" sx={{ color: '#9e9e9e', fontWeight: 500, flexShrink: 0 }}>{row.label}</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', textAlign: 'right' }}>{row.value}</Typography>
                                        </Box>
                                        {i < arr.length - 1 && <Divider sx={{ borderColor: '#f0f0f0' }} />}
                                    </React.Fragment>
                                ))}
                            </Paper>

                            {/* Cancel for pending */}
                            {/* {selectedDispute.status === 'Pending' && (
                                <Box
                                    sx={{
                                        height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        borderRadius: 'var(--card-radius)', border: '1.5px solid #f44336',
                                        backgroundColor: '#fff', cursor: 'pointer', userSelect: 'none',
                                        transition: 'all 0.15s ease', '&:active': { backgroundColor: '#ffebee' },
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#f44336' }}>
                                        Cancel Dispute
                                    </Typography>
                                </Box>
                            )} */}
                        </Box>
                    </Box>
                )}
            </SwipeableDrawer>

        </PageContainer>
    );
};

export default DisputesPage;
