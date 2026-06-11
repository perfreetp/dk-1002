import { useState, useEffect } from 'react';
import { CampgroundPage } from './pages/CampgroundPage';
import { TripPage } from './pages/TripPage';
import { ChecklistPage } from './pages/ChecklistPage';
import { TeamPage } from './pages/TeamPage';
import { WeatherPage } from './pages/WeatherPage';
import { TabBar } from './components/TabBar';
import { useAppStore } from './store/appStore';

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const validPaths = ['/', '/trip', '/checklist', '/team', '/weather'];
    const path = window.location.pathname;
    return validPaths.includes(path) ? path : '/';
  });
  const { checkOffline, loadData } = useAppStore();

  useEffect(() => {
    loadData();
    checkOffline();
    
    window.addEventListener('online', checkOffline);
    window.addEventListener('offline', checkOffline);
    
    return () => {
      window.removeEventListener('online', checkOffline);
      window.removeEventListener('offline', checkOffline);
    };
  }, [loadData, checkOffline]);

  useEffect(() => {
    const validPaths = ['/', '/trip', '/checklist', '/team', '/weather'];
    const path = window.location.pathname;
    if (validPaths.includes(path) && path !== currentPage) {
      setCurrentPage(path);
    }
  }, []);

  const handleNavigate = (page: string) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      window.history.pushState({}, '', page);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const validPaths = ['/', '/trip', '/checklist', '/team', '/weather'];
      const path = window.location.pathname;
      if (validPaths.includes(path)) {
        setCurrentPage(path);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case '/':
        return <CampgroundPage />;
      case '/trip':
        return <TripPage />;
      case '/checklist':
        return <ChecklistPage />;
      case '/team':
        return <TeamPage />;
      case '/weather':
        return <WeatherPage />;
      default:
        return <CampgroundPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderPage()}
      <TabBar currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}
