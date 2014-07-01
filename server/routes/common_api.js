'use strict';

var dbCtrl = require('./dbCtrl.js');
var crud = require('./crud.js');

var checkForNew = function(isNew) {
    if (isNew === null) {
        return ' MATCH (n:Root_Node) ';
        params.nodeId = dbCtrl.rootId;
    } else {
        return ' START n=node(' + isNew + ') ';
    };
}

var checkForValue = function(theArray) {
    if (theArray.length > 0) {
        return theArray.join(" \n ") + " \n ";
    } else {
        return "";
    }
};

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
    //  if (params.nodeId === null) {
    //      params.nodeId = dbCtrl.rootId;
    //  };
    var query = [
        'MATCH (n)-[r:approved_property]->(p:Schema_Property)',
        'WHERE n.label_name="' + params.nodeType + '"',
        'RETURN collect(distinct{',
        '			property_name:p.property_name,',
        '			display_name:p.display_name,',
        '			is_edittable:p.is_edittable,',
        '			mandatory_field:p.mandatory_field,',
        '			has_multiple_values:p.has_multiple_values,',
        '			select_options:p.select_options,',
        '			priority:p.priority,',
        '           node_label:"' + params.nodeType + '",',
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
                'node_id:ID(n),',
                'node_label:"' + value.node_label + '",',
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
            checkForNew(params.nodeId),
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


exports.submitGroupRequest = function(req, res) {
    var createRequest = req.body;
    var startVariables = [];
    var createNodes = [];
    var archiveNodes = [];
    var newRelationships = [];
    var archiveRelationships = [];
    var editProperties = [];

    for (var i = 0; i < createRequest.variables.length; i++) {
        startVariables.push(crud.setExistingVariable(createRequest.variables[i]));
    }

    for (var i = 0; i < createRequest.createNodes.length; i++) {
        createNodes.push(crud.reqCreateNode(createRequest.createNodes[i]));
    }

    for (var i = 0; i < createRequest.archiveNodes.length; i++) {
        archiveNodes.push(crud.reqArchiveNode(createRequest.archiveNodes[i]));
    }
    for (var i = 0; i < createRequest.newRelationships.length; i++) {
        newRelationships.push(crud.reqNewRel(createRequest.newRelationships[i]));
    }
    for (var i = 0; i < createRequest.archiveRelationships.length; i++) {}
    for (var i = 0; i < createRequest.editProperties.length; i++) {
        editProperties.push(crud.reqPropertyEdit(createRequest.editProperties[i]));
    }

    //dbCtrl.db.query(query, function(err, results) {
    //    res.json({
    //        results: results.data[0],
    //        error: err,
    //        query: query
    //    });
    //});
    var startingQuery = "";
    if (startVariables.length > 0) {
        startingQuery = "START " + startVariables;
    }
    var query = startingQuery + "\n" + crud.getGroupReq() + "\n" + createNodes.join("\n") + editProperties.join("\n") +
        '\n RETURN {groupId:ID(groupReq)} as `request`';
    console.log(query);
    dbCtrl.db.query(query, function(err, results) {
        res.json({
            results: results[0],
            error: err,
            query: query
        });
    });

};

exports.approveGroupRequest = function(req, res) {
    var groupId = req.body.groupId;
    var query = [
        'START groupReq = node(' + groupId + ')',
        'OPTIONAL MATCH  (groupReq)-[:edit_request]->',
        '(edit_requests:Edit_Request)-[:requested_edit]->(node_being_editted)',
        'OPTIONAL MATCH (groupReq)-[:create_request]->(create_requests:Create_Request)',
        '-[:requested_create_node]->(node_being_created)',
        'OPTIONAL MATCH  (groupReq)-[:archive_request]->(archive_requests:Archive_Request)',
        '-[:requested_archive_node]->(node_being_archived)',
        'OPTIONAL MATCH (groupReq)-[:relationship_request]->(relationship_requests:Relationship_Request)',
        '-[:requested_relationship_source]->(relationship_source_node)',
        'OPTIONAL MATCH (groupReq)-[:relationship_request]->(relationship_requests)',
        '-[:requested_relationship_target]->(relationship_target_node)',
        'RETURN collect(distinct {',
        'reqObj:{',
        'variableName:"edit_request_"+ID(edit_requests),',
        'variableId: ID(edit_requests)',
        '},',
        'modifiedObj:{',
        'variableName:lower(head(labels(node_being_editted)))+"_"+ID(node_being_editted),',
        'variableId:ID(node_being_editted)',
        '},',
        'node_key:edit_requests.node_key,',
        'new_value:edit_requests.new_value',
        '}) as `edit_requests`,',

        'collect(distinct{',
        'reqObj:{',
        'variableName:"create_request_"+ID(create_requests),',
        'variableId: ID(create_requests)',
        '},',
        'node_label:create_requests.node_label,',
        'modifiedObj:{',
        'variableName:lower(head(labels(node_being_created)))+"_"+ID(node_being_created),',
        'variableId:ID(node_being_created)',
        '}',
        '}) as `create_requests`,',
        'collect(distinct{',
        'reqId:ID(archive_requests)',
        '}) as `archive_requests`,',
        'collect(distinct{',
        'reqId:ID(relationship_requests)',
        '}) as `relationship_requests`'
    ].join('\n')

    dbCtrl.db.query(query, function(err, results) {
        console.log(JSON.stringify(results[0]));
        var startNodes = [];
        var matchStatements = [];
        var approveCreateNodes = [];
        var approveArchiveNodes = [];
        var approveNewRelationships = [];
        var approveEditProperties = [];
        //if () {
        //    for (var i = 0; i < createRequest.variables.length; i++) {
        //        startVariables.push(crud.setExistingVariable(createRequest.variables[i]));
        //    }
        //}


        if (results[0].create_requests[0].node_label !== null) {
            for (var i = 0; i < results[0].create_requests.length; i++) {
                startNodes.push(results[0].create_requests[i].reqObj.variableName + '= node(' +
                    results[0].create_requests[i].reqObj.variableId + ')');

                startNodes.push(results[0].create_requests[i].modifiedObj.variableName + '= node(' +
                    results[0].create_requests[i].modifiedObj.variableId + ')');
                var createObj = crud.approveCreateNode(results[0].create_requests[i]);
                approveCreateNodes.push(createObj.set);
            }
        }
        /*
        if (results[0].archive_requests[0].reqId !== null) {
            for (var i = 0; i < results[0].archive_requests.length; i++) {
                approveArchiveNodes.push(crud.reqArchiveNode(createRequest.archiveNodes[i]));
            }
        }

        if (results[0].relationship_requests[0].reqId !== null) {
            for (var i = 0; i < results[0].relationship_requests.length; i++) {
                approveNewRelationships.push(crud.reqNewRel(createRequest.newRelationships[i]));
            }
        }

        //if (results[0].archive_relationship_requests[0].reqId !== null) {
        //    for (var i = 0; i < createRequest.archiveRelationships.length; i++) {}
        //}

        */
        if (results[0].edit_requests[0].node_key !== null) {
            for (var i = 0; i < results[0].edit_requests.length; i++) {
                startNodes.push(results[0].edit_requests[i].reqObj.variableName + '= node(' +
                    results[0].edit_requests[i].reqObj.variableId + ')');

                startNodes.push(results[0].edit_requests[i].modifiedObj.variableName + '= node(' +
                    results[0].edit_requests[i].modifiedObj.variableId + ')');

                var appEdit = crud.approvePropertyEdit(results[0].edit_requests[i]);
                //matchStatements.push(appEdit.match);
                approveEditProperties.push(appEdit.set);
            }
        }
        var finalValues = [
            'START groupReq=node(' + groupId + '),',
            startNodes.join(','),
            approveCreateNodes,
            approveEditProperties
        ].join('\n');
        dbCtrl.db.query(finalValues, function(err, finResults) {
            res.json({
                results: finResults,
                secondResults: finalValues,
                error: err,
                query: query,
            });
        });
    });

};

exports.denyGroupRequest = function(req, res) {


};



var testObj = {};
testObj.body = {};
testObj.body.nodeId = 14;
//exports.getJeniusObjectForm(testObj);