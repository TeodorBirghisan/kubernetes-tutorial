import axios from "axios";
import { Todo } from "../models/Todo";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getTodos = () => api.get<Todo[]>('/TodoItems');
export const addTodo = (todo: Omit<Todo, 'id'>) => api.post<Todo>('/TodoItems', todo);
export const updateTodo = (id: number, todo: Partial<Todo>) => api.put<Todo>(`/TodoItems/${id}`, todo);
export const deleteTodo = (id: number) => api.delete(`/TodoItems/${id}`);
