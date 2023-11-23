const express = require('express')
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./errors')
const { getArticles, getComments, postComment, patchArticle } = require('./controllers/articles-controller')
const { getTopics, getEndpoints } = require('./controllers/topics-controller')
const { deleteComment } = require('./controllers/comments-controller')

const app = express()

app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)

app.get('/api/articles/:article_id', getArticles)

app.get('/api', getEndpoints)

app.get('/api/articles/:article_id/comments', getComments)

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', patchArticle)

app.delete('/api/comments/:comment_id', deleteComment)

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app

