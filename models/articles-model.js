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

exports.selectAllArticles = () => {
    return db.query(`SELECT title, article_id, topic, created_at, votes, article_img_url, (
        SELECT COUNT(*) 
        FROM comments 
        WHERE comments.article_id = articles.article_id
    ) AS comment_count FROM articles ORDER BY created_at DESC`)
    .then((data) => {
        return data.rows
    })
}