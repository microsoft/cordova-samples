/** @description Converts JSON data that may contain Name and PersonalIdentifier 
 *    properties to an object with the properties name (string) and id (positive 
 *    integer up to 9999999999.
 * @param {string} jsonIn The JSON data to normalize.
 * @return {object} An object with name (string) and id (integer) properties,
 *    defaulting to "default" and 0, or null if the JSON is null or invalid.
 */

function normalizeData(jsonIn) {
    var data = JSON.parse(jsonIn);
    
    return {
        name: data.Name,
        id: data.PersonalIdentifier
    };
}