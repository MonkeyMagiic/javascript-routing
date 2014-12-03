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
            template: '<select data-ng-model="vm.selectedItem" data-ng-options="item.name for item in vm.dataProvider"></select>'
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
                controller.dataProvider = value;
            });

            // When the DOM element is removed from the page,
            // AngularJS will trigger the $destroy event on
            // the scope. This gives us a chance to cancel any
            // pending timer that we may have.
            scope.$on("$destroy", function (event) {
                console.log('destroying');
            });
        }

        function controller($scope) {
            /* jshint validthis: true */
            var vm = this;

            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------

            /**
             *  Storage for the selectedItem property.
             *  @private
             */
            var _selectedItem;

            /**
             * @name app.controller#selectedItem
             * @module app
             * @returns {Object}
             * @description ?
             */
            Object.defineProperty(vm, 'selectedItem', {
                get: function () {
                    return _selectedItem;
                },
                set: function (value) {
                    _selectedItem = value;
                }
            });


            //----------------------------------
            //  open
            //----------------------------------

            /**
             *  Storage for the open property.
             *  @private
             */
            var _open;

            /**
             * @name app.controller#open
             * @module app
             * @returns {Boolean}
             * @description ?
             */
            Object.defineProperty(vm, 'open', {
                get: function () {
                    return _open;
                }
            });


            //----------------------------------
            //  dataProvider
            //----------------------------------

            /**
             *  Storage for the dataProvider property.
             *  @private
             */
            var _dataProvider;

            /**
             * @name app.controller#dataProvider
             * @module app
             * @returns {Array.<Object>} List of objects to be rendered by the select.
             * @description ?
             */
            Object.defineProperty(vm, 'dataProvider', {
                get: function () {
                    return _dataProvider;
                },
                set: function (value) {
                    _dataProvider = value;
                }
            });
        }
    }
})();