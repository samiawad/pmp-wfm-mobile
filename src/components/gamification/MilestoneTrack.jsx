import React from 'react';
import { Box, Typography, styled, Tooltip } from '@mui/material';
import { CardGiftcard as RewardIcon, CheckCircle as CheckIcon } from '@mui/icons-material';

const TrackContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    position: 'relative',
    padding: theme.spacing(4, 2),
    overflowX: 'auto',
    // Custom scrollbar
    '&::-webkit-scrollbar': {
        height: 8,
    },
    '&::-webkit-scrollbar-track': {
        background: 'rgba(0,0,0,0.05)',
        borderRadius: 4,
    },
    '&::-webkit-scrollbar-thumb': {
        background: 'rgba(0,0,0,0.2)',
        borderRadius: 4,
        '&:hover': {
            background: 'rgba(0,0,0,0.3)',
        }
    }
}));

const TrackLine = styled(Box)(({ progressPercent }) => ({
    position: 'absolute',
    top: 28, // Center of 56px high chips (when positioned inside NodesContainer)
    left: 30, // Starts at center of first 60px node
    right: 30, // Ends at center of last 60px node
    height: 8,
    backgroundColor: 'var(--border-color)',
    borderRadius: 4,
    transform: 'translateY(-50%)',
    zIndex: -1,
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: `${progressPercent}%`,
        background: 'var(--primary-color)',
        borderRadius: 4,
        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
    }
}));

const NodesContainer = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 2,
    minWidth: 900, // force horizontal scroll if screen is small
});

const MilestoneNodeWrapper = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    width: 60,
});

const MilestoneIconBox = styled(Box)(({ achived }) => ({
    width: 56,
    height: 56,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: achived ? '#FFF' : 'var(--surface-color)',
    border: `2px solid ${achived ? 'var(--primary-color)' : 'var(--border-color)'}`,
    boxShadow: achived ? '0 4px 10px rgba(0,0,0,0.1)' : 'none',
    transition: 'all 0.3s ease',
    position: 'relative',
    '&:hover': {
        transform: 'scale(1.1)',
        cursor: 'pointer',
    }
}));

const RewardPreview = styled(Box)(({ achived }) => ({
    position: 'absolute',
    top: -30,
    background: achived ? 'var(--primary-color)' : 'var(--surface-color)',
    padding: '4px 8px',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    border: `1px solid ${achived ? 'var(--primary-color)' : 'var(--border-color)'}`,
    fontSize: '0.75rem',
    color: achived ? '#FFF' : 'var(--text-secondary)',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const MilestoneTrack = ({ milestones = [], currentXP = 0 }) => {
    if (!milestones.length) return null;

    const maxXP = milestones[milestones.length - 1].requiredXP;

    // Calculate progress visually segment by segment since milestones are uniformly spaced
    // regardless of whether their XP intervals are uniform.
    const totalSegments = milestones.length - 1;
    let progressPercent = 0;

    if (currentXP >= maxXP) {
        progressPercent = 100;
    } else {
        const nextMilestoneIndex = milestones.findIndex(m => m.requiredXP > currentXP);
        const prevMilestoneIndex = Math.max(0, nextMilestoneIndex - 1);

        const prevMilestone = milestones[prevMilestoneIndex];
        const nextMilestone = milestones[nextMilestoneIndex];

        const xpInCurrentSegment = currentXP - prevMilestone.requiredXP;
        const totalXpInSegment = nextMilestone.requiredXP - prevMilestone.requiredXP;
        const segmentProgress = xpInCurrentSegment / totalXpInSegment;

        // Add the fully completed segments plus the exact progress in the current segment
        progressPercent = ((prevMilestoneIndex + segmentProgress) / totalSegments) * 100;

        // Clamp visually just to be safe
        progressPercent = Math.min(Math.max(progressPercent, 0), 100);
    }

    return (
        <TrackContainer>
            <NodesContainer>
                <TrackLine progressPercent={progressPercent} />
                {milestones.map((milestone, index) => {
                    const isZeroMilestone = milestone.requiredXP === 0;
                    const isAchieved = currentXP >= milestone.requiredXP;
                    const isNext = !isAchieved && (index === 0 || currentXP >= milestones[index - 1].requiredXP);

                    return (
                        <MilestoneNodeWrapper key={milestone.id}>
                            <Tooltip title={`${milestone.title} - ${milestone.reward} (${milestone.requiredXP} XP)`} placement="top" arrow>
                                <MilestoneIconBox achived={isAchieved} current={isNext} sx={{
                                    opacity: isZeroMilestone ? 0 : 1, // Completely hide the circle for 0 XP
                                    pointerEvents: isZeroMilestone ? 'none' : 'auto' // Prevent tooltips logically
                                }}>
                                    {/* Reward floating tag for major milestones */}
                                    {index > 0 && index % 2 === 0 && (
                                        <RewardPreview achived={isAchieved}>
                                            {/* <RewardIcon sx={{ fontSize: 14 }} /> */}
                                            500 {milestone.reward}
                                        </RewardPreview>
                                    )}

                                    {!isZeroMilestone && (
                                        isAchieved ? (
                                            <CheckIcon sx={{ color: 'var(--primary-color)', fontSize: 28 }} />
                                        ) : isNext ? (
                                            <RewardIcon sx={{ color: 'var(--primary-color)', fontSize: 28, opacity: 0.8 }} />
                                        ) : (
                                            <RewardIcon sx={{ color: 'var(--text-secondary)', fontSize: 24, opacity: 0.5 }} />
                                        )
                                    )}
                                </MilestoneIconBox>
                            </Tooltip>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: isAchieved ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isAchieved ? 700 : 500, display: 'block' }}>
                                    {milestone.id}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontSize: '0.65rem' }}>
                                    {milestone.requiredXP >= 1000 ? `${milestone.requiredXP / 1000}k` : milestone.requiredXP}
                                </Typography>
                            </Box>
                        </MilestoneNodeWrapper>
                    );
                })}
            </NodesContainer>
        </TrackContainer>
    );
};

export default MilestoneTrack;
