import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton, AppBar, Toolbar, Typography, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    Gavel as DisputeIcon,
    History as HistoryIcon,
    School as SchoolIcon,
    Description as DescriptionIcon,
    Gavel as DisciplinaryIcon,
    RateReview as EvaluationIcon,
    BeachAccess as VacationIcon,
    Sick as SickIcon,
    Weekend as LeaveIcon,
    SwapHoriz as SwapIcon,
    FreeBreakfast as BreakIcon,
} from '@mui/icons-material';
import NavigationDrawer from './NavigationDrawer';
import BottomNavBar from './BottomNavBar';
import DisputeModal from '../common/DisputeModal';
import VacationRequestModal from '../common/VacationRequestModal';
import ShiftSwapRequestModal from '../common/ShiftSwapRequestModal';
import { Snackbar, Alert } from '@mui/material';

// ============================================
// Styled Components
// ============================================

const RootContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'var(--color-background)',
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: 'var(--primary-color)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

const MenuIconButton = styled(IconButton)(({ theme }) => ({
    marginRight: theme.spacing(2),
    color: '#ffffff',
}));

const AppTitle = styled(Typography)(({ theme }) => ({
    flexGrow: 1,
    textAlign: 'center',
    fontWeight: 600,
    color: '#ffffff',
}));

const NotificationIconButton = styled(IconButton)(({ theme }) => ({
    color: '#ffffff',
}));

const MainContent = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    paddingTop: 'calc(56px + var(--spacing-md))',
    paddingBottom: 'calc(var(--spacing-xl) + 16px)',
    paddingLeft: 'var(--spacing-md)',
    paddingRight: 'var(--spacing-md)',
}));

// ============================================
// Component
// ============================================

const AppLayout = ({ children, currentPage, onPageChange }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [actionsMenuAnchor, setActionsMenuAnchor] = useState(null);
    const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);
    const [disputeModalOpen, setDisputeModalOpen] = useState(false);
    const [vacationModalOpen, setVacationModalOpen] = useState(false);
    const [swapModalOpen, setSwapModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const handleBottomNavChange = (event, newValue) => {
        if (newValue === 'more') {
            setMoreMenuAnchor(event.currentTarget);
        } else {
            onPageChange(newValue);
        }
    };

    const handleActionClick = (event) => {
        setActionsMenuAnchor(event.currentTarget);
    };

    const handleActionsMenuClose = () => {
        setActionsMenuAnchor(null);
    };

    const handleMoreMenuClose = () => {
        setMoreMenuAnchor(null);
    };

    const handleMoreMenuItemClick = (page) => {
        handleMoreMenuClose();
        onPageChange(page);
    };

    // --- Modal Openers ---
    const handleDisputeClick = () => {
        handleActionsMenuClose();
        setDisputeModalOpen(true);
    };

    const handleVacationClick = () => {
        handleActionsMenuClose();
        setVacationModalOpen(true);
    };

    const handleSwapClick = () => {
        handleActionsMenuClose();
        setSwapModalOpen(true);
    };

    // ... (rest of handlers)

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    // --- Submit Handlers with LocalStorage ---
    const saveRequestToStorage = (newRequest) => {
        const existingData = JSON.parse(localStorage.getItem('userRequests') || '[]');
        const updatedData = [...existingData, newRequest];
        localStorage.setItem('userRequests', JSON.stringify(updatedData));

        setSnackbarMessage('Request Submitted Successfully!');
        setSnackbarOpen(true);
    };

    const handleDisputeSubmit = (formData) => {
        const newRequest = {
            id: Date.now(),
            type: 'Dispute',
            category: 'Dispute',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            created: 'Just now',
            status: 'Pending',
            details: `KPI: ${formData.kpi}`,
            iconType: 'dispute',
        };
        saveRequestToStorage(newRequest);
        setDisputeModalOpen(false);
    };

    const handleVacationSubmit = (formData) => {
        const newRequest = {
            id: Date.now(),
            type: formData.type.charAt(0).toUpperCase() + formData.type.slice(1).replace('dayoff', 'Day Off'),
            category: 'Time Off',
            date: `${new Date(formData.fromDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
            created: 'Just now',
            status: 'Pending',
            details: formData.comment,
            iconType: 'vacation',
        };
        saveRequestToStorage(newRequest);
        setVacationModalOpen(false);
    };

    const handleSwapSubmit = (formData) => {
        const newRequest = {
            id: Date.now(),
            type: formData.type === 'shift' ? 'Shift Swap' : formData.type === 'break' ? 'Break Swap' : 'Day Off Swap',
            category: 'Swap',
            date: new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            created: 'Just now',
            status: 'Pending',
            details: `w/ ${formData.swapWith}`,
            iconType: 'swap',
        };
        saveRequestToStorage(newRequest);
        setSwapModalOpen(false);
    };


    return (
        <RootContainer>
            {/* Top Navigation Bar */}
            <StyledAppBar position="fixed">
                <Toolbar>
                    <MenuIconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerOpen}
                    >
                        <MenuIcon />
                    </MenuIconButton>
                    <AppTitle variant="h6" component="div">
                        Globitel Workforce
                    </AppTitle>
                    <NotificationIconButton
                        edge="end"
                        color="inherit"
                        aria-label="notifications"
                    >
                        <NotificationsIcon />
                    </NotificationIconButton>
                </Toolbar>
            </StyledAppBar>

            {/* Navigation Drawer */}
            <NavigationDrawer
                open={drawerOpen}
                onClose={handleDrawerClose}
                onNavigation={onPageChange}
            />

            {/* Main Content Area */}
            <MainContent component="main">
                {children}
            </MainContent>

            {/* Bottom Navigation Bar */}
            <BottomNavBar
                value={currentPage}
                onChange={handleBottomNavChange}
                onActionClick={handleActionClick}
            />

            {/* Actions Menu */}
            <Menu
                anchorEl={actionsMenuAnchor}
                open={Boolean(actionsMenuAnchor)}
                onClose={handleActionsMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <MenuItem onClick={handleDisputeClick}>
                    <ListItemIcon>
                        <DisputeIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Dispute</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleVacationClick}>
                    <ListItemIcon>
                        <VacationIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Vacation</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleSwapClick}>
                    <ListItemIcon>
                        <SwapIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Swap</ListItemText>
                </MenuItem>
            </Menu>

            {/* More Menu */}
            <Menu
                anchorEl={moreMenuAnchor}
                open={Boolean(moreMenuAnchor)}
                onClose={handleMoreMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <MenuItem onClick={() => handleMoreMenuItemClick('activities')}>
                    <ListItemIcon>
                        <HistoryIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Activities</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleMoreMenuItemClick('coaching')}>
                    <ListItemIcon>
                        <SchoolIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Coaching</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleMoreMenuItemClick('requests')}>
                    <ListItemIcon>
                        <VacationIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Requests</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleMoreMenuItemClick('disputes')}>
                    <ListItemIcon>
                        <DisputeIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Disputes</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleMoreMenuItemClick('evaluations')}>
                    <ListItemIcon>
                        <EvaluationIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Evaluations</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleMoreMenuItemClick('events')}>
                    <ListItemIcon>
                        <DisciplinaryIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Events</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleMoreMenuItemClick('logs')}>
                    <ListItemIcon>
                        <DescriptionIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logs</ListItemText>
                </MenuItem>
            </Menu>

            {/* Modals */}
            <DisputeModal
                open={disputeModalOpen}
                onClose={() => setDisputeModalOpen(false)}
                onSubmit={handleDisputeSubmit}
                kpiList={[
                    { id: 'aht', fullName: 'Average Handle Time' },
                    { id: 'adherence', fullName: 'Schedule Adherence' },
                    { id: 'quality', fullName: 'Quality Score' },
                ]}
            />

            <VacationRequestModal
                open={vacationModalOpen}
                onClose={() => setVacationModalOpen(false)}
                onSubmit={handleVacationSubmit}
            />

            <ShiftSwapRequestModal
                open={swapModalOpen}
                onClose={() => setSwapModalOpen(false)}
                onSubmit={handleSwapSubmit}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </RootContainer>
    );
};

export default AppLayout;
