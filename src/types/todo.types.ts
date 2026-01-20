/**
 * Todo Item Interface
 * Defines the structure of a todo item in our application
 */
export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for creating a new todo
 * We don't need id, createdAt, updatedAt - those are generated
 */
export interface CreateTodoDTO {
  title: string;
  description?: string;
}

/**
 * DTO for updating an existing todo
 * All fields are optional - update only what's provided
 */
export interface UpdateTodoDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}

/**
 * Standard API Response structure
 * Consistent response format across all endpoints
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
