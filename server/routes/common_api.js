'use strict';

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

    /**
     *
     * params.nodeId = Whatever the Node Idea is for the object, leave Node ID NULL if you're creating an object
     * params.nodeType = Whatever the node type is
     *
     **/

    var params = {};
    params = req.body;
    if (params.nodeId === null) {
        params.nodeId = 0;
    };
    var query = [
        'MATCH (n)-[r:approved_property]->(p:Schema_Property)',
        'WHERE n.label_name="' + params.nodeType + '"',
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

    var objectResults = {};


    dbCtrl.db.query(query, params, function(err, results) {
        console.log(results);
        objectResults = results[0].objectForm;
        var propertyArray = [];
        for (var i = 0; i < objectResults.length; i++) {
            var value = objectResults[i];
            var property = [
                '{property_name:"' + value.property_name + '",',
                'display_name:"' + value.display_name + '",',
                'is_edittable:' + value.is_edittable + ',',
                'mandatory_field:' + value.mandatory_field + ',',
                'has_multiple_values:' + value.has_multiple_values + ',',
                'select_options:' + JSON.stringify(value.select_options) + ',',
                'priority:' + value.priority + ',',
                'data_type:"' + value.data_type + '",',
                'default_value:' + value.default_value + ',',
                'property_value:' + value.property_value + '',
            ].join('\n') + '} as `' + value.property_name + '`';
            propertyArray.push(property);
        }

        var finalFirstQuery = [
            'START n=node(' + params.nodeId + ')',
            'RETURN '
        ].join('\n');

        var finalQuery = finalFirstQuery + propertyArray.join('\n ,');


        console.log(propertyArray.join('\n'));

        dbCtrl.db.query(finalQuery, function(err, finResults) {
            res.json({
                results: finResults[0],
                error: err,
                query: finalQuery
            });
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