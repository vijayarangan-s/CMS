const passport = require('passport')
const User = require('../schema/userSchema')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user.id)
  });

passport.deserializeUser(function(id, done) {
    User.findById(id, (err, user) => {
        done(err, user)
    })
});

passport.use(new GoogleStrategy({
    clientID: '547408186288-8gqebuii0s82k0d0mkfvqn9jdt4aj3mv.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:3300/api/v1/auth/google/callback"
  },
  (accessToken, refreshToken, profile, next) => {
    // console.log({profile})
    User.findOne({email:profile?._json?.email})
        .then(user => {
            if(user){
                console.log("User already exists in DB")
                next(null, user)
            } else {
                User.create({
                    firstName: profile?.name?.givenName,
                    lastName: profile?.name?.familyName,
                    googleId: profile?.id,
                    email: profile?._json?.email
                }).then(user =>{
                    console.log({red:user})
                    next(null, user)
                }).catch(err => {
                    console.error("error ",+ err?.message)
                    next(err, null)
                })
            }
        })
  }
));