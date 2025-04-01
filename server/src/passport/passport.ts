import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../model/User';

export const configurePassport = (passport: PassportStatic): PassportStatic => {

    passport.serializeUser((user: Express.User, done) => {
        console.log('user is serialized.');
        done(null, user);
    });

    passport.deserializeUser((user: Express.User, done) => {
        console.log('user is deserialized.');
        done(null, user);
    });

    passport.use('local', new Strategy((username, password, done) => {
        User.findOne({ email:username }).then(user => {
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

    return passport;
}