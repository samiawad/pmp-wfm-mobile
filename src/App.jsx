import { useState } from 'react';
import HomeDashboard from './components/features/HomeDashboard';
import SchedulePage from './components/features/SchedulePage';
import AppLayout from './components/layout/AppLayout';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <AppLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      <div className="app-container">
        {currentPage === 'home' && <HomeDashboard />}
        {currentPage === 'schedule' && <SchedulePage />}
      </div>
    </AppLayout>
  );
}

export default App;


