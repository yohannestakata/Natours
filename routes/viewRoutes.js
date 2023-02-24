const express = require('express');
const viewsController = require('../controller/viewsController');

const router = new express.Router();

router.get('/', viewsController.getOverview);
router.get('/tours', viewsController.getTour);
router.get('/tour/:slug', viewsController.getTour);

module.exports = router;
