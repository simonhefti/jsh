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

  /** get day of year (1 for Jan first) */
  function dayofyear(date) {

    var jd1 = julianday(new Date(date.getFullYear(), 0, 1), { includeTime: false });
    var jd2 = julianday(date, { includeTime: false });
    // console.log(new Date(date.getFullYear(), 0, 1), jd1,jd2);
    return jd2 - jd1 + 1;
  }


  /** calculate julian day for given date */
  function julianday(date, options = {}) {
    if (isEmpty(date)) {
      return 0;
    }
    var includeTime = true;
    if (!isEmpty(options)) {
      if (!isEmpty(options.includeTime)) {
        includeTime = options.includeTime;
      }
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

    if (includeTime) {
      res += (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds()) / 24 / 3600;
    }


    return res;
    // return [res, year, mm, id, jy, jm, ja];
  }


  // convert julian day number to date (after Numerical Recipies)

  function fromJulianDay(julianday, options = {}) {
    var ja = 0,
      jalpha = 0,
      jb = 0,
      jc = 0,
      jd = 0,
      je = 0;

    var includeTime = true;
    if (!isEmpty(options)) {
      if (!isEmpty(options.includeTime)) {
        includeTime = options.includeTime;
      }
    }
    // console.log("options: ", options, " includeTime", includeTime);

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
    // console.log("year:" , year, " mm: ", mm, " day:", day);

    var res = new Date(year, mm - 1, day, 0, 0, 0, 0);

    if (includeTime) {
      var hr = Math.floor(fraction / 3600);
      fraction -= hr * 3600;
      var min = Math.floor(fraction / 60);
      var sec = Math.round(fraction - min * 60);

      // console.log("year:" , year, " hr: ", hr, " min:", min, " sec:", sec);

      res = new Date(year, mm - 1, day, hr, min, sec, 0);
    }
    return res;
  }

  /** [linear algebra] calculate norm of vector */
  function norm(v) {
    var norm = 0.0;
    for (var i = 0; i < v.length; i++) {
      norm += v[i] * v[i];
    }
    norm = Math.sqrt(norm);
    return norm;
  }
  /** [linear algebra] calculate dot product of 2 vectors */
  function dot(v1, v2) {
    var res = 0.0;
    for (var i = 0; i < v1.length; i++) {
      res += v1[i] * v2[i];
    }
    return res;
  }
  /** [linear algebra] calculate angle [rad] between 2 vectors */
  function angle(v1, v2) {
    var res = cosinedistance(v1, v2);
    res = Math.acos(res);
    return res;
  }
  /** 1 if vectors align (angle is 0), 0 if vectors are perpendicular (angle 90 deg) */
  function cosinedistance(v1, v2) {
    var res = 0.0;
    // theta <- acos( sum(a*b) / ( sqrt(sum(a * a)) * sqrt(sum(b * b)) ) )
    var norm1 = norm(v1);
    var norm2 = norm(v2);
    var d = dot(v1, v2);
    res = d / norm1 / norm2;
    return res;
  }

  exports.angle = angle;
  exports.cosinedistance = cosinedistance;
  exports.dayofyear = dayofyear;
  exports.dot = dot;
  exports.fromJulianDay = fromJulianDay;
  exports.isEmpty = isEmpty;
  exports.julianday = julianday;
  exports.norm = norm;
  exports.unique = unique;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
