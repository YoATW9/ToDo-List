import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { format } from 'date-fns';

const ProfileView = ({ todos }) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const pendingTodos = todos.filter(todo => !todo.completed);
  
  // Calculate completion rate
  const completionRate = todos.length > 0 
    ? Math.round((completedTodos.length / todos.length) * 100) 
    : 0;

  // Find the most productive day
  const completionsByDate = completedTodos.reduce((acc, todo) => {
    const date = format(new Date(todo.completedAt || todo.createdAt), 'yyyy-MM-dd');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const mostProductiveDay = Object.entries(completionsByDate).reduce((max, [date, count]) => {
    return (!max || count > max.count) ? { date, count } : max;
  }, null);

  const stats = [
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
    },
    {
      label: 'Tasks Completed',
      value: completedTodos.length,
    },
    {
      label: 'Tasks Pending',
      value: pendingTodos.length,
    },
    {
      label: 'Most Productive Day',
      value: mostProductiveDay 
        ? `${format(new Date(mostProductiveDay.date), 'MMM d')} (${mostProductiveDay.count} tasks)`
        : 'No data yet',
    },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
        Your Progress
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {stats.map((stat, index) => (
          <Paper
            key={index}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: index === 0 ? 'primary.main' : 'background.paper',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 1,
                color: index === 0 ? 'white' : 'text.primary',
                fontWeight: 500,
              }}
            >
              {stat.value}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: index === 0 ? 'white' : 'text.secondary',
              }}
            >
              {stat.label}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Activity
        </Typography>
        {[...todos]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(todo => (
            <Paper
              key={todo.id}
              sx={{
                mb: 1,
                p: 2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: todo.completed ? 'success.main' : 'warning.main',
                  mr: 2,
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  {todo.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(todo.createdAt), 'MMM d, h:mm a')}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: todo.completed ? 'success.main' : 'warning.main',
                  fontWeight: 500,
                }}
              >
                {todo.completed ? 'Completed' : 'Pending'}
              </Typography>
            </Paper>
          ))}
      </Box>
    </Box>
  );
};

export default ProfileView;
