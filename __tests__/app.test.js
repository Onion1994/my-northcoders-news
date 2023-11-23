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
    test('200: an article response object should also include comment_count', () => {
        return request(app).get('/api/articles/5').expect(200).then(({ body }) => {
            const { article } = body
            expect(article.comment_count).toBe("2")
        })
    })
    test("200: comment_count should be '0' if an article has no comments", () => {
        return request(app).get('/api/articles/4').expect(200).then(({ body }) => {
            const { article } = body
            expect(article.comment_count).toBe("0")
        })
    })
    test('404: returns error when user inputs non-existent ID', () => {
        return request(app).get('/api/articles/999').expect(404).then(({ body }) => {
            const { msg } = body
            expect(msg).toBe('Not Found')
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
    test('200: should filter the articles by the topic value specified in the query', () => {
        return request(app).get('/api/articles?topic=cats').expect(200).then(({ body }) => {
            const { articles } = body
            expect(articles).toHaveLength(1)
            articles.forEach((article) => {
                expect(article.topic).toBe('cats')
            })
        })
    })
    test("200: should return an empty array if the given topic exists, but there are no articles associated with it", () => {
        return request(app).get('/api/articles?topic=paper').expect(200).then(({ body }) => {
            const { articles } = body
            expect(articles).toEqual([])
        })
    })
    test('404: returns an error when user inputs non-existent topic query', () => {
        return request(app).get('/api/articles?topic=dogs').expect(404).then(({ body }) => {
            const { msg } = body
            expect(msg).toEqual('Not Found')
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
    test("201: should ignore unnecessary properties on the comment's body", () => {
        const newComment = {
            username: 'butter_bridge',
            body: 'this comment got posted',
            votes: 99,
            article_id: 99,
            created_at: 2023,
            random_property: "random Value"
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
            expect(comment).not.toHaveProperty('random_property')
            expect(comment.created_at).not.toBe(2023)
        })
    })
})

describe('PATCH /api/articles/:article_id', () => {
    test('200: increments the votes of a specific article by a specified amount', () => {
      const updatedVotes = { inc_votes : 25 }
      return request(app).patch('/api/articles/1').send(updatedVotes).expect(200).then(({ body }) => {
        const { article } = body
        expect(article).toMatchObject({
              article_id: 1,
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: 125,
              article_img_url: expect.any(String),
        })
      })
    })
    test('200: decrements the votes of a specific article by a specified amount', () => {
      const updatedVotes = { inc_votes : -25 }
      return request(app).patch('/api/articles/1').send(updatedVotes).expect(200).then(({ body }) => {
        const { article } = body
        expect(article).toMatchObject({
              article_id: 1,
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: 75,
              article_img_url: expect.any(String),
        })
      })
    })
    test("200: should ignore unnecessary properties on the inc_votes'body", () => {
        const updatedVotes = { 
            inc_votes : 25,
            article_id: 99,
            title: "random title",
            topic: "random topic",
            author: "random author",
            body: "random body",
            created_at: 2023,
            votes: 999,
            article_img_url: "random url",
            random_property: "random value"
        }
      return request(app).patch('/api/articles/1').send(updatedVotes).expect(200).then(({ body }) => {
        const { article } = body
        expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 125,
            article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              
        })
        expect(article).not.toHaveProperty('random_property')
        expect(article.created_at).not.toBe(2023)
      })
    })
    test('404: returns error when user inputs non-existent ID', () => {
        const updatedVotes = { inc_votes : 25 }
        return request(app).patch('/api/articles/999').send(updatedVotes).expect(404).then(({ body }) => {
            const { msg } = body
            expect(msg).toBe("Not Found")
        })
    })
    test('400: returns error when user inputs invalid ID', () => {
        const updatedVotes = { inc_votes : 25 }
        return request(app).patch('/api/articles/one').send(updatedVotes).expect(400).then(({ body }) => {
            const { msg } = body
            expect(msg).toBe("Bad Request")
        })
    })
    test('400: returns error when user inputs invalid inc_votes type', () => {
        const updatedVotes = { inc_votes : "twentyfive" }
        return request(app).patch('/api/articles/1').send(updatedVotes).expect(400).then(({ body }) => {
            const { msg } = body
            expect(msg).toBe("Bad Request")
        })
    })
  })

describe('DELETE /api/comments/:comment_id', () => {
    test('204: deletes the given comment by comment_id', () => {
        return request(app).delete('/api/comments/1').expect(204)
    })
    test('404: returns error when user inputs non-existent ID', () => {
        return request(app).delete('/api/comments/999').expect(404).then(({ body }) => {
            const { msg } = body
            expect(msg).toBe('Not Found')
        })
    })
    test('400: returns error when user inputs invalid ID', () => {
        return request(app).delete('/api/comments/one').expect(400).then(({ body }) => {
            const { msg } = body
            expect(msg).toBe('Bad Request')
        })
    })
})

describe('GET /api/users', () => {
    test ('200: returns an array of user objects, each of which having a username, name and avatar_url properties', () => {
      return request(app).get('/api/users').expect(200).then(({ body }) => {
          const { users } = body
          expect(users).toHaveLength(4);
          users.forEach((user) => {
              expect(user).toMatchObject({
                  username: expect.any(String),
                  name: expect.any(String),
                  avatar_url: expect.any(String)
              })
          })
      })
  })
})