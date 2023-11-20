const db = require('../db/connection')
const fs = require('fs')

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`).then((data) => {
        return data.rows
    })
}

exports.getAllEndpoints = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('endpoints.json', 'utf8', function(err, data){
            if (err) reject(err);
            else resolve(JSON.parse(data));
    })})
}