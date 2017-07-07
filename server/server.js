const   express = require('express'),
        session = require('express-session'),
        bodyParser = require('body-parser'),
        passport = require('passport'),
        Auth0Strategy = require('passport-auth0'),

        config = require('./config.js');

const   app = express(),
        port = config.port || 3000;

app.use(bodyParser.json());

//MUST HAVE THIS ORDER!!!

app.use(session({
    secret: config.sessionSecret,
}));

app.use(passport.initialize());

app.use(passport.session());

passport.use(new Auth0Strategy({
        domain: config.domain,
        clientID: config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL
    }, function(accessToken, refreshToken, extraParams, profile, done) {
        console.log('Logged in:', profile)
        //USE DATABASE STUFF HERE
        //USE PROFILE.ID TO FIND USER
            //IF USER->DONE
            //ELSE CREATE USER
        return done(null, profile);
}));

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback',
    passport.authenticate('auth0', {successRedirect: '/me', failureRedirect: '/login'}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/me', (req,res)=>{
    res.status(200).send({message: 'HEY IT WORKED', user: req.user})
});

app.listen(port, console.log(`LISTENING ON PORT ${port}.`))

