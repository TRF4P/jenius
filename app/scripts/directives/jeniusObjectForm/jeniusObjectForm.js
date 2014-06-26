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
                scope.isEmpty = true;



                /**
                 *
                 * Functions for the object form are located here
                 *
                 **/
                scope.isEmptyObject = function(obj) {
                    for (var prop in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                            return false;
                        }
                    }
                    return true;
                }


                scope.submitPropertyChange = function(property) {
                    groupRequest = CommonServices.getGroupRequestObject();
                    var editVar = {};
                    editVar.variableName = scope.nodeLabel + '_' + scope.nodeId;
                    editVar.variableId = scope.nodeId;
                    groupRequest.variables.push(editVar);
                    groupRequest.editProperties.push(property);
                    CommonServices.submitGroupRequest(groupRequest)
                        .success(function(data) {
                            console.log(data);

                        });
                    property.submitSuccess = true;
                };

                scope.approvePropertyChange = function(property) {
                    property.property_value = property.changed_value;
                    delete property.submitSuccess;
                };

                scope.denyPropertyChange = function(property) {
                    property.changed_value = property.property_value;
                    delete property.submitSuccess;
                };

                scope.submitGroupChanges = function() {};
                scope.submitSingleChange = function() {};
                scope.createObject = function() {};

                scope.initializeForm = function() {
                    if (scope.jof.editType === 'createEdit') {
                        console.log(scope.jof.editType);
                        CommonServices.getJeniusObjectForm()
                    }
                };

                /**
                 *
                 * Watchers are located here
                 *
                 **/

                scope.$watch('jof', function(newValue, oldValue) {
                    console.log("JOF Changed!")
                    console.log("JP Changed!")
                    scope.isEmpty = scope.isEmptyObject(scope.jof);
                    angular.forEach(scope.jof, function(prop, key) {
                        prop.changed_value = prop.property_value;
                    });
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