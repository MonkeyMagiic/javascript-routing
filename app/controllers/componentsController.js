/*jslint browser: true*/
/*global $, jQuery, angular*/

(function () {
    "use strict";

    var injectParameters = ['dataservice', 'logger'];

    /**
     *  ComponentsController
     *
     *  @see
     *
     *  @langversion 3.0
     *  @playerversion Flash 9
     *  @playerversion AIR 1.1
     *  @productversion Flex 3
     */
    function ComponentsController(dataservice, logger) {

        //--------------------------------------------------------------------------
        //
        //  Construction
        //
        //--------------------------------------------------------------------------

        logger.info("Loading components controller", {});

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
        //  selectedCurrencyPair
        //----------------------------------

        /**
         *  Storage for the selectedCurrencyPair property.
         *  @private
         */
        var _selectedCurrencyPair;

        /**
         *  The selectedCurrencyPair.
         *
         *  @langversion ecmaScript 5.0
         */
        Object.defineProperty(vm, 'selectedCurrencyPair', {
            get: function () {
                return _selectedCurrencyPair;
            },
            set: function (value) {
                _selectedCurrencyPair = value;
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
         *  The autoSelect of the component.
         *  @default complete
         *
         *  <p>Supported values</p>
         *          <li>always</li>
         *          <li>complete</li>
         *          <li>partial</li>
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
            _selectedCurrencyPair = _currencyPairs[2];
        }
    }

    ComponentsController.$inject = injectParameters;

    angular.module('app').controller('ComponentsController', ComponentsController);

}());
