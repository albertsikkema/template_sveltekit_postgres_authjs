import { errorLogger } from '$lib/logging/errorLogger.js';
import { getUser, createUser, updateUser, deleteUser } from '$lib/server/handlers/users';
import { logoutUser } from '$lib/authhelpers.js';
import { fail } from '@sveltejs/kit';
import { users } from '$lib/server/db/schema';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { ZodError, z } from 'zod';
import { UserAlreadyExistsError } from '$lib/errorclasses.js';
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
		const isActive = active === 'true' || active === 'on';
		try {
			const parsedUser = userInsertSchema.parse({ email, name, role, active: isActive });
			await createUser(parsedUser);
			return { success: true, message: 'User created' };
		} catch (error) {
			let errormessages = {};
			if (error instanceof UserAlreadyExistsError) {
				errormessages['email'] = error.message;
			} else if (error instanceof ZodError) {
				error.errors.forEach((error) => {
					errormessages[error.path[0]] = error.message; // Use the field name as key
				});
			} else {
				errormessages['error'] = error.message;
			}
			console.log('errormessages', errormessages);
			errorLogger(error.message, event, 'error creating user');
			return fail(400, { name, role, email, active, errors: errormessages });
		}
	},

	updateuser: async (event) => {
		const data = await event.request.formData();
		const { id, name, email, role, active } = Object.fromEntries(data);
		const isActive = active === 'true' || active === 'on';
		try {
			const parsedUser = userUpdateSchema.parse({
				id,
				email,
				name,
				role,
				active: isActive
			});
			await updateUser(parsedUser);
			return { success: true, message: 'User updated' };
		} catch (error) {
			let errormessages = {};
			if (error instanceof ZodError) {
				error.errors.forEach((error) => {
					errormessages[error.path[0]] = error.message; // Use the field name as key
				});
			} else {
				errormessages['error'] = error.message;
			}
			errorLogger(error.message, event, 'error updating user');
			return fail(400, { name, role, email, active, errors: errormessages });
		}
	},

	deleteuser: async (event) => {
		const data = await event.request.formData();
		const { id } = Object.fromEntries(data);
		try {
			await deleteUser(id);
			return { success: true, message: 'User deleted' };
		} catch (error) {
			let errormessages = { error: error.message };
			errorLogger(error.message, event, 'error deleting user');
			return fail(400, { id, errors: errormessages });
		}
	},

	// does not need elaborate error handling for now
	// if user is not found, they are not logged in
	loguserout: async (event) => {
		const data = await event.request.formData();
		const { email } = Object.fromEntries(data);
		await logoutUser(email);
		return { success: true, message: 'User is logged out' };
	}
};
