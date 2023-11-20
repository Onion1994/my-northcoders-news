const db = require('../db/connection')
const fs = require('fs')
const endpoints = require('../endpoints.json')

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`).then((data) => {
        return data.rows
    })
}

exports.getAllEndpoints = () => {
    return endpoints
}