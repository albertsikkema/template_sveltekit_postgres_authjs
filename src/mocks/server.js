import { setupServer } from 'msw/node';
import { rest } from 'msw';  // ✅ Ensure correct import

// ✅ Mock `/api/auth/session` for Auth.js
export const handlers = [
  rest.get('/api/auth/session', (req, res, ctx) => {  // ✅ Ensure correct API path
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          name: 'Test User',
          email: 'test@example.com'
        }
      })
    );
  })
];

export const server = setupServer(...handlers);

// ✅ Ensure mock server runs before/after tests
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());