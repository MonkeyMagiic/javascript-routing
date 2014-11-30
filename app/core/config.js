/*jslint browser: true*/
/*global $, jQuery, angular*/

(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    toastrConfig.$inject = ['toastr'];

    var config = {
        appErrorPrefix: '[NG-Modular Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Angular Modular Demo',
        version: '1.0.0'
    };

    core.value('config', config);

    core.config(configure);

    function configure($routeProvider) {

        $routeProvider
            .when('/', {
                controller: 'ListProjectController',
                controllerAs: 'vm',
                templateUrl: 'list.html'
            })
            .when('/edit/:projectId', {
                controller: 'EditProjectController',
                templateUrl: 'detail.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }

    configure.$inject = ['$routeProvider'];


})();