export const authPaths = {
  "/auth/register": {
    post: {
      tags: ["Authentication"],

      summary: "Register a new account",

      description:
        "Creates a new user account and sends a verification email.",

      requestBody: {
        required: true,

        content: {
          "application/json": {
            schema: {
              type: "object",

              required: [
                "firstName",
                "lastName",
                "email",
                "password",
              ],

              properties: {
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
                  example: "john@example.com",
                },

                password: {
                  type: "string",
                  example: "Password123!",
                },
              },
            },
          },
        },
      },

      responses: {
        201: {
          description: "Account created",

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
                    example:
                      "Account created successfully",
                  },

                  data: {
                    $ref:
                      "#/components/schemas/PublicUser",
                  },
                },
              },
            },
          },
        },

        409: {
          description:
            "Email already exists",
        },
      },
    },
  },



"/auth/login": {
  post: {
    tags: ["Authentication"],

    summary: "Login",

    description:
      "Authenticates a user with their email and password and returns access and refresh tokens.",

    requestBody: {
      required: true,

      content: {
        "application/json": {
          schema: {
            type: "object",

            required: [
              "email",
              "password",
            ],

            properties: {
              email: {
                type: "string",
                format: "email",
                example: "john@example.com",
              },

              password: {
                type: "string",
                format: "password",
                example: "Password123!",
              },
            },
          },
        },
      },
    },

    responses: {
      200: {
        description: "Login successful",

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
                  example: "Login successful",
                },

                data: {
                  type: "object",

                  properties: {
                    accessToken: {
                      type: "string",
                      example:
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },

                    refreshToken: {
                      type: "string",
                      example:
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },

                    user: {
                      $ref:
                        "#/components/schemas/PublicUser",
                    },
                  },
                },
              },
            },
          },
        },
      },

      401: {
        description: "Invalid email or password",
      },

      422: {
        description: "Validation error",
      },
    },
  },

},






"/auth/refresh": {
  post: {
    tags: ["Authentication"],

    summary: "Refresh access token",

    description:
      "Generates a new access token using a valid refresh token.",

    requestBody: {
      required: true,

      content: {
        "application/json": {
          schema: {
            type: "object",

            required: ["refreshToken"],

            properties: {
              refreshToken: {
                type: "string",

                description:
                  "A valid refresh token returned during login.",

                example:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
          },
        },
      },
    },

    responses: {
      200: {
        description:
          "Token refreshed successfully",

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
                  example:
                    "Token refreshed successfully",
                },

                data: {
                  type: "object",

                  properties: {
                    accessToken: {
                      type: "string",

                      description:
                        "Newly generated access token.",

                      example:
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                  },
                },
              },
            },
          },
        },
      },

      401: {
        description:
          "Invalid or expired refresh token",
      },

      422: {
        description:
          "Validation error",
      },
    },
  },
},




"/auth/me": {
  get: {
    tags: ["Authentication"],

    summary: "Get current user",

    description:
      "Returns the authenticated user's public profile using the access token.",

    security: [
      {
        bearerAuth: [],
      },
    ],

    responses: {
      200: {
        description:
          "Authenticated user returned successfully",

        content: {
          "application/json": {
            schema: {
              type: "object",

              properties: {
                success: {
                  type: "boolean",
                  example: true,
                },

                data: {
                  $ref:
                    "#/components/schemas/PublicUser",
                },
              },
            },
          },
        },
      },

      401: {
        description:
          "Authentication required or access token is invalid",
      },
    },
  },
},



"/auth/logout": {
  post: {
    tags: ["Authentication"],

    summary: "Logout",

    description:
      "Logs out the current user by revoking the session associated with the supplied refresh token. The client should discard its stored access and refresh tokens after a successful logout.",

    security: [
      {
        bearerAuth: [],
      },
    ],

    requestBody: {
      required: true,

      content: {
        "application/json": {
          schema: {
            type: "object",

            required: ["refreshToken"],

            properties: {
              refreshToken: {
                type: "string",

                description:
                  "The refresh token returned during login or token refresh.",

                example:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              },
            },
          },
        },
      },
    },

    responses: {
      200: {
        description: "Logged out successfully",

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
                  example: "Logged out successfully",
                },
              },
            },
          },
        },
      },

      401: {
        description:
          "Authentication required, access token is invalid, or refresh token is invalid/revoked",
      },

      422: {
        description:
          "Validation error",
      },
    },
  },
},



"/auth/verify-email": {
  post: {
    tags: ["Authentication"],

    summary: "Verify email address",

    description:
      "Verifies a user's email address using the verification token sent by email.",

    requestBody: {
      required: true,

      content: {
        "application/json": {
          schema: {
            type: "object",

            required: ["token"],

            properties: {
              token: {
                type: "string",

                description:
                  "Email verification token received by the user.",

                example:
                  "8f7d2c9a4b6e1f...",
              },
            },
          },
        },
      },
    },

    responses: {
      200: {
        description:
          "Email verified successfully",

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
                  example:
                    "Email verified successfully",
                },

                data: {
                  nullable: true,
                  example: null,
                },
              },
            },
          },
        },
      },

      400: {
        description:
          "Invalid or expired verification token",
      },

      422: {
        description:
          "Validation error",
      },
    },
  },
},


"/auth/resend-verification": {
  post: {
    tags: ["Authentication"],

    summary: "Resend verification email",

    description:
      "Resends the email verification link to an unverified user. The API intentionally returns the same successful response when the email does not exist or has already been verified to help prevent email enumeration.",

    requestBody: {
      required: true,

      content: {
        "application/json": {
          schema: {
            type: "object",

            required: ["email"],

            properties: {
              email: {
                type: "string",
                format: "email",
                example: "john@example.com",
              },
            },
          },
        },
      },
    },

    responses: {
      200: {
        description:
          "Verification email request processed successfully",

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
                  example:
                    "If your account requires verification, a verification email has been sent.",
                },

                data: {
                  nullable: true,
                  example: null,
                },
              },
            },
          },
        },
      },

      422: {
        description: "Validation error",
      },
    },
  },
},


"/auth/change-password": {
  patch: {
    tags: ["Authentication"],

    summary: "Change password",

    description:
      "Changes the authenticated user's password. The current password must be provided and verified before the new password is saved.",

    security: [
      {
        bearerAuth: [],
      },
    ],

    requestBody: {
      required: true,

      content: {
        "application/json": {
          schema: {
            type: "object",

            required: [
              "currentPassword",
              "newPassword",
            ],

            properties: {
              currentPassword: {
                type: "string",
                format: "password",
                example: "OldPassword123!",
              },

              newPassword: {
                type: "string",
                format: "password",
                example: "NewPassword123!",
              },
            },
          },
        },
      },
    },

    responses: {
      200: {
        description:
          "Password changed successfully",

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
                  example:
                    "Password changed successfully",
                },

                data: {
                  nullable: true,
                  example: null,
                },
              },
            },
          },
        },
      },

      401: {
        description:
          "Current password is incorrect or authentication is invalid",
      },

      404: {
        description: "User not found",
      },

      422: {
        description: "Validation error",
      },
    },
  },
},



"/auth/forgot-password": {
  post: {
    tags: ["Authentication"],

    summary: "Request password reset",

    description:
      "Requests a password reset email. For security, the API returns the same successful response whether or not the email address belongs to an existing account.",

    requestBody: {
      required: true,

      content: {
        "application/json": {
          schema: {
            type: "object",

            required: ["email"],

            properties: {
              email: {
                type: "string",
                format: "email",
                example: "john@example.com",
              },
            },
          },
        },
      },
    },

    responses: {
      200: {
        description:
          "Password reset request processed",

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

                  example:
                    "If an account exists, a password reset email has been sent.",
                },

                data: {
                  nullable: true,
                  example: null,
                },
              },
            },
          },
        },
      },

      422: {
        description: "Validation error",
      },
    },
  },
},

"/auth/reset-password": {
  post: {
    tags: ["Authentication"],

    summary: "Reset password",

    description:
      "Resets a user's password using a valid password-reset token.",

    requestBody: {
      required: true,

      content: {
        "application/json": {
          schema: {
            type: "object",

            required: [
              "token",
              "newPassword",
            ],

            properties: {
              token: {
                type: "string",

                description:
                  "Password-reset token received through the password-reset email.",

                example:
                  "8f7d2c9a4b6e1f...",
              },

              newPassword: {
                type: "string",

                format: "password",

                example:
                  "NewPassword123!",
              },
            },
          },
        },
      },
    },

    responses: {
      200: {
        description:
          "Password reset successfully",

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
                  example:
                    "Password reset successfully",
                },

                data: {
                  nullable: true,
                  example: null,
                },
              },
            },
          },
        },
      },

      400: {
        description:
          "Invalid or expired password-reset token",
      },

      422: {
        description:
          "Validation error",
      },
    },
  },
},


};

