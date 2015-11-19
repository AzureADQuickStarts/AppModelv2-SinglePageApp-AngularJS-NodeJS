'use strict';
angular.module('todoApp', ['ngRoute','AdalAngular'])
.config(['$routeProvider', '$httpProvider', 'adalAuthenticationServiceProvider', function ($routeProvider, $httpProvider, adalProvider) {

    $routeProvider.when("/Home", {
        controller: "homeCtrl",
        templateUrl: "/static/views/Home.html",
    }).when("/TodoList", {
        controller: "todoListCtrl",
        templateUrl: "/static/views/TodoList.html",
        requireADLogin: true,
    }).when("/UserData", {
        controller: "userDataCtrl",
        templateUrl: "/static/views/UserData.html",
    }).otherwise({ redirectTo: "/Home" });

    adalProvider.init(
        {
            instance: 'https://login.microsoftonline.com/', 
            tenant: 'common',
            clientId: '67227e4e-f48b-4f6b-9721-d4cc283d32e9',
            scopes: [],
            //cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
        },
        $httpProvider
        );
   
}]);
