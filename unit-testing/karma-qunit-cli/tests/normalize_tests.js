// Name the testing module for QUnit
QUnit.module("normalizeData function");

// The "test" method called here is defined by the testing framework, in this case
// QUnit. The first argument is the name/description of the test that will appear 
// in test reports. The second argument is the function that executes the test, in
// this case calling the normalizeData function with a certain piece of test data.

test('accepts golden path data', function () {
    var json = '{"Name": "Maria", "PersonalIdentifier": 2111858}';
    var norm = normalizeData(json);
    equal(norm.name, "Maria");
    equal(norm.id, 2111858);
});