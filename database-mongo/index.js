var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/friendzone2',
  {
    useMongoClient: true
  }
);

var db = mongoose.connection;

db.on('error', () => {
  console.log('mongoose connection error');
});

db.once('open', () => {
  console.log('mongoose connected successfully');
});

var userSchema = mongoose.Schema({
  _id: Number,
  username: {type: String, unique: true},
  twitter_url: String,
  fullname: String,
  location: String,
  hobbies: String,
  profile_img: String,
  about_me: String,
  matches: [Number],
  following: [Number],
  friends: [Number],
  blocked: [Number],
  pending_approval: [Number],
  pending_request: [Number]
});

var messageSchema = mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  createdAt: Date
});

var sessionSchema = mongoose.Schema({
  hash: String,
  user_id: Number,
  createdAt: {type:Date , default: Date.now},
  updatedAt: Date
});

var User = mongoose.model('User', userSchema, 'User');
var Message = mongoose.model('Message', messageSchema);
var Session = mongoose.model('Session', sessionSchema);

// user = username, callback = hash, callback = return password or null if pw not present
var getHash = function (user, callback) {
  User.findOne({username: user}, function (err, doc) {
    if (doc) {
      callback(doc.password);
    } else {
      console.log( 'User not found' );
      callback(null);
    }
  });
};

//user = username
var removeCookie = function (user) {
};

// user = username, callback = full User row
var getProfile = function (user, callback) {
  User.findOne({username: user}, (err, doc) => {
    if (doc) {
      callback(doc);
    } else {
      console.log( 'User not found' );
      callback(null);
    }
  });
};

// user = username, callback = matches for that user
var getFriends = function (user, callback) {
  Test.find({username: user, currentlyFriends: true}, function (err, matches) {
    if (matches) {
      callback(matches);
    } else {
      console.log( 'User not found' );
      callback(null);
    }
  });
};

// user = username, callback = {sent: messages sent by user, received: messages received by user}
var getMessages = function (user, callback) {
  var results = {sent: [], received: []};

  Message.find({sender: user}, function (err, sent) {
    results.sent = sent.slice();

    Message.find({receiver: user}, function (err, received) {
      results.received = received.slice();

      callback(results);
    });
  });
};

var getCookieUser = function (cookie, callback) {
  User.find({cookies: cookie}, (error, matches) => {
    if (matches.length !== 0) {
      callback({username: matches[ 0 ].username, cookies: cookie});
    } else {
      callback({});
    }
  });
};

// userInfo = {username, password, fullname, email, location, cookies},
// callback = false: user already exists - true: user created successfully
var postUser = function (userInfo, cookie, callback) {
  User.findOne({username: userInfo.username}, (err, doc) => {
    if (doc) {
      console.log( 'User already exists' );
      callback(false);
    } else {
      User.update(
        {
          cookies: cookie
        },
        {
          $set: {
            username: userInfo.username,
            password: userInfo.password,
            fullname: userInfo.fullname,
            email: userInfo.email,
            location: userInfo.location,
            img: userInfo.img
          }
        },
        {
          upsert: true
        },
        (err, user) => callback(true)
      );
    }
  });
};

var postUpdateUser = function (userInfo, callback) {
  User.findOne({username: userInfo.username}, (err, doc) => {
    if (doc) {
      User.update(
        {
          username: userInfo.username
        },
        {
          $set: {
            fullname: userInfo.fullname,
            location: userInfo.location,
            blog: userInfo.blog,
            hobbies: userInfo.hobbies,
            img: userInfo.image
          }
        },
        {
          upsert: true
        },
        (err, user) => callback(true)
      );
    } else {
      callback(false);
    }
  });
};

// TODO!!!!!!!!!!!!!!!!!!!!!!!!!!!
var postCookie = function (cookie, callback) {
  User.find({cookies: cookie}, function (err, doc) {
    if (doc) {
      return false;
    } else {
      var user = new User({cookies: cookie});

      user.save();

      return true;
    }
  });
};

// user = username, results = type
var postTestResults = function (user, results, callback) {
  User.findOne({username: user}, function (err, doc) {
    if (doc) {
      User.update({username: user},
        {$set: {testResults: results}}, {upsert: true}, () => {
          User.find({}, (err, users) => {
            callback(users);
          })
        })
    } else {
      console.log('User not found');
      callback(null);
    }
  })
};

// var postTestResults = function (user, results, callback) {
//   User.findOne({username: user}, function (err, doc) {
//     if (doc) {
//       User.update({username: user},
//         {$set: {testResults: results}}, {upsert: true}, () => {
//           postMatches(user, results, () => {
//             callback();
//           })
//         });
//     } else {
//       console.log('User not found');
//       callback(null);
//     }
//   })
// };

// senderName = sender, receiverName = receiver, messageText = message
var postMessage = function (senderName, receiverName, messageText, callback){

  console.log('db', senderName, receiverName, messageText);
  var message = new Message({
    sender: senderName,
    receiver: receiverName,
    message: messageText,
    time: Date.now()
  });

  message.save(function (err) {
    if(err) console.log(err);
    callback();
  });
};

// user1 = username that we want results for, matchInfo = a list that matches all the other users
var postMatches = function(user, matchesList, callback) {
  User.findOne({username: user}, (err, doc) => {
    if (doc) {
      User.update({username: user},
        {$set: {matches: matchesList}},
        {
          upsert: true
        },
        (err, data) => callback(data)
      );
    } else {
      callback(false);
    }
  });
};

//}
// var postMatches = function (user1, userResults, callback) {
//   User.find({}, {username: 1, testResults: 1}, (err, users) => {
//     async.forEach(users, function (user2, iterate_callback) {
//       if (user1 !== user2.username && user2.testResults !== undefined) {
//         var test1 = new Test({
//           username: user1,
//           match: user2.username,
//           compatability: mbti[userResults][user2.testResults],
//           alreadyMatches: false
//         });

//         test1.save(() => {
//           var test2 = new Test({
//             username: user2.username,
//             match: user1,
//             compatability: mbti[user2.testResults][userResults],
//             alreadyMatches: false
//           });

//           test2.save(() => {
//             iterate_callback();
//           });
//         })
//       } else {
//         iterate_callback();
//       }
//     }, function (err) {
//       return callback();
//     })
//   })
// };

var postAddFriend = function (user1, user2, callback) {
  Test.findOne({username: user1}, function (err, doc) {
    if (doc) {
      Test.update({username: user1, match: user2}, {
        $set: {alreadyMatches: true, currentlyFriends: true}
      }, {upsert: true}, () => {
        Test.findOne({username: user2, match: user1}, function (err, doc) {
          if (doc) {
            Test.update({username: user2, match: user1}, {
              $set: {alreadyMatches: true, currentlyFriends: true}
            }, {upsert: true}, () => {
              callback(true);
            })
          }
        })
      })
    }
  })
};

var postRemoveFriend = function (user1, user2, callback) {
  Test.findOne({username: user1}, function (err, doc) {
    if (doc) {
      Test.update({username: user1, match: user2}, {
        $set: {currentlyFriends: false}
      }, {upsert: true}, () => {
        Test.findOne({username: user2, match: user1}, function (err, doc) {
          if (doc) {
            Test.update({username: user2, match: user1}, {
              $set: {currentlyFriends: false}
            }, {upsert: true}, () => {
              callback();
            })
          }
        })
      })
    }
  })
};

var postGetMatches = function (user, numberToReturn, maxFriends, callback) {
  Test.find({username: user, alreadyMatches: false}).sort('-compatability').exec(function (err, users) {
    var results = [];
    async.eachSeries(users, function (match, iterate_callback) {
        Test.count({username: match.match, currentlyFriends: false}, function (err, count) {
          if (count <= maxFriends && results.length < numberToReturn) {
            results.push(match);
            postAddFriend(user, match.match, () => {
              iterate_callback();
            });
          } else {
            iterate_callback();
          }
        })
      }, function (err) {
        callback(results);
      }
    )
  });
};

var clear = (callback) => {
  User.remove({}, () => {
    Message.remove({}, () => {
      Test.remove({}, () => {
        callback();
      });
    });
  });
};

module.exports.getHash = getHash;
module.exports.getProfile = getProfile;
module.exports.getFriends = getFriends;
module.exports.getMessages = getMessages;
module.exports.getCookieUser = getCookieUser;
module.exports.postUser = postUser;
module.exports.postCookie = postCookie;
module.exports.postTestResults = postTestResults;
module.exports.postMessage = postMessage;
module.exports.postMatches = postMatches;
module.exports.postGetMatches = postGetMatches;
module.exports.postRemoveFriend = postRemoveFriend;
module.exports.postUpdateUser = postUpdateUser;
module.exports.clear = clear;
