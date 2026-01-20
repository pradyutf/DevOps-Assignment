import { Router } from 'express';
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todo.controller';

/**
 * Todo Routes
 * 
 * RESTful API design following standard conventions:
 * - GET    /api/todos      → List all todos
 * - GET    /api/todos/:id  → Get single todo
 * - POST   /api/todos      → Create new todo
 * - PUT    /api/todos/:id  → Update existing todo
 * - DELETE /api/todos/:id  → Delete todo
 * 
 * VIVA NOTE: REST uses HTTP methods semantically:
 * - GET = Read (safe, idempotent)
 * - POST = Create (not idempotent)
 * - PUT = Update (idempotent)
 * - DELETE = Remove (idempotent)
 */

const router = Router();

router.get('/', getAllTodos);
router.get('/:id', getTodoById);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
