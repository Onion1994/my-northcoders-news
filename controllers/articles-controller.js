const { selectArticleById, selectAllArticles } = require("../models/articles-model")

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