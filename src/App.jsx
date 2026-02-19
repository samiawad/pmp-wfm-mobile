import { useState } from 'react';
import HomeDashboard from './components/features/HomeDashboard';
import SchedulePage from './components/features/SchedulePage';
import PerformancePage from './components/features/PerformancePage';
import ActivitiesPage from './components/features/ActivitiesPage';
import CoachingPage from './components/features/CoachingPage';
import RequestsPage from './components/features/RequestsPage';
import EvaluationsPage from './components/features/EvaluationsPage';
import RewardsPage from './components/features/RewardsPage';
import DisputesPage from './components/features/DisputesPage';
import LogsPage from './components/features/LogsPage';
import EventsPage from './components/features/EventsPage';
import DayTimelinePage from './components/features/DayTimelinePage';
import AppLayout from './components/layout/AppLayout';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [requestsTab, setRequestsTab] = useState(0);
  const [activitiesFilter, setActivitiesFilter] = useState('All');
  const [selectedKPI, setSelectedKPI] = useState(null);

  const handleNotificationClick = (page, tabIndexOrFilter = 0) => {
    setCurrentPage(page);
    if (page === 'requests') {
      setRequestsTab(tabIndexOrFilter);
    } else if (page === 'activities') {
      setActivitiesFilter(tabIndexOrFilter);
    } else if (page === 'coaching') {
      setCurrentPage('activities'); // Redirect to Activities
      setActivitiesFilter('Coaching');
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

        {currentPage === 'requests' && <RequestsPage defaultTab={requestsTab} />}
        {currentPage === 'rewards' && <RewardsPage />}
        {currentPage === 'evaluations' && <ActivitiesPage initialFilter="Evaluations" />}
        {currentPage === 'disputes' && <RequestsPage defaultTab={4} />}
        {currentPage === 'events' && <ActivitiesPage initialFilter="Events" />}
        {currentPage === 'logs' && <ActivitiesPage initialFilter="Logs" />}
      </div>
    </AppLayout>
  );
}

export default App;


