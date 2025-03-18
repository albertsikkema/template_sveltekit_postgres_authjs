import { db } from '$lib/server/db/index'; // Drizzle instance
import { users, lower } from '$lib/server/db/schema';
import { ValidationError, UserAlreadyExistsError } from '$lib/errorclasses';
import { eq, count, sql, like, or, asc, desc, ilike } from 'drizzle-orm';
import { logoutUser } from '$lib/authhelpers';

function maxPage(total, limit) {
	const maxPage = Math.ceil(total / limit); // Zero-based pagination
	return maxPage >= 0 ? maxPage : 0;
}

/** Get all users */
export const getUsers = async (params = {}) => {
	let { page, search, orderby, order } = params;

	const limit = 10;
	if (!page | !Number(page) | (page < 1)) {
		page = 1;
	}
	try {
		let baseQuery = db.select().from(users);

		// Apply search filter if search is provided
		if (search) {
			baseQuery = baseQuery.where(
				or(like(lower(users.email), `%${search.toLowerCase()}%`), ilike(users.name, `%${search}%`))
			);
		}

		// Create two separate queries:
		// 1️⃣ Query for total count (without limit & offset)
		const totalQuery = db.select({ count: count() }).from(users);
		if (search) {
			totalQuery.where(
				or(like(lower(users.email), `%${search.toLowerCase()}%`), ilike(users.name, `%${search}%`))
			); // apply search filter
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
			orderby = 'email';
		}
		if (!order) {
			order = 'asc';
		}

		// Define sorting function correctly
		const orderDirection = order.toLowerCase() === 'asc' ? asc : desc;
		const orderColumn = users[orderby];

		// 2️⃣ Query for paginated results (with limit & offset)
		const resultUsers = await baseQuery
			.orderBy(orderDirection(orderColumn)) // ✅ Correctly apply sorting
			.limit(limit)
			.offset(offset);

		console.log('resultUsers', resultUsers);
		// Return result
		return {
			users: resultUsers,
			total: total[0]?.count || 0,
			currentpage: page,
			maxpage: maxPage(total[0]?.count, limit)
		};
	} catch (error) {
		throw new Error(`query error: ${error.message}`);
	}
};

/** Get a single user by email */
export const getUser = async (id) => {
	try {
		const user = await db.query.users.findFirst({
			where: eq(users.id, id)
		});
		return user;
	} catch (error) {
		throw new Error(`query error: ${error.message}`);
	}
};

// get user by email to check if user exists
export const getUserByEmail = async (email) => {
	try {
		const user = await db.query.users.findFirst({
			where: eq(users.email, email)
		});
		return user;
	} catch (error) {
		throw new Error(`query error: ${error.message}`);
	}
};

/** Create a new user */
export const createUser = async ({ email, name, role, active }) => {
	const userExists = await getUserByEmail(email);
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
export const updateUser = async ({ id, email, name, role, active }) => {
	try {
		const [updatedUser] = await db
			.update(users)
			.set({ email, name, role, active })
			.where(eq(users.id, id))
			.returning(); // Return updated user

		await logoutUser(email); // Force logout user if they are active
		return updatedUser;
	} catch (error) {
		throw new Error(error);
	}
};

/** Delete a user */
export const deleteUser = async (id) => {
	// find user by id
	const user = await getUser(id);
	if (!user) {
		throw new Error('User not found');
	}

	try {
		await logoutUser(user.email); // Force logout user if they are active
		const [deletedUser] = await db.delete(users).where(eq(users.email, user.email)).returning(); // Return deleted user
		return deletedUser;
	} catch (error) {
		throw new Error(error);
	}
};
