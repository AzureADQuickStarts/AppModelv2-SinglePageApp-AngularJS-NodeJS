'use strict';
angular.module('todoApp')

// Load ADAL for use in controllers and views   
.controller('homeCtrl', ['$scope', 'adalAuthenticationService','$location', function ($scope, adalService, $location) {
    $scope.login = function () {
        
        // Redirect the user to sign in
        adalService.login();
        
    };
    $scope.logout = function () {
        
        // Redirect the user to log out    
        adalService.logOut();
    
    };
    $scope.isActive = function (viewLocation) {        
        return viewLocation === $location.path();
    };
}]);