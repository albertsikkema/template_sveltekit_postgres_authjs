import { errorLogger } from '$lib/logging/errorLogger.js';
import { getTickets } from '$lib/server/handlers/tickets';

export async function load(event) {
	let page = event.url.searchParams.get('page');

	let search = event.url.searchParams.get('search');
	let orderby = event.url.searchParams.get('orderby');
	let order = event.url.searchParams.get('order');
	if (!page | !Number(page) | (page < 1)) {
		page = 1;
	}

	try {
		const { tickets, total, maxpage, currentpage } = await getTickets({
			page,
			search,
			orderby,
			order
		});
		return { tickets, total, page, maxpage, currentpage };
	} catch (error) {
		errorLogger(error.message, event, 'error getting tickets');
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
			errorLogger(error.message, event, 'error searching tickets');
			return { error: 'Error searching tickets' };
		}
	}
};
