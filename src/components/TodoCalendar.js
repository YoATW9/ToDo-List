import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography,
  IconButton,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addDays,
  subDays,
} from 'date-fns';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const TodoCalendar = ({ todos, onEditClick }) => {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  // Add days from previous month
  const daysInPreviousMonth = startingDayOfWeek;
  const previousMonthDays = Array.from({ length: daysInPreviousMonth }, (_, i) => {
    return subDays(firstDayOfMonth, daysInPreviousMonth - i);
  });

  // Current month days
  const currentMonthDays = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth
  });

  // Add days from next month to complete the grid
  const remainingDays = (7 - ((daysInPreviousMonth + currentMonthDays.length) % 7)) % 7;
  const nextMonthDays = Array.from({ length: remainingDays }, (_, i) => {
    return addDays(lastDayOfMonth, i + 1);
  });

  const days = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const renderDay = (date) => {
    const dayTodos = todos.filter(todo => 
      todo.dueDate && isSameDay(new Date(todo.dueDate), date)
    );

    const isToday = isSameDay(date, new Date());
    const isCurrentMonth = isSameMonth(date, currentDate);

    return (
      <Box
        sx={{
          p: 1,
          height: '100%',
          minHeight: 40,
          bgcolor: isToday ? 'primary.main' : isCurrentMonth ? 'transparent' : 'action.hover',
          opacity: isCurrentMonth ? 1 : 0.5,
          cursor: dayTodos.length > 0 ? 'pointer' : 'default',
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: isToday ? 'primary.contrastText' : 'text.primary',
          position: 'relative',
          '&:hover': {
            bgcolor: dayTodos.length > 0 ? 'action.hover' : isToday ? 'primary.dark' : 'action.hover',
          },
          ...(dayTodos.length > 0 && {
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 4,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 4,
              height: 4,
              borderRadius: '50%',
              bgcolor: isToday ? 'primary.contrastText' : 'primary.main',
            }
          })
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: isToday ? 'bold' : 'normal',
            color: isToday ? 'primary.contrastText' : isCurrentMonth ? 'text.primary' : 'text.secondary',
            mb: 0.5,
            display: 'inline-block',
            width: '24px',
            height: '24px',
            lineHeight: '24px',
            textAlign: 'center',
            borderRadius: '50%',
            bgcolor: isToday ? 'primary.light' : 'transparent',
          }}
        >
          {format(date, 'd')}
        </Typography>
        <Box sx={{ width: '100%', maxHeight: 'calc(100% - 24px)', overflow: 'auto' }}>
          {dayTodos.map(todo => (
            <Box
              key={todo.id}
              onClick={() => onEditClick(todo)}
              sx={{
                width: '100%',
                p: 0.5,
                mb: 0.5,
                borderRadius: 1,
                bgcolor: 'background.paper',
                borderLeft: `3px solid ${todo.priority === 'high' ? 'error.main' :
                        todo.priority === 'medium' ? 'warning.main' : 'success.main'}`,
                color: 'text.primary',
                fontSize: '0.7rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
                maxHeight: '20px',
                lineHeight: '15px',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              {todo.title}
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 2,
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'primary.light',
          borderRadius: 2,
          mb: 2,
          minHeight: 'calc(100vh - 200px)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <IconButton 
            onClick={handlePrevMonth}
            size="small"
            sx={{ color: theme.palette.mode === 'dark' ? 'text.primary' : 'primary.contrastText' }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography 
            variant="subtitle1"
            sx={{ 
              fontWeight: 500,
              color: theme.palette.mode === 'dark' ? 'text.primary' : 'primary.contrastText'
            }}
          >
            {format(currentDate, 'MMMM yyyy')}
          </Typography>
          <IconButton 
            onClick={handleNextMonth}
            size="small"
            sx={{ color: theme.palette.mode === 'dark' ? 'text.primary' : 'primary.contrastText' }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <Grid container spacing={1}>
          {weekDays.map((day) => (
            <Grid item xs={12/7} key={day}>
              <Typography 
                variant="subtitle2" 
                align="center"
                sx={{ 
                  fontWeight: 500,
                  color: 'text.secondary',
                  mb: 1,
                  fontSize: '0.8rem'
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
          {days.map((day, index) => (
            <Grid item xs={12/7} key={index}>
              {renderDay(day)}
            </Grid>
          ))}
        </Grid>
      </Paper>

      {todos.length === 0 && (
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            textAlign: 'center',
            bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'grey.50',
            borderRadius: 2
          }}
        >
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            {t('noTasks')}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
          >
            {t('clickToAddTask')}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TodoCalendar;
