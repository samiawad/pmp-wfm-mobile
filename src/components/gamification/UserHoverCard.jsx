import React from 'react';
import { Tooltip, Box, Typography, Avatar, styled } from '@mui/material';
import { LocalFireDepartment, WorkspacePremium as BadgeIcon } from '@mui/icons-material';

const CardContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    background: 'var(--surface-color)',
    border: '1px solid var(--border-color)',
    borderRadius: 16,
    minWidth: 280,
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
}));

const MiniBadge = styled(Box)(({ tier }) => {
    const colors = {
        Gold: '#FFD700',
        Silver: '#C0C0C0',
        Bronze: '#CD7F32'
    };
    return {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: 'var(--bg-color)',
        border: `1px solid ${colors[tier] || 'var(--border-color)'}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: colors[tier] || 'var(--text-secondary)',
    };
});

const UserHoverCard = ({ user, styles, children }) => {
    const tooltipContent = (
        <CardContainer>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={user.avatar} sx={{ width: 60, height: 60, border: `2px solid ${styles.frameColor}` }} />
                <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                        {user.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: styles.frameColor, fontWeight: 700 }}>
                            Level {user.level}
                        </Typography>
                        {user.activeStreak > 0 && (
                            <Typography variant="caption" sx={{ color: '#FF8C00', display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                                <LocalFireDepartment sx={{ fontSize: 14 }} /> {user.activeStreak}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>

            <Typography variant="caption" sx={{ color: 'var(--text-secondary)', display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                Recent Achievements
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                {user.recentBadges.length > 0 ? (
                    user.recentBadges.map((tier, idx) => (
                        <MiniBadge key={idx} tier={tier}>
                            <BadgeIcon sx={{ fontSize: 18 }} />
                        </MiniBadge>
                    ))
                ) : (
                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        No recent achievements
                    </Typography>
                )}
            </Box>
        </CardContainer>
    );

    return (
        <Tooltip
            title={tooltipContent}
            placement="right"
            arrow
            componentsProps={{
                tooltip: {
                    sx: {
                        bgcolor: 'transparent',
                        maxWidth: 'none',
                        p: 0,
                        m: 0,
                    }
                },
                arrow: {
                    sx: {
                        color: '#0A0E17',
                    }
                }
            }}
        >
            <Box>{children}</Box>
        </Tooltip>
    );
};

export default UserHoverCard;
