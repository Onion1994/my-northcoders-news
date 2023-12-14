const db = require('../db/connection')
const { checkExists } = require('../db/seeds/utils')

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT article_id, title, topic, author, body, created_at, votes, article_img_url, 
    (SELECT COUNT(*)
    FROM comments
    WHERE comments.article_id = articles.article_id
    ) AS comment_count FROM articles WHERE article_id = $1`, [article_id]).then((data) => {
        if (!data.rows.length) {
            return Promise.reject({ status: 404, msg: 'Not Found'})
        } else {
            return data.rows[0]
        }
    })
}

exports.selectAllArticles = (sort_by = "created_at", order = "desc", topic) => {
    const verifiedSort_by = ["created_at", "votes", "article_id", "title", "topic", "author", "comment_count"]
    const verifiedOrder = ["asc", "desc"]
    let queryString = `SELECT title, article_id, topic, author, created_at, votes, article_img_url, (
        SELECT COUNT(*) 
        FROM comments 
        WHERE comments.article_id = articles.article_id
    ) AS comment_count FROM articles `
    const queries = []
    if (topic) {
        queryString+= `WHERE topic = $1 `
        queries.push(topic)
    }
    if (verifiedSort_by.includes(sort_by) && verifiedOrder.includes(order)) {
        queryString += `ORDER BY ${sort_by} ${order}`
      } else {
        return Promise.reject({ status: 400, msg: "Bad Request" })
      }
    return db.query(queryString, queries).then((data) => {
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
      return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [inc_votes, article_id]).then((data) => {
        if (!data.rows.length) {
            return Promise.reject({ status: 404, msg: 'Not Found'})
        } else {
            return data.rows
        }
    })
}