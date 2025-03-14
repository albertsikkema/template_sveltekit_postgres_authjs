import { db } from '$lib/server/db/index'; // Drizzle instance
import { tickets } from '$lib/server/db/schema';
import { ValidationError } from '$lib/errorclasses';
import { eq } from 'drizzle-orm';

/** Get all tickets */
export const getTickets = async () => {
	try {
		return await db.select().from(tickets);
	} catch (error) {
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
