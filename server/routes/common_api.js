'use strict';

var dbCtrl = require('./dbCtrl.js');
var crud = require('./crud.js');
var utils = require('./jenius_utils.js');


var checkForValue = function(theArray) {
    if (theArray.length > 0) {
        return theArray.join(" \n ") + " \n ";
    } else {
        return "";
    }
};

exports.getJeniusList = function(req, res) {
    var params = {};

    params.nodeLabel = req.body.nodeLabel;
    params.fieldKey = req.body.fieldKey;
    var query = [
        'MATCH (n:' + params.nodeLabel + ')',
        'RETURN collect({',
        'nodeId:ID(n),',
        'nodeLabel:head(labels(n)),',
        'nodeName:n.' + params.fieldKey + '}) as `nodeList`'

    ].join('\n');


    dbCtrl.db.query(query, params, function(err, results) {

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
        'RETURN collect(distinct ' + utils.getEmptyProperty(params.nodeType) + ' ) as objectForm'
    ].join('\n');
    //  console.log(query);
    var objectResults = {};


    dbCtrl.db.query(query, params, function(err, results) {

        objectResults = results[0].objectForm;
        var propertyArray = [];
        for (var i = 0; i < objectResults.length; i++) {
            propertyArray.push(
                utils.getBoundProperty(objectResults[i])
            );
        }

        var finalFirstQuery = [
            utils.checkForNew(params.nodeId),
            'RETURN '
        ].join('\n');

        var finalQuery = finalFirstQuery + propertyArray.join('\n ,');
        // console.log(finalQuery);
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
        newRelationships.push(crud.reqCreateRelationship(createRequest.newRelationships[i]));
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
    var query = startingQuery + "\n" +
        crud.getGroupReq() + "\n" +
        createNodes.join(" \n ") +
        newRelationships.join(' \n ') +
        editProperties.join(" \n ") +
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
        'srcObj:{',
        'variableName:lower(head(labels(relationship_source_node)))+"_"+ID(relationship_source_node),',
        'variableId: ID(relationship_source_node)',
        '},',
        'tgtObj:{',
        'variableName:lower(head(labels(relationship_target_node)))+"_"+ID(relationship_target_node),',
        'variableId: ID(relationship_target_node)',
        '},',
        'reqObj:{',
        'variableName:lower(head(labels(relationship_requests)))+"_"+ID(relationship_requests),',
        'variableId: ID(relationship_requests)},',
        'query:"CREATE ("+lower(head(labels(relationship_source_node)))+"_"+ID(relationship_source_node)+"' +
        ')-[:"+relationship_requests.relationship_type+"]->("+' +
        'lower(head(labels(relationship_target_node)))+"_"+ID(relationship_target_node)+")"' +
        '}) as `relationship_requests`'
    ].join('\n')
    console.log(query);
    dbCtrl.db.query(query, function(err, results) {

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

        if (results[0].relationship_requests[0].reqObj.variableId !== null) {
            for (var i = 0; i < results[0].relationship_requests.length; i++) {
                startNodes.push(results[0].relationship_requests[i].reqObj.variableName + '= node(' +
                    results[0].relationship_requests[i].reqObj.variableId + ')');

                startNodes.push(results[0].relationship_requests[i].srcObj.variableName + '= node(' +
                    results[0].relationship_requests[i].srcObj.variableId + ')');

                startNodes.push(results[0].relationship_requests[i].tgtObj.variableName + '= node(' +
                    results[0].relationship_requests[i].tgtObj.variableId + ')');
                approveNewRelationships.push(results[0].relationship_requests[i].query);
            }
        }
        /* 

        if (results[0].archive_requests[0].reqId !== null) {
            for (var i = 0; i < results[0].archive_requests.length; i++) {
                approveArchiveNodes.push(crud.reqArchiveNode(createRequest.archiveNodes[i]));
            }
        }
        if (results[0].archive_relationship_requests[0].reqId !== null) {
            for (var i = 0; i < createRequest.archiveRelationships.length; i++) {}
        }

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
        var startNodes = startNodes.reduce(function(a, b) {
            if (a.indexOf(b) < 0) a.push(b);
            return a;
        }, []);
        var finalValues = [
            'START groupReq=node(' + groupId + '),',
            startNodes.join(','),
            approveCreateNodes,
            approveEditProperties,
            approveNewRelationships.join(" \n ")
        ].join('\n');
        console.log(finalValues);
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