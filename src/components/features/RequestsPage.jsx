import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Button,
    Snackbar,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    SwipeableDrawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    Radio,
} from '@mui/material';
import {
    BeachAccess as VacationIcon,
    SwapHoriz as SwapIcon,
    Schedule as TimeIcon,
    CheckCircle as ApprovedIcon,
    Cancel as RejectedIcon,
    Pending as PendingIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    ExpandMore as DropdownIcon,
    RadioButtonUnchecked as RadioUncheckedIcon,
    RadioButtonChecked as RadioCheckedIcon,
} from '@mui/icons-material';

// ============================================
// Styled Components
// ============================================

const PageContainer = styled(Box)(({ theme }) => ({
    padding: '16px',
    paddingBottom: theme.spacing(4),
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
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
    color: '#1a1a1a',
    whiteSpace: 'nowrap',
    flexShrink: 0,
});

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

const RequestCard = styled(Card)(({ theme, $statusColor }) => ({
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f0f0f0',
    marginBottom: theme.spacing(1.5),
    overflow: 'visible',
    position: 'relative',
    '&:active': {
        transform: 'scale(0.98)',
        transition: 'transform 0.1s ease',
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 16,
        bottom: 16,
        width: 4,
        borderRadius: '0 4px 4px 0',
        backgroundColor: $statusColor || theme.palette.primary.main,
    }
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
    let bgcolor, color;
    switch (status) {
        case 'Approved':
            bgcolor = '#e8f5e9';
            color = '#2e7d32';
            break;
        case 'Rejected':
            bgcolor = '#ffebee';
            color = '#c62828';
            break;
        default:
            bgcolor = '#fff3e0';
            color = '#ef6c00';
    }
    return {
        backgroundColor: bgcolor,
        color: color,
        fontWeight: 700,
        borderRadius: '8px',
    };
});

// ============================================
// Mock Data
// ============================================

const mockRequests = [
    {
        id: 1, type: 'Annual Leave', category: 'Time Off',
        fromDate: 'Jul 10', toDate: 'Jul 15',
        comment: 'Summer vacation with family', created: '2 days ago',
        status: 'Pending', iconType: 'vacation'
    },
    {
        id: 2, type: 'Shift Swap', category: 'Swap',
        date: 'Jun 28', swapWith: 'Ahmed Al-Sayed',
        comment: 'Family event in the evening', created: '1 week ago',
        status: 'Approved', iconType: 'swap'
    },
    {
        id: 3, type: 'Dispute', category: 'Dispute',
        kpiName: 'Schedule Adherence', reason: 'System Error',
        startDate: 'May 10', endDate: 'May 12',
        comment: 'System logged me out unexpectedly during shift.', created: '1 month ago',
        status: 'Approved', iconType: 'dispute'
    },
    {
        id: 4, type: 'Break Swap', category: 'Swap',
        date: 'May 05', swapWith: 'Sara Hassan',
        comment: 'Doctor appointment', created: '1 month ago',
        status: 'Rejected', iconType: 'break'
    },
];

const mockIncomingRequests = [
    { id: 101, type: 'Shift Swap', requester: 'Omar Jabri', date: 'Feb 19', details: 'Wants to swap 08:00 AM-04:00 PM for your 09:00 AM-05:00 PM', created: '30 min ago', status: 'Pending', iconType: 'swap' },
    { id: 102, type: 'Break Swap', requester: 'Sara Hassan', date: 'Feb 20', details: 'Wants to swap 12:00 PM-12:15 PM break for your 11:00 AM-11:15 AM break', created: '2 hours ago', status: 'Pending', iconType: 'break' },
    { id: 103, type: 'Day Off Swap', requester: 'Khaled Mansour', date: 'Feb 22', details: 'Wants to take your shift so you can have the day off', created: '1 day ago', status: 'Pending', iconType: 'swap' },
];

const mockHistoryRequests = [
    { id: 2, type: 'Shift Swap', category: 'Swap', direction: 'Outgoing', date: 'Jun 28', swapWith: 'Ahmed Al-Sayed', comment: 'Family event', created: '1 week ago', status: 'Approved', iconType: 'swap' },
    { id: 3, type: 'Dispute', category: 'Dispute', direction: 'Outgoing', kpiName: 'Schedule Adherence', reason: 'System Error', startDate: 'May 10', endDate: 'May 12', comment: 'System logged me out', created: '1 month ago', status: 'Approved', iconType: 'dispute' },
    { id: 4, type: 'Break Swap', category: 'Swap', direction: 'Outgoing', date: 'May 05', swapWith: 'Sara Hassan', comment: 'Doctor appointment', created: '1 month ago', status: 'Rejected', iconType: 'break' },
    { id: 201, type: 'Shift Swap', category: 'Swap', direction: 'Incoming', date: 'Feb 15', swapWith: 'Omar Jabri', status: 'Approved', iconType: 'swap', created: '3 days ago' },
    { id: 202, type: 'Shift Swap', category: 'Swap', direction: 'Incoming', date: 'Jan 20', swapWith: 'Layla Ahmed', status: 'Rejected', iconType: 'swap', created: '1 month ago' },
];

const TogglePill = styled(Box)(({ active }) => ({
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    backgroundColor: active ? undefined : '#fff',
    background: active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined,
    color: active ? '#fff' : '#666',
    border: active ? 'none' : '1px solid #e0e0e0',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    '&:hover': {
        opacity: 0.9,
        backgroundColor: active ? undefined : '#f5f5f5',
    },
}));

const DragHandle = styled(Box)({
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d0d0d0',
    margin: '12px auto 8px',
});

const RequestsPage = ({ defaultTab = 0 }) => {

    const [viewMode, setViewMode] = useState(defaultTab === 3 ? 'incoming' : 'pending'); // 'pending' | 'incoming' | 'history'
    const [tabValue, setTabValue] = useState(defaultTab === 3 ? 0 : defaultTab); // Reset if it was incoming

    React.useEffect(() => {
        if (defaultTab === 3) {
            setViewMode('incoming');
            setTabValue(0);
        } else {
            setTabValue(defaultTab);
            // Optionally reset viewMode if navigating away from incoming, but 'pending' is safe default behavior for other tabs
            if (viewMode === 'incoming') setViewMode('pending');
        }
    }, [defaultTab]);
    const [requests, setRequests] = useState([]);
    const [historyRequests, setHistoryRequests] = useState(mockHistoryRequests);
    const [incomingRequests, setIncomingRequests] = useState(mockIncomingRequests);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const filterOptions = [
        { label: 'All', value: 0 },
        { label: 'Vacations', value: 1 },
        { label: 'Swaps', value: 2 },
        { label: 'Disputes', value: 4 },
    ];

    const currentFilterLabel = filterOptions.find(opt => opt.value === tabValue)?.label || 'All';

    React.useEffect(() => {
        try {
            const storedRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
            if (storedRequests.length === 0 || !storedRequests[0].iconType) {
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
            case 'vacation': return <VacationIcon />;
            case 'sick': return <VacationIcon />;
            case 'swap': return <SwapIcon />;
            case 'break': return <SwapIcon />;
            case 'dispute': return <TimeIcon />; // Using TimeIcon for dispute for now
            default: return <VacationIcon />;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved': return <ApprovedIcon fontSize="small" />;
            case 'Rejected': return <RejectedIcon fontSize="small" />;
            default: return <PendingIcon fontSize="small" />;
        }
    };



    // Filter logic
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
    };

    const isIncomingTab = viewMode === 'incoming';

    return (
        <PageContainer>

            {/* Title + Filter Dropdown + View Toggles */}
            <FilterRow>
                <PageTitle>Requests</PageTitle>

                {viewMode === 'history' || viewMode === 'pending' ? (
                    <DropdownTrigger onClick={() => setIsFilterSheetOpen(true)}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {currentFilterLabel}
                        </Box>
                        <DropdownIcon sx={{ fontSize: '1.2rem', color: '#757575' }} />
                    </DropdownTrigger>
                ) : (
                    <DropdownTrigger sx={{ cursor: 'default', backgroundColor: '#f5f5f5', color: '#888', borderColor: '#e0e0e0' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            Swaps
                        </Box>
                    </DropdownTrigger>
                )}

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TogglePill
                        active={viewMode === 'pending' ? 1 : 0}
                        onClick={() => setViewMode('pending')}
                    >
                        Pending
                    </TogglePill>
                    <TogglePill
                        active={viewMode === 'incoming' ? 1 : 0}
                        onClick={() => setViewMode('incoming')}
                    >
                        Incoming
                        {incomingRequests.filter(r => r.status === 'Pending').length > 0 && (
                            <Box sx={{
                                minWidth: 16,
                                height: 16,
                                borderRadius: '8px',
                                backgroundColor: '#f44336',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.6rem',
                                fontWeight: 700,
                                px: 0.5,
                                lineHeight: 0,
                            }}>
                                {incomingRequests.filter(r => r.status === 'Pending').length}
                            </Box>
                        )}
                    </TogglePill>
                    <TogglePill
                        active={viewMode === 'history' ? 1 : 0}
                        onClick={() => setViewMode('history')}
                    >
                        History
                    </TogglePill>
                </Box>
            </FilterRow>



            {/* Pending Requests (Card View) */}
            {
                viewMode === 'pending' && (
                    <Box>
                        {filteredRequests.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 6, color: '#aaa' }}>
                                <PendingIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                                <Typography sx={{ fontWeight: 600 }}>No pending requests</Typography>
                            </Box>
                        ) : (
                            filteredRequests.map((req) => (
                                <RequestCard
                                    key={req.id}
                                    $statusColor={'#ff9800'} // Orange for Pending
                                    onClick={() => setSelectedRequest(req)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Box
                                                sx={{
                                                    mr: 2,
                                                    p: 1.5,
                                                    borderRadius: '12px',
                                                    bgcolor: req.category === 'Swap' ? '#e3f2fd' : '#f3e5f5',
                                                    color: req.category === 'Swap' ? '#2196f3' : '#9c27b0',
                                                }}
                                            >
                                                {getIconByType(req.iconType)}
                                            </Box>

                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="subtitle1" fontWeight={700}>
                                                    {req.type}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                    {req.fromDate ? `${req.fromDate} - ${req.toDate}` : req.date}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                                                <StatusChip
                                                    label={req.status}
                                                    size="small"
                                                    status={req.status}
                                                    icon={getStatusIcon(req.status)}
                                                />
                                                <Typography variant="caption" color="text.disabled">
                                                    {req.created}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {(req.comment || req.details) && (
                                            <Box sx={{
                                                p: 1.5,
                                                borderRadius: '10px',
                                                backgroundColor: '#f8f9fa',
                                                border: '1px solid #e9ecef',
                                            }}>
                                                <Typography sx={{ fontSize: '0.8rem', color: '#555' }}>
                                                    {req.comment || req.details}
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </RequestCard>
                            ))
                        )}
                    </Box>
                )
            }

            {/* History (Table View) */}
            {
                viewMode === 'history' && (
                    <Box sx={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        {filteredRequests.length > 0 ? (
                            <Table sx={{ minWidth: 500 }}>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Type</TableCell>
                                        {viewMode === 'history' && (
                                            <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Direction</TableCell>
                                        )}
                                        <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Details</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 700, fontSize: '0.85rem' }} align="right">Created</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredRequests.map((req) => (
                                        <TableRow
                                            key={req.id}
                                            hover
                                            onClick={() => setSelectedRequest(req)}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box
                                                        sx={{
                                                            p: 0.8,
                                                            borderRadius: '8px',
                                                            bgcolor: req.category === 'Swap' ? '#e3f2fd' : '#f3e5f5',
                                                            color: req.category === 'Swap' ? '#2196f3' : '#9c27b0',
                                                            display: 'flex'
                                                        }}
                                                    >
                                                        {React.cloneElement(getIconByType(req.iconType), { sx: { fontSize: 18 } })}
                                                    </Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{req.type}</Typography>
                                                </Box>
                                            </TableCell>
                                            {viewMode === 'history' && (
                                                <TableCell>
                                                    <Chip
                                                        label={req.direction}
                                                        size="small"
                                                        sx={{
                                                            height: 20,
                                                            fontSize: '0.65rem',
                                                            backgroundColor: req.direction === 'Incoming' ? '#e3f2fd' : '#f5f5f5',
                                                            color: req.direction === 'Incoming' ? '#1565c0' : '#616161',
                                                            fontWeight: 600
                                                        }}
                                                    />
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        {req.fromDate ? `${req.fromDate} - ${req.toDate}` : req.date || (req.startDate && `${req.startDate} - ${req.endDate}`)}
                                                    </Typography>
                                                    {req.category === 'Swap' && req.swapWith && (
                                                        <Typography variant="caption" sx={{ color: '#666' }}>W/ {req.swapWith}</Typography>
                                                    )}
                                                    {req.category === 'Dispute' && (
                                                        <Typography variant="caption" sx={{ color: '#666' }}>{req.kpiName}</Typography>
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <StatusChip
                                                    label={req.status}
                                                    size="small"
                                                    status={req.status}
                                                    icon={getStatusIcon(req.status)}
                                                    sx={{ height: 24, fontSize: '0.65rem' }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="caption" color="text.disabled">{req.created}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 6, color: '#aaa' }}>
                                <Typography sx={{ fontWeight: 600 }}>No requests found</Typography>
                            </Box>
                        )}
                    </Box>
                )
            }

            {/* Incoming Requests */}
            {
                viewMode === 'incoming' && (
                    <Box>
                        {incomingRequests.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 6, color: '#aaa' }}>
                                <SwapIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
                                <Typography sx={{ fontWeight: 600 }}>No incoming requests</Typography>
                            </Box>
                        ) : (
                            incomingRequests.map((req) => (
                                <RequestCard
                                    key={req.id}
                                    $statusColor={req.status === 'Approved' ? '#4caf50' : req.status === 'Rejected' ? '#f44336' : '#2196f3'}
                                >
                                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <Box
                                                sx={{
                                                    mr: 2,
                                                    p: 1.5,
                                                    borderRadius: '12px',
                                                    bgcolor: '#e3f2fd',
                                                    color: '#2196f3',
                                                }}
                                            >
                                                {getIconByType(req.iconType)}
                                            </Box>

                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="subtitle1" fontWeight={700}>
                                                    {req.type}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                    From <strong>{req.requester}</strong> - {req.date}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                                                <StatusChip
                                                    label={req.status}
                                                    size="small"
                                                    status={req.status}
                                                    icon={getStatusIcon(req.status)}
                                                />
                                                <Typography variant="caption" color="text.disabled">
                                                    {req.created}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Swap details */}
                                        <Box sx={{
                                            p: 1.5,
                                            borderRadius: '10px',
                                            backgroundColor: '#f8f9fa',
                                            border: '1px solid #e9ecef',
                                            mb: req.status === 'Pending' ? 1.5 : 0,
                                        }}>
                                            <Typography sx={{ fontSize: '0.8rem', color: '#555' }}>
                                                {req.details}
                                            </Typography>
                                        </Box>

                                        {/* Accept / Reject buttons */}
                                        {req.status === 'Pending' && (
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    variant="contained"
                                                    fullWidth
                                                    startIcon={<CheckIcon />}
                                                    onClick={() => handleIncomingAction(req.id, 'accept')}
                                                    sx={{
                                                        borderRadius: '10px',
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        fontSize: '0.8rem',
                                                        py: 0.8,
                                                        background: 'linear-gradient(135deg, #4caf50, #43a047)',
                                                        boxShadow: '0 2px 8px rgba(76,175,80,0.3)',
                                                    }}
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    fullWidth
                                                    startIcon={<CloseIcon />}
                                                    onClick={() => handleIncomingAction(req.id, 'reject')}
                                                    sx={{
                                                        borderRadius: '10px',
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        fontSize: '0.8rem',
                                                        py: 0.8,
                                                        borderColor: '#f44336',
                                                        color: '#f44336',
                                                        '&:hover': {
                                                            borderColor: '#d32f2f',
                                                            backgroundColor: '#ffebee',
                                                        },
                                                    }}
                                                >
                                                    Reject
                                                </Button>
                                            </Box>
                                        )}
                                    </CardContent>
                                </RequestCard>
                            ))
                        )}
                    </Box>
                )
            }

            {/* Success Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{ bottom: 80 }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{ borderRadius: '12px', fontWeight: 600 }}
                >
                    {snackbarMsg}
                </Alert>
            </Snackbar>

            {/* Filter Bottom Sheet */}
            <SwipeableDrawer
                anchor="bottom"
                open={isFilterSheetOpen}
                onClose={() => setIsFilterSheetOpen(false)}
                onOpen={() => setIsFilterSheetOpen(true)}
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
                    <Typography variant="h6" fontWeight={700} textAlign="center">Filter Requests</Typography>
                </Box>
                <List sx={{ pt: 1 }}>
                    {filterOptions.map((option) => {
                        const isIncoming = option.label === 'Incoming';
                        const pendingCount = incomingRequests.filter(r => r.status === 'Pending').length;

                        return (
                            <ListItem disablePadding key={option.value}>
                                <ListItemButton
                                    onClick={() => { setTabValue(option.value); setIsFilterSheetOpen(false); }}
                                    sx={{ px: 3 }}
                                >
                                    <Radio
                                        checked={tabValue === option.value}
                                        onChange={() => { setTabValue(option.value); setIsFilterSheetOpen(false); }}
                                        size="small"
                                        sx={{ mr: 1 }}
                                    />
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                <Typography fontWeight={tabValue === option.value ? 700 : 500}>
                                                    {option.label}
                                                </Typography>
                                                {isIncoming && pendingCount > 0 && (
                                                    <Box sx={{
                                                        minWidth: 20,
                                                        height: 20,
                                                        borderRadius: '10px',
                                                        backgroundColor: '#f44336',
                                                        color: '#fff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 700,
                                                        px: 0.5
                                                    }}>
                                                        {pendingCount}
                                                    </Box>
                                                )}
                                            </Box>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </SwipeableDrawer>

            {/* Request Detail Drawer */}
            <SwipeableDrawer
                anchor="bottom"
                open={Boolean(selectedRequest)}
                onClose={() => setSelectedRequest(null)}
                onOpen={() => { }}
                PaperProps={{
                    sx: {
                        borderTopLeftRadius: '24px',
                        borderTopRightRadius: '24px',
                        padding: '0',
                        maxHeight: '85vh'
                    }
                }}
            >
                {selectedRequest && (
                    <Box sx={{ pb: 4 }}>
                        <DragHandle />
                        <Box sx={{ px: 3, pt: 1, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" fontWeight={700}>Request Details</Typography>
                        </Box>

                        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Header Status */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    p: 2,
                                    borderRadius: '16px',
                                    bgcolor: selectedRequest.category === 'Swap' ? '#e3f2fd' : '#f3e5f5',
                                    color: selectedRequest.category === 'Swap' ? '#2196f3' : '#9c27b0',
                                }}>
                                    {React.cloneElement(getIconByType(selectedRequest.iconType), { sx: { fontSize: 32 } })}
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight={700}>{selectedRequest.type}</Typography>
                                    <Typography variant="body2" color="text.secondary">{selectedRequest.category}</Typography>
                                </Box>
                                <Box sx={{ flexGrow: 1 }} />
                                <StatusChip
                                    label={selectedRequest.status}
                                    status={selectedRequest.status}
                                    icon={getStatusIcon(selectedRequest.status)}
                                />
                            </Box>

                            {/* Details Grid */}
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                                <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: '12px' }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>DATE / PERIOD</Typography>
                                    <Typography variant="body1" fontWeight={600} mt={0.5}>
                                        {selectedRequest.fromDate ? `${selectedRequest.fromDate} - ${selectedRequest.toDate}` : (selectedRequest.date || 'N/A')}
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: '12px' }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>CREATED</Typography>
                                    <Typography variant="body1" fontWeight={600} mt={0.5}>{selectedRequest.created}</Typography>
                                </Box>
                            </Box>

                            {/* Additional Info */}
                            <Box sx={{ p: 2, bgcolor: '#f9f9f9', borderRadius: '12px' }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>DETAILS</Typography>
                                <Typography variant="body1" mt={0.5}>
                                    {selectedRequest.comment || selectedRequest.reason || selectedRequest.details || 'No additional details provided.'}
                                </Typography>
                                {selectedRequest.swapWith && (
                                    <Typography variant="body2" mt={1} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <SwapIcon fontSize="small" color="action" />
                                        Swap with: <strong>{selectedRequest.swapWith}</strong>
                                    </Typography>
                                )}
                            </Box>

                            {/* Action Button (Placeholder for future actions like Cancel Request) */}
                            {selectedRequest.status === 'Pending' && !isIncomingTab && (
                                <Button variant="outlined" color="error" fullWidth sx={{ borderRadius: '12px', py: 1.5, fontWeight: 700 }}>
                                    Cancel Request
                                </Button>
                            )}
                        </Box>
                    </Box>
                )}
            </SwipeableDrawer>
        </PageContainer >
    );
};

export default RequestsPage;
