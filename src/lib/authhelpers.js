import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/index'; // Drizzle instance
import { auth_sessions, auth_users, auth_accounts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export function requireRole(session, requiredRole) {
	// Ensure session exists and user has a role
	if (!session?.user?.role || session.user.role !== requiredRole) {
		throw redirect(303, '/auth/signin'); // Redirect unauthorized auth_users
	}
}

export async function logoutUser(email) {
	// find user in auth_users by email, get userid
	const user = await db.query.auth_users.findFirst({
		where: eq(auth_users.email, email)
	});
	if (!user) return; // No user found, so no need to delete auth_sessions, user was not logged in.
	// delete session by userid
	await db.delete(auth_sessions).where(eq(auth_sessions.userId, user.id));
	// delete user by email
	await db.delete(auth_users).where(eq(auth_users.email, email));
	// delete account by userid
	await db.delete(auth_accounts).where(eq(auth_accounts.userId, user.id));
	console.log('===> logoutUser', email);
	return;
}
