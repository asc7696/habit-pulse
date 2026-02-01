
import React from 'react';
import { Task, Category, DailyRecord, DailyLog } from '../types';
import { isTaskScheduledForDate } from '../lib/store';
import { CheckIcon } from './Icons';

interface WidgetSimulatorProps {
  store: any;
}

const WidgetSimulator: React.FC<WidgetSimulatorProps> = ({ store }) => {
  const today = new Date().toISOString().split('T')[0];
  const scheduledTasks = store.tasks.filter((t: Task) => isTaskScheduledForDate(t, today));
  const todayRecords = store.records.filter((r: DailyRecord) => r.date === today);
  const todayLog = store.logs.find((l: DailyLog) => l.date === today);

  // 計算總連擊（以任務中最長的為代表或平均值）
  const totalStreak = store.tasks.reduce((max: number, t: Task) => Math.max(max, store.calculateStreak(t.id)), 0);

  return (
    <div className="relative w-80 bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-2xl p-6 overflow-hidden ring-4 ring-slate-900/5">
      {/* Widget Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xs font-black text-blue-600 tracking-widest uppercase">HabitPulse</h3>
          <p className="text-[10px] text-slate-400 font-bold">{new Date().toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center space-x-2 bg-orange-100 px-2 py-1 rounded-full">
           <span className="text-sm">🔥</span>
           <span className="text-xs font-black text-orange-600">{totalStreak}</span>
        </div>
      </div>

      {/* Main Content: Tasks */}
      <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar mb-4">
        {scheduledTasks.length === 0 ? (
          <p className="text-[10px] text-center text-slate-400 py-4 font-medium italic">今日無任務，享受生活吧！</p>
        ) : (
          scheduledTasks.map((task: Task) => {
            const category = store.categories.find((c: Category) => c.id === task.categoryId);
            const isDone = todayRecords.some((r: DailyRecord) => r.taskId === task.id && r.isCompleted);
            
            return (
              <div 
                key={task.id} 
                className={`flex items-center p-2 rounded-xl transition-all ${isDone ? 'bg-slate-50/50 opacity-60' : 'bg-white shadow-sm'}`}
              >
                <div 
                  className="w-1 h-6 rounded-full mr-3 shrink-0" 
                  style={{ backgroundColor: category?.color || '#cbd5e1' }}
                />
                <span className={`flex-1 text-xs font-semibold truncate ${isDone ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {task.name}
                </span>
                <button 
                  onClick={() => store.toggleRecord(today, task.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                    isDone ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-transparent'
                  }`}
                >
                  <CheckIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Photo Thumbnail Section */}
      <div className="flex items-center space-x-3 border-t border-slate-100 pt-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
          {todayLog?.photoUrl ? (
            <img src={todayLog.photoUrl} className="w-full h-full object-cover" alt="今日照片" />
          ) : (
            <span className="text-xs">📷</span>
          )}
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase">今日日誌</p>
          <p className="text-[10px] text-slate-400 truncate w-40">
            {todayLog?.note || '點擊 App 紀錄今天...'}
          </p>
        </div>
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
      </div>

      {/* Android Styling Ornament */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-200 rounded-full" />
    </div>
  );
};

export default WidgetSimulator;
