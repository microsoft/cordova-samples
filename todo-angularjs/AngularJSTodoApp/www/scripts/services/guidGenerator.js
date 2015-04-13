(function () {
	angular.module('xPlat.services').service('guidGenerator', GuidGenerator);

	/**
	 * Generates a GUID to use as an ID for the todos
	 * @constructor
	 */
	function GuidGenerator() {
		// Generates a small part of a GUID
		this.generatePart = function () {
			var guidPartNumber = (Math.random() * 0x10000) | 0;
			return (guidPartNumber + 0x10000).toString(16).substring(1).toUpperCase();
		};
	}

	/**
	 * Returns a new GUID.
	 * @return {string} generated GUID.
	 */
	GuidGenerator.prototype.get = function () {
		return this.generatePart()
			+ '-'
			+ this.generatePart()
			+ '-'
			+ this.generatePart()
			+ '-'
			+ this.generatePart()
			+ '-'
			+ this.generatePart()
			+ this.generatePart()
			+ this.generatePart();
	};
})();