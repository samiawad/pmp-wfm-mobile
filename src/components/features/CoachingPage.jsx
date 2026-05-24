import React from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Divider,
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    EmojiEventsOutlined as TrophyIcon,
    TrendingUpOutlined as ImprovementIcon,
    SchoolOutlined as SessionIcon,
    CheckCircleOutlined as CompletedIcon,
    TimelineOutlined as MilestoneIcon,
    TrendingFlat as NeutralIcon,
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

const PageHeader = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    width: '100%',
    marginBottom: theme.spacing(1),
}));

const PageTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 800,
    color: '#1a1a1a',
    letterSpacing: '-0.5px',
    marginBottom: theme.spacing(0.5),
}));

const RowContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

const DashboardCard = styled(Card)(({ theme }) => ({
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid #e8e8e8',
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
}));

const CardHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2.5),
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    backgroundColor: '#fff',
}));

const CardTitle = styled(Typography)({
    fontWeight: 700,
    fontSize: '1.05rem',
    color: '#2c3e50',
});

const StatCardContent = styled(CardContent)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: `${theme.spacing(4)} !important`,
}));

const StatValue = styled(Typography)({
    fontWeight: 800,
    fontSize: '2.75rem',
    color: 'var(--primary-color)',
    lineHeight: 1,
    marginBottom: 8,
    letterSpacing: '-1px',
});

const StatLabel = styled(Typography)({
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#7f8c8d',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
});

// ============================================
// Mock Data
// ============================================

const performanceData = [
    { month: 'Jan', score: 82 },
    { month: 'Feb', score: 85 },
    { month: 'Mar', score: 84 },
    { month: 'Apr', score: 88 },
    { month: 'May', score: 92 },
    { month: 'Jun', score: 95 },
];

const sessionFocusData = [
    { name: 'Quality',    value: 45, color: 'var(--primary-color)' },
    { name: 'AHT',        value: 30, color: '#4caf50' },
    { name: 'Compliance', value: 25, color: '#ff9800' },
];

const milestones = [
    {
        id: 1,
        title: 'Quality Champion',
        desc: 'Achieved 95% Quality for 2 months',
        date: 'June 2026',
        icon: <TrophyIcon />,
        color: '#f57c00',
    },
    {
        id: 2,
        title: 'AHT Improver',
        desc: 'Reduced AHT by 15%',
        date: 'May 2026',
        icon: <ImprovementIcon />,
        color: 'var(--primary-color)',
    },
    {
        id: 3,
        title: 'Newbie No More',
        desc: 'Completed 5 Coaching Sessions',
        date: 'April 2026',
        icon: <SessionIcon />,
        color: '#7b1fa2',
    },
];

const sessions = [
    { id: 101, title: 'Weekly Quality Review',  date: 'June 15, 2026',  status: 'Completed', kpi: 'Quality' },
    { id: 102, title: 'AHT Optimization',       date: 'June 22, 2026',  status: 'Scheduled', kpi: 'AHT' },
    { id: 103, title: 'Compliance Refresh',     date: 'May 28, 2026',   status: 'Completed', kpi: 'Compliance' },
];

// ============================================
// Component
// ============================================

const CoachingPage = () => {
    return (
        <PageContainer>
            <PageHeader>
                <PageTitle variant="h4">My Coaching</PageTitle>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 300, mx: 'auto', lineHeight: 1.5 }}>
                    Your personal growth dashboard
                </Typography>
            </PageHeader>

            {/* Row 1: Stats Cards */}
            <RowContainer>
                <DashboardCard>
                    <StatCardContent>
                        <StatValue>95%</StatValue>
                        <StatLabel>Quality Score</StatLabel>
                    </StatCardContent>
                </DashboardCard>
                <DashboardCard>
                    <StatCardContent>
                        <StatValue>12</StatValue>
                        <StatLabel>Sessions YTD</StatLabel>
                    </StatCardContent>
                </DashboardCard>
            </RowContainer>

            {/* Row 2: Performance Trend */}
            <RowContainer>
                <DashboardCard>
                    <CardHeader>
                        {/* Icon box — tinted bg pattern */}
                        <Box sx={{
                            width: 42, height: 42, borderRadius: 2.5, flexShrink: 0,
                            backgroundColor: '#4caf5015',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#4caf50',
                        }}>
                            <ImprovementIcon />
                        </Box>
                        <CardTitle>Performance Trend</CardTitle>
                    </CardHeader>
                    <Box sx={{ height: 300, width: '100%', p: 3 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecf0f1" />
                                <XAxis
                                    dataKey="month"
                                    interval={0}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#bdc3c7', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis hide domain={[60, 100]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                                    cursor={{ stroke: '#ecf0f1', strokeWidth: 2 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="score"
                                    stroke="var(--primary-color)"
                                    strokeWidth={5}
                                    dot={{ r: 6, strokeWidth: 3, fill: '#fff', stroke: 'var(--primary-color)' }}
                                    activeDot={{ r: 8, strokeWidth: 0, fill: 'var(--primary-color)' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </DashboardCard>
            </RowContainer>

            {/* Row 3: Training Focus */}
            <RowContainer>
                <DashboardCard>
                    <CardHeader>
                        <Box sx={{
                            width: 42, height: 42, borderRadius: 2.5, flexShrink: 0,
                            backgroundColor: '#f57c0015',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#f57c00',
                        }}>
                            <SessionIcon />
                        </Box>
                        <CardTitle>Training Focus</CardTitle>
                    </CardHeader>
                    <Box sx={{ height: 320, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pb: 3 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sessionFocusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                    cornerRadius={5}
                                >
                                    {sessionFocusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value) => (
                                        <span style={{ color: '#7f8c8d', fontWeight: 600, fontSize: '0.9rem', marginRight: 15 }}>
                                            {value}
                                        </span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </DashboardCard>
            </RowContainer>

            {/* Row 4: Achievements */}
            <RowContainer>
                <DashboardCard>
                    <CardHeader>
                        <Box sx={{
                            width: 42, height: 42, borderRadius: 2.5, flexShrink: 0,
                            backgroundColor: '#7b1fa215',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#7b1fa2',
                        }}>
                            <MilestoneIcon />
                        </Box>
                        <CardTitle>Achievements</CardTitle>
                    </CardHeader>

                    {/* Box-based rows — no List/ListItem */}
                    <Box>
                        {milestones.map((milestone, index) => (
                            <React.Fragment key={milestone.id}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2.5, px: 3 }}>
                                    <Box sx={{
                                        width: 44, height: 44, borderRadius: 2.5, flexShrink: 0,
                                        backgroundColor: `${milestone.color}15`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: milestone.color,
                                    }}>
                                        {milestone.icon}
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1" fontWeight={700} color="#2c3e50">
                                            {milestone.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4, mt: 0.25 }}>
                                            {milestone.desc}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'var(--primary-color)', fontWeight: 600, mt: 0.5, display: 'block' }}>
                                            {milestone.date}
                                        </Typography>
                                    </Box>
                                </Box>
                                {index < milestones.length - 1 && (
                                    <Divider sx={{ mx: 3, borderColor: '#f0f0f0' }} />
                                )}
                            </React.Fragment>
                        ))}
                    </Box>
                </DashboardCard>
            </RowContainer>

            {/* Row 5: Recent Sessions */}
            <RowContainer>
                <DashboardCard>
                    <CardHeader>
                        <Box sx={{
                            width: 42, height: 42, borderRadius: 2.5, flexShrink: 0,
                            backgroundColor: 'rgba(var(--primary-rgb), 0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--primary-color)',
                        }}>
                            <CompletedIcon />
                        </Box>
                        <CardTitle>Recent Sessions</CardTitle>
                    </CardHeader>

                    {/* Box-based rows */}
                    <Box>
                        {sessions.map((session, index) => (
                            <React.Fragment key={session.id}>
                                <Box sx={{
                                    py: 2.5, px: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="subtitle1" fontWeight={700} color="#2c3e50">
                                            {session.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {session.date}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                                        <Chip
                                            label={session.kpi}
                                            size="small"
                                            sx={{
                                                backgroundColor: '#e3f2fd',
                                                color: 'var(--primary-color)',
                                                fontWeight: 700,
                                                height: 24,
                                                fontSize: '0.75rem',
                                            }}
                                        />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            {session.status === 'Completed'
                                                ? <CompletedIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                                                : <NeutralIcon sx={{ fontSize: 16, color: '#ff9800' }} />
                                            }
                                            <Typography
                                                variant="caption"
                                                fontWeight={600}
                                                sx={{ color: session.status === 'Completed' ? '#4caf50' : '#ff9800' }}
                                            >
                                                {session.status}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                {index < sessions.length - 1 && (
                                    <Divider sx={{ mx: 3, borderColor: '#f0f0f0' }} />
                                )}
                            </React.Fragment>
                        ))}
                    </Box>
                </DashboardCard>
            </RowContainer>

        </PageContainer>
    );
};

export default CoachingPage;
