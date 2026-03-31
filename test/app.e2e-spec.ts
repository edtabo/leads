import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from './../src/app.module';

describe('LeadsController', () => {
  let app: INestApplication<App>;
  const uniqueEmail = () => `test${Date.now()}@example.com`;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should get all leads', async () => {
    const response = await request(app.getHttpServer())
      .get('/leads?page=1&limit=10')
      .expect(200);

    expect(response.body.status).toBe('success');
  });

  it('should create a lead', async () => {
    const response = await request(app.getHttpServer())
      .post('/leads')
      .send({
        fullName: 'Test Lead',
        email: uniqueEmail(),
        phone: '1234567890',
        source: 'instagram',
        productOfInterest: 'Product A',
        budget: 1000,
      })
      .expect(201);

    expect(response.body.status).toBe('success');
  });

  it('should update a lead', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/leads')
      .send({
        fullName: 'Lead to Update',
        email: uniqueEmail(),
        phone: '1111111111',
        source: 'facebook',
        productOfInterest: 'Product C',
        budget: 3000,
      })
      .expect(201);

    const leadId = createResponse.body.data?.id;

    await request(app.getHttpServer())
      .patch(`/leads/${leadId}`)
      .send({
        fullName: 'Updated Lead',
        phone: '2222222222',
        source: 'referral',
        productOfInterest: 'Product D',
        budget: 4000,
      })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});