const { expect } = require('chai');
const supertest = require('supertest');

const app = require('../app');
const books = require('../books-data.js');

describe('nytServer app', () => {
    it('should display array of books from GET /books', () => {
        return supertest(app)
            .get('/books')
            .query({})
            .expect(200)
            .then(res => {
                expect(res.body).to.deep.equal(books)
                expect(res.body).to.be.an('array')
            })
    })
    it('should display correct data based on search query', () => {
        return supertest(app)
            .get('/books')
            .query({search: 'HOST'})
            .expect(200)
            .then( res => {
                expect(res.body[0]).to.have.property('title').that.include('HOST')
                // expect(res.body).to.deep.equal([{
                //     bestsellers_date: 1211587200000,
                //     published_date: 1212883200000,
                //     author: "Stephenie Meyer",
                //     description:
                //         "Aliens have taken control of the minds and bodies of most humans, but one woman won’t surrender.",
                //     publisher: "Little, Brown",
                //     title: "THE HOST",
                //     rank: 2,
                //     rank_last_week: 1,
                //     weeks_on_list: 3,
                //     id: "5b4aa4ead3089013507db18c"
                // }])
            })
    })
    it('should sort books alphabeticly when title query provided', () => {
        return supertest(app)
            .get('/books')
            .query({sort: 'title'})
            .expect(200)
            .then( res => {
                expect(res.body[0]).to.have.property('title').that.include('B')
                expect(res.body[1]).to.have.property('title').that.include('C')
                expect(res.body[2]).to.have.property('title').that.include('E')
            })
    })
    it('should sort books from highest ranking to lowest when rank query provided', () => {
        return supertest(app)
            .get('/books')
            .query({sort: 'rank'})
            .expect(200)
            .then( res => {
                expect(res.body[0]).to.have.property('rank').to.deep.equal(1)
                expect(res.body[1]).to.have.property('rank').to.deep.equal(2)
                expect(res.body[2]).to.have.property('rank').to.deep.equal(3)
            })
    })
    it('should return message if query provided does not match rank or title', () => {
        return supertest(app)
            .get('/books')
            .query({sort: 'ranking'})
            .expect(400, 'Sort must be one of title or rank')
            
    })
    })
