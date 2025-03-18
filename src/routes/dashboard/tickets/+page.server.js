import { errorLogger } from '$lib/logging/errorLogger.js';
import { getTickets } from '$lib/server/handlers/tickets';
import { getUsers } from '$lib/server/handlers/users';
import { logoutUser } from '$lib/authhelpers.js';
import { fail } from '@sveltejs/kit';
import { tickets } from '$lib/server/db/schema.js';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { ZodError, z } from 'zod';

export async function load(event) {
	let page = event.url.searchParams.get('page');
	let search = event.url.searchParams.get('search');
	let orderby = event.url.searchParams.get('orderby');
	let order = event.url.searchParams.get('order');
	if (!page | !Number(page) | (page < 1)) {
		page = 1;
	}

	console.log('===> load', page, search, orderby, order);

	try {
		const { tickets, total, maxpage, currentpage } = await getTickets({
			page,
			search,
			orderby,
			order
		});
		return { tickets, total, page, maxpage, currentpage };
	} catch (error) {
		errorLogger(error, event, 'error getting tickets');
		return { error: 'Error getting tickets' };
	}
}

export const actions = {
	search: async (event) => {
		const search = event.form.get('search');
		const page = event.url.searchParams.get('page');
		try {
			const { tickets, total, maxpage, currentpage } = await getTickets({ search, page });
			return { tickets, total, page, maxpage, currentpage };
		} catch (error) {
			console.log('error searching tickets', error);
			errorLogger(error, event, 'error searching tickets');
			return { error: 'Error searching tickets' };
		}
	}
};
