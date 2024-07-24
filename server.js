const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;
const session = require('express-session');
const app = express();
require('dotenv').config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

// socket.io is installed

app.use(cors());

// Serve up static assets (usually on heroku)


  app.use(express.static('./build'));
  console.log('enable static routes');
  app.get("*", (req, res) => {
    res.sendFile(path.resolve("./build", "index.html"));
  });


// MiddleWare
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

//app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(cookieParser('keyboard cat'));

const passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());

//add routes for api calls

// Send every request to the React app
// Define any API routes before this runs



// Connect to the Mongo DB


app.listen(PORT, function () {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
