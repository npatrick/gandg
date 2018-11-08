'use strict';

const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const path = require('path');

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

app.use('/', express.static(path.join(__dirname, '../client')));

module.exports = app;
