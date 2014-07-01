angular.module('jeniusApp')
    .directive('jeniusProperty', function(CommonServices) {
        return {
            templateUrl: '/scripts/directives/jeniusProperty/jeniusProperty.html',
            //restrict: 'A',
            scope: {
                jp: "=jeniusProperty",
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


                /**
                 *
                 * Watchers are located here
                 *
                 **/

                scope.$watch('jp', function(newValue, oldValue) {
                    console.log(newValue);
                    if (newValue === true) {

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