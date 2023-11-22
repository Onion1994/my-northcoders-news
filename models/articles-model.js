const db = require('../db/connection')

exports.selectArticleById = (id) => {
    return db.query(`SELECT * FROM articles WHERE articles.article_id = $1`, [id]).then((data) => {
        if (!data.rows.length) {
            return Promise.reject({ status: 404, msg: 'Not Found'})
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

exports.selectArticlesComments = (id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`, [id]).then((data) => {
            return data.rows
        })
}

exports.addCommentByArticleId = (body, author, article_id) => {
    return db.query(`INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`, [body, author, article_id]).then((data) => {
        return data.rows
    })
}

exports.updateArticlesVotes = (inc_votes, article_id) => {
    if (inc_votes > 0) {
      return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [inc_votes, article_id]).then((data) => {
        if (!data.rows.length) {
            return Promise.reject({ status: 404, msg: 'Not Found'})
        } else {
            return data.rows
        }
    })
    }
    else if (inc_votes < 0) {
        const positive_inc_votes = -inc_votes
      return db.query(`UPDATE articles SET votes = votes - $1 WHERE article_id = $2 RETURNING *`, [positive_inc_votes, article_id]).then((data) => {
        if (!data.rows.length) {
            return Promise.reject({ status: 404, msg: 'Not Found'})
        } else {
            return data.rows
        }
    })
    }
    else {
        return Promise.reject({ status: 400, msg: 'Bad Request'})
    }
  }