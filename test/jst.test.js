const jsh = require('../src/jsh');

test('julian day 1.1.2020', () => {
    expect(jsh.julianday(new Date(2020,0,1,0,0,0,0))).toBe(2458850.0);
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

    for( var i = 0; i < 10; i++) {
        d = new Date();
        var d3 = jsh.fromJulianDay(jsh.julianday(d));
        expect(d3.getSeconds()).toBe(d.getSeconds());
    }

});

test('cosine distance', () => {
    expect(jsh.cosinedistance([0,1],[0,1])).toBe(1);
    expect(jsh.cosinedistance([0,1],[1,0])).toBe(0);
});
