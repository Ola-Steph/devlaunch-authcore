export const healthPaths = {
  "/health": {
    get: {
      tags: ["Health"],
      summary: "Health Check",
      description:
        "Returns the current health status of the AuthCore API.",
      responses: {
        200: {
          description: "API is healthy",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: true,
                  },
                  message: {
                    type: "string",
                    example: "AuthCore API is running.",
                  },
                  timestamp: {
                    type: "string",
                    format: "date-time",
                    example: "2026-08-09T04:09:00.000Z",
                  },
                },
                required: [
                  "success",
                  "message",
                  "timestamp",
                ],
              },
            },
          },
        },
      },
    },
  },
};