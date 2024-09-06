const passport = require("passport");
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db/queries');
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const passLengthErr =  "must be at least 8 characters.";
const usernameLengthErr =  "must be at least 4 characters.";

const validateUser = [
  body("firstName").trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
  body("username").trim().matches(/[a-z]/)
    .withMessage('Username must contain at least one lowercase letter')
    .matches(/[0-9]/).isLength({ min: 4, max: 40 }).withMessage(`User name ${usernameLengthErr}`),


  body("password").notEmpty()
  .withMessage('Password is required').trim().isLength({min: 8, max: 50}).withMessage(`Password ${passLengthErr}`).matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number'),
];

async function displayIndex(req, res) {
    const messages = await db.getAllMessages();
    //res.render('index', { user: user, messages: messages });
    const messageCount = await db.countMessages();
    res.render("views/index", { user: req.user, messages: messages, messageCount: messageCount });
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

const signUpPost = [
  validateUser,

   async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("ERRRORRRR")
      return res.status(400).render("views/sign-up", {
        title: "Sign Up",
        errors: errors.array(),
      });
    }
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

]

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
    displayIndex,
    logOutGet

  }
