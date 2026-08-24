export const schemas = {
  PublicUser: {
    type: "object",

    properties: {
      id: {
        type: "string",
        example: "688b31f2d0d6d1c4d7d0a123",
      },

      firstName: {
        type: "string",
        example: "John",
      },

      lastName: {
        type: "string",
        example: "Doe",
      },

      email: {
        type: "string",
        format: "email",
        example: "john@example.com",
      },

      role: {
        type: "string",
        example: "user",
      },

      status: {
        type: "string",
        example: "active",
      },

      emailVerified: {
        type: "boolean",
        example: true,
      },

      avatarUrl: {
        type: "string",
        nullable: true,
        example: null,
      },

      createdAt: {
        type: "string",
        format: "date-time",
      },

      updatedAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
};