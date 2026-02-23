import React from 'react';
import { Box, Typography, styled, Tooltip } from '@mui/material';
import { WorkspacePremium, Shield, ElectricBolt } from '@mui/icons-material';

const InventoryContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    background: 'var(--surface-color)',
    borderRadius: 16,
    padding: theme.spacing(3),
    border: '1px solid var(--border-color)',
}));

const Slot = styled(Box)(({ theme, rare }) => ({
    height: 90,
    background: rare ? '#FFFDE7' : 'var(--bg-color)',
    border: `2px dashed ${rare ? '#FFD700' : 'var(--border-color)'}`,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    position: 'relative',
    transition: 'all 0.3s ease',
    boxShadow: rare ? '0 2px 8px rgba(255, 215, 0, 0.15)' : 'none',
    '&:hover': {
        borderStyle: 'solid',
        transform: 'translateX(5px)',
        backgroundColor: rare ? '#FFF9C4' : 'var(--surface-color)',
    }
}));

const IconGlow = styled(Box)(({ color }) => ({
    width: 50,
    height: 50,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
    marginRight: 16,
}));

const featuredItems = [
    { id: 1, name: "Employee of the Year", desc: "Top performer 2025", icon: <WorkspacePremium sx={{ fontSize: 32, color: '#FFD700' }} />, rare: true, color: '#FFD700' },
    { id: 2, name: "Iron Defense", desc: "100% SLA for 6 months", icon: <Shield sx={{ fontSize: 32, color: '#C0C0C0' }} />, rare: false, color: '#C0C0C0' },
    { id: 3, name: "Lightning Striker", desc: "Highest answer rate", icon: <ElectricBolt sx={{ fontSize: 32, color: '#00D4FF' }} />, rare: true, color: '#00D4FF' }
];

const FeaturedInventory = () => {
    return (
        <InventoryContainer>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                Pin your rarest achievements here for others to see.
            </Typography>

            {featuredItems.map(item => (
                <Tooltip key={item.id} title={item.desc} placement="left" arrow>
                    <Slot rare={item.rare}>
                        <IconGlow color={item.color}>
                            {item.icon}
                        </IconGlow>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                {item.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                                {item.rare ? 'Mythic' : 'Epic'}
                            </Typography>
                        </Box>
                    </Slot>
                </Tooltip>
            ))}
        </InventoryContainer>
    );
};

export default FeaturedInventory;
