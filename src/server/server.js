'use strict';

const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
const validator = require('validator');
const logger = require('./controller/logger');
const helperFn = require('./controller/helperFn');

const app = express();

// http logging
app.use(morgan('tiny', {
	skip: function (req, res) {
		return res.statusCode < 400
	}, stream: process.stderr
}));
app.use(morgan('tiny', {
	skip: function (req, res) {
		return res.statusCode >= 400
	}, stream: process.stdout
}));

// NOTE: disabling line below to serve this API not providing static files
app.use('/', express.static(path.join(__dirname, '../client')));

const whitelist = [
	'http://gandgconstruction.site', 
	'http://www.gandgconstruction.site', 
	'https://gandgconstruction.site', 
	'https://www.gandgconstruction.site', 
	'http://gandgconstruction.herokuapp.com', 
	'https://gandgconstruction.herokuapp.com'
];
const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error(`Not allowed by CORS with origin:' ${origin}`));
		}
	},
	optionsSuccessStatus: 200
};

app.get('/', cors(corsOptions), (req, res) => { res.status(200).send('Ok!')});

app.options('/sendemail', cors(corsOptions));
app.post('/sendemail', cors(corsOptions), (req, res, next) => {
	let tempMessage, tempName, tempEmailAddress, tempPhone, emailBody, emailSubject;
	try {
		let { message, name, email, phone } = req.body;

		let cleanMessage = helperFn.sanitize(message),
				cleanName = helperFn.sanitize(name),
				cleanEmail = helperFn.sanitize(email),
				cleanPhone = helperFn.sanitize(phone);

	  tempMessage = validator.isAscii(cleanMessage) ? cleanMessage : '';
	  tempName = cleanName.length < 50 ? cleanName : null;
	  tempEmailAddress = cleanEmail;
	  tempPhone = validator.isAscii(cleanPhone) && cleanPhone.length < 25 ? cleanPhone : null;

	  if (!helperFn.validateEmail(tempEmailAddress)) {
	  	logger.debug('Unaccepted email:', tempEmailAddress);
	  	return res.status(200).send('Invalid email');
	  }
	  // Does Message input exist
	  if (tempMessage.length !== 0) {
	  	if (!tempName || !tempPhone) {
	  		throw 'Unaccepted input(s)';
	  	}
	  	let neatMessage = validator.escape(cleanMessage);
  		emailBody = `${neatMessage}\n\nName: ${tempName}\nPhone: ${tempPhone}\n\n - Sent from G&G site`;
	  }
	} catch (err) {
		if (err.message) {
			logger.error('Caught error in /sendmail email content validation && makeup with message ===>', err.message);
		} else {
			logger.error('Caught error in /sendmail email content validation && makeup:', err);
		}
		return res.status(422).send('Something went wrong :(');
	}
	// set the content for email subject
	if (tempMessage.length) {
		emailSubject = '[G&G Construction] Perspective Client';
	}

 	let dataBody = {
 		from: tempEmailAddress,
 		to: 'admin@gandgconstruction.site',
 		subject: emailSubject,
 		text: emailBody
 	};
 	let SMSBody = {
 		from: 'admin@gandgconstruction.site',
 		to: 'forwarding@gandgconstruction.site',
 		subject: emailSubject,
 		text: `[G&G Site] New email from ${tempName} @ ${tempPhone}`
 	};

  transporter.sendMail(dataBody)
  	.then(function (info) {
  		transporter.sendMail(SMSBody)
				.then(function (info) {
					logger.info('Forwarding message sent!');
				})
				.then(function (info) {
			  	logger.info('Message successful for /sendemail');
			  	res.status(200).send('Message sent!');
				})
	  })
  	.catch(next);
});

// handle Not Found
app.use(function (req, res, next) {
	logger.error('404 page requested');
  res.status(404).sendFile(path.join(__dirname, '../client/404.html'));
});
// handle error
app.use(function (err, req, res, next) {
	// create error handler here
	if (err.message) {
		logger.error('%s :: %s => 500 in our server with message [%s]', req.method, req.url, err.message, err);
	} else {
		logger.error('500 in our server:', err);
	}
  res.status(500).send('Something broke!');
});


module.exports = app;
