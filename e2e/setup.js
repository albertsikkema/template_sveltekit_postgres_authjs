// tests/setup.js
import { request } from '@playwright/test';

export async function authenticateUser(email) {
  const context = await request.newContext();
  
  // Mock magic link email verification (Normally handled via email)
  const response = await context.post('http://localhost:3000/api/auth/signin/email', {
    form: {
      email, // Simulate user entering email
      callbackUrl: 'http://localhost:3000'
    }
  });

  console.log("Magic link response:", response.status());
  return context;
}