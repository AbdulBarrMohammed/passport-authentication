const passport = require("passport");
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db/queries');

async function displayIndex(req, res) {
    const messages = await db.getAllMessages();
    //res.render('index', { user: user, messages: messages });
    res.render("views/index", { user: req.user, messages: messages });
}

async function displayDashboard(req, res) {

    res.render("views/userDashboard", { user: req.user});
}


async function signUpGet(req, res) {
    res.render("views/sign-up");
}

async function logInPost(req, res, next) {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
      })(req, res, next);
}


async function signUpPost(req, res, next) {
    const { firstName, lastName, username, password  } = req.body;
    const membership_status = 'inactive';
    console.log(firstName, lastName)

    try {
      // Hash the password with bcrypt
      bcrypt.hash(password, 10, async (err, hashedPassword) => {
        console.log(hashedPassword)
        if (err) {
          // Handle hashing error
          return next(err);
        }

        // Store hashedPassword in DB
        try {
            console.log(firstName);
            await db.insertNewUsers({firstName, lastName, username, hashedPassword, membership_status});

          console.log('User signed up successfully');
          res.redirect("/");
        } catch (dbError) {
          // Handle database insertion error
          return next(dbError);
        }
      });
    } catch (err) {
      // Handle other errors
      return next(err);
    }
}

passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await db.getUser(username);
        console.log(user);


        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
        }
        return done(null, user);
      } catch(err) {
        return done(err);
      }
    })
  );


passport.serializeUser((user, done) => {
    done(null, user.id);
  });

passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.getUserById(id);

      done(null, user);
    } catch(err) {
      done(err);
    }
  });

  async function logOutGet(req, res){
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });

  }

  module.exports =  {

    signUpGet,
    signUpPost,
    logInPost,
    displayDashboard,
    displayIndex,
    logOutGet

  }
