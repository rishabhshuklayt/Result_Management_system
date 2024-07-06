const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/ResultManagementSystemDB')

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));

db.once('open', function() {
  console.log('Connected to MongoDB');
});

