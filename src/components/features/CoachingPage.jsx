import React from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Avatar,
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
    EmojiEvents as TrophyIcon,
    TrendingUp as ImprovementIcon,
    School as SessionIcon,
    CheckCircle as CompletedIcon,
    Timeline as MilestoneIcon,
    TrendingFlat as NeutralIcon,
} from '@mui/icons-material';

// ============================================
// Styled Components
// ============================================

const PageContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    // paddingBottom: theme.spacing(12),
    minHeight: '100vh',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3), // Consistent vertical gap between rows
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

// A generic row container
const RowContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    gap: theme.spacing(3), // Consistent horizontal gap
}));

const DashboardCard = styled(Card)(({ theme }) => ({
    borderRadius: '24px',
    boxShadow: '0 8px 24px rgba(149, 157, 165, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.5)',
    flex: 1, // Ensures it takes available space in a flex container
    width: '100%', // Default to full width
}));

const CardHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2.5),
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    backgroundColor: '#fff',
}));

const CardTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    fontSize: '1.05rem',
    color: '#2c3e50',
}));

const StatCardContent = styled(CardContent)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: `${theme.spacing(4)} !important`,
}));

const StatValue = styled(Typography)(({ theme }) => ({
    fontWeight: 800,
    fontSize: '2.75rem',
    color: theme.palette.primary.main,
    lineHeight: 1,
    marginBottom: theme.spacing(1),
    letterSpacing: '-1px',
}));

const StatLabel = styled(Typography)(({ theme }) => ({
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#7f8c8d',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
}));

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
    { name: 'Quality', value: 45, color: '#4facfe' },
    { name: 'AHT', value: 30, color: '#00f2fe' },
    { name: 'Compliance', value: 25, color: '#a18cd1' },
];

const milestones = [
    { id: 1, title: 'Quality Champion', desc: 'Achieved 95% Quality for 2 months', date: 'June 2026', icon: <TrophyIcon htmlColor="#fff" />, iconBg: '#ffb347' },
    { id: 2, title: 'AHT Improver', desc: 'Reduced AHT by 15%', date: 'May 2026', icon: <ImprovementIcon htmlColor="#fff" />, iconBg: '#00c6ff' },
    { id: 3, title: 'Newbie No More', desc: 'Completed 5 Coaching Sessions', date: 'April 2026', icon: <SessionIcon htmlColor="#fff" />, iconBg: '#b993d6' },
];

const sessions = [
    { id: 101, title: 'Weekly Quality Review', date: 'June 15, 2026', status: 'Completed', kpi: 'Quality' },
    { id: 102, title: 'AHT Optimization', date: 'June 22, 2026', status: 'Scheduled', kpi: 'AHT' },
    { id: 103, title: 'Compliance Refresh', date: 'May 28, 2026', status: 'Completed', kpi: 'Compliance' },
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

            {/* Row 1: Stats Cards (Split Row 50/50 using Flex) */}
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

            {/* Row 2: Performance Trend (Full Width) */}
            <RowContainer>
                <DashboardCard>
                    <CardHeader>
                        <Avatar sx={{ bgcolor: '#d4fc79', color: '#2ecc71' }}>
                            <ImprovementIcon />
                        </Avatar>
                        <CardTitle>Performance Trend</CardTitle>
                    </CardHeader>
                    <Box sx={{ height: 300, width: '100%', p: 3 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecf0f1" />
                                <XAxis
                                    dataKey="month"
                                    interval={0} // Forces all labels to be shown
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
                                    stroke="#4facfe"
                                    strokeWidth={5}
                                    dot={{ r: 6, strokeWidth: 3, fill: '#fff', stroke: '#4facfe' }}
                                    activeDot={{ r: 8, strokeWidth: 0, fill: '#00f2fe' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </DashboardCard>
            </RowContainer>

            {/* Row 3: Training Focus (Full Width) */}
            <RowContainer>
                <DashboardCard>
                    <CardHeader>
                        <Avatar sx={{ bgcolor: '#ffecd2', color: '#ffb347' }}>
                            <SessionIcon />
                        </Avatar>
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
                                    formatter={(value) => <span style={{ color: '#7f8c8d', fontWeight: 600, fontSize: '0.9rem', marginRight: 15 }}>{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </DashboardCard>
            </RowContainer>

            {/* Row 4: Achievements (Full Width) */}
            <RowContainer>
                <DashboardCard>
                    <CardHeader>
                        <Avatar sx={{ bgcolor: '#e0c3fc', color: '#8ec5fc' }}>
                            <MilestoneIcon htmlColor="#6a11cb" />
                        </Avatar>
                        <CardTitle>Achievements</CardTitle>
                    </CardHeader>
                    <List sx={{ p: 0 }}>
                        {milestones.map((milestone, index) => (
                            <React.Fragment key={milestone.id}>
                                <ListItem alignItems="center" sx={{ py: 2.5, px: 3 }}>
                                    <ListItemIcon sx={{ minWidth: 56 }}>
                                        <Avatar sx={{ bgcolor: milestone.iconBg, borderRadius: '12px', width: 44, height: 44 }}>
                                            {milestone.icon}
                                        </Avatar>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" fontWeight="700" color="#2c3e50">
                                                {milestone.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box mt={0.5}>
                                                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                                                    {milestone.desc}
                                                </Typography>
                                                <Typography variant="caption" color="primary" fontWeight="600" sx={{ mt: 0.5, display: 'block' }}>
                                                    {milestone.date}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {index < milestones.length - 1 && <Divider component="li" variant="inset" sx={{ ml: 10, mr: 3 }} />}
                            </React.Fragment>
                        ))}
                    </List>
                </DashboardCard>
            </RowContainer>

            {/* Row 5: Recent Sessions (Full Width) */}
            <RowContainer>
                <DashboardCard>
                    <CardHeader>
                        <Avatar sx={{ bgcolor: '#8fd3f4', color: '#005bea' }}>
                            <CompletedIcon />
                        </Avatar>
                        <CardTitle>Recent Sessions</CardTitle>
                    </CardHeader>
                    <List sx={{ p: 0 }}>
                        {sessions.map((session, index) => (
                            <React.Fragment key={session.id}>
                                <ListItem sx={{ py: 2.5, px: 3, display: 'flex', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="subtitle1" fontWeight="700" color="#2c3e50">
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
                                                backgroundColor: '#eef2f3',
                                                color: '#34495e',
                                                fontWeight: 700,
                                                height: 24,
                                                border: 'none',
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            {session.status === 'Completed' ?
                                                <CompletedIcon sx={{ fontSize: 16, color: '#2ecc71' }} /> :
                                                <NeutralIcon sx={{ fontSize: 16, color: '#f1c40f' }} />
                                            }
                                            <Typography
                                                variant="caption"
                                                fontWeight="600"
                                                sx={{
                                                    color: session.status === 'Completed' ? '#2ecc71' : '#f1c40f'
                                                }}
                                            >
                                                {session.status}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </ListItem>
                                {index < sessions.length - 1 && <Divider component="li" sx={{ mx: 3 }} />}
                            </React.Fragment>
                        ))}
                    </List>
                </DashboardCard>
            </RowContainer>

        </PageContainer>
    );
};

export default CoachingPage;
