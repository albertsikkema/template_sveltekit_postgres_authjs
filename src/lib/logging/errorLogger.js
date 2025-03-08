// Note: This is a helper function for logging errors in server routes
// besides the error, it also logs parts of the event and a message

import { getAllUrlParams, parseMessage, parseTrack } from '$lib/logging/logginghelpers';
import { DOMAIN } from '$env/static/private';
import logger from '$lib/logging/logger';

// Logs an error with additional event details
export async function errorLogger(error, event, msg) {
  const logMessage = await loggerContext(event);
  logger.error({ ...logMessage, error, msg });
}

// Gathers logging context based on the incoming request event
export async function loggerContext(event) {
  // Handle errors
  const error = event?.locals?.error;
  const errorId = event?.locals?.errorId;
  const errorStackTrace = event?.locals?.errorStackTrace;

  // Get URL params
  let urlParams = {};
  if (event?.url?.search) {
    urlParams = await getAllUrlParams(event?.url?.search);
  }

  // Get message events
  let messageEvents = {};
  if (event?.locals?.message) {
    messageEvents = await parseMessage(event?.locals?.message);
  }

  // Get track events
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
      referer = undefined; // Handle invalid referer URLs safely
    }
  }

  // Build the logging context
  const context = {
    method: event.request.method,
    domain: DOMAIN,
    host: event.url.host,
    path: event.url.pathname,
    user: event?.locals?.session?.user?.email || 'anonymous',
    referer,
    ...urlParams,
    ...messageEvents,
    ...trackEvents,
    ...(error !== undefined && { error }), // Add error only if it's defined
    ...(errorId !== undefined && { errorId }),
    ...(errorStackTrace !== undefined && { errorStackTrace }),
  };

  return context;
}