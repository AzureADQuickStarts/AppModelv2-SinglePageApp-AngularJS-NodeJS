'use strict';

// Load the ADAL module into the app
angular.module('todoApp', ['ngRoute','AdalAngular'])
.config(['$routeProvider', '$httpProvider', 'adalAuthenticationServiceProvider', function ($routeProvider, $httpProvider, adalProvider) {

    $routeProvider.when("/Home", {
        controller: "homeCtrl",
        templateUrl: "/static/views/Home.html",
    }).when("/TodoList", {
        controller: "todoListCtrl",
        templateUrl: "/static/views/TodoList.html",
        requireADLogin: true, // Ensures that the user must be logged in to access the route
    }).when("/UserData", {
        controller: "userDataCtrl",
        templateUrl: "/static/views/UserData.html",
    }).otherwise({ redirectTo: "/Home" });

    // Initialize ADAL with your application's information
    adalProvider.init({
        
        // Use this value for the public instance of Azure AD
        instance: 'https://login.microsoftonline.com/', 
        
        // The 'common' endpoint is used for multi-tenant applications
        tenant: 'common',
        
        // Your application id from the registration portal
        clientId: '<Your-application-id>',
        
        // If you're using IE, uncommment this line - the default HTML5 sessionStorage does not work for localhost.
        //cacheLocation: 'localStorage',
         
    }, $httpProvider);
   
}]);
