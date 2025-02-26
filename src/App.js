import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider as MuiThemeProvider,
  CssBaseline, 
  Box, 
  ToggleButton, 
  ToggleButtonGroup, 
  Fab, 
  Paper, 
  BottomNavigation, 
  BottomNavigationAction,
  IconButton,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import 'react-toastify/dist/ReactToastify.css';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import TodoCalendar from './components/TodoCalendar';
import UpcomingView from './components/UpcomingView';
import NotificationsView from './components/NotificationsView';
import ProfileView from './components/ProfileView';
import SettingsDialog from './components/SettingsDialog';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';

function App() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [view, setView] = useState('monthly');
  const [formOpen, setFormOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bottomNav, setBottomNav] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const addTodo = (todo) => {
    setTodos(prev => [...prev, todo]);
    toast.success(t('taskAdded'));
  };

  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    toast.success(t('taskDeleted'));
  };

  const editTodo = (id, updatedTodo) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updatedTodo } : todo
    ));
    toast.success(t('taskUpdated'));
  };

  const handleEditClick = (todo) => {
    setEditingTodo(todo);
    setFormOpen(true);
  };

  const renderCurrentView = () => {
    switch (bottomNav) {
      case 0:
        return view === 'monthly' ? (
          <TodoCalendar 
            todos={todos} 
            onEditClick={handleEditClick}
          />
        ) : (
          <TodoList 
            todos={todos} 
            onDelete={deleteTodo} 
            onEdit={editTodo}
            onEditClick={handleEditClick}
          />
        );
      case 1:
        return (
          <UpcomingView 
            todos={todos} 
            onDelete={deleteTodo} 
            onEdit={editTodo}
            onEditClick={handleEditClick}
          />
        );
      case 2:
        return (
          <NotificationsView 
            notifications={notifications} 
            onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
            todos={todos}
            onEditTodo={editTodo}
          />
        );
      case 3:
        return <ProfileView todos={todos} onSettingsClick={() => setSettingsOpen(true)} />;
      default:
        return null;
    }
  };

  const shouldShowViewToggle = bottomNav === 0;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, flex: 1, overflow: 'auto', position: 'relative' }}>
        <IconButton
          onClick={() => setSettingsOpen(true)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1000
          }}
        >
          <SettingsIcon />
        </IconButton>
          {shouldShowViewToggle && (
            <Box sx={{ 
              textAlign: 'center', 
              mb: 3,
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: '-ms-autohiding-scrollbar',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}>
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={handleViewChange}
                aria-label="view"
                sx={{
                  display: 'inline-flex',
                  minWidth: 'min-content',
                  bgcolor: 'action.hover',
                  p: 0.5,
                  borderRadius: 30,
                  '& .MuiToggleButton-root': {
                    px: 3,
                    py: 0.5,
                    whiteSpace: 'nowrap',
                  },
                }}
              >
                <ToggleButton value="monthly">{t('monthly')}</ToggleButton>
                <ToggleButton value="daily">{t('daily')}</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}

          {renderCurrentView()}


        </Box>

        <Box sx={{ height: 65 }} />
        <Paper 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1000,
          }} 
          elevation={3}
        >
          <Box sx={{ position: 'relative' }}>
            <Fab 
              color="primary" 
              size="medium"
              aria-label={t('addTask')}
              onClick={() => {
                setEditingTodo(null);
                setFormOpen(true);
              }}
              sx={{
                position: 'absolute',
                top: -20,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1,
              }}
            >
              <AddIcon />
            </Fab>
            <BottomNavigation
              value={bottomNav}
              onChange={(event, newValue) => {
                setBottomNav(newValue);
              }}
              showLabels
              sx={{
                height: 65,
                '& .MuiBottomNavigationAction-root': {
                  minWidth: 'auto',
                  padding: '6px 8px',
                },
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.75rem',
                  '&.Mui-selected': {
                    fontSize: '0.75rem'
                  }
                },
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <BottomNavigationAction label={t('daily')} icon={<ListAltIcon />} />
              <BottomNavigationAction 
                label={t('tasks')} 
                icon={<AccessTimeIcon />}
                sx={{ mr: 4 }} 
              />
              <BottomNavigationAction 
                label={t('notifications')}
                sx={{ ml: 4 }}
                icon={
                <Box sx={{ position: 'relative' }}>
                  <NotificationsIcon />
                  {notifications.length > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'error.main',
                        borderRadius: '50%',
                        width: 16,
                        height: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        color: 'white',
                      }}
                    >
                      {notifications.length}
                    </Box>
                  )}
                </Box>
              }
            />
            <BottomNavigationAction label={t('profile')} icon={<PersonIcon />} />
            </BottomNavigation>
          </Box>
        </Paper>

        <TodoForm 
          open={formOpen} 
          onClose={() => setFormOpen(false)} 
          onAdd={addTodo}
          onEdit={editTodo}
          editingTodo={editingTodo}
        />

        <SettingsDialog
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />

        <ToastContainer 
          position="bottom-right"
          theme={theme.palette.mode}
        />
      </Box>
    </MuiThemeProvider>
  );
}

export default App;
