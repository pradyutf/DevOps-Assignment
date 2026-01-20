import { v4 as uuidv4 } from 'uuid';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from '../types/todo.types';

/**
 * In-Memory Todo Storage
 * 
 * WHY IN-MEMORY?
 * - Keeps focus on CI/CD pipeline, not database setup
 * - Stateless design allows horizontal scaling
 * - In production, replace with MongoDB/PostgreSQL
 * 
 * VIVA NOTE: This is intentional simplification.
 * Real apps would use a database with proper persistence.
 */
class TodoModel {
  private todos: Map<string, Todo> = new Map();

  /**
   * Get all todos
   */
  findAll(): Todo[] {
    return Array.from(this.todos.values());
  }

  /**
   * Find a single todo by ID
   */
  findById(id: string): Todo | undefined {
    return this.todos.get(id);
  }

  /**
   * Create a new todo
   */
  create(dto: CreateTodoDTO): Todo {
    const now = new Date();
    const todo: Todo = {
      id: uuidv4(),
      title: dto.title,
      description: dto.description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    this.todos.set(todo.id, todo);
    return todo;
  }

  /**
   * Update an existing todo
   */
  update(id: string, dto: UpdateTodoDTO): Todo | undefined {
    const existing = this.todos.get(id);
    if (!existing) {
      return undefined;
    }

    const updated: Todo = {
      ...existing,
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.completed !== undefined && { completed: dto.completed }),
      updatedAt: new Date(),
    };

    this.todos.set(id, updated);
    return updated;
  }

  /**
   * Delete a todo
   */
  delete(id: string): boolean {
    return this.todos.delete(id);
  }

  /**
   * Clear all todos (useful for testing)
   */
  clear(): void {
    this.todos.clear();
  }
}

// Export singleton instance
export const todoModel = new TodoModel();
