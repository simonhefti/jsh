(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.jsh = {}));
}(this, (function (exports) { 'use strict';

  const IGREG2 = 2299161;
  const IGREG1 = (15 + 31 * (10 + 12 * 1582));

  /** helper, find unique entries in array */
  function unique(a) {
    return a.filter((v, i, a) => a.indexOf(v) === i);
  }

  /** test if objects is undefined, null, or 0 length, or full of empty values */
  function isEmpty(val) {
    if (val === undefined) return true;
    if (val === null) return true;
    if (val.length <= 0) return true;
    if (Array.isArray(val)) {
      var cnt = 0;
      val.forEach(el => {
        if (isEmpty(el)) cnt++;
      });
      if (cnt === val.length) return true;
    }
    return false;
  }

  /** calculate julian day for given date */
  function julianday(date) {
    if (isEmpty(date)) {
      return 0;
    }
    var res = 0,
      ja = 0,
      jy = 0,
      jm = 0;

    var year = date.getFullYear();

    jy = year;

    if (jy < 0) ++jy;
    var mm = date.getMonth() + 1;
    if (mm > 2) {
      jm = mm + 1;
    } else {
      --jy;
      jm = mm + 13;
    }

    var id = date.getDate();
    res = Math.floor(365.25 * jy) + Math.floor(30.6001 * jm) + id + 1720995;
    if (id + 31 * (mm + 12 * year) >= IGREG1) {
      ja = Math.floor(0.01 * jy);
      res += 2 - ja + Math.floor(0.25 * ja);
    }

    res += (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 24 / 3600;

    return res;
    // return [res, year, mm, id, jy, jm, ja];
  }


  // convert julian day number to date (after Numerical Recipies)

  function fromJulianDay(julianday) {
    var ja = 0,
      jalpha = 0,
      jb = 0,
      jc = 0,
      jd = 0,
      je = 0;

    var fraction = (julianday - Math.floor(julianday)) * 24 * 3600;

    if (julianday >= IGREG2) {
      jalpha = Math.floor((julianday - 1867216 - 0.25) / 36524.25);
      ja = julianday + 1 + jalpha - Math.floor(0.25 * jalpha);
    } else {
      ja = jd;
    }

    jb = ja + 1524;
    jc = Math.floor(6680.0 + (jb - 2439870 - 122.1) / 365.25);
    jd = Math.floor(365 * jc + 0.25 * jc);
    je = Math.floor((jb - jd) / 30.6001);
    var day = jb - jd - Math.floor(30.6001 * je);
    var mm = je - 1;
    if (mm > 12) mm -= 12;
    var year = jc - 4715;
    if (mm > 2) --year;
    if (year <= 0) --year;

    // console.log("day: " + day);

    var hr = Math.floor(fraction / 3600);
    fraction -= hr * 3600;
    var min = Math.floor(fraction / 60);
    var sec = Math.round(fraction - min * 60);

    // console.log("hr: ", hr, " min:", min, " sec:", sec);

    var res = new Date(year, mm - 1, day, hr, min, sec, 0);

    return res;

    //return [res, jalpha, ja, jb, jc, jd, je, day, mm, year];
  }

  exports.fromJulianDay = fromJulianDay;
  exports.isEmpty = isEmpty;
  exports.julianday = julianday;
  exports.unique = unique;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
