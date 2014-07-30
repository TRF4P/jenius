'use strict';

angular.module('jeniusApp')
    .controller('AdminCtrl', function($scope, CommonServices, JeniusCrud, $filter, RequestFactory) {
        //  $scope.selectedObject = {};
        // $scope.selectedObject.isEmpty = true;
        // $scope.selectedObject.properties = {};
        $scope.selectedFormObject = null;
        $scope.schemaNodeList = {
            nodeLabel: 'Schema_Node',
            fieldKey: 'label_name'
        };
        $scope.schemaFormList = {
            nodeLabel: 'Schema_Form',
            fieldKey: 'form_name'
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
        var test1 = {
            form_name: 'test1'
        };


        $scope.resetTestRelationship = function() {};

        $scope.submitTestRelationship = function() {
            var testRelReq = RequestFactory.getRequestObject();
            testRelReq.addNewRelationship(
                $scope.srcObjectList.selectedNode.submitObj,
                $scope.relList.selectedNode.nodeName,
                $scope.tgtObjectList.selectedNode.submitObj);
            testRelReq.submit()
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
                        submitObj: data.submitObj,
                        isNew: true,
                        isEmpty: false,
                        properties: data.results
                    };
                });
        };
        $scope.submitSchemaRel = function() {
            var schemaRelReq = RequestFactory.getRequestObject();
            schemaRelReq.addNewNode($scope.newSchemaRelObject);

            schemaRelReq.addNewRelationship(
                $scope.newSchemaRelObject.submitObj,
                'schema_relationship_source',
                $scope.srcRelNodeList.selectedNode.submitObj);

            schemaRelReq.addNewRelationship(
                $scope.newSchemaRelObject.submitObj,
                'schema_relationship_source',
                $scope.tgtRelNodeList.selectedNode.submitObj);
            schemaRelReq.submit()
                .success(function(data) {
                    console.log(data);
                    $scope.newSchemaRelObject.createId = data.results.request.groupId;
                    $scope.newSchemaRelObject.createReady = true;
                });
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
                        submitObj: data.submitObj,
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
                            submitObj: data.submitObj,
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
                            submitObj: data.submitObj,
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
                            submitObj: data.submitObj,
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

        $scope.$watch('schemaFormList.selectedNode', function(newValue, oldValue) {
            if (typeof newValue == 'object') {
                console.log(newValue);
                var payload = {
                    form_name: newValue.nodeName
                };
                CommonServices.getJeniusForm(payload)
                    .success(function(data) {
                        console.log(data);
                        $scope.selectedFormObject = data.results;
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
                        submitObj: data.submitObj,
                        node_label: 'Schema_Property',
                        editType: 'groupEdit'

                    };
                    $scope.selectedProperty = 'newProperty';
                });

        };
        $scope.submitNewProperty = function() {
            var newPropReq = RequestFactory.getRequestObject();
            newPropReq.addNewNode($scope.newProperty);
            newPropReq.addNewRelationship(
                $scope.newProperty.submitObj,
                'approved_property',
                $scope.selectedObject.submitObj);
            newPropReq.submit()
                .success(function(data) {
                    console.log(data);
                    $scope.newProperty.createId = data.results.request.groupId;
                    $scope.newProperty.createReady = true;
                });
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
                            submitObj: data.submitObj,
                            node_label: 'Schema_Property',
                            editType: 'singleEdit'
                        };
                    });
            };
        };

        $scope.resetSchemaRel();
    });