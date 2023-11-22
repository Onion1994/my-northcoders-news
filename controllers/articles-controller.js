const { selectArticleById, selectAllArticles, selectArticlesComments, addCommentByArticleId } = require("../models/articles-model")
const { checkExists } = require("../db/seeds/utils")

exports.getArticles = (req, res, next) => {
    const id = req.params.article_id
    if (id) {
        selectArticleById(id)
            .then((article) => {
                res.status(200).send({ article })
            })
            .catch((err) => {
                next(err)
            });
    } else {
        selectAllArticles()
            .then((articles) => {
                res.status(200).send({ articles })
            })
            .catch((err) => {
                next(err)
            });
    }
};

exports.getComments = (req, res, next) => {
    const id = req.params.article_id
    const commentsPromises = [selectArticlesComments(id), checkExists("articles", "article_id", id)]
    Promise.all(commentsPromises)
    .then((resolvedPromises) => {
        const comments = resolvedPromises[0]
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err)
    })
}

exports.postComment = (req, res, next) => {
    const body = req.body.body
    const author = req.body.username
    const article_id = req.params.article_id
    const commentPromise = addCommentByArticleId(body, author, article_id)
    const articleExistencePromise = checkExists("articles", "article_id", article_id);
    const userExistencePromise = checkExists("users", "username", author)
    const commentsPromises = [commentPromise, articleExistencePromise, userExistencePromise]
    Promise.all(commentsPromises)
    .then((resolvedPromises) => {
        const commentArray = resolvedPromises[0]
        const comment = commentArray[0]
        res.status(201).send({ comment })
    })
    .catch((err) => {
        next(err)
    })
}