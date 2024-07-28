import React, { useState } from 'react';
import { ListItem, ListItemText, Checkbox, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Todo } from '../models/Todo';
import { editTodo, removeTodo } from '../controllers/TodoController';
import EditTodoDialog from './EditTodoDialog';

interface TodoItemProps {
  todo: Todo;
  fetchTodos: () => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, fetchTodos }) => {
  const [editOpen, setEditOpen] = useState(false);

  const handleToggle = async () => {
    await editTodo(todo.id, { isComplete: !todo.isComplete });
    fetchTodos();
  };

  const handleDelete = async () => {
    await removeTodo(todo.id);
    fetchTodos();
  };

  const handleSave = async (updatedTodo: Todo) => {
    await editTodo(todo.id, updatedTodo);
    fetchTodos();
  };

  return (
    <>
      <ListItem>
        <Checkbox checked={todo.isComplete} onChange={handleToggle} />
        <ListItemText primary={todo.name} />
        <Box display="flex" alignItems="center">
          <IconButton edge="end" aria-label="edit" onClick={() => setEditOpen(true)}>
            <EditIcon />
          </IconButton>
          <IconButton edge="end" aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </ListItem>
      <EditTodoDialog
        open={editOpen}
        handleClose={() => setEditOpen(false)}
        todo={todo}
        handleSave={handleSave}
      />
    </>
  );
};

export default TodoItem;
