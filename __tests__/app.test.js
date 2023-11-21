const db = require('../db/connection')
const app = require('../app')
const data = require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const request = require('supertest')

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
                expect(topic.slug).toEqual(expect.any(String));
                expect(topic.description).toEqual(expect.any(String));
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
            expect(article.title).toEqual(expect.any(String))
            expect(article.topic).toEqual(expect.any(String))
            expect(article.body).toEqual(expect.any(String))
            expect(article.created_at).toEqual(expect.any(String))
            expect(article.votes).toEqual(expect.any(Number))
            expect(article.article_img_url).toEqual(expect.any(String))
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