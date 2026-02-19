import React from 'react';
import { styled } from '@mui/material/styles';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    LinearProgress,
    Avatar,
    Chip,
    Button,
} from '@mui/material';
import {
    EmojiEvents as TrophyIcon,
    Star as StarIcon,
    LocalFireDepartment as StreakIcon,
    CardGiftcard as GiftIcon,
    Lock as LockIcon,
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

const DashboardCard = styled(Card)(({ theme }) => ({
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    border: '1px solid #e8e8e8',
    width: '100%',
    backgroundColor: '#fff',
}));

const ChallengeCard = styled(Card)(({ theme }) => ({
    minWidth: 260,
    maxWidth: 260,
    borderRadius: '12px',
    boxShadow: 'none',
    border: '2px solid #f0f0f0',
    flexShrink: 0,
    marginRight: theme.spacing(1.5),
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    overflowX: 'auto',
    paddingBottom: theme.spacing(1),
    '&::-webkit-scrollbar': {
        display: 'none',
    },
}));

// ============================================
// Mock Data
// ============================================

const activeChallenges = [
    { id: 1, title: 'Quality Week', desc: 'Maintain 95% QA score this week', progress: 80, goal: '1000 pts', icon: <StarIcon color="warning" /> },
    { id: 2, title: 'Speed Demon', desc: 'Keep AHT below 300s for 3 days', progress: 45, goal: '500 pts', icon: <StreakIcon color="error" /> },
    { id: 3, title: 'Perfect Attendance', desc: 'No late logins for a month', progress: 90, goal: '1500 pts', icon: <TrophyIcon color="success" /> },
];

const leaderboard = [
    { rank: 1, name: 'Sarah Connor', points: 12500, avatar: 'SC' },
    { rank: 2, name: 'John Doe', points: 11200, avatar: 'JD' },
    { rank: 3, name: 'You', points: 10800, avatar: 'ME' },
];

const rewards = [
    { id: 1, title: 'Amazon Gift Card', cost: 5000, locked: false },
    { id: 2, title: 'Extra Break Day', cost: 15000, locked: true },
    { id: 3, title: 'Movie Tickets', cost: 3000, locked: false },
    { id: 4, title: 'Coffee Voucher', cost: 1000, locked: false },
];

const RewardsPage = () => {
    return (
        <PageContainer>
            <PageHeader>
                <PageTitle variant="h4">Rewards & Gamification</PageTitle>
                <Typography variant="body1" color="text.secondary">
                    Level 5 - 10,800 Points
                </Typography>
            </PageHeader>

            {/* My Level Progress */}
            <DashboardCard sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle1" fontWeight={700}>Level Progress</Typography>
                    <Typography variant="caption" color="text.secondary">800 pts to Level 6</Typography>
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={80}
                    sx={{ height: 10, borderRadius: 5, backgroundColor: '#f0f0f0', '& .MuiLinearProgress-bar': { backgroundColor: '#4caf50' } }}
                />
            </DashboardCard>

            {/* Active Challenges */}
            <Box>
                <Typography variant="h6" fontWeight={700} mb={2}>Active Challenges</Typography>
                <ScrollContainer>
                    {activeChallenges.map((challenge) => (
                        <ChallengeCard key={challenge.id}>
                            <CardContent>
                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <Avatar sx={{ bgcolor: '#fff3e0' }}>{challenge.icon}</Avatar>
                                    <Chip label={challenge.goal} size="small" color="primary" sx={{ fontWeight: 700 }} />
                                </Box>
                                <Typography variant="subtitle1" fontWeight={700} gutterBottom>{challenge.title}</Typography>
                                <Typography variant="body2" color="text.secondary" mb={2} sx={{ minHeight: 40 }}>{challenge.desc}</Typography>
                                <LinearProgress variant="determinate" value={challenge.progress} sx={{ borderRadius: 4 }} />
                            </CardContent>
                        </ChallengeCard>
                    ))}
                </ScrollContainer>
            </Box>

            {/* Leaderboard Snippet */}
            <DashboardCard>
                <CardContent>
                    <Typography variant="h6" fontWeight={700} mb={2}>Top Performers</Typography>
                    {leaderboard.map((user, index) => (
                        <Box key={user.rank} display="flex" alignItems="center" py={1.5} borderBottom={index < 2 ? '1px solid #f0f0f0' : 'none'}>
                            <Typography variant="h6" fontWeight={700} width={40} color={index === 0 ? '#ffb300' : index === 1 ? '#9e9e9e' : '#795548'}>
                                #{user.rank}
                            </Typography>
                            <Avatar sx={{ bgcolor: index === 2 ? 'primary.main' : '#e0e0e0', width: 32, height: 32, fontSize: 14, mr: 2 }}>{user.avatar}</Avatar>
                            <Box flex={1}>
                                <Typography variant="subtitle2" fontWeight={700}>{user.name}</Typography>
                            </Box>
                            <Typography variant="body2" fontWeight={600} color="primary">{user.points.toLocaleString()} pts</Typography>
                        </Box>
                    ))}
                </CardContent>
            </DashboardCard>

            {/* Rewards Shop */}
            <Box>
                <Typography variant="h6" fontWeight={700} mb={2}>Rewards Shop</Typography>
                <Grid container spacing={2}>
                    {rewards.map((reward) => (
                        <Grid item size={6} key={reward.id}>
                            <DashboardCard sx={{ height: '100%', justifyContent: 'space-between' }}>
                                <CardContent sx={{ textAlign: 'center', pt: 3 }}>
                                    <Avatar sx={{ width: 48, height: 48, bgcolor: reward.locked ? '#f5f5f5' : '#e3f2fd', color: reward.locked ? '#bdbdbd' : '#2196f3', mx: 'auto', mb: 2 }}>
                                        {reward.locked ? <LockIcon /> : <GiftIcon />}
                                    </Avatar>
                                    <Typography variant="subtitle2" fontWeight={700}>{reward.title}</Typography>
                                    <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                                        {reward.cost.toLocaleString()} pts
                                    </Typography>
                                    <Button
                                        variant={reward.locked ? "outlined" : "contained"}
                                        size="small"
                                        fullWidth
                                        disabled={reward.locked}
                                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                                    >
                                        {reward.locked ? 'Locked' : 'Redeem'}
                                    </Button>
                                </CardContent>
                            </DashboardCard>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </PageContainer>
    );
};

export default RewardsPage;
