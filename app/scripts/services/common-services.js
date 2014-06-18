'use strict';

angular.module('jeniusApp')
    .factory('CommonServices', function CommonServices($http) {
        return {
            sayHello: function() {
                return "Hello, World!";
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