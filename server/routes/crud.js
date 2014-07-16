var utils = require('./jenius_utils.js');



exports.setExistingVariable = function(varObj) {
    var cypherString = varObj.variableName +
        '=node(' + varObj.variableId + ')';

    return cypherString;
};



exports.reqCreateNode = function(createObj) {
    var cypherString = [
        'CREATE (groupReq)-[:create_request]->(' + createObj.variableName + '_createReq:Create_Request ' + utils.getCreateReq(createObj) + ')',
        '-[:requested_create_node]->',
        '(' + createObj.variableName + ':Pending_Node' + utils.jsonToCypherString(createObj.properties) + ')'
    ].join('');

    return cypherString;
};

exports.approveCreateNode = function(createObj) {
    var returnObj = {};
    returnObj.set = [
        'REMOVE ' + createObj.modifiedObj.variableName + ':Pending_Node',
        'SET ' + createObj.reqObj.variableName + '.request_status=1',
        'SET ' + createObj.reqObj.variableName + '.last_modified=timestamp()',
        'SET ' + createObj.modifiedObj.variableName + ':' + createObj.node_label
    ].join(' \n ');
    return returnObj;
};

exports.reqArchiveNode = function(archiveObj) {
    var cypherString = [
        'CREATE (groupReq)-[:archive_request]->(' + archiveObj.variableName + '_archReq:Archive_Request)-',
        '[:requested_archive_node]->(' + archiveObj.variableName + ')',
        '->(' + archiveObj.variableName + ')'
    ].join('');
    return cypherString;
};

exports.approveArchiveNode = function() {};

exports.reqCreateRelationship = function(relObj) {
    var cypherString = [
        ' CREATE (groupReq)-[:relationship_request]->(' +
        relObj.srcObj.variableName + '_' +
        relObj.tgtObj.variableName +
        '_relReq:Relationship_Request' + utils.getRelReq(relObj) + ')',
        'CREATE (' + relObj.srcObj.variableName + ')<-[:requested_relationship_source]-',
        '(' + relObj.srcObj.variableName + '_' +
        relObj.tgtObj.variableName +
        '_relReq)-[:requested_relationship_target]->(' + relObj.tgtObj.variableName + ')'
    ].join('');
    return cypherString;
};

exports.approveCreateRelationship = function() {};

exports.reqArchiveRelationship = function(relObj) {
    var cypherString = '';
    return cypherString;
};

exports.approveArchiveRelationship = function() {};

exports.deleteRelationship = function(relObj) {
    var cypherString = '';
    return cypherString;
};

exports.reqPropertyEdit = function(propObj) {
    console.log('LINE 67 Crud.js');
    console.log(propObj);
    var cypherString = [
        'CREATE (groupReq)-[:edit_request]->(edit_request_' + propObj.property_name + '_' + propObj.node_id + ':Edit_Request',
        utils.getEditReq(propObj),
        ')-[:requested_edit]->(', propObj.variableName, ')',
    ].join('');
    /*
    var cypherObj = {
        reqObj: {
            variableName: 'edit_request_' + propObj.reqId,
            variableId: propObj.reqId:
        },
        modifiedObj: {
            variableName: prop.nodel_label + '_' + prop.,
            variableId:
        }
    };
    */
    return cypherString;
};

exports.approvePropertyEdit = function(propObj) {
    var returnObj = {};
    returnObj.match = [
        'MATCH (groupReq)-[:edit_request]->(',
        propObj.reqObj.variableName + ')-[:requested_edit]->(',
        propObj.modifiedObj.variableName + ')'
    ].join('');
    returnObj.set = [
        'SET ' + propObj.reqObj.variableName + '.request_status=1',
        'SET ' + propObj.reqObj.variableName + '.last_modified=timestamp()',
        'SET ' + propObj.modifiedObj.variableName + '.' + propObj.node_key + '=' + utils.cis(propObj.new_value),
    ].join('\n');
    return returnObj;
};

exports.createGroupRequest = function(userObj, groupObj) {
    var cypherString = '';
    return cypherString;
};

exports.getPropertyRequest = function(groupObj) {};


exports.getGroupReq = function() {
    cypherString = ['CREATE (groupReq:Group_Request{request_status:0',
        'request_date:timestamp()',
        'last_modified:timestamp()})'
    ].join(', \n');
    return cypherString;
};