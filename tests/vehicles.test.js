import { expect } from 'chai';
import sinon from 'sinon';
import { getCarApiProvider } from '../src/providers/index.js';
import * as vehiclesController from '../src/controllers/vehiclesController.js';

describe('vehiclesController', () => {
  let req, res, next, provider;

  beforeEach(() => {
    req = { params: { id: '1234' }, body: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.stub();

    provider = getCarApiProvider(); // <- get the singleton instance
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getVehicle', () => {
    it('should return vehicle info in Smartcar format', async () => {
      const mockData = {
        vin: '123123412412',
        color: 'Metallic Silver',
        doorCount: 4,
        driveTrain: 'v8',
      };

      sinon
        .stub(provider, 'getVehicleInfo')
        .resolves({ status: '200', data: mockData });

      await vehiclesController.getVehicle(req, res, next);

      expect(res.json.calledOnceWith(mockData)).to.be.true;
    });

    it('should call next with NotFoundError if vehicle not found', async () => {
      sinon
        .stub(provider, 'getVehicleInfo')
        .resolves({ status: '404', data: {} });

      await vehiclesController.getVehicle(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].name).to.equal('NotFoundError');
    });

    it('should call next with ExternalApiError on 500', async () => {
      sinon
        .stub(provider, 'getVehicleInfo')
        .resolves({ status: '500', data: {} });

      await vehiclesController.getVehicle(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].name).to.equal('ExternalApiError');
    });

    it('should call next with error if provider throws', async () => {
      const error = new Error('Service failed');
      sinon.stub(provider, 'getVehicleInfo').rejects(error);

      await vehiclesController.getVehicle(req, res, next);

      expect(next.calledOnceWith(error)).to.be.true;
    });
  });

  describe('getDoors', () => {
    it('should return door status in Smartcar format', async () => {
      const mockDoors = [
        { location: 'frontLeft', locked: false },
        { location: 'frontRight', locked: true },
      ];
      sinon
        .stub(provider, 'getSecurityStatus')
        .resolves({ status: '200', data: mockDoors });

      await vehiclesController.getDoors(req, res, next);

      expect(res.json.calledOnceWith(mockDoors)).to.be.true;
    });

    it('should call next with NotFoundError if vehicle not found', async () => {
      sinon
        .stub(provider, 'getSecurityStatus')
        .resolves({ status: '404', data: {} });

      await vehiclesController.getDoors(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].name).to.equal('NotFoundError');
    });

    it('should call next with ExternalApiError on 500', async () => {
      sinon
        .stub(provider, 'getSecurityStatus')
        .resolves({ status: '500', data: {} });

      await vehiclesController.getDoors(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].name).to.equal('ExternalApiError');
    });
  });

  describe('getFuel', () => {
    it('should return fuel level percent', async () => {
      sinon
        .stub(provider, 'getEnergy')
        .resolves({ status: '200', data: { fuel: 76.5, battery: null } });

      await vehiclesController.getFuel(req, res, next);

      expect(res.json.calledOnceWith({ percent: 76.5 })).to.be.true;
    });

    it('should call next with NotFoundError if vehicle not found', async () => {
      sinon.stub(provider, 'getEnergy').resolves({ status: '404', data: {} });

      await vehiclesController.getFuel(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].name).to.equal('NotFoundError');
    });

    it('should call next with ExternalApiError on 500', async () => {
      sinon.stub(provider, 'getEnergy').resolves({ status: '500', data: {} });

      await vehiclesController.getFuel(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].name).to.equal('ExternalApiError');
    });
  });

  describe('getBattery', () => {
    it('should return battery percent', async () => {
      sinon
        .stub(provider, 'getEnergy')
        .resolves({ status: '200', data: { fuel: null, battery: 88.7 } });

      await vehiclesController.getBattery(req, res, next);

      expect(res.json.calledOnceWith({ percent: 88.7 })).to.be.true;
    });

    it('should call next with NotFoundError if vehicle not found', async () => {
      sinon.stub(provider, 'getEnergy').resolves({ status: '404', data: {} });

      await vehiclesController.getBattery(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].name).to.equal('NotFoundError');
    });

    it('should call next with ExternalApiError on 500', async () => {
      sinon.stub(provider, 'getEnergy').resolves({ status: '500', data: {} });

      await vehiclesController.getBattery(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].name).to.equal('ExternalApiError');
    });
  });

  describe('postEngine', () => {
    beforeEach(() => {
      req = { params: { id: '1234' }, body: { action: 'START' } };
    });

    it('should return success when MM API executes', async () => {
      sinon
        .stub(provider, 'actionEngine')
        .resolves({ status: '200', data: { status: 'success' } });

      await vehiclesController.postEngine(req, res, next);

      expect(res.status.calledOnceWith(200)).to.be.true;
      expect(res.json.calledOnceWith({ status: 'success' })).to.be.true;
    });

    it('should return 400 when MM API responds with status=error', async () => {
      sinon
        .stub(provider, 'actionEngine')
        .resolves({ status: '200', data: { status: 'error' } });

      await vehiclesController.postEngine(req, res, next);

      expect(res.status.calledOnceWith(400)).to.be.true;
      expect(
        res.json.calledOnceWithMatch({
          error: 'ValidationError',
          message: 'Invalid action',
        }),
      ).to.be.true;
    });

    it('should call next with NotFoundError when MM API returns 404', async () => {
      sinon
        .stub(provider, 'actionEngine')
        .resolves({ status: '404', data: {} });

      await vehiclesController.postEngine(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].name).to.equal('NotFoundError');
    });

    it('should call next with ExternalApiError when MM API returns 500', async () => {
      sinon
        .stub(provider, 'actionEngine')
        .resolves({ status: '500', data: {} });

      await vehiclesController.postEngine(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].name).to.equal('ExternalApiError');
    });

    it('should call next with ValidationError on invalid action', async () => {
      req.body.action = 'INVALID';

      await vehiclesController.postEngine(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.firstCall.args[0].name).to.equal('ValidationError');
    });
  });
});
