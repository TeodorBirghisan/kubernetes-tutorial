import axios from 'axios';
import { Todo } from '../models/Todo';
import API_ENDPOINTS from '../constants/api.config';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getTodos = () => api.get<Todo[]>(API_ENDPOINTS.TODOS.GET_ALL);
export const addTodo = (todo: Omit<Todo, 'id'>) => api.post<Todo>(API_ENDPOINTS.TODOS.CREATE, todo);
export const updateTodo = (id: number, todo: Partial<Todo>) => api.put<Todo>(API_ENDPOINTS.TODOS.UPDATE(id), todo);
export const deleteTodo = (id: number) => api.delete(API_ENDPOINTS.TODOS.DELETE(id));
