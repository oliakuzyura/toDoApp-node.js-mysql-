const express = require("express");
const router = express.Router();
const config = require("../config");
const busboyBodyParser = require('busboy-body-parser');
const bodyParser = require('body-parser');
const user = require('../models/user');
const crypto = require('crypto');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const serverSalt = config.salt;
// function sha512(password, salt) {
//     const hash = crypto.createHmac('sha512', salt);
//     hash.update(password);
//     const value = hash.digest('hex');
//     return {
//         salt: salt,
//         passwordHash: value
//     };
// };
let isadmin;
router.use(busboyBodyParser());
//router.set('view engine', 'ejs');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(busboyBodyParser({ limit: '5mb' }));
// new middleware
router.use(cookieParser());
router.use(session({
    secret: "Some_secret^string",
    resave: false,
    saveUninitialized: true
}));
router.use(passport.initialize());
router.use(passport.session());
passport.serializeUser(function (user, done) {
    // наприклад, зберегти у Cookie сесії id користувача
    done(null, user._id);
});

// отримує інформацію (id) із Cookie сесії і шукає користувача, що їй відповідає
passport.deserializeUser(function (id, done) {
    user.getById(id)
        .then(user => done(null, user))
        .catch(err => done(err, null));
    // отримати користувача по id і викликати done(null, user);
    // при помилці викликати done(err, null)
});
// налаштування стратегії для визначення користувача, що виконує логін
// на основі його username та password
passport.use(new LocalStrategy((username, password, done) => {
    user.getAll()
        .then(users => {
            let user1;
            for (let i = 0; i < users.length; i++) {
                if (username == users[i].username && users[i].password == password) {
                    user1 = users[i];
                }
            }
            done(null, user1);

        })
        .catch(err => done(err, null));

}));
router.get("/auth/checkUsername", (req, res) => {
    //console.log(req.query.username);
    
    user.findByLogin(req.query.username)
        .then(user => {
            if(!user)
            {
                res.status(200).json({});
            }
            else{
                res.status(409).json({});
            }
        })
        .catch(err => res.status(404).json({}));
});
router.get('/login', function (req, res) {
    res.render('login');
});
router.post('/login', passport.authenticate('local', { failureRedirect: '/auth/login' }), function (req, res) {
    if (req.user.role == "admin") isadmin = true;
    else isadmin = false; res.render('index', { user: req.user, isadmin: isadmin });
});
// router.get('/auth/logout', function (req, res) {
//     req.logout();
//     res.redirect('/');
// });

// router.get('/auth/register', function (req, res) {
//     if (req.user) {
//         if (req.user.role == "admin") isadmin = true;
//         else isadmin = false;
//     }
//     res.render('new-user', { isadmin: isadmin,user:req.user });
// });
// router.post('/auth/register', function (req, res)  {
 
//     const hash_pass = sha512(req.body.password, serverSalt).passwordHash;
//     console.log(req.body.birthDate);
//     user.insert(req.body, hash_pass)
//         .then(user => {
//             res.status(200).send();
//             res.render('login');
//         })
//         .catch(err => res.status(500).send(err));
 
// });
module.exports = router;