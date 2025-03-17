import { sql } from 'drizzle-orm';
import {
	pgTable,
	boolean,
	timestamp,
	text,
	primaryKey,
	integer,
	pgEnum,
	serial
} from 'drizzle-orm/pg-core';
import crypto from 'crypto'; // Import the crypto module for UUID generation

// Define enums for the role and status columns
export const roleEnum = pgEnum('role', ['admin', 'user']);
export const statusEnum = pgEnum('status', ['open', 'closed']);

// Allowed users table
export const users = pgTable('users', {
	id: serial().primaryKey(), // Auto-incrementing primary key
	email: text('email').unique(), // Primary key
	name: text('name'),
	role: roleEnum('role').default('user'), // Defaults to 'user'
	active: boolean('active').default(true), // Defaults to being active
	created_at: timestamp({ withTimezone: true, mode: 'string' })
		.default(sql`(now() AT TIME ZONE 'utc'::text)`)
		.notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' })
		.default(sql`(now() AT TIME ZONE 'utc'::text)`)
		.notNull()
		.$onUpdate(() => sql`(now() AT TIME ZONE 'utc'::text)`)
});

// Tickets table
export const tickets = pgTable('tickets', {
	id: serial().primaryKey(), // Auto-incrementing primary key
	title: text('title').notNull(),
	description: text('description'),
	created_by: integer('created_by')
		.references(() => users.id)
		.notNull(),
	assigned_to: integer('assigned_to').references(() => users.id),
	status: statusEnum('status').notNull().default('open'),
	images: text('images')
		.array()
		.default(sql`ARRAY[]::text[]`),
	created_at: timestamp({ withTimezone: true, mode: 'string' })
		.default(sql`(now() AT TIME ZONE 'utc'::text)`)
		.notNull(),
	updated_at: timestamp({ withTimezone: true, mode: 'string' })
		.default(sql`(now() AT TIME ZONE 'utc'::text)`)
		.notNull()
		.$onUpdate(() => sql`(now() AT TIME ZONE 'utc'::text)`)
});

export const auth_users = pgTable('auth_user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name'),
	email: text('email').unique(),
	emailVerified: timestamp('emailVerified', { mode: 'date' }),
	image: text('image')
});

export const auth_accounts = pgTable(
	'auth_account',
	{
		userId: text('userId')
			.notNull()
			.references(() => auth_users.id, { onDelete: 'cascade' }),
		type: text('type').notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	(account) => [
		{
			compoundKey: primaryKey({
				columns: [account.provider, account.providerAccountId]
			})
		}
	]
);

export const auth_sessions = pgTable('auth_session', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => auth_users.id, { onDelete: 'cascade' }),
	expires: timestamp('expires', { mode: 'date' }).notNull()
});

export const auth_verificationTokens = pgTable(
	'auth_verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: timestamp('expires', { mode: 'date' }).notNull()
	},
	(verificationToken) => [
		{
			compositePk: primaryKey({
				columns: [verificationToken.identifier, verificationToken.token]
			})
		}
	]
);

export const auth_authenticators = pgTable(
	'auth_authenticator',
	{
		credentialID: text('credentialID').notNull().unique(),
		userId: text('userId')
			.notNull()
			.references(() => auth_users.id, { onDelete: 'cascade' }),
		providerAccountId: text('providerAccountId').notNull(),
		credentialPublicKey: text('credentialPublicKey').notNull(),
		counter: integer('counter').notNull(),
		credentialDeviceType: text('credentialDeviceType').notNull(),
		credentialBackedUp: boolean('credentialBackedUp').notNull(),
		transports: text('transports')
	},
	(authenticator) => [
		{
			compositePK: primaryKey({
				columns: [authenticator.userId, authenticator.credentialID]
			})
		}
	]
);
