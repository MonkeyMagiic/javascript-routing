/*jslint browser: true*/
/*global $, jQuery, angular*/

(function () {
    "use strict";

    var injectParameters = ['$scope', '$location', '$routeParams', 'dataservice'],

        EditProjectController = function ($scope, $location, $routeParams, dataservice) {

            var projectId = $routeParams.projectId,
                project,
                i = 0;

            $scope.projects = dataservice.getProjects();

            while (i < $scope.projects.length) {
                project = $scope.projects[i];
                if (project.$id === projectId) {
                    $scope.project = project;
                    break;
                }
                i++;
            }

            $scope.destroy = function () {
                //$scope.projects.$remove($scope.project).then(function (data) {
                $location.path('/');
                //});
            };

            $scope.save = function () {
                // $scope.projects.$save($scope.project).then(function (data) {
                $location.path('/');
                // });
            };

        };

    EditProjectController.$inject = injectParameters;

    angular.module('app').controller('EditProjectController', EditProjectController);

}());