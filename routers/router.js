const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const msgController = require('../controllers/messageController');

const ensureAuth = (req, res, next) => {
    if(req.isAuthenticated()) return next();
    req.flash('error', 'Please log in to view this page.');
    res.redirect('/login');
}

router.post('/message/delete/:id', ensureAuth, msgController.dashboardDeleteMessage);
router.get('/message/create', ensureAuth, msgController.createMessage);
router.post('/message/create', ensureAuth, msgController.postMessage);
router.get('/register', userController.register);
router.post('/register', userController.postRegister);
router.get('/login', userController.login);
router.post('/login', userController.postLogin);
router.get('/logout', ensureAuth, userController.logOut);
router.get('/member', ensureAuth, userController.member);
router.post('/member', ensureAuth, userController.postMember);
router.get('/', ensureAuth, msgController.dashboard);

module.exports = router;