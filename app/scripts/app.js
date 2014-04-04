'use strict';

angular.module('jeniusApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
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
            .when('/admin', {
                templateUrl: 'views/admin.html',
                controller: 'AdminCtrl'
            });
        //     .otherwise({
        //        redirectTo: '/'
        //    });
    });