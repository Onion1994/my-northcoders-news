const db = require('../db/connection')
const app = require('../app')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const request = require('supertest')
const { string } = require('pg-format')

beforeEach(() => seed(data))

afterAll(() => {
  db.end()
})

describe('GET /api/topics', () => {
    test ('200: returns an array of topic objects, each of which having a slug property and a description property', () => {
        return request(app).get('/api/topics').expect(200).then(({ body }) => {
            const { topics } = body
            expect(topics).toHaveLength(3);
            topics.forEach((topic) => {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    })
    test('404: returns an error for an invalid endpoint', () => {
        return request(app).get('/api/invalid-endpoint').expect(404)
    })
})


describe('GET /api/articles/:article_id', () => {
    test('200: returns an article object by its ID', () => {
        return request(app).get('/api/articles/1').expect(200).then(({ body }) => {
            const { article } = body
            console.log(article)
            expect(article.article_id).toBe(1)
            expect(article).toMatchObject({
                title: expect.any(String),
                topic: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            })
        })
    })
    test('404: returns error when user inputs non-existent ID', () => {
        return request(app).get('/api/articles/999').expect(404).then(({ body }) => {
            const { msg } = body
            expect(msg).toBe('ID does not exist')
        })
    })
    test('400: returns error when user inputs invalid ID', () => {
        return request(app).get('/api/articles/one').expect(400).then(({ body }) => {
            const { msg } = body
            expect(msg).toBe('Bad Request')
        })
    })
})

describe('GET /api', () => {
    test('200: returns an object describing all the available endpoints', () => {
        return request(app).get('/api').expect(200).then(({ body }) => {
            const { endpoints } = body
            Object.values(endpoints).forEach((endpoint) => {
                expect(endpoint).toMatchObject({
                    description: expect.any(String),
                    queries: expect.any(Array),
                    exampleResponse: expect.any(Object)
                })})
        }) 
    })
})

describe('GET /api/articles', () => {
    test('200: returns an articles array of article objects', () => {
        return request(app).get('/api/articles').expect(200).then(({ body }) => {
            const { articles } = body
            expect(articles).toHaveLength(13)
            articles.forEach((article) => {
                expect(article).toMatchObject({
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String)
                })
            })
        })
    })
    test('200: the articles should be sorted by date in descending order', () => {
        return request(app).get('/api/articles').expect(200).then(({ body }) => {
            const { articles } = body
            expect(articles).toBeSortedBy("created_at", { descending: true })
        })
    })
    test('there should not be a body property present on any of the article objects.', () => {
        return request(app).get('/api/articles').expect(200).then(({ body }) => {
            const { articles } = body
            articles.forEach((article) => {
                expect(article).not.toHaveProperty('body')
            })
        })
    })
    test('200: should return a property of comment_count, which is the total count of all the comments for each article_id', () => {
        return request(app).get('/api/articles').expect(200).then(({ body }) => {
            const { articles } = body
            expect(articles[0].comment_count).toBe("2")
        })
    })
})

describe('GET /api/articles/:article_id/comments', () =>{
    test('200: returns an array of comment objects for the given article_id', () => {
        return request(app).get('/api/articles/1/comments').expect(200).then(({ body }) => {
            const { comments } = body
            expect(comments).toHaveLength(11)
            comments.forEach((comment) => {
                expect(comment.article_id).toBe(1)
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                })
            })
        })
    })
    test('200: comments should be served with the most recent comments first', () => {
        return request(app).get('/api/articles/1/comments').expect(200).then(({ body }) => {
            const { comments } = body
            expect(comments).toBeSortedBy("created_at", { descending: true })
        })
    })
    test('404: returns error when user inputs non-existent ID', () => {
        return request(app).get('/api/articles/999/comments').expect(404).then(({ body }) => {
            const { msg } = body
            expect(msg).toBe('Not Found')
        })
    })
    test('400: returns error when user inputs invalid ID', () => {
        return request(app).get('/api/articles/one/comments').expect(400).then(({ body }) => {
            const { msg } = body
            expect(msg).toBe('Bad Request')
        })
    })
    test('200: returns an empty array if the article has no comments', () => {
        return request(app).get('/api/articles/7/comments').expect(200).then(({ body }) => {
            const { comments } = body
            expect(comments).toEqual([])
        })
    }) 
})

describe('POST /api/articles/:article_id/comments', () => {
    test('201: user can post new comments under specific articles', () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'this comment got posted'
        }
        return request(app).post('/api/articles/3/comments').send(newComment).expect(201).then(({ body }) => {
            const { comment } = body
            expect(comment).toMatchObject({
                comment_id: 19,
                author: 'butter_bridge',
                body: 'this comment got posted',
                votes: 0,
                article_id: 3,
                created_at: expect.any(String)
            })
        })
    })
    test('404: returns error when user inputs non-existent ID', () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'this comment did not get posted'
        }
        return request(app).post('/api/articles/999/comments').send(newComment).expect(404).then(({ body }) => {
            const { msg } = body
            expect(msg).toBe('Not Found')
        })
    })
    test('400: returns error when user inputs invalid ID', () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'this comment did not get posted'
        }
        return request(app).post('/api/articles/one/comments').send(newComment).expect(400).then(({ body }) => {
            const { msg } = body
            expect(msg).toBe('Bad Request')
        })
    })
    test('404: returns error when user posts with a non-existent username', () => {
        const newComment = {
            username: 'non_existent_username',
            body: 'this comment did not get posted'
        }
        return request(app).post('/api/articles/3/comments').send(newComment).expect(404).then(({ body }) => {
            const { msg } = body
            expect(msg).toBe('Not Found')
        })
    })
})

