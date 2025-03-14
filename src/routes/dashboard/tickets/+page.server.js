import { errorLogger } from '$lib/logging/errorLogger.js';
import {
	getTickets,
	createTicket,
	updateTicket,
	deleteTicket,
	getTicket
} from '$lib/server/handlers/tickets';
import { getUsers } from '$lib/server/handlers/users';
import { logoutUser } from '$lib/authhelpers.js';
import { fail } from '@sveltejs/kit';
import { tickets } from '$lib/server/db/schema.js';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { ZodError, z } from 'zod';

const ticketInsertSchema = createInsertSchema(tickets, {
	title: z.string().min(3).max(50),
	description: z.string().max(300),
	created_by: z.string().email().max(50)
});

const ticketUpdateSchema = createUpdateSchema(tickets, {
	title: z.string().min(3).max(50),
	description: z.string().max(300),
	created_by: z.string().email().max(50),
	assigned_to: z.string().email().max(50)
});

export async function load(event) {
	console.log('===> load event', event.locals);
	try {
		const tickets = await getTickets();
		const users = await getUsers();
		// create a object of users for the dropdown {"email":"name", "email":"name"}
		const userList = users.reduce((acc, user) => {
			acc[user.email] = user.name || user.email;
			return acc;
		}, {});

		console.log('===> load tickets', userList);
		const userEmail = event.locals.session.user.email;
		return { tickets, userEmail, userList };
	} catch (error) {
		errorLogger(error, event, 'error getting tickets');
		return { error: 'Error getting tickets' };
	}
}

export const actions = {
	/**
	 * Create Ticket - Handles MultiPart (File) Uploads
	 */
	createticket: async (event) => {
		const data = await event.request.formData();
		const title = data.get('title');
		const description = data.get('description');
		const created_by = data.get('created_by');

		// Process File Uploads
		const images = [];
		for (const entry of data.entries()) {
			const [key, value] = entry;
			if (key === 'images' && value instanceof Blob) {
				const buffer = Buffer.from(await value.arrayBuffer());
				images.push({ name: value.name, type: value.type, size: buffer.length, data: buffer });
			}
		}
		try {
			const parsedTicket = ticketInsertSchema.parse({ title, description, created_by, images });
			// Save ticket with attached files
			const result = await createTicket(parsedTicket);
			return { success: true, message: 'Ticket created' };
		} catch (error) {
			let errormessages = [error.message];
			if (error instanceof ZodError) {
				errormessages = [];
				error.errors.map((error) => {
					errormessages.push(error.path[0] + ': ' + error.message);
				});
			}
			errorLogger(error, event, 'error updating ticket');
			return fail(400, {
				title,
				description,
				created_by,
				images,
				error: true,
				message: errormessages
			});
		}
	},

	/**
	 * Update Ticket - Handles MultiPart (File) Uploads
	 */
	updateticket: async (event) => {
		const data = await event.request.formData();
		const id = data.get('id');
		const title = data.get('title');
		const description = data.get('description');
		const created_by = data.get('created_by');
		const assigned_to = data.get('assigned_to');
		const status = data.get('status');

		// Process File Uploads
		const images = [];
		for (const entry of data.entries()) {
			const [key, value] = entry;
			if (key === 'images' && value instanceof Blob) {
				const buffer = Buffer.from(await value.arrayBuffer());
				images.push({ name: value.name, type: value.type, size: buffer.length, data: buffer });
			}
		}
		try {
			const parsedTicket = ticketUpdateSchema.parse({
				id,
				title,
				description,
				created_by,
				assigned_to,
				status,
				images
			});
			// Update ticket with attached files
			const result = await updateTicket(parsedTicket);
			return { success: true, message: 'Ticket updated' };
		} catch (error) {
			let errormessages = [error.message];
			if (error instanceof ZodError) {
				errormessages = [];
				error.errors.map((error) => {
					errormessages.push(error.path[0] + ': ' + error.message);
				});
			}
			errorLogger(error, event, 'error updating ticket');
			return fail(400, {
				id,
				title,
				description,
				created_by,
				assigned_to,
				status,
				images,
				error: true,
				message: errormessages
			});
		}
	},

	deleteticket: async (event) => {
		const data = await event.request.formData();
		const { id } = Object.fromEntries(data);
		try {
			await deleteTicket(id);
			return { success: true, message: 'Ticket deleted' };
		} catch (error) {
			errorLogger(error, event, 'error deleting ticket');
			return fail(400, { id, error: true, message: error.message });
		}
	}
};
