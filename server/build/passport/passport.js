"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configurePassport = void 0;
const passport_local_1 = require("passport-local");
const User_1 = require("../model/User");
const configurePassport = (passport) => {
    passport.serializeUser((user, done) => {
        console.log('user is serialized.');
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        console.log('user is deserialized.');
        done(null, user);
    });
    passport.use('local', new passport_local_1.Strategy((username, password, done) => {
        User_1.User.findOne({ email: username }).then(user => {
            if (!user) {
                return done(null, false, { message: 'User not found. Please sign up first.' });
            }
            user.comparePassword(password, (error, isMatch) => {
                if (error || !isMatch) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }).catch(error => done(error));
    }));
    /*
    passport.use('local', new Strategy((username, password, done) => {
        const query = User.findOne({ email: username });
        query.then(user => {
            if (user) {
                user.comparePassword(password, (error, _) => {
                    if (error) {
                        done('Incorrect username or password.');
                    } else {
                        done(null, user);
                    }
                });
            } else {
                done(null, undefined);
            }
        }).catch(error => {
            done(error);
        })
    }));*/
    return passport;
};
exports.configurePassport = configurePassport;
