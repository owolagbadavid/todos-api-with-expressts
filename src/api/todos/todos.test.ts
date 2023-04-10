import request from 'supertest';

import app from '../../app';
import { Todos } from './todos.model';

beforeAll(async () => {

  try {
    Todos.drop();
    
  } catch (error) {
    
  }
});

describe('GET /api/v1/todos', () => {
  it('responds with an array of Todos', async () => 
    request(app)
      .get('/api/v1/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response)=>{
        expect(response.body).toHaveProperty('length');
        expect(response.body.length).toBe(0);
      }),
  );
});
let id = '';
describe('POST /api/v1/todos', () => {
  it('responds with an errror if Todo is invalid', async () => 
    request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .send({
        content: '',

      })
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response)=>{
        expect(response.body).toHaveProperty('message');
      }),
  );

  it('responds with an inserted document', async () => 
    request(app)
      .post('/api/v1/todos')
      .set('Accept', 'application/json')
      .send({
        content: 'Beat item',
        done: false,
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response)=>{
        expect(response.body).toHaveProperty('content');
        id = response.body._id;
        expect(response.body).toHaveProperty('done');
        expect(response.body.content).toBe('Beat item');
      }),
  );
});

describe('GET /api/v1/todos/:id', () => {
  it('responds with a todo document', async () => 
    request(app)
      .get(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response)=>{
        expect(response.body).toHaveProperty('content');
        expect(response.body).toHaveProperty('done');
        expect(response.body._id).toBe(id);
        expect(response.body.content).toBe('Beat item');
      }),
  );
  
  it('responds with an invalid Object id error', async () => 
    request(app)
      .get('/api/v1/todos/12345')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response)=>{
        expect(response.body).toHaveProperty('message');
        // expect(response.body.message).toBe('Invalid Object id');

      }),
  );
  // 6400539548ea322a02b979f6


  it('responds with a NOT FOUND error', async () => 
    request(app)
      .get('/api/v1/todos/6400539548ea322a02b979f6')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .then((response)=>{
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Could not find todo with id 6400539548ea322a02b979f6');

      }),
  );
  
});

describe('PUT /api/v1/todos/:id', () => {
  it('responds with an invalid Object id error', async () => 
    request(app)
      .put('/api/v1/todos/12345')
      .set('Accept', 'application/json')
      .send({
        content: 'Beat item',
        done: true,
      })
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response)=>{
        expect(response.body).toHaveProperty('message');
        // expect(response.body.message).toBe('Invalid Object id');

      }),
  );
  // 6400539548ea322a02b979f6


  it('responds with a NOT FOUND error', async () => 
    request(app)
      .put('/api/v1/todos/6400539548ea322a02b979f6')
      .set('Accept', 'application/json')
      .send({
        content: 'Beat item',
        done: true,
      })
      .expect('Content-Type', /json/)
      .expect(404)
      .then((response)=>{
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Could not find todo with id 6400539548ea322a02b979f6');

      }),
  );
  
  it('responds with an updated document', async () => 
    request(app)
      .put(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .send({
        content: 'Beat item',
        done: true,
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((response)=>{
        expect(response.body).toHaveProperty('content');
        id = response.body._id;
        expect(response.body).toHaveProperty('done');
        expect(response.body.content).toBe('Beat item');
        expect(response.body.done).toBe(true);
      }),
  );

});

describe('DELETE /api/v1/todos/:id', () => {
  it('responds with an invalid Object id error', async () => 
    request(app)
      .delete('/api/v1/todos/12345')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422)
      .then((response)=>{
        expect(response.body).toHaveProperty('message');
        // expect(response.body.message).toBe('Invalid Object id');

      }),
  );
  // 6400539548ea322a02b979f6


  it('responds with a NOT FOUND error', async () => 
    request(app)
      .delete('/api/v1/todos/6400539548ea322a02b979f6')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .then((response)=>{
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Could not find todo with id 6400539548ea322a02b979f6');

      }),
  );
  
  it('responds with 204 status code', async () => 
    request(app)
      .delete(`/api/v1/todos/${id}`)
      .expect(204)
      .then((response)=>{
        expect(response.statusCode).toBe(204);
      }),
  );

  it('responds with a NOT FOUND error', async () => 
    request(app)
      .get(`/api/v1/todos/${id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .then((response)=>{
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe(`Could not find todo with id ${id}`);

      }),
  );

});