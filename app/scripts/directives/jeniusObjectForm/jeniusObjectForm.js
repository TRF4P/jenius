angular.module('jeniusApp')
    .directive('jeniusObjectForm', function(CommonServices) {
        return {
            templateUrl: '/scripts/directives/jeniusObjectForm/jeniusObjectForm.html',
            //restrict: 'A',
            scope: {
                jeniusObjectForm: "=",
            },
            link: function(scope, element, attr) {
                /*
                 * form.properties
                 * form.nodeId
                 * form.nodeLabel
                 * form.editType
                 * form.formReady
                 */

                scope.initializeForm = function() {};
                scope.submitGroupChanges = function() {};
                scope.submitSingleChange = function() {};
                scope.createObject = function() {};

                scope.$watch('jeniusObjectForm.formReady', function(newValue, oldValue) {
                    if (newValue === true) {
                        scope.initializeForm();
                    };
                });
            }
        };
    })