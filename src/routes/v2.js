'use strict';

const express = require('express');
const dataModules = require('../auth/models/index');
const router = express.Router();
const bearerAuth = require('../auth/middleware/bearer');
const acl = require('../auth/middleware/acl');

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Model Invalid');
  }
});

router.get('/:model', bearerAuth, handleGetAll);
router.get('/:model/:id', bearerAuth, handleGetOne);
router.post('/model', bearerAuth, acl('create'), handleCreate);
router.put('/:model/:id', bearerAuth, acl('update'), handleUpdate);
router.delete('/:model/:id', bearerAuth, acl('delete'), handleDelete);

async function handleGetAll(req, res) {
  let allRecords = await req.model.get();
  res.status(200).json(allRecords);
}

async function handleGetOne(req, res) {
  const id = req.params.id;
  let oneRecord = await req.model.get(id);
  res.status(200).json(oneRecord);
}

async function handleCreate(req, res) {
  let obj = req.body;
  console.log('Should return an object: ',obj);
  let newRecord = await req.model.create(obj);
  res.status(201).json(newRecord);
}

async function handleUpdate(req, res) {
  const id = req.params.id;
  const obj = req.body;
  let updateRecord = await req.model.update(id, obj);
  res.status(200).json(updateRecord);
}

async function handleDelete(req, res) {
  let id = req.params.id;
  let deleteRecord = await req.model.delete(id);
  res.status(200).json(deleteRecord);
}

module.exports = router;
