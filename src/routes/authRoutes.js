const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { validateRegister, handleErrors } = require('../middlewares/sanitize');

router.post('/register', validateRegister, handleErrors, register);
router.post('/login', login);

module.exports = router;