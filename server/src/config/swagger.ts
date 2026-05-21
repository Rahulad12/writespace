import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Writespace API",
      version: "1.0.0",
      description: "API documentation for Writespace - a blog writing platform",
    },
    servers: [
      {
        url: "/api",
        description: "API base path",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            message: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
            token: { type: "string" },
          },
        },
        Blog: {
          type: "object",
          properties: {
            id: { type: "string" },
            author_id: { type: "string" },
            title: { type: "string" },
            content: { type: "string" },
            status: { type: "string", enum: ["draft", "published"] },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
            published_at: { type: "string", format: "date-time", nullable: true },
          },
        },
        BlogWithAuthor: {
          type: "object",
          properties: {
            id: { type: "string" },
            author_id: { type: "string" },
            author_username: { type: "string" },
            author_email: { type: "string" },
            title: { type: "string" },
            content: { type: "string" },
            status: { type: "string", enum: ["draft", "published"] },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
            published_at: { type: "string", format: "date-time", nullable: true },
          },
        },
        CreateBlogInput: {
          type: "object",
          required: ["title", "content"],
          properties: {
            title: { type: "string", maxLength: 255 },
            content: { type: "string" },
            status: { type: "string", enum: ["draft", "published"] },
          },
        },
        UpdateBlogInput: {
          type: "object",
          properties: {
            title: { type: "string", maxLength: 255 },
            content: { type: "string" },
            status: { type: "string", enum: ["draft", "published"] },
          },
        },
        Bookmark: {
          type: "object",
          properties: {
            id: { type: "string" },
            user_id: { type: "string" },
            blog_id: { type: "string" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        BookmarkedBlog: {
          type: "object",
          properties: {
            id: { type: "string" },
            user_id: { type: "string" },
            blog_id: { type: "string" },
            title: { type: "string" },
            content: { type: "string" },
            status: { type: "string", enum: ["draft", "published"] },
            author_username: { type: "string" },
            author_email: { type: "string" },
            published_at: { type: "string", format: "date-time", nullable: true },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Follow: {
          type: "object",
          properties: {
            id: { type: "string" },
            follower_id: { type: "string" },
            following_id: { type: "string" },
            created_at: { type: "string", format: "date-time" },
          },
        },
        FollowWithProfile: {
          type: "object",
          properties: {
            id: { type: "string" },
            user_id: { type: "string" },
            username: { type: "string" },
            bio: { type: "string", nullable: true },
            created_at: { type: "string", format: "date-time" },
          },
        },
        UserProfile: {
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            bio: { type: "string", nullable: true },
            created_at: { type: "string", format: "date-time" },
            published_blog_count: { type: "integer" },
          },
        },
        UserProfileWithFollow: {
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            bio: { type: "string", nullable: true },
            created_at: { type: "string", format: "date-time" },
            published_blog_count: { type: "integer" },
            is_following: { type: "boolean" },
          },
        },
        UpdateProfileInput: {
          type: "object",
          properties: {
            username: { type: "string", maxLength: 50 },
            bio: { type: "string", maxLength: 500 },
          },
        },
        RegisterInput: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/modules/**/*.routes.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
