import React from 'react';
import { Box, Typography, styled, Tooltip } from '@mui/material';
import { EmojiEvents } from '@mui/icons-material';

const GridContainer = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', // Ensures equal distribution of space
    gap: theme.spacing(2),
    marginBottom: theme.spacing(4),
    width: '100%',
    boxSizing: 'border-box'
}));

const TrophyCard = styled(Box)(({ theme, tier, active }) => {
    const isGold = tier === 'Gold';
    const isSilver = tier === 'Silver';
    const isBronze = tier === 'Bronze';

    let borderColor = 'var(--border-color)';
    let bgColor = 'var(--surface-color)';
    let iconColor = 'var(--text-secondary)';

    if (active) {
        if (isGold) { borderColor = '#FFD700'; bgColor = '#FFFDE7'; iconColor = '#FFD700'; }
        if (isSilver) { borderColor = '#C0C0C0'; bgColor = '#FAFAFA'; iconColor = '#C0C0C0'; }
        if (isBronze) { borderColor = '#CD7F32'; bgColor = '#EFEBE9'; iconColor = '#CD7F32'; }
    }

    return {
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        background: bgColor,
        border: `2px solid ${borderColor}`,
        borderRadius: 16,
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'all 0.3s ease',
        opacity: active ? 1 : 0.6,
        filter: active ? 'none' : 'grayscale(100%)',
        boxShadow: active ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
        '&:hover': active ? {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        } : {},
        '& .trophy-icon': {
            color: iconColor,
            fontSize: 50,
            marginBottom: theme.spacing(1),
            filter: active && isGold ? 'drop-shadow(0px 2px 4px rgba(255,215,0,0.5))' : 'none'
        }
    };
});

const MultiplierBadge = styled(Box)({
    position: 'absolute',
    top: -10,
    right: -10,
    background: 'var(--primary-color)',
    color: '#FFF',
    fontWeight: 900,
    fontSize: '0.75rem',
    padding: '4px 8px',
    borderRadius: 12,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

const badgesData = [
    { id: 1, name: "QA Perfect Week", tier: 'Gold', active: true, multiplier: 5, desc: "Maintained 100% QA for a week." },
    { id: 2, name: "Speed Demon", tier: 'Silver', active: true, multiplier: 1, desc: "Top 10% lowest AHT." },
    { id: 3, name: "Streak Master", tier: 'Gold', active: true, multiplier: 12, desc: "Logged in on time 30 days straight." },
    { id: 4, name: "Helpful Hand", tier: 'Bronze', active: true, multiplier: 2, desc: "Assisted 5 peers in chat." },
    { id: 5, name: "Survey Champion", tier: 'Silver', active: false, multiplier: 0, desc: "Top CSAT score for the month." },
    { id: 6, name: "Resolution King", tier: 'Gold', active: false, multiplier: 0, desc: "Highest first call resolution." },
];

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: '1.2rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: theme.spacing(2),
    borderBottom: '2px solid var(--border-color)',
    paddingBottom: theme.spacing(1)
}));

const BadgeGrid = () => {
    const earnedBadges = badgesData.filter(b => b.active);
    const availableBadges = badgesData.filter(b => !b.active);

    return (
        <Box>
            {earnedBadges.length > 0 && (
                <>
                    <SectionTitle>Earned</SectionTitle>
                    <GridContainer>
                        {earnedBadges.map(badge => (
                            <Tooltip key={badge.id} title={`${badge.name} - ${badge.desc}`} placement="top" arrow>
                                <TrophyCard tier={badge.tier} active={badge.active}>
                                    {badge.active && badge.multiplier > 1 && (
                                        <MultiplierBadge>x{badge.multiplier}</MultiplierBadge>
                                    )}

                                    <EmojiEvents className="trophy-icon" />

                                    <Typography variant="caption" sx={{ fontWeight: 700, textAlign: 'center', lineHeight: 1.2, color: 'var(--text-primary)' }}>
                                        {badge.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'var(--text-secondary)', mt: 0.5 }}>
                                        {badge.tier}
                                    </Typography>
                                </TrophyCard>
                            </Tooltip>
                        ))}
                    </GridContainer>
                </>
            )}

            {availableBadges.length > 0 && (
                <>
                    <SectionTitle>Available</SectionTitle>
                    <GridContainer>
                        {availableBadges.map(badge => (
                            <Tooltip key={badge.id} title={`${badge.name} - ${badge.desc}`} placement="top" arrow>
                                <TrophyCard tier={badge.tier} active={badge.active}>
                                    <EmojiEvents className="trophy-icon" />
                                    <Typography variant="caption" sx={{ fontWeight: 700, textAlign: 'center', lineHeight: 1.2, color: 'var(--text-primary)' }}>
                                        {badge.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'var(--text-secondary)', mt: 0.5 }}>
                                        {badge.tier}
                                    </Typography>
                                </TrophyCard>
                            </Tooltip>
                        ))}
                    </GridContainer>
                </>
            )}
        </Box>
    );
};

export default BadgeGrid;
