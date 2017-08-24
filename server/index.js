var authentication = require( './authentication/authentication.js' );
var cookies = require( './authentication/cookies.js' );
var bodyParser = require( 'body-parser' );
var db = require('../database-mongo/queries');
var express = require( 'express' );
var path = require('path');
var request = require('request');
var passport = require('passport');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var TwitterStrategy = require('passport-twitter').Strategy;

var twitterOptions;
var sessionSecret;
if (process.env.NODE_ENV === 'production') {
  twitterOptions = {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL
  };
  sessionSecret = process.env.SESSION_SECRET;
} else {
  twitterOptions = require('./config/twitter.config.js');
  sessionSecret = require('./config/session.config.js');
}

passport.use(new TwitterStrategy(
  twitterOptions,
  function(token, tokenSecret, profile, done) {
    db.findOneAndUpdate(profile, function(err, user) {
      if (err) { return done(err); }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.twitter_id);
  // result of this is req.session.passport.user = user.twitter_id
});

passport.deserializeUser(function(id, done) {
  db.findUserById(id, (err, user) => {
    done(err, user[0]);
  });
  // Attaches the loaded user object to the request as req.user
});

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
  secret: sessionSecret,
  store: new MongoDBStore({
    uri: process.env.MONGODB_URI || 'mongodb://localhost/friendzone2',
    collection: 'sessions'
  }),
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../react-client/dist')));

app.get('/auth', (req, res) => {
  if (req.session.passport) {
    res.status(200).send(JSON.stringify(true));
  } else {
    res.status(200).send(JSON.stringify(false));
  }
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', passport.authenticate('twitter', 
  {
    successRedirect: '/profile',
    failureRedirect: '/login'
  }
));

app.get('/logout', function(req, res) {
  req.logout();
  console.log('****** User logged out');
  res.redirect('/login');
});

app.get('/user', ( req, res ) => {
  if (req.session.passport) {
    res.status(200).send(JSON.stringify(req.user));
  } else {
    res.status(200).send(JSON.stringify(false));
  }
});

app.post('/friendProfile', ( req, res ) => {
  db.getProfile( req.body.username, ( profile ) => {
    res.status( 200 ).send( JSON.stringify( profile ) );
  } );
});

// app.get( '/friendProfile', ( req, res ) => {
//   cookies.verifySession( req, res, ( valid ) => {
//     if ( valid ) {
//       db.getProfile( req.body.username, ( profile ) => {
//         res.status( 200 ).end( JSON.stringify( profile ) );
//       } );
//     } else {
//       res.status( 200 ).end( JSON.stringify( false ) );
//     }
//   } );
// } );

app.get('/matches', ( req, res ) => {
  // cookies.verifySession( req, res, ( valid ) => {
  //   if ( valid ) {
  //     db.getFriends( req.session.username, ( matches ) => {
  //       res.status( 200 ).send( JSON.stringify( matches ) );
  //     } );
  //   } else {
  //     res.status( 200 ).end( JSON.stringify( false ) );
  //   }
  // } );
  var user_id = 893651977338368000;
  var options = {
    url: 'https://api.twitter.com/1.1/friends/ids.json?cursor=-1&user_id=' + user_id + '&count=5000',
    headers: {
      'User-Agent': 'request'
    },
    oauth: {
      consumer_key: 'ihlnJQ6b0BYrVY2Kk9T89Uq5W',
      consumer_secret: 'eNQifh5ar7UkOWH34YIiw9c8x7EQuWHWCzPc5iWzip1kH9N7uW',
      token: '893651977338368000-h6GVhlnZyv6XhUH9FBLCntRrDuBEoAv',
      token_secret: 'AjVJvPMmhXVC3do1XznwKdHTKInCTKrxvDKzl1XQe0C8n'
    }
  };
  var resSend = (error, response) => {
    if (response) {
      var body = JSON.parse(response.body);
      console.log(body.ids);
      // var parsedResBody = JSON.parse(response.body);
      // var usernames = parsedResBody.length ? parsedResBody.map((userObj) => {
      //   return userObj.screen_name;
      // }) : [];
      // res.send({usernames});
    }
  };
  request(options, resSend);
} );

app.get('/messages', ( req, res ) => {
  // cookies.verifySession( req, res, ( valid ) => {
    // if ( req.body.user ) {
    //   db.getMessages( req.session.username, ( messages ) => {
    //     res.status( 200 ).send( JSON.stringify( messages ) );
    //   } );
    // } else {
      // res.status( 200 ).end( JSON.stringify( false ) );
res.sendFile(path.join(__dirname, '../react-client/dist/index.html'));    // }
  // } );
} );

app.post('/friendMessages', (req, res) => {
  console.log('In friend Messages')
  db.getMessages( req.body.username, req.body.friend, ( messages ) => {
    res.status( 200 ).send( JSON.stringify( messages ) );
  });
});

app.post('/signup', ( req, res ) => {
  var newUser = {
    username: req.body.username,
    password: authentication.generateHash(req.body.password),
    fullname: req.body.fullname,
    email: req.body.email,
  };

  db.postUser( newUser, req.cookies.takoyaki = cookies.bakeCookies(), ( valid ) => {
    if ( valid ) {
      res.cookie( 'takoyaki', req.cookies.takoyaki ).status( 201 ).end( JSON.stringify( true ) );
    } else {
      res.status( 201 ).end( JSON.stringify( false ) );
    }
  } );
} );

app.post('/login', ( req, res ) => {
  db.getHash( req.body.username, ( password ) => {
    if ( authentication.authenticate( req.body.password, password ) ) {
      db.getProfile( req.body.username, ( user ) => {
        res.cookie( 'takoyaki', user.cookies ).status( 201 ).end( JSON.stringify( true ) );
      } );
    } else {
      res.status( 201 ).end( JSON.stringify( false ) );
    }
  } );
} );

app.post('/test', ( req, res ) => {
  db.postTestResults( req.session.username, req.body.testResults, allUsers => {
    var matchesList = [];
    allUsers.forEach(user => {
      if (user.username !== req.session.username && mostCompatible[req.body.testResults].indexOf(user.testResults) !== -1) {
        var friend = {
          fusername: user.username,
          ffullname: user.fullname,
          femail: user.email,
          flocation: user.location,
          fhobbies: user.hobbies,
          fabout: user.blog,
          fpic: user.img
        };
        matchesList.push(friend);
      }
    });
    db.postMatches(req.session.username, matchesList, (data) => {
      res.status( 201 ).send(data);
    })
  })
});

app.post('/matches', ( req, res ) => {
  db.postGetMatches( req.session.username, req.body.numberToReturn, req.body.maxFriends, ( results ) => {
    res.status( 201 ).send( results );
  } );
} );

app.post('/updateUser', ( req, res ) => {
  cookies.verifySession( req, res, ( valid ) => {
    if ( valid ) {
      db.postUpdateUser( {
        username: req.session.username,
        location: req.body.location,
        fullname: req.body.name,
        hobbies: req.body.hobbies,
        blog: req.body.aboutme
      }, ( matches ) => {
        res.status( 200 ).end( JSON.stringify( true ) );
      } );
    } else {
      res.status( 200 ).end( JSON.stringify( false ) );
    }
  } );
} );

app.post('/message', ( req, res ) => {
  cookies.verifySession( req, res, ( valid ) => {
    if ( valid ) {
      console.log('valid', req.session.username, req.body.message);
      db.postMessage( req.session.username, req.session.username, req.body.message, () => {
        res.status( 201 ).end( JSON.stringify( true ) );
      } );
    }
  } )
} );

app.post('/messageFriend', ( req, res ) => {
  // cookies.verifySession( req, res, ( valid ) => {

    db.postMessage( req.session.username, req.body.username, req.body.message, () => {
      res.status( 201 ).end( JSON.stringify( true ) );
    });
  // })
} );

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../react-client/dist/index.html'));
});

app.listen( process.env.PORT || 8080, function () {
  console.log( 'listening on environment port ' + JSON.stringify( process.env.PORT || 8080 ) + '!' );
} );

module.exports = app;
