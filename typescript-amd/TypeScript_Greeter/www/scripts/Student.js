define(["require", "exports"], function (require, exports) {
    var Student = (function () {
        function Student(firstname, middleinitial, lastname, latitude) {
            this.firstname = firstname;
            this.middleinitial = middleinitial;
            this.lastname = lastname;
            this.latitude = latitude;
            this.fullname = firstname + " " + middleinitial + " " + lastname;
        }
        return Student;
    })();
    return Student;
});
//# sourceMappingURL=Student.js.map