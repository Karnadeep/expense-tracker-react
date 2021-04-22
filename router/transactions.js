const express = require('express');
const router = express.Router();
const{getTranscations, addTranscation,deleteTransactions} = require('../controllers/transactions');

router
.route('/')
.get(getTranscations)
.post(addTranscation);

router
.route('/:id')
.delete(deleteTransactions);

module.exports = router;