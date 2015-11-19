'use strict';
angular.module('todoApp')
.factory('todoListSvc', ['$http', function ($http) {
    return {
        getItems : function(){
            return $http.get('/api/tasks');
        },
        getItem : function(id){
            return $http.get('/api/tasks/' + id);
        },
        postItem : function(item){
            return $http.post('/api/tasks/',item);
        },
        putItem : function(item){
            return $http.put('/api/tasks/' + item.ID, item);
        },
        deleteItem : function(id){
            return $http({
                method: 'DELETE',
                url: '/api/tasks/' + id
            });
        }
    };
}]);