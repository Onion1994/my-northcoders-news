const express = require('express');
const { getUsers } = require('../controllers/users-controller');
const router = express.Router();


router.get('/', getUsers);

router.get('/:username', getUsers)

module.exports = router;