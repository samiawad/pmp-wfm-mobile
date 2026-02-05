import { styled } from '@mui/material/styles';
import {
    Box,
    Card,
    CardContent,
    Typography,
    LinearProgress,
    Chip,
    Grid,
    Avatar,
    Divider,
} from '@mui/material';
import {
    CalendarMonth as CalendarIcon,
    TrendingUp as TrendingUpIcon,
    EmojiEvents as TrophyIcon,
    AccessTime as ClockIcon,
    CheckCircle as CheckIcon,
    Warning as WarningIcon,
    Phone as PhoneIcon,
} from '@mui/icons-material';

// ============================================
// Styled Components
// ============================================

const DashboardContainer = styled(Box)(({ theme }) => ({
    paddingBottom: theme.spacing(2),
    backgroundColor: '#e7e7e7',
    minHeight: '100vh',
    margin: '-var(--spacing-md)',
    padding: 'var(--spacing-md)',
}));

const WelcomeSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

const WelcomeTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    color: 'var(--color-on-background)',
    marginBottom: theme.spacing(0.5),
}));

// Modern Card with gradient and glassmorphism
const ModernCard = styled(Card)(({ theme, gradient }) => ({
    marginBottom: theme.spacing(2),
    background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
        pointerEvents: 'none',
    },
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
    },
}));

const GlassCard = styled(Card)(({ theme, bgColor }) => ({
    marginBottom: theme.spacing(2),
    background: bgColor || 'rgba(255, 255, 255, 0.7)',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px) scale(1.02)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    },
}));

const StatCard = styled(Card)(({ theme, accentColor }) => ({
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    backdropFilter: 'blur(10px)',
    border: `2px solid ${accentColor || '#e0e0e0'}`,
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
        pointerEvents: 'none',
    },
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 28px ${accentColor}30`,
        borderColor: accentColor,
    },
}));

const StyledAvatar = styled(Avatar)(({ theme, bgGradient }) => ({
    background: bgGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    width: 48,
    height: 48,
    marginRight: theme.spacing(2),
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
}));

const ModernChip = styled(Chip)(({ theme, chipColor }) => ({
    background: chipColor || 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    color: 'white',
    fontWeight: 600,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    border: 'none',
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    '& .MuiLinearProgress-bar': {
        background: 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)',
        borderRadius: 5,
        boxShadow: '0 2px 8px rgba(17, 153, 142, 0.3)',
    },
}));

const ActionItemBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1.5),
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    transition: 'all 0.2s ease',
    '&:hover': {
        background: 'rgba(255, 255, 255, 1)',
        transform: 'translateX(4px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
}));

// ============================================
// Component
// ============================================

const HomeDashboard = () => {
    return (
        <DashboardContainer>
            {/* Welcome Section */}
            <WelcomeSection>
                <WelcomeTitle variant="h5">
                    Welcome back, Musab
                </WelcomeTitle>
                <Typography variant="body2" color="text.secondary">
                    Here's your performance overview for today
                </Typography>
            </WelcomeSection>

            {/* Next Shift Card - WFM */}
            <ModernCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <StyledAvatar bgGradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                            <CalendarIcon />
                        </StyledAvatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
                                Next Shift
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                Tomorrow, Feb 5
                            </Typography>
                        </Box>
                        <ModernChip
                            label="Confirmed"
                            size="small"
                            icon={<CheckIcon />}
                            chipColor="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                        />
                    </Box>
                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Start Time
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: 'white' }}>
                                9:00 AM
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                End Time
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: 'white' }}>
                                5:00 PM
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </ModernCard>

            {/* Performance Snapshot - PMP */}
            <GlassCard bgColor="rgba(243, 229, 245, 0.8)">
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <StyledAvatar bgGradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
                            <TrendingUpIcon />
                        </StyledAvatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Performance Score
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Feb 1 - Today
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                85%
                            </Typography>
                            <ModernChip
                                label="+5%"
                                size="small"
                                chipColor="linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                            />
                        </Box>
                        <StyledLinearProgress variant="determinate" value={85} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                        Great job! You're in the top quartile
                    </Typography>
                </CardContent>
            </GlassCard>

            {/* Quick Stats Grid */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {/* Adherence - WFM */}
                <Grid item size={4} sx={{ display: 'flex' }}>
                    <StatCard accentColor="#ff9800">
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <ClockIcon sx={{ color: '#ff9800', fontSize: 20, mr: 1 }} />
                                <Typography variant="caption" color="text.secondary">
                                    Adherence
                                </Typography>
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                                92%
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#11998e', fontWeight: 600 }}>
                                ↑ 3% from last week
                            </Typography>
                        </CardContent>
                    </StatCard>
                </Grid>

                {/* Current Reward - PMP */}
                <Grid item size={4} sx={{ display: 'flex' }}>
                    <StatCard accentColor="#9c27b0">
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <TrophyIcon sx={{ color: '#9c27b0', fontSize: 20, mr: 1 }} />
                                <Typography variant="caption" color="text.secondary">
                                    Competition
                                </Typography>
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                                #3
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#9c27b0', fontWeight: 600 }}>
                                Best Sales
                            </Typography>
                        </CardContent>
                    </StatCard>
                </Grid>
                {/* AHT */}
                <Grid item size={4} sx={{ display: 'flex' }}>
                    <StatCard accentColor="#2196f3">
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PhoneIcon sx={{ color: '#2196f3', fontSize: 20, mr: 1 }} />
                                <Typography variant="caption" color="text.secondary">
                                    AHT
                                </Typography>
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                                250s
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#2196f3', fontWeight: 600 }}>
                                Average Handle Time
                            </Typography>
                        </CardContent>
                    </StatCard>
                </Grid>
            </Grid>

            {/* Pending Actions - Mixed */}
            <ModernCard gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)">
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <StyledAvatar bgGradient="linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%)">
                            <WarningIcon />
                        </StyledAvatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Pending Actions
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                3 items need your attention
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <ActionItemBox>
                            <Typography variant="body2">Complete Q1 Evaluation</Typography>
                            <Chip label="PMP" size="small" color="secondary" />
                        </ActionItemBox>
                        <ActionItemBox>
                            <Typography variant="body2">Approve Shift Swap</Typography>
                            <Chip label="WFM" size="small" color="primary" />
                        </ActionItemBox>
                        <ActionItemBox>
                            <Typography variant="body2">Review Coaching Plan</Typography>
                            <Chip label="PMP" size="small" color="secondary" />
                        </ActionItemBox>
                    </Box>
                </CardContent>
            </ModernCard>
        </DashboardContainer>
    );
};

export default HomeDashboard;
