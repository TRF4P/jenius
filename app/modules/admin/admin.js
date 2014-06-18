'use strict';

angular.module('jeniusApp')
    .controller('AdminCtrl', function($scope, CommonServices) {

        $scope.schemaNodeList = {
            nodeLabel: 'Schema_Node',
            fieldKey: 'label_name'
        }

        $scope.newSchemaNode = {
            nodeLabel: 'Schema_Node',
            editType: 'create'
        };

        var payload = {};
        payload.nodeId = 14;
        payload.nodeType = "Schema_Node";
        CommonServices.getJeniusObjectForm(payload)
            .success(function(data) {
                console.log(data);
            });
        $scope.$watch('schemaNodeList.selectedNode', function(newValue, oldValue) {
            if (typeof newValue == 'object') {
                console.log(newValue);
                var payload = newValue;
                CommonServices.getSchemaNodeProperties(payload)
                    .success(function(data) {
                        $scope.schemaNodeProperties = data.results[0].approvedProperties;
                    });
            };
        });

    });