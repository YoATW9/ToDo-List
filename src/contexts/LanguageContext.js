import React, { createContext, useState, useContext, useEffect } from 'react';

const translations = {
  EN: {
    addTask: 'Add Task',
    updateTask: 'Update Task',
    title: 'Title',
    description: 'Description',
    dueDate: 'Due Date',
    dueTime: 'Due Time',
    priority: 'Priority',
    category: 'Category',
    status: 'Status',
    cancel: 'Cancel',
    save: 'Save',
    titleRequired: 'Title is required',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    personal: 'Personal',
    work: 'Work',
    shopping: 'Shopping',
    health: 'Health',
    education: 'Education',
    taskAdded: 'Task added successfully',
    taskUpdated: 'Task updated successfully',
    taskDeleted: 'Task deleted successfully',
    taskDueSoon: 'Task "{title}" is due soon',
    monthly: 'Monthly',
    daily: 'Daily',
    noTasks: 'No tasks yet. Click + to add one!',
    noUpcoming: 'No upcoming tasks',
    noNotifications: 'No notifications',
    today: 'Today',
    tomorrow: 'Tomorrow',
    later: 'Later',
    upcomingTasks: 'Upcoming Tasks',
    notifications: 'Notifications',
    yourProgress: 'My Progress',
    completionRate: 'Completion Rate',
    tasksCompleted: 'Tasks Completed',
    tasksPending: 'Tasks Pending',
    mostProductiveDay: 'Most Productive Day',
    recentActivity: 'Recent Activity',
    settings: 'Settings',
    language: 'Language',
    darkMode: 'Dark Mode',
    dark: 'Dark',
    light: 'Light',
    close: 'Close',
    tasks: 'Tasks',
    all: 'All',
  },
  'ZH-TW': {
    addTask: '新增任務',
    updateTask: '更新任務',
    title: '標題',
    description: '描述',
    dueDate: '截止日期',
    dueTime: '截止時間',
    priority: '優先級',
    category: '類別',
    status: '狀態',
    cancel: '取消',
    save: '儲存',
    titleRequired: '標題為必填項',
    low: '低',
    medium: '中',
    high: '高',
    personal: '個人',
    work: '工作',
    shopping: '購物',
    health: '健康',
    education: '教育',
    taskAdded: '任務新增成功',
    taskUpdated: '任務更新成功',
    taskDeleted: '任務刪除成功',
    taskDueSoon: '任務 "{title}" 即將到期',
    monthly: '月曆',
    daily: '日曆',
    noTasks: '目前沒有任務。點擊 + 新增任務！',
    noUpcoming: '沒有即將到期的任務',
    noNotifications: '沒有通知',
    today: '今天',
    tomorrow: '明天',
    later: '之後',
    upcomingTasks: '即將到期的任務',
    notifications: '通知',
    yourProgress: '您的進度',
    completionRate: '完成率',
    tasksCompleted: '已完成任務',
    tasksPending: '待處理任務',
    mostProductiveDay: '最高效的一天',
    recentActivity: '最近活動',
    settings: '設定',
    language: '語言',
    darkMode: '深色模式',
    dark: '深色',
    light: '淺色',
    close: '關閉',
    tasks: '任務',
    all: '全部',
  }
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage ? savedLanguage.toUpperCase() : 'EN';
  });

  useEffect(() => {
    localStorage.setItem('language', language.toUpperCase());
  }, [language]);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage.toUpperCase());
  };

  const t = (key) => {
    const lang = language.toUpperCase();
    return translations[lang]?.[key] || translations.EN[key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    availableLanguages: [
      { code: 'EN', name: 'English' },
      { code: 'ZH-TW', name: '繁體中文' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
