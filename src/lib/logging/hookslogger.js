// Inspired by: https://jeffmcmorris.medium.com/awesome-logging-in-sveltekit-6afa29c5892c
import { DOMAIN } from '$env/static/private';
import logger from '$lib/logging/logger';
import { getAllUrlParams, parseMessage, parseTrack } from '$lib/logging/logginghelpers';

export default async function hooksLogger({ statusCode, event }) {
	try {
		let logLevel = 'info';
		if (statusCode >= 400) {
			logLevel = 'error';
		}

		// Handle errors
		const error = event?.locals?.error;
		const errorId = event?.locals?.errorId;
		const errorStackTrace = event?.locals?.errorStackTrace;

		// Get URL params
		let urlParams = {};
		if (event?.url?.search) {
			urlParams = await getAllUrlParams(event?.url?.search);
		}

		// Get message
		let messageEvents = {};
		if (event?.locals?.message) {
			messageEvents = await parseMessage(event?.locals?.message);
		}

		// Get track
		let trackEvents = {};
		if (event?.locals?.track) {
			trackEvents = await parseTrack(event?.locals?.track);
		}

		// Process referer header
		let referer = event.request.headers.get('referer') || undefined;
		if (referer) {
			try {
				const refererUrl = new URL(referer);
				const refererHostname = refererUrl.hostname;
				if (refererHostname === 'localhost' || refererHostname === DOMAIN) {
					referer = refererUrl.pathname;
				}
			} catch {
				referer = undefined; // Safely handle invalid referer URLs
			}
		}

		const logData = {
			method: event.request.method,
			domain: DOMAIN,
			host: event.url.host,
			path: event.url.pathname,
			status: statusCode,
			timeInMs: event?.locals?.startTimer ? Date.now() - event.locals.startTimer : undefined,
			user: event?.locals?.session?.user?.email || 'anonymous',
			referer,
			...urlParams,
			...messageEvents,
			...trackEvents,
			...(error !== undefined && { error }), // Add error only if it's defined
			...(errorId !== undefined && { errorId }),
			...(errorStackTrace !== undefined && { errorStackTrace })
		};

		// Log the data using the appropriate log level
		logger[logLevel](logData);
	} catch (error) {
		throw new Error(`Error in hooksLogger: ${JSON.stringify(error)}`);
	}
}
