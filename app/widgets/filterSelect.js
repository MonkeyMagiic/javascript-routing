/*jslint browser: true*/
/*global $, jQuery, angular*/

(function () {
    'use strict';

    var KEYBOARD = {
        ENTER: 13,
        ESC: 27,
        UP: 38,
        DOWN: 40,
        KEY_DOWN: "keydown",
        isVerticalMovement: function (key) {
            return ~[KEYBOARD.UP, KEYBOARD.DOWN].indexOf(key);
        },
    };

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

    /**
     * Highlights text that matches vm.search.
     */
    angular
        .module('app.widgets').filter('highlightFunction', function () {

            function escapeRegexp(queryToEscape) {
                return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
            }

            return function (matchItem, query) {
                return query && matchItem ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="ui-select-highlight">$&</span>') : matchItem;
            };
        });

    /**
     * Constructor
     * @returns {{controller: controller, controllerAs: string, link: link, restrict: string, transclude: boolean, scope: {sourceProvider: string, selectedItem: string, autoSelect: string}, template: string}}
     */
    function filterSelect() {

        var directive = {
            controller: controller,
            controllerAs: 'vm',
            link: link,
            restrict: 'EA',  //E = element, A = attribute, C = class, M = comment
            transclude: true,
            scope: {
                sourceProvider: '=',
                selectedItem: '=',
                autoSelect: '@',
                caseSensitive: '@',
                labelField: '@'
            },
            template: ' <button type="button" ' +
            '                   class="btn btn-default form-control ui-select-match" ' +
            '                   ng-class="{\'btn-default-focus\':vm.focus}"' +
            '                   ng-hide="vm.isOpen" ' +
            '                   ng-disabled="vm.disabled" ' +
            '                   ng-click="vm.open()"> ' +
            '               <span class="text-muted">{{vm.hasSelectedItem ? vm.selectedItem.name : vm.placeholder }}</span> ' +
            '               <span class="caret ui-select-toggle"></span> ' +
            '           </button>' +
            '           <div ng-class="{open: vm.isOpen}" ' +
            '                ng-show="vm.searchEnabled && vm.isOpen"> ' +
            '               <div class="ui-select-match"></div>' +
            '               <input type="text" autocomplete="off" tabindex="-1" ' +
            '                      class="form-control ui-select-search" ' +
            '                      placeholder="{{vm.placeholder}}" ' +
            '                      ng-model="vm.filterText" ' +
            '                      ng-show="vm.searchEnabled" /> ' +
            '               <div class="dropdown" ng-repeat="value in vm.filteredDataProvider = (vm.dataProvider | filter:vm.filterText)"> ' +
            '                   <div class="ui-select-choices-row ng-scope" ' +
            '                        ng-class="{active: vm.selectedItem === value}" ' +
            '                        ng-class="{active: vm.isActive(value )}" ' +
            '                        ng-click="vm.selectedItem = value"> ' +
            '                           <a href="javascript:void(0)" class="ui-select-choices-row-inner" uis-transclude-append="">' +
            '                               <span ng-bind-html="value.name | highlightFunction: vm.filterText" class="ng-scope ng-binding"> ' +
            '                           </a>' +
            '                   </div>' +
            '               </div>' +
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
            // var sourceProvider = scope.$eval(attributes.sourceProvider);

            attributes.$observe('autoSelect', function (value) {
                controller.autoSelect = value;
            });

            attributes.$observe('caseSensitive', function (value) {
                controller.caseSensitive = value;
            });

            attributes.$observe('labelField', function (value) {
                controller.labelField = value;
            });

            scope.$watch('selectedItem', function (value) {
                controller.selectedItem = value;
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

        /**
         *
         * @param $scope
         * @param $element
         * @param $timeout
         * @param $rootScope
         */
        function controller($scope, $element, $timeout, $rootScope) {

            /* jshint validthis: true */
            var vm = this;
            vm.open = open;


            //--------------------------------------------------------------------------
            //
            //  Variables
            //
            //--------------------------------------------------------------------------

            /**
             *
             * @type {*|NodeList}
             * @private
             */
            var _searchInput = $element.querySelectorAll('input.ui-select-search');


            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------

            //----------------------------------
            //  selectedItem
            //----------------------------------

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

                    if (_selectedItem === value) return;

                    _selectedItem = value;
                    _hasSelectedItem = _selectedItem !== null;
                }
            });

            //----------------------------------
            //  hasSelectedItem
            //----------------------------------

            /**
             *  Storage for the hasSelectedItem property.
             *  @private
             */
            var _hasSelectedItem = false;

            /**
             * @name app.controller#hasSelectedItem
             * @module app
             * @returns {Object}
             * @description ?
             */
            Object.defineProperty(vm, 'hasSelectedItem', {
                get: function () {
                    return _hasSelectedItem;
                }
            });

            //----------------------------------
            //  autoSelect
            //----------------------------------

            /**
             *  Storage for the autoSelect property.
             *  @private
             */
            var _autoSelect = "complete";

            /**
             *
             * always   - select if single item in the collection.
             * partial  -
             * complete -
             * never    - never attempt to auto select.
             *
             * @name app.controller#autoSelect
             * @module app
             * @returns {Object}
             * @description ?
             */
            Object.defineProperty(vm, 'autoSelect', {
                get: function () {
                    return _autoSelect;
                },
                set: function (value) {

                    if (_autoSelect === value) return;

                    _autoSelect = value;
                }
            });

            //----------------------------------
            //  filterText
            //----------------------------------

            /**
             *  Storage for the filterText property.
             *  @private
             */
            var _filterText;

            /**
             * @name app.controller#filterText
             * @module app
             * @returns {Object}
             * @description ?
             */
            Object.defineProperty(vm, 'filterText', {
                get: function () {
                    return _filterText;
                },
                set: function (value) {
                    if (_filterText === value) return;

                    _filterText = value;
                    invalidateAutoSelection();
                }
            });

            //----------------------------------
            //  labelField
            //----------------------------------

            /**
             *  @private
             *  Storage for the labelField property.
             */
            var _labelField = "label";

            /**
             *  Name of the field in the items in the <code>dataProvider</code>
             *  Array to display as the label in the TextInput portion and drop-down list.
             *  By default, the control uses a property named <code>label</code>
             *  on each Array object and displays it.
             *  <p>However, if the <code>dataProvider</code> items do not contain
             *  a <code>label</code> property, you can set the <code>labelField</code>
             *  property to use a different property.</p>
             *
             * @name app.controller#filterText
             * @module app
             * @returns {Object}
             * @description ?
             */
            Object.defineProperty(vm, 'labelField', {
                get: function () {
                    return _labelField;
                },
                set: function (value) {
                    if (_labelField === value) return;

                    _labelField = value;
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
                    if (_dataProvider === value) return;

                    _dataProvider = value;
                }
            });

            //----------------------------------
            //  filteredDataProvider
            //----------------------------------

            /**
             *  Storage for the filteredDataProvider property.
             *  @private
             */
            var _filteredDataProvider;

            /**
             * @name app.controller#filteredDataProvider
             * @module app
             * @returns {Array.<Object>} List of objects to be rendered by the select.
             * @description ?
             */
            Object.defineProperty(vm, 'filteredDataProvider', {
                get: function () {
                    return _filteredDataProvider;
                },
                set: function (value) {
                    if (_filteredDataProvider === value) return;

                    _filteredDataProvider = value;
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

            //----------------------------------
            //  placeholder
            //----------------------------------

            /**
             *  Storage for the placeholder property.
             *  @private
             */
            var _placeholder = "Please select something";

            /**
             * @name app.controller#selectedItem
             * @module app
             * @returns {Object}
             * @description ?
             */
            Object.defineProperty(vm, 'placeholder', {
                get: function () {
                    return _placeholder;
                }
            });

            //----------------------------------
            //  caseSensitive
            //----------------------------------

            /**
             *  Storage for the caseSensitive property.
             *  @private
             */
            var _caseSensitive;

            /**
             * @name app.controller#searchEnabled
             * @module app
             * @returns {Object}
             * @description ?
             */
            Object.defineProperty(vm, 'caseSensitive', {
                get: function () {
                    return _caseSensitive;
                },
                set: function (value) {
                    _caseSensitive = value;
                }
            });


            //--------------------------------------------------------------------------
            //
            //  Methods
            //
            //--------------------------------------------------------------------------

            /**
             * @private
             */
            function open() {
                if (_isOpen) return;

                _isOpen = true;

                $timeout(function () {
                    _searchInput.focus();
                });
            }

            /**
             * @private
             */
            function close() {
                if (!_isOpen) return;

                $scope.$apply(function () {
                    _isOpen = false;
                });
            }

            /**
             * @private
             */
            function invalidateAutoSelection() {

                const hasSingleItem = _filteredDataProvider.length == 1;
                const isSingleSelected = hasSingleItem && _selectedItem === _filteredDataProvider[0];

                var selectionChanged;
                var selection;

                switch (_autoSelect) {
                    case "partial":
                        if (hasSingleItem) {
                            // Ensure item is not already selected.
                            if (!isSingleSelected) {
                                selectionChanged = true;
                                selection = _filteredDataProvider[0];
                            }
                        }
                        else if (_selectedItem) {
                            selectionChanged = true;
                            selection = null;
                        }
                        break;
                    case "complete":
                        if (hasSingleItem && filterMatched(_filteredDataProvider[0])) {
                            // Ensure item is not already selected.
                            if (!isSingleSelected) {
                                selectionChanged = true;
                                selection = _filteredDataProvider[0];
                            }
                        }
                        else if (_selectedItem) {
                            selectionChanged = true;
                            selection = null;
                        }
                        break;
                    case "always":
                        if (hasSingleItem && (_filteredDataProvider[0] !== _selectedItem)) {
                            selectionChanged = true;
                            selection = _filteredDataProvider[0];
                        }
                        break;
                    case "never":
                    default:
                        // Do nothing here.
                        break;
                }

                if (selectionChanged) {
                    $scope.$evalAsync(function () {
                        vm.selectedItem = selection;
                    });
                }
            }

            /**
             * @private
             */
            function filterMatched(item) {

                if (!item)
                    return false;

                if (!_caseSensitive)
                    return _filterText.toLowerCase() === item[_labelField].toLowerCase();

                return _filterText === item[_labelField];
            }

            //--------------------------------------------------------------------------
            //
            //  Event Handlers
            //
            //--------------------------------------------------------------------------

            /**
             * @private
             */
            $element.on(KEYBOARD.KEY_DOWN, function (event) {

                const currentIndex = _filteredDataProvider.indexOf(_selectedItem);
                const key = event.which;

                switch (key) {
                    case KEYBOARD.UP:
                        if (currentIndex > 0) {
                            $scope.$apply(function () {
                                vm.selectedItem = _filteredDataProvider[currentIndex - 1];
                            });
                        }
                        break;
                    case KEYBOARD.DOWN:
                        if ((_filteredDataProvider.length - 1) > currentIndex) {
                            $scope.$apply(function () {
                                vm.selectedItem = _filteredDataProvider[currentIndex + 1];
                            });
                        }
                        break;
                    case KEYBOARD.ENTER:
                        close();
                        break;
                }
            });

            /**
             * @private
             */
            /*
             _searchInput.on('blur', function () {
             close();
             });
             */
        }

    }
})();