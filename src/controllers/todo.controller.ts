import { Request, Response } from 'express';
import { todoModel } from '../models/todo.model';
import { ApiResponse, Todo, CreateTodoDTO, UpdateTodoDTO } from '../types/todo.types';

/**
 * Todo Controller
 * 
 * Handles HTTP requests and responses for todo operations.
 * Separating controllers from routes follows the MVC pattern.
 * 
 * VIVA NOTE: Each method returns consistent ApiResponse structure.
 * This makes API consumption predictable for frontend/mobile apps.
 */

/**
 * GET /api/todos
 * Retrieve all todos
 */
export const getAllTodos = (_req: Request, res: Response<ApiResponse<Todo[]>>): void => {
  const todos = todoModel.findAll();
  res.json({
    success: true,
    data: todos,
    message: `Found ${todos.length} todo(s)`,
  });
};

/**
 * GET /api/todos/:id
 * Retrieve a single todo by ID
 */
export const getTodoById = (req: Request, res: Response<ApiResponse<Todo>>): void => {
  const { id } = req.params;
  const todo = todoModel.findById(id);

  if (!todo) {
    res.status(404).json({
      success: false,
      error: `Todo with id '${id}' not found`,
    });
    return;
  }

  res.json({
    success: true,
    data: todo,
  });
};

/**
 * POST /api/todos
 * Create a new todo
 */
export const createTodo = (req: Request, res: Response<ApiResponse<Todo>>): void => {
  const dto: CreateTodoDTO = req.body;

  // Validation
  if (!dto.title || dto.title.trim() === '') {
    res.status(400).json({
      success: false,
      error: 'Title is required and cannot be empty',
    });
    return;
  }

  const todo = todoModel.create({
    title: dto.title.trim(),
    description: dto.description?.trim(),
  });

  res.status(201).json({
    success: true,
    data: todo,
    message: 'Todo created successfully',
  });
};

/**
 * PUT /api/todos/:id
 * Update an existing todo
 */
export const updateTodo = (req: Request, res: Response<ApiResponse<Todo>>): void => {
  const { id } = req.params;
  const dto: UpdateTodoDTO = req.body;

  // Check if at least one field is being updated
  if (dto.title === undefined && dto.description === undefined && dto.completed === undefined) {
    res.status(400).json({
      success: false,
      error: 'At least one field (title, description, completed) must be provided',
    });
    return;
  }

  // Validate title if provided
  if (dto.title !== undefined && dto.title.trim() === '') {
    res.status(400).json({
      success: false,
      error: 'Title cannot be empty',
    });
    return;
  }

  const todo = todoModel.update(id, {
    ...(dto.title && { title: dto.title.trim() }),
    ...(dto.description !== undefined && { description: dto.description?.trim() }),
    ...(dto.completed !== undefined && { completed: dto.completed }),
  });

  if (!todo) {
    res.status(404).json({
      success: false,
      error: `Todo with id '${id}' not found`,
    });
    return;
  }

  res.json({
    success: true,
    data: todo,
    message: 'Todo updated successfully',
  });
};

/**
 * DELETE /api/todos/:id
 * Delete a todo
 */
export const deleteTodo = (req: Request, res: Response<ApiResponse<null>>): void => {
  const { id } = req.params;
  const deleted = todoModel.delete(id);

  if (!deleted) {
    res.status(404).json({
      success: false,
      error: `Todo with id '${id}' not found`,
    });
    return;
  }

  res.json({
    success: true,
    message: 'Todo deleted successfully',
  });
};
