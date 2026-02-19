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

const FilterPill = styled(Box)(({ active }) => ({
    height: 32,
    borderRadius: 20,
    padding: '0 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    backgroundColor: active ? '#667eea' : '#fff',
    color: active ? '#fff' : '#555',
    border: active ? 'none' : '1px solid #e0e0e0',
    transition: 'all 0.15s ease',
    '&:active': {
        transform: 'scale(0.95)',
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

const RequestsPage = ({ defaultTab = 0 }) => {
    const [tabValue, setTabValue] = useState(defaultTab);
    const [requests, setRequests] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState(mockIncomingRequests);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState('');

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

    const filteredRequests = requests.filter(req => {
        if (tabValue === 0) return true;
        if (tabValue === 1) return req.category === 'Time Off';
        if (tabValue === 2) return req.category === 'Swap';
        if (tabValue === 4) return req.category === 'Dispute'; // New tab for Disputes
        return true;
    });

    const handleIncomingAction = (id, action) => {
        setIncomingRequests(prev =>
            prev.map(req => req.id === id ? { ...req, status: action === 'accept' ? 'Approved' : 'Rejected' } : req)
        );
        setSnackbarMsg(action === 'accept' ? 'Swap request accepted!' : 'Swap request rejected.');
        setSnackbarOpen(true);
    };

    const isIncomingTab = tabValue === 3;

    return (
        <PageContainer>
            {/* Title + Tab filters in one horizontal scrolling row */}
            <FilterRow>
                <PageTitle>My Requests</PageTitle>
                <FilterPill active={tabValue === 0} onClick={() => setTabValue(0)}>All</FilterPill>
                <FilterPill active={tabValue === 1} onClick={() => setTabValue(1)}>Vacations</FilterPill>
                <FilterPill active={tabValue === 2} onClick={() => setTabValue(2)}>Swaps</FilterPill>
                <FilterPill active={tabValue === 4} onClick={() => setTabValue(4)}>Disputes</FilterPill>
                <FilterPill active={tabValue === 3} onClick={() => setTabValue(3)} sx={{ gap: 1 }}>
                    Incoming
                    {incomingRequests.filter(r => r.status === 'Pending').length > 0 && (
                        <Box sx={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            backgroundColor: tabValue === 3 ? '#fff' : '#f44336',
                            color: tabValue === 3 ? '#667eea' : '#fff',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {incomingRequests.filter(r => r.status === 'Pending').length}
                        </Box>
                    )}
                </FilterPill>
            </FilterRow>

            {/* My Requests (tabs 0-2) */}
            {!isIncomingTab && (
                <Box>
                    {filteredRequests.map((req) => (
                        <RequestCard key={req.id} $statusColor={req.status === 'Approved' ? '#4caf50' : req.status === 'Rejected' ? '#f44336' : '#ff9800'}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2, '&:last-child': { pb: 2 } }}>
                                <Box
                                    sx={{
                                        mr: 2,
                                        p: 1.5,
                                        borderRadius: '12px',
                                        bgcolor: req.category === 'Swap' ? '#e3f2fd' : '#f3e5f5',
                                        color: req.category === 'Swap' ? '#2196f3' : '#9c27b0'
                                    }}
                                >
                                    {getIconByType(req.iconType)}
                                </Box>

                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2, mb: 0.5 }}>
                                        {req.type}
                                    </Typography>

                                    {/* Detailed Fields based on request type */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
                                        {/* Date / Period */}
                                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.8rem' }}>
                                            <TimeIcon sx={{ fontSize: '0.9rem' }} />
                                            {req.fromDate ? `${req.fromDate} - ${req.toDate}` : req.date || (req.startDate && `${req.startDate} - ${req.endDate}`)}
                                        </Typography>

                                        {/* Swap Details */}
                                        {req.category === 'Swap' && req.swapWith && (
                                            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#555' }}>
                                                <strong>Swap with:</strong> {req.swapWith}
                                            </Typography>
                                        )}

                                        {/* Dispute Details */}
                                        {req.category === 'Dispute' && (
                                            <>
                                                <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#555' }}>
                                                    <strong>KPI:</strong> {req.kpiName}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#555' }}>
                                                    <strong>Reason:</strong> {req.reason}
                                                </Typography>
                                            </>
                                        )}

                                        {/* Comment / Reason */}
                                        {req.comment && (
                                            <Typography variant="body2" sx={{
                                                fontSize: '0.75rem',
                                                color: '#777',
                                                fontStyle: 'italic',
                                                mt: 0.5,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}>
                                                "{req.comment}"
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, ml: 1, minWidth: '80px' }}>
                                    <StatusChip
                                        label={req.status}
                                        size="small"
                                        status={req.status}
                                        icon={getStatusIcon(req.status)}
                                    />
                                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
                                        {req.created}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </RequestCard>
                    ))}
                </Box>
            )}

            {/* Incoming Requests (tab 3) */}
            {isIncomingTab && (
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
            )}

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
        </PageContainer>
    );
};

export default RequestsPage;
