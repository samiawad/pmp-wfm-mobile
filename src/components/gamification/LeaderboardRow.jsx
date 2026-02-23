import React from 'react';
import { Box, Typography, styled, Avatar } from '@mui/material';
import UserHoverCard from './UserHoverCard';

const getLevelStyles = (level) => {
    if (level >= 50) return { frameColor: '#9E9E9E', glow: 'none', gradient: 'none', badge: 'Platinum' };
    if (level >= 30) return { frameColor: '#FFD700', glow: 'none', gradient: 'none', badge: 'Gold' };
    if (level >= 15) return { frameColor: '#C0C0C0', glow: 'none', gradient: 'none', badge: 'Silver' };
    return { frameColor: '#8B5A2B', glow: 'none', gradient: 'none', badge: 'Wood' };
};

const RowContainer = styled(Box)(({ theme, levelStyles }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    background: 'var(--surface-color)',
    // backgroundImage: levelStyles.gradient, // Removed as gradient is 'none'
    borderRadius: 12,
    border: `1px solid var(--border-color)`,
    borderLeft: `4px solid ${levelStyles.frameColor}`,
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    '&:hover': {
        transform: 'translateX(5px)',
        backgroundColor: 'var(--bg-color)',
        borderColor: levelStyles.frameColor,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }
}));

const AvatarFrame = styled(Box)(({ color, glow }) => ({
    width: 52,
    height: 52,
    borderRadius: '50%',
    padding: 2,
    background: `linear-gradient(135deg, ${color} 0%, transparent 100%)`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: glow,
}));

const RankNumber = styled(Typography)({
    width: 40,
    fontWeight: 800,
    fontSize: '1.2rem',
    color: 'var(--text-secondary)',
    textAlign: 'center',
});

const LeaderboardRow = ({ user, onClick }) => {
    const styles = getLevelStyles(user.level);

    return (
        <UserHoverCard user={user} styles={styles}>
            <RowContainer levelStyles={styles} onClick={onClick}>
                <RankNumber>#{user.rank}</RankNumber>

                <AvatarFrame color={styles.frameColor} glow={styles.glow} sx={{ mr: 2, ml: 1 }}>
                    <Avatar src={user.avatar} sx={{ width: 44, height: 44 }} />
                </AvatarFrame>

                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {user.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: styles.frameColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {styles.badge} Tier
                    </Typography>
                </Box>

                <Box sx={{ textAlign: 'right', mr: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: 'var(--primary-color)' }}>
                        Lvl {user.level}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                        {user.totalGold.toLocaleString()} Gold
                    </Typography>
                </Box>
            </RowContainer>
        </UserHoverCard>
    );
};

export default LeaderboardRow;
