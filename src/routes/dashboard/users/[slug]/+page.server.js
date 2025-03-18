import { errorLogger } from '$lib/logging/errorLogger.js';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '$lib/server/handlers/users';
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
	id: z.coerce.number().min(1),
	email: z.string().email().max(50),
	name: z.string().max(30)
});

export async function load(event) {
	const slug = event.params.slug;
	try {
		if (slug === 'new') {
			return {
				user: {
					email: '',
					name: '',
					role: 'user',
					active: true
				},
				slug
			};
		} else {
			const user = await getUser(slug);
			console.log('===> load user', user);
			if (!user) {
				return { error: 'User not found' };
			}
			return { user, slug };
		}

	} catch (error) {
		errorLogger(error.message, event, 'error getting users');
		return { error: 'Error getting users' };
	}
}

export const actions = {
	createuser: async (event) => {
		const data = await event.request.formData();
		const { name, email, role, active } = Object.fromEntries(data);
		console.log('===> createuser', name, email, role, active);
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
			errorLogger(error.message, event, 'error creating user');
			return fail(400, { name, role, email, active, error: true, message: errormessages });
		}
	},

	updateuser: async (event) => {
		const data = await event.request.formData();
		const { id, name, email, role, active } = Object.fromEntries(data);
		console.log('===> updateuser', id, name, email, role, active);
		const isActive = active === 'true' || active === 'on';
		try {
			const parsedUser = userUpdateSchema.parse({
				id,
				email,
				name,
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
			errorLogger(error.message, event, 'error updating user');
			return fail(400, { name, role, email, active, error: true, message: errormessages });
		}
	},

	deleteuser: async (event) => {
		const data = await event.request.formData();
		const { id } = Object.fromEntries(data);
		try {
			await deleteUser(id);
			return { success: true, message: 'User deleted' };
		} catch (error) {
			errorLogger(error, event, 'error deleting user');
			return fail(400, { id, error: true, message: error.message });
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
