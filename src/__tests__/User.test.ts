import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from "../database";

describe("Users", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    })

    afterAll(async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    })

    it("sould be able to create a new user", async () => {
        const response = await request(app).post("/users")
            .send({
                email: "user@example.com",
                name: "userExample"
            });
        expect(response.status).toBe(201)
    })

    it("should not be able to create an user with exits email", async () => {
        const response = await request(app).post('/users').send({
            email: 'user@example.com',
            name: 'user example'
        });
        expect(response.status).toBe(400);

    })
})