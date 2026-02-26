import React from 'react';
import { Box, Typography, Avatar, Grid, styled } from '@mui/material';
import BadgeGrid from './BadgeGrid';
import FeaturedInventory from './FeaturedInventory';

// Default self mock user data
const selfUserData = {
    name: 'Alex Mercer',
    lifetimeLevel: 42,
    title: 'Grand Marshal',
    joinDate: '2024',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    trophiesEarned: 4,
    trophiesTotal: 6,
};

const TrophyCase = ({ viewedUser }) => {
    const userData = viewedUser || selfUserData;

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>

            {/* ── Profile Banner — Design 1: Command Center ── */}
            <Box sx={{
                borderRadius: 3,
                background: 'linear-gradient(135deg, #0d1b3e 0%, #0a2a6e 60%, #1565c0 100%)',
                p: 3,
                mb: 4,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,86,179,0.25)',
            }}>
                {/* Decorative rings */}
                {[200, 300, 400].map(s => (
                    <Box key={s} sx={{
                        position: 'absolute', right: -s / 4, top: -s / 4,
                        width: s, height: s, borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.06)',
                        pointerEvents: 'none',
                    }} />
                ))}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, zIndex: 1, position: 'relative' }}>

                    {/* Avatar with gold ring */}
                    <Box sx={{ position: 'relative', flexShrink: 0 }}>
                        <Box sx={{
                            width: 80, height: 80, borderRadius: '50%',
                            background: 'linear-gradient(135deg,#FFD700,#FFA500)',
                            p: '3px', display: 'flex',
                        }}>
                            <Avatar src={userData.avatarUrl} sx={{ width: '100%', height: '100%' }} />
                        </Box>
                        <Box sx={{
                            position: 'absolute', bottom: -4, right: -4,
                            bgcolor: '#FFD700', borderRadius: '50%',
                            width: 26, height: 26, display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, border: '2px solid #0a2a6e',
                        }}>⭐</Box>
                    </Box>

                    {/* Name & title */}
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{
                            color: 'rgba(255,255,255,0.55)', fontSize: '0.65rem',
                            fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase',
                        }}>
                            {userData.title}
                        </Typography>
                        <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.4rem', lineHeight: 1.2 }}>
                            {userData.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Box sx={{
                                px: 1.5, py: 0.2,
                                background: 'rgba(255,215,0,0.15)',
                                border: '1px solid rgba(255,215,0,0.4)',
                                borderRadius: 10,
                            }}>
                                <Typography sx={{ color: '#FFD700', fontSize: '0.7rem', fontWeight: 700 }}>
                                    LVL {userData.level || userData.lifetimeLevel || 1}
                                </Typography>
                            </Box>
                            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
                                {userData.trophiesEarned}/{userData.trophiesTotal} Trophies
                            </Typography>
                        </Box>
                    </Box>

                    {/* Trophy count */}
                    <Box sx={{ textAlign: 'center', display: { xs: 'none', sm: 'block' }, flexShrink: 0 }}>
                        <Typography sx={{ color: '#FFD700', fontWeight: 900, fontSize: '2rem', lineHeight: 1 }}>
                            {userData.trophiesEarned}/{userData.trophiesTotal}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: 1 }}>
                            TROPHIES
                        </Typography>
                    </Box>

                </Box>
            </Box>

            {/* ── Trophy sections — unchanged originals ── */}
            <Grid container spacing={{ xs: 2, md: 4 }} disableEqualOverflow>
                <Grid item sx={{ width: '100%' }}>
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
