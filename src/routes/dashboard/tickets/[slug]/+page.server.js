import { errorLogger } from '$lib/logging/errorLogger.js';
import { createTicket, updateTicket, deleteTicket, getTicket } from '$lib/server/handlers/tickets';
import { getUsers } from '$lib/server/handlers/users';
import { fail } from '@sveltejs/kit';
import { tickets } from '$lib/server/db/schema.js';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { ZodError, z } from 'zod';

const ticketInsertSchema = createInsertSchema(tickets, {
	title: z.string().min(3).max(50),
	description: z.string().max(300),
	created_by: z.coerce.number().min(1)
});

const ticketUpdateSchema = createUpdateSchema(tickets, {
	id: z.coerce.number().min(1),
	title: z.string().min(3).max(50),
	description: z.string().max(300),
	created_by: z.coerce.number().min(1),
	assigned_to: z.coerce.number().min(1).nullable()
});

export const load = async (event) => {
	const slug = event.params.slug;
	const result = await getUsers();
	const userList = result.users.reduce((acc, user) => {
		acc[user.id] = user.email;
		return acc;
	}, {});
	try {
		if (slug === 'new') {
			return {
				ticket: {
					title: '',
					description: '',
					created_by: 1
				},
				userList,
				slug
			};
		} else {
			const ticket = await getTicket(slug);
			if (!ticket) {
				return { error: 'Ticket not found' };
			}
			return { ticket, userList, slug };
		}
	} catch (error) {
		errorLogger(error.message, event, 'error getting ticket');
		return { error: 'Error getting ticket' };
	}
};

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
			await createTicket(parsedTicket);
			return { success: true, message: 'Ticket created' };
		} catch (error) {
			let errormessages = {};
			if (error instanceof ZodError) {
				error.errors.forEach((error) => {
					errormessages[error.path[0]] = error.message; // Use the field name as key
				});
			} else {
				errormessages['error'] = error.message;
			}
			errorLogger(error.message, event, 'error updating ticket');
			return fail(400, {
				title,
				description,
				created_by,
				images,
				errors: errormessages
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
			await updateTicket(parsedTicket);
			return { success: true, message: 'Ticket updated' };
		} catch (error) {
			let errormessages = {};
			if (error instanceof ZodError) {
				error.errors.forEach((error) => {
					errormessages[error.path[0]] = error.message; // Use the field name as key
				});
			} else {
				errormessages['error'] = error.message;
			}
			errorLogger(error.message, event, 'error updating ticket');
			return fail(400, {
				id,
				title,
				description,
				created_by,
				assigned_to,
				status,
				images,
				errors: errormessages
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
			let errormessages = { error: error.message };
			errorLogger(error.message, event, 'error deleting ticket');
			return fail(400, { id, errors: errormessages });
		}
	}
};
