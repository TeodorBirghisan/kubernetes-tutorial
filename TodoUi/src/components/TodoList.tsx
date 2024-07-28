import React, { useState, useEffect } from 'react';
import { Container, Typography, List, Paper, Box } from '@mui/material';
import { Todo } from '../models/Todo';
import { fetchTodos } from '../controllers/TodoController';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    const todos = await fetchTodos();
    setTodos(todos);
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={2} textAlign="center">
        <Typography variant="h4" gutterBottom>
          TODO List
        </Typography>
      </Box>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <TodoForm fetchTodos={getTodos} />
        <List>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} fetchTodos={getTodos} />
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default TodoList;
