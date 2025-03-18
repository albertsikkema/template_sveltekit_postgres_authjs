export function determineage(date) {
	const today = new Date();
	const created = new Date(date);
	const diffTime = Math.abs(today - created);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
}
