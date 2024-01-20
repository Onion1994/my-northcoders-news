const express = require('express');
const { deleteComment, patchComment } = require('../controllers/comments-controller');
const router = express.Router();

router.delete('/:comment_id', deleteComment);

router.patch('/:comment_id', patchComment)

module.exports = router;