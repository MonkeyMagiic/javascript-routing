/*jslint browser: true*/
/*global $, jQuery, angular*/

(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name app.core
     * @description
     *
     * # core application
     */
    angular.module('app.core', [
        /*
         * Angular modules
         */
        'ngAnimate', 'ngRoute', 'ngSanitize',
        /*
         * Our reusable cross app code modules
         */
        'blocks.logger', 'blocks.exception',
        /*
         * 3rd Party modules
         */
        'ngplus'
    ]);
}());