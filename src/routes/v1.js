'use strict';

const express = require('express');
const dataModules = require('../auth/models/index');
const router = express.Router();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Model Invalid');
  }
});

router.get('/:model', handleGetAll);
router.get('/:model/:id', handleGetOne);
router.post('/:model', handleCreate);
router.put('/:model/:id', handleUpdate);
router.delete('/:model/:id', handleDelete);

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
  let newRecord = await req.model.create(obj);
  console.log(newRecord);
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
