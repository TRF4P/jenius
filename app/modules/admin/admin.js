'use strict';

angular.module('jeniusApp')
    .controller('AdminCtrl', function($scope, CommonServices) {
        //  $scope.selectedObject = {};
        // $scope.selectedObject.isEmpty = true;
        // $scope.selectedObject.properties = {};

        $scope.generateNewSchemaNode = function() {
            var payload = {};
            payload.nodeId = null;
            payload.nodeType = 'Schema_Node';
            CommonServices.getJeniusObjectForm(payload)
                .success(function(data) {
                    console.log(data);
                    $scope.newSchemaNode = {
                        node_label: 'Schema_Node',
                        editType: 'createEdit',

                        isEmpty: false,
                        properties: data.results
                    };
                });
        };

        $scope.schemaNodeList = {
            nodeLabel: 'Schema_Node',
            fieldKey: 'label_name'
        };

        $scope.$watch('schemaNodeList.selectedNode', function(newValue, oldValue) {
            if (typeof newValue == 'object') {
                console.log('selectedNodeChanged');
                console.log(newValue);
                var payload = newValue;
                var formload = newValue;
                formload.nodeType = formload.nodeLabel;

                CommonServices.getJeniusObjectForm(payload)
                    .success(function(data) {
                        var holder = {};
                        holder.properties = data.results;
                        holder.isEmpty = false;
                        holder.node_label = "Schema_Node";
                        holder.editType = 'singleEdit';
                        $scope.selectedObject = holder;
                        console.log(data);
                    });
                CommonServices.getSchemaNodeProperties(payload)
                    .success(function(data) {
                        $scope.schemaNodeProperties = data.results[0].approvedProperties;
                    });
            };
        });


    });