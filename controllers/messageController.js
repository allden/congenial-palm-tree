const Message = require('../models/Message');

// dashboard
module.exports.dashboard = (req, res) => {
    Message.find({})
    .populate('user')
    .exec((err, messages) => {
        if(err) console.log(err);
        console.log(messages);
        res.render('index', {user: req.user, messages, successMsg: req.flash('success'), errorMsg: req.flash('error')});
    });
};

module.exports.postMessage = (req, res) => {
    const { title, content } = req.body;
    let newMessage = new Message({
        title,
        content,
        user: req.user._id
    })

    if(newMessage.title === '' || newMessage.content === '') {
        req.flash('error', 'Please fill every field.');
        res.redirect('/message/create');
    };

    newMessage.save()
    .then(message => {
        req.flash('success', 'Message posted successfully.');
        res.redirect('/');
    })
    .catch(err => console.log(err));
};

module.exports.dashboardDeleteMessage = (req, res) => {
    let messageId = req.params.id;
    Message.findOneAndDelete({_id: messageId})
    .then(message => { 
        console.log(`${message._id} deleted`);
        req.flash('success', 'Message deleted.');
        res.redirect('/');
    })
    .catch(err => console.log(err));
};

module.exports.createMessage = (req, res) => {
    res.render('createMessage', {errorMsg: req.flash('error'), successMsg: req.flash('success')});
};