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

let spaceSimilarity = (p1, p2) => {
    let len1 = Math.sqrt(p1[0] * p1[0] + p1[1] * p1[1]);
    let len2 = Math.sqrt(p2[0] * p2[0] + p2[1] * p2[1]);

    return getRate(len1, len2) * cosineSimilarity(p1, p2);
};

/**
 * cosine similarity [-1, 1]
 */
let cosineSimilarity = ([x1, y1], [x2, y2]) => {
    if (x1 === x2 && y1 === y2) return 1;
    let dis = Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2));
    if (dis === 0) return 1;
    let cross = x1 * x2 + y1 * y2;

    return shrink(cross / dis, -1, 1, 0, 2);
};

let shrink = (x, start, end, newStart, times) => {
    return newStart + (x - start) / times;
};

module.exports = {
    boolToNum,
    matchList,
    getRate,
    calColorSimilarity,
    spaceSimilarity
};
