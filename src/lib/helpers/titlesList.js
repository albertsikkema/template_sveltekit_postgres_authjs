export const succesMessages = [
	'we prevailed',
	'victory is ours',
	'triumph at last',
	'success has a new name',
	'mission accomplished',
	'we conquered the challenge',
	'the tides turned in our favor',
	'a resounding success',
	'we’ve emerged victorious',
	'we forged ahead against all odds',
	'achievement unlocked',
	'our hard work paid off',
	'we’ve done it again',
	'another feather in our cap',
	'a glorious win'
];

export function getSuccessMessage() {
	const randomIndex = Math.floor(Math.random() * succesMessages.length);
	const message = succesMessages[randomIndex];
	// make sure first letter is capitalized
	return message.charAt(0).toUpperCase() + message.slice(1);
}
