import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    MenuItem,
    Grid,
    Chip,
    IconButton,
    InputAdornment,
    Button,
} from '@mui/material';
import {
    FilterList as FilterIcon,
    Search as SearchIcon,
    CalendarToday as DateBaseIcon,
    CheckCircle as ApprovedIcon,
    Cancel as RejectedIcon,
    HourglassEmpty as PendingIcon,
} from '@mui/icons-material';

// ============================================
// Styled Components
// ============================================

const PageContainer = styled(Box)(({ theme }) => ({
    paddingBottom: theme.spacing(3),
    backgroundColor: '#e7e7e7',
    minHeight: '100%',
    margin: '-var(--spacing-md)',
    padding: 'var(--spacing-md)',
}));

const Header = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

const PageTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    color: 'var(--color-on-background)',
}));

const FilterSection = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
}));

const DisputeCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    borderRadius: '12px',
    borderLeft: '4px solid transparent',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
    let color = theme.palette.info.main;
    let bgcolor = theme.palette.info.light;

    if (status === 'Approved') {
        color = theme.palette.success.main;
        bgcolor = '#e8f5e9';
    } else if (status === 'Rejected') {
        color = theme.palette.error.main;
        bgcolor = '#ffebee';
    } else if (status === 'Pending') {
        color = theme.palette.warning.main;
        bgcolor = '#fff3e0';
    }

    return {
        color: color,
        backgroundColor: bgcolor,
        fontWeight: 600,
        borderRadius: '8px',
    };
});

// ============================================
// Mock Data
// ============================================

const mockDisputes = [
    { id: 1, kpi: 'Quality Score', reason: 'Evaluation Error', date: '2023-10-25', status: 'Pending', reference: 'QA-1023' },
    { id: 2, kpi: 'Adherence', reason: 'System Downtime', date: '2023-10-22', status: 'Approved', reference: 'SYS-554' },
    { id: 3, kpi: 'AHT', reason: 'Complex Caller', date: '2023-10-20', status: 'Rejected', reference: 'CALL-998' },
    { id: 4, kpi: 'Quality Score', reason: 'Misinterpretation', date: '2023-10-18', status: 'Approved', reference: 'QA-1011' },
    { id: 5, kpi: 'Attendance', reason: 'Shift Swap Issue', date: '2023-10-15', status: 'Pending', reference: 'SCH-772' },
];

const kpiOptions = ['All', 'Quality Score', 'Adherence', 'AHT', 'Attendance'];
const reasonOptions = ['All', 'Evaluation Error', 'System Downtime', 'Complex Caller', 'Misinterpretation', 'Shift Swap Issue'];

// ============================================
// Component
// ============================================

const DisputesPage = () => {
    const [selectedKPI, setSelectedKPI] = useState('All');
    const [selectedReason, setSelectedReason] = useState('All');
    const [selectedDate, setSelectedDate] = useState('');

    const filteredDisputes = mockDisputes.filter(d => {
        const matchesKPI = selectedKPI === 'All' || d.kpi === selectedKPI;
        const matchesReason = selectedReason === 'All' || d.reason === selectedReason;
        const matchesDate = !selectedDate || d.date === selectedDate;
        return matchesKPI && matchesReason && matchesDate;
    });

    const getStatusIcon = (status) => {
        if (status === 'Approved') return <ApprovedIcon fontSize="small" />;
        if (status === 'Rejected') return <RejectedIcon fontSize="small" />;
        return <PendingIcon fontSize="small" />;
    };

    const getBorderColor = (status) => {
        if (status === 'Approved') return '#4caf50';
        if (status === 'Rejected') return '#f44336';
        return '#ff9800';
    };

    return (
        <PageContainer>
            <Header>
                <PageTitle variant="h4">My Disputes</PageTitle>
            </Header>

            {/* Filters */}
            <FilterSection>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="KPI"
                                value={selectedKPI}
                                onChange={(e) => setSelectedKPI(e.target.value)}
                                fullWidth
                                size="small"
                                variant="outlined"
                            >
                                {kpiOptions.map((opt) => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                select
                                label="Reason"
                                value={selectedReason}
                                onChange={(e) => setSelectedReason(e.target.value)}
                                fullWidth
                                size="small"
                                variant="outlined"
                            >
                                {reasonOptions.map((opt) => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="date"
                                label="Date" // Use label to mimic placeholder behavior for date input if needed, or simply label
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </FilterSection>

            {/* List */}
            <Box>
                {filteredDisputes.length > 0 ? (
                    filteredDisputes.map((dispute) => (
                        <DisputeCard key={dispute.id} sx={{ borderLeftColor: getBorderColor(dispute.status) }}>
                            <CardContent sx={{ pb: '16px !important' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                                        {dispute.kpi}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {dispute.date}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="var(--text-primary)" sx={{ mb: 2 }}>
                                    Reason: {dispute.reason}
                                </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Ref: {dispute.reference}
                                    </Typography>
                                    <StatusChip
                                        label={dispute.status}
                                        size="small"
                                        status={dispute.status}
                                        icon={getStatusIcon(dispute.status)}
                                    />
                                </Box>
                            </CardContent>
                        </DisputeCard>
                    ))
                ) : (
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography color="text.secondary">No disputes found matching filters.</Typography>
                        <Button
                            variant="text"
                            color="primary"
                            onClick={() => {
                                setSelectedKPI('All');
                                setSelectedReason('All');
                                setSelectedDate('');
                            }}
                            sx={{ mt: 1 }}
                        >
                            Clear Filters
                        </Button>
                    </Box>
                )}
            </Box>
        </PageContainer>
    );
};

export default DisputesPage;
