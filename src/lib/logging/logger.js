// src/lib/logging/logger.ts

import pino from 'pino';
import { browser } from '$app/environment';
import { LOG_ENV, LOG_LEVEL, AXIOM_DATASET, AXIOM_TOKEN } from '$env/static/private';

// Set the default log level
const defaultLogLevel = LOG_LEVEL || 'info';

let pinoOptions;

if (LOG_ENV === 'development') {
	pinoOptions = {
		level: defaultLogLevel,
		transport: {
			targets: [
				{
					target: 'pino-pretty',
					options: {
						translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l',
						ignore: 'hostname,pid,v',
						colorize: true,
						levelFirst: true,
						messageFormat: '{msg} {json}',
						errorLikeObjectKeys: ['err', 'error']
					}
				},
				{
					target: '@axiomhq/pino',
					options: {
						dataset: AXIOM_DATASET,
						token: AXIOM_TOKEN
					}
				}
			]
		}
	};
} else if (LOG_ENV === 'production') {
	pinoOptions = {
		level: defaultLogLevel,
		transport: {
			targets: [
				{
					target: '@axiomhq/pino',
					options: {
						dataset: AXIOM_DATASET,
						token: AXIOM_TOKEN
					}
				},
				{
					target: 'pino/file',
					options: {
						destination: 1 // standard out
					}
				}
			]
		}
	};
}

// Create the logger instance
const logger = pino(pinoOptions);

// Define the method for setting log levels dynamically
const extendedLogger = Object.assign(logger, {
	setLogLevel: (env) => {
		let logLevel = defaultLogLevel;

		switch (env) {
			case 'development':
				logLevel = 'debug';
				break;
			case 'production':
				logLevel = browser ? 'silent' : 'info';
				break;
			default:
				logLevel = 'silent';
				break;
		}

		logger.level = logLevel;
		return logLevel;
	}
});

export default extendedLogger;
