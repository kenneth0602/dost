const passport = require('passport');

const jwtStrategy = require('passport-jwt').Strategy,
extractJWT = require('passport-jwt').ExtractJwt;

let opts = {};
opts.jwtFromRequest = extractJWT.fromHeader('authorization');
opts.secretOrKey = 'mysecret';

passport.use(new jwtStrategy(opts,(jwt_payload, done) => {
    console.log(jwt_payload)
    return done(null, jwt_payload);
}))



module.exports = passport;