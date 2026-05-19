import React from 'react';
import { Box, Typography } from '@mui/material';
import {
    Check as CheckIcon,
    Lock as LockIcon,
    CardGiftcard as RewardIcon,
} from '@mui/icons-material';

// ── Vertical timeline milestone track ────────────────────────────────────────
// IONIC MIGRATION: no Ionic equivalent — custom styled component, keep as-is

const MilestoneTrack = ({ milestones = [], currentXP = 0 }) => {
    // Strip the dummy 0-XP anchor node that was only needed for the old horizontal track
    const items = milestones.filter(m => m.requiredXP > 0);
    if (!items.length) return null;

    // Index of the very next milestone the user hasn't reached yet
    const nextIdx = items.findIndex(m => m.requiredXP > currentXP);

    /** achieved | current | upcoming */
    const getState = (milestone, index) => {
        if (currentXP >= milestone.requiredXP) return 'achieved';
        if (index === nextIdx || (nextIdx === -1 && index === items.length - 1)) return 'current';
        return 'upcoming';
    };

    /** 0–100 progress inside the current segment */
    const getProgress = (index) => {
        if (nextIdx === -1) return 100;
        if (index !== nextIdx) return 0;
        const prevXP = index > 0 ? items[index - 1].requiredXP : 0;
        const segXP   = items[index].requiredXP - prevXP;
        return Math.min(100, Math.round(((currentXP - prevXP) / segXP) * 100));
    };

    return (
        <Box sx={{ width: '100%', pb: 1 }}>
            {items.map((milestone, index) => {
                const state      = getState(milestone, index);
                const isAchieved = state === 'achieved';
                const isCurrent  = state === 'current';
                const isLast     = index === items.length - 1;
                const progress   = isCurrent ? getProgress(index) : 0;
                const xpToGo     = isCurrent ? milestone.requiredXP - currentXP : 0;

                return (
                    <Box key={milestone.id ?? index} sx={{ display: 'flex', gap: 0 }}>

                        {/* ── Left column: dot + connector ── */}
                        <Box sx={{
                            width: 44,
                            flexShrink: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                            {/* Dot */}
                            <Box sx={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                flexShrink: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1,
                                mt: '2px',
                                // Achieved: filled navy
                                ...(isAchieved && {
                                    bgcolor: '#061836',
                                    border: 'none',
                                }),
                                // Current: navy ring + inner dot
                                ...(isCurrent && {
                                    bgcolor: '#fff',
                                    border: '2.5px solid #061836',
                                    boxShadow: '0 0 0 4px rgba(6,24,54,0.09)',
                                }),
                                // Upcoming: light grey
                                ...(!isAchieved && !isCurrent && {
                                    bgcolor: '#f0f0f0',
                                    border: '2px solid #d8d8d8',
                                }),
                            }}>
                                {isAchieved  && <CheckIcon  sx={{ fontSize: 16, color: '#fff' }} />}
                                {isCurrent   && <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#061836' }} />}
                                {!isAchieved && !isCurrent && <LockIcon sx={{ fontSize: 13, color: '#b8b8b8' }} />}
                            </Box>

                            {/* Connector line */}
                            {!isLast && (
                                <Box sx={{
                                    flex: 1,
                                    width: 2,
                                    minHeight: 36,
                                    my: '3px',
                                    ...(isAchieved
                                        ? { bgcolor: '#061836' }
                                        : {
                                            backgroundImage:
                                                'repeating-linear-gradient(to bottom, #d0d0d0 0px, #d0d0d0 4px, transparent 4px, transparent 8px)',
                                        }
                                    ),
                                }} />
                            )}
                        </Box>

                        {/* ── Right column: card ── */}
                        <Box sx={{ flex: 1, pb: isLast ? 0 : 2, pt: 0 }}>
                            <Box sx={{
                                bgcolor: '#fff',
                                borderRadius: '12px',
                                p: '11px 14px',
                                border: isCurrent
                                    ? '1.5px solid #061836'
                                    : '1px solid #eef0f3',
                                boxShadow: isCurrent
                                    ? '0 2px 12px rgba(6,24,54,0.08)'
                                    : '0 1px 3px rgba(0,0,0,0.04)',
                                transition: 'all 0.2s',
                            }}>
                                {/* Title row */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <Typography sx={{
                                        fontWeight: isAchieved || isCurrent ? 700 : 500,
                                        fontSize: '0.875rem',
                                        color: isAchieved || isCurrent ? '#061836' : '#9e9e9e',
                                    }}>
                                        {milestone.title || `Milestone ${index + 1}`}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.7rem', color: '#aaa', flexShrink: 0, ml: 1 }}>
                                        {milestone.requiredXP >= 1000
                                            ? `${milestone.requiredXP / 1000}k`
                                            : milestone.requiredXP} XP
                                    </Typography>
                                </Box>

                                {/* Reward row */}
                                {milestone.reward && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: isCurrent ? 1 : 0 }}>
                                        <RewardIcon sx={{ fontSize: 13, color: isAchieved ? '#f59e0b' : '#c8c8c8' }} />
                                        <Typography sx={{
                                            fontSize: '0.72rem',
                                            color: isAchieved ? '#f59e0b' : '#bbb',
                                            fontWeight: 500,
                                        }}>
                                            {milestone.reward}
                                        </Typography>
                                    </Box>
                                )}

                                {/* Current milestone: progress bar */}
                                {isCurrent && (
                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography sx={{ fontSize: '0.7rem', color: '#5a6a7a', fontWeight: 500 }}>
                                                {progress}% complete
                                            </Typography>
                                            <Typography sx={{ fontSize: '0.7rem', color: '#5a6a7a' }}>
                                                {xpToGo.toLocaleString()} XP to go
                                            </Typography>
                                        </Box>
                                        <Box sx={{ height: 5, bgcolor: '#e8edf2', borderRadius: 3, overflow: 'hidden' }}>
                                            <Box sx={{
                                                height: '100%',
                                                width: `${progress}%`,
                                                bgcolor: '#061836',
                                                borderRadius: 3,
                                                transition: 'width 0.6s ease',
                                            }} />
                                        </Box>
                                    </Box>
                                )}

                                {/* Achieved label */}
                                {isAchieved && (
                                    <Typography sx={{ fontSize: '0.68rem', color: '#22c55e', fontWeight: 600, mt: 0.25 }}>
                                        ✓ Achieved
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};

export default MilestoneTrack;
