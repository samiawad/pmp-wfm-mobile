import { styled } from '@mui/material/styles';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Divider,
    Box,
    Typography,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    CalendarMonth as CalendarIcon,
    Assessment as AssessmentIcon,
    EmojiEvents as RewardsIcon,
    School as CoachingIcon,
    Gavel as DisputesIcon,
    RateReview as EvaluationsIcon,
    Schedule as ScheduleIcon,
    TrendingUp as AdherenceIcon,
    Speed as RealTimeIcon,
    RequestPage as RequestsIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';

// ============================================
// Styled Components
// ============================================

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: 280,
        backgroundColor: '#ffffff',
        color: 'var(--color-on-surface)',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
    },
    '& .MuiBackdrop-root': {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
}));

const CloseIconButton = styled(IconButton)(({ theme }) => ({
    color: 'var(--color-primary)',
}));

const MenuTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    paddingLeft: theme.spacing(2),
    color: 'var(--color-on-surface-variant)',
    fontWeight: 600,
}));

const SectionContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    '&:hover': {
        backgroundColor: 'var(--color-primary-container)',
    },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
    color: 'var(--color-primary)',
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));

// ============================================
// Component
// ============================================

const NavigationDrawer = ({ open, onClose }) => {
    const pmpMenuItems = [
        { text: 'My Performance', icon: <HomeIcon />, path: '/performance' },
        { text: 'KPIs', icon: <AssessmentIcon />, path: '/kpis' },
        { text: 'Coaching', icon: <CoachingIcon />, path: '/coaching' },
        { text: 'Evaluations', icon: <EvaluationsIcon />, path: '/evaluations' },
        { text: 'Rewards', icon: <RewardsIcon />, path: '/rewards' },
        { text: 'Disputes', icon: <DisputesIcon />, path: '/disputes' },
    ];

    const wfmMenuItems = [
        { text: 'My Schedule', icon: <CalendarIcon />, path: '/schedule' },
        { text: 'Adherence', icon: <AdherenceIcon />, path: '/adherence' },
        { text: 'Real Time', icon: <RealTimeIcon />, path: '/realtime' },
        { text: 'Requests', icon: <RequestsIcon />, path: '/requests' },
    ];

    const handleNavigation = (path) => {
        console.log('Navigate to:', path);
        onClose();
    };

    return (
        <StyledDrawer
            anchor="left"
            open={open}
            onClose={onClose}
            ModalProps={{
                keepMounted: true,
            }}
        >
            <DrawerHeader>
                <CloseIconButton onClick={onClose}>
                    <MenuIcon />
                </CloseIconButton>
                <MenuTitle variant="h6">
                    Menu
                </MenuTitle>
            </DrawerHeader>

            <Divider />

            {/* PMP Section */}
            <SectionContainer>
                <SectionTitle variant="overline">
                    Performance Management
                </SectionTitle>
                <List>
                    {pmpMenuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <StyledListItemButton onClick={() => handleNavigation(item.path)}>
                                <StyledListItemIcon>
                                    {item.icon}
                                </StyledListItemIcon>
                                <ListItemText primary={item.text} />
                            </StyledListItemButton>
                        </ListItem>
                    ))}
                </List>
            </SectionContainer>

            <StyledDivider />

            {/* WFM Section */}
            <Box>
                <SectionTitle variant="overline">
                    Workforce Management
                </SectionTitle>
                <List>
                    {wfmMenuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <StyledListItemButton onClick={() => handleNavigation(item.path)}>
                                <StyledListItemIcon>
                                    {item.icon}
                                </StyledListItemIcon>
                                <ListItemText primary={item.text} />
                            </StyledListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <StyledDivider />

            {/* Settings */}
            <List>
                <ListItem disablePadding>
                    <StyledListItemButton onClick={() => handleNavigation('/settings')}>
                        <StyledListItemIcon>
                            <SettingsIcon />
                        </StyledListItemIcon>
                        <ListItemText primary="Settings" />
                    </StyledListItemButton>
                </ListItem>
            </List>
        </StyledDrawer>
    );
};

export default NavigationDrawer;
