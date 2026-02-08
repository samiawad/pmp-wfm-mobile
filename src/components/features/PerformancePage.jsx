import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Card,
    CardContent,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    FormControl,
    Chip,
} from '@mui/material';
import {
    GridView as CardViewIcon,
    ViewList as ListViewIcon,
    TableChart as TableViewIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    CompareArrows as CompareIcon,
} from '@mui/icons-material';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import KPIDetailView from './KPIDetailView';

// ============================================
// Mock Data with Daily Granularity
// ============================================

// Generate daily data for the last 60 days
const generateDailyData = () => {
    const data = [];
    const today = new Date('2026-02-05');

    for (let i = 59; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        // Generate realistic varying data
        const variance = Math.sin(i / 7) * 10 + (Math.random() - 0.5) * 5;

        data.push({
            date: dateStr,
            displayDate: dayName,
            aht: Math.round(240 + variance),
            adherence: Math.round(88 + Math.random() * 8),
            ctc: Math.round(3 + Math.random() * 2),
            ctb: Math.round(4 + Math.random() * 2),
            ctcom: Math.round(1 + Math.random() * 2),
            hold: parseFloat((3 + Math.random() * 2).toFixed(1)),
            fcr: Math.round(75 + Math.random() * 10),
            csat: Math.round(85 + Math.random() * 8),
            quality: Math.round(86 + Math.random() * 8),
            occupancy: Math.round(60 + Math.random() * 20),
        });
    }

    return data;
};

const dailyData = generateDailyData();

// KPI Configuration
const kpiConfig = [
    {
        id: 'aht',
        name: 'AHT',
        fullName: 'Average Handle Time',
        unit: 's',
        target: 240,
        lowerIsBetter: true,
        aggregationType: 'average', // average, sum, or last
        thresholds: { good: 240, average: 300 },
    },
    {
        id: 'adherence',
        name: 'Adherence',
        fullName: 'Schedule Adherence',
        unit: '%',
        target: 90,
        lowerIsBetter: false,
        aggregationType: 'average',
        thresholds: { good: 90, average: 80 },
    },
    {
        id: 'ctc',
        name: 'CTC',
        fullName: 'Calls to Close',
        unit: '',
        target: 4,
        lowerIsBetter: true,
        aggregationType: 'sum',
        thresholds: { good: 28, average: 42 }, // 4*7 days, 6*7 days
    },
    {
        id: 'ctb',
        name: 'CTB',
        fullName: 'Calls to Break',
        unit: '',
        target: 5,
        lowerIsBetter: true,
        aggregationType: 'sum',
        thresholds: { good: 35, average: 49 }, // 5*7 days, 7*7 days
    },
    {
        id: 'ctcom',
        name: 'CTCOM',
        fullName: 'Calls to Complaint',
        unit: '',
        target: 2,
        lowerIsBetter: true,
        aggregationType: 'sum',
        thresholds: { good: 14, average: 28 }, // 2*7 days, 4*7 days
    },
    {
        id: 'hold',
        name: 'Hold %',
        fullName: 'Hold Percentage',
        unit: '%',
        target: 3,
        lowerIsBetter: true,
        aggregationType: 'average',
        thresholds: { good: 3, average: 5 },
    },
    {
        id: 'fcr',
        name: 'FCR',
        fullName: 'First Call Resolution',
        unit: '%',
        target: 80,
        lowerIsBetter: false,
        aggregationType: 'average',
        thresholds: { good: 80, average: 70 },
    },
    {
        id: 'csat',
        name: 'CSAT',
        fullName: 'Customer Satisfaction',
        unit: '%',
        target: 85,
        lowerIsBetter: false,
        aggregationType: 'average',
        thresholds: { good: 85, average: 70 },
    },
    {
        id: 'quality',
        name: 'Quality',
        fullName: 'Quality Score',
        unit: '%',
        target: 85,
        lowerIsBetter: false,
        aggregationType: 'average',
        thresholds: { good: 85, average: 75 },
    },
    {
        id: 'occupancy',
        name: 'Occupancy',
        fullName: 'Occupancy Rate',
        unit: '%',
        target: 75,
        lowerIsBetter: false,
        aggregationType: 'average',
        thresholds: { good: 70, average: 60 },
    },
];

// Date Range Presets
const dateRangePresets = [
    { id: 'last7', label: 'Last 7 Days', days: 7 },
    { id: 'last14', label: 'Last 14 Days', days: 14 },
    { id: 'last30', label: 'Last 30 Days', days: 30 },
    { id: 'thisMonth', label: 'This Month', days: 'thisMonth' },
    { id: 'lastMonth', label: 'Last Month', days: 'lastMonth' },
];

// ============================================
// Helper Functions
// ============================================

const aggregateData = (data, kpiId, aggregationType) => {
    if (data.length === 0) return 0;

    const values = data.map(d => d[kpiId]);

    if (aggregationType === 'sum') {
        return values.reduce((sum, val) => sum + val, 0);
    } else if (aggregationType === 'average') {
        const sum = values.reduce((sum, val) => sum + val, 0);
        return parseFloat((sum / values.length).toFixed(1));
    } else if (aggregationType === 'last') {
        return values[values.length - 1];
    }

    return 0;
};

const getDateRange = (presetId) => {
    const today = new Date('2026-02-05');
    let startDate, endDate;

    const preset = dateRangePresets.find(p => p.id === presetId);

    if (!preset) {
        // Default to last 7 days
        endDate = new Date(today);
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 6);
    } else if (preset.days === 'thisMonth') {
        endDate = new Date(today);
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (preset.days === 'lastMonth') {
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    } else {
        endDate = new Date(today);
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - (preset.days - 1));
    }

    return { startDate, endDate };
};

const filterDataByDateRange = (data, startDate, endDate) => {
    return data.filter(d => {
        const date = new Date(d.date);
        return date >= startDate && date <= endDate;
    });
};

const getPreviousPeriodRange = (startDate, endDate) => {
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const prevEndDate = new Date(startDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);
    const prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(prevStartDate.getDate() - (duration - 1));

    return { startDate: prevStartDate, endDate: prevEndDate };
};

const getPerformanceColor = (value, kpi) => {
    const { thresholds, lowerIsBetter } = kpi;

    if (lowerIsBetter) {
        if (value <= thresholds.good) return '#4caf50'; // Green
        if (value <= thresholds.average) return '#ff9800'; // Orange
        return '#f44336'; // Red
    } else {
        if (value >= thresholds.good) return '#4caf50'; // Green
        if (value >= thresholds.average) return '#ff9800'; // Orange
        return '#f44336'; // Red
    }
};

const getTrendColor = (change, lowerIsBetter) => {
    if (change === 0) return '#9e9e9e'; // Gray

    if (lowerIsBetter) {
        return change < 0 ? '#4caf50' : '#f44336'; // Negative change is good
    } else {
        return change > 0 ? '#4caf50' : '#f44336'; // Positive change is good
    }
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

// ============================================
// Styled Components
// ============================================

const PerformanceContainer = styled(Box)(({ theme }) => ({
    paddingBottom: theme.spacing(2),
    backgroundColor: '#e7e7e7',
    minHeight: '100vh',
    margin: '-var(--spacing-md)',
    padding: 'var(--spacing-md)',
}));

const PageTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    color: 'var(--color-on-background)',
    marginBottom: theme.spacing(0.5),
}));

const FilterContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap',
    alignItems: 'center',
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
    minWidth: 150,
    backgroundColor: 'white',
    borderRadius: '12px',
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
    },
}));

const ViewSwitcherContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: theme.spacing(2),
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    '& .MuiToggleButton-root': {
        border: 'none',
        padding: theme.spacing(1, 2),
        '&.Mui-selected': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            '&:hover': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            },
        },
    },
}));

const ComparisonChip = styled(Chip)(({ theme, active }) => ({
    backgroundColor: active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
    width: '50%',
    color: active ? 'white' : 'var(--text-primary)',
    fontWeight: 600,
    cursor: 'pointer',
    border: active ? 'none' : '1px solid #e0e0e0',
    '&:hover': {
        backgroundColor: active ? '#667eea' : '#f5f5f5',
    },
}));

// Card View Components
const KPIGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(3, 1fr)',
    },
}));

const KPICard = styled(Card)(({ theme, performanceColor }) => ({
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    backdropFilter: 'blur(10px)',
    border: `2px solid ${performanceColor}20`,
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 28px rgba(0, 0, 0, 0.12)',
    },
}));

const KPICardContent = styled(CardContent)(({ theme }) => ({
    padding: theme.spacing(2),
    '&:last-child': {
        paddingBottom: theme.spacing(2),
    },
}));

const KPIHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(1),
}));

const KPIName = styled(Typography)(({ theme }) => ({
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
}));

const KPIValue = styled(Typography)(({ theme, performanceColor }) => ({
    fontSize: '2rem',
    fontWeight: 700,
    color: performanceColor,
    lineHeight: 1,
    marginBottom: theme.spacing(1),
}));

const TrendContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(1.5),
}));

const TrendText = styled(Typography)(({ theme, trendColor }) => ({
    fontSize: '0.75rem',
    fontWeight: 600,
    color: trendColor,
}));

const ChartContainer = styled(Box)(({ theme }) => ({
    height: '50px',
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(-2), // Remove left spacing
    marginRight: theme.spacing(-2), // Remove right spacing
}));

// List View Components
const ListContainer = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: theme.spacing(2),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
}));

const ListItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5),
    borderBottom: '1px solid #e0e0e0',
    '&:last-child': {
        borderBottom: 'none',
    },
}));

const ListItemLeft = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
}));

const ListItemRight = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: theme.spacing(0.5),
}));

// ============================================
// Component
// ============================================

const PerformancePage = () => {
    const [viewMode, setViewMode] = useState('cards');
    const [dateRangePreset, setDateRangePreset] = useState('last7');
    const [showComparison, setShowComparison] = useState(false);
    const [selectedKPI, setSelectedKPI] = useState(null);

    const handleViewChange = (event, newView) => {
        if (newView !== null) {
            setViewMode(newView);
        }
    };

    const handleDateRangeChange = (event) => {
        setDateRangePreset(event.target.value);
    };

    const toggleComparison = () => {
        setShowComparison(!showComparison);
    };

    const handleKPIClick = (kpi) => {
        setSelectedKPI(kpi);
    };

    const handleBackToList = () => {
        setSelectedKPI(null);
    };

    // Calculate current period data
    const { startDate, endDate } = getDateRange(dateRangePreset);
    const currentPeriodData = filterDataByDateRange(dailyData, startDate, endDate);

    // Calculate previous period data
    const { startDate: prevStartDate, endDate: prevEndDate } = getPreviousPeriodRange(startDate, endDate);
    const previousPeriodData = filterDataByDateRange(dailyData, prevStartDate, prevEndDate);

    // Calculate KPI values
    const kpiData = kpiConfig.map(kpi => {
        const currentValue = aggregateData(currentPeriodData, kpi.id, kpi.aggregationType);
        const previousValue = aggregateData(previousPeriodData, kpi.id, kpi.aggregationType);
        const change = currentValue - previousValue;
        const changePercent = previousValue !== 0 ? ((change / previousValue) * 100) : 0;

        // Get trend data (last 7 points from current period)
        const trendData = currentPeriodData.slice(-7).map(d => ({
            date: d.displayDate,
            value: d[kpi.id],
        }));

        return {
            ...kpi,
            value: currentValue,
            previousValue,
            change,
            changePercent,
            trend: trendData,
        };
    });

    // Render Card View
    const renderCardView = () => {
        return (
            <KPIGrid>
                {kpiData.map((kpi) => {
                    const performanceColor = getPerformanceColor(kpi.value, kpi);
                    const trendColor = getTrendColor(kpi.change, kpi.lowerIsBetter);
                    const chartData = kpi.trend;

                    // Custom tooltip component
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
                                        {payload[0].payload.date}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: performanceColor }}>
                                        {formatValue(payload[0].value, kpi.unit)}
                                    </Typography>
                                </Box>
                            );
                        }
                        return null;
                    };

                    return (
                        <KPICard key={kpi.id} performanceColor={performanceColor} onClick={() => handleKPIClick(kpi)}>
                            <KPICardContent>
                                <KPIHeader>
                                    <KPIName>{kpi.name}</KPIName>
                                </KPIHeader>

                                <KPIValue performanceColor={performanceColor}>
                                    {formatValue(kpi.value, kpi.unit)}
                                </KPIValue>

                                {showComparison && (
                                    <TrendContainer>
                                        {kpi.change !== 0 && (
                                            <>
                                                {((kpi.lowerIsBetter && kpi.change < 0) || (!kpi.lowerIsBetter && kpi.change > 0)) ? (
                                                    <TrendingUpIcon sx={{ fontSize: '1rem', color: trendColor }} />
                                                ) : (
                                                    <TrendingDownIcon sx={{ fontSize: '1rem', color: trendColor }} />
                                                )}
                                                <TrendText trendColor={trendColor}>
                                                    {kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent.toFixed(1)}%
                                                </TrendText>
                                                <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>
                                                    vs previous period
                                                </Typography>
                                            </>
                                        )}
                                    </TrendContainer>
                                )}

                                <ChartContainer>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id={`gradient-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={performanceColor} stopOpacity={0.4} />
                                                    <stop offset="95%" stopColor={performanceColor} stopOpacity={0.05} />
                                                </linearGradient>
                                            </defs>
                                            <Tooltip content={<CustomTooltip />} />
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke={performanceColor}
                                                strokeWidth={2}
                                                fill={`url(#gradient-${kpi.id})`}
                                                dot={false}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </KPICardContent>
                        </KPICard>
                    );
                })}
            </KPIGrid>
        );
    };

    // Render List View
    const renderListView = () => {
        return (
            <ListContainer>
                {kpiData.map((kpi) => {
                    const performanceColor = getPerformanceColor(kpi.value, kpi);
                    const trendColor = getTrendColor(kpi.change, kpi.lowerIsBetter);

                    return (
                        <ListItem key={kpi.id}>
                            <ListItemLeft>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {kpi.fullName}
                                </Typography>
                                {showComparison && kpi.change !== 0 && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        {((kpi.lowerIsBetter && kpi.change < 0) || (!kpi.lowerIsBetter && kpi.change > 0)) ? (
                                            <TrendingUpIcon sx={{ fontSize: '0.875rem', color: trendColor }} />
                                        ) : (
                                            <TrendingDownIcon sx={{ fontSize: '0.875rem', color: trendColor }} />
                                        )}
                                        <Typography variant="caption" sx={{ color: trendColor, fontWeight: 600 }}>
                                            {kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent.toFixed(1)}%
                                        </Typography>
                                    </Box>
                                )}
                            </ListItemLeft>
                            <ListItemRight>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: performanceColor }}>
                                    {formatValue(kpi.value, kpi.unit)}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                                    Target: {formatValue(kpi.target, kpi.unit)}
                                </Typography>
                            </ListItemRight>
                        </ListItem>
                    );
                })}
            </ListContainer>
        );
    };

    // Render Table View
    const renderTableView = () => {
        return (
            <TableContainer component={Paper} sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell sx={{ fontWeight: 700 }}>KPI</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Current</TableCell>
                            {showComparison && <TableCell align="right" sx={{ fontWeight: 700 }}>Previous</TableCell>}
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Target</TableCell>
                            {showComparison && <TableCell align="center" sx={{ fontWeight: 700 }}>Change</TableCell>}
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {kpiData.map((kpi) => {
                            const performanceColor = getPerformanceColor(kpi.value, kpi);
                            const trendColor = getTrendColor(kpi.change, kpi.lowerIsBetter);

                            return (
                                <TableRow key={kpi.id} hover>
                                    <TableCell>{kpi.fullName}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600, color: performanceColor }}>
                                        {formatValue(kpi.value, kpi.unit)}
                                    </TableCell>
                                    {showComparison && (
                                        <TableCell align="right">
                                            {formatValue(kpi.previousValue, kpi.unit)}
                                        </TableCell>
                                    )}
                                    <TableCell align="right">{formatValue(kpi.target, kpi.unit)}</TableCell>
                                    {showComparison && (
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                                {((kpi.lowerIsBetter && kpi.change < 0) || (!kpi.lowerIsBetter && kpi.change > 0)) ? (
                                                    <TrendingUpIcon sx={{ fontSize: '1.25rem', color: trendColor }} />
                                                ) : (
                                                    <TrendingDownIcon sx={{ fontSize: '1.25rem', color: trendColor }} />
                                                )}
                                                <Typography variant="body2" sx={{ color: trendColor, fontWeight: 600 }}>
                                                    {kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent.toFixed(1)}%
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    )}
                                    <TableCell align="center">
                                        <Box
                                            sx={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                backgroundColor: performanceColor,
                                                margin: '0 auto',
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    // If a KPI is selected, show detail view
    if (selectedKPI) {
        return (
            <KPIDetailView
                kpi={selectedKPI}
                onBack={handleBackToList}
                dateRange={{ startDate, endDate }}
            />
        );
    }

    return (
        <PerformanceContainer>
            {/* Header */}
            <Box sx={{ mb: 2 }}>
                <PageTitle variant="h5">
                    My Performance
                </PageTitle>
            </Box>

            {/* Filters */}
            <FilterContainer>
                <StyledFormControl size="small">
                    <Select
                        value={dateRangePreset}
                        onChange={handleDateRangeChange}
                        displayEmpty
                    >
                        {dateRangePresets.map(preset => (
                            <MenuItem key={preset.id} value={preset.id}>
                                {preset.label}
                            </MenuItem>
                        ))}
                    </Select>
                </StyledFormControl>

                <ComparisonChip
                    icon={<CompareIcon />}
                    label="Compare with Previous Period"
                    onClick={toggleComparison}
                    active={showComparison}
                />
            </FilterContainer>

            {/* View Switcher */}
            <ViewSwitcherContainer>
                <StyledToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={handleViewChange}
                    aria-label="view mode"
                >
                    <ToggleButton value="cards" aria-label="card view">
                        <CardViewIcon sx={{ mr: 1 }} />
                        Cards
                    </ToggleButton>
                    <ToggleButton value="list" aria-label="list view">
                        <ListViewIcon sx={{ mr: 1 }} />
                        List
                    </ToggleButton>
                    <ToggleButton value="table" aria-label="table view">
                        <TableViewIcon sx={{ mr: 1 }} />
                        Table
                    </ToggleButton>
                </StyledToggleButtonGroup>
            </ViewSwitcherContainer>

            {/* Render View Based on Mode */}
            {viewMode === 'cards' && renderCardView()}
            {viewMode === 'list' && renderListView()}
            {viewMode === 'table' && renderTableView()}
        </PerformanceContainer>
    );
};

export default PerformancePage;
