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
