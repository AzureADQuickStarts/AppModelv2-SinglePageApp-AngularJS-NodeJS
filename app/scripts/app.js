'use strict';

// TODO: Load the ADAL module into the app
angular.module('todoApp', ['ngRoute'])
.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {

    $routeProvider.when("/Home", {
        controller: "homeCtrl",
        templateUrl: "/static/views/Home.html",
    }).when("/TodoList", {
        controller: "todoListCtrl",
        templateUrl: "/static/views/TodoList.html",
        
        // TODO: Secure the /TodoList route with Azure AD
        
    }).when("/UserData", {
        controller: "userDataCtrl",
        templateUrl: "/static/views/UserData.html",
    }).otherwise({ redirectTo: "/Home" });

    // TODO: Initialize ADAL with your application's information
   
}]);
