var dbCtrl = require('./dbCtrl.js');

exports.createSchemaNode = function(req, res) {

    console.log(req.body.name);
    var query = [
        'CREATE (n:Schema_Node{',
        'label_name:"' + req.body.labelName + '",',
        'description:"' + req.body.description + '"',
        '})',
        'RETURN n.label_name+" created"'
    ].join('\n');

    console.log(query);
    dbCtrl.db.query(query, function(err, results) {
        res.json({
            results: results,
            error: err
        });
    });
};

exports.getSchemaNodeRels = function(req, res) {
    var params = {};
    params.nodeId = req.body.nodeId;

    query = "START n=node({nodeId})",
        "MATCH (n:Schema_Node)<-[ren:target_schema_rel|source_schema_rel]-(r:Schema_Relationship)",
        "-[ret:target_schema_rel|source_schema_rel]->(otherNode:Schema_Node)",
        "RETURN collect(distinct{",
        "schemaRelId:ID(r),",
        "direction:type(ren)"
    "schemaNodeId:ID(n),",
        "otherNodeId:ID(otherNode),",
        "relName:r.relationship_name",
        "}) as schemaNodeRels".join('\n');

    dbCtrl.db.query(query, params, function(err, results) {
        res.json({
            results: results,
            error: err
        });
    });

};

exports.getSchemaNodeProperties = function(req, res) {
    var params = {};
    params.nodeId = req.body.nodeId;
    var query = [
        'START n=node({nodeId})',
        'MATCH (n)-[:approved_property]->(p:Schema_Property)',
        'RETURN collect({',
        'nodeId:ID(p),',
        'propertyName:p.property_name,',
        'displayName:p.display_name,',
        'isEdittable:p.is_edittable,',
        'mandatoryField:p.mandatoryField,',
        'has_multiple_values:p.hasMultipleValues,',
        'selectOptions:p.select_options,',
        'priority:p.priority,',
        'dataType:p.data_type',
        '}) as approvedProperties'

    ].join('\n');

    console.log(query);

    dbCtrl.db.query(query, params, function(err, results) {
        res.json({
            results: results[0].approvedProperties,
            error: err
        });
    });
};

exports.getSchemaNodeList = function(req, res) {

    console.log(req.body.name);
    var query = [
        'MATCH (n:Schema_Node)',
        'RETURN collect({nodeLabel:n.label_name,nodeId:ID(n)}) as nodeList'

    ].join('\n');

    console.log(query);
    dbCtrl.db.query(query, function(err, results) {
        res.json({
            results: results,
            error: err
        });
    });
};