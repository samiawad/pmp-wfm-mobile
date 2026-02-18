import { styled } from '@mui/material/styles';
import {
    BottomNavigation,
    BottomNavigationAction,
    Paper,
} from '@mui/material';
import {
    Home as HomeIcon,
    HomeOutlined as HomeOutlinedIcon,
    CalendarMonth as ScheduleIcon,
    CalendarMonthOutlined as ScheduleOutlinedIcon,
    History as ActivitiesIcon,
    HistoryOutlined as ActivitiesOutlinedIcon,
    Assessment as PerformanceIcon,
    AssessmentOutlined as PerformanceOutlinedIcon,
    MoreHoriz as MoreIcon,
    MoreHorizOutlined as MoreOutlinedIcon,
} from '@mui/icons-material';

// ============================================
// Styled Components
// ============================================

const StyledPaper = styled(Paper)({
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: 4,
    paddingBottom: 'env(safe-area-inset-bottom, 4px)',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e0e0e0',
});

const StyledBottomNavigation = styled(BottomNavigation)({
    backgroundColor: 'transparent',
    height: 56,
    '& .MuiBottomNavigationAction-root': {
        color: '#9e9e9e',
        minWidth: 'auto',
        padding: '4px 0',
        '&.Mui-selected': {
            color: 'var(--primary-color, #0056b3)',
        },
    },
    '& .MuiBottomNavigationAction-label': {
        fontSize: '0.65rem',
        fontWeight: 500,
        marginTop: 2,
        '&.Mui-selected': {
            fontSize: '0.65rem',
            fontWeight: 600,
        },
    },
});

// ============================================
// Component
// ============================================

const BottomNavBar = ({ value, onChange }) => {
    return (
        <StyledPaper elevation={0}>
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
                <BottomNavigationAction
                    label="Activities"
                    value="activities"
                    icon={value === 'activities' ? <ActivitiesIcon /> : <ActivitiesOutlinedIcon />}
                />
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
        </StyledPaper>
    );
};

export default BottomNavBar;
