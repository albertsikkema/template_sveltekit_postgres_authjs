import { faker } from '@faker-js/faker';
import pg from 'pg';
const { Client } = pg;
// import sql from 'sql-template-strings'; // For SQL template strings

const client = new Client({
	user: 'root', // your PostgreSQL username
	host: 'localhost', // your PostgreSQL host
	database: 'local', // your PostgreSQL database name
	password: 'mysecretpassword', // your PostgreSQL password
	port: 5432 // PostgreSQL port (default is 5432)
});

client.connect();

async function seedDatabase() {
	try {
		const userIds = [];
		const knownEmail = 'mail@albertsikkema.com';
		let knownUserExists = true;
		const numberOfTickets = 2000;
		const numberOfUsers = 10;

		// Step 0: Check if known user exists
		const checkKnownUserQuery = `
      SELECT id FROM users WHERE email = $1
    `;
		const checkKnownUser = await client.query(checkKnownUserQuery, [knownEmail]);
		if (checkKnownUser.rows.length > 0) {
			console.log('Known user already exists');
			userIds.push(checkKnownUser.rows[0].id);
		} else {
			console.log('Known user does not exist');
			knownUserExists = false;
		}

		if (!knownUserExists) {
			// Step 1: Seed Users
			// Insert the known user
			const knownUserQuery = `
      INSERT INTO users (email, name, role, active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

			const knownUser = {
				email: knownEmail,
				name: faker.person.firstName(),
				role: 'admin', // Set known user role
				active: true,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};

			const result = await client.query(knownUserQuery, [
				knownUser.email,
				knownUser.name,
				knownUser.role,
				knownUser.active,
				knownUser.created_at,
				knownUser.updated_at
			]);
			userIds.push(result.rows[0].id);
		}

		// Seed additional random users
		for (let i = 0; i < numberOfUsers; i++) {
			const user = {
				email: faker.internet.email(),
				name: faker.person.firstName(),
				role: 'user', // Default role
				active: true,
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};

			const userQuery = `
        INSERT INTO users (email, name, role, active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `;

			const result = await client.query(userQuery, [
				user.email,
				user.name,
				user.role,
				user.active,
				user.created_at,
				user.updated_at
			]);
			//   console.log('Result:', result.rows[0].id);
			userIds.push(result.rows[0].id);
		}

		// Step 2: Seed Tickets

		for (let i = 0; i < numberOfTickets; i++) {
			const ticket = {
				title: faker.lorem.sentence(),
				description: faker.lorem.paragraph(),
				created_by: faker.number.int({ min: userIds[0], max: userIds[userIds.length - 1] }),
				assigned_to: faker.number.int({ min: userIds[0], max: userIds[userIds.length - 1] }),
				status: 'open', // Default status
				images: [], // Empty array for images
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString()
			};

			const ticketQuery = `
        INSERT INTO tickets (title, description, created_by, assigned_to, status, images, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;

			await client.query(ticketQuery, [
				ticket.title,
				ticket.description,
				ticket.created_by,
				ticket.assigned_to,
				ticket.status,
				ticket.images,
				ticket.created_at,
				ticket.updated_at
			]);
		}
	} catch (err) {
		console.error(err.stack);
	} finally {
		await client.end();
	}
}

seedDatabase();
