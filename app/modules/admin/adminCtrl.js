'use strict';

angular.module('jeniusApp')
    .controller('AdminCtrl', function($scope, CommonServices) {

        $scope.showPropertyForm = false;
        $scope.selectedSchemaNode = false;
        $scope.schemaNodeProperties = false;

        $scope.setPropertyFormValue = function() {
            $scope.showPropertyForm = true;
        };

        $scope.getSchemaNodeList = function() {
            CommonServices.getSchemaNodeList()
                .success(function(data) {
                    $scope.schemaNodeList = data.results;
                })
                .error(function() {
                    console.log('poopy');
                });
        };

        $scope.adminInit = function() {
            $scope.getSchemaNodeList();
        };
        $scope.onNodeSelect = function() {
            $scope.selectedSchemaNode = JSON.parse($scope.selectedSchemaNode);
            var payload = {};
            payload.nodeId = $scope.selectedSchemaNode.nodeId;
            console.log(payload);
            CommonServices.getSchemaNodeProperties($scope.selectedSchemaNode)
                .success(function(data) {
                    $scope.schemaNodeProperties = data.results[0].approvedProperties;
                });
            console.log($scope.schemaNode);
        };



    });
