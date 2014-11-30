/*jslint browser: true*/
/*global $, jQuery, angular*/

(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    /* @ngInject */
    function dataservice() {

        var service = {
            getProjects: getProjects,
            getCurrencyPairs: getCurrencyPairs
        };

        return service;

        function getCurrencyPairs() {

            return [
                {id: 0, name: "EURUSD"},
                {id: 1, name: "EURGBP"},
                {id: 2, name: "EURNZD"},
                {id: 3, name: "GBPUSD"},
                {id: 4, name: "USDJPY"}
            ];
            /*
            return [
                Object.create(null, {
                    'code': {
                        value: "EURUSD",
                        enumerable: true // writable:false, configurable(deletable):false by default
                    }
                }),
                Object.create(null, {
                    'code': {
                        value: "EURNZD",
                        enumerable: true // writable:false, configurable(deletable):false by default
                    }
                }),
                Object.create(null, {
                    'code': {
                        value: "GBPUSD",
                        enumerable: true // writable:false, configurable(deletable):false by default
                    }
                }),
                Object.create(null, {
                    'code': {
                        value: "USDJPY",
                        enumerable: true // writable:false, configurable(deletable):false by default
                    }
                })
            ];
            */
        }

        function getProjects() {
            return [
                Object.create(null, {
                    '$id': {
                        value: "1",
                        enumerable: true // writable:false, configurable(deletable):false by default
                    },
                    '$priority': {
                        value: null,
                        enumerable: true // writable:false, configurable(deletable):false by default
                    },
                    'name': {
                        value: "Barclays",
                        enumerable: true // writable:false, configurable(deletable):false by default
                    },
                    'description': {
                        value: 'A bank in the UK',
                        enumerable: true
                    },
                    'site': {
                        value: 'http://www.barclays.co.uk',
                        enumerable: true
                    }
                }),
                Object.create(null, {
                    '$id': {
                        value: "2",
                        enumerable: false // writable:false, configurable(deletable):false by default
                    },
                    '$priority': {
                        value: null,
                        enumerable: false // writable:false, configurable(deletable):false by default
                    },
                    'name': {
                        value: "HSBC",
                        enumerable: false // writable:false, configurable(deletable):false by default
                    },
                    'description': {
                        value: 'A bank in the UK',
                        enumerable: false
                    },
                    'site': {
                        value: 'http://www.hsbc.co.uk',
                        enumerable: false
                    }
                }),
                Object.create(null, {
                    '$id': {
                        value: "3",
                        enumerable: false // writable:false, configurable(deletable):false by default
                    },
                    '$priority': {
                        value: null,
                        enumerable: false // writable:false, configurable(deletable):false by default
                    },
                    'name': {
                        value: "Lloyds TSB",
                        enumerable: false // writable:false, configurable(deletable):false by default
                    },
                    'description': {
                        value: 'A bank in the UK',
                        enumerable: false
                    },
                    'site': {
                        value: 'http://www.lloydsbank.com/',
                        enumerable: false
                    }
                })
            ];
        }
    }

}());