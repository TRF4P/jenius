'use strict';

angular.module('jeniusApp')
    .controller('MainCtrl', function($scope, $http, CommonServices) {

        var payload = {};
        payload.labelName = "User";
        payload.description = "Users make stuff";
        $http.get('/api/schema_form/awesomeThings').success(function(awesomeThings) {
            console.log(awesomeThings);
            $scope.awesomeThings = awesomeThings;
        });

        console.log(CommonServices.sayHello());

        $scope.testStuff = function() {
            console.log('TESTING');
        };

        CommonServices.getSchemaNodeList()
            .success(function(data) {
                $scope.schemaNodeList = data.results;
            })
            .error(function() {
                console.log('poopy');
            });
        $scope.createSchemaNode = function() {
            CommonServices.createSchemaNode(payload);
        };


        $scope.selectedSchemaNode = function(schemaNode) {

        };
        CommonServices.createSchemaProperty();
    });