const express = require("express");
const request = require('supertest')
const serverRoutes = require('../routes')
const app = express();
app.use("/nerf-herders", serverRoutes);
describe('Get Endpoints', () => {
    it('should retrieve data', async () => {
        const res = await request(app)
            .get('/nerf-herders')
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('get')
    })
})