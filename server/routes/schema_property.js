var dbCtrl = require('./dbCtrl.js');

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

    dbCtrl.db.query(query, params, function(err, results) {
        res.json({
            results: results,
            error: err
        });
    });
};