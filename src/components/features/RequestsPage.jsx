import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    Button,
    Snackbar,
    Alert,
    SwipeableDrawer,
    IconButton,
    Radio,
    Divider,
    Paper,
} from '@mui/material';
import {
    BeachAccessOutlined as VacationIcon,
    SwapHorizOutlined as SwapIcon,
    PendingOutlined as PendingIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    FilterAltOutlined as FilterIcon,
    ChevronRight as ChevronRightIcon,
    ViewAgendaOutlined as ViewIcon,
    CategoryOutlined as CategoryIcon,
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

// Date section header — matches ActivitiesPage DateHeader
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

const getTypeColor = (iconType) => {
    switch (iconType) {
        case 'swap': case 'break': return 'var(--primary-color)';
        case 'vacation': case 'sick': return '#2e7d32';
        case 'dispute': return '#e53935';
        default: return 'var(--primary-color)';
    }
};

const getStatusColor = (status) => {
    if (status === 'Approved') return '#4caf50';
    if (status === 'Rejected') return '#f44336';
    return '#ff9800';
};

// ============================================
// Mock Data
// ============================================

const mockRequests = [
    {
        id: 1, type: 'Annual Leave', category: 'Time Off',
        fromDate: 'Jul 10', toDate: 'Jul 15', expiryDate: 'Aug 15',
        comment: 'Summer vacation with family', created: '2 days ago',
        status: 'Pending', iconType: 'vacation',
    },
    {
        id: 2, type: 'Shift Swap', category: 'Swap',
        date: 'Jun 28', swapWith: 'Ahmed Al-Sayed', expiryDate: 'Jul 5',
        comment: 'Family event in the evening', created: '1 week ago',
        status: 'Approved', iconType: 'swap',
    },
    {
        id: 3, type: 'Dispute', category: 'Dispute',
        kpiName: 'Schedule Adherence', reason: 'System Error',
        startDate: 'May 10', endDate: 'May 12',
        comment: 'System logged me out unexpectedly during shift.', created: '1 month ago',
        status: 'Approved', iconType: 'dispute',
    },
    {
        id: 4, type: 'Break Swap', category: 'Swap',
        date: 'May 05', swapWith: 'Sara Hassan', expiryDate: 'May 12',
        comment: 'Doctor appointment', created: '1 month ago',
        status: 'Rejected', iconType: 'break',
    },
];

const mockIncomingRequests = [
    { id: 101, type: 'Shift Swap', requester: 'Omar Jabri', date: 'Feb 19', details: 'Wants to swap 08:00 AM–04:00 PM for your 09:00 AM–05:00 PM', created: '30 min ago', status: 'Pending', iconType: 'swap' },
    { id: 102, type: 'Break Swap', requester: 'Sara Hassan', date: 'Feb 20', details: 'Wants to swap 12:00 PM–12:15 PM break for your 11:00 AM–11:15 AM break', created: '2 hours ago', status: 'Pending', iconType: 'break' },
    { id: 103, type: 'Day Off Swap', requester: 'Khaled Mansour', date: 'Feb 22', details: 'Wants to take your shift so you can have the day off', created: '1 day ago', status: 'Pending', iconType: 'swap' },
];

const mockHistoryRequests = [
    { id: 2, type: 'Shift Swap', category: 'Swap', direction: 'Outgoing', date: 'Jun 28', swapWith: 'Ahmed Al-Sayed', comment: 'Family event', created: '1 week ago', status: 'Approved', iconType: 'swap' },
    { id: 3, type: 'Dispute', category: 'Dispute', direction: 'Outgoing', kpiName: 'Schedule Adherence', reason: 'System Error', startDate: 'May 10', endDate: 'May 12', comment: 'System logged me out', created: '1 month ago', status: 'Approved', iconType: 'dispute' },
    { id: 4, type: 'Break Swap', category: 'Swap', direction: 'Outgoing', date: 'May 05', swapWith: 'Sara Hassan', comment: 'Doctor appointment', created: '1 month ago', status: 'Rejected', iconType: 'break' },
    { id: 201, type: 'Shift Swap', category: 'Swap', direction: 'Incoming', date: 'Feb 15', swapWith: 'Omar Jabri', status: 'Approved', iconType: 'swap', created: '3 days ago' },
    { id: 202, type: 'Shift Swap', category: 'Swap', direction: 'Incoming', date: 'Jan 20', swapWith: 'Layla Ahmed', status: 'Rejected', iconType: 'swap', created: '1 month ago' },
];

// ============================================
// Main Component
// ============================================

const RequestsPage = ({ defaultTab = 0 }) => {
    const initialViewMode = defaultTab === 3 ? 'incoming' : 'pending';
    const initialTabValue = defaultTab === 3 ? 0 : defaultTab;

    const [viewMode, setViewMode] = useState(initialViewMode);
    const [tabValue, setTabValue] = useState(initialTabValue);

    // Draft state — only committed on Apply
    const [draftViewMode, setDraftViewMode] = useState(initialViewMode);
    const [draftTabValue, setDraftTabValue] = useState(initialTabValue);
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

    const [requests, setRequests] = useState([]);
    const [historyRequests] = useState(mockHistoryRequests);
    const [incomingRequests, setIncomingRequests] = useState(mockIncomingRequests);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);

    const filterOptions = [
        { label: 'All', value: 0 },
        { label: 'Vacations', value: 1 },
        { label: 'Swaps', value: 2 },
    ];

    const viewOptions = [
        { label: 'Pending', value: 'pending' },
        { label: 'Incoming', value: 'incoming' },
        { label: 'History', value: 'history' },
    ];

    // Badge: count of non-default active filters
    const activeFilterCount = [viewMode !== 'pending', tabValue !== 0].filter(Boolean).length;

    const openFilterSheet = () => {
        setDraftViewMode(viewMode);
        setDraftTabValue(tabValue);
        setIsFilterSheetOpen(true);
    };

    const applyFilters = () => {
        setViewMode(draftViewMode);
        setTabValue(draftTabValue);
        setIsFilterSheetOpen(false);
    };

    const resetFilters = () => {
        setDraftViewMode('pending');
        setDraftTabValue(0);
    };

    const closeSheet = () => setIsFilterSheetOpen(false);

    React.useEffect(() => {
        if (defaultTab === 3) {
            setViewMode('incoming');
            setTabValue(0);
        } else {
            setTabValue(defaultTab);
            if (viewMode === 'incoming') setViewMode('pending');
        }
    }, [defaultTab]);

    React.useEffect(() => {
        try {
            const storedRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
            const needsRefresh = storedRequests.length === 0 || !storedRequests[0].iconType ||
                storedRequests.some(r => r.category !== 'Dispute' && r.expiryDate === undefined);
            if (needsRefresh) {
                localStorage.setItem('userRequests', JSON.stringify(mockRequests));
                setRequests(mockRequests);
            } else {
                setRequests(storedRequests.reverse());
            }
        } catch (e) {
            setRequests(mockRequests);
        }
    }, []);

    const getIconByType = (iconType) => {
        switch (iconType) {
            case 'vacation': case 'sick': return <VacationIcon />;
            case 'swap': case 'break': return <SwapIcon />;
            case 'dispute': return <TimeIcon />;
            default: return <VacationIcon />;
        }
    };

    const getSourceRequests = () => {
        if (viewMode === 'pending') return requests.filter(r => r.status === 'Pending');
        if (viewMode === 'history') return historyRequests;
        return [];
    };

    const sourceRequests = getSourceRequests();
    const filteredRequests = sourceRequests.filter(req => {
        if (tabValue === 0) return true;
        if (tabValue === 1) return req.category === 'Time Off';
        if (tabValue === 2) return req.category === 'Swap';
        if (tabValue === 4) return req.category === 'Dispute';
        return true;
    });

    const handleIncomingAction = (id, action) => {
        setIncomingRequests(prev =>
            prev.map(req => req.id === id ? { ...req, status: action === 'accept' ? 'Approved' : 'Rejected' } : req)
        );
        setSnackbarMsg(action === 'accept' ? 'Swap request accepted!' : 'Swap request rejected.');
        setSnackbarOpen(true);
        setSelectedRequest(null);
    };

    const pendingIncomingCount = incomingRequests.filter(r => r.status === 'Pending').length;
    const isIncomingTab = viewMode === 'incoming';

    // Context label above list
    const contextLabel = viewMode === 'pending'
        ? 'Pending'
        : viewMode === 'incoming'
            ? `Incoming${pendingIncomingCount > 0 ? ` · ${pendingIncomingCount} new` : ''}`
            : 'History';
    const categoryLabel = filterOptions.find(o => o.value === tabValue)?.label;

    // Minimalist list row — shared between all views
    const renderRow = (req, index, arr, extra = null) => (
        <Box
            key={req.id}
            onClick={() => setSelectedRequest(req)}
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
                {req.fromDate || req.date || req.startDate}
            </Typography>

            {/* Type + optional sub-label (e.g. requester) */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1a1a1a', lineHeight: 1.3 }}>
                    {req.type}
                </Typography>
                {extra && (
                    <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.3 }}>
                        {extra}
                    </Typography>
                )}
            </Box>

            {/* Direction badge for history */}
            {req.direction && (
                <Typography sx={{
                    fontSize: '0.65rem', fontWeight: 700, mr: 1.25, flexShrink: 0,
                    color: req.direction === 'Incoming' ? 'var(--primary-color)' : '#94a3b8',
                }}>
                    {req.direction}
                </Typography>
            )}

            {/* Status dot */}
            <Box sx={{
                width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                backgroundColor: getStatusColor(req.status), mr: 1.5,
            }} />

            {/* Chevron */}
            <ChevronRightIcon sx={{ fontSize: '1.1rem', color: '#cbd5e1', flexShrink: 0 }} />
        </Box>
    );

    return (
        <PageContainer>

            {/* ── Context label ── */}
            <SectionLabel>
                {contextLabel}
                {viewMode !== 'incoming' && tabValue !== 0 && ` · ${categoryLabel}`}
            </SectionLabel>

            {/* ── Pending ── */}
            {viewMode === 'pending' && (
                filteredRequests.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8, color: '#bbb' }}>
                        <PendingIcon sx={{ fontSize: 44, opacity: 0.25, mb: 1, display: 'block', mx: 'auto' }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>No pending requests</Typography>
                    </Box>
                ) : (
                    <Box sx={{ backgroundColor: '#ffffff', borderRadius: 'var(--card-radius)', overflow: 'hidden' }}>
                        {filteredRequests.map((req, i, arr) => renderRow(req, i, arr))}
                    </Box>
                )
            )}

            {/* ── Incoming ── */}
            {viewMode === 'incoming' && (
                incomingRequests.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8, color: '#bbb' }}>
                        <SwapIcon sx={{ fontSize: 44, opacity: 0.25, mb: 1, display: 'block', mx: 'auto' }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>No incoming requests</Typography>
                    </Box>
                ) : (
                    <Box sx={{ backgroundColor: '#ffffff', borderRadius: 'var(--card-radius)', overflow: 'hidden' }}>
                        {incomingRequests.map((req, i, arr) => renderRow(req, i, arr, req.requester))}
                    </Box>
                )
            )}

            {/* ── History ── */}
            {viewMode === 'history' && (
                filteredRequests.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8, color: '#bbb' }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>No requests found</Typography>
                    </Box>
                ) : (
                    <Box sx={{ backgroundColor: '#ffffff', borderRadius: 'var(--card-radius)', overflow: 'hidden' }}>
                        {filteredRequests.map((req, i, arr) => renderRow(req, i, arr))}
                    </Box>
                )
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

                {/* Header */}
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

                    {/* ── Section: View ── */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <ViewIcon sx={{ fontSize: '0.95rem', color: '#94a3b8' }} />
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                            View
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 3 }}>
                        {viewOptions.map((opt) => {
                            const isSelected = draftViewMode === opt.value;
                            return (
                                <Box
                                    key={opt.value}
                                    onClick={() => {
                                        setDraftViewMode(opt.value);
                                        if (opt.value === 'incoming') setDraftTabValue(2); // Swaps only for incoming
                                        else if (draftViewMode === 'incoming') setDraftTabValue(0); // restore All when leaving incoming
                                    }}
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
                                        {opt.value === 'incoming' && pendingIncomingCount > 0 && (
                                            <Box component="span" sx={{
                                                ml: 1, px: 0.75, py: 0.15,
                                                backgroundColor: '#f44336', color: '#fff',
                                                borderRadius: '10px', fontSize: '0.6rem', fontWeight: 800,
                                                display: 'inline-flex', alignItems: 'center',
                                            }}>
                                                {pendingIncomingCount}
                                            </Box>
                                        )}
                                    </Typography>
                                    {isSelected && <CheckIcon sx={{ fontSize: '1rem', color: 'var(--primary-color)' }} />}
                                </Box>
                            );
                        })}
                    </Box>

                    <Divider sx={{ borderColor: '#f1f5f9', mb: 3 }} />

                    {/* ── Section: Category ── */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <CategoryIcon sx={{ fontSize: '0.95rem', color: '#94a3b8' }} />
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                            Category
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, opacity: draftViewMode === 'incoming' ? 0.4 : 1, transition: 'opacity 0.15s ease' }}>
                        {filterOptions.map((opt) => {
                            const isSelected = draftTabValue === opt.value;
                            const disabled = draftViewMode === 'incoming';
                            return (
                                <Box
                                    key={opt.value}
                                    onClick={() => !disabled && setDraftTabValue(opt.value)}
                                    sx={{
                                        display: 'flex', alignItems: 'center',
                                        px: 1.5, py: 1.25, borderRadius: 'var(--card-radius)',
                                        cursor: disabled ? 'default' : 'pointer',
                                        backgroundColor: isSelected && !disabled ? 'rgba(6,24,54,0.06)' : 'transparent',
                                        transition: 'background-color 0.12s ease',
                                        '&:active': disabled ? {} : { backgroundColor: '#e8edf2' },
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

                {/* Sticky footer — Reset + Apply */}
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

            {/* ── Request Detail Bottom Sheet ── */}
            {/* IONIC MIGRATION: replace with IonModal */}
            <SwipeableDrawer
                anchor="bottom"
                open={Boolean(selectedRequest)}
                onClose={() => setSelectedRequest(null)}
                onOpen={() => { }}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
                        maxHeight: '85vh', display: 'flex', flexDirection: 'column',
                    }
                }}
            >
                {selectedRequest && (() => {
                    const typeColor = getTypeColor(selectedRequest.iconType);
                    const isIncoming = incomingRequests.some(r => r.id === selectedRequest.id);
                    return (
                        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <SheetHandle />

                            {/* Header */}
                            <Box sx={{ display: 'flex', alignItems: 'center', px: 2, pb: 1.5 }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>
                                        {selectedRequest.type}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.75rem', color: '#888' }}>
                                        {selectedRequest.fromDate || selectedRequest.date || selectedRequest.startDate}
                                    </Typography>
                                </Box>
                                <IconButton size="small" onClick={() => setSelectedRequest(null)}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                            <Divider sx={{ borderColor: '#f0f0f0' }} />

                            {/* Scrollable content */}
                            <Box sx={{ overflowY: 'auto', flex: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>

                                {/* Title + status dot */}
                                <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a', lineHeight: 1.3 }}>
                                        {selectedRequest.type}
                                    </Typography>
                                    {isIncoming && (
                                        <Typography sx={{ fontSize: '0.82rem', color: '#64748b', mt: 0.25 }}>
                                            From {selectedRequest.requester}
                                        </Typography>
                                    )}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.75 }}>
                                        <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: getStatusColor(selectedRequest.status), flexShrink: 0 }} />
                                        <Typography sx={{ fontSize: '0.78rem', color: '#64748b' }}>
                                            {selectedRequest.status}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Info box — all details in one place */}
                                <Paper elevation={0} sx={{ borderRadius: 'var(--card-radius)', backgroundColor: '#f9fafb', border: '1px solid #eef2f6', overflow: 'hidden' }}>
                                    {[
                                        {
                                            label: 'Date',
                                            value: selectedRequest.fromDate
                                                ? `${selectedRequest.fromDate} – ${selectedRequest.toDate}`
                                                : (selectedRequest.date || 'N/A'),
                                        },
                                        { label: 'Submitted', value: selectedRequest.created },
                                        ...(selectedRequest.expiryDate ? [{ label: 'Expiry', value: selectedRequest.expiryDate }] : []),
                                        ...(selectedRequest.swapWith ? [{ label: 'Swap with', value: selectedRequest.swapWith }] : []),
                                        ...(selectedRequest.kpiName ? [{ label: 'KPI', value: selectedRequest.kpiName }] : []),
                                        ...(selectedRequest.comment || selectedRequest.reason || selectedRequest.details
                                            ? [{ label: 'Details', value: selectedRequest.comment || selectedRequest.reason || selectedRequest.details }]
                                            : []),
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

                                {/* Accept / Reject for incoming pending */}
                                {isIncoming && selectedRequest.status === 'Pending' && (
                                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                                        <Box
                                            onClick={() => handleIncomingAction(selectedRequest.id, 'accept')}
                                            sx={{
                                                flex: 1, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75,
                                                borderRadius: 'var(--card-radius)', backgroundColor: '#4caf50',
                                                cursor: 'pointer', userSelect: 'none',
                                                transition: 'opacity 0.15s ease', '&:active': { opacity: 0.82 },
                                            }}
                                        >
                                            <CheckIcon sx={{ fontSize: '1rem', color: '#fff' }} />
                                            <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>Accept</Typography>
                                        </Box>
                                        <Box
                                            onClick={() => handleIncomingAction(selectedRequest.id, 'reject')}
                                            sx={{
                                                flex: 1, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75,
                                                borderRadius: 'var(--card-radius)', border: '1.5px solid #f44336',
                                                backgroundColor: '#fff', cursor: 'pointer', userSelect: 'none',
                                                transition: 'all 0.15s ease', '&:active': { backgroundColor: '#ffebee' },
                                            }}
                                        >
                                            <CloseIcon sx={{ fontSize: '1rem', color: '#f44336' }} />
                                            <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#f44336' }}>Reject</Typography>
                                        </Box>
                                    </Box>
                                )}

                                {/* Cancel for own pending */}
                                {selectedRequest.status === 'Pending' && !isIncoming && (
                                    <Box
                                        sx={{
                                            height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            borderRadius: 'var(--card-radius)', border: '1.5px solid #f44336',
                                            backgroundColor: '#fff', cursor: 'pointer', userSelect: 'none',
                                            transition: 'all 0.15s ease', '&:active': { backgroundColor: '#ffebee' },
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 700, fontSize: '0.92rem', color: '#f44336' }}>Cancel Request</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    );
                })()}
            </SwipeableDrawer>

        </PageContainer>
    );
};

export default RequestsPage;
