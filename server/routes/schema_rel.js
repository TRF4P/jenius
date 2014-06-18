var dbCtrl = require('./dbCtrl.js');
exports.getSchemaRels = function(req, res) {
    var params = {};

    query = "MATCH (srcNode:Schema_Node)<-[:source_schema_rel]-",
        "(n:Schema_Relationship)-[:target_schema_rel]->(tgtNode:Schema_Node)",
        "RETURN collect(distinct{",
        "schemaRelId:ID(n),",
        "srcId:ID(srcNode),",
        "tgtId:ID(tgtNode),",
        "relName:n.relationship_name",
        "}) as schemaRels".join('\n');

    dbCtrl.db.query(query, params, function(err, results) {
        res.json({
            results: results,
            error: err
        });
    });

};

exports.createSchemaRel = function(req, res) {
    var params = {};
    params.srcId = req.body.srcId;
    params.tgtId = req.body.tgtId;
    params.relName = req.body.relName;

    query = "START srcNode = node({srcId}), tgtNode=node({tgtId})",
        "CREATE (srcNode:Schema_Node)<-[:source_schema_rel]-(rel:Schema_Relationship{",
        "relationship_name:{relName},",
        "created_on:timestamp()",
        "})-[:target_schema_rel]->(tgtNode:Schema_Node)".join('\n');
};