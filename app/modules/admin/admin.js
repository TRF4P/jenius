'use strict';

angular.module('jeniusApp')
    .controller('AdminCtrl', function($scope, CommonServices, JeniusCrud, $filter) {
        //  $scope.selectedObject = {};
        // $scope.selectedObject.isEmpty = true;
        // $scope.selectedObject.properties = {};

        $scope.schemaNodeList = {
            nodeLabel: 'Schema_Node',
            fieldKey: 'label_name'
        };
        $scope.testNodeList = angular.copy($scope.schemaNodeList);
        $scope.srcRelNodeList = angular.copy($scope.schemaNodeList);
        $scope.tgtRelNodeList = angular.copy($scope.schemaNodeList);
        $scope.tgtTestList = angular.copy($scope.schemaNodeList);
        $scope.srcTestList = angular.copy($scope.schemaNodeList);
        $scope.schemaNodePropertyList = {
            nodeLabel: 'Schema_Property',
            fieldKey: 'display_name'
        };
        $scope.relList = {
            nodeLabel: 'Schema_Relationship',
            fieldKey: 'relationship_type'
        };

        $scope.resetTestRelationship = function() {};
        $scope.submitTestRelationship = function() {
            var gr = CommonServices.getGroupRequestObject();
            var cr = CommonServices.getCreateRequestObject();
            var srcRel = CommonServices.getRelRequestObject();
            srcRel.relationship_type = $scope.relList.selectedNode.nodeName;
            srcRel.srcObj.variableName = $scope.srcObjectList.nodeLabel.toLowerCase() + '_' +
                $scope.srcObjectList.selectedNode.nodeId;
            srcRel.srcObj.variableId = $scope.srcObjectList.selectedNode.nodeId;
            srcRel.tgtObj.variableId = $scope.tgtObjectList.selectedNode.nodeId;
            srcRel.tgtObj.variableName = $scope.tgtObjectList.nodeLabel.toLowerCase() + '_' +
                $scope.tgtObjectList.selectedNode.nodeId;
            gr.newRelationships.push(srcRel);
            gr.variables.push(srcRel.srcObj);
            gr.variables.push(srcRel.tgtObj);
            console.log(gr);

            CommonServices.submitGroupRequest(gr)
                .success(function(data) {
                    console.log(data);
                    $scope.newTestRel = {};
                    $scope.newTestRel.createId = data.results.request.groupId;
                    $scope.newTestRel.createReady = true;
                });
        };

        $scope.approveTestRelationship = function() {
            var payload = {
                groupId: $scope.newTestRel.createId
            };
            CommonServices.approveGroupRequest(payload)
                .success(function(data) {
                    console.log(data);
                    $scope.newTestRel.createReady = false;
                });
        };

        $scope.resetSchemaRel = function() {
            var payload = {};
            payload.nodeId = null;
            payload.nodeType = 'Schema_Relationship';
            CommonServices.getJeniusObjectForm(payload)
                .success(function(data) {
                    console.log(data);
                    $scope.newSchemaRelObject = {
                        node_label: 'Schema_Relationship',
                        editType: 'groupEdit',
                        isNew: true,
                        isEmpty: false,
                        properties: data.results
                    };
                });
        };
        $scope.submitSchemaRel = function() {
            var isReady = JeniusCrud.reviewCreate($scope.newSchemaRelObject.properties);
            if (isReady === true) {
                //cr means create request
                var gr = CommonServices.getGroupRequestObject();
                var cr = CommonServices.getCreateRequestObject();
                var srcRel = CommonServices.getRelRequestObject();
                var tgtRel = CommonServices.getRelRequestObject();
                cr.variableName = 'new_' + $scope.newSchemaRelObject.node_label.toLowerCase();
                cr.node_label = $scope.newSchemaRelObject.node_label;
                srcRel.relationship_type = 'schema_relationship_source';
                srcRel.srcObj.variableName = cr.variableName;
                srcRel.srcObj.variableId = null;
                srcRel.tgtObj.variableId = $scope.srcRelNodeList.selectedNode.nodeId;
                srcRel.tgtObj.variableName = $scope.srcRelNodeList.selectedNode.nodeLabel.toLowerCase() + '_' +
                    $scope.srcRelNodeList.selectedNode.nodeId;


                tgtRel.relationship_type = 'schema_relationship_source';
                tgtRel.srcObj.variableName = cr.variableName;
                tgtRel.srcObj.variableId = null;
                tgtRel.tgtObj.variableId = $scope.tgtRelNodeList.selectedNode.nodeId;
                tgtRel.tgtObj.variableName = $scope.tgtRelNodeList.selectedNode.nodeLabel.toLowerCase() + '_' +
                    $scope.tgtRelNodeList.selectedNode.nodeId;

                angular.forEach($scope.newSchemaRelObject.properties, function(propVal, propKey) {
                    if (propVal.changed_value !== null) {
                        cr.properties[propVal.property_name] = propVal.changed_value;
                    }
                });
                gr.createNodes.push(cr);
                gr.newRelationships.push(srcRel);
                gr.newRelationships.push(tgtRel);
                gr.variables.push(srcRel.tgtObj);
                gr.variables.push(tgtRel.tgtObj);
                console.log(gr);

                CommonServices.submitGroupRequest(gr)
                    .success(function(data) {
                        console.log(data);
                        $scope.newSchemaRelObject.createId = data.results.request.groupId;
                        $scope.newSchemaRelObject.createReady = true;

                    });

            } else {
                alert("Fields still need added");

            }
        };

        $scope.approveSchemaRel = function() {
            var payload = {
                groupId: $scope.newSchemaRelObject.createId
            };
            CommonServices.approveGroupRequest(payload)
                .success(function(data) {
                    console.log(data);
                    $scope.resetSchemaRel();
                });
        };
        $scope.denySchemaRel = function() {};

        $scope.generateNewSchemaNode = function() {
            var payload = {};
            payload.nodeId = null;
            payload.nodeType = 'Schema_Node';
            CommonServices.getJeniusObjectForm(payload)
                .success(function(data) {
                    console.log(data);
                    $scope.newSchemaNode = {
                        node_label: 'Schema_Node',
                        editType: 'singleEdit',
                        isNew: true,
                        isEmpty: false,
                        properties: data.results
                    };
                });
        };

        $scope.$watch('schemaNodeList.selectedNode', function(newValue, oldValue) {
            if (typeof newValue == 'object') {
                var payload = newValue;
                var formload = newValue;
                formload.nodeType = formload.nodeLabel;
                CommonServices.getJeniusObjectForm(payload)
                    .success(function(data) {
                        $scope.selectedObject = {
                            properties: data.results,
                            isEmpty: false,
                            node_id: payload.nodeId,
                            node_label: 'Schema_Node',
                            editType: 'singleEdit'
                        };
                    });
                CommonServices.getSchemaNodeProperties(payload)
                    .success(function(data) {
                        console.log(data.results);
                        $scope.schemaNodeProperties = data.results;
                        $scope.propertiesLoaded = true;
                    });
            };

        });

        $scope.$watch('existingNodeList.selectedNode', function(newValue, oldValue) {
            if (typeof newValue == 'object') {
                var payload = {
                    nodeType: newValue.nodeLabel,
                    nodeId: newValue.nodeId
                };
                CommonServices.getJeniusObjectForm(payload)
                    .success(function(data) {
                        $scope.existingTestObject = {
                            properties: data.results,
                            isEmpty: false,
                            isNew: false,
                            node_id: newValue.nodeId,
                            node_label: newValue.nodeLabel,
                            editType: 'singleEdit'
                        };
                    });
            };

        });

        $scope.$watch('testNodeList.selectedNode', function(newValue, oldValue) {
            if (typeof newValue == 'object') {
                console.log(newValue);
                $scope.existingNodeList = {
                    nodeLabel: newValue.nodeName,
                    fieldKey: 'label_name'
                };
                var payload = {
                    nodeType: newValue.nodeName,
                    nodeId: null
                };
                CommonServices.getJeniusObjectForm(payload)
                    .success(function(data) {
                        $scope.testFieldKeys = angular.copy(data.results);
                        $scope.selectedTestObject = {
                            properties: data.results,
                            isEmpty: false,
                            isNew: true,
                            node_id: payload.nodeId,
                            node_label: payload.nodeType,
                            editType: 'singleEdit'
                        };
                    });
            };

        });

        $scope.$watch('srcTestList.selectedNode', function(newValue, oldValue) {
            if (typeof newValue == 'object') {
                console.log(newValue);
                $scope.srcObjectList = {
                    nodeLabel: newValue.nodeName,
                    fieldKey: 'label_name'
                };
                var payload = {
                    nodeType: newValue.nodeName,
                    nodeId: null
                };
                CommonServices.getJeniusObjectForm(payload)
                    .success(function(data) {
                        $scope.srcFieldKeys = angular.copy(data.results);
                    });
            };

        });

        $scope.$watch('tgtTestList.selectedNode', function(newValue, oldValue) {
            if (typeof newValue == 'object') {
                console.log(newValue);
                $scope.tgtObjectList = {
                    nodeLabel: newValue.nodeName,
                    fieldKey: 'label_name'
                };
                var payload = {
                    nodeType: newValue.nodeName,
                    nodeId: null
                };
                CommonServices.getJeniusObjectForm(payload)
                    .success(function(data) {
                        $scope.tgtFieldKeys = angular.copy(data.results);
                    });
            };

        });
        $scope.createProperty = function() {
            var payload = {
                nodeType: 'Schema_Property',
                nodeId: null
            };
            CommonServices.getJeniusObjectForm(payload)
                .success(function(data) {
                    console.log(data);

                    $scope.newProperty = {
                        properties: data.results,
                        isNew: true,
                        isEmpty: false,
                        node_label: 'Schema_Property',
                        editType: 'groupEdit'

                    };
                    $scope.selectedProperty = 'newProperty';
                });

        };
        $scope.submitNewProperty = function() {
            var isReady = JeniusCrud.reviewCreate($scope.newProperty.properties);
            if (isReady === true) {
                //cr means create request
                var gr = CommonServices.getGroupRequestObject();
                var cr = CommonServices.getCreateRequestObject();
                var rr = CommonServices.getRelRequestObject();
                cr.variableName = 'new_' + $scope.newProperty.node_label.toLowerCase();
                cr.node_label = $scope.newProperty.node_label;
                rr.relationship_type = 'approved_property';
                rr.srcObj.variableName = $scope.selectedObject.node_label.toLowerCase() + '_' +
                    $scope.selectedObject.node_id;
                rr.srcObj.variableId = $scope.selectedObject.node_id;
                rr.tgtObj.variableName = cr.variableName;

                angular.forEach($scope.newProperty.properties, function(propVal, propKey) {
                    if (propVal.changed_value !== null) {
                        cr.properties[propVal.property_name] = propVal.changed_value;
                    }
                });
                gr.createNodes.push(cr);
                gr.newRelationships.push(rr);
                gr.variables.push(rr.srcObj);
                console.log(gr);

                CommonServices.submitGroupRequest(gr)
                    .success(function(data) {
                        console.log(data);
                        $scope.newProperty.createId = data.results.request.groupId;
                        $scope.newProperty.createReady = true;

                    });

            } else {
                alert("Fields still need added");

            }

        };
        $scope.approveNewProperty = function() {
            var payload = {
                groupId: $scope.newProperty.createId
            };
            CommonServices.approveGroupRequest(payload)
                .success(function(data) {
                    console.log(data);
                });
        };
        $scope.denyNewProperty = function() {};

        $scope.loadProperty = function(propKey) {
            console.log(propKey);
            console.log($scope.schemaNodeProperties[propKey]);
            if ($scope.schemaNodeProperties[propKey].jof.isEmpty === true) {
                var payload = {
                    nodeType: 'Schema_Property',
                    nodeId: $scope.schemaNodeProperties[propKey].node_id
                };
                console.log('its not loaded');
                CommonServices.getJeniusObjectForm(payload)
                    .success(function(data) {
                        console.log(data);
                        $scope.schemaNodeProperties[propKey].jof = {
                            properties: data.results,
                            node_id: payload.nodeId,
                            isEmpty: false,
                            isNew: false,
                            node_label: 'Schema_Property',
                            editType: 'singleEdit'
                        };
                    });
            };
        };

        $scope.resetSchemaRel();
    });