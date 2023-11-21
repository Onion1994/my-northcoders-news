const db = require('../db/connection')

exports.selectArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE articles.article_id = $1`, [id]).then((data) => {
        if (!data.rows.length) {
            return Promise.reject({ status: 404, msg: 'ID does not exist'})
        } else {
            return data.rows[0]
        }
    })
}