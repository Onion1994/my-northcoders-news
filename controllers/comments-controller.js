const { deleteCommentById } = require("../models/comments-model")

exports.deleteComment = (req, res, next) => {
    const comment_id = req.params.comment_id
    deleteCommentById(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err)
    })
}