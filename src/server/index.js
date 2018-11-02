'use strict'

const PORT = process.env.PORT || 3000;
const app = require('./server');
// const logger = require('./controller/logger.js');

app.listen(PORT, () => {
  // logger.info('Listening on port ' + PORT);
  console.log('Listening on port ' + PORT);
});
