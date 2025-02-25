import React from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const NotificationsView = ({ notifications, onDismiss, todos, onEditTodo }) => {
  const sortedNotifications = [...notifications].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleTaskComplete = (todoId) => {
    onEditTodo(todoId, { completed: true });
    // Find and dismiss all notifications for this todo
    notifications
      .filter(n => n.todoId === todoId)
      .forEach(n => onDismiss(n.id));
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 500 }}>
        Notifications
      </Typography>
      {sortedNotifications.length > 0 ? (
        sortedNotifications.map(notification => (
          <Paper
            key={notification.id}
            sx={{
              mb: 1,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              p: 2,
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ mb: 0.5 }}>
                  {notification.message}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
              <IconButton 
                size="small" 
                onClick={() => onDismiss(notification.id)}
                sx={{ ml: 1 }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
            <Box 
              sx={{ 
                borderTop: '1px solid #f0f0f0',
                p: 1.5,
                bgcolor: '#fafafa',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Typography
                variant="button"
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
                onClick={() => handleTaskComplete(notification.todoId)}
              >
                Mark as Complete
              </Typography>
            </Box>
          </Paper>
        ))
      ) : (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          No notifications
        </Typography>
      )}
    </Box>
  );
};

export default NotificationsView;
