'use strict';

class DataCollection {

  constructor(model) {
    this.model = model;
  }

  get(id) {
    if (id) {
      return this.model.findOne({ where: { id } });
    } else {
      return this.model.findAll({});
    }
  }
  create(player) {
    return this.model.create(player);
  } 
  update(id, data) {
    return this.model.findOne({ where: { id } })
      .then(player => player.update(data));
  }
  delete(id) {
    return this.model.destroy( { where: { id } });
  }
}

module.exports = DataCollection;