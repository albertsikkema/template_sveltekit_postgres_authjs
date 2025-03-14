import { db } from '$lib/server/db/index'; // Drizzle instance
import { users } from '$lib/server/db/schema';
import { ValidationError, UserAlreadyExistsError } from '$lib/errorclasses';
import { eq } from 'drizzle-orm';
import { logoutUser } from '$lib/authhelpers';

/** Get all users */
export const getUsers = async () => {
	try {
		return await db.query.users.findMany();
	} catch (error) {
		throw new Error(`query error: ${error.message}`);
	}
};

/** Get a single user by email */
export const getUser = async (email) => {
	try {
		return await db.query.users.findFirst({
			where: eq(users.email, email)
		});
	} catch (error) {
		throw new Error(`query error: ${error.message}`);
	}
};

/** Create a new user */
export const createUser = async ({ email, name, role, active }) => {
	const userExists = await getUser(email);
	if (userExists) {
		throw new UserAlreadyExistsError('User already exists');
	}
	try {
		const [user] = await db.insert(users).values({ email, name, role, active }).returning(); // Return inserted record
		return user;
	} catch (error) {
		throw new ValidationError(`validation error: ${error.message}`);
	}
};
/** Update a user's details */
export const updateUser = async ({ email, name, role, active }) => {
	try {
		const [updatedUser] = await db
			.update(users)
			.set({ name, role, active })
			.where(eq(users.email, email))
			.returning(); // Return updated user

		await logoutUser(email); // Force logout user if they are active
		return updatedUser;
	} catch (error) {
		throw new Error(error);
	}
};

/** Delete a user */
export const deleteUser = async (email) => {
	try {
		const [deletedUser] = await db.delete(users).where(eq(users.email, email)).returning(); // Return deleted user
		await logoutUser(email); // Force logout user if they are active
		return deletedUser;
	} catch (error) {
		throw new Error(error);
	}
};
