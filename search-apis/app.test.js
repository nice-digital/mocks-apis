const app = require('./app');
const supertest = require('supertest');
const request = supertest(app);

describe("Search api", () => {
    it("search for 'cancer' should return data", async () => {
        const res = await request.get('/api/search?q=cancer&index=cks')
        expect(res.body.debug.rawResponse).toBeDefined();
        expect(res.status).toBe(200);
    })
    it("search for 'asdfgh' should return empty results", async () => {
        const res = await request.get('/api/search?q=asdfgh&index=cks')
        expect(res.body.documents).toEqual([]);
        expect(res.status).toBe(200);
    })
    it("search with no query term should return a result that is empty", async () => {
        const res = await request.get('/api/search')
        expect(res.text).toBeDefined();
        expect(res.status).toBe(200);
    })
})

describe("Typeahead api", () => {
    it("search for 'ast' should return data", async () => {
        const res = await request.get('/api/typeahead?q=ast&index=cks');

        expect(res.body).toBeDefined();
        expect(res.status).toBe(200);
    })
    it("search for 'asdfgh' should return empty results", async () => {
        const res = await request.get('/api/typeahead?q=asdfgh&index=cks');

        expect(res.body).toEqual([]);
        expect(res.status).toBe(200);
    })
    it("search with no query term should return empty results", async () => {
        const res = await request.get('/api/typeahead');
        expect(res.text).toBeDefined();
        expect(res.status).toBe(404);
    })
})

describe("Incorrect url", () => {
    it("should return 404 response", async () => {
        const res = await request.get('/api/doesnotexist?q=ast&index=cks');
        expect(res.status).toBe(404);
    })
})

describe("Specified index does not exist", () => {
    it("should return 404 response", async () => {
        const res = await request.get('/api/search?q=ast&index=doesnotexist');
        expect(res.status).toBe(404);
    })
})