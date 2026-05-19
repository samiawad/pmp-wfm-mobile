// BottomNavBar.jsx
// IONIC MIGRATION: replace this component with <IonTabBar> + <IonTabButton> + <IonIcon>

import { Box, Typography } from '@mui/material';
import { House, CalendarDays, ClipboardList, TrendingUp, LayoutGrid } from 'lucide-react';

// ============================================
// Design Tokens
// ============================================
const NAV_ACTIVE = 'var(--primary-color)';
const NAV_INACTIVE = '#9e9e9e';
const ICON_SIZE = 24;

// ============================================
// Tab Config
// ============================================
const TABS = [
    { value: 'home', label: 'Home', Icon: House },
    { value: 'schedule', label: 'Schedule', Icon: CalendarDays },
    { value: 'activities', label: 'Activities', Icon: ClipboardList },
    { value: 'performance', label: 'Performance', Icon: TrendingUp },
    { value: 'more', label: 'More', Icon: LayoutGrid },
];

// ============================================
// Component
// ============================================

const BottomNavBar = ({ value, onChange }) => {
    return (
        // IONIC MIGRATION: replace outer Box with <IonTabBar slot="bottom">
        <Box
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                backgroundColor: '#ffffff',
                borderTop: '1px solid #ebebeb',
                display: 'flex',
                alignItems: 'stretch',
                // iOS safe area — pushes the bar up above the home indicator
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
        >
            {TABS.map(({ value: tabValue, label, Icon }) => {
                const isActive = value === tabValue;
                const color = isActive ? NAV_ACTIVE : NAV_INACTIVE;

                return (
                    // IONIC MIGRATION: replace with <IonTabButton tab={tabValue}>
                    <Box
                        key={tabValue}
                        onClick={() => onChange(tabValue)}
                        sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '3px',
                            minHeight: 56,
                            cursor: 'pointer',
                            WebkitTapHighlightColor: 'transparent',
                            userSelect: 'none',
                            // subtle press feedback without any circle
                            '&:active': { opacity: 0.7 },
                        }}
                    >
                        {/* IONIC MIGRATION: replace with <IonIcon icon={...} /> */}
                        <Icon
                            size={ICON_SIZE}
                            color={color}
                            strokeWidth={1.8}
                        />
                        <Typography
                            sx={{
                                fontSize: '0.65rem',
                                fontWeight: 400,
                                color,
                                lineHeight: 1,
                                letterSpacing: '0.01em',
                            }}
                        >
                            {label}
                        </Typography>
                    </Box>
                );
            })}
        </Box>
    );
};

export default BottomNavBar;
