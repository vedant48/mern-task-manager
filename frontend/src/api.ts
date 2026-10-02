import axios, { AxiosResponse } from 'axios';
import { Task, CreateTaskInput, UpdateTaskInput } from './types/task';

// Dynamically configure baseURL using VITE_API_URL, defaulting to local backend
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const baseURL = rawBaseUrl.endsWith('/api')
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/+$/, '')}/api`;

const API = axios.create({
  baseURL,
});

export const getTasks = (): Promise<AxiosResponse<Task[]>> =>
  API.get<Task[]>('/tasks');

export const addTask = (task: CreateTaskInput): Promise<AxiosResponse<Task>> =>
  API.post<Task>('/tasks', task);

export const updateTask = (
  id: string,
  updates: UpdateTaskInput,
): Promise<AxiosResponse<Task>> => API.put<Task>(`/tasks/${id}`, updates);

export const deleteTask = (
  id: string,
): Promise<AxiosResponse<{ message: string }>> =>
  API.delete<{ message: string }>(`/tasks/${id}`);

export default API;
