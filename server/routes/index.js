/*jslint node: true */
'use strict';

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://localhost:7474');


exports.awesomeThings = function(req, res) {
    res.json([
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma',
        'Express'
    ]);
};


// Schema Generation Functions
exports.createSchemaNode = function(req, res) {

    console.log(req.body.name);
    var query = [
        // 'START n=node(*)',
        // 'RETURN {labelName:n.label_name,labelDescription:n.label_description} as res'
        'CREATE (n:Schema_Node{',
        'label_name:"' + req.body.labelName + '",',
        'description:"' + req.body.description + '"',
        '})',
        'RETURN n.label_name+" created"'

    ].join('\n');

    console.log(query);
    db.query(query, function(err, results) {
        res.json({
            results: results,
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
    db.query(query, function(err, results) {
        res.json({
            results: results,
            error: err
        });
    });
};

exports.createSchemaProperty = function(req, res) {
    var po = {};
    po.property_name = req.body.propertyName;
    po.display_name = req.body.displayName;
    po.is_edittable = req.body.isEdittable;
    po.mandatory_field = req.body.mandatoryField;
    po.has_multiple_values = req.body.hasMultipleValues;
    po.select_options = req.body.selectOptions;
    po.priority = req.body.priority;
    po.data_type = req.body.dataType;
    var params = {};
    params.nodeId = req.body.nodeId;
    params.po = po;
    var query = [
        'START n=node({nodeId})',
        'MATCH (n:Schema_Node)',
        'CREATE (n)-[:approved_property]->(p:Schema_Property{po})',
        'RETURN p.property_name as approvedProperty'

    ].join('\n');

    console.log(query);

    db.query(query, params, function(err, results) {
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

    db.query(query, params, function(err, results) {
        res.json({
            results: results,
            error: err
        });
    });
};

exports.getSchemaRels = function(req, res){
  var params={};
  
  query = "MATCH (srcNode:Schema_Node)<-[:source_schema_rel]-",
          "(n:Schema_Relationship)-[:target_schema_rel]->(tgtNode:Schema_Node)",
          "RETURN collect(distinct{",
          "schemaRelId:ID(n),",
          "srcId:ID(srcNode),",
          "tgtId:ID(tgtNode),",
          "relName:n.relationship_name",
          "}) as schemaRels".join('\n');
        
        db.query(query, params, function(err, results) {
        res.json({
            results: results,
            error: err
        });
    });  
          
};

exports.getSchemaNodeRels = function(req, res){
  var params={};
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
          
    db.query(query, params, function(err, results) {
        res.json({
            results: results,
            error: err
        });
    });    
          
};



//exports.createSchemaProperty();
