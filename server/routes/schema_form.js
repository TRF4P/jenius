var dbCtrl = require('./dbCtrl.js');

exports.awesomeThings = function(req, res) {
    res.json([
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma',
        'Express'
    ]);
};