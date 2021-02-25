import request from 'supertest';
import { app } from '../app';

import createConnection from "../database";

describe("User", () => {
    beforeAll(async() =>{
        const connection = await createConnection();
        await connection.runMigrations();
    })
    
    it("sould be able to create a new user", async () =>{
        const response = await request(app).post("/users")
        .send({
            email: "user@example.com",
            name: "userExample"
        });
        expect(response.status).toBe(201)
    })
})