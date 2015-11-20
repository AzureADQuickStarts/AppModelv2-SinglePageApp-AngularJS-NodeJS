'use strict';
angular.module('todoApp')

// Load ADAL for use in controllers and views   
.controller('homeCtrl', ['$scope', 'adalAuthenticationService','$location', function ($scope, adalService, $location) {
    $scope.login = function () {
        
        // TODO: Redirect the user to sign in
        
    };
    $scope.logout = function () {
        
        // TODO :Redirect the user to log out    
        
    };
    $scope.isActive = function (viewLocation) {        
        return viewLocation === $location.path();
    };
}]);