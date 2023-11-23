const db = require('../db/connection')

exports.deleteCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id]).then((data) => {
        if (!data.rows.length) {
            return Promise.reject({ status: 404, msg: 'Not Found'})
        } else {
        }
    })
}