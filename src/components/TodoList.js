import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  Tooltip, 
  List, 
  ListItem, 
  ListItemText,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { 
  Delete, 
  AccessTime, 
  Flag, 
  Edit,
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'error';
    case 'medium': return 'warning';
    case 'low': return 'success';
    default: return 'default';
  }
};

const TodoList = ({ todos, onDelete, onEdit, onEditClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : ['personal', 'work', 'shopping', 'health', 'education'];
  });
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (category) => {
    if (window.confirm(`Are you sure you want to delete the category "${category}"? Tasks in this category will be moved to the first available category.`)) {
      const newCategories = categories.filter(c => c !== category);
      setCategories(newCategories);
      localStorage.setItem('categories', JSON.stringify(newCategories));
      
      // Move tasks to the first available category
      const defaultCategory = newCategories[0] || 'personal';
      todos.forEach(todo => {
        if (todo.category === category) {
          onEdit(todo.id, { ...todo, category: defaultCategory });
        }
      });

      if (filterCategory === category) {
        setFilterCategory('all');
      }
    }
  };

  const handleEditCategory = (oldCategory, newName) => {
    if (newName && !categories.includes(newName)) {
      const newCategories = categories.map(c => c === oldCategory ? newName : c);
      setCategories(newCategories);
      localStorage.setItem('categories', JSON.stringify(newCategories));
      // Update all todos with the old category
      todos.forEach(todo => {
        if (todo.category === oldCategory) {
          onEdit(todo.id, { ...todo, category: newName });
        }
      });
    }
    setEditingCategory(null);
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = 
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || todo.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedTodos = [...filteredTodos].sort((a, b) => {
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

  const uniqueCategories = ['all', ...new Set(todos.map(todo => todo.category))];

  return (
    <Box sx={{ p: 2 }}>
      <Dialog
        open={editingCategory !== null}
        onClose={() => setEditingCategory(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {editingCategory === 'new' ? 'Add Category' : 'Edit Category'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (editingCategory === 'new') {
                  handleAddCategory();
                } else {
                  handleEditCategory(editingCategory, newCategory);
                }
              }
            }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingCategory(null)}>Cancel</Button>
          <Button
            onClick={() => {
              if (editingCategory === 'new') {
                handleAddCategory();
              } else {
                handleEditCategory(editingCategory, newCategory);
              }
            }}
            variant="contained"
            disabled={!newCategory.trim()}
          >
            {editingCategory === 'new' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span>{category}</span>
                  {filterCategory !== category && (
                    <Box>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCategory(category);
                          setNewCategory(category);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </MenuItem>
            ))}
            <MenuItem>
              <Button
                fullWidth
                startIcon={<AddIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingCategory('new');
                  setNewCategory('');
                }}
              >
                Add Category
              </Button>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredTodos.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            textAlign: 'center',
            bgcolor: 'background.default',
            borderRadius: 2,
          }}
        >
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            No tasks yet
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
          >
            Click the + button to add one!
          </Typography>
        </Paper>
      ) : (
        <List>
          {sortedTodos.map(todo => (
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
                primary={todo.title}
                secondary={todo.description}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: 500,
                  },
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default TodoList;
