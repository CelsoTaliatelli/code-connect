import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/database/prisma.service.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    await app.get(PrismaService).user.deleteMany();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('registers, logs in and returns the authenticated user', async () => {
    const credentials = {
      name: 'Ada Lovelace',
      email: ' ADA@EXAMPLE.COM ',
      password: 'correct-horse',
    };

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(credentials)
      .expect(201);

    expect(registerResponse.body).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
    });
    expect(registerResponse.body).not.toHaveProperty('password');
    expect(registerResponse.body).not.toHaveProperty('passwordHash');

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(200);

    expect(loginResponse.body).toMatchObject({ tokenType: 'Bearer' });
    expect(loginResponse.body.accessToken).toEqual(expect.any(String));

    const meResponse = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .expect(200);

    expect(meResponse.body).toEqual(registerResponse.body);
    expect(meResponse.body).not.toHaveProperty('passwordHash');
  });

  it('rejects invalid registration data and duplicate emails', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'Ada', email: 'not-an-email', password: 'short' })
      .expect(400);

    const credentials = {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'correct-horse',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(credentials)
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ ...credentials, email: ' ADA@example.com ' })
      .expect(409);
  });

  it('rejects invalid credentials and protected requests without a valid token', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'missing@example.com', password: 'correct-horse' })
      .expect(401);

    await request(app.getHttpServer())
      .get('/auth/me')
      .expect(401);

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });

  it('serves public posts and protects post mutations', async () => {
    const credentials = {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'correct-horse',
    };
    await request(app.getHttpServer()).post('/auth/register').send(credentials).expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: credentials.email, password: credentials.password })
      .expect(200);
    const token = loginResponse.body.accessToken as string;

    await request(app.getHttpServer())
      .post('/posts')
      .send({ title: 'Full-text no PostgreSQL', content: 'Busque este conteúdo no feed.', thumbnail: 'not-a-url' })
      .expect(401);

    const createResponse = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Full-text no PostgreSQL', content: 'Busque este conteúdo no feed.' })
      .expect(201);
    const postId = createResponse.body.id as string;

    const feedResponse = await request(app.getHttpServer()).get('/posts').expect(200);
    expect(feedResponse.body.items).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: postId, likedByMe: false }),
    ]));

    await request(app.getHttpServer())
      .get('/posts?search=PostgreSQL')
      .expect(200)
      .expect((response) => expect(response.body.items[0].id).toBe(postId));

    await request(app.getHttpServer()).post(`/posts/${postId}/likes`).expect(401);
    await request(app.getHttpServer()).post(`/posts/${postId}/likes`).set('Authorization', `Bearer ${token}`).expect(201);
    await request(app.getHttpServer()).post(`/posts/${postId}/likes`).set('Authorization', `Bearer ${token}`).expect(409);
    await request(app.getHttpServer()).post(`/posts/${postId}/comments`).set('Authorization', `Bearer ${token}`).send({ content: 'Excelente post.' }).expect(201);
  });

  afterEach(async () => {
    await app.close();
  });
});
