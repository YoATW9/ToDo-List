import React from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Grid,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { format } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

const ProfileView = ({ todos, onSettingsClick }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const completedTasks = todos.filter(todo => todo.status === 'completed').length;
  const totalTasks = todos.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Box sx={{ p: 2 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'primary.light',
          color: theme.palette.mode === 'dark' ? 'text.primary' : 'primary.contrastText',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', fontSize: '1.8rem' }}>
            {t('yourProgress')}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'inherit' }}>
            {format(new Date(), 'MMMM dd, yyyy')}
          </Typography>
        </Box>
        <Divider sx={{ my: 2, borderColor: theme.palette.mode === 'dark' ? 'divider' : 'primary.dark' }} />
        <Typography variant="h6" sx={{ mb: 2, fontSize: '1.2rem' }}>
          Task Categories
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {['work', 'personal', 'shopping', 'health', 'education'].map(category => {
            const categoryTasks = todos.filter(todo => todo.category === category).length;
            const percentage = totalTasks > 0 ? (categoryTasks / totalTasks) * 100 : 0;
            
            return (
              <Box key={category} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" sx={{ flex: '0 0 100px', fontSize: '1rem', textTransform: 'capitalize' }}>
                  {t(category)}
                </Typography>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      flex: 1,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: theme.palette.mode === 'dark' ? 'action.hover' : 'primary.dark',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        bgcolor: theme.palette.mode === 'dark' ? 'primary.main' : 'common.white',
                      },
                    }}
                  />
                  <Typography variant="body2" sx={{ minWidth: 45, textAlign: 'right', fontSize: '0.9rem' }}>
                    {Math.round(percentage)}%
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'success.light',
            }}
          >
            <CheckCircleIcon 
              sx={{ 
                fontSize: 40, 
                mb: 1,
                color: theme.palette.mode === 'dark' ? 'success.main' : 'success.dark',
              }} 
            />
            <Typography variant="h6" gutterBottom align="center" sx={{ fontSize: '1.1rem' }}>
              {t('tasksCompleted')}
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                color: theme.palette.mode === 'dark' ? 'success.main' : 'success.dark',
                fontWeight: 'bold',
              }}
            >
              {completedTasks}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper 
            sx={{ 
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'warning.light',
            }}
          >
            <PendingIcon 
              sx={{ 
                fontSize: 40, 
                mb: 1,
                color: theme.palette.mode === 'dark' ? 'warning.main' : 'warning.dark',
              }} 
            />
            <Typography variant="h6" gutterBottom align="center">
              {t('tasksPending')}
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                color: theme.palette.mode === 'dark' ? 'warning.main' : 'warning.dark',
                fontWeight: 'bold',
              }}
            >
              {totalTasks - completedTasks}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileView;
