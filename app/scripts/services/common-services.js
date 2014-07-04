'use strict';

angular.module('jeniusApp')
    .factory('CommonServices', function CommonServices($http) {
        return {
            sayHello: function() {
                return "Hello, World!";
            },
            getCreateRequestObject: function() {
                var crObj = {
                    variableName: null,
                    variableId: null,
                    node_label: null,
                    properties: {}
                };
                return crObj;
            },
            getRelRequestObject: function() {
                var crObj = {
                    relationship_type: null,
                    srcObj: {
                        variableName: null,
                        variableId: null
                    },
                    tgtObj: {
                        variableName: null,
                        variableId: null
                    },
                    reqObj: {
                        variableName: null,
                        variableId: null
                    }
                };
                return crObj;
            },
            getGroupRequestObject: function() {
                var grObj = {
                    variables: [],
                    createNodes: [],
                    newRelationships: [],
                    editProperties: [],
                    archiveNodes: [],
                    archiveRelationships: []
                };
                return grObj;
            },
            submitGroupRequest: function(payload) {
                return $http({
                    method: "POST",
                    url: '/api/submitGroupRequest',
                    data: JSON.stringify(payload)
                })
                    .success(function(data) {
                        console.log("*******Got Jenius Object Form ******");
                        // console.log(data);
                    })
                    .error(function(data) {
                        console.log("******Error calling Jenius Lista*****");
                        console.log(data);
                    });
            },
            approveGroupRequest: function(payload) {
                return $http({
                    method: "POST",
                    url: '/api/approveGroupRequest',
                    data: JSON.stringify(payload)
                })
                    .success(function(data) {
                        console.log("*******Got Jenius Object Form ******");
                        // console.log(data);
                    })
                    .error(function(data) {
                        console.log("******Error calling Jenius Lista*****");
                        console.log(data);
                    });
            },
            denyGroupRequest: function(payload) {
                return $http({
                    method: "POST",
                    url: '/api/denyGroupRequest',
                    data: JSON.stringify(payload)
                })
                    .success(function(data) {
                        console.log("*******Got Jenius Object Form ******");
                        // console.log(data);
                    })
                    .error(function(data) {
                        console.log("******Error calling Jenius Lista*****");
                        console.log(data);
                    });
            },
            getJeniusObjectForm: function(payload) {
                return $http({
                    method: "POST",
                    url: '/api/getJeniusObjectForm',
                    data: JSON.stringify(payload)
                })
                    .success(function(data) {
                        console.log("*******Got Jenius Object Form ******");
                        // console.log(data);
                    })
                    .error(function(data) {
                        console.log("******Error calling Jenius Lista*****");
                        console.log(data);
                    });
            },
            getJeniusList: function(payload) {
                return $http({
                    method: "POST",
                    url: '/api/getJeniusList',
                    data: JSON.stringify(payload)
                })
                    .success(function(data) {
                        console.log("*******Got Jenius List******");
                        // console.log(data);
                    })
                    .error(function(data) {
                        console.log("******Error calling Jenius Lista*****");
                        console.log(data);
                    });
            },
            createSchemaNode: function(payload) {
                return $http({
                    method: "POST",
                    url: '/api/createSchemaNode',
                    data: JSON.stringify(payload)
                })
                    .success(function(data) {
                        console.log("*******Got Schema Node******");
                        console.log(data);
                    })
                    .error(function(data) {
                        console.log("******Error with Making Schema*****");
                        console.log(data);
                    });
            },
            getSchemaNodeList: function() {
                return $http({
                    method: "GET",
                    url: '/api/getSchemaNodeList'
                })
                    .success(function(data) {
                        console.log("*******Got Schema Node list******");
                        console.log(data);
                    })
                    .error(function(data) {
                        console.log("******Error getting SChema Node List*****");
                        console.log(data);
                    });
            },
            createSchemaProperty: function(payload) {
                return $http({
                    method: "POST",
                    url: '/api/createSchemaProperty',
                    data: payload
                })
                    .success(function(data) {
                        console.log("*******Made property node******");
                        console.log(data);
                    })
                    .error(function(data) {
                        console.log("******Error with Making Property*****");
                        console.log(data);
                    });
            },
            getSchemaNodeProperties: function(payload) {
                //Must contain payload.nodeId of SchemaNode
                return $http({
                    method: "POST",
                    url: '/api/getSchemaNodeProperties',
                    data: payload
                })
                    .success(function(data) {
                        console.log("*******Made property node******");
                        console.log(data);
                    })
                    .error(function(data) {
                        console.log("******Error with Making Property*****");
                        console.log(data);
                    });
            },
            getSchemaNodeRelationships: function() {},
            getNodeProperties: function() {},
            getNodeRelationships: function() {}

        };
    });