import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../model/User';

export const configurePassport = (passport: PassportStatic): PassportStatic => {

    passport.serializeUser((user: Express.User, done) => {
        //console.log('user is serialized.');
        done(null, user);
    });

    passport.deserializeUser((user: Express.User, done) => {
        //console.log('user is deserialized.');
        done(null, user);
    });

    passport.use('local', new Strategy((username, password, done) => {
        User.findOne({ email: username })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                user.comparePassword(password, (error, isMatch) => {
                    if (error) {
                        return done(error);
                    }
                    if (!isMatch) {
                        return done(null, false, { message: 'Incorrect password' });
                    }
                    return done(null, user);
                });
            })
            .catch(error => {
                return done(error);
            });
    }));

    return passport;
}