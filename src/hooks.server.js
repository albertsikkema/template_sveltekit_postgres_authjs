// middleware for server-side hooks
import { sequence } from '@sveltejs/kit/hooks';
import { handle as AuthHandle } from './auth';
import { redirect } from '@sveltejs/kit';
// import { checkAdminExists } from '$lib/init';
import hooksLogger from '$lib/logging/hookslogger';
import logger from '$lib/logging/logger';
import { hashUserData } from '$lib/privacyhelper';
import crypto from 'crypto';
import { requireRole } from '$lib/authhelpers';

logger.info('Server: ready!');

// Define a proper type for handleError function
export const handleError = async ({ error, event }) => {
	const errorId = crypto.randomUUID();

	// Store error details in event.locals
	event.locals.error = error?.toString() || undefined;
	event.locals.errorStackTrace = undefined;
	event.locals.errorId = errorId;

	// Log the error
	hooksLogger({ statusCode: 500, event });

	return {
		message: 'An unexpected error occurred.',
		errorId
	};
};

export const firstHandler = async function ({ event, resolve }) {
	// add a start time to the event object
	event.locals.startTimer = Date.now();

	// track user with anonymous hash
	const ip =
		event.request.headers.get('x-real-ip') ||
		event.request.headers.get('x-forwarded-for') ||
		event.getClientAddress();
	const userAgent = event.request.headers.get('user-agent');
	event.locals.track = hashUserData(`${ip} / ${userAgent}`);

	return resolve(event);
};

// working from a no trust base, we need to protect all routes
// no path is accessible unless...
// if not logged in, only access to page to login
// if user only access to pages that are not admin
// if admin access to all pages
const openPaths = ['/auth//signin', '/'];
// Define paths restricted to admin users only
const adminPaths = ['/admin'];

export const protectRoutes = async ({ event, resolve }) => {
	// Retrieve the session
	const session = await event.locals.auth();
	console.log('protectRoutes', session);
	event.locals.session = session; // Make session available globally in hooks

	const path = event.url.pathname;

	// If user tries to access a restricted page without being logged in
	if (!openPaths.includes(path)) {
		if (!session) {
			throw redirect(303, '/auth/signin');
		}
	}

	// If a non-admin user tries to access an admin-only path
	if (session && session.user.role !== 'admin') {
		if (adminPaths.includes(path)) {
			throw redirect(303, '/auth/signin');
		}
	}

	// Continue processing the request
	return resolve(event);
};

export const lastHandler = async function ({ event, resolve }) {
	console.log('lastHandler', event.locals);
	const response = await resolve(event);
	hooksLogger({ statusCode: response.status, event: event });
	return response;
};

export const handle = sequence(firstHandler, AuthHandle, protectRoutes, lastHandler);
