const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Leaders = require('../models/leaders');
const authenticate = require('../authenticate');
const cors = require('./cors');

const leadersRouter = express.Router();

leadersRouter.use(bodyParser.json());

leadersRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.cors, (req, res) => {
    Leaders.find({})
        .then((leaders) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leaders);
        }, (err) => next(err))
        .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Leaders.create(req.body)
        .then((leader) => {
            console.log('leader created', leader);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on leaders'); 
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Leaders.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

leadersRouter.route('/:leaderId')

.get(cors.corsWithOptions, cors.cors, (req, res) => {
    Leaders.findById(req.params.leaderId)
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Post operation not supported on leaders/'+req.params.leaderId); 
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, req.body)
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Leaders.findByIdAndDelete(req.params.leaderId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

module.exports = leadersRouter;