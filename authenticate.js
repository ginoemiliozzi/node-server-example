const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
}

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey
};

exports.jwtPassport = passport.use(new JwtStrategy(opts,
        (jwt_payload, done) => {
            console.log('JWT PAYLOAD ', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, usr) => {
                if(err) {
                    console.log('1');
                    return done(err, false);
                }
                else if (usr) {
                    console.log('2');
                    return done(null, usr);
                }
                else {
                    console.log('3');
                    return done(null, false);
                }

            })
        })
    );

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if(req.user.admin) {
        next();
    } else {
        let err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        next(err);
    }
}