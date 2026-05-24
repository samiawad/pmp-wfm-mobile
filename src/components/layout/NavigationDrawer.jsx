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
    HomeOutlined as HomeIcon,
    CalendarMonthOutlined as CalendarIcon,
    AssessmentOutlined as AssessmentIcon,
    EmojiEventsOutlined as RewardsIcon,
    SchoolOutlined as CoachingIcon,
    GavelOutlined as DisputesIcon,
    RateReviewOutlined as EvaluationsIcon,
    ScheduleOutlined as ScheduleIcon,
    TrendingUpOutlined as AdherenceIcon,
    SpeedOutlined as RealTimeIcon,
    RequestPageOutlined as RequestsIcon,
    SettingsOutlined as SettingsIcon,
    BeachAccessOutlined as VacationIcon,
} from '@mui/icons-material';

// ============================================
// Styled Components
// ============================================

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
        width: 280,
        backgroundColor: '#ffffff',
        color: '#1a1a1a',
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
    color: 'var(--primary-color)',
}));

const MenuTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    paddingLeft: theme.spacing(2),
    color: '#666',
    fontWeight: 600,
}));

const SectionContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
    '&:hover': {
        backgroundColor: 'rgba(var(--primary-rgb), 0.08)',
    },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
    color: 'var(--primary-color)',
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));

// ============================================
// Component
// ============================================

const NavigationDrawer = ({ open, onClose, onNavigation }) => {
    const pmpMenuItems = [
        { text: 'Performance', icon: <AssessmentIcon />, path: 'performance' },
        { text: 'Coaching', icon: <CoachingIcon />, path: 'coaching' },
        { text: 'Evaluations', icon: <EvaluationsIcon />, path: 'evaluations' },
        { text: 'Rewards', icon: <RewardsIcon />, path: 'rewards' },
        { text: 'Disputes', icon: <DisputesIcon />, path: 'disputes' },
    ];

    const wfmMenuItems = [
        { text: 'My Schedule', icon: <CalendarIcon />, path: 'schedule' },
    ];

    const generalMenuItems = [
        { text: 'Requests', icon: <RequestsIcon />, path: 'requests' },
    ]

    const handleNavigation = (path) => {
        if (onNavigation) {
            onNavigation(path);
        }
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
                <SectionTitle variant="overline">
                    General
                </SectionTitle>
                {generalMenuItems.map((item) => (
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
        </StyledDrawer>
    );
};

export default NavigationDrawer;
