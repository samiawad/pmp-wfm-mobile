import React, { useState } from 'react';
import { Dialog, Box, Typography, styled, Slide, Button } from '@mui/material';
import { WorkspacePremium as PremiumIcon } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// No-op transition for static/URL-driven capture (Figma scraper)
const NoTransition = React.forwardRef(function NoTransition({ children }, ref) {
    return React.cloneElement(children, { ref });
});

// Particle Effect CSS handled via styled component animations
const CelebrationBox = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)',
    padding: theme.spacing(4),
    borderRadius: 24,
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    color: '#FFFFFF',
}));

const GlowIcon = styled(PremiumIcon)(({ staticmode }) => ({
    fontSize: 100,
    color: '#FFF',
    filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))',
    animation: staticmode ? 'none' : 'pulse 2s infinite',
    '@keyframes pulse': {
        '0%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))' },
        '50%': { transform: 'scale(1.1)', filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 1))' },
        '100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))' }
    }
}));

const Particle = styled('div')(({ tx, ty, duration, delay, color }) => ({
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: color || '#FFF',
    borderRadius: '50%',
    top: '50%',
    left: '50%',
    animation: `shoot ${duration}ms ease-out ${delay}ms forwards`,
    opacity: 0,
    '@keyframes shoot': {
        '0%': { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        '100%': { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
    }
}));

const ParticlesContainer = () => {
    const [particlesData] = useState(() =>
        Array.from({ length: 30 }).map((_, i) => {
            const angle = (Math.random() * 360 * Math.PI) / 180;
            const distance = 100 + Math.random() * 150;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const duration = 600 + Math.random() * 400;
            const delay = Math.random() * 200;
            const color = Math.random() > 0.5 ? '#FFF' : '#FFE066';
            return { key: i, tx, ty, duration, delay, color };
        })
    );

    const particles = particlesData.map(p => (
        <Particle key={p.key} tx={p.tx} ty={p.ty} duration={p.duration} delay={p.delay} color={p.color} />
    ));

    return <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>{particles}</Box>;
};

const CelebrationOverlay = ({ open, onClose, title, message, staticMode = false }) => {
    return (
        <Dialog
            open={open}
            TransitionComponent={staticMode ? NoTransition : Transition}
            keepMounted
            onClose={onClose}
            PaperProps={{
                style: {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    overflow: 'visible'
                }
            }}
        >
            <CelebrationBox>
                <ParticlesContainer />
                <GlowIcon sx={{ mb: 2 }} staticmode={staticMode ? 1 : 0} />
                <Typography variant="h3" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                    {title}
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, fontWeight: 500, opacity: 0.9 }}>
                    {message}
                </Typography>
                <Button
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        bgcolor: '#FFFFFF',
                        color: 'var(--primary-color)',
                        fontWeight: 700,
                        borderRadius: 8,
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                            bgcolor: '#f0f0f0',
                        }
                    }}
                >
                    Claim Reward
                </Button>
            </CelebrationBox>
        </Dialog>
    );
};

export default CelebrationOverlay;
