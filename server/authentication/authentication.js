const crypto = require( 'crypto' );

exports.generateSalt = ( bytes = 32 ) => {
  return crypto.randomBytes( bytes ).toString( 'hex' );
};

exports.generateHash = ( password, salt = '', algorithm = 'sha256' ) => {
  var hash = crypto.createHash( algorithm );

  hash.update( password + salt );

  return hash.digest( 'hex' );
};

exports.authenticate = ( attemptedPassword, password, salt = '', algorithm = 'sha256' ) => {
  var attemptedPassword = this.generateHash( attemptedPassword, salt, algorithm );

  return attemptedPassword === password;
};

//generateSalt
//MinimumInput; Output = Random 32 Bytes String Salt;

//generateHash
//MinimumInput = String password; Output = String Hash;

//authenticate
//MinimumInput = String attemptedPassword, String password; Output = Boolean;