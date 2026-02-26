import { useState } from 'react';
import HomeDashboard from './components/features/HomeDashboard';
import SchedulePage from './components/features/SchedulePage';
import PerformancePage from './components/features/PerformancePage';
import ActivitiesPage from './components/features/ActivitiesPage';
import CoachingPage from './components/features/CoachingPage';
import RequestsPage from './components/features/RequestsPage';
import EvaluationsPage from './components/features/EvaluationsPage';
import GamificationDashboard from './components/gamification/GamificationDashboard';
import DisputesPage from './components/features/DisputesPage';
import LogsPage from './components/features/LogsPage';
import EventsPage from './components/features/EventsPage';
import DayTimelinePage from './components/features/DayTimelinePage';
import AppLayout from './components/layout/AppLayout';
import './App.css';

// Fallback day used when navigating directly to dailyTimeline via URL paste
const FALLBACK_DAY = {
  day: 'Tuesday', date: 'Feb 4', isToday: true, isOffDay: false,
  startTime: '2:00 PM', endTime: '10:00 PM', duration: '8 hours',
};

const readInitialState = () => {
  const p = new URLSearchParams(window.location.search);
  const page = p.get('page') || 'home';
  const view = p.get('view') || '';
  switch (page) {
    case 'schedule':
      if (view === 'dailyTimeline' || view === 'request')
        return { currentPage: 'dayTimeline', selectedDayData: FALLBACK_DAY, scheduleList: [FALLBACK_DAY] };
      return { currentPage: 'schedule' };
    case 'performance': return { currentPage: 'performance' };
    case 'rewards': return { currentPage: 'rewards' };
    case 'requests': return { currentPage: 'requests' };
    case 'coaching': return { currentPage: 'coaching' };
    case 'disputes': return { currentPage: 'disputes' };
    case 'home':
    default: return { currentPage: 'home' };
  }
};

function App() {
  const initial = readInitialState();
  const [currentPage, setCurrentPage] = useState(initial.currentPage);
  const [requestsTab, setRequestsTab] = useState(0);
  const [activitiesFilter, setActivitiesFilter] = useState('All');
  const [selectedKPI, setSelectedKPI] = useState(null);
  const [selectedDayData, setSelectedDayData] = useState(initial.selectedDayData || null);
  const [scheduleList, setScheduleList] = useState(initial.scheduleList || []);

  const handleNotificationClick = (page, tabIndexOrFilter = 0) => {
    setCurrentPage(page);
    if (page === 'requests') {
      setRequestsTab(tabIndexOrFilter);
    } else if (page === 'activities') {
      setActivitiesFilter(tabIndexOrFilter);
    } else if (page === 'evaluations') {
      setCurrentPage('activities'); // Redirect to Activities
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
        {currentPage === 'coaching' && <CoachingPage />}

        {currentPage === 'requests' && <RequestsPage defaultTab={requestsTab} />}
        {currentPage === 'rewards' && <GamificationDashboard />}
        {currentPage === 'evaluations' && <ActivitiesPage initialFilter="Evaluations" />}
        {currentPage === 'disputes' && <RequestsPage defaultTab={4} />}
        {currentPage === 'events' && <ActivitiesPage initialFilter="Events" />}
        {currentPage === 'logs' && <ActivitiesPage initialFilter="Logs" />}
      </div>
    </AppLayout>
  );
}

export default App;


