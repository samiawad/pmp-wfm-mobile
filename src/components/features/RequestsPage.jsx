import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Tabs,
    Tab,
    Chip,
    Button,
    Grid,
} from '@mui/material';
import {
    BeachAccess as VacationIcon,
    SwapHoriz as SwapIcon,
    Schedule as TimeIcon,
    CheckCircle as ApprovedIcon,
    Cancel as RejectedIcon,
    Pending as PendingIcon,
} from '@mui/icons-material';

// ============================================
// Styled Components
// ============================================

const PageContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(12),
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
}));

const PageHeader = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    width: '100%',
}));

const PageTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 800,
    color: '#1a1a1a',
    letterSpacing: '-0.5px',
    marginBottom: theme.spacing(0.5),
}));

const RequestCard = styled(Card)(({ theme, $statusColor }) => ({
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f0f0f0',
    marginBottom: theme.spacing(2),
    overflow: 'visible',
    position: 'relative',
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
// Mock Data (Updated to use iconType string)
// ============================================

const mockRequests = [
    { id: 1, type: 'Annual Leave', category: 'Time Off', date: 'Jul 10 - Jul 15', created: '2 days ago', status: 'Pending', iconType: 'vacation' },
    { id: 2, type: 'Shift Swap', category: 'Swap', date: 'Jun 28', details: 'w/ Ahmed Al-Sayed', created: '1 week ago', status: 'Approved', iconType: 'swap' },
    { id: 3, type: 'Sick Leave', category: 'Time Off', date: 'May 12', created: '1 month ago', status: 'Approved', iconType: 'sick' },
    { id: 4, type: 'Break Swap', category: 'Swap', date: 'May 05', details: 'w/ Sara Hassan', created: '1 month ago', status: 'Rejected', iconType: 'break' },
];

const RequestsPage = () => {
    const [tabValue, setTabValue] = useState(0);
    const [requests, setRequests] = useState([]);

    React.useEffect(() => {
        try {
            const storedRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
            if (storedRequests.length === 0 || !storedRequests[0].iconType) {
                // Seed if empty or if old data structure (missing iconType) caused the crash
                localStorage.setItem('userRequests', JSON.stringify(mockRequests));
                setRequests(mockRequests);
            } else {
                setRequests(storedRequests.reverse());
            }
        } catch (e) {
            // Fallback if JSON parse fails
            setRequests(mockRequests);
        }
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const getIconByType = (iconType) => {
        switch (iconType) {
            case 'vacation': return <VacationIcon />;
            case 'sick': return <VacationIcon />; // Using same icon or could import SickIcon
            case 'swap': return <SwapIcon />;
            case 'break': return <SwapIcon />; // Using same icon or could import BreakIcon
            case 'dispute': return <SwapIcon />; // Using generic or import DisputeIcon
            default: return <VacationIcon />;
        }
    };

    // ... (rest of component)

    const filteredRequests = requests.filter(req => {
        if (tabValue === 0) return true;
        if (tabValue === 1) return req.category === 'Time Off'; // Vacation/Sick/Leave
        if (tabValue === 2) return req.category === 'Swap'; // Swaps
        return true;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved': return <ApprovedIcon fontSize="small" />;
            case 'Rejected': return <RejectedIcon fontSize="small" />;
            default: return <PendingIcon fontSize="small" />;
        }
    };

    return (
        <PageContainer>
            <PageHeader>
                <PageTitle variant="h4">My Requests</PageTitle>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    centered
                    sx={{
                        '& .MuiTabs-indicator': { borderRadius: 2, height: 3 },
                        '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', fontSize: '1rem' }
                    }}
                >
                    <Tab label="All" />
                    <Tab label="Vacations" />
                    <Tab label="Swaps" />
                </Tabs>
            </PageHeader>

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
                                <Typography variant="subtitle1" fontWeight={700}>
                                    {req.type}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <TimeIcon fontSize="inherit" /> {req.date} {req.details && `• ${req.details}`}
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
                        </CardContent>
                    </RequestCard>
                ))}
            </Box>
        </PageContainer>
    );
};

export default RequestsPage;
