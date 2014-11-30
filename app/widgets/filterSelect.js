/*jslint browser: true*/
/*global $, jQuery, angular*/

(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('filterSelect', filterSelect);

    function filterSelect() {

        var directive = {
            controller: controller,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',  //E = element, A = attribute, C = class, M = comment
            scope: {
                sourceProvider: '=',
                autoSelect: '@'
            },
            template: '<select data-ng-model="vm.selectedItem" data-ng-options="item.name for item in vm.items"></select>'
        };
        return directive;

        /**
         * @private
         * @param scope
         * @param element
         * @param attributes
         * @param controller
         */
        function link(scope, element, attributes, controller) {

            //the '@' binding automatically interpolates the "{{}}" if they exist in the attributes
            var sourceProvider = scope.$eval(attributes.sourceProvider);

            attributes.$observe('autoSelect', function (value) {
                console.log('<<AutoSelect has changed: ' + value);
            });

            scope.$watch('sourceProvider', function (value) {
                controller.items = value;
                console.log('<<The Value of Source Provider has changed');
            });

            // When the DOM element is removed from the page,
            // AngularJS will trigger the $destroy event on
            // the scope. This gives us a chance to cancel any
            // pending timer that we may have.
            scope.$on("$destroy", function (event) {
                console.log('destroying')
            });

            element.bind('mouseenter', function () {
                console.log('>>>MouseEnter');
            });

            element.bind('mouseout', function () {
                console.log('>>>MouseOut');
            });
        }

        function controller($scope) {
            /* jshint validthis: true */
            var vm = this;
            vm.open = false;
            vm.selectedItem = null;
            vm.items = [];

            /*
             Object.defineProperty(vm, 'pageCount', {
             get: function () {
             return Math.floor(vm.attendeeFilteredCount / vm.paging.pageSize) + 1;
             }
             });
             */
        }
    }
})();