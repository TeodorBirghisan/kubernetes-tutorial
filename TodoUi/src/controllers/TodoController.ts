import { Todo } from '../models/Todo';
import * as todoService from '../services/TodoService';

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await todoService.getTodos();
  return response.data;
};

export const createTodo = async (name: string): Promise<Todo> => {
  const response = await todoService.addTodo({ name, isComplete: false });
  return response.data;
};

export const editTodo = async (id: number, updates: Partial<Todo>): Promise<Todo> => {
  const response = await todoService.updateTodo(id, updates);
  return response.data;
};

export const removeTodo = async (id: number): Promise<void> => {
  await todoService.deleteTodo(id);
};
