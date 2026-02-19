import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box, IconButton, AppBar, Toolbar, Typography,
    SwipeableDrawer,
    Snackbar, Alert, Badge, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    School as SchoolIcon,
    RateReview as EvaluationIcon,
    EmojiEvents as RewardsIcon,
    RequestPage as RequestsIcon,
    Gavel as DisputeIcon,
    Event as EventIcon,
    Description as LogsIcon,
    Close as CloseIcon,
    SwapHoriz as SwapIcon,
    NotificationImportant as AlertIcon,
} from '@mui/icons-material';
import BottomNavBar from './BottomNavBar';
import DisputeModal from '../common/DisputeModal';
import VacationRequestModal from '../common/VacationRequestModal';
import ShiftSwapRequestModal from '../common/ShiftSwapRequestModal';

// ============================================
// Styled Components
// ============================================

const RootContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
});

const StyledAppBar = styled(AppBar)({
    backgroundColor: 'var(--primary-color)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
});

const AppTitle = styled(Typography)({
    flexGrow: 1,
    fontWeight: 600,
    fontSize: '1.1rem',
    color: '#ffffff',
});

const NotificationIconButton = styled(IconButton)({
    color: '#ffffff',
});

const MainContent = styled(Box)({
    flexGrow: 1,
    paddingTop: '56px', // AppBar height
    paddingBottom: 'calc(56px + env(safe-area-inset-bottom, 0px))', // BottomNav + safe area
});

// Bottom Sheet Styles
const BottomSheetContainer = styled(Box)({
    borderRadius: '20px 20px 0 0',
    paddingBottom: 'env(safe-area-inset-bottom, 16px)',
    backgroundColor: '#ffffff',
});

const DragHandle = styled(Box)({
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d0d0d0',
    margin: '12px auto 8px',
});

const BottomSheetTitle = styled(Typography)({
    fontWeight: 700,
    fontSize: '1.1rem',
    padding: '8px 20px 16px',
    color: '#1a1a1a',
});

// Grid item for MS Teams style
const GridItem = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    padding: '8px 4px',
    borderRadius: 12,
    '&:active': {
        backgroundColor: '#f0f0f0',
        transform: 'scale(0.95)',
        transition: 'transform 0.1s ease',
    },
});

const GridIconBox = styled(Box)(({ bgcolor }) => ({
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: bgcolor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const GridLabel = styled(Typography)({
    fontSize: '0.7rem',
    fontWeight: 500,
    color: '#333',
    textAlign: 'center',
    lineHeight: 1.2,
});

// ============================================
// More Menu Items (all pages from side nav)
// ============================================

const moreMenuItems = [
    { label: 'Coaching', icon: <SchoolIcon />, page: 'coaching', color: '#2196f3' },
    { label: 'Evaluations', icon: <EvaluationIcon />, page: 'evaluations', color: '#9c27b0' },
    { label: 'Rewards', icon: <RewardsIcon />, page: 'rewards', color: '#ff9800' },
    { label: 'Requests', icon: <RequestsIcon />, page: 'requests', color: '#4caf50' },
    { label: 'Disputes', icon: <DisputeIcon />, page: 'disputes', color: '#f44336' },
    { label: 'Events', icon: <EventIcon />, page: 'events', color: '#e91e63' },
    { label: 'Logs', icon: <LogsIcon />, page: 'logs', color: '#607d8b' },
];

// ============================================
// Component
// ============================================

const mockNotifications = [
    {
        id: 1,
        title: "Shift Swap Request",
        message: "Omar Jabri requested a shift swap for Feb 19.",
        time: "30m ago",
        read: false,
        icon: <SwapIcon />,
        color: "#2196f3"
    },
    {
        id: 2,
        title: "System Alert",
        message: "Scheduled maintenance tonight at 02:00 AM.",
        time: "2h ago",
        read: false,
        icon: <AlertIcon />,
        color: "#ff9800"
    },
    {
        id: 3,
        title: "Evaluation Available",
        message: "Your Q1 performance review is ready.",
        time: "1d ago",
        read: true,
        icon: <EvaluationIcon />,
        color: "#9c27b0"
    }
];

const NotificationItem = styled(ListItem)(({ theme, unread }) => ({
    backgroundColor: unread ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
    borderBottom: '1px solid #f0f0f0',
    '&:last-child': {
        borderBottom: 'none',
    },
}));

const AppLayout = ({ children, currentPage, onPageChange }) => {
    const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
    const [disputeModalOpen, setDisputeModalOpen] = useState(false);
    const [vacationModalOpen, setVacationModalOpen] = useState(false);
    const [swapModalOpen, setSwapModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

    const handleBottomNavChange = (event, newValue) => {
        if (newValue === 'more') {
            setMoreDrawerOpen(true);
        } else {
            onPageChange(newValue);
        }
    };

    const handleMoreDrawerClose = () => setMoreDrawerOpen(false);
    const handleMoreDrawerOpen = () => setMoreDrawerOpen(true);

    const handleMoreMenuItemClick = (page) => {
        handleMoreDrawerClose();
        onPageChange(page);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
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
            {/* Top Navigation Bar — no hamburger */}
            <StyledAppBar position="fixed">
                <Toolbar variant="dense" sx={{ minHeight: 56 }}>
                    <AppTitle variant="h6" component="div">
                        Globitel Workforce
                    </AppTitle>
                    <NotificationIconButton
                        edge="end"
                        color="inherit"
                        aria-label="notifications"
                        onClick={() => setNotificationDrawerOpen(true)}
                    >
                        <Badge
                            badgeContent={2}
                            color="error"
                            sx={{
                                '& .MuiBadge-badge': {
                                    right: 4,
                                    top: 4,
                                    border: `2px solid var(--primary-color)`,
                                    padding: '0 4px',
                                    height: 18,
                                    minWidth: 18,
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    lineHeight: 0, // Centering fix requested by user
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }
                            }}
                        >
                            <NotificationsIcon />
                        </Badge>
                    </NotificationIconButton>
                </Toolbar>
            </StyledAppBar>

            {/* Main Content Area */}
            <MainContent component="main">
                {children}
            </MainContent>

            {/* Bottom Navigation Bar - Hide on sub-pages */}
            {!['dayTimeline', 'performanceDetails'].includes(currentPage) && (
                <BottomNavBar
                    value={currentPage}
                    onChange={handleBottomNavChange}
                />
            )}

            {/* More Bottom Sheet — MS Teams grid style */}
            <SwipeableDrawer
                anchor="bottom"
                open={moreDrawerOpen}
                onClose={handleMoreDrawerClose}
                onOpen={handleMoreDrawerOpen}
                disableSwipeToOpen
                PaperProps={{
                    sx: {
                        borderRadius: '20px 20px 0 0',
                        maxHeight: '50vh',
                        backgroundColor: '#ffffff',
                    },
                }}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <BottomSheetContainer>
                    <DragHandle />
                    <BottomSheetTitle>More</BottomSheetTitle>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '12px',
                        padding: '0 20px 24px',
                    }}>
                        {moreMenuItems.map((item) => (
                            <GridItem
                                key={item.page}
                                onClick={() => handleMoreMenuItemClick(item.page)}
                            >
                                <GridIconBox bgcolor={`${item.color}18`}>
                                    {/* Clone icon with color */}
                                    <Box sx={{ color: item.color, display: 'flex' }}>
                                        {item.icon}
                                    </Box>
                                </GridIconBox>
                                <GridLabel>{item.label}</GridLabel>
                            </GridItem>
                        ))}
                    </Box>
                </BottomSheetContainer>
            </SwipeableDrawer>

            {/* Notification Drawer */}
            <SwipeableDrawer
                anchor="bottom"
                open={notificationDrawerOpen}
                onClose={() => setNotificationDrawerOpen(false)}
                onOpen={() => setNotificationDrawerOpen(true)}
                disableSwipeToOpen
                PaperProps={{
                    sx: {
                        borderRadius: '20px 20px 0 0',
                        maxHeight: '70vh',
                        backgroundColor: '#ffffff',
                    },
                }}
            >
                <BottomSheetContainer>
                    <DragHandle />
                    <Box sx={{ px: 3, pt: 1, pb: 2 }}>
                        <Typography variant="h6" fontWeight={700} textAlign="center">Notifications</Typography>
                    </Box>
                    <List sx={{ pt: 0 }}>
                        {mockNotifications.map((notif) => (
                            <NotificationItem key={notif.id} unread={notif.read ? 0 : 1} disablePadding>
                                <Box sx={{ width: '100%', p: 2, display: 'flex', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: `${notif.color}20`, color: notif.color, width: 40, height: 40 }}>
                                        {notif.icon}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: '0.9rem' }}>
                                                {notif.title}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {notif.time}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.85rem', lineHeight: 1.3, mb: 0.5 }}>
                                            {notif.message}
                                        </Typography>
                                        {!notif.read && (
                                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                <Button size="small" variant="text" sx={{ p: 0, minWidth: 'auto', fontSize: '0.75rem', fontWeight: 600 }}>
                                                    View
                                                </Button>
                                                <Button size="small" variant="text" color="inherit" sx={{ p: 0, minWidth: 'auto', fontSize: '0.75rem', color: '#888' }}>
                                                    Dismiss
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                    {!notif.read && (
                                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2196f3', mt: 1 }} />
                                    )}
                                </Box>
                            </NotificationItem>
                        ))}
                    </List>
                </BottomSheetContainer>
            </SwipeableDrawer>

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
