exports.setExistingVariable = function(varObj) {
    var cypherString = varObj.variableName +
        '=node(' + varObj.variableId + ')';

    return cypherString;
};

exports.createNode = function(createObj) {
    var cypherString = 'CREATE (' + createObj.variableName + ':' +
        createObj.variableLabel + createObj.properties + ')';

    return cypherString;
};

exports.archiveNode = function(archiveObj) {

    return cypherString;
};

exports.createRelationship = function(relObj) {

    return cypherString;
};

exports.archiveRelationship = function(relObj) {

    return cypherString;
};

exports.deleteRelationship = function(relObj) {

    return cypherString;
};

exports.changeProperty = function(propObj) {

    return cypherString;
};


exports.createGroupRequest = function(groupObj) {};

exports.getPropertyRequest = function(groupObj) {};


//create (g:Group_Request)