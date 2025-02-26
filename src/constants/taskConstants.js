export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  BLOCKED: 'blocked',
  COMPLETED: 'completed',
};

export const STATUS_COLORS = {
  [TASK_STATUS.TODO]: '#757575',
  [TASK_STATUS.IN_PROGRESS]: '#2196F3',
  [TASK_STATUS.BLOCKED]: '#F44336',
  [TASK_STATUS.COMPLETED]: '#4CAF50',
};

export const STATUS_TRANSLATIONS = {
  EN: {
    [TASK_STATUS.TODO]: 'To Do',
    [TASK_STATUS.IN_PROGRESS]: 'In Progress',
    [TASK_STATUS.BLOCKED]: 'Blocked',
    [TASK_STATUS.COMPLETED]: 'Completed',
  },
  'ZH-TW': {
    [TASK_STATUS.TODO]: '待辦',
    [TASK_STATUS.IN_PROGRESS]: '進行中',
    [TASK_STATUS.BLOCKED]: '已阻塞',
    [TASK_STATUS.COMPLETED]: '已完成',
  },
};
