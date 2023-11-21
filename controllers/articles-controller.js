const { selectArticleById, selectAllArticles, selectArticlesComments } = require("../models/articles-model")
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
    Promise.all(commentsPromises).then((resolvedPromises) => {
        console.log(resolvedPromises)
        const comments = resolvedPromises[0]
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err)
    })
}