import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

import { useLanguage } from '../contexts/LanguageContext';
import { TASK_STATUS, STATUS_TRANSLATIONS } from '../constants/taskConstants';
import { Storage } from '../utils/storage';

const TodoForm = ({ open, onClose, onAdd, onEdit, editingTodo }) => {
  const { t, language } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [dueTime, setDueTime] = useState(null);
  const [priority, setPriority] = useState('medium');
  const [categories] = useState(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : ['personal', 'work', 'shopping', 'health', 'education'];
  });
  const [category, setCategory] = useState(categories[0] || 'personal');
  const [status, setStatus] = useState(TASK_STATUS.TODO);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title || '');
      setDescription(editingTodo.description || '');
      setDueDate(editingTodo.dueDate ? new Date(editingTodo.dueDate) : null);
      setDueTime(editingTodo.dueDate ? new Date(editingTodo.dueDate) : null);
      setPriority(editingTodo.priority || 'medium');
      setCategory(editingTodo.category || 'personal');
      setStatus(editingTodo.status || TASK_STATUS.TODO);
    } else {
      resetForm();
    }
  }, [editingTodo]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(null);
    setDueTime(null);
    setPriority('medium');
    setCategory(categories[0] || 'personal');
    setStatus(TASK_STATUS.TODO);
    setError('');
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError(t('titleRequired'));
      return;
    }

    let combinedDateTime = null;
    if (dueDate && dueTime) {
      combinedDateTime = new Date(
        dueDate.getFullYear(),
        dueDate.getMonth(),
        dueDate.getDate(),
        dueTime.getHours(),
        dueTime.getMinutes()
      );
    }

    const todoData = {
      title: title.trim(),
      description: description.trim(),
      dueDate: combinedDateTime ? combinedDateTime.toISOString() : null,
      priority,
      category,
      status,
      completed: status === TASK_STATUS.COMPLETED,
      completedAt: status === TASK_STATUS.COMPLETED ? new Date().toISOString() : null,
    };

    if (editingTodo) {
      onEdit(editingTodo.id, todoData);
    } else {
      onAdd({
        ...todoData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      });
    }

    resetForm();
    onClose();
  };



  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper',
        }
      }}
    >
      <DialogTitle>
        {editingTodo ? t('updateTask') : t('addTask')}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label={t('title')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!error}
            helperText={error}
            fullWidth
            autoFocus
          />
          
          <TextField
            label={t('description')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <DatePicker
              label={t('dueDate')}
              value={dueDate}
              onChange={setDueDate}
              sx={{ flex: 1 }}
            />
            <TimePicker
              label={t('dueTime')}
              value={dueTime}
              onChange={setDueTime}
              sx={{ flex: 1 }}
            />
          </Box>

          <FormControl fullWidth>
            <InputLabel>{t('priority')}</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label={t('priority')}
            >
              <MenuItem value="low">{t('low')}</MenuItem>
              <MenuItem value="medium">{t('medium')}</MenuItem>
              <MenuItem value="high">{t('high')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>{t('status')}</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label={t('status')}
            >
              {Object.entries(TASK_STATUS).map(([key, value]) => (
                <MenuItem key={value} value={value}>
                  {STATUS_TRANSLATIONS[language.toUpperCase()][value]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>{t('category')}</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              label={t('category')}
            >
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained">
          {editingTodo ? t('updateTask') : t('addTask')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TodoForm;
