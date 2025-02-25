import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from 'date-fns';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const TodoCalendar = ({ todos }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const getTodosForDate = (date) => {
    return todos.filter(todo => todo.dueDate && isSameDay(new Date(todo.dueDate), date));
  };

  // Calculate the starting position for the first day
  const firstDayOffset = getDay(days[0]) - 1;

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
        {format(currentDate, 'MMMM')}
      </Typography>
      
      <Grid container spacing={1} sx={{ mb: 4 }}>
        {weekDays.map(day => (
          <Grid item xs={12/7} key={day}>
            <Typography 
              align="center" 
              color="text.secondary"
              variant="caption"
              sx={{ fontWeight: 500 }}
            >
              {day}
            </Typography>
          </Grid>
        ))}
        
        {/* Add empty cells for the offset */}
        {Array.from({ length: firstDayOffset }).map((_, index) => (
          <Grid item xs={12/7} key={`empty-${index}`} />
        ))}
        
        {days.map(day => {
          const dayTodos = getTodosForDate(day);
          const hasEvents = dayTodos.length > 0;
          
          return (
            <Grid item xs={12/7} key={day.toString()}>
              <Box
                sx={{
                  position: 'relative',
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  align="center"
                  sx={{
                    color: hasEvents ? 'primary.main' : 'text.primary',
                    fontWeight: hasEvents ? 500 : 400,
                  }}
                >
                  {format(day, 'd')}
                </Typography>
                {hasEvents && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 2,
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                    }}
                  />
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            This month
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Highlight
          </Typography>
        </Box>
        
        {todos
          .filter(todo => todo.dueDate && isSameMonth(new Date(todo.dueDate), currentDate))
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .map(todo => (
            <Box
              key={todo.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
                py: 1,
              }}
            >
              <RadioButtonUncheckedIcon 
                sx={{ 
                  mr: 2, 
                  fontSize: 20,
                  color: todo.completed ? 'success.main' : 'text.disabled'
                }} 
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {todo.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(todo.dueDate), 'do MMM · h:mm a')}
                </Typography>
              </Box>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default TodoCalendar;
