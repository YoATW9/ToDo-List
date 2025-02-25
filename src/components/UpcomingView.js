import React from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { Delete, Edit } from '@mui/icons-material';

const priorityColors = {
  low: '#4CAF50',
  medium: '#FF9800',
  high: '#F44336'
};

const categoryIcons = {
  personal: '👤',
  work: '💼',
  shopping: '🛒',
  health: '❤️',
  education: '📚'
};

const UpcomingView = ({ todos, onDelete, onEdit, onEditClick }) => {
  const now = new Date();
  const upcoming = todos
    .filter(todo => !todo.completed && todo.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const groupedTodos = {
    today: upcoming.filter(todo => isToday(new Date(todo.dueDate))),
    tomorrow: upcoming.filter(todo => isTomorrow(new Date(todo.dueDate))),
    upcoming: upcoming.filter(todo => {
      const dueDate = new Date(todo.dueDate);
      return dueDate > addDays(now, 2);
    }),
  };

  const renderTodoGroup = (title, todos) => {
    if (todos.length === 0) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {title}
        </Typography>
        {todos.map(todo => (
          <Paper
            key={todo.id}
            sx={{
              mb: 1,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateX(5px)',
              },
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              p: 2,
            }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: priorityColors[todo.priority] || '#E0E0E0',
                  mr: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => onEdit(todo.id, { completed: true })}
              />
              
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography>
                    {todo.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      ml: 1,
                      color: 'text.secondary',
                      fontSize: '1.1rem'
                    }}
                  >
                    {categoryIcons[todo.category] || '📝'}
                  </Typography>
                </Box>

                {todo.description && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {todo.description}
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary">
                  {format(new Date(todo.dueDate), 'h:mm a')}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={() => onEditClick(todo)}
                  sx={{ 
                    color: 'primary.main',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '.MuiPaper-root:hover &': {
                      opacity: 1
                    }
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>

                <IconButton 
                  size="small" 
                  onClick={() => onDelete(todo.id)}
                  sx={{ 
                    color: 'error.main',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    '.MuiPaper-root:hover &': {
                      opacity: 1
                    }
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
        Upcoming Tasks
      </Typography>
      {renderTodoGroup('Today', groupedTodos.today)}
      {renderTodoGroup('Tomorrow', groupedTodos.tomorrow)}
      {renderTodoGroup('Later', groupedTodos.upcoming)}
      {Object.values(groupedTodos).every(group => group.length === 0) && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No upcoming tasks
        </Typography>
      )}
    </Box>
  );
};

export default UpcomingView;
