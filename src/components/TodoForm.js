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
  IconButton,
  Chip,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
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
  const [category, setCategory] = useState('personal');
  const [status, setStatus] = useState(TASK_STATUS.TODO);
  const [customCategory, setCustomCategory] = useState('');
  const [customCategories, setCustomCategories] = useState(() => Storage.getCustomCategories());
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
    setCategory('personal');
    setStatus(TASK_STATUS.TODO);
    setCustomCategory('');
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

  const handleAddCustomCategory = () => {
    if (customCategory.trim() && !customCategories.includes(customCategory.trim())) {
      const newCategories = [...customCategories, customCategory.trim()];
      setCustomCategories(newCategories);
      Storage.setCustomCategories(newCategories);
      setCategory(customCategory.trim());
      setCustomCategory('');
    }
  };

  const handleRemoveCustomCategory = (categoryToRemove) => {
    const newCategories = customCategories.filter(cat => cat !== categoryToRemove);
    setCustomCategories(newCategories);
    Storage.setCustomCategories(newCategories);
    if (category === categoryToRemove) {
      setCategory('personal');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && customCategory.trim()) {
      event.preventDefault();
      handleAddCustomCategory();
    }
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
                  {STATUS_TRANSLATIONS[language][value]}
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
              <MenuItem value="personal">{t('personal')}</MenuItem>
              <MenuItem value="work">{t('work')}</MenuItem>
              <MenuItem value="shopping">{t('shopping')}</MenuItem>
              <MenuItem value="health">{t('health')}</MenuItem>
              <MenuItem value="education">{t('education')}</MenuItem>
              {customCategories.map(cat => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              label={t('addCategory')}
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              onKeyPress={handleKeyPress}
              size="small"
              sx={{ flex: 1 }}
            />
            <IconButton 
              onClick={handleAddCustomCategory}
              color="primary"
              disabled={!customCategory.trim()}
            >
              <AddIcon />
            </IconButton>
          </Box>

          {customCategories.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {customCategories.map(cat => (
                <Chip
                  key={cat}
                  label={cat}
                  onDelete={() => handleRemoveCustomCategory(cat)}
                  sx={{ borderRadius: 1 }}
                />
              ))}
            </Box>
          )}
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
