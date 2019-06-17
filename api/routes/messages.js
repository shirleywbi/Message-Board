var express = require('express');
var router = express.Router();

const messages = [
        {
            name: 'Rick',
            text: 'We\'re no strangers to love. You know the rules and so do I. ' +
            'A full commitment\'s what I\'m thinking of. You wouldn\'t get this from any other guy.',
            date: "6/2/2019 11:45:00",
            key: "622019114500"
        },
        {
            name: 'Richard',
            text: 'I just wanna tell you how I\'m feeling... Gotta make you understand...',
            date: "6/2/2019 11:45:30",
            key: "622019114530"
        },
        {
            name: 'Paul',
            text: 'Never gonna give you up. Never gonna let you down. ' +
            'Never gonna run around and desert you. Never gonna make you cry. ' +
            'Never gonna say goodbye.',
            date: "6/2/2019 11:50:00",
            key: "622019115000"
        },
        {
            name: 'Rick Astley',
            text: 'Never gonna tell a lie and hurt you.',
            date: "6/3/2019 9:45:00",
            key: "63201994500"
        }];

// GET messages
router.get('/', function(req, res, next) {
    res.json(messages);
});

// GET individual message
router.get('/:id', function(req, res, next) {
    let id = req.params.id;
    let message = messages.filter(msg => {
        return (msg.key).toString() === id;
    });
    res.json(message);
});

// POST message
router.post('/', function(req, res, next) {
    let new_message = req.body;
    messages.push(new_message);
    res.json(new_message);
});

// DELETE message
router.delete('/:id', function(req, res, next) {
    let index = req.body;
    messages.splice(index, 1);
    res.json(messages);
});

// DELETE ALL message
router.delete('/', function(req, res, next) {
    messages = [];
    res.json(messages);
});



module.exports = router;