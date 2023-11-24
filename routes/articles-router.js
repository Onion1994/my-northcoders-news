const express = require('express');
const router = express.Router();
const {
  getArticles,
  getComments,
  postComment,
  patchArticle,
} = require('../controllers/articles-controller');

router.get('/', getArticles);

router.get('/:article_id', getArticles);

router.get('/:article_id/comments', getComments);

router.post('/:article_id/comments', postComment);

router.patch('/:article_id', patchArticle);

module.exports = router;