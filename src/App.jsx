import { useState } from 'react';
import HomeDashboard from './components/features/HomeDashboard';
import SchedulePage from './components/features/SchedulePage';
import PerformancePage from './components/features/PerformancePage';
import ActivitiesPage from './components/features/ActivitiesPage';
import RequestsPage from './components/features/RequestsPage';
import EvaluationsPage from './components/features/EvaluationsPage';
import GamificationDashboard from './components/gamification/GamificationDashboard';
import DayTimelinePage from './components/features/DayTimelinePage';
import AppLayout from './components/layout/AppLayout';
import useUrlState from './hooks/useUrlState';
import './App.css';

// Maps ?view= values to internal page keys
const VIEW_TO_PAGE = {
  home: 'home',
  schedule: 'schedule',
  dayTimeline: 'dayTimeline',
  performance: 'performance',
  rewards: 'rewards',
  trophies: 'rewards',
  leaderboard: 'rewards',
  activities: 'activities',
  requests: 'requests',
  disputes: 'disputes',
  events: 'events',
  logs: 'logs',
  coaching: 'coaching',
  evaluations: 'evaluations',
};

// -------------------------------------------------------
// Mock day data for ?view=dayTimeline deep-link
// (Tuesday Feb 4 — "Today" shift from current period)
// -------------------------------------------------------
const MOCK_DAY_DATA = {
  day: 'Tuesday',
  date: 'Feb 4',
  isToday: true,
  isOffDay: false,
  startTime: '2:00 PM',
  endTime: '10:00 PM',
  duration: '8 hours',
};

// Full current-period schedule used as the schedule list for day navigation
const MOCK_SCHEDULE_LIST = [
  { day: 'Monday', date: 'Feb 3', isToday: false, isOffDay: false, startTime: '7:00 AM', endTime: '3:00 PM', duration: '8 hours' },
  { day: 'Tuesday', date: 'Feb 4', isToday: true, isOffDay: false, startTime: '2:00 PM', endTime: '10:00 PM', duration: '8 hours' },
  { day: 'Wednesday', date: 'Feb 5', isToday: false, isOffDay: false, startTime: '9:00 AM', endTime: '5:00 PM', duration: '8 hours' },
  { day: 'Thursday', date: 'Feb 6', isToday: false, isOffDay: false, startTime: '11:00 AM', endTime: '8:00 PM', duration: '9 hours' },
  { day: 'Friday', date: 'Feb 7', isToday: false, isOffDay: true },
  { day: 'Saturday', date: 'Feb 8', isToday: false, isOffDay: false, startTime: '10:00 AM', endTime: '4:00 PM', duration: '6 hours' },
  { day: 'Sunday', date: 'Feb 9', isToday: false, isOffDay: true },
  { day: 'Monday', date: 'Feb 10', isToday: false, isOffDay: false, startTime: '3:00 PM', endTime: '11:00 PM', duration: '8 hours' },
  { day: 'Tuesday', date: 'Feb 11', isToday: false, isOffDay: false, startTime: '8:00 AM', endTime: '4:00 PM', duration: '8 hours' },
  { day: 'Wednesday', date: 'Feb 12', isToday: false, isOffDay: false, startTime: '12:00 PM', endTime: '8:00 PM', duration: '8 hours' },
  { day: 'Thursday', date: 'Feb 13', isToday: false, isOffDay: true },
  { day: 'Friday', date: 'Feb 14', isToday: false, isOffDay: false, startTime: '6:00 AM', endTime: '2:00 PM', duration: '8 hours' },
  { day: 'Saturday', date: 'Feb 15', isToday: false, isOffDay: false, startTime: '9:00 AM', endTime: '6:00 PM', duration: '9 hours' },
  { day: 'Sunday', date: 'Feb 16', isToday: false, isOffDay: true },
];

function App() {
  const urlState = useUrlState();

  // Initialise from ?view= URL param, fall back to 'home'
  const initialPage = (urlState.view && VIEW_TO_PAGE[urlState.view]) || 'home';

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [requestsTab, setRequestsTab] = useState(0);
  const [activitiesFilter, setActivitiesFilter] = useState('All');
  const [selectedKPI, setSelectedKPI] = useState(null);

  // For dayTimeline: use URL-injected mock data if driven by ?view=dayTimeline
  const [selectedDayData, setSelectedDayData] = useState(
    urlState.view === 'dayTimeline' ? MOCK_DAY_DATA : null
  );
  const [scheduleList, setScheduleList] = useState(
    urlState.view === 'dayTimeline' ? MOCK_SCHEDULE_LIST : []
  );

  /**
   * navigateTo — single source of truth for ALL page changes.
   * Updates React state AND pushes ?view=<page> into the browser URL bar.
   */
  const navigateTo = (page, extra = {}) => {
    setCurrentPage(page);
    const params = new URLSearchParams();
    params.set('view', page);
    Object.entries(extra).forEach(([k, v]) => params.set(k, v));
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  // Navigate to ActivitiesPage with a specific filter in one atomic step
  const navigateToActivities = (filter) => {
    setActivitiesFilter(filter);
    setCurrentPage('activities');
    const params = new URLSearchParams();
    params.set('view', 'activities');
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  const handleNotificationClick = (page, tabIndexOrFilter = 0) => {
    if (page === 'coaching') {
      navigateToActivities('Coaching');
    } else if (page === 'evaluations') {
      navigateToActivities('Evaluations');
    } else if (page === 'requests') {
      setRequestsTab(tabIndexOrFilter);
      navigateTo('requests');
    } else if (page === 'activities') {
      navigateToActivities(tabIndexOrFilter || 'All');
    } else {
      navigateTo(page);
    }
  };

  const handleKPIClick = (kpi) => {
    setSelectedKPI(kpi);
    navigateTo('performanceDetails');
  };

  const handleBackFromKPI = () => {
    setSelectedKPI(null);
    navigateTo('performance');
  };

  const handleDayClick = (dayData, index, schedule) => {
    setSelectedDayData(dayData);
    setScheduleList(schedule);
    navigateTo('dayTimeline');
  };

  const handleBackFromDayTimeline = () => {
    setSelectedDayData(null);
    setScheduleList([]);
    navigateTo('schedule');
  };

  const handleDayChange = (newDayData) => {
    setSelectedDayData(newDayData);
  };

  return (
    <AppLayout currentPage={currentPage} onPageChange={navigateTo} urlState={urlState}>
      <div className="app-container">
        {currentPage === 'home' && (
          <HomeDashboard
            onAction={handleNotificationClick}
            onPageChange={navigateTo}
            onDayClick={handleDayClick}
            initialSlide={urlState.slide}
            isUrlDriven={urlState.isUrlDriven}
          />
        )}
        {currentPage === 'schedule' && (
          <SchedulePage
            onDayClick={handleDayClick}
            initialSubview={urlState.subview}
            initialOverlay={urlState.overlay}
            isUrlDriven={urlState.isUrlDriven}
          />
        )}
        {currentPage === 'dayTimeline' && (
          <DayTimelinePage
            dayData={selectedDayData}
            scheduleList={scheduleList}
            onDayChange={handleDayChange}
            onBack={handleBackFromDayTimeline}
            initialOverlay={urlState.overlay}
            isUrlDriven={urlState.isUrlDriven}
          />
        )}
        {currentPage === 'performance' && <PerformancePage onKPIClick={handleKPIClick} />}
        {currentPage === 'performanceDetails' && <PerformancePage selectedKPI={selectedKPI} onBack={handleBackFromKPI} />}
        {currentPage === 'activities' && <ActivitiesPage initialFilter={activitiesFilter} />}
        {currentPage === 'requests' && <RequestsPage defaultTab={requestsTab} />}
        {currentPage === 'rewards' && (
          <GamificationDashboard
            initialTab={urlState.tab || urlState.view}
            initialOverlay={urlState.overlay}
            isUrlDriven={urlState.isUrlDriven}
          />
        )}
        {currentPage === 'coaching' && <ActivitiesPage initialFilter="Coaching" />}
        {currentPage === 'evaluations' && <EvaluationsPage />}
        {currentPage === 'disputes' && <RequestsPage defaultTab={4} />}
        {currentPage === 'events' && <ActivitiesPage initialFilter="Events" />}
        {currentPage === 'logs' && <ActivitiesPage initialFilter="Logs" />}
      </div>
    </AppLayout>
  );
}

export default App;
