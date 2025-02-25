import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  CssBaseline, 
  Box, 
  ToggleButton, 
  ToggleButtonGroup, 
  Fab, 
  Paper, 
  BottomNavigation, 
  BottomNavigationAction,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ToastContainer, toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import 'react-toastify/dist/ReactToastify.css';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import TodoCalendar from './components/TodoCalendar';
import UpcomingView from './components/UpcomingView';
import NotificationsView from './components/NotificationsView';
import ProfileView from './components/ProfileView';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4B8BF4',
    },
    secondary: {
      main: '#FF5252',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    }
  },
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: 'none',
          textTransform: 'none',
          '&.Mui-selected': {
            backgroundColor: '#4B8BF4',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#4B8BF4',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
  },
});

function AppContent() {
  const { t, language, changeLanguage, availableLanguages } = useLanguage();
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [view, setView] = useState('monthly');
  const [formOpen, setFormOpen] = useState(false);
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

  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value);
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
    if (todos.length === 0) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '50vh',
          color: 'text.secondary'
        }}>
          {t('noTasks')}
        </Box>
      );
    }

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
        return <ProfileView todos={todos} />;
      default:
        return null;
    }
  };

  const shouldShowViewToggle = bottomNav === 0;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={language}
            onChange={handleLanguageChange}
            sx={{ borderRadius: 2 }}
          >
            {availableLanguages.map(lang => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
        {shouldShowViewToggle && (
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              aria-label="view"
              sx={{
                bgcolor: '#F5F5F5',
                p: 0.5,
                borderRadius: 30,
                '& .MuiToggleButton-root': {
                  px: 3,
                  py: 0.5,
                },
              }}
            >
              <ToggleButton value="monthly">{t('monthly')}</ToggleButton>
              <ToggleButton value="daily">{t('daily')}</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}

        {renderCurrentView()}

        <Fab 
          color="primary" 
          aria-label={t('addTask')}
          onClick={() => {
            setEditingTodo(null);
            setFormOpen(true);
          }}
          sx={{
            position: 'fixed',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 56,
            height: 56,
          }}
        >
          <AddIcon />
        </Fab>
      </Box>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          value={bottomNav}
          onChange={(event, newValue) => {
            setBottomNav(newValue);
          }}
          showLabels
        >
          <BottomNavigationAction label={t('daily')} icon={<ListAltIcon />} />
          <BottomNavigationAction label={t('upcomingTasks')} icon={<AccessTimeIcon />} />
          <BottomNavigationAction 
            label={t('notifications')}
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
          <BottomNavigationAction label={t('yourProgress')} icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>

      <TodoForm 
        open={formOpen} 
        onClose={() => setFormOpen(false)} 
        onAdd={addTodo}
        onEdit={editTodo}
        editingTodo={editingTodo}
      />
      <ToastContainer position="bottom-right" />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
