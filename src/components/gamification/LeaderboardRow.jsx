import React from 'react';
import { Box, Typography, styled, Avatar } from '@mui/material';
import UserHoverCard from './UserHoverCard';

// Left border color is always the neutral wood tone for rank 4+;
// top-3 are shown on the podium, not in rows.
const getLevelStyles = () => ({ frameColor: '#8B5A2B' });

const RowContainer = styled(Box)(({ theme, levelStyles }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.25, 1.5),
    background: 'var(--surface-color)',
    borderRadius: 10,
    border: `1px solid var(--border-color)`,
    borderLeft: `3px solid ${levelStyles.frameColor}`,
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    cursor: 'pointer',
    '&:hover': {
        transform: 'translateX(4px)',
        backgroundColor: 'var(--bg-color)',
        boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
    }
}));

const LeaderboardRow = ({ user, onClick }) => {
    const styles = getLevelStyles(user.level);
    return (
        <UserHoverCard user={user} styles={styles}>
            <RowContainer levelStyles={styles} onClick={onClick}>

                {/* Rank */}
                <Typography sx={{
                    width: 28, fontWeight: 800, fontSize: '0.8rem',
                    color: 'var(--text-secondary)', textAlign: 'center', flexShrink: 0,
                }}>
                    #{user.rank}
                </Typography>

                {/* Avatar — no colored border */}
                <Avatar src={user.avatar} sx={{ width: 38, height: 38, mx: 1.25, flexShrink: 0 }} />

                {/* Name + Milestone (competition-tied) */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography sx={{
                        fontWeight: 700, fontSize: '0.82rem',
                        color: 'var(--text-primary)', lineHeight: 1.2,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                        {user.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.68rem', color: 'var(--text-secondary)', mt: 0.25 }}>
                        Milestone{' '}
                        <Box component="span" sx={{ fontWeight: 700, color: styles.frameColor }}>
                            {user.milestone ?? '—'}
                        </Box>
                    </Typography>
                </Box>

                {/* Level (permanent) + Gold earned */}
                <Box sx={{ textAlign: 'right', flexShrink: 0, ml: 1 }}>
                    <Typography sx={{
                        fontWeight: 700, fontSize: '0.78rem',
                        color: 'var(--primary-color)', lineHeight: 1.2,
                    }}>
                        Lv. {user.level}
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: 'var(--text-secondary)', mt: 0.2 }}>
                        {user.totalGold.toLocaleString()} G
                    </Typography>
                </Box>

            </RowContainer>
        </UserHoverCard>
    );
};

export default LeaderboardRow;
