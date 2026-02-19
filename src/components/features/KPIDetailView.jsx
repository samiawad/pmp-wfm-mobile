import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    Card,
    CardContent,
    ToggleButtonGroup,
    ToggleButton,
    Chip,
    LinearProgress,
    Button,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Timeline as TimelineIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Flag as GoalIcon,
    BarChart as BreakdownIcon,
} from '@mui/icons-material';
import { AreaChart, Area, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Cell } from 'recharts';
import DisputeModal from '../common/DisputeModal';

// ============================================
// Styled Components
// ============================================

const DetailContainer = styled(Box)(({ theme }) => ({
    paddingBottom: theme.spacing(2),
    backgroundColor: '#e7e7e7',
    minHeight: '100vh',
    // margin removed to align with parent container (MainContent has 0 horizontal padding)
    padding: '20px', // Match PerformancePage container padding
    boxSizing: 'border-box',
}));

const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const BackButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        backgroundColor: '#f5f5f5',
    },
}));

const KPITitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    color: 'var(--color-on-background)',
    flex: 1,
}));

const StatsCard = styled(Card)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    marginBottom: theme.spacing(2),
}));

const StatsGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(4, 1fr)',
    },
}));

const StatItem = styled(Box)(({ theme }) => ({
    textAlign: 'center',
}));

const StatLabel = styled(Typography)(({ theme }) => ({
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    marginBottom: theme.spacing(0.5),
}));

const StatValue = styled(Typography)(({ theme, color }) => ({
    fontSize: '1.5rem',
    fontWeight: 700,
    color: color || 'var(--text-primary)',
}));

const ViewSwitcher = styled(ToggleButtonGroup)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: theme.spacing(2),
    width: '100%',
    '& .MuiToggleButton-root': {
        border: 'none',
        padding: theme.spacing(1),
        flex: 1,
        '&.Mui-selected': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            '&:hover': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            },
        },
    },
}));

const ContentCard = styled(Card)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));

const IntervalSelector = styled(FormControl)(({ theme }) => ({
    minWidth: 150,
    backgroundColor: 'white',
    borderRadius: '12px',
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
    },
}));

const ChartTitle = styled(Typography)(({ theme }) => ({
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    color: 'var(--text-primary)',
}));

const GoalCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
    marginBottom: theme.spacing(2),
}));

// ============================================
// Helper Functions
// ============================================

const generateIntervalData = (kpiId, interval, dateRange) => {
    const data = [];
    const { startDate, endDate } = dateRange;

    // Calculate number of intervals
    let intervalCount = 0;
    let intervalMs = 0;
    let formatFunc = null;

    switch (interval) {
        case '15min':
            intervalMs = 15 * 60 * 1000;
            intervalCount = 96; // 24 hours
            formatFunc = (date) => {
                const hours = date.getHours();
                const minutes = date.getMinutes();
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            };
            break;
        case '30min':
            intervalMs = 30 * 60 * 1000;
            intervalCount = 48; // 24 hours
            formatFunc = (date) => {
                const hours = date.getHours();
                const minutes = date.getMinutes();
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            };
            break;
        case '1hour':
            intervalMs = 60 * 60 * 1000;
            intervalCount = 24; // 24 hours
            formatFunc = (date) => {
                const hours = date.getHours();
                return `${hours.toString().padStart(2, '0')}:00`;
            };
            break;
        case 'daily':
            intervalMs = 24 * 60 * 60 * 1000;
            intervalCount = Math.ceil((endDate - startDate) / intervalMs) + 1;
            formatFunc = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            break;
        case 'weekly':
            intervalMs = 7 * 24 * 60 * 60 * 1000;
            intervalCount = Math.ceil((endDate - startDate) / intervalMs);
            formatFunc = (date) => `Week ${Math.ceil(date.getDate() / 7)}`;
            break;
        case 'monthly':
            intervalCount = 12;
            formatFunc = (date) => date.toLocaleDateString('en-US', { month: 'short' });
            break;
    }

    // Generate data based on interval
    for (let i = 0; i < intervalCount; i++) {
        let date;
        if (interval === 'monthly') {
            date = new Date(endDate);
            date.setMonth(date.getMonth() - (intervalCount - i - 1));
        } else if (['15min', '30min', '1hour'].includes(interval)) {
            // For intraday, use today's date
            date = new Date(endDate);
            date.setHours(0, 0, 0, 0);
            date = new Date(date.getTime() + (i * intervalMs));
        } else {
            date = new Date(startDate.getTime() + (i * intervalMs));
        }

        const label = formatFunc(date);
        const baseValue = getBaseValue(kpiId);
        const variance = Math.sin(i / 3) * (baseValue * 0.15) + (Math.random() - 0.5) * (baseValue * 0.1);
        const value = Math.max(0, baseValue + variance);

        data.push({
            label,
            value: parseFloat(value.toFixed(1)),
            date: date.toISOString(),
        });
    }

    return data;
};

const getBaseValue = (kpiId) => {
    const baseValues = {
        aht: 240,
        adherence: 90,
        ctc: 3,
        ctb: 4,
        ctcom: 1,
        hold: 3,
        fcr: 80,
        csat: 87,
        quality: 88,
        occupancy: 70,
    };
    return baseValues[kpiId] || 50;
};

const getAvailableIntervals = (kpiId) => {
    // AHT and Hold % have intraday intervals
    if (kpiId === 'aht' || kpiId === 'hold') {
        return [
            { value: '15min', label: '15 Minutes' },
            { value: '30min', label: '30 Minutes' },
            { value: '1hour', label: '1 Hour' },
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
        ];
    }

    // Other KPIs start from daily
    return [
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
    ];
};

const formatValue = (value, unit) => {
    if (unit === 's') {
        return `${Math.round(value)}s`;
    }
    if (unit === '%') {
        return `${Math.round(value)}%`;
    }
    return Math.round(value);
};

const getPerformanceColor = (value, kpi) => {
    const { thresholds, lowerIsBetter } = kpi;

    if (lowerIsBetter) {
        if (value <= thresholds.good) return '#4caf50';
        if (value <= thresholds.average) return '#ff9800';
        return '#f44336';
    } else {
        if (value >= thresholds.good) return '#4caf50';
        if (value >= thresholds.average) return '#ff9800';
        return '#f44336';
    }
};

// ============================================
// Component
// ============================================

const KPIDetailView = ({ kpi, onBack, dateRange }) => {
    const [detailView, setDetailView] = useState('breakdown');
    const [interval, setInterval] = useState(kpi.id === 'aht' || kpi.id === 'hold' ? '1hour' : 'daily');
    const [selectedInterval, setSelectedInterval] = useState(null);
    const [disputeModalOpen, setDisputeModalOpen] = useState(false);

    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setDetailView(newView);
        }
    };

    const handleIntervalChange = (event) => {
        setInterval(event.target.value);
        setSelectedInterval(null); // Reset selection when interval changes
    };

    const handleBarClick = (data, index) => {
        setSelectedInterval({ ...data, index });
    };

    const handleOpenDispute = () => {
        setDisputeModalOpen(true);
    };

    const handleCloseDispute = () => {
        setDisputeModalOpen(false);
    };

    const handleSubmitDispute = (formData) => {
        console.log('Dispute submitted:', formData);
        // TODO: Send dispute to backend
        setSelectedInterval(null);
    };

    // Generate data for current interval
    const breakdownData = generateIntervalData(kpi.id, interval, dateRange);

    // Calculate statistics
    const currentValue = kpi.value;
    const avgValue = breakdownData.reduce((sum, d) => sum + d.value, 0) / breakdownData.length;
    const maxValue = Math.max(...breakdownData.map(d => d.value));
    const minValue = Math.min(...breakdownData.map(d => d.value));

    const performanceColor = getPerformanceColor(currentValue, kpi);
    const availableIntervals = getAvailableIntervals(kpi.id);

    // Custom tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: `2px solid ${performanceColor}`,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                >
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {payload[0].payload.label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: performanceColor }}>
                        {formatValue(payload[0].value, kpi.unit)}
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    // Render Breakdown View
    const renderBreakdownView = () => {
        return (
            <Box>
                <IntervalSelector size="small">
                    <Select value={interval} onChange={handleIntervalChange}>
                        {availableIntervals.map(int => (
                            <MenuItem key={int.value} value={int.value}>
                                {int.label}
                            </MenuItem>
                        ))}
                    </Select>
                </IntervalSelector>

                <ContentCard>
                    <CardContent>
                        <ChartTitle>Performance Breakdown by {availableIntervals.find(i => i.value === interval)?.label}</ChartTitle>
                        <Box sx={{ height: 300, ml: -2 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={breakdownData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }} onClick={(data) => {
                                    if (data && data.activeTooltipIndex !== undefined) {
                                        handleBarClick(breakdownData[data.activeTooltipIndex], data.activeTooltipIndex);
                                    }
                                }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis
                                        dataKey="label"
                                        tick={{ fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]} cursor="pointer">
                                        {breakdownData.map((entry, index) => {
                                            const barColor = getPerformanceColor(entry.value, kpi);
                                            const isSelected = selectedInterval?.index === index;
                                            return (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={barColor}
                                                    opacity={isSelected ? 1 : 0.85}
                                                    stroke={isSelected ? '#000' : 'none'}
                                                    strokeWidth={isSelected ? 2 : 0}
                                                />
                                            );
                                        })}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>

                        {selectedInterval && (
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    onClick={handleOpenDispute}
                                    sx={{
                                        borderRadius: '8px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #5568d3 0%, #6a4190 100%)',
                                        },
                                    }}
                                >
                                    + Dispute
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </ContentCard>
            </Box>
        );
    };

    // Render Performance Trends View
    const renderTrendsView = () => {
        return (
            <Box>
                <ContentCard sx={{ mb: 2 }}>
                    <CardContent>
                        <ChartTitle>Performance Trend Over Time</ChartTitle>
                        <Box sx={{ height: 300, ml: -2 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={kpi.trend} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                                    <defs>
                                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={performanceColor} stopOpacity={0.4} />
                                            <stop offset="95%" stopColor={performanceColor} stopOpacity={0.05} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} height={40} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke={performanceColor}
                                        strokeWidth={3}
                                        fill="url(#trendGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </CardContent>
                </ContentCard>

                <ContentCard>
                    <CardContent>
                        <ChartTitle>Comparison with Previous Period</ChartTitle>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" color="text.secondary">Current Period</Typography>
                                <Typography variant="h4" sx={{ color: performanceColor, fontWeight: 700 }}>
                                    {formatValue(currentValue, kpi.unit)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {kpi.change > 0 ? (
                                    <TrendingUpIcon sx={{ fontSize: 40, color: kpi.lowerIsBetter ? '#f44336' : '#4caf50' }} />
                                ) : (
                                    <TrendingDownIcon sx={{ fontSize: 40, color: kpi.lowerIsBetter ? '#4caf50' : '#f44336' }} />
                                )}
                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: kpi.lowerIsBetter ? (kpi.change < 0 ? '#4caf50' : '#f44336') : (kpi.change > 0 ? '#4caf50' : '#f44336') }}>
                                        {kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent.toFixed(1)}%
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">vs previous</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ flex: 1, textAlign: 'right' }}>
                                <Typography variant="body2" color="text.secondary">Previous Period</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {formatValue(kpi.previousValue, kpi.unit)}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </ContentCard>
            </Box>
        );
    };

    // Render Goal Progress View
    const renderGoalView = () => {
        const progress = kpi.lowerIsBetter
            ? Math.max(0, Math.min(100, ((kpi.thresholds.average - currentValue) / (kpi.thresholds.average - kpi.thresholds.good)) * 100))
            : Math.max(0, Math.min(100, ((currentValue - kpi.thresholds.average) / (kpi.thresholds.good - kpi.thresholds.average)) * 100));

        const isOnTrack = getPerformanceColor(currentValue, kpi) === '#4caf50';
        const needsImprovement = getPerformanceColor(currentValue, kpi) === '#f44336';

        return (
            <Box>
                <GoalCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <GoalIcon sx={{ fontSize: 40, color: performanceColor }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>Goal Progress</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Target: {formatValue(kpi.target, kpi.unit)}
                            </Typography>
                        </Box>
                        <Chip
                            label={isOnTrack ? 'On Track' : needsImprovement ? 'Needs Improvement' : 'Average'}
                            sx={{
                                backgroundColor: performanceColor,
                                color: 'white',
                                fontWeight: 600,
                            }}
                        />
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: performanceColor,
                            },
                        }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        {progress.toFixed(0)}% to goal
                    </Typography>
                </GoalCard>

                <ContentCard sx={{ mb: 2 }}>
                    <CardContent>
                        <ChartTitle>Performance Thresholds</ChartTitle>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#4caf50' }} />
                                <Typography variant="body2" sx={{ flex: 1 }}>Excellent</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {kpi.lowerIsBetter ? `≤ ${formatValue(kpi.thresholds.good, kpi.unit)}` : `≥ ${formatValue(kpi.thresholds.good, kpi.unit)}`}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#ff9800' }} />
                                <Typography variant="body2" sx={{ flex: 1 }}>Average</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {kpi.lowerIsBetter
                                        ? `${formatValue(kpi.thresholds.good + 1, kpi.unit)} - ${formatValue(kpi.thresholds.average, kpi.unit)}`
                                        : `${formatValue(kpi.thresholds.average, kpi.unit)} - ${formatValue(kpi.thresholds.good - 1, kpi.unit)}`
                                    }
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#f44336' }} />
                                <Typography variant="body2" sx={{ flex: 1 }}>Needs Improvement</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {kpi.lowerIsBetter ? `> ${formatValue(kpi.thresholds.average, kpi.unit)}` : `< ${formatValue(kpi.thresholds.average, kpi.unit)}`}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </ContentCard>

                <ContentCard>
                    <CardContent>
                        <ChartTitle>Historical Performance</ChartTitle>
                        <Box sx={{ height: 200, ml: -2 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={kpi.trend} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} height={40} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke={performanceColor}
                                        strokeWidth={2}
                                        dot={{ fill: performanceColor, r: 4 }}
                                    />
                                    {/* Target line */}
                                    <Line
                                        type="monotone"
                                        dataKey={() => kpi.target}
                                        stroke="#9e9e9e"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                            Solid line: Actual | Dashed line: Target
                        </Typography>
                    </CardContent>
                </ContentCard>
            </Box>
        );
    };

    return (
        <DetailContainer>
            {/* Header with Back Button */}
            <Header>
                <BackButton onClick={onBack}>
                    <ArrowBackIcon />
                </BackButton>
                <KPITitle variant="h5">{kpi.name}</KPITitle>
            </Header>

            {/* Stats Summary */}
            <StatsCard>
                <CardContent>
                    <StatsGrid>
                        <StatItem>
                            <StatLabel>Current</StatLabel>
                            <StatValue color={performanceColor}>
                                {formatValue(currentValue, kpi.unit)}
                            </StatValue>
                        </StatItem>
                        <StatItem>
                            <StatLabel>Average</StatLabel>
                            <StatValue>
                                {formatValue(avgValue, kpi.unit)}
                            </StatValue>
                        </StatItem>
                        <StatItem>
                            <StatLabel>Best</StatLabel>
                            <StatValue color="#4caf50">
                                {formatValue(kpi.lowerIsBetter ? minValue : maxValue, kpi.unit)}
                            </StatValue>
                        </StatItem>
                        <StatItem>
                            <StatLabel>Target</StatLabel>
                            <StatValue>
                                {formatValue(kpi.target, kpi.unit)}
                            </StatValue>
                        </StatItem>
                    </StatsGrid>
                </CardContent>
            </StatsCard>

            {/* View Switcher */}
            <ViewSwitcher
                value={detailView}
                exclusive
                onChange={handleViewChange}
                aria-label="detail view"
            >
                <ToggleButton value="breakdown" aria-label="breakdown view">
                    <BreakdownIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
                    <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'inline' } }}>Breakdown</Typography>
                </ToggleButton>
                <ToggleButton value="trends" aria-label="trends view">
                    <TimelineIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
                    <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'inline' } }}>Trends</Typography>
                </ToggleButton>
                <ToggleButton value="goal" aria-label="goal view">
                    <GoalIcon sx={{ mr: 0.5, fontSize: '1.2rem' }} />
                    <Typography variant="caption" sx={{ display: { xs: 'none', sm: 'inline' } }}>Goal</Typography>
                </ToggleButton>
            </ViewSwitcher>

            {/* Content based on selected view */}
            {detailView === 'breakdown' && renderBreakdownView()}
            {detailView === 'trends' && renderTrendsView()}
            {detailView === 'goal' && renderGoalView()}

            {/* Dispute Modal */}
            <DisputeModal
                open={disputeModalOpen}
                onClose={handleCloseDispute}
                onSubmit={handleSubmitDispute}
                prefilledData={selectedInterval ? {
                    kpiId: kpi.id,
                    kpiName: kpi.name,
                    period: selectedInterval.label,
                    startDate: new Date(selectedInterval.date).toISOString().split('T')[0],
                    endDate: new Date(selectedInterval.date).toISOString().split('T')[0],
                    periodReadOnly: true,
                } : null}
            />
        </DetailContainer>
    );
};

export default KPIDetailView;
