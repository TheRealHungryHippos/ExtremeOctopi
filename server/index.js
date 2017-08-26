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
    callbackURL: process.env.TWITTER_CALLBACK_URL,
    token: process.env.TWITTER_TOKEN,
    tokenSecret: process.env.TWITTER_TOKEN_SECRET
  };
  sessionSecret = process.env.SESSION_SECRET;
} else {
  twitterOptions = require('./config/twitter.config.js');
  sessionSecret = require('./config/session.config.js');
}
// Passport TwitterStrategy expects camelCase properties
// Twitter API request, expects snake_case properties
var oauthOptions = {
  consumer_key: twitterOptions.consumerKey,
  consumer_secret: twitterOptions.consumerSecret,
  token: twitterOptions.token,
  token_secret: twitterOptions.tokenSecret
};

passport.use(new TwitterStrategy(
  twitterOptions,
  function(token, tokenSecret, profile, done) {
    db.findOneOrCreate(profile, function(err, user) {
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
    // console.log('***** DESERIALIZE USER ', user);
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
    if (req.session.passport.user) {
      res.status(200).send(JSON.stringify(true));
    } else {
      res.status(200).send(JSON.stringify(false));
    }
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
  res.redirect('/');
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

app.get( '/friends', (req, res) => {
  console.log('********** delete hard coded username in /friends on server');
  req.body.username = 'chrisbharrison'; //delete once add friend functionality working
  db.getFriends( req.body.username, (err, friends) => {
    if (err) {
      res.status(400);
    } else {
      res.status(200).end(JSON.stringify(friends));
    }
  });
});

app.post('/friends/mutual', (req, res) => {
  console.log('********** delete hard coded username in /friends/mutual on server');
  req.body.username = 'chrisbharrison'; //delete once add friend functionality working
  db.getMutualFriends(req.body.username, req.body.friend, ( error, friends ) => {
    if (error) {
      res.status(400);
    } else {
      res.status(200).end(JSON.stringify(friends));
    }
  });
});

app.post('/matches/friend', (req, res) => {
  var toAdd = req.body.excludedUsername;
  db.addFriend(req.user.twitter_id, toAdd, (err, result) => {
    (err || !result) && res.sendStatus(500);
    res.sendStatus(201);
  });
});

app.post('/matches/block', (req, res) => {
  var toBlock = req.body.excludedUsername;
  db.blockUser(req.user.twitter_id, toBlock, (err, result) => {
    (err || !result) && res.sendStatus(500);
    res.sendStatus(201);
  });
});

app.get('/matches/users', ( req, res ) => {
  var options = {
    url: 'https://api.twitter.com/1.1/friends/ids.json?cursor=-1&user_id=' + req.user.twitter_id + '&count=5000',
    headers: {
      'User-Agent': 'request'
    },
    oauth: oauthOptions
  };

  db.getFollowing(req.user.twitter_id, (err, doc) => {
    err && res.sendStatus(500);
    // console.log('****** DOC BEFORE IF STATEMENT ', doc);
    if (doc) {
      if (doc.following && doc.following.length === doc.following_count) {
        db.getMatches(req.user, doc.following, (err, matches) => {
          err && res.sendStatus(500);
          // console.log('****** MATCHES ', matches);
          matches && res.send(JSON.stringify(matches));
        });
      } else {
        request(options, (err, response) => {
          err && res.sendStatus(500);
          if (response) {
            var body = JSON.parse(response.body);
            // console.log('****** BODY ', body);
            db.updateFollowing(req.user.twitter_id, body.ids, (err, doc) => {
              err && res.sendStatus(500);
              // console.log('****** DOC ', doc);
              if (doc) {
                if (!body.ids) {
                  res.sendStatus(403);
                } else {
                  doc && db.getMatches(req.user, doc.following, (err, matches) => {
                    err && res.sendStatus(500);
                    // console.log('****** MATCHES ', matches);
                    res.send(JSON.stringify(matches));
                  });
                }
              }
            });
          }
        });
      }
    }
  });
} );

// app.get('/messages', ( req, res ) => {
//   // cookies.verifySession( req, res, ( valid ) => {
//     // if ( req.body.user ) {
//     //   db.getMessages( req.session.username, ( messages ) => {
//     //     res.status( 200 ).send( JSON.stringify( messages ) );
//     //   } );
//     // } else {
//       // res.status( 200 ).end( JSON.stringify( false ) );
// res.sendFile(path.join(__dirname, '../react-client/dist/index.html'));    // }
//   // } );
// } );

app.post('/messages/hist', (req, res) => {
  console.log('********** delete hard coded username in /messages/hist on server');
  req.body.username = 'chrisbharrison'; //delete once add friend functionality working
  db.getMessages( req.body.username, req.body.friend, ( error, messages ) => {
    if (error) {
      res.status(400);
    } else {
      res.status(200).end(JSON.stringify(messages));
    }
  });
});

//return all messages
app.post('/messages/new', (req, res) => {
  console.log('********** delete hard coded username in /messages/hist on server');
  req.body.username = 'chrisbharrison'; //delete once add friend functionality working
  db.insertAndGetMessages(req.body.username, req.body.friend, req.body.message, (error, messages) => {
    if (error) {
      res.status(400);
    } else {
      res.status(200).end(JSON.stringify(messages));
    }
  });
});

// app.post('/message', ( req, res ) => {
//   cookies.verifySession( req, res, ( valid ) => {
//     if ( valid ) {
//       console.log('valid', req.session.username, req.body.message);
//       db.postMessage( req.session.username, req.session.username, req.body.message, () => {
//         res.status( 201 ).end( JSON.stringify( true ) );
//       } );
//     }
//   } )
// } );

// app.post('/signup', ( req, res ) => {
//   var newUser = {
//     username: req.body.username,
//     password: authentication.generateHash(req.body.password),
//     fullname: req.body.fullname,
//     email: req.body.email,
//   };
//
//   db.postUser( newUser, req.cookies.takoyaki = cookies.bakeCookies(), ( valid ) => {
//     if ( valid ) {
//       res.cookie( 'takoyaki', req.cookies.takoyaki ).status( 201 ).end( JSON.stringify( true ) );
//     } else {
//       res.status( 201 ).end( JSON.stringify( false ) );
//     }
//   } );
// } );

// app.post('/login', ( req, res ) => {
//   db.getHash( req.body.username, ( password ) => {
//     if ( authentication.authenticate( req.body.password, password ) ) {
//       db.getProfile( req.body.username, ( user ) => {
//         res.cookie( 'takoyaki', user.cookies ).status( 201 ).end( JSON.stringify( true ) );
//       } );
//     } else {
//       res.status( 201 ).end( JSON.stringify( false ) );
//     }
//   } );
// } );

// app.post('/test', ( req, res ) => {
//   db.postTestResults( req.session.username, req.body.testResults, allUsers => {
//     var matchesList = [];
//     allUsers.forEach(user => {
//       if (user.username !== req.session.username && mostCompatible[req.body.testResults].indexOf(user.testResults) !== -1) {
//         var friend = {
//           fusername: user.username,
//           ffullname: user.fullname,
//           femail: user.email,
//           flocation: user.location,
//           fhobbies: user.hobbies,
//           fabout: user.blog,
//           fpic: user.img
//         };
//         matchesList.push(friend);
//       }
//     });
//     db.postMatches(req.session.username, matchesList, (data) => {
//       res.status( 201 ).send(data);
//     })
//   })
// });
//
// app.post('/matches', ( req, res ) => {
//   db.postGetMatches( req.session.username, req.body.numberToReturn, req.body.maxFriends, ( results ) => {
//     res.status( 201 ).send( results );
//   } );
// } );


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../react-client/dist/index.html'));
});

app.listen( process.env.PORT || 8080, function () {
  console.log( 'listening on environment port ' + JSON.stringify( process.env.PORT || 8080 ) + '!' );
} );

module.exports = app;
