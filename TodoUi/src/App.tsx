import React from 'react';
import TodoList from './components/TodoList';
import { CssBaseline, Container } from '@mui/material';
import './App.css';

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Container className="container">
        <TodoList />
      </Container>
    </>
  );
};

export default App;
