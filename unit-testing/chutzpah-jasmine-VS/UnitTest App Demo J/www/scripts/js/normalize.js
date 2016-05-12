/** @description Converts JSON data that may contain Name and PersonalIdentifier 
 *    properties to an object with the properties name (string) and id (positive 
 *    integer up to 9999999999.
 * @param {string} jsonIn The JSON data to normalize.
 * @return {object} An object with name (string) and id (integer) properties,
 *    defaulting to "default" and 0, or null if the JSON is null or invalid.
 */

function normalizeData(jsonIn) {    
    //// [Block 1]        
    //data = JSON.parse(jsonIn);
    //return {
    //    name: data.Name,
    //    id: Number(data.PersonalIdentifier)
    //};
    
    // [Block 2]    

    if (jsonIn == null) {
        return null;
    }
    
    var data = null;

    // Return null for any invalid JSON
    try {
        data = JSON.parse(jsonIn);
    }
    catch (err) {
        return null;
    }
    
    
    //// [Comment out when uncommenting Block 3]
    //var name = data.Name;
    //var id = 0 + data.PersonalIdentifier  // Make sure this is an integer
   
    
    // [Block 3]    

    // Assign defaults
    var name = "default";
    var id = 0;

    switch (typeof data.Name) {
        case 'undefined':
            // Use default
            break;

        case 'string':
            // [Block 3]
            //name = data.Name;

            //[Block 4]
            // Truncate if necessary
            name = data.Name.substring(0, 255);
            break;

        default:
            // rejects integer or any other data type
            return null;
    }    
    
    switch (typeof data.PersonalIdentifier) {
        case 'undefined':
            // Use default
            break;

        case 'string':
            id = Number(data.PersonalIdentifier);

            if (isNaN(id)) {
                return null;
            }
            break;

        case 'number':
            // [Block 4]
            if (data.PersonalIdentifier < 0 || data.PersonalIdentifier > 9999999999) {
                return null;
            }

            // [Block 3]
            id = data.PersonalIdentifier;
            break;

        default:
            return null;
    }    
      
    // [Block 2, 3, 4]
 
    return {
        name: name,        
        id: id 
    };        
}
