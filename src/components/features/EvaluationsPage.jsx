import React from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Chip,
    Avatar,
    Divider,
    IconButton,
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import {
    RateReview as EvaluationIcon,
    TrendingUp as TrendIcon,
    Assignment as FormIcon,
    ChevronRight as ChevronRightIcon,
    Star as StarIcon,
} from '@mui/icons-material';

// ============================================
// Styled Components (Consistent with Coaching/Rewards)
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

const scoreTrendData = [
    { month: 'Jan', score: 88 },
    { month: 'Feb', score: 85 },
    { month: 'Mar', score: 92 },
    { month: 'Apr', score: 90 },
    { month: 'May', score: 94 },
    { month: 'Jun', score: 96 },
];

const recentEvaluations = [
    { id: 1, form: 'Call Quality Form V2', date: 'June 10, 2026', evaluator: 'Sarah Supervisor', score: 98, status: 'Excellent' },
    { id: 2, form: 'Email Etiquette', date: 'June 05, 2026', evaluator: 'Mike Manager', score: 85, status: 'Good' },
    { id: 3, form: 'Chat Protocol', date: 'May 28, 2026', evaluator: 'Sarah Supervisor', score: 92, status: 'Excellent' },
    { id: 4, form: 'Call Quality Form V2', date: 'May 15, 2026', evaluator: 'Mike Manager', score: 78, status: 'Average' },
];

const getScoreColor = (score) => {
    if (score >= 90) return '#4caf50'; // Green
    if (score >= 80) return '#ff9800'; // Orange
    return '#f44336'; // Red
};

// ============================================
// Component
// ============================================

const EvaluationsPage = () => {
    // Calculate Average
    const avgScore = Math.round(scoreTrendData.reduce((acc, curr) => acc + curr.score, 0) / scoreTrendData.length);

    return (
        <PageContainer>
            <PageHeader>
                <PageTitle variant="h4">My Evaluations</PageTitle>
                <Typography variant="body1" color="text.secondary">
                    Performance reviews and quality scores
                </Typography>
            </PageHeader>

            {/* Row 1: Stats */}
            <RowContainer>
                <DashboardCard>
                    <StatCardContent>
                        <StatValue>{avgScore}%</StatValue>
                        <StatLabel>Average Score</StatLabel>
                    </StatCardContent>
                </DashboardCard>
                <DashboardCard>
                    <StatCardContent>
                        <StatValue>{recentEvaluations.length}</StatValue>
                        <StatLabel>Total Reviews</StatLabel>
                    </StatCardContent>
                </DashboardCard>
            </RowContainer>

            {/* Row 2: Trend Chart */}
            <RowContainer>
                <DashboardCard>
                    <CardHeader>
                        <Avatar sx={{ bgcolor: '#e3f2fd', color: '#2196f3' }}>
                            <TrendIcon />
                        </Avatar>
                        <CardTitle>Score Trend</CardTitle>
                    </CardHeader>
                    <Box sx={{ height: 200, width: '100%', p: 2 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={scoreTrendData}>
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
                                    stroke="#2196f3"
                                    strokeWidth={4}
                                    dot={{ r: 5, strokeWidth: 2, fill: '#fff', stroke: '#2196f3' }}
                                    activeDot={{ r: 7, strokeWidth: 0, fill: '#2196f3' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </DashboardCard>
            </RowContainer>

            {/* Row 3: Recent Evaluations List */}
            <RowContainer>
                <DashboardCard>
                    <CardHeader>
                        <Avatar sx={{ bgcolor: '#f3e5f5', color: '#9c27b0' }}>
                            <EvaluationIcon />
                        </Avatar>
                        <CardTitle>Recent Evaluations</CardTitle>
                    </CardHeader>
                    <List sx={{ p: 0 }}>
                        {recentEvaluations.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <ListItem
                                    alignItems="center"
                                    sx={{ py: 2.5, px: 3 }}
                                    secondaryAction={
                                        <IconButton edge="end">
                                            <ChevronRightIcon />
                                        </IconButton>
                                    }
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: 'transparent',
                                                border: `2px solid ${getScoreColor(item.score)}`,
                                                color: getScoreColor(item.score),
                                                fontWeight: 800,
                                                width: 50,
                                                height: 50
                                            }}
                                        >
                                            {item.score}
                                        </Avatar>
                                    </Box>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" fontWeight="700" color="#2c3e50">
                                                {item.form}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box mt={0.5}>
                                                <Typography variant="body2" color="text.secondary" fontWeight="500">
                                                    By {item.evaluator}
                                                </Typography>
                                                <Typography variant="caption" color="text.disabled">
                                                    {item.date}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                    <Chip
                                        label={item.status}
                                        size="small"
                                        sx={{
                                            mr: 1,
                                            display: { xs: 'none', sm: 'flex' },
                                            bgcolor: `${getScoreColor(item.score)}15`,
                                            color: getScoreColor(item.score),
                                            fontWeight: 700
                                        }}
                                    />
                                </ListItem>
                                {index < recentEvaluations.length - 1 && <Divider component="li" variant="inset" sx={{ ml: 11 }} />}
                            </React.Fragment>
                        ))}
                    </List>
                </DashboardCard>
            </RowContainer>

        </PageContainer>
    );
};

export default EvaluationsPage;
