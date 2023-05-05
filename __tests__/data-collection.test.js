'use strict';

const DataCollection = require('../src/auth/models/data-collection');

describe('DataCollection', () => {
  let dataCollection;

  beforeEach(() => {
    // create a mock model
    const model = {
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
    };

    // create a new instance of DataCollection with the mock model
    dataCollection = new DataCollection(model);
  });

  describe('get', () => {
    it('should call findOne with id if id is truthy', () => {
      const id = 123;
      dataCollection.get(id);
      expect(dataCollection.model.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should call findAll with empty object if id is falsy', () => {
      dataCollection.get(null);
      expect(dataCollection.model.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('create', () => {
    it('should call create with player data', () => {
      const player = { name: 'John', age: 25 };
      dataCollection.create(player);
      expect(dataCollection.model.create).toHaveBeenCalledWith(player);
    });
  });

  describe('update', () => {
    it('should call findOne with id and update data', () => {
      const id = 123;
      const data = { name: 'John', age: 26 };
      dataCollection.update(id, data);
      expect(dataCollection.model.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(dataCollection.model.update).toHaveBeenCalledWith(data);
    });
  });

  describe('delete', () => {
    it('should call destroy with id', () => {
      const id = 123;
      dataCollection.delete(id);
      expect(dataCollection.model.destroy).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
