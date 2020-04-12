const jsh = require('../src/jsh');

test('day of year', () => {
    expect(jsh.dayofyear(new Date(2020,0,1))).toBe(1);
    expect(jsh.dayofyear(new Date(2020,0,30))).toBe(30);
    expect(jsh.dayofyear(new Date(2020,1,1))).toBe(32);
});


test('julian day 1.1.2020', () => {

    var o = {includeTime: false};

    expect(jsh.julianday(new Date(2020,0,1,0,0,0,0))).toBe(2458850.0);
    expect(jsh.julianday(new Date(2020,0,1,0,0,0,0), o)).toBe(2458850.0);    
    expect(jsh.julianday(new Date(2020,0,1,2,3,4,5), o)).toBe(2458850.0);    
});

test('from 2458850 to 1.1.2020', () => {

    var o = {includeTime: false};

    var d1 = jsh.fromJulianDay(2458850);
    expect(d1.getFullYear()).toBe(2020);
    var d2 = jsh.fromJulianDay(2458850.33);
    expect(d2.getFullYear()).toBe(2020);
    var d3 = jsh.fromJulianDay(2458850.33, o);
    expect(d3.getFullYear()).toBe(2020);
});


test('julian day roundtrip', () => {

    var d = new Date();
    var jd = jsh.julianday(d);
    var d2 = jsh.fromJulianDay(jd);

    // console.log(jd);
    // console.log(d);
    // console.log(d2);

    expect(d2.getFullYear()).toBe(d.getFullYear());
    expect(d2.getMonth()).toBe(d.getMonth());
    expect(d2.getDay()).toBe(d.getDay());
    expect(d2.getHours()).toBe(d.getHours());
    expect(d2.getMinutes()).toBe(d.getMinutes());
    expect(d2.getSeconds()).toBe(d.getSeconds());

    var o = {includeTime: false};

    for( var i = 0; i < 20; i++) {
        d = new Date();
        var d3 = jsh.fromJulianDay(jsh.julianday(d));
        expect(d3.getSeconds()).toBe(d.getSeconds());

        d3 = jsh.fromJulianDay(jsh.julianday(d, o), o);
        expect(d3.getFullYear()).toBe(d.getFullYear());
        expect(d3.getMonth()).toBe(d.getMonth());
        expect(d3.getDay()).toBe(d.getDay());
        expect(d3.getHours()).toBe(0);
        expect(d3.getMinutes()).toBe(0);
        expect(d3.getSeconds()).toBe(0);
    }

});

test('cosine distance', () => {
    expect(jsh.cosinedistance([0,1],[0,1])).toBe(1);
    expect(jsh.cosinedistance([0,1],[1,0])).toBe(0);
});
