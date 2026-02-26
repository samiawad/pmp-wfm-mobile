import { useState } from 'react';
import HomeDashboard from './components/features/HomeDashboard';
import SchedulePage from './components/features/SchedulePage';
import PerformancePage from './components/features/PerformancePage';
import ActivitiesPage from './components/features/ActivitiesPage';
import CoachingPage from './components/features/CoachingPage';
import RequestsPage from './components/features/RequestsPage';
import EvaluationsPage from './components/features/EvaluationsPage';
<<<<<<< HEAD
import GamificationDashboard from './components/gamification/GamificationDashboard';
<<<<<<< HEAD
=======
import RewardsPage from './components/features/RewardsPage';
import DisputesPage from './components/features/DisputesPage';
import LogsPage from './components/features/LogsPage';
import EventsPage from './components/features/EventsPage';
>>>>>>> parent of f359df4 (Competitions change)
=======
import DisputesPage from './components/features/DisputesPage';
import LogsPage from './components/features/LogsPage';
import EventsPage from './components/features/EventsPage';
>>>>>>> parent of 06e16e3 (Will revert this commit)
import DayTimelinePage from './components/features/DayTimelinePage';
import AppLayout from './components/layout/AppLayout';
import './App.css';

// Fallback day data used when navigating to dailyTimeline via URL (no session data available)
const FALLBACK_DAY = {
  day: 'Tuesday',
  date: 'Feb 4',
  isToday: true,
  isOffDay: false,
  startTime: '2:00 PM',
  endTime: '10:00 PM',
  duration: '8 hours',
};

// Read URL params once on startup to determine the initial page & sub-state
const readInitialState = () => {
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page') || 'home';
  const view = params.get('view') || '';

  // Map page+view to App state
  switch (page) {
    case 'schedule':
      if (view === 'dailyTimeline' || view === 'request') {
        // dailyTimeline needs data — use fallback so the page isn't blank
        return { currentPage: 'dayTimeline', selectedDayData: FALLBACK_DAY, scheduleList: [FALLBACK_DAY] };
      }
      return { currentPage: 'schedule' };
    case 'performance':
      return { currentPage: 'performance' };
    case 'home':
    default:
      return { currentPage: 'home' };
  }
};

function App() {
  const initial = readInitialState();

  const [currentPage, setCurrentPage] = useState(initial.currentPage);
  const [requestsTab, setRequestsTab] = useState(0);
  const [activitiesFilter, setActivitiesFilter] = useState('All');
  const [selectedKPI, setSelectedKPI] = useState(null);
<<<<<<< HEAD
  const [selectedDayData, setSelectedDayData] = useState(initial.selectedDayData || null);
  const [scheduleList, setScheduleList] = useState(initial.scheduleList || []);
=======
<<<<<<< HEAD
<<<<<<< HEAD

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
=======
>>>>>>> parent of f359df4 (Competitions change)

  const handleNotificationClick = (page, tabIndexOrFilter = 0) => {
<<<<<<< HEAD
    if (page === 'coaching') {
      navigateToActivities('Coaching');
=======
    setCurrentPage(page);
    if (page === 'requests') {
      setRequestsTab(tabIndexOrFilter);
    } else if (page === 'activities') {
      setActivitiesFilter(tabIndexOrFilter);
>>>>>>> fd0f6baee8b068cfb6340cd9bb2fe737188e1707
    } else if (page === 'evaluations') {
      navigateToActivities('Evaluations');
    } else if (page === 'requests') {
=======
  const [selectedDayData, setSelectedDayData] = useState(null);
  const [scheduleList, setScheduleList] = useState([]);
>>>>>>> 15c05d1f88003ff72f4d465781c28d18c9888bb0

  const handleNotificationClick = (page, tabIndexOrFilter = 0) => {
    setCurrentPage(page);
    if (page === 'requests') {
>>>>>>> parent of 06e16e3 (Will revert this commit)
      setRequestsTab(tabIndexOrFilter);
    } else if (page === 'activities') {
      setActivitiesFilter(tabIndexOrFilter);
    } else if (page === 'coaching') {
      setCurrentPage('activities'); // Redirect to Activities
      setActivitiesFilter('Coaching');
    } else if (page === 'evaluations') {
      setCurrentPage('activities');
      setActivitiesFilter('Evaluations');
    }
  };

  const handleKPIClick = (kpi) => {
    setSelectedKPI(kpi);
    setCurrentPage('performanceDetails');
  };

  const handleBackFromKPI = () => {
    setSelectedKPI(null);
    setCurrentPage('performance');
  };

  const handleDayClick = (dayData, index, schedule) => {
    setSelectedDayData(dayData);
    setScheduleList(schedule);
    setCurrentPage('dayTimeline');
  };

  const handleBackFromDayTimeline = () => {
    setCurrentPage('schedule');
    setSelectedDayData(null);
    setScheduleList([]);
  };

  const handleDayChange = (newDayData) => {
    setSelectedDayData(newDayData);
  };

  return (
    <AppLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      <div className="app-container">
        {currentPage === 'home' && <HomeDashboard onAction={handleNotificationClick} onPageChange={setCurrentPage} onDayClick={handleDayClick} />}
        {currentPage === 'schedule' && <SchedulePage onDayClick={handleDayClick} />}
        {currentPage === 'dayTimeline' && (
          <DayTimelinePage
            dayData={selectedDayData}
            scheduleList={scheduleList}
            onDayChange={handleDayChange}
            onBack={handleBackFromDayTimeline}
          />
        )}
        {currentPage === 'performance' && <PerformancePage onKPIClick={handleKPIClick} />}
        {currentPage === 'performanceDetails' && <PerformancePage selectedKPI={selectedKPI} onBack={handleBackFromKPI} />}
        {currentPage === 'activities' && <ActivitiesPage initialFilter={activitiesFilter} />}
<<<<<<< HEAD
<<<<<<< HEAD
=======
        {currentPage === 'coaching' && <CoachingPage />}

>>>>>>> fd0f6baee8b068cfb6340cd9bb2fe737188e1707
        {currentPage === 'requests' && <RequestsPage defaultTab={requestsTab} />}
<<<<<<< HEAD
        {currentPage === 'rewards' && (
          <GamificationDashboard
            initialTab={urlState.tab || urlState.view}
            initialOverlay={urlState.overlay}
            isUrlDriven={urlState.isUrlDriven}
          />
        )}
        {currentPage === 'coaching' && <ActivitiesPage initialFilter="Coaching" />}
        {currentPage === 'evaluations' && <EvaluationsPage />}
=======
        {currentPage === 'rewards' && <RewardsPage />}
        {currentPage === 'evaluations' && <ActivitiesPage initialFilter="Evaluations" />}
>>>>>>> parent of f359df4 (Competitions change)
=======

        {currentPage === 'requests' && <RequestsPage defaultTab={requestsTab} />}
        {currentPage === 'rewards' && <GamificationDashboard />}
        {currentPage === 'evaluations' && <ActivitiesPage initialFilter="Evaluations" />}
>>>>>>> parent of 06e16e3 (Will revert this commit)
        {currentPage === 'disputes' && <RequestsPage defaultTab={4} />}
        {currentPage === 'events' && <ActivitiesPage initialFilter="Events" />}
        {currentPage === 'logs' && <ActivitiesPage initialFilter="Logs" />}
      </div>
    </AppLayout>
  );
}

export default App;
