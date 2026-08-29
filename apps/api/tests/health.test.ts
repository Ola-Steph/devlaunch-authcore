import request from "supertest";

import { describe, expect, it } from "vitest";

import app from "../src/app.js";

describe("GET /api/v1/health", () => {
  it("returns a successful health response", async () => {
    const response = await request(app)
      .get("/api/v1/health")
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: "AuthCore API is running.",
      }),
    );

    expect(response.body.timestamp).toEqual(
      expect.any(String),
    );
  });
});
