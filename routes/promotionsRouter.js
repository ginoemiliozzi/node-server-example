const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promotions = require('../models/promotions');
const authenticate = require('../authenticate');


const promosRouter = express.Router();

promosRouter.use(bodyParser.json());

promosRouter.route('/')

.get((req, res) => {
    Promotions.find({})
        .then((promotions) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotions);
        }, (err) => next(err))
        .catch((err) => next(err));
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.create(req.body)
        .then((promo) => {
            console.log('promo created', promo);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => next(err))
        .catch((err) => next(err));
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported on promotions'); 
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    Promotions.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

promosRouter.route('/:promoId')

.get((req, res) => {
    Promotions.findById(req.params.promoId)
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => next(err))
        .catch((err) => next(err));
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('Post operation not supported on promotions/'+req.params.promoId); 
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, req.body)
        .then((promo) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }, (err) => next(err))
        .catch((err) => next(err));
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    Promotions.findByIdAndDelete(req.params.promoId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

module.exports = promosRouter;