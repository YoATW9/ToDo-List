import React from 'react';
import { Box, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import { Delete, AccessTime, Flag, Edit } from '@mui/icons-material';
import { format } from 'date-fns';

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

const TodoList = ({ todos, onDelete, onEdit, onEditClick }) => {
  const sortedTodos = [...todos].sort((a, b) => {
    // First sort by completion
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    // Finally by due date
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  return (
    <Box>
      {sortedTodos.map(todo => (
        <Paper
          key={todo.id}
          sx={{
            mb: 1,
            opacity: todo.completed ? 0.7 : 1,
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
                borderColor: todo.completed ? priorityColors[todo.priority] : '#E0E0E0',
                backgroundColor: todo.completed ? priorityColors[todo.priority] : 'transparent',
                mr: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => onEdit(todo.id, { completed: !todo.completed })}
            />
            
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography
                  sx={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? 'text.secondary' : 'text.primary',
                  }}
                >
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

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {todo.dueDate && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(todo.dueDate), 'MMM d, h:mm a')}
                    </Typography>
                  </Box>
                )}
                
                <Tooltip title={`Priority: ${todo.priority}`}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Flag sx={{ 
                      fontSize: 16, 
                      mr: 0.5,
                      color: priorityColors[todo.priority]
                    }} />
                    <Typography 
                      variant="caption" 
                      sx={{ color: priorityColors[todo.priority] }}
                    >
                      {todo.priority}
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>
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

      {todos.length === 0 && (
        <Typography 
          color="text.secondary" 
          sx={{ 
            textAlign: 'center', 
            mt: 4,
            fontSize: '1.1rem'
          }}
        >
          No tasks yet. Click the + button to add one!
        </Typography>
      )}
    </Box>
  );
};

export default TodoList;
