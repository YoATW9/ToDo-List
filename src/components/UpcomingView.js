import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { TASK_STATUS, STATUS_TRANSLATIONS } from '../constants/taskConstants';

const UpcomingView = ({ todos, onDelete, onEditClick }) => {
  const { t, language } = useLanguage();
  const [currentStatus, setCurrentStatus] = useState('all');

  const handleStatusChange = (event, newValue) => {
    setCurrentStatus(newValue);
  };

  const filteredTodos = todos.filter(todo => {
    if (currentStatus === 'all') return true;
    return todo.status === currentStatus;
  }).sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t('tasks')}
      </Typography>

      <Paper elevation={0} sx={{ mb: 2, maxWidth: '100%', overflow: 'hidden' }}>
        <Tabs 
          value={currentStatus} 
          onChange={handleStatusChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
            },
            '& .MuiTabs-scrollButtons': {
              '&.Mui-disabled': {
                opacity: 0.3,
              },
            },
          }}
        >
          <Tab 
            label={t('all')} 
            value="all"
          />
          {Object.values(TASK_STATUS).map((status) => (
            <Tab
              key={status}
              label={STATUS_TRANSLATIONS[language][status]}
              value={status}
            />
          ))}
        </Tabs>
      </Paper>

      {filteredTodos.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
          <Typography>{t('noTasks')}</Typography>
        </Box>
      ) : (
        <List>
          {filteredTodos.map(todo => (
            <ListItem
              key={todo.id}
              sx={{
                mb: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                borderLeft: `4px solid ${getPriorityColor(todo.priority)}.main`,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
              secondaryAction={
                <Box>
                  <IconButton 
                    edge="end" 
                    aria-label="edit"
                    onClick={() => onEditClick(todo)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={() => onDelete(todo.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontWeight: 500 }}>
                      {todo.title}
                    </Typography>
                    <Chip 
                      label={t(todo.priority)} 
                      size="small" 
                      color={getPriorityColor(todo.priority)}
                      sx={{ height: 24 }}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 0.5 }}>
                    {todo.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {todo.description}
                      </Typography>
                    )}
                    {todo.dueDate && (
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(todo.dueDate), 'MMM d, h:mm a')}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default UpcomingView;
