import request from 'supertest';
import app from '../app';
import { expect } from '@jest/globals';

describe('Testes da API', () => {
  it('Deve retornar mensagem "API rodando..." na rota raiz', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'API rodando...');
  });
});
