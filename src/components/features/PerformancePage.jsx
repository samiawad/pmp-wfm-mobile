import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    SwipeableDrawer,
    Radio,
    IconButton,
    Divider,
    Switch,
    Tooltip as MuiTooltip,
} from '@mui/material';
import {
    GridView as CardViewIcon,
    ViewList as ListViewIcon,
    TableChart as TableViewIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    CompareArrows as CompareIcon,
    Close as CloseIcon,
    CalendarToday as CalendarIcon,
    Check as CheckIcon,
    AccessTime as LastUpdatedIcon,
    Tune as TuneIcon,
    FilterAlt as FilterIcon,
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
        unit: 's',
        target: 240,
        lowerIsBetter: true,
        aggregationType: 'average', // average, sum, or last
        thresholds: { good: 240, average: 300 },
        lastUpdated: '17/02/2026 at 3:57 PM',
    },
    {
        id: 'adherence',
        name: 'Adherence',
        unit: '%',
        target: 90,
        lowerIsBetter: false,
        aggregationType: 'average',
        thresholds: { good: 90, average: 80 },
        lastUpdated: '17/02/2026 at 3:45 PM',
    },
    {
        id: 'ctc',
        name: 'CTC',
        unit: '',
        target: 4,
        lowerIsBetter: true,
        aggregationType: 'sum',
        thresholds: { good: 28, average: 42 }, // 4*7 days, 6*7 days
        lastUpdated: '17/02/2026 at 2:30 PM',
    },
    {
        id: 'ctb',
        name: 'CTB',
        unit: '',
        target: 5,
        lowerIsBetter: true,
        aggregationType: 'sum',
        thresholds: { good: 35, average: 49 }, // 5*7 days, 7*7 days
        lastUpdated: '17/02/2026 at 1:15 PM',
    },
    {
        id: 'ctcom',
        name: 'CTCOM',
        unit: '',
        target: 2,
        lowerIsBetter: true,
        aggregationType: 'sum',
        thresholds: { good: 14, average: 28 }, // 2*7 days, 4*7 days
        lastUpdated: '17/02/2026 at 12:50 PM',
    },
    {
        id: 'hold',
        name: 'Hold %',
        unit: '%',
        target: 3,
        lowerIsBetter: true,
        aggregationType: 'average',
        thresholds: { good: 3, average: 5 },
        lastUpdated: '17/02/2026 at 11:20 AM',
    },
    {
        id: 'fcr',
        name: 'FCR',
        unit: '%',
        target: 80,
        lowerIsBetter: false,
        aggregationType: 'average',
        thresholds: { good: 80, average: 70 },
        lastUpdated: '17/02/2026 at 10:05 AM',
    },
    {
        id: 'csat',
        name: 'CSAT',
        unit: '%',
        target: 85,
        lowerIsBetter: false,
        aggregationType: 'average',
        thresholds: { good: 85, average: 70 },
        lastUpdated: '16/02/2026 at 4:30 PM',
    },
    {
        id: 'quality',
        name: 'Quality',
        unit: '%',
        target: 85,
        lowerIsBetter: false,
        aggregationType: 'average',
        thresholds: { good: 85, average: 75 },
        lastUpdated: '16/02/2026 at 3:15 PM',
    },
    {
        id: 'occupancy',
        name: 'Occupancy',
        unit: '%',
        target: 75,
        lowerIsBetter: false,
        aggregationType: 'average',
        thresholds: { good: 70, average: 60 },
        lastUpdated: '16/02/2026 at 2:00 PM',
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

const getStatusLabel = (value, kpi) => {
    const color = getPerformanceColor(value, kpi);
    if (color === '#4caf50') return 'Good';
    if (color === '#ff9800') return 'Avg';
    return 'Low';
};

// ============================================
// Styled Components
// ============================================

const PerformanceContainer = styled(Box)(({ theme }) => ({
    backgroundColor: '#f5f5f5',
    width: '100%',
    padding: '0 16px 16px',
    boxSizing: 'border-box',
}));

const DragHandle = styled(Box)({
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d0d0d0',
    margin: '12px auto 8px',
});

// KPI Card Grid — 2 columns on mobile, 3 on wider screens
const KPIGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--card-spacing)',
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(3, 1fr)',
    },
}));

// List View Components
const ListContainer = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    borderRadius: 'var(--card-radius)',
    padding: theme.spacing(2),
}));

const KPIListItem = styled(Box)(({ theme }) => ({
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

const PerformancePage = ({ selectedKPI, onKPIClick, onBack }) => {
    const [viewMode, setViewMode] = useState('cards');
    const [dateRangePreset, setDateRangePreset] = useState('last7');
    const [showComparison, setShowComparison] = useState(false);
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

    // Draft state — only committed on Apply
    const [draftDateRangePreset, setDraftDateRangePreset] = useState('last7');
    const [draftShowComparison, setDraftShowComparison] = useState(false);

    // Badge count — how many non-default filters are active
    const activeFilterCount = [
        dateRangePreset !== 'last7',
        showComparison,
    ].filter(Boolean).length;

    const openFilterSheet = () => {
        setDraftDateRangePreset(dateRangePreset); // seed drafts from committed state
        setDraftShowComparison(showComparison);
        setIsFilterSheetOpen(true);
    };

    const applyFilters = () => {
        setDateRangePreset(draftDateRangePreset);
        setShowComparison(draftShowComparison);
        setIsFilterSheetOpen(false);
    };

    const resetFilters = () => {
        setDraftDateRangePreset('last7');
        setDraftShowComparison(false);
    };

    const closeSheet = () => {
        setIsFilterSheetOpen(false); // discard draft — do NOT apply
    };

    const toggleComparison = () => {
        setDraftShowComparison(prev => !prev);
    };

    const handleKPIClick = (kpi) => {
        if (onKPIClick) onKPIClick(kpi);
    };

    const handleBackToList = () => {
        if (onBack) onBack();
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
                    const statusLabel = getStatusLabel(kpi.value, kpi);
                    const isGood = performanceColor === '#4caf50';
                    const isPositiveTrend = (kpi.lowerIsBetter && kpi.change < 0) || (!kpi.lowerIsBetter && kpi.change > 0);

                    const CustomTooltip = ({ active, payload }) => {
                        if (active && payload && payload.length) {
                            return (
                                <Box sx={{
                                    backgroundColor: '#fff',
                                    padding: '6px 10px',
                                    borderRadius: 'var(--card-radius)',
                                    border: `1.5px solid ${performanceColor}`,
                                }}>
                                    <Typography sx={{ fontSize: '0.65rem', color: '#999' }}>{payload[0].payload.date}</Typography>
                                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: performanceColor }}>
                                        {formatValue(payload[0].value, kpi.unit)}
                                    </Typography>
                                </Box>
                            );
                        }
                        return null;
                    };

                    return (
                        // IONIC MIGRATION: replace with IonCard + IonRippleEffect
                        <Box
                            key={kpi.id}
                            // onClick={() => handleKPIClick(kpi)}
                            sx={{
                                backgroundColor: '#ffffff',
                                borderRadius: 'var(--card-radius)',
                                overflow: 'hidden',
                                // cursor: 'pointer',
                                // transition: 'transform 0.12s ease',
                                // '&:active': { transform: 'scale(0.97)' },
                            }}
                        >
                            {/* Colored top accent bar */}
                            {/* <Box sx={{ height: 4, backgroundColor: performanceColor }} /> */}

                            <Box sx={{ pt: 1.75, px: 1.75, pb: 0 }}>
                                {/* Row 1: KPI name + last-updated icon */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.25 }}>
                                    <Typography sx={{
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        color: '#64748b',
                                        letterSpacing: '0.2px',
                                        textTransform: 'uppercase',
                                    }}>
                                        {kpi.name}
                                    </Typography>

                                    {/* IONIC MIGRATION: replace MuiTooltip with IonPopover triggered on icon click */}
                                    {/* <MuiTooltip
                                        title={`Updated: ${kpi.lastUpdated}`}
                                        enterTouchDelay={0}
                                        leaveTouchDelay={3000}
                                        arrow
                                        placement="top"
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={(e) => e.stopPropagation()}
                                            sx={{
                                                p: 0.4,
                                                color: '#b0bec5',
                                                '&:hover': { color: '#78909c', backgroundColor: 'transparent' },
                                            }}
                                        >
                                            <LastUpdatedIcon sx={{ fontSize: '0.88rem' }} />
                                        </IconButton>
                                    </MuiTooltip> */}
                                </Box>

                                {/* Row 2: Big value + inline comparison */}
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mb: 0.5 }}>
                                    <Typography sx={{
                                        fontSize: '1.85rem',
                                        fontWeight: 800,
                                        color: 'var(--primary-color)',
                                        lineHeight: 1,
                                    }}>
                                        {formatValue(kpi.value, kpi.unit)}
                                    </Typography>
                                    {showComparison && kpi.change !== 0 && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                                            {isPositiveTrend
                                                ? <TrendingUpIcon sx={{ fontSize: '0.78rem', color: trendColor }} />
                                                : <TrendingDownIcon sx={{ fontSize: '0.78rem', color: trendColor }} />
                                            }
                                            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: trendColor, lineHeight: 1 }}>
                                                {kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent.toFixed(1)}%
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>

                                {/* Row 3: Target */}
                                <Typography sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                    Target: {formatValue(kpi.target, kpi.unit)}
                                </Typography>

                                <Typography sx={{
                                    fontSize: '8px',
                                    color: '#64748b',
                                }}>
                                    Updated: {kpi.lastUpdated}
                                </Typography>
                                {/* Sparkline */}
                                <Box sx={{ position: 'relative', height: 70, mx: -1.75 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={kpi.trend}>
                                            <defs>
                                                <linearGradient id={`grad-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor={performanceColor} stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor={performanceColor} stopOpacity={0.02} />
                                                </linearGradient>
                                            </defs>
                                            {/* <Tooltip content={<CustomTooltip />} /> */}
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke={performanceColor}
                                                strokeWidth={1.5}
                                                fill={`url(#grad-${kpi.id})`}
                                                dot={false}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </Box>

                            </Box>
                        </Box>
                    );
                })
                }
            </KPIGrid >
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
                        <KPIListItem key={kpi.id}>
                            <ListItemLeft>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {kpi.name}
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
                                <Typography variant="caption" sx={{ color: '#666' }}>
                                    Target: {formatValue(kpi.target, kpi.unit)}
                                </Typography>
                            </ListItemRight>
                        </KPIListItem>
                    );
                })}
            </ListContainer>
        );
    };

    // Render Table View
    const renderTableView = () => {
        return (
            <TableContainer component={Paper} sx={{ borderRadius: 'var(--card-radius)', boxShadow: 'none' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell sx={{ fontWeight: 700 }}>KPI</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Current</TableCell>
                            {showComparison && <TableCell align="right" sx={{ fontWeight: 700 }}>Previous</TableCell>}
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Target</TableCell>
                            {showComparison && <TableCell align="center" sx={{ fontWeight: 700 }}>Change</TableCell>}
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Status</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Last Update</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {kpiData.map((kpi) => {
                            const performanceColor = getPerformanceColor(kpi.value, kpi);
                            const trendColor = getTrendColor(kpi.change, kpi.lowerIsBetter);

                            return (
                                <TableRow key={kpi.id} hover>
                                    <TableCell>{kpi.name}</TableCell>
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
                                    <TableCell align="center" sx={{ fontSize: '0.75rem', color: '#666', whiteSpace: 'nowrap' }}>
                                        {kpi.lastUpdated}
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
            {/* View toggle — Segmented control, matches SchedulePage exactly */}
            {/* IONIC MIGRATION: replace with IonSegment + IonSegmentButton */}
            {/* TODO: Restore this block when you want to add tabs */}
            {/* <Box sx={{
                display: 'flex',
                backgroundColor: '#e8edf2',
                borderRadius: 'var(--card-radius)',
                padding: '4px',
                mb: 1.5,
            }}>
                {[
                    { key: 'cards', label: 'Cards', icon: <CardViewIcon sx={{ fontSize: 17 }} /> },
                    { key: 'list', label: 'List', icon: <ListViewIcon sx={{ fontSize: 17 }} /> },
                    { key: 'table', label: 'Table', icon: <TableViewIcon sx={{ fontSize: 17 }} /> },
                ].map(tab => (
                    <Box
                        key={tab.key}
                        onClick={() => setViewMode(tab.key)}
                        sx={{
                            flex: 1,
                            py: 0.9,
                            borderRadius: 'calc(var(--card-radius) - 2px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.75,
                            backgroundColor: viewMode === tab.key ? 'var(--primary-color)' : 'transparent',
                            color: viewMode === tab.key ? '#fff' : '#5a6a7a',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            userSelect: 'none',
                        }}
                    >
                        <Box sx={{ display: 'flex', color: 'inherit' }}>{tab.icon}</Box>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: viewMode === tab.key ? 600 : 500, color: 'inherit', lineHeight: 1 }}>
                            {tab.label}
                        </Typography>
                    </Box>
                ))}
            </Box> */}

            {/* Render View Based on Mode */}
            {viewMode === 'cards' && renderCardView()}
            {viewMode === 'list' && renderListView()}
            {viewMode === 'table' && renderTableView()}

            {/* ── Floating Filter Button ─────────────────────────── */}
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

            {/* ── Filter Bottom Sheet ────────────────────────────── */}
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

                    {/* ── Section: Period ── */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <CalendarIcon sx={{ fontSize: '0.95rem', color: '#94a3b8' }} />
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                            Period
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 3 }}>
                        {dateRangePresets.map((preset) => {
                            const isSelected = draftDateRangePreset === preset.id;
                            return (
                                <Box
                                    key={preset.id}
                                    onClick={() => setDraftDateRangePreset(preset.id)}
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
                                        {preset.label}
                                    </Typography>
                                    {isSelected && (
                                        <CheckIcon sx={{ fontSize: '1rem', color: 'var(--primary-color)' }} />
                                    )}
                                </Box>
                            );
                        })}
                    </Box>

                    <Divider sx={{ borderColor: '#f1f5f9', mb: 3 }} />

                    {/* ── Section: Options ── */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <CompareIcon sx={{ fontSize: '0.95rem', color: '#94a3b8' }} />
                        <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                            Options
                        </Typography>
                    </Box>

                    <Box
                        onClick={toggleComparison}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: 1.5,
                            py: 1.25,
                            borderRadius: '12px',
                            backgroundColor: draftShowComparison ? 'rgba(6,24,54,0.06)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'background-color 0.12s ease',
                            '&:active': { backgroundColor: '#e8edf2' },
                        }}
                    >
                        <Box>
                            <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>
                                Compare with previous period
                            </Typography>
                            <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', mt: 0.25 }}>
                                Show % change next to each score
                            </Typography>
                        </Box>
                        <Switch
                            checked={draftShowComparison}
                            size="small"
                            onClick={(e) => e.stopPropagation()}
                            onChange={toggleComparison}
                            sx={{
                                ml: 1,
                                '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--primary-color)' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: 'var(--primary-color)' },
                            }}
                        />
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
                    {/* Reset — outline style */}
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

                    {/* Apply — primary fill */}
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
        </PerformanceContainer>
    );
};

export default PerformancePage;
