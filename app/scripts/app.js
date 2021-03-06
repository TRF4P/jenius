'use strict';

angular.module('jeniusApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.filters',
    'ui.select2',
    'ngTagsInput'

])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/snap', {
                templateUrl: 'views/snap.html',
                controller: 'MainCtrl'
            })
            .when('/graph', {
                templateUrl: 'views/graph.html',
                controller: 'MainCtrl'
            })
            .when('/admin', {
                templateUrl: 'modules/admin/testAdmin.html',
                controller: 'AdminCtrl'
            });
        //     .otherwise({
        //        redirectTo: '/'
        //    });
    });