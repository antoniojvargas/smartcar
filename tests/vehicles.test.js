import axios from 'axios';
import sinon from 'sinon';
import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';

describe('GET /vehicles/:id', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return vehicle info in Smartcar format', async () => {
    sinon.stub(axios, 'post').resolves({
      data: {
        status: '200',
        data: {
          vin: { value: '123123412412' },
          color: { value: 'Metallic Silver' },
          fourDoorSedan: { value: 'True' },
          twoDoorCoupe: { value: 'False' },
          driveTrain: { value: 'v8' },
        },
      },
    });

    const res = await request(app).get('/vehicles/1234');

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({
      vin: '123123412412',
      color: 'Metallic Silver',
      doorCount: 4,
      driveTrain: 'v8',
    });
  });

  it('should return 502 if MM API status is not 200', async () => {
    sinon.stub(axios, 'post').resolves({
      data: {
        status: '500', // simulate MM API failure
      },
    });

    const res = await request(app).get('/vehicles/1234');

    expect(res.status).to.equal(502);
    expect(res.body).to.deep.equal({ error: 'MM API error' });
  });

  it('should return 500 if critical data is missing', async () => {
    sinon.stub(axios, 'post').resolves({
      data: {
        status: '200',
        data: {
          // Missing driveTrain, door count, etc.
          vin: { value: '123123412412' },
          color: { value: 'Metallic Silver' },
        },
      },
    });

    const res = await request(app).get('/vehicles/1234');

    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: 'Incomplete data from MM API' });
  });
});

describe('GET /vehicles/:id/doors', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return door status in Smartcar format', async () => {
    sinon.stub(axios, 'post').resolves({
      data: {
        status: '200',
        data: {
          doors: {
            type: 'Array',
            values: [
              {
                location: { type: 'String', value: 'frontLeft' },
                locked: { type: 'Boolean', value: 'False' },
              },
              {
                location: { type: 'String', value: 'frontRight' },
                locked: { type: 'Boolean', value: 'True' },
              },
              {
                location: { type: 'String', value: 'backLeft' },
                locked: { type: 'Boolean', value: 'False' },
              },
              {
                location: { type: 'String', value: 'backRight' },
                locked: { type: 'Boolean', value: 'True' },
              },
            ],
          },
        },
      },
    });

    const res = await request(app).get('/vehicles/1234/doors');

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal([
      { location: 'frontLeft', locked: false },
      { location: 'frontRight', locked: true },
      { location: 'backLeft', locked: false },
      { location: 'backRight', locked: true },
    ]);
  });

  it('should return 502 if MM API status is not 200', async () => {
    sinon.stub(axios, 'post').resolves({
      data: {
        status: '500', // simulate API failure
      },
    });

    const res = await request(app).get('/vehicles/1234/doors');

    expect(res.status).to.equal(502);
    expect(res.body).to.deep.equal({ error: 'MM API error' });
  });

  it('should return 500 if doors.values is missing', async () => {
    sinon.stub(axios, 'post').resolves({
      data: {
        status: '200',
        data: {
          doors: {
            type: 'Array',
            values: null, // invalid format
          },
        },
      },
    });

    const res = await request(app).get('/vehicles/1234/doors');

    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({ error: 'Invalid data format from MM API' });
  });
});

describe('GET /vehicles/:id/fuel', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return fuel level percent when MM API responds correctly', async () => {
    sinon.stub(axios, 'post').resolves({
      data: {
        status: '200',
        data: {
          tankLevel: { type: 'Number', value: '76.5' },
        },
      },
    });

    const res = await request(app).get('/vehicles/1234/fuel');

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ percent: 76.5 });
  });

  it('should return 502 if MM API status is not 200', async () => {
    sinon.stub(axios, 'post').resolves({
      data: {
        status: '500',
      },
    });

    const res = await request(app).get('/vehicles/1234/fuel');

    expect(res.status).to.equal(502);
    expect(res.body).to.deep.equal({ error: 'MM API error' });
  });

  it('should return { percent: null } if batteryLevel is missing', async () => {
    sinon.stub(axios, 'post').resolves({
      data: {
        status: '200',
        data: {},
      },
    });

    const res = await request(app).get('/vehicles/1234/fuel');

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ percent: null });
  });
});

describe('GET /vehicles/:id/battery', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return battery percent when MM API responds correctly', async () => {
    sinon.stub(axios, 'post').resolves({
      data: {
        status: '200',
        data: {
          batteryLevel: { type: 'Number', value: '88.7' },
        },
      },
    });

    const res = await request(app).get('/vehicles/1234/battery');

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ percent: 88.7 });
  });

  it('should return 502 if MM API status is not 200', async () => {
    sinon.stub(axios, 'post').resolves({
      data: {
        status: '500',
      },
    });

    const res = await request(app).get('/vehicles/1234/battery');

    expect(res.status).to.equal(502);
    expect(res.body).to.deep.equal({ error: 'MM API error' });
  });

  it('should return { percent: null } if batteryLevel is missing', async () => {
    sinon.stub(axios, 'post').resolves({
      data: {
        status: '200',
        data: {},
      },
    });

    const res = await request(app).get('/vehicles/1234/battery');

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ percent: null });
  });
});

describe('POST /vehicles/:id/engine', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return success when action=START and MM API executes', async () => {
    sinon.stub(axios, 'post').resolves({
      data: {
        status: '200',
        actionResult: { status: 'EXECUTED' },
      },
    });

    const res = await request(app)
      .post('/vehicles/1234/engine')
      .send({ action: 'START' });

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ status: 'success' });
  });

  it('should return success when action=STOP and MM API executes', async () => {
    sinon.stub(axios, 'post').resolves({
      data: {
        status: '200',
        actionResult: { status: 'EXECUTED' },
      },
    });

    const res = await request(app)
      .post('/vehicles/1234/engine')
      .send({ action: 'STOP' });

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ status: 'success' });
  });

  it('should return 400 if action is invalid', async () => {
    const res = await request(app)
      .post('/vehicles/1234/engine')
      .send({ action: 'INVALID' });

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({
      error: "Invalid action. Must be 'START' or 'STOP'.",
    });
  });

  it('should return 502 if MM API returns null', async () => {
    sinon.stub(axios, 'post').resolves({ data: null });

    const res = await request(app)
      .post('/vehicles/1234/engine')
      .send({ action: 'START' });

    expect(res.status).to.equal(502);
    expect(res.body).to.deep.equal({ error: 'No response from MM API' });
  });

  it('should return 502 if MM API returns non-200 status', async () => {
    sinon.stub(axios, 'post').resolves({
      data: { status: '500' },
    });

    const res = await request(app)
      .post('/vehicles/1234/engine')
      .send({ action: 'START' });

    expect(res.status).to.equal(502);
    expect(res.body).to.deep.equal({ error: 'MM API error: 500' });
  });

  it('should return 500 if MM API response is malformed (no actionResult)', async () => {
    sinon.stub(axios, 'post').resolves({
      data: { status: '200' },
    });

    const res = await request(app)
      .post('/vehicles/1234/engine')
      .send({ action: 'START' });

    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({
      error: 'Malformed response from MM API',
    });
  });

  it('should return error when MM API status=FAILED', async () => {
    sinon.stub(axios, 'post').resolves({
      data: {
        status: '200',
        actionResult: { status: 'FAILED' },
      },
    });

    const res = await request(app)
      .post('/vehicles/1234/engine')
      .send({ action: 'START' });

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ status: 'error' });
  });

  it('should return 500 for unexpected MM API status', async () => {
    sinon.stub(axios, 'post').resolves({
      data: {
        status: '200',
        actionResult: { status: 'UNKNOWN' },
      },
    });

    const res = await request(app)
      .post('/vehicles/1234/engine')
      .send({ action: 'START' });

    expect(res.status).to.equal(500);
    expect(res.body).to.deep.equal({
      error: 'Unexpected status from MM API: UNKNOWN',
    });
  });
});
