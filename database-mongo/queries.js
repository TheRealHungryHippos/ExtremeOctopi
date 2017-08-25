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
  db.User.findOne({twitter_id: twitter_id}, 'following', callback);
};

module.exports.updateFollowing = function(twitter_id, newFollowing, callback) {
  db.User.update({twitter_id: twitter_id}, {$set: {following: newFollowing}}, callback);
};

module.exports.getMatches = function(twitter_id, doc) {
  db.User.aggregate(
   {$unwind: '$following'},
   {$match: {following: {$in: doc} } },
   {$group: {_id: {username: "$username", twitter_url: "$twitter_url", location: "$location", profile_img: "$profile_img", about_me: "$about_me"}, nb: {"$sum":1} } },
   {$sort: {nb:-1}},
   {$limit:10},
   function(err, results) {

   }
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

module.exports.findOneAndUpdate = function(profile, callback) {
  var user = profile._json;

  module.exports.findUserById(user.id_str, function(err, results) {
    if (err) {
      console.log('*********** database findOneAndUpdate error ', err);
      callback(err);
    }
    if (results.length > 0) {
      console.log('*********** database findOrCreateUser user already exists ', err);
      callback(err, results[0]);
    } else {
      db.User.create({
        twitter_id: user.id_str,
        username: user.screen_name,
        twitter_url: user.url,
        fullname: user.name,
        location: user.location,
        profile_img: user.profile_image_url.replace(/normal/i, '400x400'),
        about_me: user.description
      }, function(err, user) {
        if (err) {
          console.log('*********** database findOrCreateUser error in creating User ', err);
          callback(err);
        } else {
          console.log('*********** New user created ');
          callback(null, user);
        }
      });
    }
  });
};
