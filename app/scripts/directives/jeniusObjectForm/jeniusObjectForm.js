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
                scope.jof = {};
                scope.jof.properties = {};
                scope.isEmpty = true;
                scope.createReady = false;



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

                scope.reviewCreateRequest = function() {
                    console.log(scope.jof.properties);
                    var isReady = true;
                    angular.forEach(scope.jof.properties, function(propVal, propKey) {
                        if (propVal.mandatory_field === true) {
                            if (propVal.changed_value === propVal.property_value) {
                                isReady = false;
                            }
                        }
                    });

                    if (isReady === true) {
                        //cr means create request
                        var gr = CommonServices.getGroupRequestObject();
                        var cr = CommonServices.getCreateRequestObject();
                        cr.variableName = 'new_' + scope.jof.node_label.toLowerCase();
                        cr.node_label = scope.jof.node_label;

                        angular.forEach(scope.jof.properties, function(propVal, propKey) {
                            if (propVal.changedValue !== null) {
                                cr.properties[propVal.property_name] = propVal.changed_value;
                            }
                        });
                        gr.createNodes.push(cr);
                        console.log(gr);
                        CommonServices.submitGroupRequest(gr)
                            .success(function(data) {
                                console.log(data);
                                scope.createId = data.results.request.groupId;
                                scope.createReady = true;

                            });
                    } else {
                        alert("Fields still need added");

                    }
                };

                scope.approveCreateRequest = function() {
                    var payload = {};
                    payload.groupId = scope.createId;
                    CommonServices.approveGroupRequest(payload)
                        .success(function(data) {
                            console.log(data);
                            delete scope.createId;
                            delete scope.createReady;
                            //Clears the form!
                        });

                };
                scope.denyCreateRequest = function() {};
                scope.submitPropertyChange = function(property) {
                    groupRequest = CommonServices.getGroupRequestObject();
                    var editVar = {};
                    editVar.variableName = property.node_label.toLowerCase() + '_' + property.node_id;
                    property.variableName = editVar.variableName;
                    editVar.variableId = property.node_id;
                    groupRequest.variables.push(editVar);
                    groupRequest.editProperties.push(property);
                    console.log(groupRequest);
                    CommonServices.submitGroupRequest(groupRequest)
                        .success(function(data) {
                            console.log(data);
                            property.reqId = data.results.request.groupId;

                        });
                    property.submitSuccess = true;
                };

                scope.approvePropertyChange = function(property) {
                    console.log(property);
                    var payload = {};
                    payload.groupId = property.reqId;
                    CommonServices.approveGroupRequest(payload)
                        .success(function(data) {
                            console.log(data);
                            property.property_value = property.changed_value;
                        });
                    delete property.submitSuccess;
                };

                scope.denyPropertyChange = function(property) {
                    property.changed_value = property.property_value;
                    delete property.submitSuccess;
                };

                scope.submitGroupChanges = function() {};
                scope.submitSingleChange = function() {};
                scope.createObject = function() {};

                /**
                 *
                 * Watchers are located here
                 *
                 **/

                scope.$watch('jof', function(newValue, oldValue) {
                    if (newValue.isEmpty === false) {
                        console.log("JOF Changed!")
                        console.log(newValue);
                        scope.isEmpty = false;
                        scope.jof = newValue;
                        console.log(scope.isEmpty);
                        angular.forEach(newValue.properties, function(prop, key) {
                            prop.changed_value = prop.property_value;
                        });
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