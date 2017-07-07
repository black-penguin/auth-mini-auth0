const express =require('express');
const session=require('express-session');
const passport=require('passport');
const Auth0Strategy=require('passport-auth0');
const config=require('./config');

const app=express();

//session
app.use(session({
  secret:config.sessionsecret
}));

//passport init
app.use(passport.initialize());
//passport session
app.use(passport.session());

//
passport.use(new Auth0Strategy({
  domain: config.domain,
  clientID: config.clientID,
  clientSecret: config.clientSecret,
  callbackURL: config.callbackURL
},
function(accessToken, refreshToken, extraParams, profile, done)
{
  console.log("logged in: ", profile);
  //database stuff
  //user profile.id
  //if user->done
  //else create user ->done
  return done(null, profile);
}));

//two endpoints
app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0',
{
  successRedirect: '/me',
  failureRedirect:'/auth'
}));

//
passport.serializeUser(function(user, done)
{
  done(null, user);
});

passport.deserializeUser(function(obj, done)
{
  done(null, obj);
});

app.get('/me', (req, res)=>
{
  res.send(req.user)
});

app.listen(3000);
