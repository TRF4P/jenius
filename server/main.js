/*jslint node: true */
'use strict';
var express = require('express'),
    routes = require('./routes'),
    app = express();

app.use(express.bodyParser());

app.get('/api/awesomeThings', routes.awesomeThings);

app.use(function(req, res) {
    res.json({
        'ok': false,
        'status': '404'
    });
});



//Schema Building APIs
app.post('/api/createSchemaNode', routes.createSchemaNode);
app.post('/api/createSchemaProperty', routes.createSchemaProperty);
app.get('/api/createSchemaProperty', routes.createSchemaProperty);

app.get('/api/getSchemaNodeList', routes.getSchemaNodeList);
app.post('/api/getSchemaNodeProperties', routes.getSchemaNodeProperties)



module.exports = app;