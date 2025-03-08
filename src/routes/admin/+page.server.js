import { errorLogger } from '$lib/logging/errorLogger.js';
import { getUsers, createUser, updateUser, deleteUser } from '$lib/server/handlers/users';
import { logoutUser } from '$lib/authhelpers.js';
import { fail } from '@sveltejs/kit';


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

        try {
            const isActive = active === 'true' || active === 'on';
            const userRole = role;
            const result = await createUser(email, name, userRole, isActive);
            console.log('===> createuser result', result);
            return { success: true, message: 'User created' };
        } catch (error) {
            errorLogger(error, event, 'error creating user');
            return fail(400, { name, role, email, active, error: true, message: error.message });
        }
    },

    updateuser: async (event) => {
        const data = await event.request.formData();
        const { name, email, role, active } = Object.fromEntries(data);

        try {
            const isActive = active === 'true' || active === 'on';
            const userRole = role;

            const result = await updateUser(email, name, userRole, isActive);
            console.log('===> updateuser result', result);
            return { success: true, message: 'User updated' };
        } catch (error) {
            errorLogger(error, event, 'error updating user');
            return fail(400, { name, role, email, active, error: true, message: error.message });
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