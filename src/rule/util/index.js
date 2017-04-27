'use strict';

let onecolor = require('onecolor');
let {
    YUVSimilarity
} = require('color-similarity');

let {
    union, interset
} = require('bolzano');

let boolToNum = (boolV) => {
    if (boolV) {
        return 1;
    } else {
        return 0;
    }
};

/**
 * interset / union
 */
let matchList = (list1, list2) => {
    if (!list1.length && !list2.length) return 1;
    let set1 = interset(list1, list2);
    let set2 = union(list1, list2);
    return set1.length / set2.length;
};

let getRate = (t1, t2) => {
    if (t1 === 0 && t2 === 0) return 1;
    return 1 - Math.abs(t1 - t2) / Math.max(t1, t2);
};

let calColorSimilarity = (color1, color2) => {
    color1 = onecolor(color1);
    color2 = onecolor(color2);

    let alphaOffset = color1.alpha() - color2.alpha();
    let alphaSimilarity = 1 - (Math.sqrt(alphaOffset * alphaOffset) / 1);

    return alphaSimilarity * YUVSimilarity([
        color1.red() * 255,
        color1.green() * 255,
        color1.blue() * 255
    ], [
        color2.red() * 255,
        color2.green() * 255,
        color2.blue() * 255
    ]);
};

module.exports = {
    boolToNum,
    matchList,
    getRate,
    calColorSimilarity
};
