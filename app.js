// app.js

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const advaitRoutes = require('./routes/advaitroutes');
const User = require('./models/User');

const app = express();
const port = process.env.PORT || 8000;

// View engine setup
app.set('view engine', 'ejs');

// Hard-coded configuration (no .env file needed)
// Username: AdvaitAdmin
// Password: Advait@0104 (URL‑encoded as Advait%400104)
// Cluster Host: cluster0.vubggz8.mongodb.net
const dbURI = 'mongodb+srv://AdvaitAdmin:Advait%400104@cluster0.vubggz8.mongodb.net/Advait?retryWrites=true&w=majority';
const sessionSecret = 'thisIsASecretKey123';

// Connect to MongoDB
mongoose.connect(dbURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Session store setup
const store = new MongoDBStore({
  uri: dbURI,
  collection: 'mySessions',
});

// Catch session store errors
store.on('error', error => console.error('❌ Session store error:', error));

// Static files & parsers
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store,
  cookie: { maxAge: 600000 },
}));

// Routes
app.get('/', (req, res) => {
  res.render('landing', { title: 'Welcome to Advait' });
});
app.use('/', advaitRoutes);

// Start server
const server = app.listen(port, () => console.log(`🚀 Server running on port ${port}`));

// Graceful shutdown
const cleanup = () => {
  console.log('🛑 Shutting down, clearing sessions...');
  server.close(() => {
    store.clear(err => {
      if (err) console.error('❌ Error clearing sessions:', err);
      else console.log('✅ Sessions cleared.');
      process.exit(0);
    });
  });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
