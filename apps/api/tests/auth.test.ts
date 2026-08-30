import mongoose from "mongoose";

import request from "supertest";

import {
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import app from "../src/app.js";

import { env } from "../src/common/config/index.js";

import { UserModel } from "../src/modules/users/index.js";

describe("Authentication", () => {
  beforeAll(async () => {
    await mongoose.connect(env.MONGODB_URI);
  });

  afterEach(async () => {
    await UserModel.deleteMany({
      email: {
        $regex: /^test-auth-/,
      },
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe("POST /api/v1/auth/register", () => {
    it("registers a new user successfully", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          firstName: "Test",
          lastName: "User",
          email: "test-auth-register@example.com",
          password: "Password123",
        })
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          message: "Account created successfully",
        }),
      );

      expect(response.body.data).toEqual(
        expect.objectContaining({
          email: "test-auth-register@example.com",
          firstName: "Test",
          lastName: "User",
        }),
      );

      expect(response.body.data.passwordHash).toBeUndefined();
    });

    it("rejects a duplicate email", async () => {
      const user = {
        firstName: "Test",
        lastName: "User",
        email: "test-auth-duplicate@example.com",
        password: "Password123",
      };

      await request(app)
        .post("/api/v1/auth/register")
        .send(user)
        .expect(201);

      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(user)
        .expect(409);

      expect(response.body).toEqual({
        success: false,
        message: "Email already exists",
      });
    });

    it("rejects a weak password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          firstName: "Test",
          lastName: "User",
          email: "test-auth-weak@example.com",
          password: "password",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("rejects an invalid email", async () => {
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send({
          firstName: "Test",
          lastName: "User",
          email: "not-an-email",
          password: "Password123",
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    const user = {
      firstName: "Test",
      lastName: "Login",
      email: "test-auth-login@example.com",
      password: "Password123",
    };

    beforeEach(async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send(user)
        .expect(201);
    });

    it("logs in successfully with valid credentials", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          success: true,
          message: "Login successful",
        }),
      );

      expect(response.body.data).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
          user: expect.objectContaining({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          }),
        }),
      );
    });

    it("rejects an incorrect password", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: user.email,
          password: "WrongPassword123",
        })
        .expect(401);

      expect(response.body).toEqual({
        success: false,
        message: "Invalid email or password",
      });
    });

    it("rejects an unknown email", async () => {
      const response = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "test-auth-unknown@example.com",
          password: "Password123",
        })
        .expect(401);

      expect(response.body).toEqual({
        success: false,
        message: "Invalid email or password",
      });
    });
  });
});
