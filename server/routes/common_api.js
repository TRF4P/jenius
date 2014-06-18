var dbCtrl = require('./dbCtrl.js');

exports.getJeniusList = function(req, res) {
    var params = {};
    console.log(req.body);
    params.nodeLabel = req.body.nodeLabel;
    params.fieldKey = req.body.fieldKey;
    var query = [
        'MATCH (n:' + params.nodeLabel + ')',
        'RETURN collect({',
        'nodeId:ID(n),',
        'nodeLabel:head(labels(n)),',
        'nodeName:n.' + params.fieldKey + '}) as `nodeList`'

    ].join('\n');

    console.log(query);

    dbCtrl.db.query(query, params, function(err, results) {
        console.log("HI");
        res.json({
            results: results[0].nodeList,
            error: err,
            query: query
        });
    });
};

exports.getJeniusObjectForm = function(req, res) {
    var params = req.body;
    if (params.nodeId == null) {
        params.nodeId = 0;
    };
    var query = [

        'START n=node({nodeId})',
        'MATCH (n)-[r:approved_property]->(p:Schema_Property)',
        'WHERE n.label_name="Schema_Node"',
        'RETURN collect(distinct{',
        '			property_name:p.property_name,',
        '			display_name:p.display_name,',
        '			is_edittable:p.is_edittable,',
        '			mandatory_field:p.pandatory_field,',
        '			has_multiple_values:p.has_multiple_values,',
        '			select_options:p.select_options,',
        '			priority:p.priority,',
        '			data_type:p.data_type,',
        '			default_value:p.default_value,',
        '			property_value:"n."+p.property_name',
        ' }) as objectForm'

    ].join('\n');

    console.log(query);

    dbCtrl.db.query(query, params, function(err, results) {
        console.log(results);
        res.json({
            results: results[0],
            error: err,
            query: query
        });
    });
};

exports.createGroupRequest = function(req, res) {};
exports.approveGroupRequest = function(req, res) {};
exports.denyGroupRequest = function(req, res) {};


var testObj = {};
testObj.body = {};
testObj.body.nodeId = 14;
//exports.getJeniusObjectForm(testObj);