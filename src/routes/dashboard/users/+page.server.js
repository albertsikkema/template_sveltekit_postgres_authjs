import { errorLogger } from '$lib/logging/errorLogger.js';
import { getUsers, createUser, updateUser, deleteUser } from '$lib/server/handlers/users';
import { logoutUser } from '$lib/authhelpers.js';
import { fail } from '@sveltejs/kit';
import { users } from '$lib/server/db/schema';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { ZodError, z } from 'zod';

const userInsertSchema = createInsertSchema(users, {
	email: z.string().email().max(50),
	name: z.string().max(30)
});

const userUpdateSchema = createUpdateSchema(users, {
	email: z.string().email().max(50),
	name: z.string().max(30)
});

export async function load(event) {
	try {
		const users = await getUsers();
		return { users };
	} catch (error) {
		errorLogger(error, event, 'error getting users');
		return { error: 'Error getting users' };
	}
}

export const actions = {
	createuser: async (event) => {
		const data = await event.request.formData();
		const { name, email, role, active } = Object.fromEntries(data);
		const isActive = active === 'true' || active === 'on';
		try {
			const parsedUser = userInsertSchema.parse({ email, name, role, active: isActive });
			const result = await createUser(parsedUser);
			return { success: true, message: 'User created' };
		} catch (error) {
			let errormessages = [error.message];
			if (error instanceof ZodError) {
				errormessages = [];
				error.errors.map((error) => {
					errormessages.push(error.path[0] + ': ' + error.message);
				});
			}
			errorLogger(error, event, 'error creating user');
			return fail(400, { name, role, email, active, error: true, message: errormessages });
		}
	},

	updateuser: async (event) => {
		const data = await event.request.formData();
		const { name, email, role, active } = Object.fromEntries(data);
		const isActive = active === 'true' || active === 'on';
		try {
			const parsedUser = userUpdateSchema.parse({
				email: 'test',
				name: 1231,
				role,
				active: isActive
			});
			const result = await updateUser(parsedUser);
			return { success: true, message: 'User updated' };
		} catch (error) {
			let errormessages = [error.message];
			if (error instanceof ZodError) {
				errormessages = [];
				error.errors.map((error) => {
					errormessages.push(error.path[0] + ': ' + error.message);
				});
			}
			errorLogger(error, event, 'error updating user');
			return fail(400, { name, role, email, active, error: true, message: errormessages });
		}
	},

	deleteuser: async (event) => {
		const data = await event.request.formData();
		const { email } = Object.fromEntries(data);
		try {
			await deleteUser(email);
			return { success: true, message: 'User deleted' };
		} catch (error) {
			errorLogger(error, event, 'error deleting user');
			return fail(400, { email, error: true, message: error.message });
		}
	},

	loguserout: async (event) => {
		const data = await event.request.formData();
		const { email } = Object.fromEntries(data);
		try {
			await logoutUser(email);
			return { success: true, message: 'User is logged out' };
		} catch (error) {
			errorLogger(error, event, 'error logging out user ${email}');
			return fail(400, { email, error: true, message: error.message });
		}
	}
};
