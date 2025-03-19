// +layout.server.js
import { errorLogger } from '$lib/logging/errorLogger.js';
import { getOpenTicketsCount } from '$lib/server/handlers/tickets';
import { fail } from '@sveltejs/kit';
export async function load({ locals, url }) {
	try {
		let opentickets = await getOpenTicketsCount();

		return {
			user: locals.session.user,
			opentickets,
			url: url.pathname
		};
	} catch (error) {
		errorLogger(error.message, 'error getting open tickets count');
		return fail(error.message);
	}
}
