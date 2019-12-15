const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

module.exports.config = () => {
    passport.use(
        new LocalStrategy({
            usernameField: 'email'
        }, (email, password, done) => {
            User.findOne({ email: email }, (err, user) => {
                if (err) { 
                    return done(err);
                };

                if (!user) {
                    return done(null, false, { message: "Incorrect email" });
                };

                bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch) {
                        return done(null, false, { message: 'Incorrect password' })
                    } else {
                        return done(null, user)
                    };
                }) 
                .catch(err => {
                    return done(err)
                });
            });
        })
    );
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};