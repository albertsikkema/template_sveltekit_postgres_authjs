import crypto from 'crypto';

export function hashUserData(string) {
	// get the current date in YYYY-MM-DD format to consider daily uniqueness
	const currentDate = new Date();
	const dateString = currentDate.toISOString().split('T')[0]; // gets the date part in yyyy-mm-dd

	// combine the ip, user agent, and the date
	const dataToHash = `${string}|${dateString}`;

	// create a sha256 hash
	const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

	return hash;
}
