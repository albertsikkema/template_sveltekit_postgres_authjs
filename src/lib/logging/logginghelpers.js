// getAllUrlParams.ts
export async function getAllUrlParams(url) {
	console.log('getAllUrlParams', url);
	let paramsObj= {};

	try {
		if (!url) return {}; // If no params, return empty object

		url = url.startsWith('?') ? url.slice(1) : url; // Remove leading '?' if present

		paramsObj = Object.fromEntries(new URLSearchParams(url));

		console.log('paramsObj:', paramsObj);
	} catch (error) {
		console.log('error:', error);
	}

	return paramsObj;
}
// parseMessage.ts
export async function parseMessage(
	message
) {
	let messageObj = {};

	try {
		if (message) {
			if (typeof message === 'string') {
				messageObj = { message };
			} else {
				messageObj = message;
			}
		}

		console.log('messageObj:', messageObj);
	} catch (error) {
		console.log('error:', error);
	}

	return messageObj;
}


// parseTrack.ts
export async function parseTrack(
	track
) {
	let trackObj = {};

	try {
		if (track) {
			if (typeof track === 'string') {
				trackObj = { track };
			} else {
				trackObj = track;
			}
		}
	} catch (error) {
		console.log('error:', error);
	}

	return trackObj;
}