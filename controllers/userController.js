const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// register
module.exports.register = (req, res) => {
    res.render('register', {successMsg: req.flash('success'), errorMsg: req.flash('error')});
};

module.exports.postRegister = (req, res) => {
    const { firstName, lastName, email, password, password2 } = req.body;
    errors = [];

    if(!firstName || !lastName || !email || !password || !password2) {
        errors.push({msg: 'Please fill in all fields.'});
    };

    if(/^[A-Za-z]+$/.test(firstName) === false || /^[A-Za-z\s]+$/.test(lastName) === false) {
        errors.push({msg: 'First name and last name can only include letters.'});
    };

    if(password.length < 6) {
        errors.push({msg: 'Password must not be less than 6 characters.'});
    };

    if(password !== password2) {
        errors.push({msg: 'Passwords must match.'});
    };

    User.findOne({email})
    .then(user => {
        if(user) errors.push({msg: 'User already exists'});
        if(errors.length > 0) {
            errors.forEach(error => {
                req.flash('error', error.msg);
            });
            res.redirect('/register');
        } else {
            bcrypt.hash(password, 10, (err, hashed) => {
                if(err) console.log(err);
                let user = new User({
                    firstName,
                    lastName,
                    email,
                    password: hashed
                })
                .save()
                .then(user => console.log(`${user.email} created`))
                .catch(err => console.log(err));
        
                req.flash('success', 'Registration successful!');
                res.redirect('/register');
            });
        };
    })
    .catch(err => console.log(err));
};

// login
module.exports.login = (req, res) => {
    res.render('login', {errorMsg: req.flash('error'), successMsg: req.flash('success')});
};

module.exports.postLogin = 
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: 'You have successfully logged in!'
    });

module.exports.logOut = (req, res) => {
    req.logout();
    res.redirect('/login');
};

// membership
module.exports.member = (req, res) => {
    res.render('member', {successMsg: req.flash('success'), errorMsg: req.flash('error')});
};

module.exports.postMember = (req, res) => {
    const secret = req.body.secret;
    if(secret === 'member') {
        User.findOneAndUpdate({_id: req.user._id}, {$set: {member: true}})
        .then(user => {
            req.flash('success', 'You are now a member.')
            res.redirect('/');
        })
        .catch(err => console.log(err));
    } else if(secret === 'admin') {
        User.findOneAndUpdate({_id: req.user._id}, {$set: {admin: true}})
        .then(user => {
            req.flash('success', 'You are now an admin.')
            res.redirect('/');
        })
        .catch(err => console.log(err));
    } else if(secret === 'remove') {
        User.findOneAndUpdate({_id: req.user._id}, {$set: {admin: false, member: false}})
        .then(user => {
            req.flash('success', 'You have successfully removed all of your privileges!');
            res.redirect('/');
        })
        .catch(err => console.log(err));
    } else {
        req.flash('error', 'Incorrect secret.');
        res.redirect('/member')
    }
};