// First argument to "describe" is the name of this group of tests. In reports generated
// by Chutzpah, the description of each individual test is appended to this name. That is,
// each report will read like "normalizeData rejects null." When a test fails, then, we know
// exactly which method was being tested and how it was being tested.

describe("normalizeData", function () {
    // First argument to "it" is the name of the specific test
    it("accepts golden path data", function () {
        // Use the unit being tested as necessary
        var json = '{"Name": "Maria", "PersonalIdentifier": 2111858}';
        var norm = normalizeData(json);

        // Check the results; "expect" is a Jasmine method.
        expect(norm.name).toEqual("Maria");
        expect(norm.id).toEqual(2111858);
    });
    
    // Challenge JSON.parse to fail with invalid JSON or other common attack vectors
    it('rejects null', function () {
        var json = null;
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    it('rejects empty string', function () {
        var json = '';
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    it('rejects non-JSON string', function () {
        var json = 'blahblahblah';
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    it('rejects bad JSON 1', function () {
        var json = '{{}';
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    it('rejects bad JSON 2', function () {
        var json = '{{[]}}}';
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    it('rejects injected HTML/JavaScript', function () {
        var json = 'document.location="malware.site.com"';
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    it('rejects injected SQL', function () {
        var json = 'drop database users';
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    // 3. Challenge assumptions about the JSON structure
    it('accepts Name only, id defaults', function () {
        var json = '{"Name": "Maria"}';
        var norm = normalizeData(json);
        expect(norm.name).toEqual("Maria");
        expect(norm.id).toEqual(0); //Default
    });

    it('accepts PersonalIdentifier only, name defaults', function () {
        var json = '{"PersonalIdentifier": 2111858}';
        var norm = normalizeData(json);
        expect(norm.name).toEqual("default"); //Default
        expect(norm.id).toEqual(2111858);
    });

    it('defaults with empty JSON', function () {
        var json = '{}';
        var norm = normalizeData(json);
        expect(norm.name).toEqual("default"); //Default
        expect(norm.id).toEqual(0); //Default
    });

    it('defaults with unknown fields, differing by case', function () {
        var json = '{"name": "Maria", "personalIdentifier": 2111858}';
        var norm = normalizeData(json);
        expect(norm.name).toEqual("default"); //Default
        expect(norm.id).toEqual(0); //Default
    });

    it('defaults with unknown fields, similar properties', function () {
        var json = '{"nm": "Maria", "pid": 2111858}';
        var norm = normalizeData(json);
        expect(norm.name).toEqual("default"); //Default
        expect(norm.id).toEqual(0); //Default
    });

    it('ignores extra fields', function () {
        var json = '{"Name": "Maria", "PersonalIdentifier": 2111858, "Other1": 123, "Other2": "foobar"}';
        var norm = normalizeData(json);
        expect(norm.name).toEqual("Maria");
        expect(norm.id).toEqual(2111858);
    });

    // 4. Variations on data types

    it('accepts string PersonalIdentifier', function () {
        var json = '{"Name": "Maria", "PersonalIdentifier": "2111858"}';
        var norm = normalizeData(json);
        expect(norm.name).toEqual("Maria");
        expect(norm.id).toEqual(2111858);
    });

    it('rejects non-numerical string PersonalIdentifier', function () {
        var json = "{\"Name\": \"Maria\", \"PersonalIdentifier\": \"AA2111858\"}";
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    it('rejects negative PersonalIdentifier', function () {
        var json = '{"Name": "Maria", "PersonalIdentifier": -1}';
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    it('rejects excessively large integer PersonalIdentifier', function () {
        var json = '{"Name": "Maria", "PersonalIdentifier": 123456789123456789123456789123456789}';
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    it('accepts max integer PersonalIdentifier', function () {
        var json = '{"Name": "Maria", "PersonalIdentifier": 9999999999}';
        var norm = normalizeData(json);
        expect(norm.name).toEqual("Maria");
        expect(norm.id).toEqual(9999999999);
    });

    it('rejects max plus one integer PersonalIdentifier', function () {
        var json = '{"Name": "Maria", "PersonalIdentifier": 10000000000}';
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    it('truncates excessively long Name', function () {
        //Create a string longer than 255 characters
        var name = "";
        for (var i = 0; i < 30; i++) {
            name += "aaaaaaaaaa" + i;
        }

        var json = '{"Name": "' + name + '", "PersonalIdentifier": 2111858}';
        var norm = normalizeData(json);
        expect(norm.name).toEqual(name.substring(0, 255));
        expect(norm.name.length).toEqual(255);
        expect(norm.id).toEqual(2111858);
    });

    it('rejects integer Name', function () {
        var json = '{"Name": 12345, "PersonalIdentifier": 2111858}';
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    it('rejects object Name', function () {
        var json = '{"Name": {"First": "Maria"}, "PersonalIdentifier": 2111858}';
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    it('rejects object PersonalIdentifier', function () {
        var json = '{"Name": "Maria", "PersonalIdentifier": {"id": 2111858}}';
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    it('rejects object Name and PersonalIdentifier', function () {
        var json = '{"Name": {"First": "Maria"}, "PersonalIdentifier": {"id": 2111858}}';
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    it('rejects array Name', function () {
        var json = '{"Name": ["Maria"], "PersonalIdentifier": 2111858}';
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    it('rejects array PersonalIdentifier', function () {
        var json = '{"Name": "Maria", "PersonalIdentifier": [2111858]}';
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    it('rejects array Name and PersonalIdentifier', function () {
        var json = '{"Name": ["Maria"], "PersonalIdentifier": [2111858]}';
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

    it('accepts leading zeros in string PersonalIdentifier', function () {
        var json = '{"Name": "Maria", "PersonalIdentifier": "002111858"}';
        var norm = normalizeData(json);
        expect(norm.name).toEqual("Maria");
        expect(norm.id).toEqual(2111858);
    });

    it('rejects leading zeros in integer PersonalIdentifier', function () {
        var json = '{"Name": "Maria", "PersonalIdentifier": 002111858}';
        var norm = normalizeData(json);
        expect(norm).toEqual(null);
    });

});





/*

// Raw data for test cases

// 1. Golden path
'{"Name": "Maria", "PersonalIdentifier": 2111858}'

// 2. Challenge JSON.parse to fail with invalid JSON or other common attack vectors
null
''
'blahblahblah'
'{{}'
'{{[]}}}'
'document.location="malware.site.com"'
'drop database users'

// 3. Challenge assumptions about the JSON structure

// Omit expected fields
'{"Name": "Maria"}'
'{"PersonalIdentifier": 2111858}'
'{}'
'{"name": "Maria", "personalIdentifier": 2111858}'
'{"nm": "Maria", "pid": 2111858}'

// Add extra fields
'{"Name": "Maria", "PersonalIdentifier": 2111858, "Other1": 123, "Other2": "foobar"}'

// Variations on data types
'{"Name": "Maria", "PersonalIdentifier": "2111858"}'
'{"Name": "Maria", "PersonalIdentifier": "AA2111858"}'
'{"Name": "Maria", "PersonalIdentifier": -1}'
'{"Name": "Maria", "PersonalIdentifier": 123456789123456789123456789123456789}'
'{"Name": "Maria", "PersonalIdentifier": 9999999999}'
'{"Name": "Maria", "PersonalIdentifier": 10000000000}'
'{"Name": <long generated string>, "PersonalIdentifier": 2111858}'
'{"Name": 12345, "PersonalIdentifier": 2111858}'
'{"Name": {"First": "Maria"}, "PersonalIdentifier": 2111858}'
'{"Name": "Maria", "PersonalIdentifier": {"id": 2111858}}'
'{"Name": {"First": "Maria"}, "PersonalIdentifier": {"id": 2111858}}'
'{"Name": ["Maria"], "PersonalIdentifier": 2111858}'
'{"Name": "Maria", "PersonalIdentifier": [2111858]}'
'{"Name": ["Maria"], "PersonalIdentifier": [2111858]}'

// ID as a string can contain leading zeros
'{"Name": "Maria", "PersonalIdentifier": "002111858"}'

*/