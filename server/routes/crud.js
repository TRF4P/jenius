var jsonToCypherString = function(jsonObj) {
    var objKeys = Object.keys(jsonObj);
    var bodyString = [];
    for (var i = 0; i < objKeys.length; i++) {
        bodyString.push(objKeys[i] + ':' + cis(jsonObj[objKeys[i]]));
    }

    return '{' + bodyString.join(',') + '}';
};

getRelReq = function(prop) {
    cypherString = ['{',
        'request_status:0',
        'request_date:timestamp()',
        'last_modified:timestamp()',
        'relationship_type:',
        '}'
    ].join(', \n');
    return cypherString;
};

exports.setExistingVariable = function(varObj) {
    var cypherString = varObj.variableName +
        '=node(' + varObj.variableId + ')';

    return cypherString;
};

exports.reqCreateNode = function(createObj) {
    var cypherString = [
        'CREATE (groupReq)-[:create_request]->(' + createObj.variableName + '_createReq:Create_Request ' + getCreateReq(createObj) + ')',
        '-[:requested_create_node]->',
        '(' + createObj.variableName + ':Pending_Node' + jsonToCypherString(createObj.properties) + ')'
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
        'CREATE (groupReq)-[:relationship_request]->(' + relObj.variableName + '_relReq:Relationship_Request)',
        'CREATE (' + relObj.variableName + ')<-[:requested_relationship_source]-',
        '(' + relObj.variableName + '_relReq)-[:requested_relationship_target]->()-'
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
        getEditReq(propObj),
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
        'SET ' + propObj.modifiedObj.variableName + '.' + propObj.node_key + '=' + cis(propObj.new_value),
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


getCreateReq = function(createObj) {
    cypherString = ['{request_status:0',
        'request_date:timestamp()',
        'last_modified:timestamp()',
        'node_label:"' + createObj.node_label + '"}'
    ].join(', \n');
    return cypherString;
};

getEditReq = function(propObj) {
    cypherString = ['{request_status:0',
        'request_date:timestamp()',
        'last_modified:timestamp()',
        'node_label:"' + propObj.node_label + '"',
        'node_key:"' + propObj.property_name + '"',
        'old_value:"' + propObj.property_value + '"',
        'new_value:' + cis(propObj.changed_value) + '',
        'data_type:"' + propObj.data_type + '"',
        'edit_comment:"' + propObj.edit_comment + '"}'
    ].join(', \n');
    return cypherString;
};
//Check if String (CIS)
cis = function(value) {
    if (isNaN(value) === true) {
        return '"' + value + '"';
    } else {
        return value;
    };
};

//create (g:Group_Request