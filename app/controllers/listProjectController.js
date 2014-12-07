/*jslint browser: true*/
/*global $, jQuery, angular*/

(function () {
    "use strict";

    var injectParameters = ['$interval', 'dataservice', 'logger'];

    /**
     *  ListProjectController
     *
     *  @see
     *
     *  @langversion 3.0
     *  @playerversion Flash 9
     *  @playerversion AIR 1.1
     *  @productversion Flex 3
     */
    function ListProjectController($interval, dataservice, logger) {

        //--------------------------------------------------------------------------
        //
        //  Construction
        //
        //--------------------------------------------------------------------------

        logger.info("Loading contact data", {});

        var vm = this;

        initialise();


        //--------------------------------------------------------------------------
        //
        //  Properties
        //
        //--------------------------------------------------------------------------

        //----------------------------------
        //  currencyPairs
        //----------------------------------

        /**
         *  Storage for the currencyPairs property.
         *  @private
         */
        var _currencyPairs;

        /**
         * @name app.ListProjectController#currencyPairs
         * @module app
         * @returns {Array.<string>} List of currency pairs.
         * @description
         * Holds the list of currency pairs.
         */
        Object.defineProperty(vm, 'currencyPairs', {
            get: function () {
                return _currencyPairs;
            }
        });


        //----------------------------------
        //  autoSelect
        //----------------------------------

        /**
         *  Storage for the autoSelect property.
         *  @private
         */
        var _autoSelect = "always";

        /**
         *  The autoSelect of the component.
         *  @default always
         *
         *  <p>Supported values</p>
         *         always
         *         complete
         *          <li>partial
         *          <li>never</li>
         *      </ul>
         *
         *  @langversion ecmaScript 5.0
         */
        Object.defineProperty(vm, 'autoSelect', {
            get: function () {
                return _autoSelect;
            },
            set: function (value) {
                _autoSelect = value;
            }
        });


        //----------------------------------
        //  projects
        //----------------------------------

        /**
         *  Storage for the projects property.
         *  @private
         */
        var _projects;

        /**
         *  The projects of the component.
         *  @langversion ecmaScript 5.0
         */
        Object.defineProperty(vm, 'projects', {
            get: function () {
                return _projects;
            }
        });


        //----------------------------------
        //  counter
        //----------------------------------

        /**
         *  Storage for the counter property.
         *  @private
         */
        var _counter = NaN;

        /**
         *  The counter of the component.
         *  @langversion 3.0
         */
        Object.defineProperty(vm, 'counter', {
            get: function () {
                return _counter;
            }
        });


        //--------------------------------------------------------------------------
        //
        //  Methods
        //
        //--------------------------------------------------------------------------

        /**
         * Initialise component
         * @private
         */
        function initialise() {

            _currencyPairs = dataservice.getCurrencyPairs();
            _projects = dataservice.getProjects();

            $interval(function () {
                _counter = Math.round(Math.random() * 1000);
            }, 1000);
        }
    }

    ListProjectController.$inject = injectParameters;

    angular.module('app').controller('ListProjectController', ListProjectController);

}());
