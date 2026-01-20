import request from 'supertest';
import app from '../app';
import { todoModel } from '../models/todo.model';

/**
 * Todo API Tests
 * 
 * Simple tests covering basic CRUD operations.
 * These validate that our API works correctly.
 * 
 * WHY THESE TESTS?
 * - Prevents regressions (breaking changes)
 * - CI pipeline fails if tests fail
 * - Ensures code quality before deployment
 */

describe('Todo API', () => {
  // Clear data before each test
  beforeEach(() => {
    todoModel.clear();
  });

  // CREATE
  it('should create a new todo', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({ title: 'Learn CI/CD' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('Learn CI/CD');
  });

  // READ ALL
  it('should get all todos', async () => {
    // Create a todo first
    await request(app)
      .post('/api/todos')
      .send({ title: 'Test Todo' });

    const response = await request(app).get('/api/todos');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
  });

  // READ ONE
  it('should get a todo by id', async () => {
    // Create a todo first
    const createRes = await request(app)
      .post('/api/todos')
      .send({ title: 'Find Me' });

    const todoId = createRes.body.data.id;

    const response = await request(app).get(`/api/todos/${todoId}`);

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe('Find Me');
  });

  // UPDATE
  it('should update a todo', async () => {
    // Create a todo first
    const createRes = await request(app)
      .post('/api/todos')
      .send({ title: 'Original' });

    const todoId = createRes.body.data.id;

    const response = await request(app)
      .put(`/api/todos/${todoId}`)
      .send({ title: 'Updated', completed: true });

    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe('Updated');
    expect(response.body.data.completed).toBe(true);
  });

  // DELETE
  it('should delete a todo', async () => {
    // Create a todo first
    const createRes = await request(app)
      .post('/api/todos')
      .send({ title: 'Delete Me' });

    const todoId = createRes.body.data.id;

    const response = await request(app).delete(`/api/todos/${todoId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // ERROR CASE - validates input handling
  it('should return 404 for non-existent todo', async () => {
    const response = await request(app).get('/api/todos/fake-id');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });
});
