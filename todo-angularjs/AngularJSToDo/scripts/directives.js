(function() {
    'use strict';
    angular.module('xPlat.directives')
        .directive('ngTextChange', function() {
            return {
                restrict: 'A',
                replace: 'ngModel',
                link: function(scope, element, attr) {
                    element.on('change', function() {
                        scope.$apply(function() {
                            scope.$eval(attr.ngTextChange);
                        });
                    });
                }
            };
        });
})();