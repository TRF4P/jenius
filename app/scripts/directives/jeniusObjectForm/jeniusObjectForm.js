angular.module('jeniusApp')
    .directive('jeniusObjectForm', function(CommonServices) {
        return {
            templateUrl: '/scripts/directives/jeniusObjectForm/jeniusObjectForm.html',
            //restrict: 'A',
            scope: {
                jof: "=jeniusObjectForm",
            },
            link: function(scope, element, attr) {
                /*
                 * form.properties
                 * form.nodeId
                 * form.nodeLabel
                 * form.editType
                 * form.formReady
                 */

                /**
                 *
                 * Variables for the Object Form are located here
                 *
                 **/




                /**
                 *
                 * Functions for the object form are located here
                 *
                 **/

                scope.submitGroupChanges = function() {};
                scope.submitSingleChange = function() {};
                scope.createObject = function() {};

                scope.initializeForm = function() {
                    if (scope.jof.editType === 'createEdit') {
                        console.log(scope.jof.editType);
                    }
                };

                /**
                 *
                 * Watchers are located here
                 *
                 **/

                scope.$watch('jeniusObjectForm.formReady', function(newValue, oldValue) {
                    if (newValue === true) {
                        scope.initializeForm();
                    };
                });


                /**
                 *
                 * Initializers are located here
                 *
                 **/

            }
        };
    })