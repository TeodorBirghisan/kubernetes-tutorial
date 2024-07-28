import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { Todo } from '../models/Todo';

interface EditTodoDialogProps {
  open: boolean;
  handleClose: () => void;
  todo: Todo;
  handleSave: (updatedTodo: Todo) => void;
}

const EditTodoDialog: React.FC<EditTodoDialogProps> = ({ open, handleClose, todo, handleSave }) => {
  const [name, setName] = useState(todo.name);

  useEffect(() => {
    setName(todo.name);
  }, [todo]);

  const handleSubmit = () => {
    handleSave({ ...todo, name });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit TODO</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="TODO Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTodoDialog;
