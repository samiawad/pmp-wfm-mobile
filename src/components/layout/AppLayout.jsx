import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton, AppBar, Toolbar, Typography } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import NavigationDrawer from './NavigationDrawer';
import BottomNavBar from './BottomNavBar';

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

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const handleBottomNavChange = (event, newValue) => {
        onPageChange(newValue);
    };

    const handleActionClick = () => {
        console.log('Action button clicked');
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
            <NavigationDrawer open={drawerOpen} onClose={handleDrawerClose} />

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
        </RootContainer>
    );
};

export default AppLayout;
