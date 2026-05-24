import React from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
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
    RateReviewOutlined as EvaluationIcon,
    TrendingUpOutlined as TrendIcon,
    ChevronRight as ChevronRightIcon,
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

const DashboardCard = styled(Card)({
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid #e8e8e8',
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
});

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

const scoreTrendData = [
    { month: 'Jan', score: 88 },
    { month: 'Feb', score: 85 },
    { month: 'Mar', score: 92 },
    { month: 'Apr', score: 90 },
    { month: 'May', score: 94 },
    { month: 'Jun', score: 96 },
];

const recentEvaluations = [
    { id: 1, form: 'Call Quality Form V2', date: 'June 10, 2026', evaluator: 'Sarah Supervisor', score: 98,  status: 'Excellent' },
    { id: 2, form: 'Email Etiquette',      date: 'June 05, 2026', evaluator: 'Mike Manager',     score: 85,  status: 'Good' },
    { id: 3, form: 'Chat Protocol',        date: 'May 28, 2026',  evaluator: 'Sarah Supervisor', score: 92,  status: 'Excellent' },
    { id: 4, form: 'Call Quality Form V2', date: 'May 15, 2026',  evaluator: 'Mike Manager',     score: 78,  status: 'Average' },
];

const getScoreColor = (score) => {
    if (score >= 90) return '#4caf50';
    if (score >= 80) return '#ff9800';
    return '#f44336';
};

// ============================================
// Component
// ============================================

const EvaluationsPage = () => {
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

            {/* Row 2: Score Trend */}
            <RowContainer>
                <DashboardCard>
                    <CardHeader>
                        {/* Icon box — tinted bg pattern */}
                        <Box sx={{
                            width: 42, height: 42, borderRadius: 2.5, flexShrink: 0,
                            backgroundColor: 'rgba(var(--primary-rgb), 0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--primary-color)',
                        }}>
                            <TrendIcon />
                        </Box>
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
                                    stroke="var(--primary-color)"
                                    strokeWidth={4}
                                    dot={{ r: 5, strokeWidth: 2, fill: '#fff', stroke: 'var(--primary-color)' }}
                                    activeDot={{ r: 7, strokeWidth: 0, fill: 'var(--primary-color)' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </DashboardCard>
            </RowContainer>

            {/* Row 3: Recent Evaluations */}
            <RowContainer>
                <DashboardCard>
                    <CardHeader>
                        <Box sx={{
                            width: 42, height: 42, borderRadius: 2.5, flexShrink: 0,
                            backgroundColor: '#7b1fa215',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#7b1fa2',
                        }}>
                            <EvaluationIcon />
                        </Box>
                        <CardTitle>Recent Evaluations</CardTitle>
                    </CardHeader>

                    {/* Box-based rows — no List/ListItem */}
                    <Box>
                        {recentEvaluations.map((item, index) => {
                            const scoreColor = getScoreColor(item.score);
                            return (
                                <React.Fragment key={item.id}>
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center',
                                        py: 2, px: 3, gap: 2,
                                    }}>
                                        {/* Score circle */}
                                        <Box sx={{
                                            width: 50, height: 50, borderRadius: '50%', flexShrink: 0,
                                            border: `2px solid ${scoreColor}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: scoreColor,
                                            fontWeight: 800,
                                            fontSize: '0.95rem',
                                        }}>
                                            {item.score}
                                        </Box>

                                        {/* Text */}
                                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                            <Typography variant="subtitle1" fontWeight={700} color="#2c3e50" noWrap>
                                                {item.form}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                                By {item.evaluator}
                                            </Typography>
                                            <Typography variant="caption" color="text.disabled">
                                                {item.date}
                                            </Typography>
                                        </Box>

                                        {/* Status chip + chevron */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                                            <Chip
                                                label={item.status}
                                                size="small"
                                                sx={{
                                                    backgroundColor: `${scoreColor}15`,
                                                    color: scoreColor,
                                                    fontWeight: 700,
                                                    fontSize: '0.7rem',
                                                    height: 22,
                                                }}
                                            />
                                            <IconButton size="small" sx={{ color: '#ccc' }}>
                                                <ChevronRightIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                    {index < recentEvaluations.length - 1 && (
                                        <Divider sx={{ ml: '82px', mr: 3, borderColor: '#f0f0f0' }} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </Box>
                </DashboardCard>
            </RowContainer>
        </PageContainer>
    );
};

export default EvaluationsPage;
