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

