/*jslint node: true */
'use strict';
var express = require('express'),
    routes = require('./routes'),
    app = express();

app.use(express.bodyParser());

app.get('/api/schema_form/awesomeThings', routes.schema_form.awesomeThings);

app.use(function(req, res) {
    res.json({
        'ok': false,
        'status': '404'
    });
});



//Schema Building APIs
app.post('/api/createSchemaNode', routes.schema_node.createSchemaNode);
app.post('/api/createSchemaProperty', routes.schema_property.createSchemaProperty);


app.get('/api/getSchemaNodeList', routes.schema_node.getSchemaNodeList);
app.post('/api/getSchemaNodeProperties', routes.schema_node.getSchemaNodeProperties);

//Common Api

app.post('/api/getJeniusList', routes.common_api.getJeniusList);
app.post('/api/getJeniusObjectForm', routes.common_api.getJeniusObjectForm);

module.exports = app;