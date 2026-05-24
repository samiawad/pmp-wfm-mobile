// MilestoneTrack.jsx
// IONIC MIGRATION: equivalent to a custom IonList with vertical timeline styling

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Check as CheckIcon, CardGiftcardOutlined as RewardIcon, LockOutlined as LockIcon } from '@mui/icons-material';

// ── Status helpers ──────────────────────────────────────────────────────────

const DOT_SIZE_ACHIEVED = 28;
const DOT_SIZE_CURRENT  = 28;
const DOT_SIZE_UPCOMING = 20;

const getDotStyle = (isAchieved, isCurrent) => {
    if (isAchieved) return {
        size: DOT_SIZE_ACHIEVED,
        bg: 'var(--primary-color)',
        border: 'none',
        shadow: '0 2px 8px rgba(6,24,54,0.25)',
    };
    if (isCurrent) return {
        size: DOT_SIZE_CURRENT,
        bg: '#fff',
        border: '2.5px solid var(--primary-color)',
        shadow: '0 0 0 4px rgba(6,24,54,0.08)',
    };
    return {
        size: DOT_SIZE_UPCOMING,
        bg: '#f1f5f9',
        border: '2px solid #e2e8f0',
        shadow: 'none',
    };
};

// ── Component ───────────────────────────────────────────────────────────────

const MilestoneTrack = ({ milestones = [], currentXP = 0 }) => {
    // Skip the 0-XP anchor node
    const items = milestones.filter(m => m.requiredXP > 0);
    if (!items.length) return null;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {items.map((milestone, index) => {
                const isAchieved = currentXP >= milestone.requiredXP;
                const prevXP = index === 0 ? 0 : items[index - 1].requiredXP;
                const isCurrent = !isAchieved && currentXP >= prevXP;
                const isLast = index === items.length - 1;

                const dot = getDotStyle(isAchieved, isCurrent);

                // Progress within the current segment (0–100)
                const segmentProgress = isCurrent
                    ? Math.min(100, Math.round(((currentXP - prevXP) / (milestone.requiredXP - prevXP)) * 100))
                    : 0;

                // Connector line colour
                const lineColor = isAchieved ? 'var(--primary-color)' : '#e2e8f0';
                const lineDashed = !isAchieved && !isCurrent;

                return (
                    <Box key={milestone.id} sx={{ display: 'flex', gap: 0, minHeight: 64 }}>

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
                                width: dot.size,
                                height: dot.size,
                                borderRadius: '50%',
                                backgroundColor: dot.bg,
                                border: dot.border,
                                boxShadow: dot.shadow,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                mt: '2px',
                                zIndex: 1,
                                transition: 'all 0.3s ease',
                            }}>
                                {isAchieved && (
                                    <CheckIcon sx={{ fontSize: 14, color: '#fff' }} />
                                )}
                                {isCurrent && (
                                    <Box sx={{
                                        width: 9, height: 9,
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--primary-color)',
                                    }} />
                                )}
                                {!isAchieved && !isCurrent && (
                                    <LockIcon sx={{ fontSize: 10, color: '#cbd5e1' }} />
                                )}
                            </Box>

                            {/* Connector line */}
                            {!isLast && (
                                <Box sx={{
                                    flex: 1,
                                    width: 2,
                                    minHeight: 24,
                                    mt: '2px',
                                    backgroundColor: lineDashed ? 'transparent' : lineColor,
                                    backgroundImage: lineDashed
                                        ? 'repeating-linear-gradient(to bottom, #e2e8f0 0px, #e2e8f0 5px, transparent 5px, transparent 10px)'
                                        : 'none',
                                    transition: 'background-color 0.4s ease',
                                }} />
                            )}
                        </Box>

                        {/* ── Right column: content ── */}
                        <Box sx={{ flex: 1, pb: isLast ? 0 : 3, pl: 0.5, minWidth: 0 }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                gap: 1,
                            }}>
                                {/* Title + XP */}
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography sx={{
                                        fontWeight: isAchieved || isCurrent ? 700 : 500,
                                        fontSize: '0.88rem',
                                        color: isAchieved ? '#1a1a1a' : isCurrent ? 'var(--primary-color)' : '#94a3b8',
                                        lineHeight: 1.3,
                                    }}>
                                        {milestone.title}
                                    </Typography>
                                    <Typography sx={{
                                        fontSize: '0.72rem',
                                        color: '#b0b8c4',
                                        mt: 0.2,
                                    }}>
                                        {milestone.requiredXP.toLocaleString()} XP
                                    </Typography>
                                </Box>

                                {/* Reward badge */}
                                <Box sx={{
                                    px: 1.25,
                                    py: 0.4,
                                    borderRadius: 20,
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    backgroundColor: isAchieved
                                        ? 'rgba(6,24,54,0.07)'
                                        : isCurrent
                                            ? 'rgba(6,24,54,0.04)'
                                            : '#f1f5f9',
                                    border: `1px solid ${isAchieved ? 'rgba(6,24,54,0.12)' : isCurrent ? 'rgba(6,24,54,0.1)' : '#e2e8f0'}`,
                                }}>
                                    <RewardIcon sx={{
                                        fontSize: 11,
                                        color: isAchieved || isCurrent ? 'var(--primary-color)' : '#cbd5e1',
                                    }} />
                                    <Typography sx={{
                                        fontSize: '0.68rem',
                                        fontWeight: 600,
                                        color: isAchieved || isCurrent ? 'var(--primary-color)' : '#94a3b8',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {milestone.reward}
                                    </Typography>
                                    {isAchieved && (
                                        <CheckIcon sx={{ fontSize: 10, color: 'var(--primary-color)' }} />
                                    )}
                                </Box>
                            </Box>

                            {/* Progress bar for current milestone */}
                            {isCurrent && (
                                <Box sx={{ mt: 1 }}>
                                    <Box sx={{
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor: '#e9ecef',
                                        overflow: 'hidden',
                                    }}>
                                        <Box sx={{
                                            height: '100%',
                                            width: `${segmentProgress}%`,
                                            borderRadius: 2,
                                            backgroundColor: 'var(--primary-color)',
                                            transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                                        }} />
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.4 }}>
                                        <Typography sx={{ fontSize: '0.65rem', color: 'var(--primary-color)', fontWeight: 600 }}>
                                            {segmentProgress}%
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                                            {(milestone.requiredXP - currentXP).toLocaleString()} XP to go
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
};

export default MilestoneTrack;
