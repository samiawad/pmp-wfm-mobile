import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Box, IconButton, AppBar, Toolbar, Typography,
    SwipeableDrawer,
    Snackbar, Alert, Badge,
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
    SwapHoriz as SwapIcon,
    NotificationImportant as AlertIcon,
} from '@mui/icons-material';
import BottomNavBar from './BottomNavBar';
import DisputeModal from '../common/DisputeModal';
import VacationRequestModal from '../common/VacationRequestModal';
import ShiftSwapRequestModal from '../common/ShiftSwapRequestModal';

// ============================================
// Per-page title map
// ============================================

const PAGE_TITLES = {
    home: 'Globitel Workforce',
    schedule: 'My Schedule',
    dayTimeline: 'My Schedule',
    performance: 'My Performance',
    performanceDetails: 'My Performance',
    activities: 'Activities',
    coaching: 'Coaching',
    requests: 'My Requests',
    rewards: 'Rewards',
    evaluations: 'Evaluations',
    disputes: 'Disputes',
    events: 'Events',
    logs: 'Logs',
};

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
    backgroundColor: '#ffffff',
    boxShadow: 'none',
    borderBottom: '1px solid #E8ECF1',
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


const AppLayout = ({ children, currentPage, onPageChange }) => {
    const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
    const [disputeModalOpen, setDisputeModalOpen] = useState(false);
    const [vacationModalOpen, setVacationModalOpen] = useState(false);
    const [swapModalOpen, setSwapModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

    const handleBottomNavChange = (newValue) => {
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

        const getPageTitle = (page) => {
            switch (page) {
                case 'home': return 'Globitel Workforce';
                case 'schedule': return 'My Schedule';
                case 'dayTimeline': return 'My Schedule';
                case 'performance': return 'My Performance';
                case 'performanceDetails': return 'My Performance';
                case 'activities': return 'Activities';
                case 'coaching': return 'Coaching';
                case 'requests': return 'My Requests';
                case 'rewards': return 'Rewards';
                case 'evaluations': return 'Evaluations';
                case 'disputes': return 'Disputes';
                case 'events': return 'Events';
                case 'logs': return 'Logs';
                default:
                    return page.charAt(0).toUpperCase() + page.slice(1);
            }
        };

        return (
            <RootContainer>
                {/* Top Navigation Bar — hidden on home (V2 has its own header) */}
                {currentPage !== 'home' && (
                    <StyledAppBar position="fixed">
                        <Toolbar sx={{ minHeight: '64px', px: 2, display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                                <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: '#1A2138' }}>
                                    {getPageTitle(currentPage)}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                    onClick={() => setNotificationDrawerOpen(true)}
                                    sx={{
                                        color: '#1A2138',
                                        '&:hover': { backgroundColor: '#f5f5f5' }
                                    }}
                                >
                                    <Badge
                                        badgeContent={2}
                                        color="error"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                right: 2, top: 4, height: 16, minWidth: 16, fontSize: '0.6rem',
                                            }
                                        }}
                                    >
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                                <IconButton
                                    sx={{
                                        backgroundColor: '#E3F2FD',
                                        color: 'var(--primary-color)',
                                        borderRadius: '50%',
                                        width: 40,
                                        height: 40,
                                        '&:hover': { backgroundColor: '#BBDEFB' },
                                    }}
                                >
                                    <EventIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Toolbar>
                    </StyledAppBar>
                )}

                {/* Main Content Area — no top padding on home (no AppBar) */}
                <MainContent
                    component="main"
                    sx={currentPage === 'home' ? { paddingTop: 0 } : {}}
                >
                    {children}
                </MainContent>

            {/* Bottom Navigation Bar - Hide on sub-pages */}
            {!['dayTimeline', 'performanceDetails'].includes(currentPage) && (
                <BottomNavBar
                    value={currentPage}
                    onChange={handleBottomNavChange}
                />
            )}

            {/* More Bottom Sheet — Profile/Settings style */}
            <SwipeableDrawer
                anchor="bottom"
                open={moreDrawerOpen}
                onClose={handleMoreDrawerClose}
                onOpen={handleMoreDrawerOpen}
                disableSwipeToOpen
                PaperProps={{
                    sx: {
                        borderRadius: '20px 20px 0 0',
                        maxHeight: '60vh',
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
                                <GridIconBox bgcolor={`${item.color}15`}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', px: 2.5, pt: 1, pb: 1.5 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a', flexGrow: 1 }}>
                            Notifications
                        </Typography>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-color)', cursor: 'pointer' }}>
                            Mark all read
                        </Typography>
                    </Box>
                    <Box sx={{ overflowY: 'auto' }}>
                        {mockNotifications.map((notif) => (
                            <Box
                                key={notif.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    px: 2,
                                    py: 1.5,
                                    gap: 1.5,
                                    backgroundColor: notif.read ? 'transparent' : 'rgba(0,86,179,0.04)',
                                    borderLeft: notif.read ? '3px solid transparent' : '3px solid var(--primary-color)',
                                    borderBottom: '1px solid #f5f5f5',
                                    cursor: 'pointer',
                                    '&:last-child': { borderBottom: 'none' },
                                }}
                            >
                                <Box sx={{
                                    width: 42, height: 42, borderRadius: 2.5, flexShrink: 0,
                                    backgroundColor: `${notif.color}15`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: notif.color,
                                }}>
                                    {notif.icon}
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.4 }}>
                                        <Typography sx={{ fontWeight: notif.read ? 500 : 700, fontSize: '0.88rem', color: '#1a1a1a' }}>
                                            {notif.title}
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.72rem', color: '#999', flexShrink: 0, ml: 1, mt: 0.2 }}>
                                            {notif.time}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{
                                        fontSize: '0.8rem', color: '#555', lineHeight: 1.4,
                                        overflow: 'hidden', display: '-webkit-box',
                                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                    }}>
                                        {notif.message}
                                    </Typography>
                                </Box>
                                {!notif.read && (
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--primary-color)', mt: 0.5, flexShrink: 0 }} />
                                )}
                            </Box>
                        ))}
                    </Box>
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
