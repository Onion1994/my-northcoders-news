const express = require('express')
const apiRouter = require('./routes/api-router')
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./errors')
const articlesRouter = require('./routes/articles-router')
const topicsRouter = require('./routes/topics-router')
const commentsRouter = require('./routes/comments-router')
const usersRouter = require('./routes/users-router')
const { getEndpoints } = require('./controllers/endpoints-controller')
const cors = require('cors')

const app = express();

app.use(cors());

app.use(express.json())

app.get('/api', getEndpoints)

app.use('/api', apiRouter)

app.use('/api/articles', articlesRouter);

app.use('/api/topics', topicsRouter);

app.use('/api/comments', commentsRouter);

app.use('/api/users', usersRouter);

app.use(handlePsqlErrors)
app.use(handleCustomErrors)
app.use(handleServerErrors)

module.exports = app
