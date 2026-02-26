import React from 'react';
import { Box, Typography, styled, Grid, Avatar } from '@mui/material';
import BadgeGrid from './BadgeGrid';
import FeaturedInventory from './FeaturedInventory';
import { PRODUCT_MANAGER_USER } from '../../data/mockUser';

const ProfileHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(4),
    background: 'var(--surface-color)',
    borderLeft: '4px solid var(--primary-color)',
    borderRadius: 12,
    marginBottom: theme.spacing(4),
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
}));

const HexagonAvatar = styled(Box)({
    width: 120,
    height: 120,
    background: 'var(--primary-color)',
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const InnerHexagon = styled(Box)({
    width: 112,
    height: 112,
    background: 'var(--bg-color)',
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
});

// Default self mock user data — Level 4, Mythic Champion (Product Manager profile)
const selfUserData = {
    ...PRODUCT_MANAGER_USER,
};

const TrophyCase = ({ viewedUser }) => {
    const userData = viewedUser || selfUserData;
    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <ProfileHeader>
                <HexagonAvatar>
                    <InnerHexagon>
                        <Avatar src={userData.avatarUrl} sx={{ width: 112, height: 112, borderRadius: 0 }} />
                    </InnerHexagon>
                </HexagonAvatar>

                <Box sx={{ ml: 4, zIndex: 1 }}>
                    <Typography variant="overline" sx={{ color: 'var(--primary-color)', fontWeight: 700, letterSpacing: 2 }}>
                        {userData.title || 'Agent'}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                        {userData.name}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'var(--text-secondary)', mt: 1 }}>
                        Lifetime Level <strong style={{ color: 'var(--primary-color)', fontSize: '1.2em' }}>{userData.level || userData.lifetimeLevel || 1}</strong>
                    </Typography>
                </Box>

                <Box sx={{ position: 'absolute', right: -20, top: -20, opacity: 0.1, fontSize: 300, pointerEvents: 'none' }}>
                    🏆
                </Box>
            </ProfileHeader>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'var(--text-primary)' }}>
                        Trophy Collection
                    </Typography>
                    <BadgeGrid />
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'var(--text-primary)' }}>
                        Featured Trophies
                    </Typography>
                    <FeaturedInventory />
                </Grid>
            </Grid>
        </Box>
    );
};

export default TrophyCase;
