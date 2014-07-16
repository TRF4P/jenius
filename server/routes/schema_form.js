var dbCtrl = require('./dbCtrl.js');
var crud = require('./crud.js');
var utils = require('./jenius_utils.js');
var models = require('./object_models.js');

exports.getJeniusForm = function(req, res) {
    var params = {};
    params = req.body;
    var startQuery = [
        'START user=node(' + dbCtrl.adminUser + ')',
        'MATCH (user)-[:has_attribute]->(attr:Access_Attribute)',
        '<-[:required_attribute]-(form:Schema_Form{form_name:' + utils.cis(params.form_name) + '})'
    ];

    var matchFormObject = [
        'OPTIONAL MATCH (form)-[:form_object]->(obj:Schema_Form_Object)',
        '-[:object_property]->(p:Schema_Property)<-[:approved_property]',
        '-(scNode:Schema_Node)'
    ];

    var matchFormRel = [
        'OPTIONAL MATCH (form)-[:form_relationship]->(relFormObj:Schema_Form_Relationship)',
        '-[:reference_relationship]->(schemaRel:Schema_Relationship)',
        'OPTIONAL MATCH (tgtRelObj:Schema_Node)-[:approved_property]->(tgtRelProp:Schema_Property)',
        '<-[:form_target]-(relFormObj)-[:form_source]->(srcRelProp:Schema_Property)',
        '<-[:approved_property]-(srcRelObj:Schema_Node)'
    ];
    var returnFormObject = [
        'distinct {',
        'form_object_id:ID(obj),',
        'variableName:"schema_form_object_"+ID(obj),',
        'editType:obj.edit_type,',
        'isNew:obj.is_new,',
        'form_object_name:obj.object_name,',
        'node_label:obj.node_label,',
        'isEmpty:false,',
        'properties:collect(' + utils.getEmptyPropertySchemaForm('#ignore#scNode.node_label') + ')} as `formObject`'
    ];

    var returnFormRel = [
        '{',
        ' relationship_form_name:relFormObj.relationship_form_name,',
        '	relationship_type: schemaRel.relationship_type,',
        '	editType: relFormObj.edit_type,',
        '	source_list: {',
        '	nodeLabel: srcRelObj.label_name,',
        '	fieldKey: srcRelProp.property_name,',
        '	localList: relFormObj.load_source_list',
        '},',
        'target_list: {',
        '	nodeLabel: tgtRelObj.label_name,',
        '	fieldKey: tgtRelProp.property_name,',
        '	localList: relFormObj.load_target_list',
        '}} as `formRel`'
    ];

    var formQuery = [
        startQuery.join('\n'),
        matchFormObject.join('\n'),
        matchFormRel.join('\n'),
        ' RETURN ',
        returnFormObject.join('\n')
    ].join('\n');

    var relQuery = [
        startQuery.join('\n'),
        matchFormRel.join('\n'),
        ' RETURN ',
        returnFormRel.join('\n')
    ].join('\n');



    dbCtrl.db.query(formQuery, params, function(err, objResults) {
        dbCtrl.db.query(relQuery, params, function(err, relResults) {

            var schema_form = models.schema_form();
            var formQuery2 = evaluateFormObject(objResults);
            dbCtrl.db.query(formQuery2, function(err, objProps) {

                for (var i = 0; i < objProps[0].objProps.length; i++) {
                    objResults[i].formObject.properties = objProps[0].objProps[i];
                }
                schema_form.form_relationships = setFormRels(relResults, 'formRel');
                schema_form.form_objects = setFormObjs(objResults, 'formObject');
                res.json({
                    results: schema_form,
                    error: err
                });
            });
        });
    });
};

var setFormRels = function(formRels, key) {
    var result = {};
    for (var i = 0; i < formRels.length; i++) {
        result[formRels[i][key].relationship_form_name] = formRels[i][key];
    };
    return result;
};
var setFormObjs = function(formObjs, key) {
    var result = {};
    for (var i = 0; i < formObjs.length; i++) {
        result[formObjs[i][key].form_object_name] = formObjs[i][key];
    };
    return result;
};

var evaluateFormObject = function(formObjs, startNodes) {
    var stagingPayload = {
        startNodes: '',
        returnProperties: [],
        formQuery: "",
        anyNew: false,
        anyExisting: false
    };
    for (var i = 0; i < formObjs.length; i++) {
        var propertyArray = [];
        var variableName = formObjs[i].formObject.form_object_name;
        if (formObjs[i].formObject.isNew === true) {
            stagingPayload.anyNew = true;
            variableName = 'newNode';
            for (var p = 0; p < formObjs[i].formObject.properties.length; p++) {
                formObjs[i].formObject.properties[p].property_value = 'newNode' +
                    formObjs[i].formObject.properties[p].property_value;
            }
        } else if (formObjs[i].formObject.isNew === false) {
            stagingPayload.anyExisting = true;
            for (var p = 0; p < formObjs[i].formObject.properties.length; p++) {
                formObjs[i].formObject.properties[p].property_value = formObjs[i].formObject.form_object_name +
                    formObjs[i].formObject.properties[p].property_value;
            }
        } else {
            console.log('LE ISSUU BRAH');
            console.log(formObjs[i].formObject);
        }
        // var pKeys = Object.keys(formObjs[i].formObject.properties);
        // console.log(pKeys);
        console.log(JSON.stringify(formObjs[i].formObject));
        for (var p = 0; p < formObjs[i].formObject.properties.length; p++) {
            propertyArray.push(utils
                .getBoundPropertyNoVariable(formObjs[i]
                    .formObject
                    .properties[p], 'ID(' + variableName + ')'));
        }
        // result[formObjs[i][key].object_form_name] = formObjs[i][key];
        console.log('\n \n \n Line 205, no clues! \n \n \n');
        // console.log('\n \n \n ' + propertyObject + '\n \n \n');
        stagingPayload.returnProperties.push('{' + propertyArray.join(',') + '}');
    };

    if (stagingPayload.anyExisting === true) {
        startNodes = 'START' + startNodes.join(', ');
    } else {
        startNodes = '';
    }
    var formQuery = [
        startNodes,
        'MATCH (newNode:Root_Node)',
        'RETURN [',
        stagingPayload.returnProperties.join(',\n'),
        '] as `objProps`'
    ].join('\n');

    return formQuery;

};


exports.awesomeThings = function(req, res) {
    res.json([
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma',
        'Express'
    ]);
};