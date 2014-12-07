/*jslint browser: true*/
/*global $, jQuery, angular*/

(function () {
    'use strict';

    angular
        .module('app.widgets')
        .directive('filterSelect', filterSelect);

    /**
     * Add querySelectorAll() to jqLite.
     *
     * jqLite find() is limited to lookups by tag name.
     * TODO This will change with future versions of AngularJS, to be removed when this happens
     *
     * See jqLite.find - why not use querySelectorAll? https://github.com/angular/angular.js/issues/3586
     * See feat(jqLite): use querySelectorAll instead of getElementsByTagName in jqLite.find https://github.com/angular/angular.js/pull/3598
     */
    if (angular.element.prototype.querySelectorAll === undefined) {
        angular.element.prototype.querySelectorAll = function (selector) {
            return angular.element(this[0].querySelectorAll(selector));
        };
    }

    function filterSelect() {

        var directive = {
            controller: controller,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',  //E = element, A = attribute, C = class, M = comment
            transclude: true,
            scope: {
                sourceProvider: '=',
                autoSelect: '@'
            },
            template: ' <button type="button" class="btn btn-default form-control ui-select-match" tabindex="-1" ng-class="{\'btn-default-focus\':vm.focus}"' +
            '                   ng-hide="vm.isOpen" ng-disabled="vm.disabled" ng-click="vm.open()"> ' +
            '               <span ng-show="vm.isEmpty()" class="text-muted">{{vm.placeholder}}</span> ' +
            '               <span ng-hide="vm.isEmpty()" ng-transclude></span>' +
            '               <span class="caret ui-select-toggle" ng-click="vm.toggle($event)"></span> ' +
            '           </button>' +
            '           <div class="ui-select-bootstrap dropdown" ng-class="{open: vm.isOpen}"> ' +
            '           <div class="ui-select-match"></div>' +
            '               <input type="text" autocomplete="off" tabindex="-1" ' +
            '                   class="form-control ' +
            '                   ui-select-search" ' +
            '                   placeholder="{{vm.placeholder}}" ' +
            '                   ng-model="vm.search" ' +
            '                   ng-show="vm.searchEnabled && vm.isOpen"> ' +
            '               <div class="ui-select-choices"></div>' +
            '           </div>'

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

        function controller($scope, $element) {

            var _searchInput = $element.querySelectorAll('input.ui-select-search');
            if (_searchInput.length !== 1) {
                throw new Error("Expected 1 input.ui-select-search but got '{0}'.");
            }

            /* jshint validthis: true */
            var vm = this;
            vm.placeholder = "Please select something";
            vm.open = function () {
                if (_isOpen) return;
                _isOpen = true;
            }

            vm.isEmpty = function () {
                return angular.isUndefined(_selectedItem) || _selectedItem === null || _selectedItem === '';
            };

            /*
            focusser.bind("focus", function () {
                scope.$evalAsync(function () {
                    $select.focus = true;
                });
            });
            focusser.bind("blur", function () {
                scope.$evalAsync(function () {
                    $select.focus = false;
                });
            });
            */

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
            //  isOpen
            //----------------------------------

            /**
             *  Storage for the isOpen property.
             *  @private
             */
            var _isOpen;

            /**
             * @name app.controller#isOpen
             * @module app
             * @returns {Boolean}
             * @description ?
             */
            Object.defineProperty(vm, 'isOpen', {
                get: function () {
                    return _isOpen;
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

            //----------------------------------
            //  searchEnabled
            //----------------------------------

            /**
             *  Storage for the selectedItem property.
             *  @private
             */
            var _searchEnabled = true;

            /**
             * @name app.controller#searchEnabled
             * @module app
             * @returns {Object}
             * @description ?
             */
            Object.defineProperty(vm, 'searchEnabled', {
                get: function () {
                    return _searchEnabled;
                },
                set: function (value) {
                    _searchEnabled = value;
                }
            });
        }

    }
})();