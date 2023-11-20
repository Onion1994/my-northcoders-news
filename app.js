const express = require('express')
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./errors')
const { getTopics } = require('./controllers/topics-controller')
const { getArticles } = require('./controllers/articles-controller')

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticles)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app

