angular.module('monitor', ['ngRoute'])

.controller("monitorCtrl", function ($scope, $http, $route, $routeParams, $location, $timeout) {

    $scope.dateNow = Date;
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    $scope.app = "Monitor";
    
    $http ({
        method: "POST", 
        mode: "no-cors",
        crossDomain: true,
        url: "fake/servers.html"
    }).success(function(data) {
        $scope.servers = data;
    });
    
    $scope.reloadRoute = function() {
        $route.reload();        
    };
})

.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/Target/:target', {
            templateUrl: 'monitorview.html',
            controller: 'monitorServerCtrl'
        })
      .otherwise({
        templateUrl: 'monitorview.html',
        controller: 'monitorServerCtrl'
    });

    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
})

.controller("monitorServerCtrl", function ($scope, $http, $route) {
    if ($scope.server===undefined) {
        return;
    } else {
        if ($route.current.params.target===undefined) {
            $scope.target = "Inventory";
        } else {
            $scope.target = $route.current.params.target;
        }
        var ajaxTime= new Date().getTime();
        //console.log("Target=" + $scope.target + " for " + $scope.server.url);
        $http ({
                method: "POST", 
                mode: "no-cors",
                crossDomain: true,
                url: "https://us-central1-seeume-15d54.cloudfunctions.net/monitor" //cloak.php?SERVER="+$scope.server.url+"&DISPLAY="+$scope.target+"&HOST="+$scope.server.protocol+"://"+$scope.server.url+$scope.server.agent+"?DISPLAY="+$scope.target
            }).success(function(data) {
                $scope.results = data;
                $scope.totalTime = new Date().getTime()-ajaxTime;
            })
    }
})
