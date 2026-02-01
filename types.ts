
export type FrequencyType = 'daily' | 'weekly' | 'interval';

export interface TaskFrequency {
  type: FrequencyType;
  daysOfWeek?: number[]; // 0 (日) 到 6 (六)
  intervalDays?: number; // 每 X 天
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  categoryId: string;
  name: string;
  createdAt: number;
  frequency: TaskFrequency;
}

export interface DailyRecord {
  id: string;
  date: string; // YYYY-MM-DD
  taskId: string;
  isCompleted: boolean;
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  photoUrl?: string;
  note?: string;
}

export interface AppSettings {
  reminderTime: string; // HH:mm
  lastNotifiedDate?: string; // YYYY-MM-DD
}

export type ViewMode = 'today' | 'history' | 'settings' | 'widget';
