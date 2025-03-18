import { errorLogger } from '$lib/logging/errorLogger.js';
import { getUsers } from '$lib/server/handlers/users';
import { logoutUser } from '$lib/authhelpers.js';
import { fail } from '@sveltejs/kit';
import { users } from '$lib/server/db/schema.js';
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
		const { users, total, maxpage, currentpage } = await getUsers({
			page,
			search,
			orderby,
			order
		});
		return { users, total, page, maxpage, currentpage };
	} catch (error) {
		errorLogger(error.message, event, 'error getting users');
		throw new Error(`query error: ${error.message}`);
	}
}

export const actions = {
	search: async (event) => {
		const search = event.form.get('search');
		const page = event.url.searchParams.get('page');
		try {
			const { users, total, maxpage, currentpage } = await getUsers({
				page,
				search,
				orderby,
				order
			});
			return { users, total, page, maxpage, currentpage };
		} catch (error) {
			console.log('error searching users', error);
			errorLogger(error.message, event, 'error searching users');
			return { error: 'Error searching users' };
		}
	}
};
