var db = require('./index.js');

//user = username
var removeCookie = function (user) {
};

// user = username, callback = full User row
module.exports.getProfile = function (user, callback) {
  db.User.findOne({username: user}, (err, doc) => {
    if (doc) {
      callback(doc);
    } else {
      console.log( 'User not found' );
      callback(null);
    }
  });
};

// user = username, callback = {sent: messages sent by user, received: messages received by user}
module.exports.getMessages = function (user, friend, callback) {
  db.Message.find({$or: [{$and: [{sender: user}, {receiver: friend}]}, {$and: [{sender: friend}, {receiver: user}]}]},
    (err, results) => {
      if (err) {callback(err);}
      callback(null, results)
  });
};

module.exports.getFriends = function (user, callback) {
  db.User.findOne({username: user}, (err, user) => {
    if (err) {callback(err);}
    db.User.find({twitter_id: {$in: user.friends}}, (err, friends) => {
      if (err) {callback(err);}
      callback(null, friends);
    });
  });
};

// userInfo = {username, password, fullname, email, location, cookies},
// callback = false: user already exists - true: user created successfully
module.exports.postUser = function (userInfo, cookie, callback) {
  db.User.findOne({username: userInfo.username}, (err, doc) => {
    if (doc) {
      console.log( 'User already exists' );
      callback(false);
    } else {
      db.User.update(
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

module.exports.postUpdateUser = function (userInfo, callback) {
  db.User.findOne({username: userInfo.username}, (err, doc) => {
    if (doc) {
      db.User.update(
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

// user = username, results = type
module.exports.postTestResults = function (user, results, callback) {
  db.User.findOne({username: user}, function (err, doc) {
    if (doc) {
      db.User.update({username: user},
        {$set: {testResults: results}}, {upsert: true}, () => {
          db.User.find({}, (err, users) => {
            callback(users);
          })
        })
    } else {
      console.log('User not found');
      callback(null);
    }
  })
};

// senderName = sender, receiverName = receiver, messageText = message
module.exports.postMessage = function (senderName, receiverName, messageText, callback){
  console.log('db', senderName, receiverName, messageText);
  var message = new db.Message({
    sender: senderName,
    receiver: receiverName,
    message: messageText
  });

  message.save(function (err) {
    if(err) console.log(err);
    callback();
  });
};

// user1 = username that we want results for, matchInfo = a list that matches all the other users
module.exports.postMatches = function(user, matchesList, callback) {
  db.User.findOne({username: user}, (err, doc) => {
    if (doc) {
      db.User.update({username: user},
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

module.exports.getFollowing = function(twitter_id, callback) {
  db.User.findOne({twitter_id: twitter_id}, 'following following_count', callback);
};

module.exports.updateFollowing = function(twitter_id, newFollowing, callback) {
  db.User.findOneAndUpdate({twitter_id: twitter_id}, {$set: {following: newFollowing}}, callback);
};

module.exports.getMatches = function(user, doc, callback) {
  // console.log('*** DO NOT MATCH ', [user.twitter_id].concat(user.friends, user.blocked, user.pending_approval, user.pending_request));

  db.User.aggregate(
    {$unwind: '$following'},
    {$match: {$and: [{following: {$in: doc}}, {twitter_id: {$nin: [user.twitter_id].concat(user.friends, user.blocked, user.pending_approval, user.pending_request)}}]}},
    {$group: {_id: {username: '$username', location: '$location', profile_img: '$profile_img', about_me: '$about_me'}, nb: {'$sum': 1} } },
    {$sort: {nb: -1}},
    {$limit: 10},
    callback
  );
};

module.exports.clear = function(callback) {
  db.User.remove({}, () => {
    db.Message.remove({}, () => {
      db.Session.remove({}, () => {
        callback();
      });
    });
  });
};

module.exports.findUserById = function(id, callback) {
  db.User.find({twitter_id: id}, function(err, result) {
    if (err || !result) {
      console.log('*********** database find user by id error ', err);
      return callback(err);
    }
    return callback(null, result);
  });
};

module.exports.addFriend = function(twitter_id, usernameToFriend, callback) {
  db.User.findOne({username: usernameToFriend}, 'twitter_id', function(err, userToFriend) {
    if (err) {
      console.log('********* ERROR finding friend to add\'s id ', err);
      callback(err);
    } else if (!userToFriend) {
      console.log('********* ERROR friend to add\'s username is not valid: ', usernameToFriend);
      callback(null, false);      
    }
    db.User.findOneAndUpdate({twitter_id: twitter_id}, {$push: {friends: userToFriend.twitter_id}}, function(err, user) {
      if (err) {
        console.log('********* ERROR adding friend to user\'s friend list ', err);
        callback(err);
      }
      db.User.findOneAndUpdate({twitter_id: userToFriend.twitter_id}, {$push: {friends: twitter_id}}, function(err, user) {
        if (err) {
          console.log('********* ERROR adding user to friend\'s friend list ', err);
          callback(err);
        }
        callback(null, user);
      });
    });
  });
};

module.exports.blockUser = function(twitter_id, usernameToBlock, callback) {
  db.User.findOne({username: usernameToBlock}, 'twitter_id', function(err, userToBlock) {
    if (err) {
      console.log('********* ERROR finding user to block\'s id ', err);
      callback(err);
    } else if (!userToBlock) {
      console.log('********* ERROR user to block\'s username is not valid: ', userToBlock);
      callback(null, false);      
    }
    db.User.findOne({twitter_id: twitter_id}, 'friends', function(err, results) {
      if (err) {
        console.log('********* ERROR getting user\'s friends list ', err);
        callback(err);
      }
      if (results.friends.includes(userToBlock.twitter_id)) {
        db.User.findOneAndUpdate({twitter_id: twitter_id}, {$pull: {friends: userToFriend.twitter_id}}, function(err, user) {
          if (err) {
            console.log('********* ERROR removing userToBlock from user\'s friends list ', err);
            callback(err);
          }
          db.User.findOneAndUpdate({twitter_id: userToFriend.twitter_id}, {$pull: {friends: twitter_id}}, function(err, user) {
            if (err) {
              console.log('********* ERROR removing user from userToBlock\'s friends list ', err);
              callback(err);
            }
            db.User.findOneAndUpdate({twitter_id: twitter_id}, {$push: {blocked: userToBlock.twitter_id}}, function(err, user) {
              if (err) {
                console.log('********* ERROR adding userToBlock to user\'s blocked list ', err);
                callback(err);
              }
              callback(null, user);
            });    
          });
        });
      } else {
        db.User.findOneAndUpdate({twitter_id: twitter_id}, {$push: {blocked: userToBlock.twitter_id}}, function(err, user) {
          if (err) {
            console.log('********* ERROR adding userToBlock to user\'s blocked list ', err);
            callback(err);
          }
          callback(null, user);
        });
      }
    });
  });
};

module.exports.findOneOrCreate = function(profile, callback) {
  var user = profile._json;

  var conditions = {
    twitter_id: user.id_str
  };

  var update = {
    twitter_id: user.id_str,
    username: user.screen_name,
    twitter_url: user.url,
    fullname: user.name,
    location: user.location,
    profile_img: user.profile_image_url.replace(/normal/i, '400x400'),
    about_me: user.description,
    following_count: user.friends_count
  };

  options = {
    new: true,
    upsert: true
  };

  db.User.findOneAndUpdate(conditions, update, options, callback);
};
