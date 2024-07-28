import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { createTodo } from '../controllers/TodoController';

interface TodoFormProps {
  fetchTodos: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ fetchTodos }) => {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await createTodo(name);
      setName('');
      fetchTodos();
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" alignItems="center" mb={2}>
      <TextField
        label="New TODO"
        variant="outlined"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        sx={{ mr: 2 }}
      />
      <Button type="submit" variant="contained" color="primary">
        Add
      </Button>
    </Box>
  );
};

export default TodoForm;
