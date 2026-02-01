
import React, { useState, useEffect } from 'react';
import { useHabitStore, isTaskScheduledForDate } from './lib/store';
import { ViewMode } from './types';
import { TodayIcon, HistoryIcon, SettingsIcon } from './components/Icons';
import TodayView from './pages/TodayView';
import HistoryView from './pages/HistoryView';
import SettingsView from './pages/SettingsView';
import WidgetSimulator from './components/WidgetSimulator';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('today');
  const store = useHabitStore();

  useEffect(() => {
    const checkAndNotify = () => {
      if (!("Notification" in window) || Notification.permission !== "granted") return;

      const now = new Date();
      const currentHM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const todayStr = now.toISOString().split('T')[0];

      if (currentHM === store.settings.reminderTime && store.settings.lastNotifiedDate !== todayStr) {
        const scheduledToday = store.tasks.filter(t => isTaskScheduledForDate(t, todayStr));
        const completedToday = store.records.filter(r => r.date === todayStr && r.isCompleted).length;
        const pending = scheduledToday.length - completedToday;

        if (pending > 0) {
          new Notification("HabitPulse 提醒", {
            body: `您今天還有 ${pending} 個習慣尚未完成！`,
          });
        }
        store.updateSettings({ lastNotifiedDate: todayStr });
      }
    };

    const interval = setInterval(checkAndNotify, 60000);
    return () => clearInterval(interval);
  }, [store]);

  const renderContent = () => {
    switch (view) {
      case 'today': return <TodayView store={store} />;
      case 'history': return <HistoryView store={store} />;
      case 'settings': return <SettingsView store={store} />;
      case 'widget': return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-in zoom-in-95 duration-500">
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">Widget 預覽</h2>
            <p className="text-sm text-slate-500">模擬行動端小工具樣式</p>
          </div>
          <WidgetSimulator store={store} />
        </div>
      );
      default: return <TodayView store={store} />;
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-20 flex flex-col max-w-2xl mx-auto bg-slate-50 shadow-2xl border-x border-slate-200">
      <header className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-b border-slate-100 z-50 max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-200">H</div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">HabitPulse</h1>
        </div>
        <div className="hidden md:flex space-x-2">
           <NavButton active={view === 'today'} onClick={() => setView('today')} icon={<TodayIcon className="w-5 h-5" />} label="今日" />
           <NavButton active={view === 'widget'} onClick={() => setView('widget')} icon={<span className="text-lg">📱</span>} label="小工具" />
           <NavButton active={view === 'history'} onClick={() => setView('history')} icon={<HistoryIcon className="w-5 h-5" />} label="歷史" />
           <NavButton active={view === 'settings'} onClick={() => setView('settings')} icon={<SettingsIcon className="w-5 h-5" />} label="設定" />
        </div>
      </header>

      <main className="flex-1 px-4 py-8 mt-16 md:mt-4">
        {renderContent()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 flex justify-around items-center h-16 md:hidden z-50 max-w-2xl mx-auto px-2">
        <NavButton active={view === 'today'} onClick={() => setView('today')} icon={<TodayIcon />} label="今日" />
        <NavButton active={view === 'widget'} onClick={() => setView('widget')} icon={<span className="text-xl">📱</span>} label="小工具" />
        <NavButton active={view === 'history'} onClick={() => setView('history')} icon={<HistoryIcon />} label="歷史" />
        <NavButton active={view === 'settings'} onClick={() => setView('settings')} icon={<SettingsIcon />} label="設定" />
      </nav>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex flex-col md:flex-row items-center justify-center space-y-1 md:space-y-0 md:space-x-2 px-4 py-2 rounded-2xl transition-all duration-300 ${
      active ? 'text-blue-600 bg-blue-50/50 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
    }`}
  >
    {icon}
    <span className="text-[10px] md:text-sm font-bold">{label}</span>
  </button>
);

export default App;
