var authentication = require( './authentication/authentication.js' );
var cookies = require( './authentication/cookies.js' );
var bodyParser = require( 'body-parser' );
var db = require( '../database-mongo' );
var express = require( 'express' );

var app = express();

app.use( express.static( __dirname + '/../react-client/dist' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.use( cookies.parseCookies );
app.use( cookies.createSession );

app.get( '/profile', ( req, res ) => {
  cookies.verifySession( req, res, ( valid ) => {
    if ( valid ) {
      db.getProfile( req.session.username, ( profile ) => {
        res.status( 200 ).send( JSON.stringify( profile ) );
      } );
    } else {
      res.status( 200 ).send( JSON.stringify( false ) );
    }
  } );
} );

app.post( '/friendProfile', ( req, res ) => {
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

app.get( '/matches', ( req, res ) => {
  cookies.verifySession( req, res, ( valid ) => {
    if ( valid ) {
      db.getFriends( req.session.username, ( matches ) => {
        res.status( 200 ).send( JSON.stringify( matches ) );
      } );
    } else {
      res.status( 200 ).end( JSON.stringify( false ) );
    }
  } );
} );

app.get( '/messages', ( req, res ) => {
  cookies.verifySession( req, res, ( valid ) => {
    if ( valid ) {
      db.getMessages( req.session.username, ( messages ) => {
        res.status( 200 ).send( JSON.stringify( messages ) );
      } );
    } else {
      res.status( 200 ).end( JSON.stringify( false ) );
    }
  } );
} );

app.post('/friendMessages', (req, res) => {
  console.log('In friend Messages')
  db.getMessages( req.body.username, ( messages ) => {
    res.status( 200 ).send( JSON.stringify( messages ) );
  });
});

app.post( '/signup', ( req, res ) => {
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

app.post( '/login', ( req, res ) => {
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

var mostCompatible = {
  infp: ['enfj', 'entj'],
  enfp: ['infj', 'intj'],
  infj: ['enfp', 'entp'],
  enfj: ['infp', 'isfp'],
  intj: ['enfp', 'entp'],
  entj: ['infp', 'intp'],
  intp: ['entj', 'estj'],
  isfp: ['enfj', 'esfj', 'estj'],
  esfp: ['isfj', 'istj'],
  istp: ['enfj', 'esfj', 'estj'],
  estp: ['enfj', 'isfj', 'istj'],
  isfj: ['enfj', 'esfp', 'estp'],
  esfj: ['enfj', 'isfp', 'istp'],
  istj: ['enfj', 'esfp', 'estp'],
  estj: ['enfj', 'intp', 'esfp', 'estp']
};

app.post( '/test', ( req, res ) => {
  db.postTestResults( req.session.username, req.body.testResults, allUsers => {
    var matchesList = [];
    if (allUsers.length > 0) {
      allUsers.forEach(user => {
        if (user.username !== req.session.username && mostCompatible[req.body.testResults].includes(user.testResults)) {
          var friend = {
            fusername: user.username,
            ffullname: user.fullname,
            femail: user.email,
            flocation: user.location,
            fhobbies: user.hobbies,
            fabout: user.blog,
            fpic: user.img
          }
          matchesList.push(friend);
        }
      })
      db.postMatches(req.session.username, matchesList, (data) => {
        res.status( 201 );
      })
    } else {
      res.status(201);
    }
  })
});

app.post( '/matches', ( req, res ) => {
  db.postGetMatches( req.session.username, req.body.numberToReturn, req.body.maxFriends, ( results ) => {
    res.status( 201 ).send( results );
  } );
} );

app.post( '/updateUser', ( req, res ) => {
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

app.post( '/message', ( req, res ) => {
  cookies.verifySession( req, res, ( valid ) => {
    if ( valid ) {
      console.log('valid', req.session.username, req.body.message);
      db.postMessage( req.session.username, req.session.username, req.body.message, () => {
        res.status( 201 ).end( JSON.stringify( true ) );
      } );
    }
  } )
} );

app.post( '/messageFriend', ( req, res ) => {
  cookies.verifySession( req, res, ( valid ) => {

      db.postMessage( req.session.username, req.body.username, req.body.message, () => {
        res.status( 201 ).end( JSON.stringify( true ) );
      });
  })
} );

app.all( '*', ( req, res ) => {
  res.redirect( '/' )
} )

app.listen( 8080, function () {
  console.log( 'listening on port 8080!' );
} );

module.exports = app;

