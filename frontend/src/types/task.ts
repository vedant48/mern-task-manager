export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
}

export interface UpdateTaskInput {
  title?: string;
  completed?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}
