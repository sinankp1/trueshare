const express = require('express');
const { register, activateAccout, login } = require('../controllers/userController');

const router = express.Router();

router.post('/register',register)
router.post('/activate',activateAccout)
router.post('/login',login)

module.exports = router