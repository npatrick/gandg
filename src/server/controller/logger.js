const { createLogger, format, transports } = require('winston');
const level = process.env.LOG_LEVEL || 'debug';

// Winston object
const logger = createLogger({
	format: format.combine(
		format.splat(),
		format.simple()
	),
	transports: [
		new transports.Console({
			level: level,
			timestamp: function () {
				return (new Date()).toISOString();
			}
		}),
		new transports.File({ filename: 'error.log', level: 'error' })
	]
});

module.exports = logger;
