import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { resolve } from 'path';

import { createApp } from '../app/main';

describe('Logger Interceptor', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createApp();
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('Success send image', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/test')
      .set('Content-Type', 'multipart/form-data')
      .attach('image', resolve(__dirname, '..', 'static', 'small.jpg'));

    expect(response.status).toBe(HttpStatus.CREATED);
  });
  it('Send no formdata - 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/test')
      .send({ test: 'test' });

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe("Isn't formdata.");
  });
  it('Send txt - 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/test')
      .set('Content-Type', 'multipart/form-data')
      .attach('image', resolve(__dirname, '..', 'static', 'other.txt'));

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe('Not expected mimetype');
  });
  it('Send big - 413', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/test')
      .set('Content-Type', 'multipart/form-data')
      .attach('image', resolve(__dirname, '..', 'static', 'big.jpg'));

    expect(response.status).toBe(HttpStatus.PAYLOAD_TOO_LARGE);
  });
  it('Send other field - 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/test')
      .set('Content-Type', 'multipart/form-data')
      .attach('images', resolve(__dirname, '..', 'static', 'other.txt'));

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toBe('Not expected file field');
  });

  afterEach(async () => {
    await app.close();
  });
});
