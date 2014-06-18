'use strict';

angular.module('jeniusApp')
    .directive('schemaNodeForm', function(CommonServices) {
        return {
            templateUrl: '/scripts/directives/commondir/schemaNodeForm.html',
            //restrict: 'A',
            scope: {},
            link: function(scope, element, attr) {
                console.log(attr);
                scope.submitSchemaNode = function() {
                    var payload = {};
                    payload.description = scope.description;
                    payload.labelName = scope.labelName;
                    console.log(scope.description);
                    console.log(scope.labelName);

                    CommonServices.createSchemaNode(payload);
                };
                attr.testing = function() {
                    console.log('directiveTesting');
                };
            }
        };
    })
    .directive('propertyForm', function(CommonServices) {
        return {
            templateUrl: '/scripts/directives/commondir/propertyForm.html',
            //restrict: 'A',
            scope: {
                schemanode: '=schemanode'
            },
            link: function(scope, element, attr, schemanode) {
                console.log(scope);
                scope.selectOptions = [];

                scope.submitSchemaProperty = function() {
                    console.log(scope);
                    var payload = {};
                    payload.propertyName = scope.propertyName;
                    payload.displayName = scope.displayName;
                    payload.isEdittable = scope.isEdittable;
                    payload.mandatoryField = scope.mandatoryField;
                    payload.dataType = scope.dataType;
                    payload.priority = scope.priority;
                    payload.hasMultipleValues = scope.hasMultipleValues;
                    payload.selectOptions = scope.selectOptions;
                    payload.nodeId = scope.schemanode.nodeId;
                    console.log(payload);
                    payload.description = scope.description;
                    payload.labelName = scope.labelName;
                    console.log(scope.description);
                    console.log(scope.labelName);
                    payload = angular.copy(payload);
                    CommonServices.createSchemaProperty(payload);
                };
                attr.testing = function() {
                    console.log('directiveTesting');
                };
                //attr.submitSchemaNode();
                //  element.text('this is the commonDir directive ');
            }
        };
    });