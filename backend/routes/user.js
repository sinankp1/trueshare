const express = require('express');
const { register, activateAccout } = require('../controllers/userController');

const router = express.Router();

router.post('/register',register)
router.post('/activate',activateAccout)

module.exports = router