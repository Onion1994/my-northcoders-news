const db = require('../db/connection')

exports.selectAllUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then((data) => {
        return data.rows
    })
}

exports.selectUserByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((data) => {
        if (!data.rows.length) {
            return Promise.reject({ status: 404, msg: 'Not Found' })
        } else {
        return data.rows[0]
        }
    })
}