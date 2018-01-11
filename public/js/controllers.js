'use strict';

/* Controllers */

var addToDialog = angular.module('addToDialog',[]);

addToDialog.directive("scrollBottom", function(){
  return {
    link: function(scope, element, attr){
      var $id= $("#" + attr.scrollBottom);
      $(element).on("click", function(){
          $id.scrollTop($id[0].scrollHeight);
      });
    }
  }
});

function TodoCtrl($scope, $timeout) {
  var socket = io.connect();
  socket.on('change', function(obj) {
    $scope.todos = obj;
    $scope.$apply();
  });

  var refresh = function(){
    $scope.sentenceList = '';
      angular.forEach($scope.todos, function(value, key){
        //console.log(value.text);
        $scope.sentenceList += value.text+'\n'; 
      });
      //$('#bottom').scrollTop($('#bottom')[0].scrollHeight);
  }

  $scope.addTodo = function() {
    $scope.todos.push({text:$scope.todoText, done:false});
    $scope.todoText = '';
    socket.emit('change', $scope.todos);
    refresh();
  };

  $scope.remaining = function() {
    var count = 0;
    angular.forEach($scope.todos, function(todo) {
      count += todo.done ? 0 : 1;
    });
    return count;
  };

  $scope.archive = function() {
    var oldTodos = $scope.todos;
    $scope.todos = [];
    angular.forEach(oldTodos, function(todo) {
      if (!todo.done) $scope.todos.push(todo);
    });
    socket.emit('change', $scope.todos);
  };

  $scope.change = function() {
    socket.emit('change', $scope.todos);
  };

  $timeout(refresh,1000);
  setInterval(refresh,1000);
}
