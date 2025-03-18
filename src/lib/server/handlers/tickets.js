import { db } from '$lib/server/db/index'; // Drizzle instance
import { tickets, users } from '$lib/server/db/schema';
import { ValidationError } from '$lib/errorclasses';
import { eq, count, sql, like, or, asc, desc } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { nan } from 'zod';
import { errorLogger } from '$lib/logging/errorLogger.js';

function maxPage(total, limit) {
	const maxPage = Math.ceil(total / limit); // Zero-based pagination
	return maxPage >= 0 ? maxPage : 0;
}

/** Get all tickets */
export const getTickets = async ({ page, search, orderby, order }) => {
	console.log('16 ===> getTickets', page, search, orderby, order);
	const limit = 10;
	if (!page | !Number(page) | (page < 1)) {
		page = 1;
	}
	try {
		// Create aliased tables for users
		const creator = alias(users, 'creator');
		const assignee = alias(users, 'assignee');

		// Start with a base query
		let baseQuery = db
			.select({
				id: tickets.id,
				title: tickets.title,
				description: tickets.description,
				status: tickets.status,
				created_at: tickets.created_at,
				created_by_email: creator.email,
				assigned_to_email: assignee.email
			})
			.from(tickets)
			.leftJoin(creator, eq(tickets.created_by, creator.id)) // Join for created_by using alias
			.leftJoin(assignee, eq(tickets.assigned_to, assignee.id)); // Join for assigned_to using alias

		// Apply search filter if search is provided
		if (search) {
			baseQuery = baseQuery.where(
				or(like(tickets.title, `%${search}%`), like(tickets.description, `%${search}%`))
			);
		}

		// Create two separate queries:
		// 1️⃣ Query for total count (without limit & offset)
		const totalQuery = db.select({ count: count() }).from(tickets);
		if (search) {
			totalQuery.where(
				or(like(tickets.title, `%${search}%`), like(tickets.description, `%${search}%`))
			); // Rapply search filter
		}
		const total = await totalQuery;
		const maxpage = maxPage(total[0]?.count, limit);
		if (page > maxpage) {
			page = maxpage;
		}

		let offset = (page - 1) * limit;
		if (offset < 0) {
			offset = 0;
		}
		if (!orderby) {
			orderby = 'created_at';
		}
		if (!order) {
			order = 'asc';
		}

		// Define sorting function correctly
		const orderDirection = order.toLowerCase() === 'asc' ? asc : desc;
		const orderColumn = tickets[orderby];

		console.log('===> Sorting by', orderColumn, order);

		console.log('===> getTickets', total[0]?.count, maxpage, offset, limit, orderby, order);

		// 2️⃣ Query for paginated results (with limit & offset)
		const resultTickets = await baseQuery
			.orderBy(orderDirection(orderColumn)) // ✅ Correctly apply sorting
			.limit(limit)
			.offset(offset);

		return {
			tickets: resultTickets,
			total: total[0]?.count || 0,
			currentpage: page,
			maxpage: maxPage(total[0]?.count, limit)
		};
	} catch (error) {
		console.log('===> getTickets error', error);
		throw new Error(`query error: ${error.message}`);
	}
};

/** Get a single ticket by id */
export const getTicket = async (id) => {
	try {
		return await db.query.tickets.findFirst({
			where: eq(tickets.id, id)
		});
	} catch (error) {
		throw new Error(`query error: ${error.message}`);
	}
};

/** Create a new ticket */
export const createTicket = async ({ title, description, created_by, images }) => {
	try {
		const [ticket] = await db
			.insert(tickets)
			.values({ title, description, created_by, images })
			.returning(); // Return inserted record
		return ticket;
	} catch (error) {
		throw new ValidationError(`validation error: ${error.message}`);
	}
};
/** Update a ticket */
export const updateTicket = async ({
	id,
	title,
	description,
	created_by,
	assigned_to,
	status,
	images
}) => {
	try {
		const [updatedTicket] = await db
			.update(tickets)
			.set({ id, title, description, created_by, assigned_to, status })
			.where(eq(tickets.id, id))
			.returning(); // Return updated user

		return updatedTicket;
	} catch (error) {
		throw new Error(error);
	}
};

/** Delete a ticket */
export const deleteTicket = async (id) => {
	console.log('===> deleteTicket', id);
	try {
		const [deletedTicket] = await db.delete(tickets).where(eq(tickets.id, id)).returning(); // Return deleted user
		return deletedTicket;
	} catch (error) {
		throw new Error(error);
	}
};
