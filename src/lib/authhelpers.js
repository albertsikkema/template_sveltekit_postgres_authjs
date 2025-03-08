import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/index'; // Drizzle instance
import { sessions, users, accounts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export function requireRole(session, requiredRole) {
  // Ensure session exists and user has a role
  if (!session?.user?.role || session.user.role !== requiredRole) {
    throw redirect(303, '/auth/signin'); // Redirect unauthorized users
  }
}

export async function logoutUser(email) {
  // find user in users by email, get userid
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) return; // No user found, so no need to delete sessions, user was not logged in.
  // delete session by userid
  await db.delete(sessions).where(eq(sessions.userId, user.id));
  // delete user by email
  await db.delete(users).where(eq(users.email, email));
  // delete account by userid
  await db.delete(accounts).where(eq(accounts.userId, user.id));
  console.log('===> logoutUser', email);
  return;
}