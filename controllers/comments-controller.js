const {
  deleteCommentById,
  updateCommentsVotes,
} = require("../models/comments-model");

exports.deleteComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const inc_votes = req.body.inc_votes;
  const comment_id = req.params.comment_id;
  updateCommentsVotes(inc_votes, comment_id)
    .then((commentArray) => {
      const comment = commentArray[0];
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
