import { styled } from '@mui/material/styles';
import {
    BottomNavigation,
    BottomNavigationAction,
    Paper,
    Fab,
} from '@mui/material';
import {
    Home as HomeIcon,
    HomeOutlined as HomeOutlinedIcon,
    CalendarMonth as ScheduleIcon,
    CalendarMonthOutlined as ScheduleOutlinedIcon,
    Add as AddIcon,
    Assessment as PerformanceIcon,
    AssessmentOutlined as PerformanceOutlinedIcon,
    MoreHoriz as MoreIcon,
    MoreHorizOutlined as MoreOutlinedIcon,
} from '@mui/icons-material';

// ============================================
// Styled Components
// ============================================

const StyledPaper = styled(Paper)(({ theme }) => ({
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: 'var(--spacing-3) 0',
    backgroundColor: '#ffffff',
    borderTop: '1px solid var(--color-outline-variant)',
}));

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
    backgroundColor: 'transparent',
    height: 'var(--spacing-xl)',
    '& .MuiBottomNavigationAction-root': {
        color: '#9e9e9e',
        minWidth: 'auto',
        padding: 'var(--spacing-xs) var(--spacing-sm)',
        '&.Mui-selected': {
            color: 'var(--color-primary)',
        },
    },
    '& .MuiBottomNavigationAction-label': {
        fontSize: 'var(--font-size-xs)',
        fontWeight: 500,
        '&.Mui-selected': {
            fontSize: 'var(--font-size-xs)',
            fontWeight: 600,
        },
    },
}));

const CenterPlaceholder = styled(BottomNavigationAction)(({ theme }) => ({
    visibility: 'hidden',
    pointerEvents: 'none',
}));

const StyledFab = styled(Fab)(({ theme }) => ({
    position: 'absolute',
    bottom: '28px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#ffffff',
    color: 'var(--color-primary)',
    width: 56,
    height: 56,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    '&:hover': {
        backgroundColor: '#f5f5f5',
    },
    '&:active': {
        backgroundColor: '#ffffff',
    },
}));

const AddIconStyled = styled(AddIcon)(({ theme }) => ({
    fontSize: 28,
}));

// ============================================
// Component
// ============================================

const BottomNavBar = ({ value, onChange, onActionClick }) => {
    return (
        <StyledPaper elevation={3}>
            <StyledBottomNavigation value={value} onChange={onChange} showLabels>
                <BottomNavigationAction
                    label="Home"
                    value="home"
                    icon={value === 'home' ? <HomeIcon /> : <HomeOutlinedIcon />}
                />
                <BottomNavigationAction
                    label="Schedule"
                    value="schedule"
                    icon={value === 'schedule' ? <ScheduleIcon /> : <ScheduleOutlinedIcon />}
                />

                {/* Center FAB placeholder */}
                <CenterPlaceholder disabled />

                <BottomNavigationAction
                    label="Performance"
                    value="performance"
                    icon={value === 'performance' ? <PerformanceIcon /> : <PerformanceOutlinedIcon />}
                />
                <BottomNavigationAction
                    label="More"
                    value="more"
                    icon={value === 'more' ? <MoreIcon /> : <MoreOutlinedIcon />}
                />
            </StyledBottomNavigation>

            {/* Floating Action Button (FAB) for Actions */}
            <StyledFab aria-label="actions" onClick={onActionClick}>
                <AddIconStyled />
            </StyledFab>
        </StyledPaper>
    );
};

export default BottomNavBar;
