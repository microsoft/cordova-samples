(function () {
	'use strict';

	angular.module('xPlat.directives').directive('tdTextChange', tdTextChange);

	/**
	 * Factory function for the directive for ng-text-change.
	 *
	 * @return {Object} td-text-change
	 */
	function tdTextChange() {
		return {
			restrict: 'A',
			link: function (scope, element, attr) {
				element.on('change', function () {
					scope.$apply(function () {
						scope.$eval(attr.tdTextChange);
					});
				});
			}
		};
	}
})();